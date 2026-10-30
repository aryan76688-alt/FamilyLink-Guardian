# FamilyLink Guardian

A transparent, consent-based family safety and device management platform engineered for Android, Web, and Cloud.

## Core Mission & Architecture Principles
FamilyLink Guardian is strictly designed around Google Play & Android 14+ privacy and security policies:
- **No Stealth / Cloaked Behavior:** Transparent foreground services, explicit notification badges, clear app branding.
- **Explicit Consent & Granular Permissions:** Every sensor (Location, CameraX, Audio, Screen Capture via MediaProjection) requires explicit authorization and ongoing notification.
- **Member Agency:** Family members can pause or revoke sharing at any time directly from the notification shade or privacy center.
- **Offline-First Synchronization:** Local Room DB buffering with SHA-256 verified sync to Railway API and Google Drive backups.

## System Topology
```
           +-------------------------+
           |     Guardian Web /      |
           |     Guardian Android    |
           +------------+------------+
                        | (HTTPS REST / WSS Signaling)
                        v
           +-------------------------+
           |     Railway Backend     |
           |  (NestJS + PostgreSQL)  |
           +----+---------------+----+
                |               |
   (Redis Sync) |               | (Cloud Upload Queue)
                v               v
           +---------+     +------------------------+
           |  Redis  |     | Railway Worker Service |
           +---------+     +-----------+------------+
                                       |
                                       v
                           +------------------------+
                           |   Google Drive Cloud   |
                           |    (Member Archive)    |
                           +------------------------+
                        ^
                        | (WebRTC A/V / Encrypted Chunk Sync)
           +------------+------------+
           |   Member Android Device |
           |  (Room + WorkManager)   |
           +-------------------------+
```

## Documentation Index
- [Architecture & Data Flow](ARCHITECTURE.md)
- [REST API & WebSocket Signaling Specification](API.md)
- [PostgreSQL Database & Relational Schema](DATABASE.md)
- [Android Setup & Build Guide](ANDROID_SETUP.md)
- [Web Dashboard Guide](WEB_SETUP.md)
- [Railway Cloud Deployment](RAILWAY_DEPLOYMENT.md)
- [Google Drive Backup Integration](GOOGLE_DRIVE_SETUP.md)
- [Gemini AI Assistant Integration](GEMINI_SETUP.md)
- [Security Model & Cryptography](SECURITY.md)
- [Privacy Center & Google Play Compliance](PRIVACY.md)
- [Troubleshooting & Diagnostics](TROUBLESHOOTING.md)
