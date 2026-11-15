import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { elements } from './elements.js';
import './style.css';

const categoryMeta = {
  'kim-loai-kiem': ['Kim loại kiềm', '#ffb45f'],
  'kiem-tho': ['Kim loại kiềm thổ', '#f6d36e'],
  'kim-loai-chuyen-tiep': ['Kim loại chuyển tiếp', '#42c9ed'],
  'kim-loai-hau-chuyen-tiep': ['Kim loại hậu chuyển tiếp', '#65d6a7'],
  'a-kim': ['Á kim', '#b6a0ff'],
  'phi-kim': ['Phi kim', '#80aaff'],
  'khi-hiem': ['Khí hiếm', '#f28cc9'],
  'lanthanide': ['Họ Lantan', '#e9a0d8'],
  'actinide': ['Họ Actini', '#e58e9d']
};
const $ = (s) => document.querySelector(s);
const grid = $('#periodic-grid');
const search = $('#search');
let activeCategory = 'all';
let activeElement = elements.find(e => e.symbol === 'Fe');
let viewMode = '2d';
let toastTimer;

function makeCard(el) {
  const [label, color] = categoryMeta[el.category];
  const button = document.createElement('button');
  button.className = 'element-card';
  button.type = 'button';
  button.dataset.number = el.number;
  button.dataset.category = el.category;
  button.style.setProperty('--element-color', color);
  button.style.gridColumn = el.column;
  button.style.gridRow = el.row;
  button.setAttribute('aria-label', `${el.name}, ${el.symbol}, số hiệu ${el.number}`);
  button.innerHTML = `<span class="atomic-number">${el.number}</span><span class="element-symbol">${el.symbol}</span><span class="element-name">${el.name}</span>`;
  button.addEventListener('click', () => selectElement(el));
  return button;
}
const cards = new Map();
elements.forEach(el => {
  const card = makeCard(el);
  cards.set(el.number, card);
  grid.appendChild(card);
});

function renderFilters() {
  const filters = $('#filters');
  const entries = [['all', 'Tất cả'], ...Object.entries(categoryMeta).map(([key, meta]) => [key, meta[0]])];
  filters.innerHTML = entries.map(([key, label]) => {
    const color = key === 'all' ? '#91a6c8' : categoryMeta[key][1];
    return `<button class="filter-chip ${key === 'all' ? 'selected' : ''}" data-filter="${key}" style="--chip-color:${color}"><i></i>${label}</button>`;
  }).join('');
  filters.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-filter]');
    if (!chip) return;
    activeCategory = chip.dataset.filter;
    filters.querySelectorAll('.filter-chip').forEach(b => b.classList.toggle('selected', b === chip));
    applyFilters();
  });
}
function applyFilters() {
  const query = search.value.trim().toLocaleLowerCase('vi');
  let visible = 0;
  elements.forEach(el => {
    const matchesText = !query || [el.name, el.symbol, String(el.number)].some(v => v.toLocaleLowerCase('vi').includes(query));
    const matchesCategory = activeCategory === 'all' || activeCategory === el.category;
    const show = matchesText && matchesCategory;
    const card = cards.get(el.number);
    card.classList.toggle('is-hidden', !show);
    card.classList.toggle('is-dimmed', !show && (query || activeCategory !== 'all'));
    visible += show ? 1 : 0;
  });
  $('#visible-count')?.remove();
  const count = document.createElement('span');
  count.id = 'visible-count';
  count.textContent = `${visible} / 118 NGUYÊN TỐ`;
  $('.table-foot span:last-child').textContent = count.textContent;
}
function renderLegend() {
  $('#legend').innerHTML = Object.entries(categoryMeta).map(([key, [label, color]]) =>
    `<span><i style="--legend-color:${color}"></i>${label}</span>`).join('');
}
renderFilters();
renderLegend();
search.addEventListener('input', applyFilters);
search.addEventListener('keydown', e => { if (e.key === 'Escape') { search.value = ''; applyFilters(); } });
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); search.focus(); }
});

const mass = {
  H:'1.008', He:'4.0026', Li:'6.94', Be:'9.0122', B:'10.81', C:'12.011', N:'14.007', O:'15.999', F:'18.998', Ne:'20.180',
  Na:'22.990', Mg:'24.305', Al:'26.982', Si:'28.085', P:'30.974', S:'32.06', Cl:'35.45', Ar:'39.948', K:'39.098', Ca:'40.078',
  Sc:'44.956', Ti:'47.867', V:'50.942', Cr:'51.996', Mn:'54.938', Fe:'55.845', Co:'58.933', Ni:'58.693', Cu:'63.546', Zn:'65.38',
  Ga:'69.723', Ge:'72.630', As:'74.922', Se:'78.971', Br:'79.904', Kr:'83.798', Rb:'85.468', Sr:'87.62', Y:'88.906', Zr:'91.224',
  Nb:'92.906', Mo:'95.95', Tc:'[98]', Ru:'101.07', Rh:'102.91', Pd:'106.42', Ag:'107.87', Cd:'112.41', In:'114.82', Sn:'118.71',
  Sb:'121.76', Te:'127.60', I:'126.90', Xe:'131.29', Cs:'132.91', Ba:'137.33', La:'138.91', Ce:'140.12', Pr:'140.91', Nd:'144.24',
  Pm:'[145]', Sm:'150.36', Eu:'151.96', Gd:'157.25', Tb:'158.93', Dy:'162.50', Ho:'164.93', Er:'167.26', Tm:'168.93', Yb:'173.05',
  Lu:'174.97', Hf:'178.49', Ta:'180.95', W:'183.84', Re:'186.21', Os:'190.23', Ir:'192.22', Pt:'195.08', Au:'196.97', Hg:'200.59',
  Tl:'204.38', Pb:'207.2', Bi:'208.98', Po:'[209]', At:'[210]', Rn:'[222]', Fr:'[223]', Ra:'[226]', Ac:'[227]', Th:'232.04',
  Pa:'231.04', U:'238.03', Np:'[237]', Pu:'[244]', Am:'[243]', Cm:'[247]', Bk:'[247]', Cf:'[251]', Es:'[252]', Fm:'[257]',
  Md:'[258]', No:'[259]', Lr:'[266]', Rf:'[267]', Db:'[268]', Sg:'[269]', Bh:'[270]', Hs:'[277]', Mt:'[278]', Ds:'[281]',
  Rg:'[282]', Cn:'[285]', Nh:'[286]', Fl:'[289]', Mc:'[290]', Lv:'[293]', Ts:'[294]', Og:'[294]'
};
const categoryNames = Object.fromEntries(Object.entries(categoryMeta).map(([k,v]) => [k,v[0]]));
const stateBySymbol = {Hg:'Lỏng', Br:'Lỏng', H:'Khí', He:'Khí', N:'Khí', O:'Khí', F:'Khí', Ne:'Khí', Cl:'Khí', Ar:'Khí', Kr:'Khí', Xe:'Khí', Rn:'Khí'};
const electronegativity = {H:'2.20', Li:'0.98', C:'2.55', N:'3.04', O:'3.44', F:'3.98', Na:'0.93', Mg:'1.31', Al:'1.61', Si:'1.90', P:'2.19', S:'2.58', Cl:'3.16', K:'0.82', Ca:'1.00', Fe:'1.83', Cu:'1.90', Zn:'1.65', Br:'2.96', I:'2.66', Au:'2.54'};

const orbitalOrder = [
  ['1s',2],['2s',2],['2p',6],['3s',2],['3p',6],['4s',2],['3d',10],['4p',6],
  ['5s',2],['4d',10],['5p',6],['6s',2],['4f',14],['5d',10],['6p',6],
  ['7s',2],['5f',14],['6d',10],['7p',6]
];
const superscripts = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
function orbitalConfiguration(number, symbol) {
  const filled = {};
  let left = number;
  for (const [orbital, capacity] of orbitalOrder) {
    const take = Math.min(left, capacity);
    if (take > 0) filled[orbital] = take;
    left -= take;
    if (!left) break;
  }
  const exceptions = {
    Cr:{'4s':1,'3d':5}, Cu:{'4s':1,'3d':10}, Nb:{'5s':1,'4d':4}, Mo:{'5s':1,'4d':5},
    Ru:{'5s':1,'4d':7}, Rh:{'5s':1,'4d':8}, Pd:{'5s':0,'4d':10}, Ag:{'5s':1,'4d':10},
    Pt:{'6s':1,'5d':9}, Au:{'6s':1,'5d':10}
  };
  if (exceptions[symbol]) Object.assign(filled, exceptions[symbol]);
  return orbitalOrder.filter(([orbital]) => (filled[orbital] || 0) > 0)
    .map(([orbital]) => [orbital, filled[orbital]]);
}
function shellDistribution(number, symbol='') {
  const shells = [];
  for (const [orbital, count] of orbitalConfiguration(number, symbol)) {
    const shell = Number(orbital[0]) - 1;
    shells[shell] = (shells[shell] || 0) + count;
  }
  return shells.filter(v => v > 0);
}
function selectElement(el) {
  activeElement = el;
  document.querySelectorAll('.element-card').forEach(card => card.classList.toggle('active', Number(card.dataset.number) === el.number));
  const [label, color] = categoryMeta[el.category];
  $('#detail-index').textContent = `${String(el.number).padStart(3,'0')} / 118`;
  $('#detail-symbol').textContent = el.symbol;
  $('#detail-symbol').style.setProperty('--element-color', color);
  $('#detail-name').textContent = el.name;
  $('#detail-latin').textContent = `${el.name} · ${el.symbol}`;
  $('#metric-number').textContent = el.number;
  $('#metric-mass').textContent = mass[el.symbol] || '—';
  $('#metric-group').textContent = el.category === 'lanthanide' ? '3*' : el.category === 'actinide' ? '3*' : el.group;
  $('#metric-period').textContent = el.period;
  $('#property-category').textContent = label;
  $('#property-state').textContent = stateBySymbol[el.symbol] || (['khi-hiem','phi-kim'].includes(el.category) ? 'Khí / tùy điều kiện' : 'Rắn (thường gặp)');
  $('#property-electro').textContent = electronegativity[el.symbol] || '—';
  $('#atom-protons').textContent = `${el.number} PROTON`;
  $('#atom-electrons').textContent = `${el.number} ELECTRON`;
  const shells = shellDistribution(el.number, el.symbol);
  $('#shell-bars').innerHTML = shells.map((count, i) => `<div class="shell-pill"><span>LỚP ${i+1}</span><b>${count}</b></div>`).join('');
  $('#electron-config').textContent = electronConfiguration(el);
  $('#detail-note').textContent = `${el.name} (${el.symbol}) thuộc ${label.toLocaleLowerCase('vi')}. Mô hình minh họa cấu trúc electron theo số hiệu nguyên tử; dữ liệu cấu hình rút gọn được trình bày để hỗ trợ học tập.`;
  atomViz.setElement(el.number, color);
}
function electronConfiguration(el) {
  if (el.symbol === 'Fe') return '[Ar] 3d⁶ 4s²';
  if (el.symbol === 'Cu') return '[Ar] 3d¹⁰ 4s¹';
  if (el.symbol === 'Cr') return '[Ar] 3d⁵ 4s¹';
  if (el.symbol === 'Ag') return '[Kr] 4d¹⁰ 5s¹';
  if (el.symbol === 'Au') return '[Xe] 4f¹⁴ 5d¹⁰ 6s¹';
  return orbitalConfiguration(el.number, el.symbol).map(([orbital, count]) => orbital + String(count).split('').map(d => superscripts[d]).join('')).join(' ');
}
grid.addEventListener('click', e => {
  const card = e.target.closest('.element-card');
  if (card && window.innerWidth < 1000) $('#detail-panel').scrollIntoView({behavior:'smooth',block:'start'});
});

document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', () => {
  viewMode = btn.dataset.view;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b === btn));
  document.body.classList.toggle('is-3d', viewMode === '3d');
  showToast(viewMode === '3d' ? 'Chế độ 3D đã bật' : 'Đã chuyển về chế độ 2D');
}));
$('#help-button').addEventListener('click', () => $('#help-modal').classList.add('open'));
$('#close-help').addEventListener('click', () => $('#help-modal').classList.remove('open'));
$('#got-it').addEventListener('click', () => $('#help-modal').classList.remove('open'));
$('#help-modal').addEventListener('click', e => { if (e.target.id === 'help-modal') e.currentTarget.classList.remove('open'); });
function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

// Decorative background: a restrained particle field, not a heavy post-processing pass.
const ambientCanvas = $('#ambient-canvas');
const ambientRenderer = new THREE.WebGLRenderer({canvas: ambientCanvas, alpha:true, antialias:true});
ambientRenderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
const ambientScene = new THREE.Scene();
const ambientCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
ambientCamera.position.z = 24;
const particlePositions = new Float32Array(260 * 3);
for (let i=0;i<260;i++) {
  particlePositions[i*3] = (Math.random()-.5)*42;
  particlePositions[i*3+1] = (Math.random()-.5)*24;
  particlePositions[i*3+2] = (Math.random()-.5)*18;
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions,3));
const particleMaterial = new THREE.PointsMaterial({color:0x77bfff,size:0.035,transparent:true,opacity:.65});
const particles = new THREE.Points(particleGeometry,particleMaterial);
ambientScene.add(particles);
function resizeAmbient() {
  const w=innerWidth,h=innerHeight;
  ambientRenderer.setSize(w,h,false); ambientCamera.aspect=w/h; ambientCamera.updateProjectionMatrix();
}
window.addEventListener('resize', resizeAmbient); resizeAmbient();

// Interactive atom viewport
class AtomView {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
    this.camera.position.set(0,0,10);
    this.renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.enableDamping = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.35; // Xoay góc nhìn chậm, nhẹ nhàng hơn
    this.core = new THREE.Group();
    this.scene.add(this.core);
    this.scene.add(new THREE.AmbientLight(0x8dbfff,1.3));
    const key = new THREE.PointLight(0x61d8ff,45,30); key.position.set(4,4,5); this.scene.add(key);
    const rim = new THREE.PointLight(0x8b6dff,24,24); rim.position.set(-4,-2,-4); this.scene.add(rim);
    this.setElement(26,'#42c9ed');
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
  }
  setElement(number, color) {
    while (this.core.children.length) {
      const child=this.core.children.pop();
      child.traverse?.(obj=>{obj.geometry?.dispose(); if(obj.material) (Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>m.dispose());});
    }
    const c = new THREE.Color(color);
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(.42 + Math.min(number,100)*.0015,32,32),
      new THREE.MeshPhysicalMaterial({color:c,emissive:c,emissiveIntensity:.55,metalness:.28,roughness:.22,clearcoat:1})
    );
    this.core.add(nucleus);
    const nucleons = Math.min(44, Math.max(12, Math.round(number*.8)));
    for(let i=0;i<nucleons;i++){
      const phi=Math.acos(-1+2*(i+.5)/nucleons), theta=Math.PI*(1+Math.sqrt(5))*i;
      const r=.25+Math.random()*.23;
      const p=new THREE.Mesh(new THREE.SphereGeometry(.075,12,12),new THREE.MeshStandardMaterial({color:i%2?0x6b8fff:0x8ef0ff,emissive:i%2?0x182e79:0x174f6a,emissiveIntensity:.8}));
      p.position.set(r*Math.cos(theta)*Math.sin(phi),r*Math.sin(theta)*Math.sin(phi),r*Math.cos(phi));
      this.core.add(p);
    }
    const shellCount=Math.max(1,Math.min(7,Math.ceil(number/8)));
    for(let s=0;s<shellCount;s++){
      const radius=1.05+s*.48;
      const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.008,6,120),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.38}));
      ring.rotation.set(s*.75,Math.PI/2+s*.48,s*.28);
      this.core.add(ring);
      const count=shellDistribution(number)[s] || 1;
      for(let e=0;e<count;e++){
        const holder=new THREE.Group();
        const electron=new THREE.Mesh(new THREE.SphereGeometry(.055,16,16),new THREE.MeshBasicMaterial({color:0xffffff}));
        const halo=new THREE.Mesh(new THREE.SphereGeometry(.095,12,12),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.18}));
        holder.add(electron,halo);
        const angle=(e/count)*Math.PI*2 + s*.7;
        holder.position.set(Math.cos(angle)*radius,Math.sin(angle)*radius*.18,Math.sin(angle)*radius);
        ring.add(holder);
      }
      ring.userData.spin=(s%2?-.34:.38); // radian/giây: electron quay chậm, dễ quan sát
    }
    this.currentColor=c;
  }
  resize() {
    const rect=this.canvas.getBoundingClientRect();
    const w=Math.max(1,rect.width), h=Math.max(1,rect.height);
    this.renderer.setSize(w,h,false); this.camera.aspect=w/h; this.camera.updateProjectionMatrix();
  }
  render(delta, elapsed) {
    this.controls.update();
    this.core.children.forEach(child=>{
      if(child.isMesh && child.geometry?.type==='TorusGeometry') {
        child.rotation.z += (child.userData.spin || .08) * delta;
      }
    });
    // Nhịp sáng rất nhẹ cho hạt nhân, không làm mô hình rung lắc.
    const pulse = 1 + Math.sin(elapsed * 1.1) * 0.012;
    this.core.scale.setScalar(pulse);
    this.renderer.render(this.scene,this.camera);
  }
}
const atomViz = new AtomView($('#atom-canvas'));
const motionClock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(motionClock.getDelta(), 0.05);
  const elapsed = motionClock.elapsedTime;
  particles.rotation.y += .00022;
  particles.rotation.x += .00008;
  ambientRenderer.render(ambientScene,ambientCamera);
  atomViz.render(delta, elapsed);
}
animate();
selectElement(activeElement);
applyFilters();
