import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {elements} from './elements.js';
import {numericMass,factsFor} from './chemistry.js';

export const AVOGADRO=6.02214076e23;
const fmt=(n,d=3)=>new Intl.NumberFormat('vi-VN',{maximumFractionDigits:d}).format(n);
export const molarWeight=el=>numericMass(el);
export const massFromMoles=(el,amount)=>molarWeight(el)==null?null:molarWeight(el)*amount;
export const countParticles=amount=>amount*AVOGADRO;
/** Volume estimate only when both density in g/cm³ and standard atomic mass are available. */
export function sampleVolume(el,amount){
  const density=factsFor(el).density;
  if(!density||!density.includes('g/cm³'))return null;
  const match=density.match(/(\d+(?:,\d+)?)/);
  if(!match)return null;
  const rho=Number(match[1].replace(',','.'));
  const grams=massFromMoles(el,amount);
  return grams!=null&&rho>0?grams/rho:null;
}
export function scientificCount(n){
  if(n<=0)return '0';
  const exponent=Math.floor(Math.log10(n));
  return fmt(n/10**exponent,3)+' × 10'+String(exponent).split('').map(x=>({'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'}[x]||x)).join('');
}

export class MoleCube {
  constructor(canvas,element){
    this.canvas=canvas;
    this.element=element;
    this.amount=1;
    this.isPlaying=!matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.spinPhase=0;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(42,1,.1,100);
    this.camera.position.set(5,3.6,8.9);
    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.55));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.65;
    this.scene.add(new THREE.AmbientLight(0xffffff,1.4));
    const key=new THREE.PointLight(0x77eaff,90,30);key.position.set(3,6,7);this.scene.add(key);
    const pink=new THREE.PointLight(0xaa7bff,80,30);pink.position.set(-5,-1,4);this.scene.add(pink);
    this.root=new THREE.Group();this.scene.add(this.root);
    this.controls=new OrbitControls(this.camera,canvas);
    this.controls.enableDamping=true;this.controls.enablePan=false;
    this.controls.minDistance=6;this.controls.maxDistance=17;
    this.controls.autoRotate=false;
    this._createCube();
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas.parentElement);
    this.resize();
    this.clock=new THREE.Clock();
    this.frame();
    window.addEventListener('pagehide',()=>{this.observer.disconnect();this.controls.dispose();this.renderer.dispose();},{once:true});
  }
  _labelTexture(){
    const c=document.createElement('canvas');c.width=512;c.height=512;
    this.labelCanvas=c;this.labelContext=c.getContext('2d');this._drawLabel();
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
    t.anisotropy=8;this.labelTexture=t;return t;
  }
  _drawLabel(){
    const ctx=this.labelContext;if(!ctx)return;
    const c=this.labelCanvas;
    ctx.clearRect(0,0,c.width,c.height);
    const gradient=ctx.createLinearGradient(0,0,512,512);
    gradient.addColorStop(0,'#182849');gradient.addColorStop(.52,'#0f1938');gradient.addColorStop(1,'#261a56');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,512,512);
    ctx.strokeStyle='#5de8ff';ctx.lineWidth=9;ctx.strokeRect(18,18,476,476);
    ctx.fillStyle='#8cefff';ctx.font='800 34px "Be Vietnam Pro", Arial, sans-serif';ctx.textAlign='center';
    ctx.fillText('TRỰC QUAN HÓA',256,93);
    ctx.fillStyle='#f3faff';ctx.font='900 150px "Be Vietnam Pro", Arial, sans-serif';ctx.fillText(this.element.symbol,256,303);
    ctx.fillStyle='#e5c4ff';ctx.font='800 52px "Be Vietnam Pro", Arial, sans-serif';ctx.fillText(fmt(this.amount,2)+' mol',256,382);
    ctx.fillStyle='#acd8ff';ctx.font='700 23px "Be Vietnam Pro", Arial, sans-serif';ctx.fillText('6,022 × 10²³ hạt / mol',256,444);
    this.labelTexture&&(this.labelTexture.needsUpdate=true);
  }
  _createCube(){
    const geometry=new THREE.BoxGeometry(3.05,3.05,3.05);
    const glass=new THREE.Mesh(geometry,new THREE.MeshPhysicalMaterial({
      color:0x61b3ff,metalness:.26,roughness:.14,transmission:0,transparent:true,opacity:.15,
      side:THREE.DoubleSide,depthWrite:false,emissive:0x186ef7,emissiveIntensity:.24
    }));
    this.root.add(glass);
    const edges=new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.08,3.08,3.08)),
      new THREE.LineBasicMaterial({color:0x67edff,transparent:true,opacity:.95})
    );this.root.add(edges);
    const outline=new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.25,3.25,3.25)),
      new THREE.LineBasicMaterial({color:0x9d71ff,transparent:true,opacity:.28})
    );this.root.add(outline);
    const texture=this._labelTexture();
    // Four readable upright labels: the visible face is always front-facing.
    // FrontSide avoids the backwards text previously visible through the glass.
    const mat=new THREE.MeshBasicMaterial({
      map:texture,transparent:true,opacity:.98,side:THREE.FrontSide,
      toneMapped:false,depthWrite:false,depthTest:true
    });
    const faces=[
      [0,0,1.564,0],
      [1.564,0,0,Math.PI/2],
      [0,0,-1.564,Math.PI],
      [-1.564,0,0,-Math.PI/2]
    ];
    for(const [x,y,z,yaw] of faces){
      const surface=new THREE.Mesh(new THREE.PlaneGeometry(2.88,2.88),mat);
      surface.position.set(x,y,z);
      surface.rotation.y=yaw;
      this.root.add(surface);
    }
    // Tiny symbolic particles suspended in the virtual sample.
    // A distinctive "quantum observatory" cage around the mole sample:
    // three independent circular measurement bands and subtle corner markers.
    const ringMaterial=new THREE.MeshBasicMaterial({color:0x60edff,transparent:true,opacity:.55,depthWrite:false});
    const violetMaterial=new THREE.MeshBasicMaterial({color:0xb88aff,transparent:true,opacity:.40,depthWrite:false});
    const torusA=new THREE.Mesh(new THREE.TorusGeometry(2.12,.016,7,144),ringMaterial);
    torusA.rotation.set(.65,.18,.23);this.root.add(torusA);
    const torusB=new THREE.Mesh(new THREE.TorusGeometry(2.27,.012,6,140),violetMaterial);
    torusB.rotation.set(1.15,.52,-.23);this.root.add(torusB);
    const torusC=new THREE.Mesh(new THREE.TorusGeometry(2.00,.011,6,140),ringMaterial);
    torusC.rotation.set(.18,.87,.54);this.root.add(torusC);
    const beaconGeo=new THREE.OctahedronGeometry(.074,0);
    const beaconMat=new THREE.MeshBasicMaterial({color:0x98faff});
    for(const x of [-1.55,1.55])for(const y of [-1.55,1.55])for(const z of [-1.55,1.55]){
      const beacon=new THREE.Mesh(beaconGeo,beaconMat);beacon.position.set(x,y,z);this.root.add(beacon);
    }
    const interior=new THREE.Mesh(new THREE.IcosahedronGeometry(.58,1),
      new THREE.MeshBasicMaterial({color:0x93b3ff,wireframe:true,transparent:true,opacity:.17}));
    this.root.add(interior);
    const count=96,g=new THREE.SphereGeometry(.035,8,7);
    const m=new THREE.MeshBasicMaterial({color:0x88f4ff,transparent:true,opacity:.68});
    const instanced=new THREE.InstancedMesh(g,m,count);
    const obj=new THREE.Object3D();
    for(let i=0;i<count;i++){
      const t=i*2.39996323,z=1-2*(i+.5)/count,r=Math.sqrt(1-z*z);
      const radius=1.25*Math.cbrt((i+.5)/count);
      obj.position.set(Math.cos(t)*r*radius,Math.sin(t)*r*radius,z*radius);
      obj.scale.setScalar(.45+.6*(i%9)/8);obj.updateMatrix();instanced.setMatrixAt(i,obj.matrix);
    }
    instanced.instanceMatrix.needsUpdate=true;
    this.root.add(instanced);
  }
  setAmount(value){
    const amount=Math.max(.25,Math.min(5,Number(value)||1));
    this.amount=amount;
    const scale=Math.cbrt(amount);
    this.root.scale.setScalar(scale);
    this._drawLabel();
  }
  setPlaying(value){this.isPlaying=!!value;}
  resize(){
    const r=this.canvas.getBoundingClientRect();if(!r.width||!r.height)return;
    this.renderer.setSize(r.width,r.height,false);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();
  }
  frame(){
    requestAnimationFrame(()=>this.frame());
    if(document.hidden)return;
    const dt=Math.min(.045,this.clock.getDelta());
    // Horizontal half-turn sweep (180° total), never a 360° tumble or an upside-down title.
    if(this.isPlaying)this.spinPhase+=dt*.65;
    this.root.rotation.x=0;
    this.root.rotation.z=0;
    this.root.rotation.y=.5+Math.sin(this.spinPhase)*Math.PI/2;
    this.controls.update();this.renderer.render(this.scene,this.camera);
  }
}

export function initMoleLab(element){
  const canvas=document.querySelector('#mol-canvas');
  if(!canvas)return;
  let viz=null;
  try{viz=new MoleCube(canvas,element);}catch(error){
    console.warn('Mole 3D unavailable',error);
    canvas.insertAdjacentHTML('afterend','<p class="mole-fallback">Không thể hiển thị mô hình WebGL, dữ liệu mol vẫn hoạt động.</p>');
    canvas.hidden=true;
  }
  const slider=document.querySelector('#mol-amount');
  const comparator=document.querySelector('#mol-compare-element');
  comparator.replaceChildren();
  const available=elements.filter(e=>numericMass(e)!=null);
  for(const item of available){
    const option=document.createElement('option');option.value=item.symbol;
    option.textContent=item.name+' ('+item.symbol+')';
    comparator.append(option);
  }
  comparator.value=element.symbol==='Cu'?'Ni':'Cu';
  const set=(selector,text)=>{document.querySelector(selector).textContent=text;};
  const update=()=>{
    const amount=Number(slider.value),other=available.find(x=>x.symbol===comparator.value)||available[0];
    const a=molarWeight(element),b=molarWeight(other);
    viz?.setAmount(amount);
    set('#mol-current-value',fmt(amount,2));
    set('#mol-current-symbol',element.symbol);
    set('#mol-amount-output',fmt(amount,2)+' mol');
    set('#mol-mass-value',a==null?'—':fmt(a*amount,3));
    set('#mol-mass-caption',a==null
      ?'Nguyên tố này không có nguyên tử khối chuẩn để tính chính xác khối lượng mol.'
      :fmt(amount,2)+' mol nguyên tử '+element.name+' có khối lượng khoảng '+fmt(a*amount,3)+' g.');
    set('#mol-particles',scientificCount(countParticles(amount)));
    const volume=sampleVolume(element,amount);
    set('#mol-volume',volume==null?'Chưa có dữ liệu':fmt(volume,2)+' cm³ (ước tính)');
    set('#mol-a-name',element.name);
    set('#mol-a-mass',a==null?'Chưa có số liệu':fmt(a,3)+' g/mol');
    set('#mol-b-name',other.name);
    set('#mol-b-mass',b==null?'Chưa có số liệu':fmt(b,3)+' g/mol');
    const max=Math.max(a||0,b||0,.0001);
    document.querySelector('#mol-bar-a').style.width=(a==null?0:100*a/max)+'%';
    document.querySelector('#mol-bar-b').style.width=(b==null?0:100*b/max)+'%';
    set('#mol-compare-summary',a!=null&&b!=null
      ?'Với cùng 1 mol nguyên tử, khối lượng '+element.name+' bằng '+fmt(a/b,3)+' lần '+other.name+'. Hai mẫu chứa cùng số nguyên tử nhưng có khối lượng khác nhau.'
      :'Không đủ khối lượng nguyên tử chuẩn để so sánh hai nguyên tố này.');
  };
  slider.addEventListener('input',update);
  comparator.addEventListener('change',update);
  const play=document.querySelector('#mol-play');
  if(!viz){play.disabled=true;play.hidden=true;}
  else{
    const setLabel=()=>{play.textContent=viz.isPlaying?'Tạm dừng ⏸':'Tiếp tục ▶';play.setAttribute('aria-label',viz.isPlaying?'Tạm dừng chuyển động khối lập phương':'Tiếp tục xoay khối lập phương');};
    setLabel();
    play.addEventListener('click',()=>{viz.setPlaying(!viz.isPlaying);setLabel();});
  }
  update();
}
