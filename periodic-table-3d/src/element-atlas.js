import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {elements} from './elements.js';
import {atomicMass,categoryInfo,electronShells,electronConfig,factsFor,reactionExamples,locationFor} from './chemistry.js';
import {drawOrbitalDiagram,validateOrbitalCount,electronDisplay} from './orbital-diagram.js';
import {MaterialViz,materialInfo} from './material-viz.js';
import {renderSiteNav} from './site-nav.js';
import {initTheme} from './theme.js';
import {initMotion} from './motion.js';
import './atlas.css';
import './atlas-detail.css';
import './neon-theme.css';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const symbol=new URLSearchParams(location.search).get('symbol')||'Ni';
const el=elements.find(e=>e.symbol.toLowerCase()===symbol.toLowerCase())||elements[27];
const facts=factsFor(el),material=materialInfo(el),shells=electronShells(el),reaction=reactionExamples[el.symbol];
const previous=elements[(el.number+116)%118],next=elements[el.number%118];
const isF=['lanthanide','actinide'].includes(el.category)&&!['La','Ac'].includes(el.symbol);
const classLabel=categoryInfo[el.category].name;
$('#site-header').outerHTML=renderSiteNav('table',{group:el.group,period:el.period});
initTheme();
const z=String(el.number).padStart(3,'0');
$('#element-numberline').textContent='HỒ SƠ NGUYÊN TỐ / '+z;
$('#element-z').textContent=el.number;
$('#element-big-z').textContent=z;
$('#element-counter').textContent='NGUYÊN TỐ '+z+' / 118';
$('#element-symbol').textContent=el.symbol;
$('#element-mass').textContent=(atomicMass[el.symbol]||'—')+' u';
$('#element-title').textContent=el.name;
$('#element-overline').textContent=(facts.en||el.name).toUpperCase()+' / '+classLabel.toUpperCase();
$('#element-summary').textContent=facts.summary;
$('#crumb-name').textContent=el.name;
$('#crumb-period').href='./period.html?n='+el.period;
$('#crumb-period').textContent='Chu kỳ '+el.period;
const groupLink=$('#link-group');
groupLink.href=isF?'./period.html?n='+el.period:'./group.html?n='+el.group;
groupLink.textContent=isF?'Dãy khối f ↗':'Nhóm '+el.group+' ↗';
$('#link-period').href='./period.html?n='+el.period;
$('#link-period').textContent='Chu kỳ '+el.period+' ↗';
const kFacts=[['SỐ HIỆU NGUYÊN TỬ',el.number],['NGUYÊN TỬ KHỐI',(atomicMass[el.symbol]||'—')+' u'],['PHÂN LOẠI',classLabel],['TRẠNG THÁI',facts.state]];
$('#quick-facts').innerHTML=kFacts.map(([k,v])=>'<div class="element-quick-fact"><span>'+esc(k)+'</span><strong>'+esc(v)+'</strong></div>').join('');
$('#electron-config').textContent=electronDisplay(el);
$('#electron-shells').innerHTML=shells.map((n,i)=>'<span><small>LỚP '+(i+1)+'</small><b>'+n+'e⁻</b></span>').join('');
$('#orbital-diagram').innerHTML=drawOrbitalDiagram(el);
$('#matter-state').textContent=facts.state.toUpperCase();
$('#matter-title').textContent=material.title;
$('#matter-description').textContent=material.description;
$('#matter-caution-title').textContent=material.speculative?'CHƯA CÓ MẪU VẬT VĨ MÔ ĐỂ QUAN SÁT':'MÔ HÌNH MINH HỌA';
const props=[
 ['Trạng thái ở điều kiện thường',facts.state],
 ['Khối lượng riêng',facts.density],
 ['Độ âm điện (Pauling)',facts.electro],
 ['Bán kính nguyên tử',facts.radius],
 ['Nhiệt độ nóng chảy',facts.melting],
 ['Nhiệt độ sôi',facts.boiling],
 ['Số oxi hóa thường gặp',facts.oxidation],
 ['Phát hiện',facts.discovery]
].filter(([,v],i)=>i===0||Boolean(v));
$('#property-list').innerHTML=props.map(([k,v])=>'<div class="science-property"><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('');
$('#element-uses').innerHTML=(facts.uses&&facts.uses.length)?'<ul class="science-uses">'+facts.uses.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p class="science-empty">Chưa có ứng dụng riêng đã được biên soạn cho nguyên tố này.</p>';
if(reaction){
  $('#element-reaction').innerHTML='<div class="science-reaction"><span class="science-label">PHƯƠNG TRÌNH VÍ DỤ (LÝ THUYẾT)</span><strong>'+esc(reaction.equation)+'</strong><p>'+esc(reaction.note)+'</p></div>';
}
for(const [id,e,caption,arrow] of [['element-previous',previous,'NGUYÊN TỐ TRƯỚC','←'],['element-next',next,'NGUYÊN TỐ TIẾP','→']]){
  const node=$('#'+id);node.href=locationFor(e);
  node.innerHTML='<small>'+caption+'</small><strong>'+arrow+' '+esc(e.name)+' <em>'+e.symbol+'</em></strong>';
}
document.title=el.name+' ('+el.symbol+') — Atlas Nguyên Tố';
if(!validateOrbitalCount(el))console.warn('Cần kiểm tra cấu hình electron:',el.symbol);

class AtomViewer {
  constructor(canvas,el){
    this.canvas=canvas;this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(43,1,.1,100);
    this.camera.position.set(0,1.2,11.8);
    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.55));this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.scene.add(new THREE.AmbientLight(0xffffff,1.6));
    const key=new THREE.PointLight(0xffead3,35);key.position.set(3,4,7);this.scene.add(key);
    this.root=new THREE.Group();this.scene.add(this.root);
    this.controls=new OrbitControls(this.camera,canvas);
    this.controls.enablePan=false;this.controls.enableDamping=true;this.controls.autoRotate=true;this.controls.autoRotateSpeed=.42;
    this.controls.minDistance=7;this.controls.maxDistance=19;
    const total=Math.min(el.number,42);
    for(let i=0;i<total;i++){
      const phi=i*2.399963,t=Math.acos(1-2*(i+.5)/total),r=.3+.42*Math.sqrt(i/total);
      const ball=new THREE.Mesh(new THREE.SphereGeometry(.14,9,9),new THREE.MeshStandardMaterial({color:i%2?0x788693:0xc28b78,roughness:.47}));
      ball.position.set(Math.sin(t)*Math.cos(phi)*r,Math.sin(t)*Math.sin(phi)*r,Math.cos(t)*r);this.root.add(ball);
    }
    electronShells(el).forEach((n,i)=>{
      const r=1.4+i*.51;
      const orbit=new THREE.Group();orbit.rotation.set(i*.4,.3+i*.27,.2+i*.13);this.root.add(orbit);
      const line=new THREE.Mesh(new THREE.TorusGeometry(r,.009,5,90),new THREE.MeshBasicMaterial({color:0x9da4a5,transparent:true,opacity:.65}));
      orbit.add(line);
      for(let j=0;j<n;j++){
        const t=j*2*Math.PI/n;
        const dot=new THREE.Mesh(new THREE.SphereGeometry(.053,9,8),new THREE.MeshBasicMaterial({color:0xe4e0d7}));
        dot.position.set(Math.cos(t)*r,Math.sin(t)*r,0);orbit.add(dot);
      }
    });
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas.parentElement);
    this.resize();this.draw();
    window.addEventListener('pagehide',()=>{this.observer.disconnect();this.controls.dispose();this.renderer.dispose();},{once:true});
  }
  resize(){const r=this.canvas.getBoundingClientRect();if(!r.width||!r.height)return;this.renderer.setSize(r.width,r.height,false);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();}
  draw(){requestAnimationFrame(()=>this.draw());if(document.hidden)return;this.controls.update();this.renderer.render(this.scene,this.camera);}
}
try {new AtomViewer($('#atlas-atom'),el);} catch(e){console.warn('Atom 3D unavailable',e);$('#atlas-atom').replaceWith(document.createTextNode('Không thể tải WebGL. Cấu hình và sơ đồ orbital vẫn hoạt động.'));}
try {new MaterialViz($('#atlas-material')).setElement(el);} catch(e){console.warn('Material 3D unavailable',e);$('#atlas-material').replaceWith(document.createTextNode('Không thể tải mẫu vật 3D. Vui lòng đọc phần mô tả.'));}

initMotion();
