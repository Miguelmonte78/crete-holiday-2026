/* V15 Itinerary Activity Link Fix
   Purpose: Ensure every "Open full activity details" / activity page button in Daily Planner
   points to activities.html?open=details&activity=<selectedId>#<selectedId>.
   Add this file at the bottom of itinerary.html, immediately before </body>.
*/
(function () {
  'use strict';

  const aliases = {
    'phaistos': 'phaistos-palace',
    'phaistos-palace': 'phaistos-palace',
    'agia-triada': 'agia-triada',
    'matala-caves': 'matala-evening',
    'matala-beach': 'matala-evening',
    'matala-village-and-beach': 'matala-evening',
    'matala-village-later-in-the-day': 'matala-evening',
    'kommos-beach': 'kommos-beach',
    'kalamaki-beach': 'kalamaki-beach',
    'agiofarago-gorge': 'agiofarago',
    'agiofarago': 'agiofarago',
    'zaros-lake': 'zaros-lake',
    'gortyna': 'gortyna',
    'ancient-gortyna': 'gortyna',
    'agia-galini': 'agia-galini',
    'triopetra-beach': 'triopetra',
    'triopetra': 'triopetra',
    'heraklion-archaeological-museum': 'heraklion-museum',
    'heraklion-museum': 'heraklion-museum',
    'heraklion-old-town-and-harbour-walk': 'heraklion-museum',
    'knossos-palace-if-energy-allows': 'heraklion-museum',
    'kamilari-walk': 'kamilari-walk',
    'kamilari-village-walk': 'kamilari-walk',
    'groceries': 'groceries',
    'departure-logistics': 'departure-logistics',
    'pack-fuel-and-airport-drive': 'departure-logistics'
  };

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function normalizeActivityId(value) {
    const slug = slugify(value);
    return aliases[slug] || slug;
  }

  function makeDetailsUrl(activityId) {
    const id = normalizeActivityId(activityId);
    return 'activities.html?open=details&activity=' + encodeURIComponent(id) + '#' + encodeURIComponent(id);
  }

  function updateLinksForCard(dayCard) {
    if (!dayCard) return;
    const active = dayCard.querySelector('.activity-option.active') || dayCard.querySelector('.activity-option.selected') || dayCard.querySelector('.activity-option');
    if (!active) return;
    const id = active.dataset.activityId || active.dataset.activity || active.dataset.title || active.querySelector('strong')?.textContent || '';
    const url = makeDetailsUrl(id);
    dayCard.querySelectorAll('.activity-page-link, .activity-page-link-2, a[href^="activities.html"]').forEach(function (anchor) {
      const text = (anchor.textContent || '').toLowerCase();
      if (text.includes('detail') || text.includes('activity page') || anchor.classList.contains('activity-page-link') || anchor.classList.contains('activity-page-link-2')) {
        anchor.href = url;
      }
    });
  }

  function updateAllLinks() {
    document.querySelectorAll('.day-card').forEach(updateLinksForCard);
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateAllLinks();
    setTimeout(updateAllLinks, 500);
    setTimeout(updateAllLinks, 1200);
  });

  document.addEventListener('click', function (event) {
    const option = event.target.closest('.activity-option');
    if (!option) return;
    const dayCard = option.closest('.day-card');
    setTimeout(function () { updateLinksForCard(dayCard); }, 0);
  });
})();
