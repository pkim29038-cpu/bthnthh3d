/** One top-level navigation component for every page. No duplicate menus. */
export function renderSiteNav(active = 'table', { group = 10, period = 4 } = {}) {
  const tab = (id,href,label)=>'<a class="atlas-nav__tab'+(active===id?' is-current':'')+'" href="'+href+'"'+(active===id?' aria-current="page"':'')+'>'+label+'</a>';
  return '<header class="atlas-nav"><div class="atlas-nav__inner">'+
    '<a class="atlas-nav__logo" href="./index.html"><span class="atlas-nav__glyph"><img class="atlas-nav__logo-image" src="./atomic-atlas-logo.svg" alt="" aria-hidden="true" width="43" height="43"/></span><span><strong>ATLAS / NGUYÊN TỐ</strong><small>PHÒNG TRƯNG BÀY VẬT CHẤT</small></span></a>'+
    '<nav class="atlas-nav__tabs" aria-label="Điều hướng chính">'+
     tab('table','./index.html','Bảng tuần hoàn')+
     tab('group','./group.html?n='+(Number(group)||10),'Nhóm')+
     tab('period','./period.html?n='+(Number(period)||4),'Chu kỳ')+'</nav>'+
    '<div class="atlas-nav__actions"><button class="atlas-nav__quiz" type="button" data-quiz-open aria-label="Mở trò chơi ôn tập nguyên tố"><span aria-hidden="true">✦</span> Quiz ôn tập</button>'+
    '<button type="button" class="atlas-nav__theme" data-theme-toggle aria-label="Chuyển giao diện sáng tối" aria-pressed="false"><span class="theme-sun" aria-hidden="true">☼</span><span class="theme-moon" aria-hidden="true">◐</span></button></div>'+
    '</div></header>';
}
