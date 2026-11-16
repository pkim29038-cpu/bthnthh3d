import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {specimenProfile} from './specimen-profiles.js';

/**
 * A dedicated procedural specimen per element. Shape recipes deliberately differ:
 * faceted metal, cut metal, flakes, ribbons, dendritic crystal, thin plate, beads,
 * soft powders, sealed glass vessels and lab ampoules. No "single cylinder recolored".
 * These are interpretive illustrations, not measurements or photos of real samples.
 */
const C=s=>new THREE.Color(s);
function random(seed){
  let t=seed>>>0;
  return ()=>{t+=0x6D2B79F5;let x=t;x=Math.imul(x^(x>>>15),x|1);x^=x+Math.imul(x^(x>>>7),x|61);return ((x^(x>>>14))>>>0)/4294967296;};
}
function roughPoly(radius,seed,detail=1){
  const geo=new THREE.IcosahedronGeometry(radius,detail);
  const a=geo.attributes.position;
  const k=(seed%79+21)*.035;
  for(let i=0;i<a.count;i++){
    const x=a.getX(i),y=a.getY(i),z=a.getZ(i);
    const waves=Math.sin(x*7.13+y*3.2+z*4.7+k)*.08+
      Math.cos(x*3.6-y*8.4+z*5.1+k*1.9)*.055;
    a.setXYZ(i,x*(1+waves),y*(1+waves*.8),z*(1+waves));
  }
  geo.computeVertexNormals();
  return geo;
}
function crystalGeometry(radius,height,sides=6){
  const geo=new THREE.CylinderGeometry(.045,radius,height,sides,1);
  geo.translate(0,height/2,0);
  return geo;
}

export class MaterialViz {
  constructor(canvas){
    this.canvas=canvas;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(37,1,.1,80);
    this.camera.position.set(4.5,3.1,9.0);
    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.85));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.38;
    this.scene.add(new THREE.HemisphereLight(0xffffff,0x3b4b65,2.45));
    const key=new THREE.DirectionalLight(0xfff5e7,3.8);
    key.position.set(-4,8,7);this.scene.add(key);
    const rim=new THREE.DirectionalLight(0x9cc9ff,2.55);
    rim.position.set(6,4,-6);this.scene.add(rim);
    const fill=new THREE.DirectionalLight(0xf7dbff,1.65);
    fill.position.set(-6,-3,3);this.scene.add(fill);
    this.root=new THREE.Group();
    this.scene.add(this.root);
    this.group=new THREE.Group();
    this.root.add(this.group);
    this.effects=[];
    this.controls=new OrbitControls(this.camera,canvas);
    this.controls.enableDamping=true;
    this.controls.enablePan=false;
    this.controls.autoRotate=true;
    this.controls.autoRotateSpeed=.38;
    this.controls.minDistance=4.6;
    this.controls.maxDistance=17;
    this.controls.maxPolarAngle=Math.PI*.78;
    this.clock=new THREE.Clock();
    this.timer=0;this.disposed=false;
    this.observer=new ResizeObserver(()=>this.resize());
    this.observer.observe(canvas.parentElement);
    this.resize();
    this.animate();
    window.addEventListener('pagehide',()=>this.dispose(),{once:true});
  }
  clear(){
    const discarded=new Set();
    this.root.traverse(o=>{
      if(o.geometry&&!discarded.has(o.geometry)){discarded.add(o.geometry);o.geometry.dispose();}
      if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){
        if(!discarded.has(m)){
          discarded.add(m);
          m.map?.dispose?.();
          m.dispose();
        }
      }
    });
    this.root.clear();
    this.group=new THREE.Group();
    this.root.add(this.group);
    this.effects=[];
  }
  add(geometry,material,x=0,y=0,z=0,parent=this.group){
    const mesh=new THREE.Mesh(geometry,material);
    mesh.position.set(x,y,z);parent.add(mesh);
    return mesh;
  }
  standard(color,metalness=.75,roughness=.27){
    return new THREE.MeshStandardMaterial({color:C(color),metalness,roughness,side:THREE.DoubleSide});
  }
  translucent(color,opacity=.16){
    return new THREE.MeshPhysicalMaterial({
      color:C(color),metalness:.02,roughness:.08,transparent:true,opacity,
      side:THREE.DoubleSide,depthWrite:false,clearcoat:1,
      clearcoatRoughness:.09
    });
  }
  rod(from,to,radius,material,segments=10,parent=this.group){
    const length=from.distanceTo(to);
    const m=this.add(new THREE.CylinderGeometry(radius,radius,length,segments),material,0,0,0,parent);
    m.position.copy(from).add(to).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),to.clone().sub(from).normalize());
    return m;
  }
  setupMuseumBase(seed){
    // Neutral plinth is separate from the actual specimen.
    const base=this.standard('#263449',.54,.38);
    this.add(new THREE.CylinderGeometry(2.42,2.52,.16,72),base,0,-1.84,0,this.root);
    this.add(new THREE.CylinderGeometry(2.22,2.31,.04,72),this.standard('#6b98c0',.52,.45),0,-1.72,0,this.root);
    const line=this.add(new THREE.TorusGeometry(2.39,.011,7,100),new THREE.MeshBasicMaterial({color:0x65d9ff,transparent:true,opacity:.52}),0,-1.755,0,this.root);
    line.rotation.x=Math.PI/2;
    // unique micro-markers per atomic number, like a laboratory catalog plate
    const r=random(seed);
    for(let i=0;i<7;i++){
      const angle=(i+.25)*Math.PI*2/7;
      const mark=this.add(new THREE.BoxGeometry(.10+r()*.08,.014,.025),this.standard('#94b7db',.20,.5),Math.cos(angle)*2.09,-1.685,Math.sin(angle)*2.09,this.root);
      mark.rotation.y=-angle;
    }
  }
  metalChunks(profile,r,mode){
    const primary=this.standard(profile.tint,.86,mode==='metal-cut'?.22:.39);
    const edge=this.standard(new THREE.Color(profile.tint).multiplyScalar(.77),.74,.54);
    const count=mode==='metal-beads'?9:mode==='metal-nugget'?6:mode==='metal-crystal'?5:mode==='metal-chip'?3:1;
    const mainSize=mode==='metal-beads'?.58:mode==='metal-nugget'?.84:mode==='metal-chip'?.78:1.22;
    for(let i=0;i<count;i++){
      const angle=i*2.39996+r()*.65;
      const spread=count===1?0:mode==='metal-beads'?1.05:.85;
      const x=Math.cos(angle)*spread*(.6+r()*.4);
      const z=Math.sin(angle)*spread*(.55+r()*.4);
      const y=count===1?-.28:-.66+r()*.53;
      const size=mainSize*(count===1?1:.62+r()*.55);
      let geo;
      if(mode==='metal-crystal')geo=new THREE.OctahedronGeometry(size,0);
      else if(mode==='metal-beads')geo=new THREE.SphereGeometry(size*.55,24,16);
      else geo=roughPoly(size,profile.seed+i*53,mode==='metal-faceted'?0:1);
      const m=this.add(geo,i%5===0?edge:primary,x,y,z);
      m.scale.set(1.1+r()*.35,.77+r()*.43,.80+r()*.4);
      m.rotation.set(r()*.6,r()*Math.PI,r()*.8);
      if(mode==='metal-cut'&&i===0){
        const cut=this.add(new THREE.CylinderGeometry(.81,.82,.06,9),this.standard(new THREE.Color(profile.tint).multiplyScalar(1.13),.86,.2),x,y+size*.53,z);
        cut.rotation.set(.12,r()*.35,.21);
      }
    }
    if(mode==='metal-rough'||mode==='metal-faceted'){
      // Some distinct raised facets / grain details that are not color-only.
      for(let i=0;i<7;i++){
        const t=i*2.39996;
        const bit=this.add(new THREE.TetrahedronGeometry(.13+r()*.17),i%2?primary:edge,Math.cos(t)*1.01,-.36+Math.sin(t*.67)*.40,Math.sin(t)*.72);
        bit.rotation.set(r()*3,r()*3,r()*3);
      }
    }
  }
  metalIngots(profile,r,kind){
    const base=this.standard(profile.tint,.84,.32);
    const size=kind==='metal-foil'?.045:kind==='metal-strip'?.17:.72;
    if(kind==='metal-foil'||kind==='metal-strip'){
      for(let i=0;i<(kind==='metal-foil'?3:4);i++){
        const plate=this.add(new THREE.BoxGeometry(2.4-i*.18,size,1.28+(i%2)*.16),base,(i-1.5)*.11,-.9+i*.22,(i-1.5)*.06);
        plate.rotation.set(.12+r()*.2,r()*.33,.09+(i-1)*.11);
      }
    }else{
      const m=this.add(new THREE.CylinderGeometry(1.15,1.42,size,4,1),base,0,-.4,0);
      m.rotation.y=Math.PI/4;m.scale.z=1.12+r()*.36;
      const trim=this.add(new THREE.BoxGeometry(1.24,.018,.09),this.standard('#e2e9ee',.76,.21),0,.01,0);
      trim.rotation.y=.43;
    }
  }
  crystal(profile,r,kind){
    const base=this.standard(profile.tint,.14,kind==='glassy'?.19:.34);
    const secondary=this.standard(new THREE.Color(profile.tint).multiplyScalar(.76),.23,.46);
    const n=kind==='crystal-shard'?6:kind==='crystal-cluster'?13:kind==='crystal-facets'?8:4;
    for(let i=0;i<n;i++){
      const ang=i*2.39996+r()*.36;
      const spread=.22+r()*.95;
      const h=.6+r()*1.5;
      const radius=.20+r()*.28;
      const g=kind==='crystal-facets'?new THREE.OctahedronGeometry(h*.52,0):crystalGeometry(radius,h,5+i%3);
      const m=this.add(g,i%4===0?secondary:base,Math.cos(ang)*spread,kind==='crystal-facets'?-.5+r()*.5:-1.25,Math.sin(ang)*spread);
      m.rotation.set((r()-.5)*.48,r()*Math.PI,(r()-.5)*.55);
      if(kind==='crystal-facets')m.scale.set(.76+r()*.3,1.18+r()*.4,.72+r()*.4);
    }
  }
  layered(profile,r,glassy=false){
    const mat=this.standard(profile.tint,glassy?.08:.22,glassy?.28:.79);
    const edge=this.standard(new THREE.Color(profile.tint).multiplyScalar(.61),.18,.85);
    const n=glassy?6:10;
    for(let i=0;i<n;i++){
      const g=glassy?roughPoly(.3+r()*.23,profile.seed+i,0):new THREE.BoxGeometry(2.12-r()*.25,.105+r()*.045,1.34+r()*.23);
      const m=this.add(g,i%3===0?edge:mat,(r()-.5)*.3,-1.18+i*(glassy?.19:.14),glassy?(r()-.5)*.7:0);
      m.rotation.set((r()-.5)*.13,r()*.20,(r()-.5)*.1);
    }
  }
  powder(profile,r){
    const tray=this.standard('#57687b',.5,.42);
    this.add(new THREE.CylinderGeometry(1.55,1.60,.16,64),tray,0,-1.26,0);
    this.add(new THREE.TorusGeometry(1.55,.048,9,80),tray,0,-1.17,0).rotation.x=Math.PI/2;
    const mat=this.standard(profile.tint,.1,.79);
    for(let i=0;i<115;i++){
      const theta=r()*Math.PI*2,rr=Math.sqrt(r())*1.29;
      const size=.04+r()*.075;
      const grain=this.add(new THREE.IcosahedronGeometry(size,0),mat,Math.cos(theta)*rr,-1.11+r()*.11,Math.sin(theta)*rr);
      grain.rotation.y=r()*Math.PI;
    }
  }
  glassChamber(){
    const material=this.translucent('#c9e6ff',.13);
    const base=this.standard('#506279',.55,.35);
    this.add(new THREE.CylinderGeometry(1.24,1.24,.08,64),base,0,-1.25,0);
    const wall=this.add(new THREE.CylinderGeometry(1.20,1.20,2.42,48,1,true),material,0,.05,0);
    wall.renderOrder=2;
    this.add(new THREE.TorusGeometry(1.2,.035,8,70),this.standard('#a8c9df',.48,.23),0,1.28,0).rotation.x=Math.PI/2;
    this.add(new THREE.TorusGeometry(1.2,.035,8,70),this.standard('#a8c9df',.48,.23),0,-1.15,0).rotation.x=Math.PI/2;
    this.add(new THREE.CylinderGeometry(.34,.37,.26,40),base,0,1.42,0);
    return wall;
  }
  gas(profile,r,discharge=false){
    this.glassChamber();
    const bright=new THREE.Color(profile.tint);
    const faint=new THREE.MeshBasicMaterial({
      color:discharge?bright:0xffffff,transparent:true,
      opacity:discharge?.54:.28,depthWrite:false
    });
    const particles=[];
    for(let i=0;i<(discharge?44:34);i++){
      const angle=r()*Math.PI*2,rr=Math.sqrt(r())*1.05;
      const p=this.add(new THREE.SphereGeometry(.025+r()*.035,9,7),faint,Math.cos(angle)*rr,-.94+r()*2.04,Math.sin(angle)*rr);
      particles.push({p,y:p.position.y,speed:.23+r()*.35,phase:r()*Math.PI*2});
    }
    this.effects.push({kind:'gas',particles});
    if(discharge){
      const path=new THREE.CatmullRomCurve3(Array.from({length:16},(_,i)=>{
        const y=-.99+i/15*2.0;
        return new THREE.Vector3(.28*Math.sin(i*.9+profile.seed),y,.19*Math.cos(i*.7+profile.seed));
      }));
      this.add(new THREE.TubeGeometry(path,70,.055,8,false),new THREE.MeshBasicMaterial({color:bright,transparent:true,opacity:.82}));
    }
  }
  liquid(profile,r,inVial){
    const fluid=this.standard(profile.tint,inVial?.15:.93,inVial?.23:.12);
    if(inVial){
      this.glassChamber();
      const body=this.add(new THREE.CylinderGeometry(1.16,1.16,1.08,64),fluid,0,-.60,0);
      body.scale.x=.97;body.scale.z=.97;
      const surface=this.add(new THREE.CylinderGeometry(1.12,1.12,.03,64),this.standard(new THREE.Color(profile.tint).multiplyScalar(1.11),.28,.18),0,-.06,0);
      const meniscus=this.add(new THREE.TorusGeometry(1.12,.029,9,64),this.standard(new THREE.Color(profile.tint).multiplyScalar(.82),.15,.3),0,-.035,0);
      meniscus.rotation.x=Math.PI/2;
      this.effects.push({kind:'fluid',surface,meniscus});
    }else{
      // Liquid metal droplet / warm gallium: reflective surface resting in the plinth.
      for(let i=0;i<4;i++){
        const radius=i===0?.95:.22+r()*.17;
        const x=i===0?0:(r()-.5)*1.75;
        const z=i===0?0:(r()-.5)*1.3;
        const ball=this.add(new THREE.SphereGeometry(radius,48,32),fluid,x,i===0?-.86:-1.1,z);
        ball.scale.set(i===0?1.33:1,.55,.95);
        const white=this.add(new THREE.SphereGeometry(radius*.23,20,14),
          new THREE.MeshBasicMaterial({color:0xeef8ff,transparent:true,opacity:.36}),
          x-.24*radius,i===0?-.54:-.98,z+.58*radius);
        white.scale.set(.9,.45,.38);
      }
    }
  }
  sealed(profile,r){
    // A sealed educational sample. Never suggests direct public handling of a hazardous element.
    const metal=this.standard(profile.tint,.83,.44);
    const chamber=this.translucent('#d0e4fa',.14);
    const casing=this.standard('#668198',.64,.3);
    const core=this.add(roughPoly(.85,profile.seed,1),metal,0,-.25,0);
    core.scale.set(1,.78,1.08);
    this.add(new THREE.CylinderGeometry(1.48,1.48,.13,64),casing,0,-1.37,0);
    this.add(new THREE.CylinderGeometry(1.45,1.45,2.32,48,1,true),chamber,0,-.14,0).renderOrder=2;
    const guard=this.add(new THREE.TorusGeometry(1.47,.045,8,64),casing,0,1.02,0);guard.rotation.x=Math.PI/2;
    const guard2=this.add(new THREE.TorusGeometry(1.47,.045,8,64),casing,0,-1.29,0);guard2.rotation.x=Math.PI/2;
    for(let j=0;j<5;j++){
      const theta=j*Math.PI*2/5;
      this.add(new THREE.SphereGeometry(.065,9,8),casing,Math.cos(theta)*1.46,-.98,Math.sin(theta)*1.46);
    }
  }
  unobserved(profile,r){
    // Crucially NOT a macroscopic element: only an abstract atomic-count installation.
    const frame=this.standard('#63809c',.15,.4);
    const lines=new THREE.MeshBasicMaterial({color:0x80c6fb,transparent:true,opacity:.32,wireframe:true});
    this.add(new THREE.IcosahedronGeometry(1.38,1),lines,0,-.07,0);
    this.add(new THREE.SphereGeometry(.12,20,14),new THREE.MeshBasicMaterial({color:0xdaf5ff}),0,-.07,0);
    for(let i=0;i<3;i++){
      const ring=this.add(new THREE.TorusGeometry(1.12+i*.12,.012,7,80),
        new THREE.MeshBasicMaterial({color:0xb9dbff,transparent:true,opacity:.5}),0,-.07,0);
      ring.rotation.set(.48+i*.51,.35+i*.8,.22+i*.16);
    }
    this.effects.push({kind:'trace'});
  }
  setElement(element){
    this.clear();
    this.profile=specimenProfile(element);
    const p=this.profile,r=random(p.seed);
    this.setupMuseumBase(p.seed);
    this.kind=p.kind;
    switch(p.kind){
      case 'metal-nugget':case 'metal-beads':case 'metal-crystal':
      case 'metal-rough':case 'metal-faceted':case 'metal-chip':case 'metal-cut':
        this.metalChunks(p,r,p.kind);break;
      case 'metal-ingot':case 'metal-foil':case 'metal-strip':
        this.metalIngots(p,r,p.kind);break;
      case 'crystal-shard':case 'crystal-facets':case 'crystal-cluster':
        this.crystal(p,r,p.kind);break;
      case 'layered':case 'glassy':
        this.layered(p,r,p.kind==='glassy');break;
      case 'powder':this.powder(p,r);break;
      case 'gas-vessel':case 'discharge-tube':this.gas(p,r,p.kind==='discharge-tube');break;
      case 'liquid-vial':case 'liquid-droplet':this.liquid(p,r,p.kind==='liquid-vial');break;
      case 'sealed':this.sealed(p,r);break;
      case 'unobserved':this.unobserved(p,r);break;
      default:this.metalChunks(p,r,'metal-rough');
    }
    this.group.rotation.y=.15+(p.z%7)*.14;
    this.camera.position.set(4.0+(p.z%3)*.16,2.75,8.3);
    this.controls.target.set(0,-.2,0);
    this.controls.update();
    this.resize();
    this.renderer.render(this.scene,this.camera);
  }
  resize(){
    const rect=this.canvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    this.renderer.setSize(rect.width,rect.height,false);
    this.camera.aspect=rect.width/rect.height;
    this.camera.updateProjectionMatrix();
  }
  animate(){
    if(this.disposed)return;
    requestAnimationFrame(()=>this.animate());
    if(document.hidden)return;
    const dt=Math.min(.045,this.clock.getDelta());
    this.timer+=dt;
    for(const e of this.effects){
      if(e.kind==='gas')for(const item of e.particles){
        item.p.position.y=item.y+.09*Math.sin(this.timer*item.speed*2+item.phase);
      }
      if(e.kind==='fluid'){
        const tilt=Math.sin(this.timer*.7)*.006;
        e.surface.rotation.z=tilt;e.meniscus.rotation.z=tilt;
      }
    }
    this.controls.update();
    this.renderer.render(this.scene,this.camera);
  }
  dispose(){
    if(this.disposed)return;
    this.disposed=true;
    this.observer.disconnect();
    this.controls.dispose();
    this.clear();
    this.renderer.dispose();
  }
}
