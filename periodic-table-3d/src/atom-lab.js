import {initElectronViz} from './electron-viz.js';
import {OrbitalCloud,orbitalOptions} from './orbital-cloud.js';

/** A single large 3-mode science workbench. The material/specimen viewer is untouched. */
export function initAtomLab(element){
  const bohrCanvas=document.querySelector('#atlas-atom');
  if(!bohrCanvas)return;
  const orbitalCanvas=document.querySelector('#orbital-cloud');
  const symbol=document.querySelector('#lab-symbol');
  const caption=document.querySelector('#lab-caption');
  const description=document.querySelector('#lab-mode-description');
  const choices=document.querySelector('#orbital-pickers');
  const webXR=document.querySelector('#lab-webxr');
  const play=document.querySelector('#electron-play');
  const download=document.querySelector('#lab-download');
  symbol.textContent=element.symbol+' / Z '+element.number;
  let mode='bohr',cloud=null;
  const viewer=initElectronViz(bohrCanvas,element);
  let arChecked=false;
  async function configureAR(){
    if(arChecked)return;
    arChecked=true;
    if(!viewer||!('xr' in navigator)||!window.isSecureContext){
      webXR.textContent='WebAR thực tế yêu cầu HTTPS và thiết bị có WebXR. Trên máy tính, giữ chuột phải rồi kéo để di chuyển mô hình.';
      return;
    }
    try{
      if(!await navigator.xr.isSessionSupported('immersive-ar'))throw new Error('AR không được hỗ trợ');
      const {ARButton}=await import('three/addons/webxr/ARButton.js');
      const button=ARButton.createButton(viewer.renderer,{optionalFeatures:['hit-test','dom-overlay'],domOverlay:{root:document.body}});
      button.classList.add('atom-ar-launch');
      button.title='Mở mô hình nguyên tử trong không gian thật (chỉ thiết bị tương thích)';
      webXR.replaceChildren(button);
    }catch(error){
      webXR.textContent='WebAR trên camera chưa được hỗ trợ ở thiết bị này. Bạn vẫn có thể kéo chuột phải để di chuyển nguyên tử trong không gian 3D.';
    }
  }
  function showMode(next){
    mode=next;
    const orbital=next==='orbital',ar=next==='ar';
    document.querySelectorAll('[data-lab-mode]').forEach(button=>{
      const active=button.dataset.labMode===mode;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-selected',String(active));
      button.tabIndex=active?0:-1;
    });
    bohrCanvas.hidden=orbital;
    orbitalCanvas.hidden=!orbital;
    choices.hidden=!orbital;
    webXR.hidden=!ar;
    play.hidden=orbital;
    download.hidden=ar;
    caption.textContent=orbital?'ORBITAL / ĐÁM MÂY XÁC SUẤT':ar?'WebAR / KÉO ĐỂ DI CHUYỂN':'BOHR / CHUYỂN ĐỘNG ELECTRON';
    description.textContent=orbital?
      'Chọn phân lớp bên dưới. Chuột trái xoay, cuộn phóng to, nhấp chuột phải tải PNG. Hình minh họa mật độ, không phải nghiệm lượng tử chính xác.':
      ar?'Chuột trái kéo để xoay; giữ chuột phải và kéo để di chuyển. Cuộn để thu phóng. Thiết bị hỗ trợ WebXR có thể bật AR qua camera.':
      'Chuột trái kéo để xoay; cuộn để thu phóng. Nhấp chuột phải để tải ảnh PNG. Electron chuyển động riêng theo từng lớp.';
    viewer?.setMode(ar?'ar':'bohr');
    if(orbital){
      if(!cloud){
        try{cloud=new OrbitalCloud(orbitalCanvas,element);}
        catch(e){console.warn('Orbital 3D unavailable',e);orbitalCanvas.replaceWith(document.createTextNode('Orbital 3D không thể tải trên trình duyệt này. Sơ đồ spin phía dưới vẫn hoạt động.'));download.disabled=true;}
      }
      cloud?.resize();cloud?.renderOnce();
    }else viewer?.resize();
    if(ar)configureAR();
  }
  document.querySelectorAll('[data-lab-mode]').forEach(button=>button.addEventListener('click',()=>showMode(button.dataset.labMode)));
  document.querySelector('#lab-reset').addEventListener('click',()=>{
    if(mode==='orbital')cloud?.reset();else viewer?.reset();
  });
  for(const option of [{label:'Tất cả',count:0},...orbitalOptions(element)]){
    const b=document.createElement('button');b.type='button';b.dataset.orbital=option.label==='Tất cả'?'all':option.label;
    b.textContent=option.label==='Tất cả'?'Tất cả':option.label+option.count;
    b.setAttribute('aria-pressed',String(b.dataset.orbital==='all'));
    choices.append(b);
  }
  choices.addEventListener('click',event=>{
    const b=event.target.closest('button[data-orbital]');
    if(!b||!cloud)return;
    cloud.setOrbital(b.dataset.orbital);
    choices.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  });
  const exportScreenshot=()=>{
    if(mode==='ar')return; // Right-drag in WebAR is reserved for panning.
    const current=mode==='orbital'?cloud:viewer;
    const canvas=mode==='orbital'?orbitalCanvas:bohrCanvas;
    if(!current||!canvas?.toDataURL)return;
    try{
      current.renderOnce();
      const url=canvas.toDataURL('image/png');
      const link=document.createElement('a');
      link.href=url;
      link.download='atlas-'+element.symbol+'-'+(mode==='orbital'?'orbital':'bohr')+'.png';
      document.body.append(link);link.click();link.remove();
    }catch(e){
      console.warn('PNG export unavailable',e);
      description.textContent='Không thể xuất ảnh ở chế độ này. Hãy thử khi mô hình 3D đã tải xong.';
    }
  };
  // A stationary right-click downloads. A right-button drag does NOT download.
  // Desktop WebAR uses right-drag to pan and left-drag to rotate instead.
  for(const canvas of [bohrCanvas,orbitalCanvas]){
    let rightDrag=null;
    canvas.addEventListener('pointerdown',event=>{
      if(event.pointerType==='mouse'&&event.button===2)
        rightDrag={x:event.clientX,y:event.clientY,moved:false};
    });
    canvas.addEventListener('pointermove',event=>{
      if(rightDrag&&Math.hypot(event.clientX-rightDrag.x,event.clientY-rightDrag.y)>6)
        rightDrag.moved=true;
    });
    canvas.addEventListener('pointercancel',()=>{rightDrag=null;});
    canvas.addEventListener('contextmenu',event=>{
      // OrbitControls also suppresses the browser menu; download only on a click.
      event.preventDefault();
      if(mode!=='ar'&&!rightDrag?.moved&&event.isTrusted)exportScreenshot();
      rightDrag=null;
    });
  }
  // On touchscreens where right-click is not available, keep the fallback button.
  download.addEventListener('click',exportScreenshot);
  showMode('bohr');
}
