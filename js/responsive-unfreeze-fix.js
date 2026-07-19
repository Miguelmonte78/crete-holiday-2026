/* V13 Responsive Unfreeze Fix JS
   Removes inline/fixed behavior on compact screens and keeps the selector non-sticky. */
(function () {
  'use strict';

  function applyResponsiveUnfreeze() {
    const isCompact = window.matchMedia('(max-width: 991.98px)').matches;

    document.querySelectorAll('.planner-filter, #daySelectorPanel, .filters').forEach(function (el) {
      el.style.position = 'static';
      el.style.top = 'auto';
      el.style.zIndex = 'auto';
    });

    document.querySelectorAll('.navbar.fixed-top, nav.fixed-top').forEach(function (nav) {
      if (isCompact) {
        nav.style.position = 'static';
        nav.style.top = 'auto';
      } else {
        nav.style.position = '';
        nav.style.top = '';
      }
    });

    document.querySelectorAll('.itinerary-hero, .activities-hero').forEach(function (hero) {
      if (isCompact) hero.style.marginTop = '0';
    });
  }

  document.addEventListener('DOMContentLoaded', applyResponsiveUnfreeze);
  window.addEventListener('resize', applyResponsiveUnfreeze);
  window.addEventListener('orientationchange', applyResponsiveUnfreeze);
})();
