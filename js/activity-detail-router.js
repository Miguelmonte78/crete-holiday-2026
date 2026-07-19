/* =========================================================
   Crete Travel App - Activity Detail Router
   File: js/activity-detail-router.js

   Purpose:
   When opening activities.html from itinerary.html with a URL like:
     activities.html?open=details&activity=phaistos-palace#phaistos-palace
   this script opens the correct activity detail modal automatically.

   It works with the current activities.html structure where:
     - activities array includes id: "phaistos-palace"
     - window.openActivityDetails(id) opens the View details modal
========================================================= */
(function () {
  "use strict";

  const aliasMap = {
    "phaistos": "phaistos-palace",
    "phaistos-palace": "phaistos-palace",
    "agia-triada": "agia-triada",
    "matala-caves": "matala-evening",
    "matala-beach": "matala-evening",
    "red-beach": "matala-evening",
    "matala-evening": "matala-evening",
    "kommos-beach": "kommos-beach",
    "kalamaki-beach": "kalamaki-beach",
    "agiofarago-gorge": "agiofarago",
    "agiofarago": "agiofarago",
    "zaros-lake": "zaros-lake",
    "heraklion-archaeological-museum": "heraklion-museum",
    "heraklion-museum": "heraklion-museum",
    "gortyna": "gortyna",
    "agia-galini": "agia-galini",
    "triopetra-beach": "triopetra",
    "triopetra": "triopetra",
    "mires-market": "mires-market",
    "kamilari-village": "kamilari-walk",
    "kamilari-walk": "kamilari-walk",
    "groceries": "groceries",
    "departure-logistics": "departure-logistics",
    "heraklion-airport": "departure-logistics"
  };

  function normalizeId(value) {
    if (!value) return "";
    const clean = String(value)
      .trim()
      .toLowerCase()
      .replace(/%20/g, "-")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return aliasMap[clean] || clean;
  }

  function getRequestedActivityId() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("activity") || params.get("activityId") || params.get("id") || params.get("openActivity");
    const fromHash = window.location.hash ? decodeURIComponent(window.location.hash.replace("#", "")) : "";
    return normalizeId(fromQuery || fromHash);
  }

  function setSearchToActivity(activityId) {
    const searchInput = document.getElementById("activitySearch");
    if (!searchInput) return;
    const friendlyNames = {
      "phaistos-palace": "Phaistos Palace",
      "agia-triada": "Agia Triada",
      "matala-evening": "Matala",
      "kommos-beach": "Kommos",
      "kalamaki-beach": "Kalamaki",
      "agiofarago": "Agiofarago",
      "zaros-lake": "Zaros",
      "heraklion-museum": "Heraklion Museum",
      "gortyna": "Gortyna",
      "agia-galini": "Agia Galini",
      "triopetra": "Triopetra",
      "mires-market": "Moires",
      "kamilari-walk": "Kamilari",
      "groceries": "Grocery",
      "departure-logistics": "Departure"
    };
    searchInput.value = friendlyNames[activityId] || activityId.replace(/-/g, " ");
  }

  function tryOpenActivityDetails(activityId, attempt) {
    if (!activityId) return;
    attempt = attempt || 1;

    if (typeof window.openActivityDetails === "function") {
      // Keep card list focused on selected place, then open the existing details modal.
      setSearchToActivity(activityId);
      if (typeof window.renderDailyPanel === "function") window.renderDailyPanel();
      if (typeof window.renderActivities === "function") window.renderActivities();

      window.openActivityDetails(activityId);
      return;
    }

    // The existing activities.html defines openActivityDetails after page scripts load.
    // Retry a few times on the client side without requiring the user to do anything.
    if (attempt < 20) {
      window.setTimeout(function () {
        tryOpenActivityDetails(activityId, attempt + 1);
      }, 100);
    } else {
      console.warn("Activity detail router: openActivityDetails function was not found.");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const activityId = getRequestedActivityId();
    const params = new URLSearchParams(window.location.search);
    const shouldOpen = params.get("open") === "details" || Boolean(window.location.hash);
    if (activityId && shouldOpen) {
      // Let the original activities page finish populateFilters/renderActivities first.
      window.setTimeout(function () {
        tryOpenActivityDetails(activityId, 1);
      }, 250);
    }
  });
})();
