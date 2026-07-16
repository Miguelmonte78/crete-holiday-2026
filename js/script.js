/* =========================================================
   Crete Family Holiday 2026
   File: js/script.js
   Purpose: render central trip data and manage interactions
   ========================================================= */

(function () {
    "use strict";

    const storageKeys = {
        darkMode: "creteHolidayDarkMode"
    };

    function getTripData() {
        return window.creteTripData || null;
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderItinerary() {
        const container = document.getElementById("itineraryCards");
        const data = getTripData();

        if (!container || !data || !Array.isArray(data.itinerary)) {
            return;
        }

        container.innerHTML = data.itinerary.map(function (item) {
            const tags = (item.tags || []).map(function (tag) {
                return `<span class="badge rounded-pill text-bg-dark">${escapeHtml(tag)}</span>`;
            }).join(" ");

            return `
                <div class="col-lg-6 itinerary-card-wrapper" data-theme="${escapeHtml(item.theme)}">
                    <article class="card h-100 shadow-sm itinerary-card">
                        <div class="card-header ${escapeHtml(item.color)} ${escapeHtml(item.text)}">
                            <strong>Day ${escapeHtml(item.day)}</strong> — ${escapeHtml(item.title)}
                        </div>

                        <div class="card-body">
                            <div class="d-flex flex-wrap gap-2 mb-3">
                                ${tags}
                                <span class="badge rounded-pill text-bg-secondary">${escapeHtml(item.priceStatus)}</span>
                            </div>

                            <p><strong>Date:</strong> ${escapeHtml(item.date)}</p>
                            <p><strong>Morning:</strong> ${escapeHtml(item.morning)}</p>
                            <p><strong>Lunch:</strong> ${escapeHtml(item.lunch)}</p>
                            <p><strong>Afternoon:</strong> ${escapeHtml(item.afternoon)}</p>
                            <p><strong>Evening:</strong> ${escapeHtml(item.evening)}</p>

                            <div class="row g-3 mt-3">
                                <div class="col-6 col-md-3">
                                    <div class="border rounded p-2 bg-light h-100">
                                        <small class="text-muted">Distance</small><br>
                                        <strong>${escapeHtml(item.distanceKm)}</strong>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div class="border rounded p-2 bg-light h-100">
                                        <small class="text-muted">Drive time</small><br>
                                        <strong>${escapeHtml(item.driveTime)}</strong>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div class="border rounded p-2 bg-light h-100">
                                        <small class="text-muted">Activity cost</small><br>
                                        <strong>${escapeHtml(item.activityCost)}</strong>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div class="border rounded p-2 bg-light h-100">
                                        <small class="text-muted">Food budget</small><br>
                                        <strong>${escapeHtml(item.foodBudget)}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer d-flex flex-column flex-md-row justify-content-between gap-2">
                            <span><strong>Estimated day total:</strong> ${escapeHtml(item.estimatedTotal)}</span>
                            <span><strong>Price source:</strong> ${escapeHtml(item.priceSource)}</span>
                        </div>
                    </article>
                </div>
            `;
        }).join("");
    }

    function populateThemeFilter() {
        const filter = document.getElementById("themeFilter");
        const data = getTripData();

        if (!filter || !data || !Array.isArray(data.itinerary)) {
            return;
        }

        const themes = Array.from(new Set(data.itinerary.map(function (item) {
            return item.theme;
        }))).sort();

        filter.innerHTML = '<option value="all">All themes</option>' + themes.map(function (theme) {
            return `<option value="${escapeHtml(theme)}">${escapeHtml(theme)}</option>`;
        }).join("");
    }

    function setupItinerarySearch() {
        const searchInput = document.getElementById("itinerarySearch");
        const themeFilter = document.getElementById("themeFilter");

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilters() {
            const query = normalize(searchInput ? searchInput.value : "");
            const selectedTheme = normalize(themeFilter ? themeFilter.value : "all");
            const cards = document.querySelectorAll(".itinerary-card-wrapper");

            cards.forEach(function (wrapper) {
                const text = normalize(wrapper.textContent);
                const theme = normalize(wrapper.getAttribute("data-theme"));
                const matchesQuery = !query || text.includes(query);
                const matchesTheme = selectedTheme === "all" || theme === selectedTheme;
                wrapper.style.display = matchesQuery && matchesTheme ? "" : "none";
            });
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        if (themeFilter) {
            themeFilter.addEventListener("change", applyFilters);
        }
    }

    function updateCountdown() {
        const countdownElement = document.getElementById("countdown");
        if (!countdownElement) return;

        const departureDate = new Date("2026-07-21T00:00:00");
        const now = new Date();
        const difference = departureDate.getTime() - now.getTime();
        const daysRemaining = Math.ceil(difference / (1000 * 60 * 60 * 24));

        if (daysRemaining > 1) countdownElement.textContent = daysRemaining + " days";
        else if (daysRemaining === 1) countdownElement.textContent = "1 day";
        else if (daysRemaining === 0) countdownElement.textContent = "Departure today";
        else countdownElement.textContent = "Trip started";
    }

    function setupDarkModeToggle() {
        const darkModeToggle = document.getElementById("darkModeToggle");
        const savedPreference = localStorage.getItem(storageKeys.darkMode);

        if (savedPreference === "enabled") {
            document.body.classList.add("dark-mode");
        }

        if (!darkModeToggle) return;

        darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";

        darkModeToggle.addEventListener("click", function () {
            const enabled = document.body.classList.toggle("dark-mode");
            localStorage.setItem(storageKeys.darkMode, enabled ? "enabled" : "disabled");
            darkModeToggle.textContent = enabled ? "☀️" : "🌙";
        });
    }

    function hideLoadingScreen() {
        const loadingScreen = document.getElementById("loadingScreen");
        if (!loadingScreen) return;

        loadingScreen.classList.add("loading-screen-hidden");
        window.setTimeout(function () {
            loadingScreen.style.display = "none";
        }, 350);
    }

    function highlightCurrentNavigationLink() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".navbar-nav .nav-link").forEach(function (link) {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
            }
        });
    }

    function initializeApp() {
        renderItinerary();
        populateThemeFilter();
        setupItinerarySearch();
        updateCountdown();
        setupDarkModeToggle();
        highlightCurrentNavigationLink();
    }

    document.addEventListener("DOMContentLoaded", initializeApp);
    window.addEventListener("load", hideLoadingScreen);
})();
