import {elements} from './elements.js';
import {atomicMass,categoryInfo,groupNames,periodNotes,groupElements,periodElements,locationFor} from './chemistry.js';
import {renderSiteNav} from './site-nav.js';
import {initTheme} from './theme.js';
import {initMotion} from './motion.js';
import './atlas.css';
import './atlas-collection.css';
import './neon-theme.css';
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
const palette={'kim-loai-kiem':'#ac7555','kiem-tho':'#bd955c','kim-loai-chuyen-tiep':'#54838c','kim-loai-hau-chuyen-tiep':'#6f947f','a-kim':'#847b9a','phi-kim':'#71899f','khi-hiem':'#b18b9c','lanthanide':'#a47b91','actinide':'#9b7a70'};
$('#site-header').outerHTML=renderSiteNav(group?'group':'period');
initTheme();
const root=$('#collection-root');
const options=Array.from({length:max},(_,i)=>'<option value="'+(i+1)+'" '+(i+1===n?'selected':'')+'>'+(group?'Nhóm ':'Chu kỳ ')+(i+1)+'</option>').join('');
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
 '<section class="collection-note"><span class="atlas-eyebrow">GHI CHÚ / BỐ CỤC</span><div><h2>'+(group?'Cột dọc số '+n:'Hàng ngang số '+n)+'</h2>'+
 '<p>'+(group?'Các dãy Lantan và Actini được tách thành hai hàng riêng trong cách trình bày thông dụng. Không gán tất cả các nguyên tố khối f trực tiếp vào nhóm 3.':'Một số chu kỳ có nguyên tố thuộc khối f, thường nằm dưới bảng chính. Số lượng nguyên tố của từng chu kỳ lần lượt là 2, 8, 8, 18, 18, 32 và 32.')+'</p>'+
 '<a href="./index.html">Trở về sơ đồ toàn bộ 118 nguyên tố →</a></div></section>'+
 '<footer class="atlas-footer"><span>ATLAS NGUYÊN TỐ · DANH MỤC HÓA HỌC</span><span>Tham khảo cách đánh số nhóm 1–18 theo IUPAC.</span></footer>';
$('#collection-select').addEventListener('change',e=>{location.href='./'+(group?'group':'period')+'.html?n='+e.target.value;});
document.title=title+' — Atlas Nguyên Tố';

initMotion();
