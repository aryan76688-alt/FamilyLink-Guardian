# Web Dashboard Setup Guide

The web dashboard is built using Next.js 14 (App Router), TypeScript, Tailwind CSS, MapLibre GL, and Socket.IO client.

## Quick Start
```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```
Open `http://localhost:3001` in your browser.

## Features
- **Live Device Map:** High-performance hardware-accelerated MapLibre GL tracking with real-time WebSocket markers.
- **Remote Session Management:** Initiate authorized Camera, Microphone, and Screen Sharing requests.
- **Device Health & Battery:** Live battery state, network type (Wi-Fi/Cellular), and offline alarms.
- **AI Family Assistant:** Natural-language queries powered by Gemini 1.5 via the Railway backend.
