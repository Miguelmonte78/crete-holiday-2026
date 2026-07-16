Crete Family Holiday 2026 - Safe PWA Update Files

This ZIP contains the safer PWA update package.

Copy these files into your existing project folder exactly as shown:

Crete-Holiday-2026/index.html
Crete-Holiday-2026/manifest.json
Crete-Holiday-2026/service-worker.js
Crete-Holiday-2026/images/icon-192.png
Crete-Holiday-2026/images/icon-512.png

Important testing notes:
1. Do not test the files from SharePoint or OneDrive preview.
2. The red warning in SharePoint preview is expected because scripts may be blocked there.
3. Download the ZIP and unzip it locally.
4. Copy the files into your local Crete-Holiday-2026 folder.
5. If Windows asks to replace existing files, choose Replace.
6. Open Crete-Holiday-2026/index.html from the local folder.
7. Press CTRL + F5.

Important PWA note:
Full PWA installation and service-worker behaviour works best after uploading the complete site to GitHub Pages using HTTPS.
Opening index.html locally with file:/// can display the page, but some PWA features may not fully activate.

Safe service worker change:
The service-worker.js included here caches files individually. If an optional file such as images/hero.jpg is missing, the service worker should skip it instead of failing the entire setup.
