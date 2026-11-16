import {elements} from './elements.js';
import {atomicMass,categoryInfo,electronShells,electronConfig,factsFor,reactionExamples,locationFor} from './chemistry.js';
import {drawOrbitalDiagram,validateOrbitalCount,electronDisplay} from './orbital-diagram.js';
import {MaterialViz,materialInfo} from './material-viz.js';
import {initAtomLab} from './atom-lab.js';
import {initMoleLab} from './mole-lab.js';
import {initMotion} from './motion.js';
import './atlas.css';
import './atlas-detail.css';
import './neon-theme.css';
import './neon-enhancements.css';
import './final-polish.css';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const symbol=new URLSearchParams(location.search).get('symbol')||'Ni';
const el=elements.find(e=>e.symbol.toLowerCase()===symbol.toLowerCase())||elements[27];
const facts=factsFor(el),material=materialInfo(el),shells=electronShells(el),reaction=reactionExamples[el.symbol];
const previous=elements[(el.number+116)%118],next=elements[el.number%118];
const isF=['lanthanide','actinide'].includes(el.category)&&!['La','Ac'].includes(el.symbol);
const classLabel=categoryInfo[el.category].name;
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
const info=[
  ['Phân loại',categoryInfo[el.category].description],
  ['Cấu trúc hạt','Nguyên tử trung hòa của '+el.name+' có '+el.number+' proton trong hạt nhân và '+el.number+' electron xung quanh. Số neutron phụ thuộc đồng vị cụ thể.'],
  ['Vị trí trong bảng','Thuộc chu kỳ '+el.period+', có '+shells.length+' lớp electron đang được sử dụng. '+(isF?'Nguyên tố thuộc dãy f được đặt riêng dưới bảng tuần hoàn.':'Thuộc nhóm '+el.group+' của bảng tuần hoàn.')],
  ['Lớp electron ngoài cùng','Trong cách phân bố electron đang dùng, lớp ngoài cùng có '+shells.at(-1)+' electron. Với kim loại chuyển tiếp và các nguyên tố nặng, không nên đồng nhất số này với mọi hóa trị.']
];
$('#element-knowledge').innerHTML=info.map(([title,text])=>'<article class="knowledge-item"><strong>'+esc(title)+'</strong><p>'+esc(text)+'</p></article>').join('');
$('#element-uses').innerHTML=(facts.uses&&facts.uses.length)?'<ul class="science-uses">'+facts.uses.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p class="science-empty">Chưa có ứng dụng riêng đã được biên soạn cho nguyên tố này.</p>';
if(reaction){
  $('#element-reaction').innerHTML='<div class="science-reaction"><span class="science-label">PHƯƠNG TRÌNH VÍ DỤ (LÝ THUYẾT)</span><div class="reaction-animated"><div class="reaction-beaker" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div><div><strong>'+esc(reaction.equation)+'</strong><p>'+esc(reaction.note)+'</p></div></div>'+
    (reaction.oxidation&&reaction.reduction?'<div class="redox-equations"><div><small>QUÁ TRÌNH OXI HÓA</small><b>'+esc(reaction.oxidation)+'</b></div><div><small>QUÁ TRÌNH KHỬ</small><b>'+esc(reaction.reduction)+'</b></div></div>':'')+'</div>';
}
for(const [id,e,caption,arrow] of [['element-previous',previous,'NGUYÊN TỐ TRƯỚC','←'],['element-next',next,'NGUYÊN TỐ TIẾP','→']]){
  const node=$('#'+id);node.href=locationFor(e);
  node.innerHTML='<small>'+caption+'</small><strong>'+arrow+' '+esc(e.name)+' <em>'+e.symbol+'</em></strong>';
}
document.title=el.name+' ('+el.symbol+') — Atlas Nguyên Tố';
if(!validateOrbitalCount(el))console.warn('Cần kiểm tra cấu hình electron:',el.symbol);

initAtomLab(el);
initMoleLab(el);
try {new MaterialViz($('#atlas-material')).setElement(el);} catch(e) {
  console.warn('Material 3D unavailable',e);
  $('#atlas-material').replaceWith(document.createTextNode('Không thể tải mẫu vật 3D. Vui lòng đọc phần mô tả.'));
}

initMotion();
