import {electronOrbitals, electronConfig} from './chemistry.js';

const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;':'&quot;'}[c]));
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
