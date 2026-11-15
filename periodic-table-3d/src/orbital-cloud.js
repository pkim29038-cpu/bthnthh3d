import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {electronOrbitals} from './chemistry.js';

/** Educational orbital point-cloud; stylized angular shapes, not numerical Schrödinger solutions. */
function seeded(seed){let t=seed>>>0;return ()=>{t+=0x6d2b79f5;let n=t;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return ((n^(n>>>14))>>>0)/4294967296;};}
function gauss(rand){return Math.sqrt(-2*Math.log(Math.max(rand(),1e-6)))*Math.cos(2*Math.PI*rand());}
export function orbitalOptions(element){
  return electronOrbitals(element).filter(([,count])=>count>0).map(([label,count])=>({label,count}));
}
export function orbitalPoint(type,rand,index){
  const z=gauss(rand),x=gauss(rand),y=gauss(rand);
  if(type==='s')return [x*.65,y*.65,z*.65];
  if(type==='p'){
    const sign=index%2?1:-1;
    const axis=Math.floor(index/2)%3;
    const coords=[x*.30,y*.30,z*.30];coords[axis]+=sign*(1.1+Math.abs(gauss(rand))*.25);return coords;
  }
  if(type==='d'){
    const k=index%4,sg=(k%2)?-1:1,ax=(k<2)?0:1;
    const coords=[x*.27,y*.27,z*.27];coords[ax]+=sg*(1.20+Math.abs(gauss(rand))*.35);
    coords[1-ax]+=((Math.floor(index/4)%2)?1:-1)*.45;
    return coords;
  }
  const k=index%8;
  return [((k&1)?1:-1)*(1.0+Math.abs(x)*.19),((k&2)?1:-1)*(1.0+Math.abs(y)*.19),((k&4)?1:-1)*(1.0+Math.abs(z)*.19)];
}
export class OrbitalCloud{
  constructor(canvas,element){
    this.canvas=canvas;this.element=element;this.scene=new THREE.Scene();
    // Native canvas Save Image includes a solid lab backdrop instead of transparency.
    this.scene.background=new THREE.Color(0x08152e);
    this.camera=new THREE.PerspectiveCamera(42,1,.1,100);this.camera.position.set(0,0,9);
    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    this.group=new THREE.Group();this.scene.add(this.group);
    this.controls=new OrbitControls(this.camera,canvas);this.controls.enableDamping=true;this.controls.enablePan=false;
    this.controls.minDistance=3.5;this.controls.maxDistance=17;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.active='all';this.setOrbital('all');
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas.parentElement);
    this.resize();this.clock=new THREE.Clock();this.frame();
    window.addEventListener('pagehide',()=>{this.observer.disconnect();this.controls.dispose();this.renderer.dispose();},{once:true});
  }
  setOrbital(key){
    this.active=key;
    for(const o of [...this.group.children]){o.geometry?.dispose();o.material?.dispose();this.group.remove(o);}
    const orbitals=orbitalOptions(this.element);
    const pick=key==='all'?orbitals:orbitals.filter(o=>o.label===key);
    if(!pick.length)return;
    const samples=Math.max(18000,Math.min(30000,18000+this.element.number*70));
    const vertices=new Float32Array(samples*3),colors=new Float32Array(samples*3);
    const rng=seeded(this.element.number*3691+key.length*331);
    const core=new THREE.Color('#d7f6ff'),violet=new THREE.Color('#b88dff'),blue=new THREE.Color('#61c8ff');
    for(let i=0;i<samples;i++){
      const entry=pick[i%pick.length];
      const shape=entry.label.slice(1,2);
      const pos=orbitalPoint(shape,rng,i);
      const lvl=Number(entry.label[0])||1;
      const scale=.74+(Math.min(7,lvl)-1)*.18;
      const j=i*3;vertices[j]=pos[0]*scale;vertices[j+1]=pos[1]*scale;vertices[j+2]=pos[2]*scale;
      const color=blue.clone().lerp(i%3===0?violet:core,.28+(.40*rng()));
      colors[j]=color.r;colors[j+1]=color.g;colors[j+2]=color.b;
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(vertices,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
    const points=new THREE.Points(geo,new THREE.PointsMaterial({size:.036,vertexColors:true,transparent:true,opacity:.77,depthWrite:false,sizeAttenuation:true,blending:THREE.AdditiveBlending}));
    this.group.add(points);
    const central=new THREE.Mesh(new THREE.SphereGeometry(.09,22,16),new THREE.MeshBasicMaterial({color:0xffffff}));
    this.group.add(central);
    this.group.rotation.set(.25,.35,0);
  }
  resize(){const r=this.canvas.getBoundingClientRect();if(!r.width||!r.height)return;this.renderer.setSize(r.width,r.height,false);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();}
  reset(){this.camera.position.set(0,0,9);this.controls.target.set(0,0,0);this.controls.update();this.group.rotation.set(.25,.35,0);}
  renderOnce(){this.controls.update();this.renderer.render(this.scene,this.camera);}
  frame(){requestAnimationFrame(()=>this.frame());if(document.hidden)return;const dt=Math.min(.04,this.clock.getDelta());if(!this.reduced)this.group.rotation.y+=dt*.12;this.controls.update();this.renderer.render(this.scene,this.camera);}
}
