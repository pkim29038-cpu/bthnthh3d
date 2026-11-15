import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { elements } from '../src/elements.js';
import { groupElements, periodElements, atomicMass, electronShells } from '../src/chemistry.js';
import { renderSiteNav } from '../src/site-nav.js';

// Every element occupies one unique position in the conventional 18-column chart.
assert.equal(elements.length, 118);
assert.deepEqual(elements.map(e => e.number).sort((a,b)=>a-b), Array.from({length:118}, (_,i)=>i+1));
const keys=elements.map(e=>e.row+':'+e.column);
assert.equal(new Set(keys).size, 118, 'No element cells may overlap');
assert.ok(elements.every(e=>e.column>=1 && e.column<=18 && e.row>=1 && e.row<=9));
assert.deepEqual(
  Array.from({length:7},(_,i)=>periodElements(i+1).length),
  [2,8,8,18,18,32,32],
  'All seven periods must contain the correct number of elements'
);
assert.deepEqual(groupElements(10).map(e=>e.symbol), ['Ni','Pd','Pt','Ds']);
assert.deepEqual(groupElements(3).map(e=>e.symbol), ['Sc','Y','La','Ac']);
assert.ok(!groupElements(3).some(e=>e.symbol==='Ce'), 'Other f-series atoms should not be mislabeled group 3');
assert.deepEqual(
  elements.filter(e=>e.category==='lanthanide').map(e=>e.number),
  Array.from({length:15},(_,i)=>i+57)
);
assert.deepEqual(
  elements.filter(e=>e.category==='actinide').map(e=>e.number),
  Array.from({length:15},(_,i)=>i+89)
);
assert.ok(!elements.some(e=>e.column===3&&[6,7].includes(e.row)), 'f-block group-3 main cells must be range markers');
assert.equal(atomicMass.Ni, '58.693');
assert.deepEqual(electronShells(elements[27]),[2,8,16,2]);

// A single primary navigation across all views, with accurate selected tab and functional controls.
for (const mode of ['table','element','group','period']) {
  const nav=renderSiteNav(mode,{group:10,period:4});
  assert.equal((nav.match(/<nav /g)||[]).length,1);
  assert.equal((nav.match(/class="site-nav__tabs"/g)||[]).length,1);
  assert.equal((nav.match(/site-nav__tab/g)||[]).length,4); // wrapper + three links
  if(mode==='table')assert.ok(nav.includes('id="help-button"'));
  else assert.ok(!nav.includes('id="help-button"'));
  if(mode==='group')assert.ok(nav.includes('href="./group.html?n=10" class=')===false);
}
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(index.includes('id="site-header"'));
assert.ok(!index.includes('collection-shortcuts'));
assert.ok(!index.includes('main-explore-nav'));
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
assert.ok(main.includes('drawTableAxes();'));
assert.ok(main.includes('className = \'f-block-reference\''));
console.log('✔ 118 nguyên tố / 18 nhóm / 7 chu kỳ / dãy f / một thanh điều hướng: OK');
