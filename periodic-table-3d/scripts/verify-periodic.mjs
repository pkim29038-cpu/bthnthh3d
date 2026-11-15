import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {elements} from '../src/elements.js';
import {groupElements,periodElements,atomicMass,electronShells} from '../src/chemistry.js';
import {renderSiteNav} from '../src/site-nav.js';
import {boxesFor,validateOrbitalCount,drawOrbitalDiagram,electronDisplay} from '../src/orbital-diagram.js';
import {materialInfo} from '../src/material-viz.js';
import {AVOGADRO,molarWeight,massFromMoles,countParticles,sampleVolume,scientificCount} from '../src/mole-lab.js';
import {categoryInfo,factsFor} from '../src/chemistry.js';
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

assert.equal(Object.keys(categoryInfo).length,9,'Must visibly explain all 9 element families');
assert.equal(AVOGADRO,6.02214076e23);
const nickel=elements.find(e=>e.symbol==='Ni'),copper=elements.find(e=>e.symbol==='Cu');
assert.equal(molarWeight(nickel),58.693);
assert.equal(molarWeight(copper),63.546);
assert.equal(massFromMoles(nickel,2),117.386);
assert.equal(countParticles(1),AVOGADRO);
assert.ok(Math.abs(sampleVolume(nickel,1)-(58.693/8.908))<1e-10);
assert.ok(scientificCount(AVOGADRO).includes('10²³'));
assert.equal(factsFor(elements.find(e=>e.symbol==='Hg')).state,'Lỏng');
assert.equal(factsFor(elements.find(e=>e.symbol==='Br')).state,'Lỏng');
assert.equal(factsFor(elements.find(e=>e.symbol==='He')).state,'Khí');
assert.equal(factsFor(elements.find(e=>e.symbol==='Fe')).state,'Rắn');
const indexHTML=file('index.html'),elementHTML=file('element.html');
assert.ok(indexHTML.includes('id="atlas-family-cards"'),'Category cards must be visible and permanent');
assert.ok(indexHTML.includes('id="state-filter"'),'State filter dropdown missing');
assert.ok(!indexHTML.includes('id="category-filter"'),'Category filtering must not be a dropdown');
assert.ok(file('src/atlas-main.js').includes('categoryInfo).map'),'3D families must share the category colors');
assert.ok(file('src/atlas-main.js').includes('canvas.width=512'),'3D labels must be sharp');
assert.ok(elementHTML.includes('id="mol-canvas"'),'Mole 3D cube is missing');
assert.ok(elementHTML.includes('id="electron-play"'),'Electron motion playback control missing');
assert.ok(elementHTML.includes('id="mol-compare-element"'),'Mole comparison selector missing');
assert.ok(elementHTML.includes('id="element-knowledge"'),'Science expansion panels missing');
assert.ok(file('src/electron-viz.js').includes('this.spinners.push'),'Electron paths must rotate independently');
assert.ok(file('src/electron-viz.js').includes('spinner.group.rotation.z'),'Electron movement animation missing');
assert.ok(file('src/mole-lab.js').includes('this.root.rotation.y+=dt'),'Mole cube must animate');
for (const js of ['atlas-main.js','element-atlas.js','collection-atlas.js']){
  const source=file('src/'+js);
  assert.ok(source.includes("import './neon-theme.css'"),js+' lacks neon theme');
  assert.ok(source.includes("import './neon-enhancements.css'"),js+' lacks enhanced neon theme');
  assert.ok(source.includes('initMotion()'),js+' lacks motion director');
}
assert.ok(file('src/neon-theme.css').includes('prefers-reduced-motion'),'Reduced-motion alternative missing');


assert.ok(file('src/atlas-main.js').includes('familyCards.addEventListener'),'Category legend buttons must filter in both modes');
assert.ok(file('src/atlas-main.js').includes('selectedCategory ==='),'Category predicate must be applied');
assert.ok(file('src/atlas-main.js').includes('flat.inert=') && file('src/atlas-main.js').includes('stage.inert='),'2D/3D accessibility isolation missing');
assert.ok(file('index.html').includes('id="zoom-in"') && file('index.html').includes('id="zoom-out"'),'3D zoom controls missing');
assert.ok(file('src/atlas-main.js').includes('zoomBy(factor)'),'Board zoom should be real');
assert.ok(file('src/neon-enhancements.css').includes('.atlas-viewport__flat[hidden]'),'Hidden 2D and 3D surfaces must never overlap');
assert.ok(file('src/neon-enhancements.css').includes('repeat(18,48px)'),'2D table must have compact fixed cells');
assert.ok(file('src/atlas.css').includes('Be Vietnam Pro'),'Vietnamese headline fonts must be bundled via stylesheet');
assert.ok(file('src/mole-lab.js').includes('Math.sin(this.spinPhase)*Math.PI/2'),'Mole model must swing horizontally instead of spinning upside down');
assert.ok(file('src/mole-lab.js').includes('side:THREE.FrontSide'),'3D mole labels must not display backwards');
console.log('✓ 118 elements · 18 groups · 7 periods · box orbitals · 3D samples · single nav · light/dark');
