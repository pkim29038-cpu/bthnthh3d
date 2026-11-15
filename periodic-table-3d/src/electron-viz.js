import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {electronShells} from './chemistry.js';

/** Separate electron motions: each shell spins independently; nucleus stays in place. */
export class ElectronViz {
  constructor(canvas,element){
    this.canvas=canvas;
    this.element=element;
    this.playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.scene=new THREE.Scene();
    // Include the dark laboratory background in browser 'Save image as…' PNGs.
    this.scene.background=new THREE.Color(0x08152e);
    this.camera=new THREE.PerspectiveCamera(42,1,.1,120);
    this.camera.position.set(0.4,1.5,13.0);
    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    this.renderer.xr.enabled=true;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.scene.add(new THREE.AmbientLight(0xffffff,1.55));
    const key=new THREE.PointLight(0x7ae8ff,80,30);key.position.set(4,6,7);this.scene.add(key);
    const fill=new THREE.PointLight(0xb692ff,55,30);fill.position.set(-3,-2,-5);this.scene.add(fill);
    this.root=new THREE.Group();this.scene.add(this.root);
    this.controls=new OrbitControls(this.camera,canvas);
    this.controls.enableDamping=true;this.controls.enablePan=false;
    this.controls.minDistance=5;this.controls.maxDistance=22;
    this.controls.autoRotate=true;this.controls.autoRotateSpeed=.26;
    this.spinners=[];
    this._build(element);
    this.clock=new THREE.Clock();
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas.parentElement);
    this.resize();
    this.renderer.setAnimationLoop(()=>this.tick());
    this.renderer.xr.addEventListener('sessionstart',()=>{
      this.scene.background=null; // transparent for the real camera feed
      this.controls.enabled=false;
      this.root.position.set(0,1.35,-1.7);this.root.scale.setScalar(.22);
    });
    this.renderer.xr.addEventListener('sessionend',()=>{
      this.scene.background=new THREE.Color(0x08152e);
      this.controls.enabled=true;
      this.root.position.set(0,0,0);this.root.scale.setScalar(1);
    });
    window.addEventListener('pagehide',()=>{this.observer.disconnect();this.renderer.setAnimationLoop(null);this.controls.dispose();this.renderer.dispose();},{once:true});
  }
  _build(element){
    const n=Math.min(55,element.number);
    const geonucleon=new THREE.SphereGeometry(.135,12,10);
    const protons=new THREE.MeshStandardMaterial({color:0xff7694,roughness:.33,metalness:.12,emissive:0x8f1d40,emissiveIntensity:.27});
    const neutrons=new THREE.MeshStandardMaterial({color:0x688ffb,roughness:.35,metalness:.12,emissive:0x1a3cb8,emissiveIntensity:.25});
    for(let i=0;i<n;i++){
      const theta=i*2.399963,r=.25+.52*Math.cbrt((i+1)/n),z=1-2*(i+.5)/n,p=Math.acos(z);
      const ball=new THREE.Mesh(geonucleon,i%2?neutrons:protons);
      ball.position.set(Math.cos(theta)*Math.sin(p)*r,Math.sin(theta)*Math.sin(p)*r,Math.cos(p)*r);
      this.root.add(ball);
    }
    const electronGeo=new THREE.SphereGeometry(.083,18,14);
    const electronMatA=new THREE.MeshBasicMaterial({color:0x6ef5ff});
    const electronMatB=new THREE.MeshBasicMaterial({color:0xc4a0ff});
    const levels=electronShells(element);
    levels.forEach((count,i)=>{
      const rad=1.35+i*.57;
      // Different tilted orbital planes, each with its own electron spinner.
      const plane=new THREE.Group();plane.rotation.set(i*.29+.25,.31+i*.36,.18+i*.21);this.root.add(plane);
      const orbit=new THREE.Mesh(new THREE.TorusGeometry(rad,.012,8,192),
        new THREE.MeshBasicMaterial({color:i%2?0x8d9dff:0x67c8ff,transparent:true,opacity:.57}));
      plane.add(orbit);
      const moving=new THREE.Group();plane.add(moving);
      for(let j=0;j<count;j++){
        const theta=(Math.PI*2*j)/count;
        const sphere=new THREE.Mesh(electronGeo,j%2?electronMatB:electronMatA);
        sphere.position.set(Math.cos(theta)*rad,Math.sin(theta)*rad,0);
        moving.add(sphere);
      }
      this.spinners.push({group:moving,speed:(i%2?-1:1)*(.8/(1+i*.28))});
    });
    const aura=new THREE.Mesh(new THREE.SphereGeometry(1.02,22,16),
      new THREE.MeshBasicMaterial({color:0x6285ff,transparent:true,opacity:.045,depthWrite:false}));
    this.root.add(aura);
  }
  setMode(mode){
    // Consistent desktop controls: LEFT rotates, RIGHT drags the model.
    this.controls.mouseButtons.LEFT=THREE.MOUSE.ROTATE;
    this.controls.mouseButtons.RIGHT=THREE.MOUSE.PAN;
    this.controls.touches.ONE=THREE.TOUCH.ROTATE;
    this.controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
    this.controls.enablePan=mode==='ar';
    this.controls.enableRotate=true;
    this.controls.enableZoom=true;
    this.controls.update();
  }
  reset(){this.controls.reset();this.root.rotation.set(0,0,0);}
  renderOnce(){this.renderer.render(this.scene,this.camera);}
  setPlaying(yes){
    this.playing=Boolean(yes);
    this.controls.autoRotate=this.playing;
  }
  resize(){
    const r=this.canvas.getBoundingClientRect();if(!r.width||!r.height)return;
    this.renderer.setSize(r.width,r.height,false);
    this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();
    const maxRad=1.35+(electronShells(this.element).length-1)*.57;
    // Keep all electron shells in view even for the heaviest elements.
    const required=maxRad/(Math.tan(THREE.MathUtils.degToRad(this.camera.fov)/2)*.72);
    const distance=Math.max(11,required);
    this.camera.position.set(.3,1.2,distance);this.camera.lookAt(0,0,0);
    this.controls.minDistance=Math.max(7,distance*.64);
    this.controls.maxDistance=Math.max(17,distance*1.7);
    this.controls.update();
  }
  tick(){
    const dt=Math.min(.04,this.clock.getDelta());
    if(document.hidden)return;
    if(this.playing)for(const spinner of this.spinners)spinner.group.rotation.z+=spinner.speed*dt;
    if(!this.renderer.xr.isPresenting)this.controls.update();
    this.renderer.render(this.scene,this.camera);
  }
}

export function initElectronViz(canvas,element){
  try{
    const viz=new ElectronViz(canvas,element);
    const btn=document.querySelector('#electron-play');
    if(btn){
      const update=()=>{
        btn.textContent=viz.playing?'Tạm dừng ⏸':'Tiếp tục ▶';
        btn.setAttribute('aria-label',viz.playing?'Tạm dừng electron chuyển động':'Tiếp tục chuyển động electron');
        btn.setAttribute('aria-pressed',String(viz.playing));
      };
      btn.addEventListener('click',()=>{viz.setPlaying(!viz.playing);update();});
      update();
    }
    return viz;
  }catch(error){
    console.warn('Electron 3D unavailable',error);
    canvas.replaceWith(document.createTextNode('Trình duyệt không tải được mô hình WebGL. Vẫn có thể xem sơ đồ orbital và cấu hình electron.'));
    document.querySelector('#electron-play')?.remove();
    return null;
  }
}
