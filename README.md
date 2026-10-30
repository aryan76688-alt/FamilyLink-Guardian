# 🛡️ FamilyLink Guardian

A transparent, consent-based family safety and device management platform with real-time Google Maps fleet tracking, Android Hardware Keystore authentication, resilient 24/7 background tracking (boot autostart, lockscreen wake-lock, crash watchdog, offline queueing), automated 10-day retention Google Drive backups, and 1-Click Termux deployment.

---

## 📱 Pre-Compiled Android APKs (1-Click Download)

Directly download and install on your Android phones:

| Application | Description | Direct Download |
|---|---|---|
| **FamilyLink Member App** | For family members/children. Features 24/7 background GPS tracking, lockscreen resilience, boot autostart, crash recovery, offline queueing, tactile One-Tap SOS, and transparent notification. | [**Download Member APK (16 MB)**](https://github.com/aryan76688-alt/FamilyLink-Guardian/raw/main/downloads/member-debug.apk) |
| **FamilyLink Guardian App** | For family administrators. Features real-time fleet radar, live Google Maps tracking, safe zone polygons, incident alert feed, and device controls. | [**Download Guardian APK (16 MB)**](https://github.com/aryan76688-alt/FamilyLink-Guardian/raw/main/downloads/guardian-debug.apk) |

*Alternative Local Wi-Fi Downloads (when connected to PC Wi-Fi):*
- Member APK: `http://192.168.31.141:3002/downloads/member-debug.apk` (or `:8088/member-debug.apk`)
- Guardian APK: `http://192.168.31.141:3002/downloads/guardian-debug.apk` (or `:8088/guardian-debug.apk`)

---

## ⚡ 1-Click Termux Full System Local Development & Deployment

Run the complete backend, database, and responsive web dashboard directly on your Android phone using **Termux** in one single command:

```bash
pkg update -y && pkg install -y git && git clone https://github.com/aryan76688-alt/FamilyLink-Guardian.git && cd FamilyLink-Guardian && bash termux-setup.sh
```

### What `termux-setup.sh` does automatically:
1. Installs Node.js LTS, PostgreSQL, Git, and system utilities.
2. Initializes a native PostgreSQL database cluster inside Termux and sets up `familylink_db`.
3. Runs database migrations (`prisma db push`).
4. Builds the NestJS API server and Next.js responsive web dashboard.
5. Generates `termux-start.sh` and `termux-stop.sh` scripts.
6. Launches all services and prints your local access URLs!

### Termux Commands:
```bash
./termux-start.sh    # Launches PostgreSQL, API (port 3000), Web (port 3002), and Worker
./termux-stop.sh     # Stops all FamilyLink services in Termux
```

---

## 🔒 24/7 Background Resilience & Anti-Crash Architecture

The Member app is built to guarantee uninterrupted tracking under all real-world Android constraints:

1. **Autostart on Reboot / Boot Completed**:
   - `BootReceiver` intercepts `ACTION_BOOT_COMPLETED`, `ACTION_LOCKED_BOOT_COMPLETED`, `ACTION_MY_PACKAGE_REPLACED`, and `QUICKBOOT_POWERON`.
   - The location foreground service immediately starts upon phone restart before or after device unlock.
2. **Work on Lockscreen (CPU Wake-Lock)**:
   - Acquires a dedicated partial `PowerManager.WakeLock` (`PARTIAL_WAKE_LOCK`), preventing the Android kernel from suspending the CPU or killing GPS listeners when the screen turns off or device is locked.
3. **App Crash & Process Kill Recovery**:
   - `LocationForegroundService` returns `START_STICKY` in `onStartCommand`. If Android OS kills the process due to low memory, the system automatically recreates it when resources free up.
   - Independent `WatchdogAlarmReceiver` runs via `AlarmManager` every 15 minutes to inspect the service status; if found stopped, it immediately relaunches the service.
4. **Seamless Online / Offline Internet Transition**:
   - **Offline**: When internet is unavailable, GPS points are buffered safely into local encrypted Room SQLite with status `PENDING`.
   - **Online**: When internet reconnects, `ConnectivityManager.NetworkCallback` instantly triggers `flushPendingQueue()`, draining buffered locations to the PostgreSQL server in a single batch.
5. **Battery Optimization Exemption**:
   - Prompts for `Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`, ensuring OEM battery cleaners (MIUI, OneUI, OxygenOS) do not throttle background tracking.

---

## 🛡️ Anti-Surveillance & Transparent Family Safety

FamilyLink Guardian enforces strict transparency and user consent:
- **Pinned Notification**: The Member app displays a persistent notification tray banner: `FamilyLink • Location sharing active • Guardian: Aryan`.
- **Zero Hidden/Stealth APK Behavior**: Always visible in the Android App Drawer and Settings.
- **Unilateral Member Control**: The member can pause location sharing or unlink at any time directly from the Privacy Center.
- **Hardware Keystore Authentication**: Devices sign authentication payloads using EC P-256 keys generated in the Android Hardware Keystore.
- **Strict Anti-Spyware Exclusions**: Zero WhatsApp database access, zero call interception, zero notification snooping, zero keylogging.

---

## 🚀 Web Dashboard & Google Maps Fleet Radar

- **Web Dashboard**: `http://localhost:3002/` (or `http://192.168.31.141:3002/`)
- **Live Google Maps Fleet View**: `http://localhost:3002/map`
- **Gemini AI Safety Briefing**: `http://localhost:3002/ai`
- **Desktop Command Center**: `http://localhost:3002/command-center`

---

## 📋 Complete Installation & Setup Guide

For full development setup on Ubuntu/Linux/Docker, see [**INSTALLATION_GUIDE.md**](INSTALLATION_GUIDE.md).

---

### Appendix: Google Maps Platform Compliance & Licensing

- **Cost Notice**: Real-world usage requires an active Google Cloud Billing account. Google Maps Platform provides a monthly recurring credit of \$200 covering thousands of map loads, geocoding requests, and routes computations for family tracking.
- **Products Used**:
  - [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript?utm_campaign=gmp_git_agentskills_v1) (Interactive Web Fleet Radar, Advanced Markers, Polygons)
  - [Geocoding API](https://developers.google.com/maps/documentation/geocoding?utm_campaign=gmp_git_agentskills_v1) (Reverse GPS to physical street address translation)
  - [Routes API](https://developers.google.com/maps/documentation/routes?utm_campaign=gmp_git_agentskills_v1) (Live Pickup ETA and traffic duration calculation)
  - [Places API](https://developers.google.com/maps/documentation/places/web-service?utm_campaign=gmp_git_agentskills_v1) (Safe zone location search and school autocomplete)
- **API Key Restrictions**: Secure your API key by visiting the [Google Cloud Console Credentials Page](https://console.cloud.google.com/google/maps-apis/credentials?utm_campaign=gmp_git_agentskills_v1) and applying HTTP Referrer restrictions.
- **License Scope & Terms**: All mapping, routing, and reverse-geocoding functionality complies with the [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms?utm_campaign=gmp_git_agentskills_v1).
