import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {elements} from '../src/elements.js';
import {groupElements,periodElements,atomicMass,electronShells} from '../src/chemistry.js';
import {renderSiteNav} from '../src/site-nav.js';
import {boxesFor,validateOrbitalCount,drawOrbitalDiagram,electronDisplay} from '../src/orbital-diagram.js';
import {materialInfo} from '../src/material-viz.js';
import {generateQuizQuestion} from '../src/quiz.js';
import {orbitalOptions,orbitalPoint} from '../src/orbital-cloud.js';
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
assert.ok(file('src/mole-lab.js').includes('this.spinPhase+=dt') && file('src/mole-lab.js').includes('Math.sin(this.spinPhase)'), 'Mole cube must animate in a bounded horizontal half-turn');
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

const allSitePages=['index','element','group','period'];
for(const page of allSitePages){
  const html=file(page+'.html');
  assert.ok(html.includes("localStorage.getItem('atomic-atlas-theme')"),page+' should apply saved theme BEFORE module JS');
}
assert.ok(file('src/site-nav.js').includes('data-quiz-open'),'Header quiz launch is missing');
for(const entry of ['atlas-main.js','element-atlas.js','collection-atlas.js']){
  assert.ok(file('src/'+entry).includes('initQuiz()'),entry+' should activate quiz');
  assert.ok(file('src/'+entry).includes("import './final-polish.css'"),entry+' should load final responsive layout');
}
for(let i=0;i<80;i++){
  const q=generateQuizQuestion();
  assert.ok(q.options.length===4,'Quiz should offer four choices');
  assert.ok(new Set(q.options).size===4,'Quiz choices must be distinct');
  assert.ok(q.options.includes(q.answer),'Quiz must have a correct answer');
  assert.ok(q.prompt.length>8&&q.explanation.length>12);
}
assert.ok(orbitalOptions(elements.find(e=>e.symbol==='Li')).length>=2);
assert.equal(orbitalPoint('s',()=>.5,0).length,3);
assert.ok(file('element.html').includes('data-lab-mode="ar"'));
assert.ok(file('element.html').includes('data-lab-mode="orbital"'));
assert.ok(file('element.html').includes('id="lab-download"'));
assert.ok(file('element.html').includes('id="orbital-cloud"'));
assert.ok(file('src/atom-lab.js').includes("link.download='atlas-'"),'Save-PNG control must really download');
assert.ok(file('src/atom-lab.js').includes('THREE')===false,'Viewer coordinator must share graphics modules');
assert.ok(file('src/electron-viz.js').includes("THREE.MOUSE.PAN"),'WebAR desktop right drag should pan');
assert.ok(file('src/electron-viz.js').includes('this.renderer.xr.enabled=true'),'Real WebXR mode should be ready');
assert.ok(file('src/final-polish.css').includes('repeat(18,66px)'),'All 18 groups need legible flat cells');
assert.ok(file('src/atlas-main.js').includes('Tất cả nguyên tố'),'Need reset-all category choice');
assert.ok(file('src/atlas-main.js').includes('document.fonts.load'),'3D labels should redraw with Vietnamese fonts');
// Regression tests for the 2026-11-15 overlap / mouse-interaction fixes.
const labCode=file('src/atom-lab.js');
const vizCode=file('src/electron-viz.js');
const designCSS=file('src/final-polish.css');
assert.ok(labCode.includes("canvas.addEventListener('contextmenu'"),'Both canvases need a native browser context menu');
assert.ok(labCode.includes("rightDrag.moved"),'Right dragging must not accidentally open the save menu');
assert.ok(labCode.includes("if(nativeImageMenu)") && labCode.includes('event.preventDefault(); // WebAR right-drag'),'Ordinary Bohr/orbital right-click must preserve the native menu while WebAR blocks it');
assert.ok(labCode.includes("event.stopImmediatePropagation()"),'OrbitControls must not suppress the browser context menu');
assert.ok(labCode.includes("{capture:true}"),'Capture contextmenu before OrbitControls bubble listener');
assert.ok(!labCode.includes("event.preventDefault();exportScreenshot()"),'Right click must not automatically download PNG');
assert.ok(labCode.includes("canvas.setAttribute('aria-keyshortcuts','Shift+F10')"),'Keyboard native context menu should remain available');
assert.ok(vizCode.includes('this.controls.mouseButtons.LEFT=THREE.MOUSE.ROTATE'),'WebAR left drag must rotate');
assert.ok(vizCode.includes('this.controls.mouseButtons.RIGHT=THREE.MOUSE.PAN'),'WebAR right drag must pan');
assert.ok(designCSS.includes('.quiz-choices button')&&designCSS.includes('.quiz-actions'),'Quiz choices and next button must occupy separate normal-flow rows');
assert.ok(designCSS.includes('.collection-index strong'),'Collection number must have a dedicated line');
assert.ok(designCSS.includes('.element-quick-fact strong'),'Quick-fact label and number must not overlap');
assert.ok(file('src/site-nav.js').includes('class="atlas-nav__logo-image"'),'Header must render the user-provided atomic logo');
for(const page of ['index','element','group','period']){
  assert.ok(file(page+'.html').includes('atomic-atlas-logo.svg'),'Favicon should match the logo on '+page);
}
assert.ok(file('src/final-polish.css').includes('border-left:0!important'),'Atomic-number marker divider must no longer overlap the large number');
assert.ok(file('src/atom-lab.js').includes('nativeImageMenu'),'Native Save image as must not trigger forced download');
assert.ok(file('src/electron-viz.js').includes('this.scene.background=new THREE.Color(0x08152e)'),'Bohr export should have a visible background');
assert.ok(file('src/orbital-cloud.js').includes('this.scene.background=new THREE.Color(0x08152e)'),'Orbital export should have a visible background');
console.log('✓ 118 elements · 18 groups · 7 periods · box orbitals · 3D samples · single nav · light/dark');
