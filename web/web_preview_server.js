const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FamilyLink Guardian - Live Web Portal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.0.2/dist/maplibre-gl.css" />
  <script src="https://unpkg.com/maplibre-gl@4.0.2/dist/maplibre-gl.js"></script>
  <style>
    body { background-color: #020617; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
    #map { height: 420px; width: 100%; border-radius: 1rem; }
    .custom-marker {
      background: #2563eb;
      color: white;
      border: 2px solid white;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 13px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  <!-- Top Navbar -->
  <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-50">
    <div class="flex items-center space-x-3">
      <div class="p-2 bg-blue-600/20 text-blue-500 rounded-xl">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
      </div>
      <div>
        <h1 class="text-lg font-bold text-white tracking-tight">FamilyLink Guardian</h1>
        <p class="text-xs text-slate-400">Consent-Based Family Safety Command Center</p>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
        <span class="w-2 h-2 mr-2 bg-emerald-400 rounded-full animate-pulse"></span>
        PostgreSQL 15 & Redis Live
      </span>
      <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">AS</div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div class="text-xs font-medium text-slate-400 uppercase">Authorized Fleet</div>
        <div class="text-3xl font-extrabold text-white mt-1" id="total-devices">2</div>
        <div class="text-xs text-slate-500 mt-1">Paired via Android Keystore</div>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div class="text-xs font-medium text-slate-400 uppercase">Live Online Devices</div>
        <div class="text-3xl font-extrabold text-emerald-400 mt-1" id="online-devices">2</div>
        <div class="text-xs text-slate-500 mt-1">Real-time GPS tracking active</div>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div class="text-xs font-medium text-slate-400 uppercase">Google Drive Backup</div>
        <div class="text-3xl font-extrabold text-blue-400 mt-1">Verified</div>
        <div class="text-xs text-slate-500 mt-1">Transparent User Drive Folder</div>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div class="text-xs font-medium text-slate-400 uppercase">Retention Policy</div>
        <div class="text-3xl font-extrabold text-amber-400 mt-1">10 Days</div>
        <div class="text-xs text-slate-500 mt-1">Offline room queue safety enabled</div>
      </div>
    </div>

    <!-- Live Map Section -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-white">Live Family Fleet Map (MapLibre GL)</h2>
          <p class="text-xs text-slate-400">Low-latency real-time GPS telemetry from Android Fused Location Provider</p>
        </div>
        <button onclick="fetchLocations()" class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition">
          Refresh Map
        </button>
      </div>
      <div id="map"></div>
    </div>

    <!-- Device List & Gemini Assistant Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Device Cards -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-white">Active Family Devices</h3>
        <div id="devices-container" class="space-y-4">
          <div class="text-slate-400 text-sm">Loading telemetry...</div>
        </div>
      </div>

      <!-- Gemini AI Assistant Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center space-x-2 text-blue-400 mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <h3 class="text-lg font-bold text-white">Gemini 1.5 Safety Assistant</h3>
          </div>
          <p class="text-xs text-slate-400 mb-4">Query your family fleet status in natural language via server-side sanitized context.</p>
          
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-sm leading-relaxed text-slate-300 min-h-[120px]" id="ai-response">
            Click 'Ask Gemini' to generate an intelligent status assessment of battery, sync health, and coordinates.
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <input type="text" id="ai-prompt" value="Summarize today's family safety and device health." class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
          <button onclick="askGemini()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition">
            Ask Gemini
          </button>
        </div>
      </div>
    </div>
  </main>

  <script>
    let map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-122.418, 37.779],
      zoom: 13
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    let markers = [];

    async function fetchLocations() {
      try {
        const res = await fetch('http://localhost:3000/api/location/family/latest');
        const data = await res.json();

        // Clear markers
        markers.forEach(m => m.remove());
        markers = [];

        const container = document.getElementById('devices-container');
        container.innerHTML = '';

        data.forEach(item => {
          // Add marker
          if (item.location) {
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.innerText = item.name.charAt(0);

            const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
              '<b>' + item.name + '</b><br>Battery: ' + item.battery + '%<br>Accuracy: ±' + item.location.accuracy + 'm'
            );

            const m = new maplibregl.Marker({ element: el })
              .setLngLat([item.location.longitude, item.location.latitude])
              .setPopup(popup)
              .addTo(map);
            markers.push(m);
          }

          // Render card
          const card = document.createElement('div');
          card.className = 'bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between';
          card.innerHTML = '<div>' +
            '<div class="text-sm font-bold text-white">' + item.name + '</div>' +
            '<div class="text-xs text-slate-400 mt-0.5">Battery: ' + item.battery + '% • Wi-Fi • Room Queued</div>' +
            '</div>' +
            '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">LIVE</span>';
          container.appendChild(card);
        });
      } catch (err) {
        console.error(err);
      }
    }

    async function askGemini() {
      const prompt = document.getElementById('ai-prompt').value;
      const respBox = document.getElementById('ai-response');
      respBox.innerText = 'Analyzing with Google Gemini 1.5 Flash...';

      try {
        const res = await fetch('http://localhost:3000/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        respBox.innerText = data.response;
      } catch (err) {
        respBox.innerText = 'Error calling Gemini backend.';
      }
    }

    map.on('load', fetchLocations);
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[WEB-DASHBOARD]: Live FamilyLink Guardian web UI running on http://0.0.0.0:${PORT}`);
});
