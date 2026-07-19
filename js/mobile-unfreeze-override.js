/* V14 Mobile Unfreeze Override
   Put this file at the very bottom of itinerary.html, immediately before </body>.
*/
(function () {
  'use strict';

  function unfreezeDailyPlannerTopArea() {
    const selectorList = [
      '.planner-filter',
      '#daySelectorPanel',
      '.filters',
      'section.planner-filter',
      'section.filters',
      '.sticky-top',
      '.position-sticky',
      '.filter-card'
    ];

    selectorList.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.style.setProperty('position', 'static', 'important');
        el.style.setProperty('top', 'auto', 'important');
        el.style.setProperty('bottom', 'auto', 'important');
        el.style.setProperty('z-index', 'auto', 'important');
        el.style.setProperty('transform', 'none', 'important');
      });
    });

    const isCompact = window.matchMedia('(max-width: 991.98px)').matches;
    if (isCompact) {
      document.querySelectorAll('.navbar.fixed-top, nav.fixed-top, header.fixed-top, .fixed-top').forEach(function (el) {
        el.style.setProperty('position', 'static', 'important');
        el.style.setProperty('top', 'auto', 'important');
        el.style.setProperty('z-index', 'auto', 'important');
      });

      document.body.style.setProperty('padding-top', '0', 'important');
      document.querySelectorAll('.itinerary-hero, .activities-hero, .hero-card').forEach(function (el) {
        el.style.setProperty('margin-top', '0', 'important');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    unfreezeDailyPlannerTopArea();
    setTimeout(unfreezeDailyPlannerTopArea, 250);
    setTimeout(unfreezeDailyPlannerTopArea, 1000);
  });

  window.addEventListener('resize', unfreezeDailyPlannerTopArea);
  window.addEventListener('orientationchange', unfreezeDailyPlannerTopArea);
  window.addEventListener('scroll', function () {
    /* Re-apply lightly in case another script re-adds sticky behavior while scrolling. */
    window.requestAnimationFrame(unfreezeDailyPlannerTopArea);
  }, { passive: true });
})();
