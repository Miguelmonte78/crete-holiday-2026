document.addEventListener('DOMContentLoaded', function () {
      const aliasMap = {
        'phaistos-palace': 'phaistos-palace',
        'agia-triada': 'agia-triada',
        'matala-caves': 'matala-evening',
        'matala-beach': 'matala-evening',
        'red-beach': 'matala-evening',
        'kommos-beach': 'kommos-beach',
        'kalamaki-beach': 'kalamaki-beach',
        'agiofarago-gorge': 'agiofarago',
        'agiofarago': 'agiofarago',
        'zaros-lake': 'zaros-lake',
        'gortyna': 'gortyna',
        'agia-galini': 'agia-galini',
        'triopetra-beach': 'triopetra',
        'triopetra': 'triopetra'
      };

      function selectedClassFromTag(tagText) {
        const value = String(tagText || '').toLowerCase();
        if (value.includes('alternative')) return 'selected-alternative';
        if (value.includes('extra')) return 'selected-extra-time';
        return 'selected-first-choice';
      }

      function updateSelectedActivityPanel(button) {
        const dayCard = button.closest('.day-card');
        if (!dayCard) return;
        const grid = button.closest('.activity-options-grid');
        const panel = dayCard.querySelector('.selected-activity-panel');
        if (!panel) return;

        if (grid) {
          grid.classList.add('has-selection');
          grid.querySelectorAll('.activity-option').forEach(function (option) {
            option.classList.toggle('active', option === button);
          });
        }

        dayCard.classList.remove('selected-first-choice', 'selected-alternative', 'selected-extra-time');
        dayCard.classList.add(selectedClassFromTag(button.dataset.tag || button.textContent));

        const title = button.dataset.title || button.querySelector('strong')?.textContent || 'Selected activity';
        const tag = button.dataset.tag || button.querySelector('.option-tag')?.textContent || 'Selected';
        const short = button.dataset.short || button.querySelector('small')?.textContent || '';
        const what = button.dataset.what || '';
        const why = button.dataset.why || '';
        const see = button.dataset.see || '';
        const tip = button.dataset.tip || '';
        const full = button.dataset.full || '';
        const activityId = aliasMap[button.dataset.activityId] || button.dataset.activityId || '';
        const link = activityId ? 'activities.html?open=details&activity=' + encodeURIComponent(activityId) + '#' + encodeURIComponent(activityId) : 'activities.html';

        const selectedTag = panel.querySelector('.selected-tag');
        const selectedTitle = panel.querySelector('.selected-title');
        const selectedShort = panel.querySelector('.selected-short');
        const selectedWhat = panel.querySelector('.selected-what');
        const selectedWhy = panel.querySelector('.selected-why');
        const selectedSee = panel.querySelector('.selected-see');
        const selectedTip = panel.querySelector('.selected-tip');
        const selectedFull = panel.querySelector('.selected-full');

        if (selectedTag) selectedTag.textContent = tag;
        if (selectedTitle) selectedTitle.textContent = title;
        if (selectedShort) selectedShort.textContent = short;
        if (selectedWhat) selectedWhat.textContent = what;
        if (selectedWhy) selectedWhy.textContent = why;
        if (selectedSee) selectedSee.textContent = see;
        if (selectedTip) selectedTip.textContent = tip;
        if (selectedFull) selectedFull.textContent = full;

        panel.querySelectorAll('.activity-page-link, .activity-page-link-2').forEach(function (anchor) {
          anchor.href = link;
        });
      }

      /* Use event delegation so this works even if earlier scripts modified the DOM */
      document.addEventListener('click', function (event) {
        const button = event.target.closest('.activity-option');
        if (!button) return;
        window.setTimeout(function () {
          updateSelectedActivityPanel(button);
        }, 0);
      });

      /* Initialize every day with its active option, or first option if none is active */
      document.querySelectorAll('.day-card').forEach(function (dayCard) {
        const button = dayCard.querySelector('.activity-option.active') || dayCard.querySelector('.activity-option');
        if (button) updateSelectedActivityPanel(button);
      });
    });
