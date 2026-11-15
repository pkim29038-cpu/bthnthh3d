/** Shared motion director: progressive disclosure without scroll-jank. */
export function initMotion() {
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets=document.querySelectorAll(
    '.atlas-taxonomy, .atlas-note-grid article, .atlas-legend, '+
    '.element-chapter, .matter-layout, .electron-visual-grid, '+
    '.collection-note, .collection-element, .element-neighbors'
  );
  if(reduced||!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(entry.isIntersecting){
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    }
  },{rootMargin:'0px 0px 35px 0px',threshold:0.065});
  targets.forEach((element,index)=>{
    element.dataset.reveal='';
    element.classList.add('reveal-pending');
    element.style.transitionDelay=(Math.min(index%5,4)*40)+'ms';
    observer.observe(element);
  });
  // Avoid hiding unseen content when the page is being printed or reduced motion is requested.
  window.addEventListener('beforeprint',()=>{
    targets.forEach(element=>{
      element.classList.remove('reveal-pending');
      element.classList.add('reveal-visible');
    });
  },{once:true});
  const focusables=document.querySelectorAll(
    '.atlas-view-switch button, .atlas-nav__theme, .element-path a, .collection-index select'
  );
  focusables.forEach(element=>element.classList.add('animated-sheen'));
}
