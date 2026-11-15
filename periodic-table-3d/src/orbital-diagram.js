import {electronOrbitals, electronConfig} from './chemistry.js';
import {elements} from './elements.js';

const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export function boxesFor(orbital,count){
  const type=orbital.slice(1),capacity=type==='s'?1:type==='p'?3:type==='d'?5:7;
  const boxes=Array.from({length:capacity},()=>[]);
  for(let i=0;i<Math.min(capacity,count);i++)boxes[i].push('↑');
  for(let i=0;i<Math.max(0,count-capacity);i++)boxes[i].push('↓');
  return boxes;
}
export function drawOrbitalDiagram(element){
  const orbitals=electronOrbitals(element);
  return '<div class="orbital-board" role="img" aria-label="Sơ đồ orbital của '+esc(element.name)+'; mũi tên biểu thị spin electron">'+
   orbitals.map(([orbital,n])=>'<div class="orbital-subshell"><span class="orbital-subshell__label">'+orbital+'<sup>'+n+'</sup></span><div class="orbital-subshell__boxes">'+
     boxesFor(orbital,n).map(spins=>'<span class="orbital-spin-box" aria-label="'+(spins.length?spins.join(''):'trống')+'">'+spins.map(s=>'<i>'+s+'</i>').join('')+'</span>').join('')+
   '</div></div>').join('')+'</div>';
}
export function electronSummary(element){
  return electronConfig(element);
}
export function validateOrbitalCount(element){
  return electronOrbitals(element).reduce((sum,[,count])=>sum+count,0)===element.number;
}

const digits={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const cores=[[86,'[Rn]'],[54,'[Xe]'],[36,'[Kr]'],[18,'[Ar]'],[10,'[Ne]'],[2,'[He]']];
/** Readable, condensed electron configuration while preserving a full box diagram. */
export function electronDisplay(element){
  if(element.number<=10)return electronConfig(element);
  const [z,label]=cores.find(([n])=>n<element.number)||[0,''];
  const noble=elements[z-1];
  const occupied=new Map(noble?electronOrbitals(noble):[]);
  const subshells=electronOrbitals(element).filter(([orbital,n])=>n>(occupied.get(orbital)||0));
  subshells.sort((a,b)=>Number(a[0][0])-Number(b[0][0])||'spdf'.indexOf(a[0][1])-'spdf'.indexOf(b[0][1]));
  return label+' '+subshells.map(([orbital,n])=>orbital+String(n).split('').map(d=>digits[d]).join('')).join(' ');
}
