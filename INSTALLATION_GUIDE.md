# FamilyLink Guardian — Complete Production Installation & Setup Guide

This guide provides the **exhaustive, step-by-step installation instructions** to deploy and run the actual, fully functional **FamilyLink Guardian** platform across:
1. **Google Maps Platform** (Real Maps JavaScript API, Places API, Routes API, Geocoding API)
2. **Android Location APIs** (`FusedLocationProviderClient`, `Priority.PRIORITY_HIGH_ACCURACY`, `GeofencingClient`, `ActivityRecognitionClient`)
3. **Database & Infrastructure** (PostgreSQL 15+ and Redis via Docker/Podman)
4. **Backend API** (NestJS 10 + Prisma ORM + Socket.io WebSockets)
5. **Proactive Safety Services** (One-Tap SOS, Crash & Fall Sensor Fusion, Last-Gasp Beacon, Focus Mode, Gemini AI)
6. **Cloud Backup Worker** (10-Day Retention & Google Drive SHA-256 Verification)
7. **Responsive Web Dashboard** (Next.js 14, Tailwind CSS, `@vis.gl/react-google-maps`)
8. **Android Guardian & Member Apps** (Jetpack Compose Material 3, Android 14 Foreground Service)

---

## High-Impact Proactive Safety Features Implemented

| Feature | Android & Platform Implementation | Guardian & Dashboard View |
|---|---|---|
| **1. One-Tap Emergency SOS Beacon** | Instant tactile button elevating `FusedLocationProviderClient` to **1-second live GPS streaming** with priority `PRIORITY_HIGH_ACCURACY`. | Flashing high-priority SOS alert banner with live distance vector, sound alarm, and direct emergency call button. |
| **2. Automated Crash & Fall Detection** | `CrashDetectionService` with `SensorManager` monitoring accelerometer for severe deceleration impacts (> 38 m/s² / ~4G) with 30s auto-cancel prompt. | Dispatches automated incident alert to family with exact impact GPS coordinates if member is unresponsive. |
| **3. "Last-Gasp" Low Battery Beacon** | `BatteryLowReceiver` intercepts `ACTION_BATTERY_LOW` (<=5%) and `ACTION_SHUTDOWN`, broadcasting final GPS, Wi-Fi SSID, and cell info before power death. | Map marker pin permanently tags "🪫 Last-Gasp: Battery died at [Time] near Wi-Fi [SSID]" so family knows the exact final location. |
| **4. Smart Transit & Activity Recognition** | `ActivityRecognitionClient` with `ActivityTransitionRequest` detecting `IN_VEHICLE`, `WALKING`, `ON_BICYCLE`, and `STILL`. | Dynamic map marker badge (`🚗 48 km/h`, `🚶 Walking`, `🏠 Still`) and speed-threshold alerts. |
| **5. Live Route Pickup ETA** | Integrates **Google Routes API** for real-time traffic and driving calculation between guardian and member. | Live route card displaying turn-by-turn ETA (e.g. `14 mins (5.8 km) via Oakway Blvd`) and direct navigation trigger. |
| **6. Custom Polygon Safe Zones** | `google.maps.Polygon` on Web and `GeofencingClient` on Android defining multi-campus perimeters (Home, School, Work). | Real-time entry and exit event notifications logged with audit timestamps. |
| **7. Gemini AI Safety Recap & Anomaly Explainer** | Backend integration with **Gemini 1.5 Flash** summarizing 24-hour telemetry into 3 actionable bullets and explaining route detours. | Instant 1-click natural language safety briefings and route anomaly verification on `/ai` dashboard. |
| **8. Downtime & Study Focus Mode** | Enforces DND via `NotificationManager.setInterruptionFilter` and monitors app usage with `UsageStatsManager` during study hours. | Guardian can schedule remote focus blocks (e.g., 18:00 - 21:00) with social/gaming apps blocked. |
| **9. Transparent Privacy & Anti-Surveillance** | Pinned non-dismissible Android 14 notification tray item; unilateral member pause at any time; hardware EC P-256 Keystore signatures. | Complete transparency: No stealth APK, no hidden services, zero covert surveillance. |

---

## Architecture Overview

```
                                      ┌───────────────────────────────────────────────┐
                                      │         Google Maps Platform API               │
                                      │   (Maps JS, Places New, Routes, Geocoding)    │
                                      └──────────────────────┬────────────────────────┘
                                                             │
┌──────────────────────────┐      REST / WebSocket           ▼            Live GPS / WebRTC    ┌──────────────────────────┐
│   Android Guardian App   │ ◄────────────────────────► ┌─────────┐ ◄────────────────────────► │    Android Member App    │
│  (Jetpack Compose M3)    │                            │ NestJS  │                            │  (Foreground Service +   │
└──────────────────────────┘                            │   API   │                            │   Hardware Keystore)     │
                                                        └───┬───┬─┘                            └──────────────────────────┘
┌──────────────────────────┐                                │   │
│   Web Guardian Center    │ ◄──────────────────────────────┘   │
│ (Next.js 14 + React Maps)│                                    ▼
└──────────────────────────┘                         ┌────────────────────┐
                                                     │ PostgreSQL + Prisma│
                                                     └──────────┬─────────┘
                                                                │
                                                                ▼
                                                     ┌────────────────────┐
                                                     │ Background Worker  │
                                                     │ (10-Day Retention  │
                                                     │ + Google Drive E2EE│
                                                     └────────────────────┘
```

---

## System Requirements & Prerequisites

Ensure the following tools are installed on your host machine:

| Tool | Recommended Version | Verification Command |
|---|---|---|
| **Node.js** | `v18.18+` or `v20.x` | `node -v` |
| **npm** | `v9.x` or `v10.x` | `npm -v` |
| **Docker & Compose** | Docker 24+ / Compose v2 | `docker compose version` |
| **Java JDK** | OpenJDK 17 | `java -version` |
| **Android SDK** | API Level 34 (Android 14) | Via Android Studio or `sdkmanager` |
| **Git** | `v2.40+` | `git --version` |

---

## Step 1: Google Maps Platform Setup

The platform uses the **official Google Maps Platform APIs** for real-time fleet radar, geofencing perimeters, and live route directions.

### A. Obtain an API Key

1. **Option 1: Production Key (Google Cloud Console)**
   - Go to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/google/maps-apis/credentials?utm_campaign=gmp_git_agentskills_v1).
   - Create or select your Google Cloud project.
   - Click **+ CREATE CREDENTIALS** ➔ **API key**.
   - Copy your new API key (starts with `AIzaSy...`).

2. **Option 2: Instant Prototyping (Maps Demo Key)**
   - If you do not yet have a Google Cloud billing account, generate a free [Maps Demo Key](https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1).
   - Sign in with any Google account and accept the demo terms to reveal your key immediately.

### B. Enable Required Google Maps APIs
In the [Google Cloud Console Library](https://console.cloud.google.com/apis/library?utm_campaign=gmp_git_agentskills_v1), search for and **ENABLE** the following 4 APIs:
1. **Maps JavaScript API** (Powers the interactive web fleet radar, custom markers, and satellite views)
2. **Places API (New)** (Powers location search and safe zone autocomplete)
3. **Routes API** (Calculates live ETAs, routes, and waypoints)
4. **Geocoding API** (Converts GPS coordinates into physical street addresses)

### C. Recommended API Key Restrictions (Security Best Practice)
To prevent unauthorized quota usage, restrict your API key:
- **Application restrictions**: Set to **HTTP referrers** and add:
  - `http://localhost:3001/*`
  - `http://127.0.0.1:3001/*`
  - `https://your-production-domain.com/*`
- **API restrictions**: Restrict key to only the 4 APIs listed above.

---

## Step 2: Database & Infrastructure (PostgreSQL & Redis)

Start the production PostgreSQL database and Redis cache using Docker Compose:

```bash
cd /home/aryan/CONNECT

# Launch PostgreSQL 15 and Redis 7 in background
docker compose up -d

# Verify containers are healthy
docker compose ps
```

*Default credentials configured in `docker-compose.yml`:*
- Host: `localhost:5432`
- Database: `familylink_db`
- Username: `familylink`
- Password: `familylink_password`

---

## Step 3: Backend API Setup (`api/`)

The backend is built with **NestJS 10** and **Prisma ORM**.

### 1. Install Dependencies
```bash
cd /home/aryan/CONNECT/api
npm install
```

### 2. Configure Environment Variables
Create or verify `.env` in `api/`:
```bash
cat << 'EOF' > .env
DATABASE_URL="postgresql://familylink:familylink_password@localhost:5432/familylink_db?schema=public"
JWT_SECRET="super_secret_familylink_jwt_key_2026"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="super_secret_familylink_refresh_key_2026"
JWT_REFRESH_EXPIRES_IN="30d"
PORT=3000
FRONTEND_URL="http://localhost:3001"
REDIS_URL="redis://localhost:6379"
GEMINI_API_KEY="AIzaSy_your_gemini_key_optional"
STORAGE_BUCKET="familylink-media"
EOF
```

### 3. Initialize Prisma Schema & Database Tables
Push the schema to PostgreSQL:
```bash
npx prisma generate
npx prisma db push
```

### 4. Build & Start the API Server
```bash
# Production NestJS build
npm run build

# Start the NestJS API
npm run start:prod
# Or for development with hot-reload:
# npm run start:dev
```

*The API will start on `http://localhost:3000`.*
Verify health:
```bash
curl http://localhost:3000/health
```

*(Note: A zero-dependency standalone fallback server is also available via `node standalone_server.js` if running in environments without NestJS build tools).*

---

## Step 4: Background Retention Worker (`worker/`)

The background worker enforces the **10-day local retention rule**: records and media are automatically audited, backed up to Google Drive, and safely purged only once SHA-256 cloud verification succeeds.

### 1. Install Dependencies
```bash
cd /home/aryan/CONNECT/worker
npm install
```

### 2. Configure Environment Variables
Create `.env` in `worker/`:
```bash
cat << 'EOF' > .env
DATABASE_URL="postgresql://familylink:familylink_password@localhost:5432/familylink_db?schema=public"
LOCAL_RETENTION_DAYS=10
LOG_LEVEL=info
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REFRESH_TOKEN="your_refresh_token"
GOOGLE_DRIVE_FOLDER_ID="root"
EOF
```

### 3. Build & Run the Worker
```bash
npm run build
npm start
```

---

## Step 5: Responsive Web Guardian Dashboard (`web/`)

The web dashboard is built with **Next.js 14**, **Tailwind CSS**, and **`@vis.gl/react-google-maps`**.

### 1. Install Dependencies
```bash
cd /home/aryan/CONNECT/web
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in `web/`:
```bash
cat << 'EOF' > .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=DEMO_MAP_ID
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF
```

*(Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your key from Step 1).*

### 3. Run Development or Production Server
```bash
# Production Build & Start (Running on port 3002)
npm run build
PORT=3002 npm run start -- -H 0.0.0.0 -p 3002
```

### 4. Access the Web Dashboard
Open your browser to:
- **Landing Showcase Directory**: [http://localhost:3002/](http://localhost:3002/) (or [http://192.168.31.141:3002/](http://192.168.31.141:3002/))
- **Live Google Map Fleet Radar**: [http://localhost:3002/map](http://localhost:3002/map)
- **Desktop Command Center**: [http://localhost:3002/command-center](http://localhost:3002/command-center)
- **Gemini AI Safety Briefing & Anomaly Explainer**: [http://localhost:3002/ai](http://localhost:3002/ai)
- **Location History Playback**: [http://localhost:3002/history](http://localhost:3002/history)
- **Device Details**: [http://localhost:3002/devices/1](http://localhost:3002/devices/1)

### 5. Install the Native APKs Directly On Your Phone
The Android APKs have been built and are hosted directly on the local server for 1-tap download over Wi-Fi:

1. **FamilyLink Member APK** (`member-debug.apk` ~16 MB):
   - **Direct Browser Download**: [http://192.168.31.141:3002/downloads/member-debug.apk](http://192.168.31.141:3002/downloads/member-debug.apk) (or [http://192.168.31.141:8088/member-debug.apk](http://192.168.31.141:8088/member-debug.apk))
   - **ADB Install (via USB cable)**:
     ```bash
     adb install -r /home/aryan/CONNECT/android/member/build/outputs/apk/debug/member-debug.apk
     ```

2. **FamilyLink Guardian APK** (`guardian-debug.apk` ~16 MB):
   - **Direct Browser Download**: [http://192.168.31.141:3002/downloads/guardian-debug.apk](http://192.168.31.141:3002/downloads/guardian-debug.apk) (or [http://192.168.31.141:8088/guardian-debug.apk](http://192.168.31.141:8088/guardian-debug.apk))
   - **ADB Install (via USB cable)**:
     ```bash
     adb install -r /home/aryan/CONNECT/android/guardian/build/outputs/apk/debug/guardian-debug.apk
     ```

### 6. Test Live Real GPS on Your Mobile Phone (Instant Verification)
Because the server is bound to all network interfaces (`0.0.0.0`), you can test the **real live GPS tracking immediately on your mobile phone**:
1. Connect your phone to the same Wi-Fi network as this PC (`192.168.31.141`).
2. Open Chrome or Safari on your phone and navigate to:
   👉 **`http://192.168.31.141:3002/map`**
3. When prompted, tap **"Allow Location Access"**.
4. **Result**:
   - The map will detect your phone's real GPS sensors.
   - It will automatically center directly over your **real current location**.
   - It calls the Google Maps Geocoding API in real time to display your actual street name, neighborhood, city, and GPS accuracy (e.g. `±4m`).
   - Tapping the **"Locate My Phone (Real GPS)"** button will continuously track your movement in real time.

---

## Step 6: Native Android Applications (`android/`)

The system includes two native Android applications built with **Jetpack Compose (Material 3)**:
1. `guardian`: For the family administrator to monitor devices, geofences, and view live streams.
2. `member`: For family members with real hardware GPS (`LocationManager`), strict anti-surveillance privacy guarantees, unilateral pause, and pinned notification.

### 1. Android Toolchain Configuration
The project is configured to use:
- **Java JDK 17**: Located at `/home/aryan/Android/jdk-17`
- **Android SDK**: Located at `/home/aryan/Android/Sdk`
- **Google Maps Key**: Already configured in manifests with `AIzaSyADv-hBmMfj_GDU4ZDjvMq8wHPSV75IEo0`

### 2. Open in Android Studio & Run on Phone
1. Launch **Android Studio**.
2. Select **Open** and choose `/home/aryan/CONNECT/android`.
3. Ensure JDK 17 is selected in **Settings ➔ Build, Execution, Deployment ➔ Build Tools ➔ Gradle ➔ Gradle JDK**.
4. Connect your Android phone via USB cable and enable **USB Debugging** in Developer Options.
5. Select the `member` or `guardian` run configuration and click **▶ Run**.
6. The app will install directly on your phone, prompt for location permissions, and immediately begin real GPS tracking!

---

## Step 7: End-to-End Verification & Pairing Flow

1. **Launch the Guardian Dashboard** (Web or Android Guardian App):
   - Click **+ Add Family Member**.
   - Note the generated 6-digit PIN (e.g. `839-204`) and QR Code.
2. **Launch the Member App** on the family member's phone:
   - Enter the 6-digit PIN.
   - Accept the transparent sharing consent agreement.
   - The device will generate an EC P-256 key pair inside the **Android Hardware Keystore** and register with the backend.
3. **Verify Foreground Service Notification**:
   - Swipe down the notification drawer on the Member phone.
   - Confirm the pinned, non-dismissible notification is visible:
     > `FamilyLink • Location sharing active • Guardian: Aryan`
4. **View Live Google Maps Radar**:
   - Open [http://localhost:3001/map](http://localhost:3001/map).
   - Observe the real Google Maps canvas with custom member avatars, battery percentages, safe zone perimeter circle, and real pan/zoom controls!
5. **Test Unilateral Member Pause**:
   - In the Member App, tap **"Pause Location Sharing"**.
   - Observe the map badge update immediately from `ONLINE` to `PAUSED`. Live background tracking is halted instantly.

---

## Troubleshooting & FAQ

- **Google Maps shows a gray box or "For development purposes only":**
  - Verify your API key has **Maps JavaScript API** enabled in Google Cloud Console.
  - If your key has HTTP referrer restrictions, ensure `http://localhost:3001/*` is allowed.
- **Port 3000 or 3001 already in use:**
  - Check running processes: `lsof -i :3000` or `lsof -i :3001`.
  - Terminate previous processes: `kill -9 <PID>`.
- **Database Connection Refused:**
  - Verify PostgreSQL is running: `docker compose ps`.
  - Test connection: `pg_isready -h localhost -p 5432`.

---

## Appendix: Google Maps Platform Compliance & Licensing

- **Cost Notice**: Real-world usage requires an active Google Cloud Billing account. Google Maps Platform provides a monthly recurring credit of \$200 covering tens of thousands of map loads, geocoding requests, and routes computations for family tracking.
- **Products Used**:
  - [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript?utm_campaign=gmp_git_agentskills_v1) (Interactive Web Fleet Radar, Advanced Markers, Polygons)
  - [Geocoding API](https://developers.google.com/maps/documentation/geocoding?utm_campaign=gmp_git_agentskills_v1) (Reverse GPS to street address translation)
  - [Routes API](https://developers.google.com/maps/documentation/routes?utm_campaign=gmp_git_agentskills_v1) (Live Pickup ETA and traffic duration calculation)
  - [Places API](https://developers.google.com/maps/documentation/places/web-service?utm_campaign=gmp_git_agentskills_v1) (Safe zone location search and school autocomplete)
- **API Key Restrictions**: Secure your API key by visiting the [Google Cloud Console Credentials Page](https://console.cloud.google.com/google/maps-apis/credentials?utm_campaign=gmp_git_agentskills_v1) and applying HTTP Referrer restrictions.
- **License Scope & Terms**: All mapping, routing, and reverse-geocoding functionality complies with the [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms?utm_campaign=gmp_git_agentskills_v1).

