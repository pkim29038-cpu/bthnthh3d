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
import {propertySheet,EMPTY_PROPERTY} from '../src/element-property-sheet.js';
import {periodicProperties,fullElectronConfiguration,compactElectronConfiguration,standardStateName} from '../src/periodic-properties.js';
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

// Each of the 118 elements has a unique specimen recipe (shape + seed),
 // not an inherited single cylinder whose material color is merely swapped.
const specimens=elements.map(materialInfo);
assert.equal(specimens.length,118);
assert.equal(new Set(specimens.map(s=>s.z)).size,118,'All atomic numbers have a profile');
assert.equal(new Set(specimens.map(s=>s.seed)).size,118,'Procedural shapes use an element-unique seed');
assert.ok(new Set(specimens.map(s=>s.kind)).size>=18,'Provide many geometry families, not one generic shape');
assert.ok(specimens.every(s=>s.tint&&s.title&&s.description&&s.confidence),'Each sample needs its own presentation and scientific caution');
assert.ok(specimens.every(s=>s.title.length>8&&s.description.length>55));
assert.equal(materialInfo(elements.find(e=>e.symbol==='Fe')).kind,'metal-rough');
assert.equal(materialInfo(elements.find(e=>e.symbol==='Cu')).kind,'metal-nugget');
assert.equal(materialInfo(elements.find(e=>e.symbol==='Au')).kind,'metal-nugget');
assert.equal(materialInfo(elements.find(e=>e.symbol==='Hg')).kind,'liquid-droplet');
assert.equal(materialInfo(elements.find(e=>e.symbol==='O')).kind,'gas-vessel');
assert.equal(materialInfo(elements.find(e=>e.symbol==='Br')).kind,'liquid-vial');
assert.equal(materialInfo(elements.find(e=>e.symbol==='S')).kind,'crystal-cluster');
assert.equal(materialInfo(elements.find(e=>e.symbol==='C')).kind,'layered');
assert.equal(materialInfo(elements.find(e=>e.symbol==='U')).kind,'sealed');
assert.equal(materialInfo(elements.find(e=>e.symbol==='Og')).kind,'unobserved');
assert.equal(materialInfo(elements.find(e=>e.symbol==='At')).kind,'unobserved');
assert.ok(materialInfo(elements.find(e=>e.symbol==='Og')).speculative);
assert.ok(!materialInfo(elements.find(e=>e.symbol==='O')).description.includes('phát sáng'), 'Ordinary oxygen gas must not be shown as naturally luminous');

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
const navBootstrap=file('src/nav-bootstrap.js');
assert.ok(navBootstrap.includes('renderSiteNav('),'Lightweight bootstrap must create the navbar');
assert.ok(navBootstrap.includes('initTheme()')&&navBootstrap.includes('initQuiz()'),'Theme and quiz must work without waiting for 3D');
for(const page of allSitePages){
  const html=file(page+'.html');
  assert.ok(html.includes('href="/nav-critical.css"'),page+' must load header CSS before WebGL');
  assert.ok(html.includes('src="/src/nav-bootstrap.js"'),page+' must use lightweight navbar entry');
  assert.ok(html.indexOf('src="/src/nav-bootstrap.js"')<html.indexOf('</head>'),page+' must initialize the navbar before page bundles');
}
for(const entry of ['atlas-main.js','element-atlas.js','collection-atlas.js']){
  const js=file('src/'+entry);
  assert.ok(!js.includes('renderSiteNav(')&&!js.includes('initTheme()')&&!js.includes('initQuiz()'),entry+' must not rerender navbar or register duplicate click handlers');
  assert.ok(js.includes("import './final-polish.css'"),entry+' should load final responsive layout');
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
// Regression: f-block range labels must not clip the last digit in WebGL or 2D.
const rangeJS=file('src/atlas-main.js');
assert.ok(rangeJS.includes("this.addRange('57–71',6)") && rangeJS.includes("this.addRange('89–103',7)"),'Both lanthanide / actinide placeholders must be rendered');
assert.ok(rangeJS.includes('function rangeTexture('),'The long labels require a dedicated high resolution texture');
assert.ok(rangeJS.includes('canvas.width=512;canvas.height=512'),'Range label texture must be high resolution');
assert.ok(rangeJS.includes('ctx.fillText(text,256,249,458)'),'Range labels must scale to fit within the placeholder');
assert.ok(rangeJS.includes('const texture=rangeTexture(text,'),'3D placeholder must use fitted texture, not generic axis label');
assert.ok(file('src/final-polish.css').includes('.atlas-flat-range{'),'2D placeholder must get a legible style');
// Performance regression: heavy 3D setup must never delay the cross-page navbar.
const mainCode=file('src/atlas-main.js');
assert.ok(mainCode.includes('requestAnimationFrame(()=>requestAnimationFrame(resolve))'),
 '118 3D tiles should start after the navbar has had time to paint');
assert.ok(mainCode.includes('let viewerPromise = null;'),'Only one 3D initialization may run');
assert.ok(mainCode.includes('if(viewerPromise||webglFailed)'),'Prevent duplicate WebGL initialization');
assert.ok(mainCode.includes("matchMedia('(max-width: 630px)').matches?'2d':'3d'"),'Phones should start in 2D');
assert.ok(!mainCode.includes('then(()=>viewer?.build())'),'Font loading must not trigger a second expensive texture rebuild');
assert.ok(file('index.html').includes('id="table-loading"'),'3D loading feedback should be visible');
assert.ok(file('public/nav-critical.css').includes('.atlas-nav__tabs'),'Critical navbar styles must be standalone');
// Regression: internationally standard English element names across every view.
assert.equal(elements.length,118);
assert.equal(new Set(elements.map(e=>e.name)).size,118,'Every element must have a distinct English name');
assert.ok(elements.every(e=>/^[A-Z][a-z]+$/.test(e.name)),'Primary labels must use English element names, not Vietnamese transcriptions');
for(const [symbol,name] of Object.entries({H:'Hydrogen',He:'Helium',O:'Oxygen',N:'Nitrogen',Fe:'Iron',Cu:'Copper',Ni:'Nickel',Al:'Aluminium',Cs:'Caesium',S:'Sulfur',W:'Tungsten',Au:'Gold',Og:'Oganesson'})){
  assert.equal(elements.find(e=>e.symbol===symbol)?.name,name,symbol+' must use the IUPAC English name');
}
assert.ok(elements.every(e=>typeof e.viName==='string'&&e.viName.length>0),'Keep old Vietnamese spellings only as search aliases');
assert.ok(file('src/atlas-main.js').includes('el.viName'),'Search must recognize Vietnamese aliases as well as English');
assert.ok(file('src/quiz.js').includes('el.name'),'Quiz questions must use the same English names');
assert.ok(file('src/collection-atlas.js').includes('e.name'),'Group/period cards must use the same English names');
assert.ok(file('src/element-atlas.js').includes("textContent=el.name"),'Element profile must use the same English names');
assert.ok(file('src/atlas-main.js').includes('ctx.fillText(name,36,408,448)'),'3D textures must use the shared element name');
assert.ok(file('src/material-viz.js').includes("specimen-renderer.js"),'Viewer should use dedicated specimen geometry library');
const specimenRenderer=file('src/specimen-renderer.js');
assert.ok(specimenRenderer.includes("case 'metal-nugget'")&&specimenRenderer.includes("case 'crystal-shard'")&&specimenRenderer.includes("case 'sealed'"),
  'Geometry must change between pure metal nuggets, crystals and sealed samples');
assert.ok(specimenRenderer.includes("case 'unobserved'"),'Unobserved elements must not be drawn as fake macroscopic chunks');
assert.ok(file('element.html').includes('id="matter-specimen-tags"'),'Element detail should show the sample labels');
assert.ok(file('element.html').includes('id="matter-specimen-confidence"'),'Sample confidence should be transparent');
assert.ok(file('src/element-atlas.js').includes("import './specimen-lab.css'"),'Specimen gallery CSS should load');
// Every one of the 118 elements must render EVERY reference property field.
assert.equal(Object.keys(periodicProperties).length,118);
const allSheets=elements.map(propertySheet);
assert.ok(allSheets.every(sheet=>sheet.groups.length===4));
const counts=allSheets.map(sheet=>sheet.groups.reduce((sum,g)=>sum+g.entries.length,0));
assert.ok(counts.every(c=>c===27),'Property sections must always show 27 fields, even when values are missing');
assert.ok(allSheets.every(sheet=>sheet.groups.every(g=>g.entries.every(e=>typeof e.value==='string'&&e.value.length>0))),
  'Never omit or empty any property value');
assert.ok(allSheets.every(sheet=>sheet.groups.every(g=>g.entries.every(e=>!e.missing||e.value===EMPTY_PROPERTY))),
  'Unavailable data must appear exactly as ---');
const re=allSheets.find(sheet=>sheet.symbol==='Re');
const reValues=Object.fromEntries(re.groups.flatMap(g=>g.entries.map(e=>[e.label,e.value])));
assert.equal(reValues['Số hiệu nguyên tử (Z)'],'75');
assert.equal(reValues['Ký hiệu hóa học'],'Re');
assert.equal(reValues['Tên quốc tế (IUPAC)'],'Rhenium');
assert.equal(reValues['Độ âm điện (Pauling)'],'1,9');
assert.equal(reValues['Trạng thái ở điều kiện thường'],'Rắn');
assert.equal(reValues['Số lớp electron'],'6');
assert.equal(reValues['Khối lượng riêng'],'20,8 g/cm³');
assert.equal(reValues['Oxit tiêu biểu'],'Re₂O₇');
assert.equal(reValues['Hydroxide tiêu biểu'],EMPTY_PROPERTY,'HReO4 is an oxoacid, not a hydroxide');
assert.equal(reValues['Axit oxo tương ứng'],'HReO₄');
assert.ok(reValues['Cấu hình electron rút gọn'].includes('[Xe]'));
assert.ok(reValues['Cấu hình electron đầy đủ'].includes('1s²'));
assert.ok(re.uses.length>0,'Rhenium should have sourced uses');
assert.equal(standardStateName(elements.find(e=>e.symbol==='Og')),null,
  'A predicted gas state is not a verified standard state');
const og=allSheets.find(sheet=>sheet.symbol==='Og');
const ogFields=Object.fromEntries(og.groups.flatMap(g=>g.entries.map(e=>[e.label,e.value])));
assert.equal(ogFields['Khối lượng riêng'],EMPTY_PROPERTY);
assert.equal(ogFields['Bán kính nguyên tử (PubChem)'],EMPTY_PROPERTY);
assert.equal(ogFields['Nhiệt độ nóng chảy'],EMPTY_PROPERTY);
assert.equal(ogFields['Độ âm điện (Pauling)'],EMPTY_PROPERTY);
const h=allSheets.find(sheet=>sheet.symbol==='H');
const hFields=Object.fromEntries(h.groups.flatMap(g=>g.entries.map(e=>[e.label,e.value])));
assert.equal(hFields['Khối lượng riêng'],'0,08988 g/L');
assert.ok(file('src/element-atlas.js').includes('sheet.groups.map(group=>'));
assert.ok(file('element.html').includes('id="property-list"'));
assert.ok(file('src/element-atlas.js').includes("import './property-catalog.css'"));
assert.ok(!file('src/element-atlas.js').includes("].filter(([,v],i)=>i===0||Boolean(v))"),
  'Never filter missing properties out of the UI');

console.log('✓ 118 elements · 18 groups · 7 periods · box orbitals · 3D samples · single nav · light/dark');
