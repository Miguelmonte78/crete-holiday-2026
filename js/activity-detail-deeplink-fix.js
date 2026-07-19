/* V15 Activity Detail Deep Link Fix
   Purpose: When Daily Planner opens activities.html?open=details&activity=<id>#<id>,
   the Activities page must automatically open the full View details modal for that activity.
   Add this file at the bottom of activities.html, immediately before </body>.
*/
(function () {
  'use strict';

  const aliases = {
    'phaistos': 'phaistos-palace',
    'phaistos-palace': 'phaistos-palace',
    'agia-triada': 'agia-triada',
    'agia-triada-archaeological-site': 'agia-triada',
    'matala': 'matala-evening',
    'matala-caves': 'matala-evening',
    'matala-beach': 'matala-evening',
    'matala-village-and-beach': 'matala-evening',
    'matala-village-later-in-the-day': 'matala-evening',
    'matala-evening': 'matala-evening',
    'kommos': 'kommos-beach',
    'kommos-beach': 'kommos-beach',
    'kommos-beach-snorkeling': 'kommos-beach',
    'kommos-beach-snorkeling-morning': 'kommos-beach',
    'kalamaki': 'kalamaki-beach',
    'kalamaki-beach': 'kalamaki-beach',
    'kalamaki-easy-beach-option': 'kalamaki-beach',
    'agiofarago': 'agiofarago',
    'agiofarago-gorge': 'agiofarago',
    'agiofarago-gorge-and-wild-beach': 'agiofarago',
    'zaros': 'zaros-lake',
    'zaros-lake': 'zaros-lake',
    'zaros-lake-votomos-lake-walk': 'zaros-lake',
    'gortyna': 'gortyna',
    'ancient-gortyna': 'gortyna',
    'agia-galini': 'agia-galini',
    'agia-galini-harbour-and-beach-walk': 'agia-galini',
    'triopetra': 'triopetra',
    'triopetra-beach': 'triopetra',
    'triopetra-scenic-beach': 'triopetra',
    'mires-market': 'mires-market',
    'moires-market': 'mires-market',
    'kamilari-walk': 'kamilari-walk',
    'kamilari-village-walk': 'kamilari-walk',
    'groceries': 'groceries',
    'grocery-and-picnic-setup': 'groceries',
    'departure-logistics': 'departure-logistics',
    'pack-fuel-and-airport-drive': 'departure-logistics',
    'heraklion-museum': 'heraklion-museum',
    'heraklion-archaeological-museum': 'heraklion-museum',
    'heraklion-old-town-and-harbour-walk': 'heraklion-museum',
    'knossos-palace-if-energy-allows': 'heraklion-museum'
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

  function requestedActivityId() {
    const params = new URLSearchParams(window.location.search);
    const queryValue = params.get('activity') || params.get('activityId') || params.get('id') || params.get('openActivity');
    const hashValue = window.location.hash ? decodeURIComponent(window.location.hash.replace('#', '')) : '';
    return normalizeActivityId(queryValue || hashValue);
  }

  function focusCardIfAvailable(activityId) {
    const card = document.getElementById(activityId);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('activity-linked-highlight');
    }
  }

  function filterToActivityIfPossible(activityId) {
    const input = document.getElementById('activitySearch');
    if (!input) return;
    const friendly = {
      'phaistos-palace': 'Phaistos Palace',
      'agia-triada': 'Agia Triada',
      'matala-evening': 'Matala',
      'kommos-beach': 'Kommos',
      'kalamaki-beach': 'Kalamaki',
      'agiofarago': 'Agiofarago',
      'zaros-lake': 'Zaros',
      'gortyna': 'Gortyna',
      'agia-galini': 'Agia Galini',
      'triopetra': 'Triopetra',
      'heraklion-museum': 'Heraklion Museum',
      'mires-market': 'Moires',
      'kamilari-walk': 'Kamilari',
      'groceries': 'Grocery',
      'departure-logistics': 'Departure'
    };
    input.value = friendly[activityId] || activityId.replace(/-/g, ' ');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function openDetailsWithRetry(activityId, attempt) {
    attempt = attempt || 1;
    if (!activityId) return;

    // Your activities.html already uses window.openActivityDetails(id) for the View details modal.
    if (typeof window.openActivityDetails === 'function') {
      filterToActivityIfPossible(activityId);
      if (typeof window.renderActivities === 'function') window.renderActivities();
      if (typeof window.renderDailyPanel === 'function') window.renderDailyPanel();
      setTimeout(function () {
        focusCardIfAvailable(activityId);
        window.openActivityDetails(activityId);
      }, 150);
      return;
    }

    if (attempt < 40) {
      setTimeout(function () {
        openDetailsWithRetry(activityId, attempt + 1);
      }, 100);
    } else {
      console.warn('V15 deeplink fix: openActivityDetails(id) was not found on activities.html. Activity id:', activityId);
    }
  }

  function run() {
    const params = new URLSearchParams(window.location.search);
    const shouldOpen = params.get('open') === 'details' || Boolean(params.get('activity')) || Boolean(window.location.hash);
    if (!shouldOpen) return;
    const id = requestedActivityId();
    if (!id) return;
    openDetailsWithRetry(id, 1);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(run, 250);
    setTimeout(run, 800);
  });
})();
