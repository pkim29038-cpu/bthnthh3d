import {elements} from './elements.js';
import {atomicMass,categoryInfo,groupNames,periodNotes,groupElements,periodElements,locationFor,factsFor} from './chemistry.js';
import {renderSiteNav} from './site-nav.js';
import {initTheme} from './theme.js';
import {initMotion} from './motion.js';
import {initQuiz} from './quiz.js';
import './atlas.css';
import './atlas-collection.css';
import './neon-theme.css';
import './neon-enhancements.css';
import './final-polish.css';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const group=document.body.dataset.page==='group';
const max=group?18:7;
const n=Math.max(1,Math.min(max,Math.floor(Number(new URLSearchParams(location.search).get('n'))||(group?10:4))));
const members=group?groupElements(n):periodElements(n);
const title=group?'Nhóm '+n:'Chu kỳ '+n;
const subtype=group?groupNames[n]||'Dãy nguyên tố':'Hàng ngang của bảng tuần hoàn';
const explanation=group?
  'Nhóm là cột đứng trong bảng tuần hoàn. Các nguyên tố cùng nhóm thường có nét tương tự về electron hóa trị và tính chất. Nhóm 3 có nhiều cách quy ước về sự tiếp nối của khối f.':
  periodNotes[n];
const palette=Object.fromEntries(Object.entries(categoryInfo).map(([key,meta])=>[key,meta.color]));
$('#site-header').outerHTML=renderSiteNav(group?'group':'period');
initTheme();
const root=$('#collection-root');
const options=Array.from({length:max},(_,i)=>'<option value="'+(i+1)+'" '+(i+1===n?'selected':'')+'>'+(group?'Nhóm ':'Chu kỳ ')+(i+1)+'</option>').join('');
const states=members.reduce((map,e)=>{const x=factsFor(e).state;map[x]=(map[x]||0)+1;return map;},{});
const categories=Object.entries(categoryInfo).map(([key,meta])=>({
  ...meta,key,count:members.filter(e=>e.category===key).length
})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count);
const minElement=members[0],maxElement=members.at(-1);
const microInfo='<section class="collection-research"><span class="atlas-eyebrow">THỐNG KÊ PHÂN BỐ</span>'+
  '<div class="collection-research__grid">'+
    '<article><small>VÙNG NGUYÊN TỬ</small><strong>'+minElement.number+'–'+maxElement.number+'</strong><p>Số hiệu của nguyên tố đầu và cuối trong mục này.</p></article>'+
    '<article><small>PHÂN LOẠI NỔI BẬT</small><strong>'+categories[0].name+'</strong><p>'+categories[0].count+' nguyên tố thuộc phân loại này.</p></article>'+
    '<article><small>TRẠNG THÁI (Ở ĐIỀU KIỆN THƯỜNG)</small><strong>'+Object.entries(states).map(([k,v])=>v+' '+k.toLocaleLowerCase('vi')).join(' · ')+'</strong><p>Với các nguyên tố siêu nặng, trạng thái thực nghiệm có thể chưa được xác định.</p></article>'+
  '</div><div class="collection-research__families">'+categories.map(x=>'<span style="--family:'+palette[x.key]+'"><i></i><b>'+x.name+'</b><small>'+x.count+'</small></span>').join('')+'</div></section>';
root.innerHTML=
 '<div class="atlas-breadcrumb"><a href="./index.html">Bảng tuần hoàn</a><span>/</span><b>'+title+'</b></div>'+
 '<section class="collection-intro"><div><span class="atlas-eyebrow">BỘ DANH MỤC / '+(group?'18 NHÓM':'07 CHU KỲ')+'</span>'+
 '<h1>'+title+'<span> / '+subtype+'</span></h1><p>'+esc(explanation)+'</p></div>'+
 '<aside class="collection-index"><span>CHỌN '+(group?'NHÓM':'CHU KỲ')+'</span><select id="collection-select" aria-label="Chọn '+(group?'nhóm':'chu kỳ')+'">'+options+'</select>'+
 '<strong>'+String(members.length).padStart(2,'0')+'</strong><small>NGUYÊN TỐ</small></aside></section>'+
 '<section class="collection-list"><div class="collection-list__heading"><div><span class="atlas-eyebrow">SỐ HIỆU NGUYÊN TỬ TĂNG DẦN</span><h2>Danh sách nguyên tố</h2></div>'+
 '<span>CHỌN Ô ĐỂ MỞ HỒ SƠ 3D ↗</span></div><div class="collection-list__grid">'+
 members.map((e,i)=>'<a href="'+locationFor(e)+'" class="collection-element" style="--family:'+palette[e.category]+';animation-delay:'+Math.min(i*18,240)+'ms">'+
 '<div class="collection-element__top"><small>'+String(e.number).padStart(3,'0')+'</small><span>↗</span></div>'+
 '<strong>'+e.symbol+'</strong><div class="collection-element__bottom"><span>'+esc(e.name)+'</span><small>'+esc(atomicMass[e.symbol]||'—')+' u</small></div>'+
 '</a>').join('')+'</div></section>'+
 microInfo+
 '<section class="collection-note"><span class="atlas-eyebrow">GHI CHÚ / BỐ CỤC</span><div><h2>'+(group?'Cột dọc số '+n:'Hàng ngang số '+n)+'</h2>'+
 '<p>'+(group?'Các dãy Lantan và Actini được tách thành hai hàng riêng trong cách trình bày thông dụng. Không gán tất cả các nguyên tố khối f trực tiếp vào nhóm 3.':'Một số chu kỳ có nguyên tố thuộc khối f, thường nằm dưới bảng chính. Số lượng nguyên tố của từng chu kỳ lần lượt là 2, 8, 8, 18, 18, 32 và 32.')+'</p>'+
 '<a href="./index.html">Trở về sơ đồ toàn bộ 118 nguyên tố →</a></div></section>'+
 '<footer class="atlas-footer"><span>ATLAS NGUYÊN TỐ · DANH MỤC HÓA HỌC</span><span>Tham khảo cách đánh số nhóm 1–18 theo IUPAC.</span></footer>';
$('#collection-select').addEventListener('change',e=>{location.href='./'+(group?'group':'period')+'.html?n='+e.target.value;});
document.title=title+' — Atlas Nguyên Tố';

initMotion();

initQuiz();
