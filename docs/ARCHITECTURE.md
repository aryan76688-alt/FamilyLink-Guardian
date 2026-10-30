# Architecture

FamilyLink Guardian uses a robust, offline-first architecture with clear separation of concerns.

## Components
1.  **Frontend (Android)**: Jetpack Compose, Room (Local DB), WorkManager (Sync), CameraX, MediaProjection.
2.  **Frontend (Web)**: Next.js, React, Tailwind CSS, MapLibre.
3.  **Backend (API)**: NestJS, PostgreSQL, Redis, WebSocket.
4.  **Backend (Worker)**: Node.js background jobs.

## Offline-First Sync
GPS -> Room -> Encrypted Sync Queue -> Internet -> Upload -> Verify -> Google Drive -> Expire Local.
