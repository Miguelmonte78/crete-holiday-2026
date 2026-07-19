document.addEventListener('DOMContentLoaded', function () {
      function normalizeChoiceTag(text) {
        const value = String(text || '').toLowerCase();
        if (value.includes('first')) return 'selected-first-choice';
        if (value.includes('alternative')) return 'selected-alternative';
        if (value.includes('extra')) return 'selected-extra-time';
        return 'selected-first-choice';
      }

      function updateOptionSelectionVisual(button) {
        const grid = button.closest('.activity-options-grid');
        const dayCard = button.closest('.day-card');
        if (!grid) return;
        grid.classList.add('has-selection');
        grid.querySelectorAll('.activity-option').forEach(function (option) {
          option.classList.toggle('is-dimmed', option !== button);
        });
        if (dayCard) {
          dayCard.classList.remove('selected-first-choice', 'selected-alternative', 'selected-extra-time');
          dayCard.classList.add(normalizeChoiceTag(button.dataset.tag || button.textContent));
        }
      }

      document.querySelectorAll('.activity-option').forEach(function (button) {
        button.addEventListener('click', function () {
          window.setTimeout(function () { updateOptionSelectionVisual(button); }, 0);
        });
      });

      document.querySelectorAll('.activity-options-grid').forEach(function (grid) {
        const active = grid.querySelector('.activity-option.active') || grid.querySelector('.activity-option');
        if (active) updateOptionSelectionVisual(active);
      });
    });
