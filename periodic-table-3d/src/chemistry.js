import { elements } from './elements.js';

/** Educational data shared by element, group, and period views. */
export const categoryInfo = {
  'kim-loai-kiem': {name:'Kim loại kiềm',color:'#ffb45f',description:'Kim loại nhóm 1, có một electron lớp ngoài cùng và thường hoạt động hóa học mạnh.'},
  'kiem-tho': {name:'Kim loại kiềm thổ',color:'#f6d36e',description:'Kim loại nhóm 2, thường có hai electron hóa trị và tạo ion mang điện tích +2.'},
  'kim-loai-chuyen-tiep': {name:'Kim loại chuyển tiếp',color:'#42c9ed',description:'Nhóm kim loại khối d, nhiều nguyên tố có nhiều số oxi hóa và tạo hợp chất có màu.'},
  'kim-loai-hau-chuyen-tiep': {name:'Kim loại hậu chuyển tiếp',color:'#65d6a7',description:'Một tập hợp kim loại thuộc khối p với nhiều tính chất vật lý và hóa học khác nhau.'},
  'a-kim': {name:'Á kim',color:'#b6a0ff',description:'Các nguyên tố nằm gần ranh giới kim loại–phi kim, nhiều chất có tính bán dẫn.'},
  'phi-kim': {name:'Phi kim',color:'#80aaff',description:'Những nguyên tố có tính chất đa dạng, thường tham gia liên kết cộng hóa trị.'},
  'khi-hiem': {name:'Khí hiếm',color:'#f28cc9',description:'Các khí ở nhóm 18, lớp electron ngoài cùng đã bão hòa đối với đa số nguyên tố.'},
  'lanthanide': {name:'Họ Lantan',color:'#e9a0d8',description:'Dãy nguyên tố khối f thuộc chu kỳ 6, có nhiều ứng dụng trong vật liệu công nghệ.'},
  'actinide': {name:'Họ Actini',color:'#e58e9d',description:'Dãy nguyên tố khối f ở chu kỳ 7; các nguyên tố trong dãy đều có tính phóng xạ.'}
};
export const atomicMass = {
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
export const groupNames = {1:'Kim loại kiềm',2:'Kim loại kiềm thổ',3:'Nhóm Scandium',4:'Nhóm Titanium',5:'Nhóm Vanadium',6:'Nhóm Chromium',7:'Nhóm Manganese',8:'Nhóm Iron',9:'Nhóm Cobalt',10:'Nhóm Nickel',11:'Nhóm Copper',12:'Nhóm Zinc',13:'Nhóm Boron',14:'Nhóm Carbon',15:'Nhóm Nitrogen',16:'Nhóm Oxygen',17:'Halogen',18:'Khí hiếm'};
export const periodNotes = {
  1:'Chỉ có 2 nguyên tố. Lớp electron thứ nhất bắt đầu được lấp đầy.',
  2:'Từ Lithium đến Neon. Các nguyên tố khối s và p bắt đầu thể hiện xu hướng tuần hoàn rõ rệt.',
  3:'Từ Sodium đến Argon. Nhiều nguyên tố quen thuộc trong đời sống xuất hiện ở chu kỳ này.',
  4:'Từ Potassium đến Krypton. Chu kỳ đầu tiên có đầy đủ dãy kim loại chuyển tiếp.',
  5:'Từ Rubidium đến Xenon, bao gồm các nguyên tố quan trọng trong luyện kim và điện tử.',
  6:'Gồm 32 nguyên tố, trong đó có dãy Lantan được đặt thành hàng riêng để dễ theo dõi.',
  7:'Gồm 32 nguyên tố, bao gồm dãy Actini và nhiều nguyên tố tổng hợp siêu nặng.'
};
export const elementFacts = {
  H:{en:'Hydrogen',summary:'Nguyên tố nhẹ nhất và phổ biến nhất trong vũ trụ.',uses:['Nghiên cứu năng lượng','Sản xuất amoniac','Tế bào nhiên liệu'],state:'Khí',electro:'2,20',melting:'−259,16 °C',boiling:'−252,87 °C'},
  C:{en:'Carbon',summary:'Nền tảng cấu trúc của các hợp chất hữu cơ và nhiều dạng vật liệu.',uses:['Vật liệu carbon','Bút chì (graphit)','Hóa học hữu cơ'],state:'Rắn',electro:'2,55'},
  O:{en:'Oxygen',summary:'Phi kim cần thiết cho quá trình hô hấp của đa số sinh vật.',uses:['Y tế','Luyện thép','Công nghiệp hóa học'],state:'Khí',electro:'3,44'},
  Al:{en:'Aluminium',summary:'Kim loại nhẹ, tạo lớp oxit bảo vệ nên chống ăn mòn khá tốt.',uses:['Hàng không','Bao bì','Vật liệu xây dựng'],state:'Rắn',density:'2,70 g/cm³',melting:'660,3 °C',oxidation:'+3'},
  Fe:{en:'Iron',summary:'Kim loại được sử dụng rộng rãi trong thép, cơ khí và xây dựng.',uses:['Sản xuất thép','Kết cấu xây dựng','Thiết bị cơ khí'],state:'Rắn',density:'7,87 g/cm³',melting:'1.538 °C',boiling:'2.862 °C',electro:'1,83',oxidation:'+2, +3',discovery:'Được sử dụng từ thời cổ đại',oxide:'Fe₂O₃',hydroxide:'Fe(OH)₃'},
  Re:{en:'Rhenium',summary:'Rhenium là kim loại chuyển tiếp rất nặng, có nhiệt độ nóng chảy cao và được sử dụng trong những hợp kim chịu nhiệt đặc biệt.',uses:['Hợp kim chịu nhiệt trong động cơ phản lực','Gia cường hợp kim tungsten và molybdenum','Tiếp điểm điện chống mài mòn','Xúc tác trong công nghiệp hóa học'],state:'Rắn',oxide:'Re₂O₇'},
  Ni:{en:'Nickel',summary:'Kim loại bền, chống ăn mòn, được dùng trong thép không gỉ, pin và xúc tác. Một số hợp chất Nickel có thể gây dị ứng.',uses:['Luyện kim & hợp kim','Pin sạc và điện cực','Xúc tác công nghiệp'],state:'Rắn',density:'8,908 g/cm³',melting:'1.455 °C',boiling:'2.730 °C',electro:'1,91',radius:'135 pm',oxidation:'+2, +3',discovery:'Axel Fredrik Cronstedt · 1751',oxide:'NiO',hydroxide:'Ni(OH)₂'},
  Cu:{en:'Copper',summary:'Kim loại dẫn điện, dẫn nhiệt tốt, thường dùng trong dây dẫn và hợp kim.',uses:['Dây dẫn điện','Đường ống','Hợp kim đồng'],state:'Rắn',density:'8,96 g/cm³',melting:'1.084,6 °C',boiling:'2.562 °C',electro:'1,90',oxidation:'+1, +2',oxide:'CuO',hydroxide:'Cu(OH)₂'},
  Zn:{en:'Zinc',summary:'Kim loại thường dùng để mạ chống gỉ và chế tạo hợp kim.',uses:['Mạ kẽm','Chế tạo đồng thau','Pin'],state:'Rắn',density:'7,14 g/cm³',melting:'419,5 °C',boiling:'907 °C',oxidation:'+2'},
  Ag:{en:'Silver',summary:'Kim loại quý có khả năng dẫn điện rất cao.',uses:['Tiếp điểm điện','Trang sức','Vật liệu quang học'],state:'Rắn',density:'10,49 g/cm³',oxidation:'+1'},
  Au:{en:'Gold',summary:'Kim loại quý ít bị ăn mòn, dễ dát mỏng và dẫn điện tốt.',uses:['Linh kiện điện tử','Trang sức','Nha khoa'],state:'Rắn',density:'19,32 g/cm³',melting:'1.064 °C',oxidation:'+1, +3'},
  Na:{en:'Sodium',summary:'Kim loại kiềm có hoạt tính cao; tồn tại phổ biến dưới dạng hợp chất.',uses:['Đèn hơi natri','Công nghiệp hóa chất','Nghiên cứu vật liệu'],state:'Rắn',oxidation:'+1'},
  Cl:{en:'Chlorine',summary:'Halogen có nhiều ứng dụng trong xử lý nước và sản xuất hóa chất.',uses:['Xử lý nước','Sản xuất hóa chất','Sản xuất nhựa PVC'],state:'Khí',electro:'3,16',oxidation:'−1, +1, +5, +7'},
  Mg:{en:'Magnesium',summary:'Kim loại nhẹ, có vai trò trong hợp kim và sinh học.',uses:['Hợp kim nhẹ','Vật liệu cơ khí','Hóa học'],state:'Rắn',density:'1,74 g/cm³',oxidation:'+2'}
};
export const reactionExamples = {
  Ni:{label:'Nickel với axit clohiđric',equation:'Ni + 2HCl → NiCl₂ + H₂↑',note:'Ví dụ phản ứng oxi hóa–khử; tốc độ thực tế phụ thuộc điều kiện và bề mặt kim loại.',oxidation:'Ni → Ni²⁺ + 2e⁻',reduction:'2H⁺ + 2e⁻ → H₂'},
  Fe:{label:'Iron với axit clohiđric',equation:'Fe + 2HCl → FeCl₂ + H₂↑',note:'Phản ứng minh họa sự tạo muối sắt(II) và giải phóng khí hiđro.',oxidation:'Fe → Fe²⁺ + 2e⁻',reduction:'2H⁺ + 2e⁻ → H₂'},
  Zn:{label:'Zinc với axit clohiđric',equation:'Zn + 2HCl → ZnCl₂ + H₂↑',note:'Phản ứng thường dùng để minh họa tính khử của kim loại.',oxidation:'Zn → Zn²⁺ + 2e⁻',reduction:'2H⁺ + 2e⁻ → H₂'},
  Mg:{label:'Magnesium với axit clohiđric',equation:'Mg + 2HCl → MgCl₂ + H₂↑',note:'Phản ứng minh họa việc tạo muối và khí hiđro.',oxidation:'Mg → Mg²⁺ + 2e⁻',reduction:'2H⁺ + 2e⁻ → H₂'},
  Al:{label:'Aluminium với axit clohiđric',equation:'2Al + 6HCl → 2AlCl₃ + 3H₂↑',note:'Lớp oxit thụ động trên bề mặt có thể làm thay đổi diễn biến phản ứng.',oxidation:'Al → Al³⁺ + 3e⁻',reduction:'2H⁺ + 2e⁻ → H₂'}
};
const order=[['1s',2],['2s',2],['2p',6],['3s',2],['3p',6],['4s',2],['3d',10],['4p',6],['5s',2],['4d',10],['5p',6],['6s',2],['4f',14],['5d',10],['6p',6],['7s',2],['5f',14],['6d',10],['7p',6]];
const exceptions={Cr:{'4s':1,'3d':5},Cu:{'4s':1,'3d':10},Nb:{'5s':1,'4d':4},Mo:{'5s':1,'4d':5},Ru:{'5s':1,'4d':7},Rh:{'5s':1,'4d':8},Pd:{'5s':0,'4d':10},Ag:{'5s':1,'4d':10},Pt:{'6s':1,'5d':9},Au:{'6s':1,'5d':10}};
export function electronOrbitals(el){
  const occupancy={};let remain=el.number;
  for(const [orbital,max] of order){const n=Math.min(remain,max);if(n>0)occupancy[orbital]=n;remain-=n;if(!remain)break;}
  if(exceptions[el.symbol])Object.assign(occupancy,exceptions[el.symbol]);
  return order.filter(([orbital])=>occupancy[orbital]>0).map(([orbital])=>[orbital,occupancy[orbital]]);
}
export function electronShells(el){
  const shells=Array(7).fill(0);
  electronOrbitals(el).forEach(([orbital,count])=>shells[+orbital[0]-1]+=count);
  while(shells.length&&!shells[shells.length-1])shells.pop();
  return shells;
}
const superscript={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
export function electronConfig(el){return electronOrbitals(el).map(([orbital,n])=>orbital+String(n).split('').map(c=>superscript[c]).join('')).join(' ');}
export function groupElements(n){
  return elements.filter(e=>e.group===n&&(e.category!=='lanthanide'&&e.category!=='actinide'||e.symbol==='La'||e.symbol==='Ac')).sort((a,b)=>a.number-b.number);
}
export function periodElements(n){return elements.filter(e=>e.period===n).sort((a,b)=>a.number-b.number);}
export function numericMass(el){
  const m=atomicMass[el.symbol];return /^\d/.test(String(m))?Number(m):null;
}
export function locationFor(el){return './element.html?symbol='+encodeURIComponent(el.symbol);}
export function factsFor(el){
  const x=elementFacts[el.symbol]||{};
  const state=x.state||(['H','He','N','O','F','Ne','Cl','Ar','Kr','Xe','Rn'].includes(el.symbol)?'Khí':el.symbol==='Br'||el.symbol==='Hg'?'Lỏng':el.number>103?'Chưa xác định đầy đủ':'Rắn');
  const fBlock=['lanthanide','actinide'].includes(el.category)&&!['La','Ac'].includes(el.symbol);
  const placement=fBlock?'thuộc dãy f của chu kỳ '+el.period:'nằm tại nhóm '+el.group+', chu kỳ '+el.period;
  return {en:el.name,summary:el.name+' ('+el.symbol+') thuộc '+categoryInfo[el.category].name.toLocaleLowerCase('vi')+'; '+placement+' trong bảng tuần hoàn.',uses:[],...x,state};
}
