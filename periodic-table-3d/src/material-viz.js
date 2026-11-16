import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Interpretive sample models, NOT scanned specimens or a guarantee of visual appearance.
 * Different physical families get different geometry, not just a palette swap.
 */
const PRESETS = {
  Fe:['i-beam','Thép / sắt khối','Dầm chữ I làm bằng thép là hình ảnh công nghiệp điển hình của vật liệu dựa trên sắt. Màu xám kim loại và mặt cắt chữ I là minh họa sản phẩm, không phải hình dạng tự nhiên duy nhất của sắt.'],
  Cu:['coil','Dây đồng cuộn','Đồng kim loại có sắc đỏ cam đặc trưng và thường được kéo thành dây điện. Mô hình mô tả một đoạn dây đồng cuộn.'],
  Au:['ingot','Thỏi vàng','Vàng kim loại có ánh vàng kim; thỏi đúc là một dạng phổ biến trong lưu trữ và trưng bày.'],
  Ag:['coin','Đồng bạc','Bạc có ánh kim sáng; đồng xu là một hiện vật quen thuộc được làm bằng bạc hoặc hợp kim bạc.'],
  Al:['sheet','Tấm nhôm','Nhôm thường được gia công thành tấm mỏng, lon và các chi tiết nhẹ có bề mặt bạc mờ.'],
  Ni:['cylinder','Mẫu hợp kim Nickel','Nickel là kim loại màu bạc trắng, bền và chống ăn mòn. Mô hình là mẫu kim loại dạng trụ dùng để gợi hình mẫu vật, không phải hình dạng tự nhiên.'],
  Zn:['sheet','Lá kẽm','Kẽm có sắc xám bạc, thường gặp trong lớp mạ và tấm kim loại.'],
  Sn:['ingot','Thỏi thiếc','Thiếc là kim loại sáng bạc, có thể được đúc thành thỏi hoặc gia công thành lớp phủ mỏng.'],
  Pb:['ingot','Thỏi chì','Chì là kim loại nặng, mềm, thường có bề mặt xám xanh và dễ xỉn màu.'],
  C:['graphite','Các lớp than chì','Carbon có nhiều dạng thù hình. Hình minh họa này chọn than chì gồm các lớp vật liệu xếp chồng.'],
  S:['sulfur','Tinh thể lưu huỳnh','Lưu huỳnh nguyên tố thường có màu vàng và tạo tinh thể đặc trưng.'],
  Si:['crystal','Tinh thể silic','Silic tinh khiết có sắc xám ánh kim, giòn và thường liên hệ tới các tinh thể dùng trong điện tử.'],
  B:['crystal','Tinh thể bo','Bo có thể tồn tại dạng vật liệu rắn tinh thể, khá cứng và giòn.'],
  I:['crystal','Tinh thể iốt','Iốt ở điều kiện thường là chất rắn tinh thể màu tím sẫm, có thể thăng hoa.'],
  Hg:['mercury','Giọt thủy ngân','Thủy ngân là kim loại lỏng có bề mặt phản xạ mạnh ở nhiệt độ phòng. Đây là mô phỏng giọt lỏng, không phải mẫu để tương tác ngoài đời.'],
  Br:['bromine','Chất lỏng brom','Brom là phi kim lỏng màu nâu đỏ ở nhiệt độ thường. Mô hình chỉ thể hiện mặt chất lỏng trong vật chứa minh họa.'],
  H:['gas-molecule','Phân tử khí H₂','Hydrogen ở điều kiện thường tồn tại chủ yếu ở dạng phân tử H₂. Các quả cầu tượng trưng cho phân tử, không theo tỉ lệ thực.'],
  N:['gas-molecule','Phân tử khí N₂','Nitơ tồn tại chủ yếu dưới dạng khí hai nguyên tử N₂ ở điều kiện thường.'],
  O:['gas-molecule','Phân tử khí O₂','Oxi khí chủ yếu tồn tại dưới dạng phân tử hai nguyên tử O₂.'],
  F:['gas-molecule','Phân tử khí F₂','Flo là khí ở điều kiện thường, thường tồn tại ở dạng phân tử F₂.'],
  Cl:['gas-molecule','Phân tử khí Cl₂','Clo tồn tại ở trạng thái khí tại điều kiện thường, với phân tử gồm hai nguyên tử.'],
  He:['gas','Khí heli','Heli là khí đơn nguyên tử ở điều kiện thường. Mô hình là đám hạt tách rời trong một thể tích minh họa.'],
  Ne:['gas','Khí neon','Neon là khí đơn nguyên tử, không có hình dạng cố định ở điều kiện thường.'],
  Ar:['gas','Khí argon','Argon là khí hiếm, thường tồn tại dưới dạng các nguyên tử riêng lẻ.'],
  Kr:['gas','Khí krypton','Krypton là một khí hiếm ở điều kiện thường.'],
  Xe:['gas','Khí xenon','Xenon là khí hiếm; sự phân tán các hạt biểu diễn trạng thái khí.'],
  Rn:['gas','Khí radon','Radon là khí hiếm có tính phóng xạ. Mô hình đám hạt không biểu diễn bức xạ.'],
  U:['ore','Quặng chứa urani','Urani là kim loại có tính phóng xạ; trong tự nhiên thường gặp trong khoáng vật. Khối đá là minh họa quặng, không khẳng định một màu sắc hoặc dạng tinh thể duy nhất.'],
  Th:['ore','Khoáng vật chứa thori','Thori có tính phóng xạ; mô hình dùng đá khoáng làm hình ảnh gợi ý, không phải mẫu vật xác thực.'],
  Ra:['ore','Khoáng vật chứa radi','Radi có tính phóng xạ và hiện diện rất ít trong tự nhiên; mô hình là đá khoáng minh họa, không phải hình dạng của radi tinh khiết.']
};
const GAS = new Set(['H','He','N','O','F','Ne','Cl','Ar','Kr','Xe','Rn']);
const UNKNOWN = new Set(['Rf','Db','Sg','Bh','Hs','Mt','Ds','Rg','Cn','Nh','Fl','Mc','Lv','Ts','Og']);
function fallback(el){
  if(UNKNOWN.has(el.symbol))return ['unknown','Chưa có mẫu vật vĩ mô được xác nhận','Nguyên tố siêu nặng được tạo ra với lượng rất nhỏ. Không có dạng mẫu vật lớn đủ để xác nhận hình dạng ngoài đời thường; vì vậy chỉ hiển thị mô hình ký hiệu trừu tượng.'];
  if(GAS.has(el.symbol))return ['gas','Trạng thái khí','Đám hạt phân tán biểu thị chất khí. Mô hình hạt có tính minh họa, không phải ảnh chụp hoặc kích thước thực.'];
  if(el.category==='actinide')return ['ore','Mẫu khoáng minh họa','Các nguyên tố dãy Actini có tính phóng xạ. Mô hình đá khoáng chỉ mang tính tượng trưng, không dùng để suy đoán hình dạng mẫu thật.'];
  if(el.category==='lanthanide')return ['ingot','Kim loại đất hiếm','Nhiều nguyên tố họ Lantan là kim loại màu bạc; thỏi kim loại là dạng trưng bày giả định.'];
  if(el.category==='a-kim')return ['crystal','Vật liệu tinh thể','Á kim thường có cấu trúc tinh thể rắn, một số có mặt cắt sắc và bề mặt bán ánh kim.'];
  if(el.category==='phi-kim')return ['crystal','Mẫu phi kim rắn','Minh họa một mảnh vật liệu tinh thể. Màu sắc và dạng thù hình thực tế có thể thay đổi tùy chất.'];
  if(el.category==='kiem-tho'||el.category==='kim-loai-kiem')return ['ingot','Kim loại rắn','Biểu diễn dạng thỏi kim loại để làm rõ trạng thái rắn; mẫu thật có thể có lớp oxit và hình dạng khác.'];
  return ['cylinder','Mẫu kim loại gia công','Mô hình là một mẫu vật kim loại gia công với bề mặt ánh kim để minh họa nhóm tính chất.'];
}
export function materialInfo(el){const [kind,title,description]=PRESETS[el.symbol]||fallback(el);return {kind,title,description,representative:!!PRESETS[el.symbol],speculative:UNKNOWN.has(el.symbol)};}

function createBaseGeometry(kind){
  if(kind==='i-beam')return 'metal';
  return kind;
}
export class MaterialViz {
  constructor(canvas){
    this.canvas=canvas;this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(40,1,.1,100);
    this.camera.position.set(3.8,2.8,8.6);
    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.35;
    this.scene.add(new THREE.AmbientLight(0xffffff,1.85));
    const key=new THREE.DirectionalLight(0xffe7d0,3);key.position.set(-4,9,8);this.scene.add(key);
    const edge=new THREE.DirectionalLight(0xb5d6ed,2);edge.position.set(8,2,-5);this.scene.add(edge);
    this.group=new THREE.Group();this.scene.add(this.group);
    this.controls=new OrbitControls(this.camera,canvas);this.controls.enableDamping=true;
    this.controls.enablePan=false;this.controls.autoRotate=true;this.controls.autoRotateSpeed=.45;
    this.controls.minDistance=5;this.controls.maxDistance=15;
    this.clock=new THREE.Clock();this.timer=0;
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas.parentElement);
    this.resize();this.animate();
    window.addEventListener('pagehide',()=>{this.observer.disconnect();this.controls.dispose();this.renderer.dispose();},{once:true});
  }
  clear(){
    this.group.traverse(o=>{o.geometry?.dispose?.();const m=o.material;if(m){(Array.isArray(m)?m:[m]).forEach(mat=>mat.dispose());}});
    this.group.clear();
  }
  mesh(geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);this.group.add(m);return m;}
  material(color,metalness=.6,roughness=.35){return new THREE.MeshStandardMaterial({color,metalness,roughness,side:THREE.DoubleSide});}
  setElement(el){
    this.clear();
    const info=materialInfo(el);this.kind=info.kind;
    const metal=this.material(el.symbol==='Au'?0xd5ad58:el.symbol==='Cu'?0xb66b43:el.symbol==='Al'?0xadb9bd:el.symbol==='Ni'?0xa1aaa8:0x8e9699);
    switch(info.kind){
      case 'i-beam':{
        // I-profile rail: two flanges plus a central vertical web.
        const group=new THREE.Group();this.group.add(group);
        const make=(w,h,d,x,y,z)=>{
          const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),metal);m.position.set(x,y,z);group.add(m);
        };
        make(2.5,.25,3.1,0, .76,0);make(2.5,.25,3.1,0,-.76,0);make(.23,1.4,3.1,0,0,0);
        group.rotation.y=.4;group.rotation.x=-.10;break;
      }
      case 'coil':{
        const pts=[];const turns=7;
        for(let i=0;i<=270;i++){const t=i/270*turns*2*Math.PI;pts.push(new THREE.Vector3(Math.cos(t)*.95,(i/270-.5)*2.3,Math.sin(t)*.95));}
        const curve=new THREE.CatmullRomCurve3(pts);const wire=this.mesh(new THREE.TubeGeometry(curve,450,.10,12,false),metal);
        wire.rotation.z=Math.PI/4;break;
      }
      case 'coin':{
        const coin=this.mesh(new THREE.CylinderGeometry(1.36,1.36,.18,72),this.material(0xc5ced1,.83,.17));
        coin.rotation.x=.32;const ring=this.mesh(new THREE.TorusGeometry(1.10,.035,6,72),this.material(0xa6b0b4,.82,.3));
        ring.position.y=.11;ring.rotation.x=Math.PI/2+.32;break;
      }
      case 'sheet':{
        const sheet=this.mesh(new THREE.BoxGeometry(2.85,.10,2.05),metal);sheet.rotation.set(.22,.4,-.08);
        for(let i=0;i<5;i++){const groove=this.mesh(new THREE.BoxGeometry(2.5,.011,.026),this.material(0x616a6c,.5,.6),0,.064,-.70+i*.34);groove.rotation.copy(sheet.rotation);}
        break;
      }
      case 'ingot':{
        const body=this.mesh(new THREE.CylinderGeometry(1.10,1.40,.88,4,1),metal);
        body.rotation.y=Math.PI/4;body.position.y=-.02;body.scale.set(1,1,1.3);break;
      }
      case 'cylinder':{
        const cylinder=this.mesh(new THREE.CylinderGeometry(1.12,1.12,1.55,48),metal);cylinder.rotation.z=.55;
        const stripe=this.mesh(new THREE.TorusGeometry(1.115,.028,8,65),this.material(0x5d6769,.65,.5));
        stripe.rotation.x=Math.PI/2;stripe.rotation.y=.55;break;
      }
      case 'graphite':{
        const dark=this.material(0x3a4244,.13,.84);
        for(let i=0;i<9;i++){
          const layer=this.mesh(new THREE.BoxGeometry(2.5,.12,1.5),dark,0,-.7+i*.18,0);
          layer.rotation.y=.3;layer.position.x=(i%3-1)*.06;
        }break;
      }
      case 'crystal':{
        const col=el.symbol==='S'?0xe0c65d:el.symbol==='I'?0x5c456f:el.symbol==='Si'?0x7c8995:0x7b8189;
        const mat=this.material(col,.16,.37);
        for(let i=0;i<7;i++){
          const shard=this.mesh(new THREE.OctahedronGeometry(.45+(i%3)*.13,0),mat,
            Math.sin(i*2.4)*.88,-.35+(i%4)*.18,Math.cos(i*2.4)*.74);
          shard.scale.set(.75,1.35+(i%2)*.35,.8);shard.rotation.y=i*.55;
        }break;
      }
      case 'mercury':case 'bromine':{
        const isHg=info.kind==='mercury';
        const col=isHg?0xbfc7cc:0x9d4b34;
        const liquid=this.mesh(new THREE.SphereGeometry(1.6,56,40),this.material(col,isHg?.96:.1,isHg?.08:.25));
        liquid.scale.set(1.35,.39,.98);liquid.position.y=-.56;
        const droplet=this.mesh(new THREE.SphereGeometry(.38,32,24),this.material(col,isHg?.96:.1,.14),.86,-.18,.35);
        droplet.scale.y=.65;break;
      }
      case 'gas':case 'gas-molecule':{
        const molecule=info.kind==='gas-molecule';
        const mat=this.material(el.symbol==='Cl'?0x95ad83:el.symbol==='O'?0x869eba:0xb5b3a8,.0,.62);
        const ballGeo=new THREE.SphereGeometry(molecule?.095:.07,12,10);
        const n=molecule?26:115;
        for(let i=0;i<n;i++){
          const r=1.7*Math.cbrt(((i*37)%n+1)/n);
          const a=i*2.39996,p=Math.acos(1-2*(i+.5)/n);
          const x=r*Math.cos(a)*Math.sin(p),y=r*Math.sin(a)*Math.sin(p),z=r*Math.cos(p);
          this.mesh(ballGeo,mat,x,y,z);
          if(molecule)this.mesh(ballGeo,mat,x+.14,y+.05,z);
        }
        const boundary=this.mesh(new THREE.IcosahedronGeometry(2.08,2),new THREE.MeshBasicMaterial({color:0xaeb5b6,wireframe:true,transparent:true,opacity:.14}));
        boundary.rotation.y=.25;break;
      }
      case 'ore':{
        const col=this.material(0x625b50,.12,.89);
        const rock=this.mesh(new THREE.IcosahedronGeometry(1.55,1),col);rock.scale.set(1.15,.85,.90);rock.rotation.set(.2,.5,.1);
        for(let i=0;i<10;i++){
          const bit=this.mesh(new THREE.TetrahedronGeometry(.15+i%3*.035),this.material(i%2?0x958475:0x50483e,.05,.94),
          Math.sin(i*2.22)*1.04,Math.cos(i*1.13)*.6,Math.cos(i*2.22)*.75);
          bit.rotation.y=i*.8;
        }break;
      }
      case 'unknown':{
        const mat=new THREE.MeshBasicMaterial({color:0x8d9698,wireframe:true,transparent:true,opacity:.45});
        const frame=this.mesh(new THREE.IcosahedronGeometry(1.6,1),mat);frame.rotation.set(.22,.18,.1);
        const core=this.mesh(new THREE.OctahedronGeometry(.75,0),this.material(0x77828a,.1,.75));core.scale.set(.9,1.2,.95);break;
      }
      default:this.mesh(new THREE.BoxGeometry(2,1,1.5),metal);
    }
  }
  resize(){
    const r=this.canvas.getBoundingClientRect();if(!r.width||!r.height)return;
    this.renderer.setSize(r.width,r.height,false);this.camera.aspect=r.width/r.height;this.camera.updateProjectionMatrix();
  }
  animate(){
    requestAnimationFrame(()=>this.animate());
    if(document.hidden)return;
    const dt=Math.min(.04,this.clock.getDelta());this.timer+=dt;
    this.controls.update();
    if(this.kind==='gas'||this.kind==='gas-molecule')this.group.rotation.y+=dt*.055;
    this.renderer.render(this.scene,this.camera);
  }
}
