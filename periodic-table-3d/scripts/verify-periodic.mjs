import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {elements} from '../src/elements.js';
import {groupElements,periodElements,atomicMass,electronShells} from '../src/chemistry.js';
import {renderSiteNav} from '../src/site-nav.js';
import {boxesFor,validateOrbitalCount,drawOrbitalDiagram,electronDisplay} from '../src/orbital-diagram.js';
import {materialInfo} from '../src/material-viz.js';
const file=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

assert.equal(elements.length,118);
assert.deepEqual(elements.map(e=>e.number),Array.from({length:118},(_,i)=>i+1));
assert.equal(new Set(elements.map(e=>e.row+':'+e.column)).size,118);
assert.deepEqual(Array.from({length:7},(_,i)=>periodElements(i+1).length),[2,8,8,18,18,32,32]);
assert.deepEqual(groupElements(10).map(e=>e.symbol),['Ni','Pd','Pt','Ds']);
assert.deepEqual(groupElements(3).map(e=>e.symbol),['Sc','Y','La','Ac']);
assert.equal(elements.filter(e=>e.category==='lanthanide').length,15);
assert.equal(elements.filter(e=>e.category==='actinide').length,15);
assert.deepEqual(electronShells(elements.find(e=>e.symbol==='Ni')),[2,8,16,2]);
assert.deepEqual(electronShells(elements.find(e=>e.symbol==='Be')),[2,2]);
assert.ok(elements.every(validateOrbitalCount),'electron counts must match atomic numbers');

assert.deepEqual(boxesFor('2p',3),[['↑'],['↑'],['↑']]);
assert.deepEqual(boxesFor('2p',4),[['↑','↓'],['↑'],['↑']]);
assert.deepEqual(boxesFor('3d',6),[['↑','↓'],['↑'],['↑'],['↑'],['↑']]);
assert.ok(drawOrbitalDiagram(elements.find(e=>e.symbol==='Be')).includes('orbital-spin-box'));
assert.equal(electronDisplay(elements.find(e=>e.symbol==='Be')),'1s² 2s²');
assert.equal(electronDisplay(elements.find(e=>e.symbol==='Ni')),'[Ar] 3d⁸ 4s²');
assert.equal(electronDisplay(elements.find(e=>e.symbol==='Fe')),'[Ar] 3d⁶ 4s²');

assert.equal(materialInfo(elements.find(e=>e.symbol==='Fe')).kind,'i-beam');
assert.equal(materialInfo(elements.find(e=>e.symbol==='Cu')).kind,'coil');
assert.equal(materialInfo(elements.find(e=>e.symbol==='Au')).kind,'ingot');
assert.equal(materialInfo(elements.find(e=>e.symbol==='Hg')).kind,'mercury');
assert.equal(materialInfo(elements.find(e=>e.symbol==='O')).kind,'gas-molecule');
assert.equal(materialInfo(elements.find(e=>e.symbol==='U')).kind,'ore');
assert.equal(materialInfo(elements.find(e=>e.symbol==='Og')).kind,'unknown');
assert.ok(materialInfo(elements.find(e=>e.symbol==='Og')).speculative);

for(const current of ['table','group','period']){
 const nav=renderSiteNav(current);
 assert.equal((nav.match(/<nav /g)||[]).length,1);
 assert.equal((nav.match(/<a class="atlas-nav__tab/g)||[]).length,3);
 assert.equal((nav.match(/data-theme-toggle/g)||[]).length,1);
}
for(const page of ['index','element','group','period']){
 const html=file(page+'.html');
 assert.ok(html.includes('id="site-header"'),'Missing shared nav in '+page);
}
assert.ok(!file('index.html').includes('id="detail-panel"'),'Home must have no redundant element summary panel');
assert.ok(file('index.html').includes('id="table-webgl"'),'3D board missing');
assert.ok(file('index.html').includes('id="table-flat"'),'2D fallback missing');
assert.ok(file('src/atlas-main.js').includes('new THREE.BoxGeometry'),'Period table is not a physical solid');
assert.ok(file('src/atlas-main.js').includes('new THREE.CanvasTexture'),'Tile lettering should adhere to actual 3D mesh');
assert.ok(file('src/atlas-main.js').includes('new OrbitControls'),'3D table must be drag-rotatable');
assert.ok(file('element.html').includes('id="orbital-diagram"'));
assert.ok(file('element.html').includes('id="atlas-material"'));
assert.ok(file('src/theme.js').includes('localStorage'));
console.log('✓ 118 elements · 18 groups · 7 periods · box orbitals · 3D samples · single nav · light/dark');
