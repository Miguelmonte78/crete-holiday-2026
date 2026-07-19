/* Crete app UI fixes - dark/light button readability and activity hash support */
(function(){
'use strict';
function applyMode(mode){const dark=mode==='dark';document.body.classList.toggle('dark-mode',dark);document.documentElement.classList.toggle('dark-mode',dark);document.querySelectorAll('#darkModeToggle,.dark-mode-toggle,[data-dark-toggle]').forEach(btn=>{btn.textContent=dark?'☀️':'🌙';btn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');});localStorage.setItem('crete_dark_mode',dark?'dark':'light');}
function setupDarkMode(){applyMode(localStorage.getItem('crete_dark_mode')||'light');document.querySelectorAll('#darkModeToggle,.dark-mode-toggle,[data-dark-toggle]').forEach(btn=>{if(btn.dataset.creteUiBound)return;btn.dataset.creteUiBound='true';btn.addEventListener('click',()=>applyMode(document.body.classList.contains('dark-mode')?'light':'dark'));});}
function setupActivityHash(){const hash=decodeURIComponent(location.hash||'').replace('#','');if(!hash)return;let target=document.getElementById(hash);if(target){target.scrollIntoView({behavior:'smooth',block:'start'});target.classList.add('activity-linked-highlight');}}
document.addEventListener('DOMContentLoaded',function(){setupDarkMode();setupActivityHash();});
})();
