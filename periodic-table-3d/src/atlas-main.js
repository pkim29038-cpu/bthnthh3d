import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { elements } from './elements.js';
import { atomicMass, categoryInfo, locationFor } from './chemistry.js';
import { renderSiteNav } from './site-nav.js';
import { initTheme } from './theme.js';
import './atlas.css';
import './neon-theme.css';

const $ = q => document.querySelector(q);
const PALETTE = {
  'kim-loai-kiem':'#ac7555', 'kiem-tho':'#bd955c', 'kim-loai-chuyen-tiep':'#54838c',
  'kim-loai-hau-chuyen-tiep':'#6f947f', 'a-kim':'#847b9a', 'phi-kim':'#71899f',
  'khi-hiem':'#b18b9c', 'lanthanide':'#a47b91', 'actinide':'#9b7a70'
};
const doc = document.documentElement;
$('#site-header').outerHTML = renderSiteNav('table');
initTheme();

let mode = '3d';
let viewer = null;
let query = '';
let category = 'all';
const flat = $('#table-flat');
const stage = $('#table-webgl');
const tooltip = $('#element-tooltip');
const counter = $('#result-count');

const makeLink = (el) => locationFor(el);
const matches = el => (category==='all' || el.category===category) &&
  (!query || [el.symbol, el.name, String(el.number)].some(t=>t.toLocaleLowerCase('vi').includes(query)));

function placeFlat() {
  const grid = document.createElement('div');
  grid.className = 'atlas-flat-grid';
  const marker = (label,col,row,link,kind='axis')=>{
    const node = document.createElement(link?'a':'span');
    node.className = 'atlas-flat-'+kind;
    node.style.gridColumn = col;
    node.style.gridRow = row;
    node.textContent = label;
    if(link)node.href = link;
    grid.appendChild(node);
  };
  marker('N / C',1,1,null);
  for(let i=1;i<=18;i++)marker(i,i+1,1,'./group.html?n='+i);
  for(let i=1;i<=7;i++)marker(i,1,i+1,'./period.html?n='+i);
  marker('Ln',1,10,null);marker('An',1,11,null);
  marker('57–71',4,7,'./period.html?n=6','range');
  marker('89–103',4,8,'./period.html?n=7','range');
  for(const el of elements){
    const tile=document.createElement('a');
    tile.className='atlas-flat-tile';
    tile.href=makeLink(el);tile.dataset.z=el.number;
    tile.style.setProperty('--family',PALETTE[el.category]);
    tile.style.gridColumn=el.column+1;
    tile.style.gridRow=el.row<=7?el.row+1:el.row+2;
    const n=document.createElement('span');n.className='atlas-flat-atomic';n.textContent=el.number;
    const symbol=document.createElement('strong');symbol.textContent=el.symbol;
    const name=document.createElement('small');name.textContent=el.name;
    const mass=document.createElement('span');mass.className='atlas-flat-mass';mass.textContent=atomicMass[el.symbol]||'—';
    tile.append(n,symbol,name,mass);grid.appendChild(tile);
  }
  flat.appendChild(grid);
}
placeFlat();

const optionGroup=$('#category-filter');
for(const [key,meta] of Object.entries(categoryInfo)){
  const o=document.createElement('option');o.value=key;o.textContent=meta.name;optionGroup.appendChild(o);
}
function filter() {
  let count=0, first=null;
  for(const el of elements) {
    const pass=matches(el);if(pass){count++;first??=el;}
    const tile=flat.querySelector('[data-z="'+el.number+'"]');
    tile?.classList.toggle('is-faded',!pass);
  }
  viewer?.filter(matches);
  counter.textContent=count+' / 118';
  return first;
}
$('#element-search').addEventListener('input',e=>{query=e.target.value.trim().toLocaleLowerCase('vi');filter();});
$('#element-search').addEventListener('keydown',e=>{
  if(e.key==='Enter'){const first=filter();if(first)location.href=makeLink(first);}
  if(e.key==='Escape'){e.target.value='';query='';filter();}
});
optionGroup.addEventListener('change',e=>{category=e.target.value;filter();});
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#element-search').focus();}
});
$('#atlas-legend').innerHTML=Object.entries(categoryInfo).map(([k,v])=>'<span style="--family:'+PALETTE[k]+'"><i></i>'+v.name+'</span>').join('');

for(const b of document.querySelectorAll('[data-table-mode]')){
  b.addEventListener('click',()=>setMode(b.dataset.tableMode));
}
function setMode(next) {
  mode=next;
  for(const b of document.querySelectorAll('[data-table-mode]')){b.classList.toggle('is-selected',b.dataset.tableMode===next);b.setAttribute('aria-pressed',String(b.dataset.tableMode===next));}
  flat.hidden=next!=='2d';stage.hidden=next!=='3d';
  $('#reset-table').hidden=next!=='3d';
  $('#viewport-status').textContent=next==='3d'?'MÔ HÌNH KHỐI / CÓ THỂ XOAY':'MẶT PHẲNG / DỄ ĐỌC';
  $('#viewport-hint').textContent=next==='3d'?'KÉO XOAY · LĂN ĐỂ ZOOM · BẤM ĐỂ KHÁM PHÁ':'CUỘN NGANG ĐỂ XEM ĐỦ 18 NHÓM';
  if(next==='3d'){viewer?.resize();viewer?.renderOnce();}
}
$('#reset-table').addEventListener('click',()=>viewer?.reset());

function tint(hex,amount,target) {
  const c=new THREE.Color(hex),t=new THREE.Color(target);
  return '#'+c.lerp(t,amount).getHexString();
}
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);
}
function faceTexture(el,light=true){
  const canvas=document.createElement('canvas');canvas.width=272;canvas.height=310;
  const ctx=canvas.getContext('2d');
  const family=PALETTE[el.category];
  const paper=light?'#fffdf7':'#252c2f',ink=light?'#242b2c':'#f0ede4',muted=light?'#6b7372':'#a4aaa7';
  ctx.clearRect(0,0,272,310);
  roundRect(ctx,4,4,264,302,22);ctx.fillStyle=tint(family,light?.89:.78,paper);ctx.fill();
  ctx.lineWidth=3;ctx.strokeStyle=tint(family,.49,paper);ctx.stroke();
  ctx.fillStyle=family;ctx.fillRect(18,18,6,56);
  ctx.fillStyle=muted;ctx.textAlign='left';ctx.font='bold 25px ui-monospace,monospace';
  ctx.fillText(String(el.number).padStart(3,'0'),36,49);
  ctx.fillStyle=ink;ctx.font='800 112px Arial,sans-serif';
  ctx.fillText(el.symbol,30,180);
  ctx.font='600 26px Arial,sans-serif';ctx.fillText(el.name.length>14?el.name.slice(0,13)+'…':el.name,30,225);
  ctx.fillStyle=muted;ctx.font='23px ui-monospace,monospace';ctx.fillText(String(atomicMass[el.symbol]||'—')+' u',30,272);
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=4;
  return texture;
}
function axisTexture(value,light=true){
  const c=document.createElement('canvas');c.width=136;c.height=136;
  const ctx=c.getContext('2d');
  ctx.clearRect(0,0,136,136);
  ctx.fillStyle=light?'#667077':'#a6aaa7';ctx.font='bold 57px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(String(value),68,68);
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
class PeriodicSculpture {
  constructor(container){
    this.container=container;this.activeMeshes=[];this.textures=[];this.hovered=null;this.clickStart=null;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(39,1,0.1,120);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.45;
    container.appendChild(this.renderer.domElement);
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.enableDamping=true;this.controls.dampingFactor=.075;
    this.controls.enablePan=false;this.controls.minDistance=16;this.controls.maxDistance=55;
    this.controls.autoRotate=false;
    this.group=new THREE.Group();this.scene.add(this.group);
    this.scene.add(new THREE.AmbientLight(0xffffff,2.2));
    const a=new THREE.DirectionalLight(0xffffff,2.1);a.position.set(-9,12,15);this.scene.add(a);
    const b=new THREE.DirectionalLight(0x9fb0b0,.75);b.position.set(12,-3,9);this.scene.add(b);
    this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();
    this.renderer.domElement.addEventListener('pointerdown',e=>{this.clickStart={x:e.clientX,y:e.clientY};});
    this.renderer.domElement.addEventListener('pointerup',e=>{
      if(!this.clickStart||Math.hypot(e.clientX-this.clickStart.x,e.clientY-this.clickStart.y)>5)return;
      this.setPointer(e);const hits=this.raycaster.intersectObjects(this.activeMeshes,false);
      const el=hits.find(h=>h.object.userData.el)?.object.userData.el;
      if(el) location.href=makeLink(el);
    });
    this.renderer.domElement.addEventListener('pointermove',e=>this.hover(e));
    this.renderer.domElement.addEventListener('pointerleave',()=>{tooltip.hidden=true;this.renderer.domElement.style.cursor='grab';});
    window.addEventListener('resize',()=>this.resize());
    document.addEventListener('atomic-theme-change',()=>this.build());
    this.build();this.reset();this.resize();
    this.animate();
  }
  reset(){
    this.camera.position.set(1.4,2.2,29);
    this.controls.target.set(0,-.2,0);
    this.controls.update();this.group.rotation.set(-.08,.08,0);
  }
  setPointer(event){
    const rect=this.renderer.domElement.getBoundingClientRect();
    this.pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
    this.pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
    this.raycaster.setFromCamera(this.pointer,this.camera);
  }
  hover(event){
    if(mode!=='3d')return;
    this.setPointer(event);
    const hits=this.raycaster.intersectObjects(this.activeMeshes,false);
    const el=hits.find(h=>h.object.userData.el)?.object.userData.el;
    if(el){
      tooltip.hidden=false;
      tooltip.textContent=el.symbol+' · '+el.name+'  /  Z '+el.number;
      const rect=this.container.getBoundingClientRect();
      tooltip.style.left=Math.max(8,Math.min(event.clientX-rect.left+14,rect.width-230))+'px';
      tooltip.style.top=Math.max(8,event.clientY-rect.top-31)+'px';
      this.renderer.domElement.style.cursor='pointer';
    }else{tooltip.hidden=true;this.renderer.domElement.style.cursor='grab';}
  }
  filter(predicate){
    for(const item of this.tiles||[]){
      const opacity=predicate(item.el)?1:.12;
      item.face.material.opacity=opacity;
      item.box.material.opacity=Math.max(.28,opacity);
    }
  }
  disposeChildren(){
    this.group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});
    this.textures.forEach(t=>t.dispose());this.textures=[];this.tiles=[];this.activeMeshes=[];
    this.group.clear();
  }
  addLabel(text,x,y,size=.55){
    const texture=axisTexture(text,doc.dataset.theme!=='dark');this.textures.push(texture);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(size,size),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false}));
    mesh.position.set(x,y,.17);this.group.add(mesh);
  }
  addTile(el){
    const x=(el.column-9.5)*1.05;
    const row=el.row<=7?el.row:el.row+1; // one visual break above lanthanoids
    const y=4.24-(row-1)*1.04;
    const z=.12+(el.number%5)*.016;
    const color=PALETTE[el.category],isLight=doc.dataset.theme!=='dark';
    const group=new THREE.Group();group.position.set(x,y,z);
    const box=new THREE.Mesh(new THREE.BoxGeometry(.91,.9,.29),new THREE.MeshStandardMaterial({color:tint(color,.76,isLight?'#e7e1d4':'#252e30'),roughness:.74,metalness:.06,transparent:true,opacity:1}));
    box.userData.el=el;group.add(box);
    const texture=faceTexture(el,isLight);this.textures.push(texture);
    const face=new THREE.Mesh(new THREE.PlaneGeometry(.91,.9),new THREE.MeshBasicMaterial({map:texture,transparent:true,toneMapped:false,opacity:1}));
    face.position.z=.157;face.userData.el=el;group.add(face);
    this.group.add(group);this.tiles.push({el,box,face});this.activeMeshes.push(face,box);
  }
  addRange(text,row){
    const x=(3-9.5)*1.05;
    const y=4.24-(row-1)*1.04;
    const panel=new THREE.Mesh(new THREE.BoxGeometry(.91,.9,.22),new THREE.MeshStandardMaterial({color:doc.dataset.theme==='dark'?0x454043:0xdcd0c7,roughness:.82}));
    panel.position.set(x,y,.13);this.group.add(panel);
    const texture=axisTexture(text,doc.dataset.theme!=='dark');this.textures.push(texture);
    const face=new THREE.Mesh(new THREE.PlaneGeometry(.82,.72),new THREE.MeshBasicMaterial({map:texture,transparent:true,toneMapped:false}));
    face.position.set(x,y,.26);this.group.add(face);
  }
  build(){
    this.disposeChildren();
    const light=doc.dataset.theme!=='dark';
    const base=new THREE.Mesh(new THREE.BoxGeometry(20.1,12.6,.55),new THREE.MeshStandardMaterial({color:light?0x676e70:0x1f292e,metalness:.25,roughness:.72}));
    base.position.set(-.24,-.16,-.45);
    this.group.add(base);
    const rim=new THREE.Mesh(new THREE.BoxGeometry(20.35,12.86,.2),new THREE.MeshStandardMaterial({color:light?0x383f43:0x4c5357,metalness:.53,roughness:.38}));
    rim.position.set(-.24,-.16,-.80);this.group.add(rim);
    for(let n=1;n<=18;n++)this.addLabel(n,(n-9.5)*1.05,5.39,.40);
    for(let n=1;n<=7;n++)this.addLabel(n,-9.65,4.24-(n-1)*1.04,.42);
    this.addLabel('Ln',-9.65,-4.08,.42);
    this.addLabel('An',-9.65,-5.12,.42);
    for(const el of elements)this.addTile(el);
    this.addRange('57–71',6);
    this.addRange('89–103',7);
    this.filter(matches);
    this.renderOnce();
  }
  resize(){
    const rect=this.container.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    this.renderer.setSize(rect.width,rect.height,false);
    this.camera.aspect=rect.width/rect.height;this.camera.updateProjectionMatrix();
    const required=Math.max(12.9/(2*Math.tan(Math.PI*39/360)),20.8/(this.camera.aspect*2*Math.tan(Math.PI*39/360)));
    this.controls.minDistance=Math.max(16,required*.92);
    this.controls.maxDistance=Math.max(45,required*2.4);
    if(this.camera.position.length()<required*1.12)this.camera.position.set(1.4,2.2,required*1.16);
    this.controls.update();
  }
  renderOnce(){this.controls.update();this.renderer.render(this.scene,this.camera);}
  animate(){
    requestAnimationFrame(()=>this.animate());
    if(document.hidden||mode!=='3d')return;
    this.controls.update();this.renderer.render(this.scene,this.camera);
  }
}
let webglAvailable=false;
try {
  viewer=new PeriodicSculpture(stage);
  webglAvailable=true;
  $('#viewport-status').textContent='MÔ HÌNH KHỐI / CÓ THỂ XOAY';
} catch(error) {
  console.warn('WebGL unavailable. Showing accessible flat table.',error);
  document.querySelector('[data-table-mode="3d"]').disabled=true;
}
setMode(!webglAvailable||matchMedia('(max-width: 630px)').matches?'2d':'3d');
filter();

initMotion();
