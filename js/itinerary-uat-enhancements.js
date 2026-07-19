/* =========================================================
   CRETE TRAVEL APP - DAILY ITINERARY UAT ENHANCEMENTS
   File: js/itinerary-uat-enhancements.js
   Purpose:
   1) Replace jump-to-day scrolling with day filtering.
   2) Show only selected day, or all days when selected.
   3) Keep day selector easily accessible on mobile via floating button.
   4) Add Back to Top button.
   5) Add Previous / Next day buttons.
   6) Make option cards clickable and save selected option locally.

   Safe design:
   - This script does not delete existing content.
   - It works with multiple possible HTML structures.
   - It can be added after your existing js/script.js file.
========================================================= */

(function () {
  "use strict";

  const STORAGE = {
    selectedDay: "crete_selected_itinerary_day",
    selectedOptionPrefix: "crete_selected_option_day_"
  };

  const SELECT_IDS = ["jumpToDay", "daySelector", "jump-to-day", "day-filter", "itineraryDaySelector"];

  document.addEventListener("DOMContentLoaded", initDailyItineraryEnhancements);

  function initDailyItineraryEnhancements() {
    const days = detectDaySections();

    if (!days.length) {
      console.info("Daily itinerary UAT enhancements: no day sections detected on this page.");
      return;
    }

    injectEnhancementStyles();
    normalizeDaySections(days);
    const normalizedDays = detectDaySections();
    const selector = ensureDaySelector(normalizedDays);

    ensureFloatingControls(normalizedDays, selector);
    ensurePreviousNextControls(normalizedDays);
    setupDayFiltering(normalizedDays, selector);
    setupClickableOptions(normalizedDays);
    restoreSavedDay(normalizedDays, selector);
  }

  function detectDaySections() {
    const selectors = [
      "[data-day]",
      "section[id^='day-']",
      "article[id^='day-']",
      ".day-card",
      ".itinerary-day",
      ".itinerary-card"
    ];

    let nodes = Array.from(document.querySelectorAll(selectors.join(",")));

    // De-duplicate while preserving order.
    nodes = nodes.filter((node, index, array) => array.indexOf(node) === index);

    // If no structured cards are found, try to infer from headings containing "Day X".
    if (!nodes.length) {
      const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4"));
      headings.forEach((heading) => {
        const match = getDayNumberFromText(heading.textContent || "");
        if (!match) return;

        const parent = heading.closest("section, article, .card, .container, .itinerary-item") || heading.parentElement;
        if (parent && !nodes.includes(parent)) nodes.push(parent);
      });
    }

    return nodes
      .map((node, index) => {
        const dayNumber = getDayNumber(node, index + 1);
        return { node, dayNumber };
      })
      .filter((item) => item.dayNumber >= 1 && item.dayNumber <= 31)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  }

  function normalizeDaySections(days) {
    days.forEach(({ node, dayNumber }) => {
      node.setAttribute("data-day", String(dayNumber));
      node.setAttribute("data-itinerary-day", String(dayNumber));
      if (!node.id || !/^day-\d+$/.test(node.id)) {
        node.id = `day-${dayNumber}`;
      }
      node.classList.add("itinerary-enhanced-day");
    });
  }

  function getDayNumber(node, fallback) {
    const fromData = node.getAttribute("data-day") || node.getAttribute("data-itinerary-day");
    if (fromData && /^\d+$/.test(fromData)) return Number(fromData);

    const fromId = node.id ? node.id.match(/day[-_ ]?(\d+)/i) : null;
    if (fromId) return Number(fromId[1]);

    const heading = node.querySelector("h1, h2, h3, h4");
    const fromHeading = heading ? getDayNumberFromText(heading.textContent || "") : null;
    if (fromHeading) return fromHeading;

    return fallback;
  }

  function getDayNumberFromText(text) {
    const match = text.match(/\bday\s*(\d{1,2})\b/i);
    return match ? Number(match[1]) : null;
  }

  function ensureDaySelector(days) {
    let selector = SELECT_IDS.map((id) => document.getElementById(id)).find(Boolean);

    if (!selector) {
      const wrapper = document.createElement("div");
      wrapper.id = "itinerary-selector-wrapper";
      wrapper.className = "itinerary-selector-wrapper";
      wrapper.innerHTML = `
        <label for="itineraryDaySelector" class="itinerary-selector-label">Select day</label>
        <select id="itineraryDaySelector" class="itinerary-day-selector form-select"></select>
      `;

      const target = document.querySelector("main") || document.body;
      target.insertBefore(wrapper, target.firstChild);
      selector = wrapper.querySelector("select");
    }

    selector.classList.add("itinerary-day-selector");
    selector.setAttribute("aria-label", "Select itinerary day");
    selector.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All days";
    selector.appendChild(allOption);

    days.forEach(({ dayNumber, node }) => {
      const option = document.createElement("option");
      option.value = String(dayNumber);
      option.textContent = getDayTitle(node, dayNumber);
      selector.appendChild(option);
    });

    return selector;
  }

  function getDayTitle(node, dayNumber) {
    const heading = node.querySelector("h1, h2, h3, h4");
    const text = heading ? cleanText(heading.textContent) : "";
    if (text) return text;
    return `Day ${dayNumber}`;
  }

  function setupDayFiltering(days, selector) {
    selector.addEventListener("change", function () {
      applyDayFilter(days, selector.value, true);
    });
  }

  function applyDayFilter(days, selectedValue, shouldScroll) {
    const selected = normalizeSelectedDayValue(selectedValue);
    localStorage.setItem(STORAGE.selectedDay, selected);

    days.forEach(({ node, dayNumber }) => {
      const show = selected === "all" || String(dayNumber) === selected;
      node.hidden = !show;
      node.classList.toggle("itinerary-day-hidden", !show);
      node.classList.toggle("itinerary-day-active", show && selected !== "all");
    });

    updateFloatingCurrentDay(selected);
    updatePreviousNextVisibility(days, selected);

    if (shouldScroll) {
      const scrollTarget = selected === "all"
        ? document.querySelector(".itinerary-selector-wrapper") || document.querySelector(".itinerary-day-selector") || document.body
        : document.getElementById(`day-${selected}`);
      smoothScrollTo(scrollTarget);
    }
  }

  function normalizeSelectedDayValue(value) {
    if (!value || value === "all") return "all";
    const numeric = String(value).match(/\d+/);
    return numeric ? numeric[0] : "all";
  }

  function restoreSavedDay(days, selector) {
    const saved = localStorage.getItem(STORAGE.selectedDay) || "all";
    const exists = saved === "all" || days.some((d) => String(d.dayNumber) === saved);
    selector.value = exists ? saved : "all";
    applyDayFilter(days, selector.value, false);
  }

  function ensureFloatingControls(days, selector) {
    const panel = document.createElement("div");
    panel.id = "itinerary-floating-panel";
    panel.className = "itinerary-floating-panel";
    panel.innerHTML = `
      <button type="button" id="floatingDayButton" class="itinerary-floating-btn" aria-label="Open day selector">📅 <span id="floatingCurrentDay">Day</span></button>
      <button type="button" id="floatingTopButton" class="itinerary-floating-btn" aria-label="Back to top">⬆ Top</button>
    `;
    document.body.appendChild(panel);

    const menu = document.createElement("div");
    menu.id = "floatingDayMenu";
    menu.className = "floating-day-menu";
    menu.hidden = true;
    menu.innerHTML = `<strong>Select day</strong><div class="floating-day-list"></div>`;
    document.body.appendChild(menu);

    const list = menu.querySelector(".floating-day-list");

    const allButton = createFloatingDayChoice("All days", "all", selector, days, menu);
    list.appendChild(allButton);

    days.forEach(({ dayNumber, node }) => {
      const button = createFloatingDayChoice(getDayTitle(node, dayNumber), String(dayNumber), selector, days, menu);
      list.appendChild(button);
    });

    document.getElementById("floatingDayButton").addEventListener("click", () => {
      menu.hidden = !menu.hidden;
    });

    document.getElementById("floatingTopButton").addEventListener("click", () => {
      const target = document.querySelector(".itinerary-selector-wrapper") || selector || document.body;
      smoothScrollTo(target);
    });

    window.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !panel.contains(event.target)) {
        menu.hidden = true;
      }
    });
  }

  function createFloatingDayChoice(label, value, selector, days, menu) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "floating-day-choice";
    button.dataset.dayChoice = value;
    button.textContent = label;
    button.addEventListener("click", () => {
      selector.value = value;
      applyDayFilter(days, value, true);
      menu.hidden = true;
    });
    return button;
  }

  function updateFloatingCurrentDay(selected) {
    const label = document.getElementById("floatingCurrentDay");
    if (!label) return;
    label.textContent = selected === "all" ? "All" : `Day ${selected}`;

    document.querySelectorAll(".floating-day-choice").forEach((button) => {
      button.classList.toggle("active", button.dataset.dayChoice === selected);
    });
  }

  function ensurePreviousNextControls(days) {
    days.forEach(({ node, dayNumber }) => {
      if (node.querySelector(".itinerary-prev-next")) return;

      const nav = document.createElement("div");
      nav.className = "itinerary-prev-next";
      nav.innerHTML = `
        <button type="button" class="itinerary-nav-button itinerary-prev-day" data-target-day="${dayNumber - 1}">← Previous day</button>
        <button type="button" class="itinerary-nav-button itinerary-next-day" data-target-day="${dayNumber + 1}">Next day →</button>
      `;
      node.appendChild(nav);
    });

    document.addEventListener("click", (event) => {
      const button = event.target.closest(".itinerary-nav-button");
      if (!button) return;

      const targetDay = Number(button.dataset.targetDay);
      const selector = SELECT_IDS.map((id) => document.getElementById(id)).find(Boolean) || document.getElementById("itineraryDaySelector");
      if (!selector || !days.some((d) => d.dayNumber === targetDay)) return;

      selector.value = String(targetDay);
      applyDayFilter(days, String(targetDay), true);
    });
  }

  function updatePreviousNextVisibility(days, selected) {
    const maxDay = Math.max(...days.map((d) => d.dayNumber));
    const minDay = Math.min(...days.map((d) => d.dayNumber));

    document.querySelectorAll(".itinerary-prev-day, .itinerary-next-day").forEach((button) => {
      const target = Number(button.dataset.targetDay);
      button.disabled = target < minDay || target > maxDay;
      button.hidden = selected === "all";
    });
  }

  function setupClickableOptions(days) {
    days.forEach(({ node, dayNumber }) => {
      const optionCards = findOptionCards(node);

      optionCards.forEach((card, index) => {
        card.classList.add("itinerary-clickable-option");
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.dataset.optionIndex = String(index);
        card.dataset.optionKey = card.dataset.optionKey || getOptionKey(card, index);

        card.addEventListener("click", () => selectOption(node, dayNumber, card));
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectOption(node, dayNumber, card);
          }
        });
      });

      restoreSelectedOption(node, dayNumber, optionCards);
    });
  }

  function findOptionCards(dayNode) {
    const selectors = [
      "[data-option]",
      "[data-option-key]",
      ".option-card",
      ".activity-option",
      ".itinerary-option",
      ".alternative-card",
      ".recommended-card"
    ];

    let cards = Array.from(dayNode.querySelectorAll(selectors.join(",")));

    // If the page does not yet have option classes, infer from common Bootstrap/card blocks whose text mentions recommended or alternative.
    if (!cards.length) {
      cards = Array.from(dayNode.querySelectorAll(".card, .list-group-item, article, section"))
        .filter((el) => /recommended|first choice|alternative|option/i.test(el.textContent || ""));
    }

    // Avoid making the whole day clickable.
    return cards.filter((card) => card !== dayNode);
  }

  function selectOption(dayNode, dayNumber, selectedCard) {
    const cards = findOptionCards(dayNode);
    cards.forEach((card) => {
      card.classList.toggle("selected-itinerary-option", card === selectedCard);
    });

    const optionKey = selectedCard.dataset.optionKey || selectedCard.dataset.optionIndex;
    localStorage.setItem(STORAGE.selectedOptionPrefix + dayNumber, optionKey);

    showOptionDetails(dayNode, selectedCard, optionKey);
  }

  function restoreSelectedOption(dayNode, dayNumber, cards) {
    if (!cards.length) return;
    const saved = localStorage.getItem(STORAGE.selectedOptionPrefix + dayNumber);
    const selected = cards.find((card) => card.dataset.optionKey === saved) || cards[0];
    selectOption(dayNode, dayNumber, selected);
  }

  function showOptionDetails(dayNode, selectedCard, optionKey) {
    const targetId = selectedCard.dataset.optionTarget || selectedCard.getAttribute("href")?.replace("#", "");
    const detailPanels = Array.from(dayNode.querySelectorAll("[data-option-detail], .option-detail, .activity-detail"));

    if (detailPanels.length) {
      detailPanels.forEach((panel) => {
        const panelKey = panel.dataset.optionDetail || panel.id || panel.dataset.optionKey;
        const shouldShow = targetId ? panel.id === targetId : panelKey === optionKey;
        panel.hidden = !shouldShow;
        panel.classList.toggle("active-option-detail", shouldShow);
      });
    }

    // Add / update a small selected label.
    let label = dayNode.querySelector(".selected-option-label");
    if (!label) {
      label = document.createElement("div");
      label.className = "selected-option-label";
      selectedCard.insertAdjacentElement("afterend", label);
    }

    label.textContent = `Selected option: ${cleanText(selectedCard.textContent).slice(0, 90)}`;
  }

  function getOptionKey(card, index) {
    const text = cleanText(card.textContent || "").toLowerCase();
    return text ? text.slice(0, 60).replace(/[^a-z0-9]+/g, "-") : `option-${index}`;
  }

  function smoothScrollTo(element) {
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cleanText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function injectEnhancementStyles() {
    if (document.getElementById("itinerary-uat-enhancement-styles")) return;

    const style = document.createElement("style");
    style.id = "itinerary-uat-enhancement-styles";
    style.textContent = `
      .itinerary-selector-wrapper {
        position: sticky;
        top: 0;
        z-index: 900;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(14px);
        border: 1px solid rgba(0, 80, 120, 0.12);
        border-radius: 18px;
        box-shadow: 0 12px 30px rgba(0, 40, 70, 0.10);
        margin: 1rem auto;
        padding: 1rem;
        max-width: 980px;
      }

      .itinerary-selector-label {
        display: block;
        font-weight: 700;
        margin-bottom: 0.35rem;
        color: #0f4c5c;
      }

      .itinerary-day-selector {
        width: 100%;
        min-height: 44px;
        border-radius: 14px;
        border: 1px solid #b7dbe8;
        padding: 0.65rem 0.85rem;
        font-size: 1rem;
        background: #ffffff;
      }

      .itinerary-enhanced-day {
        scroll-margin-top: 120px;
      }

      .itinerary-day-hidden {
        display: none !important;
      }

      .itinerary-day-active {
        animation: itineraryFadeIn 220ms ease-in-out;
      }

      @keyframes itineraryFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .itinerary-floating-panel {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 1200;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      .itinerary-floating-btn {
        border: 0;
        border-radius: 999px;
        padding: 0.75rem 1rem;
        background: #0f6b7a;
        color: white;
        font-weight: 700;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
        cursor: pointer;
      }

      .itinerary-floating-btn:hover,
      .itinerary-floating-btn:focus {
        background: #0a4f5d;
        outline: 3px solid rgba(15, 107, 122, 0.25);
      }

      .floating-day-menu {
        position: fixed;
        right: 16px;
        bottom: 116px;
        z-index: 1210;
        width: min(320px, calc(100vw - 32px));
        max-height: 60vh;
        overflow: auto;
        background: #ffffff;
        color: #1e293b;
        border-radius: 18px;
        box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
        border: 1px solid rgba(0, 80, 120, 0.15);
        padding: 1rem;
      }

      .floating-day-list {
        display: grid;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }

      .floating-day-choice {
        width: 100%;
        text-align: left;
        border: 1px solid #d7ecf2;
        background: #f7fbfc;
        border-radius: 12px;
        padding: 0.65rem 0.75rem;
        cursor: pointer;
      }

      .floating-day-choice.active,
      .floating-day-choice:hover,
      .floating-day-choice:focus {
        background: #e6f6fa;
        border-color: #0f6b7a;
        color: #0f4c5c;
        font-weight: 700;
      }

      .itinerary-prev-next {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        margin: 1.5rem 0 0;
        padding-top: 1rem;
        border-top: 1px solid rgba(15, 107, 122, 0.16);
      }

      .itinerary-nav-button {
        border: 0;
        border-radius: 999px;
        background: #155e75;
        color: #ffffff;
        padding: 0.75rem 1rem;
        font-weight: 700;
        cursor: pointer;
      }

      .itinerary-nav-button:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .itinerary-clickable-option {
        cursor: pointer;
        transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
      }

      .itinerary-clickable-option:hover,
      .itinerary-clickable-option:focus {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
        outline: 3px solid rgba(15, 107, 122, 0.18);
      }

      .selected-itinerary-option {
        border: 2px solid #0f6b7a !important;
        box-shadow: 0 14px 32px rgba(15, 107, 122, 0.20) !important;
        background: linear-gradient(180deg, #ffffff 0%, #edfafe 100%) !important;
      }

      .selected-option-label {
        margin: 0.65rem 0 1rem;
        padding: 0.7rem 0.85rem;
        border-radius: 14px;
        background: #ecfdf5;
        color: #065f46;
        font-weight: 700;
        border: 1px solid #a7f3d0;
      }

      @media (max-width: 640px) {
        .itinerary-selector-wrapper {
          margin: 0.5rem;
          border-radius: 16px;
        }

        .itinerary-floating-panel {
          right: 12px;
          bottom: 12px;
        }

        .itinerary-floating-btn {
          padding: 0.7rem 0.9rem;
          font-size: 0.9rem;
        }

        .itinerary-prev-next {
          flex-direction: column;
        }
      }
    `;

    document.head.appendChild(style);
  }
})();
