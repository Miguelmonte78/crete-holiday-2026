/* =========================================================
   CRETE TRAVEL APP - ITINERARY DAY FILTER FIX
   File: js/itinerary-filter-fix.js

   This file is designed for your current itinerary.html structure.
   It works with your existing IDs:
      - dayJump
      - daySearch
      - themeFilter
      - renderDays()

   What it does:
      1. Keeps your existing renderDays() function.
      2. Converts the dayJump dropdown into a filter.
      3. Selecting Day 4 shows only Day 4.
      4. Selecting Day 5 shows only Day 5.
      5. Adds floating Day and Top buttons.
      6. Re-applies the filter after search/theme changes.
========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "crete_selected_day_filter";

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(initItineraryFilterFix, 100);
  });

  function initItineraryFilterFix() {
    const dayJump = document.getElementById("dayJump");

    if (!dayJump) {
      console.warn("Itinerary filter fix: dayJump dropdown was not found.");
      return;
    }

    injectStyles();
    makeSelectorSticky(dayJump);
    addFloatingButtons(dayJump);
    connectControls(dayJump);

    const savedDay = localStorage.getItem(STORAGE_KEY);
    if (savedDay && optionExists(dayJump, savedDay)) {
      dayJump.value = savedDay;
      applyDayFilter(savedDay);
    }
  }

  function connectControls(dayJump) {
    dayJump.addEventListener("change", function () {
      const selectedValue = dayJump.value;
      localStorage.setItem(STORAGE_KEY, selectedValue || "all");
      applyDayFilter(selectedValue);
      updateFloatingLabel(dayJump);
    });

    const daySearch = document.getElementById("daySearch");
    if (daySearch) {
      daySearch.addEventListener("input", function () {
        setTimeout(function () {
          applyDayFilter(dayJump.value);
        }, 80);
      });
    }

    const themeFilter = document.getElementById("themeFilter");
    if (themeFilter) {
      themeFilter.addEventListener("change", function () {
        setTimeout(function () {
          applyDayFilter(dayJump.value);
        }, 80);
      });
    }
  }

  function applyDayFilter(selectedValue) {
    const selectedId = normalizeSelectedId(selectedValue);
    const dayCards = getDayCards();

    if (!dayCards.length) {
      console.warn("Itinerary filter fix: no day cards detected after renderDays().");
      return;
    }

    if (!selectedId || selectedId === "all") {
      dayCards.forEach(function (card) {
        card.hidden = false;
        card.classList.remove("itinerary-filter-hidden");
      });
      return;
    }

    dayCards.forEach(function (card) {
      const isSelected = card.id === selectedId;
      card.hidden = !isSelected;
      card.classList.toggle("itinerary-filter-hidden", !isSelected);
      card.classList.toggle("itinerary-filter-active", isSelected);
    });

    const selectedCard = document.getElementById(selectedId);
    if (selectedCard) {
      setTimeout(function () {
        selectedCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }

  function getDayCards() {
    const dayJump = document.getElementById("dayJump");
    const idsFromDropdown = dayJump
      ? Array.from(dayJump.options).map(function (option) { return normalizeSelectedId(option.value); }).filter(Boolean)
      : [];

    const cardsFromDropdown = idsFromDropdown
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if (cardsFromDropdown.length) {
      return unique(cardsFromDropdown);
    }

    const cardsFromId = Array.from(document.querySelectorAll("[id^='day-'], [id^='day_']"));
    const cardsFromData = Array.from(document.querySelectorAll("[data-day], [data-itinerary-day]"));
    const cardsFromClass = Array.from(document.querySelectorAll(".day-card, .itinerary-day, .itinerary-card"));

    return unique(cardsFromId.concat(cardsFromData).concat(cardsFromClass));
  }

  function normalizeSelectedId(value) {
    if (!value) return "all";
    const raw = String(value).trim();
    if (!raw || raw.toLowerCase() === "all") return "all";

    if (document.getElementById(raw)) return raw;

    const numberMatch = raw.match(/(\d{1,2})/);
    if (!numberMatch) return raw;

    const number = numberMatch[1];
    const candidates = [
      `day-${number}`,
      `day${number}`,
      `day_${number}`,
      `day-${String(number).padStart(2, "0")}`,
      `day${String(number).padStart(2, "0")}`
    ];

    return candidates.find(function (id) { return document.getElementById(id); }) || raw;
  }

  function makeSelectorSticky(dayJump) {
    const wrapper = dayJump.closest(".itinerary-controls, .filters, .filter-bar, .container, div") || dayJump.parentElement;
    if (wrapper) {
      wrapper.classList.add("itinerary-day-filter-sticky");
    }
  }

  function addFloatingButtons(dayJump) {
    if (document.getElementById("itineraryQuickButtons")) return;

    const panel = document.createElement("div");
    panel.id = "itineraryQuickButtons";
    panel.className = "itinerary-quick-buttons";
    panel.innerHTML = `
      <button type="button" id="quickSelectDay" class="itinerary-quick-button">📅 <span id="quickDayLabel">Day</span></button>
      <button type="button" id="quickTop" class="itinerary-quick-button">⬆ Top</button>
    `;
    document.body.appendChild(panel);

    document.getElementById("quickSelectDay").addEventListener("click", function () {
      dayJump.scrollIntoView({ behavior: "smooth", block: "center" });
      dayJump.focus();
    });

    document.getElementById("quickTop").addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    updateFloatingLabel(dayJump);
  }

  function updateFloatingLabel(dayJump) {
    const label = document.getElementById("quickDayLabel");
    if (!label) return;

    const selectedOption = dayJump.options[dayJump.selectedIndex];
    const text = selectedOption ? selectedOption.textContent.trim() : "Day";
    label.textContent = text.length > 12 ? "Day" : text;
  }

  function optionExists(select, value) {
    return Array.from(select.options).some(function (opt) { return opt.value === value; });
  }

  function unique(items) {
    return items.filter(function (item, index, array) {
      return item && array.indexOf(item) === index;
    });
  }

  function injectStyles() {
    if (document.getElementById("itinerary-filter-fix-styles")) return;

    const style = document.createElement("style");
    style.id = "itinerary-filter-fix-styles";
    style.textContent = `
      .itinerary-filter-hidden {
        display: none !important;
      }

      .itinerary-filter-active {
        scroll-margin-top: 120px;
        animation: itineraryFilterFadeIn 180ms ease-in-out;
      }

      @keyframes itineraryFilterFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .itinerary-day-filter-sticky {
        position: sticky;
        top: 0;
        z-index: 900;
        background: rgba(255,255,255,0.96);
        backdrop-filter: blur(12px);
        border-radius: 16px;
        box-shadow: 0 10px 24px rgba(0,0,0,0.10);
        padding: 0.85rem;
      }

      .itinerary-quick-buttons {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 1300;
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
      }

      .itinerary-quick-button {
        border: 0;
        border-radius: 999px;
        background: #0f6b7a;
        color: #ffffff;
        font-weight: 700;
        padding: 0.75rem 1rem;
        box-shadow: 0 10px 24px rgba(0,0,0,0.22);
        cursor: pointer;
      }

      .itinerary-quick-button:hover,
      .itinerary-quick-button:focus {
        background: #084c5a;
        outline: 3px solid rgba(15,107,122,0.25);
      }

      @media (max-width: 640px) {
        .itinerary-quick-buttons {
          right: 12px;
          bottom: 12px;
        }

        .itinerary-quick-button {
          padding: 0.7rem 0.85rem;
          font-size: 0.9rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();
