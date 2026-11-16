/** Lightweight header boot — independent of Three.js, WebGL and page-specific bundles. */
import {renderSiteNav} from './site-nav.js';
import {initTheme} from './theme.js';
import {initQuiz} from './quiz.js';
import {elements} from './elements.js';

const page=document.body.dataset.page||'table';
const params=new URLSearchParams(location.search);
const n=Number(params.get('n'));
const atom=page==='element'
  ?elements.find(el=>el.symbol.toLowerCase()===String(params.get('symbol')||'Ni').toLowerCase())
  :null;
const active=page==='group'?'group':page==='period'?'period':'table';
const navGroup=atom?.group||(page==='group'&&Number.isInteger(n)&&n>=1&&n<=18?n:10);
const navPeriod=atom?.period||(page==='period'&&Number.isInteger(n)&&n>=1&&n<=7?n:4);
const placeholder=document.getElementById('site-header');
if(placeholder){
  placeholder.outerHTML=renderSiteNav(active,{group:navGroup,period:navPeriod});
}
initTheme();
initQuiz();

// Navigation is ready before chemistry WebGL / heavy 3D rendering starts.
document.documentElement.dataset.navReady='true';
