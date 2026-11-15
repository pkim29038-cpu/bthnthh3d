import {elements} from './elements.js';
import {categoryInfo,factsFor} from './chemistry.js';
const pick=a=>a[Math.floor(Math.random()*a.length)];
function shuffle(a){return [...a].sort(()=>Math.random()-.5);}
export function generateQuizQuestion(){
  const el=pick(elements),facts=factsFor(el);
  const questions=[
    {prompt:'Ký hiệu hóa học của '+el.name+' là gì?',answer:el.symbol,
      choices:elements.filter(x=>x.symbol!==el.symbol).map(x=>x.symbol),
      explanation:el.name+' có ký hiệu '+el.symbol+' và số hiệu nguyên tử '+el.number+'.'},
    {prompt:'Nguyên tố '+el.symbol+' có số hiệu nguyên tử bằng bao nhiêu?',answer:String(el.number),
      choices:elements.filter(x=>x.number!==el.number).map(x=>String(x.number)),
      explanation:'Số hiệu nguyên tử Z = '+el.number+', tức hạt nhân chứa '+el.number+' proton.'},
    {prompt:el.name+' nằm ở chu kỳ nào?',answer:String(el.period),
      choices:['1','2','3','4','5','6','7'].filter(x=>Number(x)!==el.period),
      explanation:el.name+' nằm ở chu kỳ '+el.period+' của bảng tuần hoàn.'},
    {prompt:el.name+' được xếp vào phân loại nào?',answer:categoryInfo[el.category].name,
      choices:Object.entries(categoryInfo).filter(([k])=>k!==el.category).map(([,m])=>m.name),
      explanation:'Theo quy ước phân loại trên website, '+el.name+' thuộc '+categoryInfo[el.category].name+'.'}
  ];
  if(el.group>=1&&el.group<=18&&!['lanthanide','actinide'].includes(el.category)){
    questions.push({prompt:el.name+' thuộc nhóm bao nhiêu?',answer:String(el.group),
      choices:Array.from({length:18},(_,i)=>String(i+1)).filter(x=>Number(x)!==el.group),
      explanation:'Trong cách đánh số nhóm 1–18, '+el.name+' thuộc nhóm '+el.group+'.'});
  }
  if(['Rắn','Lỏng','Khí'].includes(facts.state)){
    questions.push({prompt:'Ở điều kiện thường, '+el.name+' có trạng thái nào?',answer:facts.state,
      choices:['Rắn','Lỏng','Khí','Chưa xác định đầy đủ'].filter(x=>x!==facts.state),
      explanation:el.name+' được ghi nhận ở trạng thái '+facts.state.toLowerCase()+' tại điều kiện thường.'});
  }
  const q=pick(questions);
  return {...q,element:el,options:shuffle([q.answer,...shuffle(q.choices).slice(0,3)])};
}
let activeQuestion=null,correct=0,rounds=0,dialog=null,finished=false;
function buildDialog(){
  const d=document.createElement('dialog');d.id='atlas-quiz';
  d.className='atlas-quiz-dialog';d.setAttribute('aria-label','Quiz ôn tập nguyên tố');
  d.innerHTML='<div class="quiz-header"><div><span class="atlas-eyebrow">ATLAS / QUIZ ÔN TẬP</span><h2>Thử thách bảng tuần hoàn</h2></div><button type="button" id="quiz-close" aria-label="Đóng quiz">✕</button></div>'+
  '<div class="quiz-progress"><span id="quiz-step">CÂU 1</span><span id="quiz-score">0/0 đúng</span></div>'+
  '<div class="quiz-prompt" id="quiz-prompt"></div>'+
  '<div class="quiz-choices" id="quiz-choices" role="group" aria-label="Chọn đáp án"></div>'+
  '<p class="quiz-feedback" id="quiz-feedback" aria-live="polite"></p>'+
  '<div class="quiz-actions"><a id="quiz-element-link" href="./index.html" hidden>Tìm hiểu nguyên tố ↗</a><button type="button" id="quiz-next" disabled>Câu tiếp theo →</button></div>'+
  '<p class="quiz-footnote">Câu hỏi được tạo ngẫu nhiên từ dữ liệu nguyên tố đang có trên website.</p>';
  document.body.append(d);
  d.querySelector('#quiz-close').addEventListener('click',()=>d.close());
  d.querySelector('#quiz-next').addEventListener('click',nextQuizQuestion);
  d.querySelector('#quiz-choices').addEventListener('click',event=>{
    const b=event.target.closest('button[data-answer]');if(!b||finished)return;
    finished=true;rounds++;
    const chosen=b.dataset.answer,won=chosen===activeQuestion.answer;
    if(won)correct++;
    d.querySelectorAll('#quiz-choices button').forEach(btn=>{
      btn.disabled=true;
      if(btn.dataset.answer===activeQuestion.answer)btn.classList.add('is-correct');
      else if(btn===b)btn.classList.add('is-incorrect');
    });
    const fb=d.querySelector('#quiz-feedback');fb.hidden=false;
    fb.textContent=(won?'✓ Chính xác! ':'✕ Chưa đúng. ')+activeQuestion.explanation;
    d.querySelector('#quiz-score').textContent=correct+'/'+rounds+' đúng';
    d.querySelector('#quiz-next').disabled=false;
    const link=d.querySelector('#quiz-element-link');
    link.hidden=false;link.href='./element.html?symbol='+encodeURIComponent(activeQuestion.element.symbol);
  });
  return d;
}
function nextQuizQuestion(){
  if(!dialog)return;
  const previous=activeQuestion?.element.symbol;
  for(let i=0;i<6;i++){activeQuestion=generateQuizQuestion();if(activeQuestion.element.symbol!==previous)break;}
  finished=false;
  dialog.querySelector('#quiz-step').textContent='CÂU '+(rounds+1);
  dialog.querySelector('#quiz-prompt').textContent=activeQuestion.prompt;
  dialog.querySelector('#quiz-choices').replaceChildren(...activeQuestion.options.map(option=>{
    const b=document.createElement('button');b.type='button';b.dataset.answer=option;
    b.textContent=option;return b;
  }));
  const fb=dialog.querySelector('#quiz-feedback');fb.hidden=true;fb.textContent='';
  dialog.querySelector('#quiz-element-link').hidden=true;
  dialog.querySelector('#quiz-next').disabled=true;
}
export function initQuiz(){
  const trigger=document.querySelector('[data-quiz-open]');
  if(!trigger)return;
  trigger.addEventListener('click',()=>{
    if(!dialog)dialog=buildDialog();
    if(!dialog.open){
      nextQuizQuestion();
      dialog.showModal();
    }
  });
}
