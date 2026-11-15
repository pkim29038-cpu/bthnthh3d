/**
 * Shared, single primary navigation for every page in Atomic Explorer.
 * In-page controls (2D/3D, Bohr/orbital, group numbers) are not site tabs.
 */
export function renderSiteNav(active = 'table', { group = 10, period = 4 } = {}) {
  const items = [
    ['table', './index.html', 'Bảng tuần hoàn'],
    ['group', './group.html?n=' + (Number(group) || 10), 'Nhóm'],
    ['period', './period.html?n=' + (Number(period) || 4), 'Chu kỳ']
  ];
  const links = items.map(([id, href, title]) =>
    '<a class="site-nav__tab'+(active===id?' is-active':'')+'" href="'+href+'"'+
    (active===id?' aria-current="page"':'')+'>'+title+'</a>'
  ).join('');
  return '<header class="site-nav"><div class="site-nav__inner">'+
    '<a href="./index.html" class="site-nav__logo" aria-label="Về bảng tuần hoàn">'+
    '<span class="site-nav__mark">N<span>°</span></span>'+
    '<span><b>NGUYÊN TỐ</b><small>ATOMIC EXPLORER · 3D</small></span></a>'+
    '<nav class="site-nav__tabs" aria-label="Điều hướng chính">'+links+'</nav>'+
    '<div class="site-nav__right"><span class="site-nav__status"><i></i> 118 NGUYÊN TỐ</span>'+
    (active==='table'?'<button class="site-nav__help" id="help-button" aria-label="Hướng dẫn sử dụng">?</button>':'<a class="site-nav__home" href="./index.html" aria-label="Quay lại bảng tuần hoàn">⌂</a>')+
    '</div></div></header>';
}
