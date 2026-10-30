# PostgreSQL Schema & Data Architecture

FamilyLink Guardian uses PostgreSQL with UUID primary keys and strict relational integrity.

## Relational Schema Diagram
```
User (Guardian/Member)
  | 1..n
FamilyGroup
  | 1..n
Device
  +-- DeviceKeys (Public key store)
  +-- DevicePermissions (Granular consent)
  +-- DeviceSessions (WebRTC active session audit)
  +-- LocationPoints (GPS history)
  +-- MediaFiles (Recordings & snapshots)
  +-- SyncJobs (WorkManager synchronization tracking)
  +-- DriveBackups (Google Drive upload registry)
  +-- Consents (Explicit privacy grants)
  +-- AuditLogs (Tamper-evident system activity log)
```

## Key Entities
- **DevicePermissions**: Controls whether location, camera, mic, screen share, and call metadata are permitted by the member.
- **AuditLog**: Immutably records every sensitive request (actor, device, action, result, timestamp, IP).
- **MediaFiles**: Tracks media life cycle across states: `PENDING -> UPLOADING -> UPLOADED -> VERIFIED -> BACKED_UP -> EXPIRED_LOCAL`.
