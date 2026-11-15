import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { elements } from './elements.js';
import { atomicMass, categoryInfo, groupNames, periodNotes, elementFacts, reactionExamples, electronShells, electronConfig, groupElements, periodElements, numericMass, locationFor, factsFor } from './chemistry.js';
import './explorer.css';

const $=(q,scope=document)=>scope.querySelector(q);
const esc=value=>String(value??'').replace(/[&<>"']/g,letter=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[letter]));
const params=new URLSearchParams(location.search);
const page=document.body.dataset.page;
const app=$('#explorer-app');
const numberFormat=new Intl.NumberFormat('vi-VN',{maximumFractionDigits:3});
const symbol=params.get('symbol')||'Ni';
const element=elements.find(e=>e.symbol.toLowerCase()===symbol.toLowerCase())||elements[27];
const groupNumber=Math.max(1,Math.min(18,Number(params.get('n'))||10));
const periodNumber=Math.max(1,Math.min(7,Number(params.get('n'))||4));
const mark=(text='N°')=>'<span class="explorer-mark">'+esc(text)+'</span>';
const a=(href,text,cl='')=>'<a class="'+cl+'" href="'+href+'">'+text+'</a>';
const shellBadges=e=>electronShells(e).map((v,i)=>'<span class="shell-count"><i>'+['K','L','M','N','O','P','Q'][i]+'</i><b>'+v+'</b></span>').join('');
const detailCard=(e,i=0)=>{const cat=categoryInfo[e.category];return '<a class="roster-card" href="'+locationFor(e)+'" style="--atom-accent:'+cat.color+';animation-delay:'+Math.min(i*28,350)+'ms"><span class="roster-top"><b>'+String(e.number).padStart(3,'0')+'</b><span>↗</span></span><strong>'+e.symbol+'</strong><span class="roster-name">'+esc(e.name)+'</span><span class="roster-bottom">'+esc(atomicMass[e.symbol]||'—')+' u <i>·</i> '+esc(cat.name)+'</span></a>';};
const header=(current)=>'<header class="explorer-header"><a class="explorer-logo" href="./index.html">'+mark()+'<span>NGUYÊN TỐ<small>ATOMIC EXPLORER</small></span></a><nav class="explorer-global-nav" aria-label="Điều hướng"><a href="./index.html">Bảng tuần hoàn</a><a href="./group.html?n=10" class="'+(page==='group'?'selected':'')+'">Nhóm</a><a href="./period.html?n=4" class="'+(page==='period'?'selected':'')+'">Chu kỳ</a></nav><span class="header-descriptor">PHÒNG THÍ NGHIỆM SỐ <span class="live-indicator"></span></span></header>';
const footer=()=>'<footer class="explorer-footer"><span>NGUYÊN TỐ <b>/</b> KHÁM PHÁ HÓA HỌC</span><span>Dữ liệu giáo dục · Mô hình nguyên tử chỉ mang tính minh họa</span><a href="./index.html">Về bảng tuần hoàn ↑</a></footer>';

function renderCollection(kind){
 const isGroup=kind==='group',n=isGroup?groupNumber:periodNumber, members=isGroup?groupElements(n):periodElements(n);
 const label=isGroup?'NHÓM':'CHU KỲ',name=isGroup?groupNames[n]:'Chu kỳ '+n;
 const note=isGroup?'Cột thứ '+n+' trong bảng tuần hoàn. Các nguyên tố trong cùng nhóm thường có nét tương đồng về cấu hình electron hóa trị, nhưng tính chất thực tế có thể khác biệt.':periodNotes[n];
 const rosterHtml=members.map(detailCard).join('');
 app.innerHTML=header()+'<main class="explorer-main collection-page"><div class="explorer-breadcrumb"><a href="./index.html">Bảng tuần hoàn</a><span>/</span><span>'+label.toLowerCase()+' '+n+'</span></div>'+
 '<section class="collection-hero"><div class="collection-hero-main"><div class="eyeline"><span class="eyeline-line"></span> CẤU TRÚC BẢNG TUẦN HOÀN — '+label+' '+String(n).padStart(2,'0')+'</div><h1>Khám phá <em>'+ (isGroup?'nhóm':'chu kỳ') +'</em><br><span>'+String(n).padStart(2,'0')+'</span><span class="title-period">.</span></h1><p>'+esc(note)+'</p><div class="collection-actions">'+a('./index.html','← Bảng tuần hoàn','subtle-link')+a((isGroup?'./period.html?n=4':'./group.html?n=10'),isGroup?'Xem theo chu kỳ ↗':'Xem theo nhóm ↗','subtle-link')+'</div></div><div class="collection-feature"><div class="large-serial">'+String(n).padStart(2,'0')+'</div><div class="feature-caption">ELEMENT INDEX <span>↗</span></div><div class="feature-bottom"><strong>'+members.length+'</strong><span>nguyên tố thuộc<br>'+label.toLowerCase()+' này</span></div></div></section>'+
 '<section class="collection-switcher"><div><span class="panel-label">ĐIỀU HƯỚNG NHANH</span><h2>Chọn '+(isGroup?'nhóm':'chu kỳ')+' khác</h2></div><div class="number-tabs" role="navigation" aria-label="Chọn '+(isGroup?'nhóm':'chu kỳ')+'">'+Array.from({length:isGroup?18:7},(_,i)=>'<a class="'+(n===i+1?'current':'')+'" href="./'+kind+'.html?n='+(i+1)+'">'+String(i+1).padStart(2,'0')+'</a>').join('')+'</div></section>'+
 '<section class="roster-section"><div class="roster-heading"><div><span class="panel-label">DANH SÁCH NGUYÊN TỐ</span><h2>'+esc(name)+'</h2><p>Chọn một nguyên tố để xem cấu hình electron, mô hình 3D và các thông tin liên quan.</p></div><span class="count-pill">'+members.length+' nguyên tố <span>↘</span></span></div><div class="roster-grid">'+rosterHtml+'</div></section>'+
 '<section class="collection-explain"><span class="abstract-orbit">◉</span><div><span class="panel-label">GÓC KIẾN THỨC</span><h2>'+ (isGroup?'Các nguyên tố cùng nhóm có điểm chung gì?':'Chu kỳ cho biết điều gì?') +'</h2></div><p>'+(isGroup?'Trong bảng tuần hoàn, nhóm là cột dọc. Các nguyên tố cùng nhóm thường có đặc điểm electron hóa trị tương tự. Họ Lantan và Actini được trình bày thành hai dãy riêng; phân nhóm 3 còn có nhiều cách biểu diễn trong tài liệu hóa học.':'Trong bảng tuần hoàn, chu kỳ là hàng ngang. Số thứ tự chu kỳ thường trùng với số lớp electron được chiếm ở trạng thái cơ bản. Tính chất thay đổi dần khi đi từ trái sang phải.')+'</p></section></main>'+footer();
 document.title=(isGroup?'Nhóm ':'Chu kỳ ')+n+' | Nguyên Tố 3D';
}

function metric(label,value,hint=''){return '<div class="metric"><span>'+label+'</span><strong>'+esc(value??'Chưa có dữ liệu')+'</strong>'+(hint?'<small>'+esc(hint)+'</small>':'')+'</div>';}
function sectionHead(index,title,desc=''){return '<div class="section-heading-wide"><span class="section-index">'+index+'</span><div><h2>'+title+'</h2>'+(desc?'<p>'+desc+'</p>':'')+'</div></div>';}
function renderElement(){
 const e=element,facts=factsFor(e),cat=categoryInfo[e.category];
 const shells=electronShells(e),previous=elements[(e.number+116)%118],next=elements[e.number%118];
 const mass=numericMass(e); const reaction=reactionExamples[e.symbol];
 app.style.setProperty('--element-accent',cat.color);
 app.innerHTML=header()+'<main class="explorer-main detail-page"><div class="explorer-breadcrumb"><a href="./index.html">Bảng tuần hoàn</a><span>/</span><a href="./period.html?n='+e.period+'">Chu kỳ '+e.period+'</a><span>/</span><span>'+esc(e.name)+'</span></div>'+
 '<section class="element-hero"><div class="element-hero-left"><div class="hero-stamp"><span class="stamp-square"></span> HỒ SƠ NGUYÊN TỐ / '+String(e.number).padStart(3,'0')+'</div><div class="element-title-row"><div class="element-major-symbol">'+e.symbol+'<span class="major-atomic-number">'+String(e.number).padStart(3,'0')+'</span></div><div class="element-title-text"><p class="name-overline">ELEMENT PROFILE — '+esc(facts.en).toUpperCase()+'</p><h1>'+esc(e.name)+'</h1><div class="element-english">'+esc(facts.en)+' <span>/</span> '+e.symbol+'</div></div></div><p class="hero-description">'+esc(facts.summary)+'</p><div class="element-tag-row"><a href="./group.html?n='+e.group+'">NHÓM '+e.group+' <span>↗</span></a><a href="./period.html?n='+e.period+'">CHU KỲ '+e.period+' <span>↗</span></a><span>'+esc(cat.name).toUpperCase()+'</span></div><div class="hero-bottom-nav"><a href="'+locationFor(previous)+'">← '+esc(previous.symbol)+'</a><span>KHÁM PHÁ 118 NGUYÊN TỐ</span><a href="'+locationFor(next)+'">'+esc(next.symbol)+' →</a></div></div><aside class="identity-card" style="--identity-color:'+cat.color+'"><span class="identity-top">ATOMIC IDENTITY / '+String(e.number).padStart(3,'0')+'</span><div class="identity-middle"><span>'+e.symbol+'</span><div class="identity-rings"><i></i><i></i><i></i></div></div><div class="identity-bottom"><div><strong>'+esc(e.name)+'</strong><small>'+esc(cat.name)+'</small></div><b>'+esc(atomicMass[e.symbol]||'—')+' <span>u</span></b></div></aside></section>'+
 '<section class="key-data"><div class="key-data-heading"><span class="panel-label">01 / DỮ LIỆU NỀN TẢNG</span><h2>Những con số<br><i>định nghĩa nguyên tố.</i></h2></div><div class="metrics-grid">'+metric('SỐ HIỆU NGUYÊN TỬ',e.number,'Số proton trong hạt nhân')+metric('NGUYÊN TỬ KHỐI',atomicMass[e.symbol]+' u','Giá trị tham khảo')+metric('CẤU HÌNH NGOÀI',shells.at(-1)+' electron','Lớp ngoài cùng')+metric('TRẠNG THÁI',facts.state,'Điều kiện thường')+metric('ĐỘ ÂM ĐIỆN',facts.electro||'—','Thang Pauling')+metric('KHỐI LƯỢNG RIÊNG',facts.density||'—')+metric('NHIỆT ĐỘ NÓNG CHẢY',facts.melting||'—')+metric('SỐ OXI HÓA',facts.oxidation||'—','Các giá trị thường gặp')+'</div></section>'+
 '<section class="atom-section"><div class="atom-section-copy">'+sectionHead('02','Bên trong nguyên tử','Tương tác với mô hình 3D để hình dung cấu trúc electron.')+'<div class="atomic-config"><span class="panel-label">CẤU HÌNH ELECTRON · TRẠNG THÁI CƠ BẢN</span><strong>'+esc(electronConfig(e))+'</strong><div class="shell-strip">'+shellBadges(e)+'</div></div><div class="atom-explainer"><span class="tiny-dot"></span><p><b>'+e.number+' proton và '+e.number+' electron</b> trong nguyên tử trung hòa. Phân bố theo lớp: '+shells.join(' – ')+'. Quỹ đạo hiển thị là mô hình minh họa Bohr, không phải quỹ đạo electron thực tế.</p></div></div><div class="atom-lab"><div class="lab-top"><span><i class="live-indicator"></i> ATOM VIEWPORT</span><div class="lab-mode" role="group" aria-label="Chế độ mô hình"><button class="active" data-mode="bohr">Bohr</button><button data-mode="cloud">Đám mây</button><button data-mode="core">Hạt nhân</button></div></div><div class="canvas-wrap"><canvas id="explorer-atom" aria-label="Mô hình nguyên tử 3D có thể kéo xoay"></canvas><div class="canvas-annotation">Z = '+e.number+'<br><span>'+esc(e.symbol)+' / '+shells.length+' LỚP</span></div><div class="canvas-guide">KÉO ĐỂ XOAY · LĂN CHUỘT ĐỂ ZOOM</div></div><div class="lab-bottom"><span>THREE.JS / REAL-TIME</span><div><button id="pause-atom" aria-label="Dừng hoặc tiếp tục chuyển động">Ⅱ Tạm dừng</button><button id="reset-atom" aria-label="Đặt lại góc nhìn">↺ Đặt lại</button></div></div></div></section>'+
 '<section class="matter-section">'+sectionHead('03','Từ nguyên tử đến vật chất','So sánh khối lượng của một mol nguyên tử giữa hai nguyên tố.')+'<div class="matter-grid"><div class="mole-feature"><span class="panel-label">MOLAR MASS / KHỐI LƯỢNG MOL</span><div class="mole-number">1 <span>mol</span> = <strong>'+ (mass!==null?esc(numberFormat.format(mass)):'—')+'</strong> <span>g</span></div><p>Một mol chứa xấp xỉ 6,022 × 10²³ hạt. Khối lượng mol theo số trị gần bằng nguyên tử khối, đơn vị g/mol.</p><div class="mole-tokens"><span>6,022 × 10²³ hạt</span><span>'+esc(e.symbol)+'</span><span>1 mol</span></div><div class="mole-visual"><div class="cube cube-one"><span>'+e.symbol+'</span></div><div class="cube cube-two"><span>6,022 × 10²³</span></div></div></div><div class="compare-feature"><div class="compare-top"><span class="panel-label">SO SÁNH KHỐI LƯỢNG</span><select id="compare-element" aria-label="Chọn nguyên tố để so sánh">'+elements.map(other=>'<option value="'+other.symbol+'" '+(other.symbol==='Cu'?'selected':'')+'>'+other.symbol+' · '+esc(other.name)+'</option>').join('')+'</select></div><div class="compare-masses"><div><span>01 / '+e.symbol+'</span><strong>'+ (mass!==null?numberFormat.format(mass):'—')+' <small>g/mol</small></strong><div class="mass-track"><i style="width:70%" id="mass-a"></i></div></div><div><span>02 / <b id="compare-symbol">Cu</b></span><strong id="compare-mass">63,546 <small>g/mol</small></strong><div class="mass-track"><i id="mass-b" style="width:80%"></i></div></div></div><div class="compare-conclusion" id="compare-conclusion"></div></div></div></section>'+
 '<section class="reaction-section">'+sectionHead('04','Phản ứng hóa học','Mô phỏng hạt mang tính trực quan, không phải mô phỏng tốc độ phản ứng thực tế.')+(reaction?'<div class="reaction-board"><div class="reaction-illustration"><div class="beaker"><div class="beaker-liquid"></div><div class="metal-pellet"></div>'+Array.from({length:15},(_,i)=>'<span class="bubble" style="--i:'+i+'"></span>').join('')+'</div><span class="illustration-tag">MÔ PHỎNG / HÓA HỌC</span></div><div class="reaction-copy"><span class="panel-label">PHƯƠNG TRÌNH THAM KHẢO</span><h3>'+esc(reaction.label)+'</h3><div class="reaction-equation">'+esc(reaction.equation)+'</div><div class="half-reactions"><div><small>QUÁ TRÌNH OXI HÓA</small><strong>'+esc(reaction.oxidation)+'</strong></div><div><small>QUÁ TRÌNH KHỬ</small><strong>'+esc(reaction.reduction)+'</strong></div></div><p>'+esc(reaction.note)+'</p><button id="replay-reaction" class="action-outline">↻ Xem lại minh họa</button></div></div>':'<div class="reaction-empty"><span>↗</span><div><h3>Chưa có phương trình minh họa riêng cho '+esc(e.name)+'.</h3><p>Chỉ hiển thị phương trình đã được biên soạn; không tự suy đoán phản ứng cho tất cả 118 nguyên tố.</p></div><a href="./element.html?symbol=Ni">Xem ví dụ với Ni →</a></div>')+'</section>'+
 '<section class="uses-section">'+sectionHead('05','Ứng dụng trong cuộc sống','Kết nối kiến thức hóa học với vật liệu, công nghệ và nghiên cứu.')+(facts.uses.length?'<div class="uses-grid">'+facts.uses.map((use,i)=>'<div class="use-card"><span>0'+(i+1)+' / ỨNG DỤNG</span><div class="use-icon">'+['✳','◇','↗'][i%3]+'</div><h3>'+esc(use)+'</h3><div class="use-arrow">→</div></div>').join('')+'</div>':'<div class="uses-empty">Ứng dụng chuyên biệt của nguyên tố này đang được bổ sung để bảo đảm độ chính xác.</div>')+'</section>'+
 '<section class="bottom-explore"><div><span class="panel-label">KHÁM PHÁ TIẾP</span><h2>118 nguyên tố.<br><i>Vô vàn điều để tìm hiểu.</i></h2></div><div class="bottom-buttons">'+a('./group.html?n='+e.group,'Nhóm '+e.group+' ↗','bottom-action')+a('./period.html?n='+e.period,'Chu kỳ '+e.period+' ↗','bottom-action')+a('./index.html','Xem bảng tuần hoàn →','bottom-action accent')+'</div></section></main>'+footer();
 document.title=e.name+' ('+e.symbol+') — Hồ sơ nguyên tố | Nguyên Tố 3D';
 initAtom(e,cat.color);
 initCompare(e);
 $('#replay-reaction')?.addEventListener('click',()=>{const board=$('.reaction-board');board.classList.remove('replaying');void board.offsetWidth;board.classList.add('replaying');});
}

function initCompare(e){
 const select=$('#compare-element'),first=numericMass(e);
 const update=()=>{
  const other=elements.find(el=>el.symbol===select.value),second=numericMass(other),max=Math.max(first||0,second||0,1);
  $('#compare-symbol').textContent=other.symbol;
  $('#compare-mass').innerHTML=(second===null?'—':numberFormat.format(second))+' <small>g/mol</small>';
  $('#mass-a').style.width=(first===null?0:Math.max(3,first/max*100))+'%';
  $('#mass-b').style.width=(second===null?0:Math.max(3,second/max*100))+'%';
  $('#compare-conclusion').textContent=(first===null||second===null)?'Một trong hai nguyên tố chưa có khối lượng nguyên tử chuẩn để so sánh.':first===second?'Hai nguyên tố đang được so sánh có cùng giá trị khối lượng mol.':'Với cùng số mol, '+(first>second?e.name:other.name)+' có khối lượng lớn hơn khoảng '+numberFormat.format(Math.max(first,second)/Math.min(first,second))+' lần.';
 };
 select.addEventListener('change',update);update();
}

function initAtom(e,accent){
 const canvas=$('#explorer-atom');if(!canvas)return;
 let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch(err){$('.canvas-wrap').classList.add('no-webgl');$('.canvas-guide').textContent='Trình duyệt không hỗ trợ WebGL';return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,100);
 camera.position.set(0,1.1,11);
 scene.add(new THREE.AmbientLight(0xc2d5ff,1.65));
 const lamp=new THREE.PointLight(0x9be9ff,65);lamp.position.set(3,4,5);scene.add(lamp);
 const rim=new THREE.PointLight(0xffb887,40);rim.position.set(-4,-2,-4);scene.add(rim);
 const controls=new OrbitControls(camera,canvas);
 controls.enableDamping=true;controls.dampingFactor=.065;controls.enablePan=false;controls.minDistance=5;controls.maxDistance=20;controls.autoRotate=true;controls.autoRotateSpeed=.48;
 const atom=new THREE.Group();scene.add(atom);
 const rings=new THREE.Group(),core=new THREE.Group(),cloud=new THREE.Group();atom.add(rings,core,cloud);
 const accentColor=new THREE.Color(accent),shells=electronShells(e);
 const count=Math.min(56,Math.max(12,e.number)), nproton=Math.round(count*.52);
 const ballGeo=new THREE.SphereGeometry(.145,14,14);
 for(let i=0;i<count;i++){
  const polar=Math.acos(1-2*(i+.5)/count),angle=Math.PI*(1+Math.sqrt(5))*i,r=.22+Math.sqrt(i/count)*.55;
  const sphere=new THREE.Mesh(ballGeo,new THREE.MeshStandardMaterial({color:i<nproton?0x72a9e9:0xf2a277,emissive:i<nproton?0x254a91:0x713c26,emissiveIntensity:.30,roughness:.32,metalness:.1}));
  sphere.position.set(Math.cos(angle)*Math.sin(polar)*r,Math.sin(angle)*Math.sin(polar)*r,Math.cos(polar)*r);core.add(sphere);
 }
 shells.forEach((num,s)=>{
  const radius=1.3+s*.46;
  const orbit=new THREE.Group();orbit.rotation.set(s*.45,s*.72,s*.31);
  const pathPoints=[];for(let j=0;j<=128;j++){const t=j/128*Math.PI*2;pathPoints.push(new THREE.Vector3(radius*Math.cos(t),radius*Math.sin(t),0));}
  const pathGeo=new THREE.BufferGeometry().setFromPoints(pathPoints);
  orbit.add(new THREE.Line(pathGeo,new THREE.LineBasicMaterial({color:accentColor,transparent:true,opacity:.52})));
  for(let j=0;j<num;j++){
   const t=j/num*2*Math.PI+s*.7;
   const dot=new THREE.Mesh(new THREE.SphereGeometry(.057,9,9),new THREE.MeshBasicMaterial({color:0xeaf7ff}));
   dot.position.set(radius*Math.cos(t),radius*Math.sin(t),0);orbit.add(dot);
  }
  orbit.userData.spin=(s%2?-.14:.14);rings.add(orbit);
 });
 const cloudGeo=new THREE.BufferGeometry(),cloudPositions=[];
 const nPoints=Math.min(1200,100+e.number*9);
 for(let i=0;i<nPoints;i++){const radius=1.2+Math.sqrt(Math.random())*Math.min(2.75,shells.length*.40+.8),t=Math.random()*2*Math.PI,u=Math.acos(2*Math.random()-1);cloudPositions.push(radius*Math.sin(u)*Math.cos(t),radius*Math.sin(u)*Math.sin(t),radius*Math.cos(u));}
 cloudGeo.setAttribute('position',new THREE.Float32BufferAttribute(cloudPositions,3));
 cloud.add(new THREE.Points(cloudGeo,new THREE.PointsMaterial({color:accentColor,size:.038,transparent:true,opacity:.72,depthWrite:false})));cloud.visible=false;
 let playing=true,mode='bohr',last=performance.now(),frame;
 const fit=()=>{const rect=canvas.getBoundingClientRect();if(rect.width===0||rect.height===0)return;renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();};
 const observer=new ResizeObserver(fit);observer.observe(canvas.parentElement);fit();
 const updateMode=(next)=>{mode=next;rings.visible=next==='bohr';cloud.visible=next==='cloud';core.scale.setScalar(next==='core'?1.7:1);camera.position.z=next==='core'?7:11;controls.update();document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===next);b.setAttribute('aria-pressed',String(b.dataset.mode===next));});};
 document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>updateMode(b.dataset.mode)));
 $('#pause-atom').addEventListener('click',ev=>{playing=!playing;controls.autoRotate=playing;ev.currentTarget.textContent=playing?'Ⅱ Tạm dừng':'▶ Tiếp tục';});
 $('#reset-atom').addEventListener('click',()=>{camera.position.set(0,1.1,mode==='core'?7:11);controls.target.set(0,0,0);controls.update();});
 const tick=(now)=>{frame=requestAnimationFrame(tick);const dt=Math.min(.05,(now-last)/1000);last=now;if(document.hidden)return;
  if(playing){rings.children.forEach(g=>g.rotation.z+=g.userData.spin*dt);cloud.rotation.y+=dt*.045;}
  controls.update();renderer.render(scene,camera);};
 frame=requestAnimationFrame(tick);
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect();controls.dispose();renderer.dispose();},{once:true});
}
if(page==='element')renderElement();
else if(page==='group'||page==='period')renderCollection(page);
else app.innerHTML=header()+'<main class="explorer-main"><h1>Không tìm thấy trang</h1>'+a('./index.html','Về bảng tuần hoàn')+'</main>'+footer();
