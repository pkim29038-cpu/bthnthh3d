import {atomicMass,categoryInfo,electronShells,factsFor} from './chemistry.js';
import {propertyFor,compactElectronConfiguration,fullElectronConfiguration,standardStateName,kelvinToCelsius} from './periodic-properties.js';

export const EMPTY_PROPERTY='---';
const safe=x=>x===undefined||x===null||String(x).trim()===''?EMPTY_PROPERTY:String(x);
const localNumber=(x,maxDigits=2)=>{
  if(x===null||x===undefined||x==='')return EMPTY_PROPERTY;
  const n=Number(x);
  if(!Number.isFinite(n))return EMPTY_PROPERTY;
  return new Intl.NumberFormat('vi-VN',{maximumFractionDigits:maxDigits}).format(n);
};
const phaseLabels={Rắn:'Rắn',Lỏng:'Lỏng',Khí:'Khí'};
const toTemperature=value=>{
  const c=kelvinToCelsius(value);
  return c===null?EMPTY_PROPERTY:localNumber(c,2)+' °C';
};
function percentDensity(el,source){
  if(!source.densityGcm3)return EMPTY_PROPERTY;
  const base=Number(source.densityGcm3);
  if(!Number.isFinite(base))return EMPTY_PROPERTY;
  if(standardStateName(el)==='Khí'){
    // PubChem CSV density is always given in g/cm3; convert gases to g/L.
    return localNumber(base*1000,6)+' g/L';
  }
  return localNumber(base,6)+' g/cm³';
}
function blockFor(el){
  if(el.category==='lanthanide'||el.category==='actinide')return 'f';
  if(el.symbol==='He'||el.group<=2)return 's';
  if(el.group>=3&&el.group<=12)return 'd';
  if(el.group>=13&&el.group<=18)return 'p';
  return EMPTY_PROPERTY;
}
const commonCompounds={
  H:{oxide:'H₂O'},
  C:{oxide:'CO₂',oxyacid:'H₂CO₃'},
  N:{oxide:'N₂O₅',oxyacid:'HNO₃'},
  S:{oxide:'SO₃',oxyacid:'H₂SO₄'},
  P:{oxide:'P₄O₁₀',oxyacid:'H₃PO₄'},
  Cl:{oxide:'Cl₂O₇',oxyacid:'HClO₄'},
  Na:{oxide:'Na₂O',hydroxide:'NaOH'},
  K:{oxide:'K₂O',hydroxide:'KOH'},
  Mg:{oxide:'MgO',hydroxide:'Mg(OH)₂'},
  Ca:{oxide:'CaO',hydroxide:'Ca(OH)₂'},
  Al:{oxide:'Al₂O₃',hydroxide:'Al(OH)₃'},
  Si:{oxide:'SiO₂'},
  Fe:{oxide:'Fe₂O₃',hydroxide:'Fe(OH)₃'},
  Ni:{oxide:'NiO',hydroxide:'Ni(OH)₂'},
  Cu:{oxide:'CuO',hydroxide:'Cu(OH)₂'},
  Zn:{oxide:'ZnO',hydroxide:'Zn(OH)₂'},
  Re:{oxide:'Re₂O₇',oxyacid:'HReO₄'}
};

/**
 * Full record for the lower "Tính chất & ứng dụng" section.
 * Every expected field ALWAYS renders, including when the source is null.
 */
export function propertySheet(el){
  const source=propertyFor(el);
  const facts=factsFor(el);
  const shells=electronShells(el);
  const chemical=commonCompounds[el.symbol]||{};
  const state=standardStateName(el);
  const full=fullElectronConfiguration(el);
  const compact=compactElectronConfiguration(el);
  const group=el.category==='lanthanide'||el.category==='actinide'?
    (el.symbol==='La'||el.symbol==='Ac'?String(el.group):'Dãy f'):
    el.group||null;
  const oxidation=source.oxidation;
  const mass=atomicMass[el.symbol];
  const category=categoryInfo[el.category]?.name;
  return {
    name:el.name, symbol:el.symbol,number:el.number,
    groups:[
      {key:'identity',title:'Vị trí và đặc điểm cơ bản',subtitle:'Các thông tin nền tảng của nguyên tố',
       entries:[
        ['Số hiệu nguyên tử (Z)',el.number],
        ['Ký hiệu hóa học',el.symbol],
        ['Tên quốc tế (IUPAC)',el.name],
        ['Nguyên tử khối tương đối',mass?mass.replaceAll('.',',')+' u':null],
        ['Chu kỳ',el.period],
        ['Nhóm',group],
        ['Khối nguyên tố (s/p/d/f)',blockFor(el)],
        ['Phân loại',category]
      ]},
      {key:'electronic',title:'Cấu trúc electron & hóa học',subtitle:'Cấu hình, năng lượng và hóa trị',
       entries:[
        ['Cấu hình electron đầy đủ',full],
        ['Cấu hình electron rút gọn',compact],
        ['Số lớp electron',shells.length],
        ['Electron theo từng lớp',shells.length?shells.map((n,i)=>'Lớp '+(i+1)+': '+n+'e⁻').join(' · '):null],
        ['Electron lớp ngoài cùng',shells.length?shells.at(-1):null],
        ['Độ âm điện (Pauling)',source.electronegativity?.replace('.',',')],
        ['Năng lượng ion hóa lần 1',source.ionizationEv?localNumber(source.ionizationEv,4)+' eV':null],
        ['Ái lực electron',source.affinityEv?localNumber(source.affinityEv,4)+' eV':null],
        ['Số oxi hóa',oxidation],
        ['Oxit tiêu biểu',chemical.oxide||facts.oxide||null],
        ['Hydroxide tiêu biểu',chemical.hydroxide||facts.hydroxide||null],
        ['Axit oxo tương ứng',chemical.oxyacid||null]
      ]},
      {key:'physical',title:'Tính chất vật lý',subtitle:'Các đại lượng đo và trạng thái vật chất',
       entries:[
        ['Trạng thái ở điều kiện thường',state],
        ['Khối lượng riêng',percentDensity(el,source)],
        ['Bán kính nguyên tử (PubChem)',source.radiusPm?localNumber(source.radiusPm)+' pm':null],
        ['Nhiệt độ nóng chảy',toTemperature(source.meltK)],
        ['Nhiệt độ sôi',toTemperature(source.boilK)],
      ]},
      {key:'history',title:'Lịch sử phát hiện',subtitle:'Thông tin ghi nhận trong dữ liệu tham khảo',
       entries:[
        ['Người phát hiện / ghi nhận',source.discoveredBy],
        ['Năm phát hiện',source.year?.toLowerCase?.()==='ancient'?'Thời cổ đại':source.year]
      ]}
    ].map(group=>({...group,entries:group.entries.map(([label,value])=>({label,value:safe(value),missing:safe(value)===EMPTY_PROPERTY}))})),
    uses:Array.isArray(facts.uses)?facts.uses:[],
    state:state||EMPTY_PROPERTY
  };
}
