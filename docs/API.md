# REST API & WebSocket Signaling Specification

The FamilyLink Guardian backend exposes REST endpoints for state synchronization, auth, and pairing, alongside a WebSocket gateway for WebRTC signaling and real-time telemetry.

## Base URL
- Production: `https://api.familylink.yourdomain.com`
- Development: `http://localhost:3000/api`

## Authentication & Device Pairing Flow
### 1. `POST /api/auth/register` (Guardian Registration)
Request:
```json
{
  "email": "guardian@example.com",
  "password": "SecurePassword123!",
  "name": "Aryan Sharma"
}
```
Response: `201 Created` with JWT `accessToken` & `refreshToken`.

### 2. `POST /api/auth/login`
Returns access token (short-lived, 7d) & refresh token (30d rotation).

### 3. `GET /api/auth/pairing-code` (Guardian Only)
Generates short 6-character pairing code + payload for QR generation. Expires in 15 minutes.
Response:
```json
{
  "code": "A9X7KQ",
  "expiresAt": "2026-09-27T21:45:00.000Z",
  "qrPayload": "{\"familyId\":\"uuid\",\"code\":\"A9X7KQ\"}"
}
```

### 4. `POST /api/auth/pair-device` (Member App Initial Setup)
Member device generates an RSA-2048 key pair in Android Keystore, sends public key with pairing code.
Request:
```json
{
  "pairingCode": "A9X7KQ",
  "deviceName": "Aryan's Pixel 8",
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...",
  "platform": "Android 14",
  "appVersion": "1.0.0"
}
```
Response:
```json
{
  "deviceId": "dev_4b8f...",
  "deviceToken": "eyJh...",
  "familyGroupId": "fam_89a..."
}
```

## Telemetry & Location
### `POST /api/location/record` (Device Auth)
Used by Android `SyncEngine` for offline batches or live updates:
```json
{
  "points": [
    {
      "latitude": 37.774929,
      "longitude": -122.419416,
      "accuracy": 4.5,
      "speed": 1.2,
      "heading": 180.0,
      "battery": 88,
      "timestamp": "2026-09-27T21:10:00.000Z",
      "isOfflineQueued": false
    }
  ]
}
```

### `GET /api/location/device/:deviceId/history?start=&end=`
Returns chronological timeline of location points with polyline coordinates.

## WebSocket Gateway Events (`/socket.io`)
- `DEVICE_ONLINE` / `DEVICE_OFFLINE`
- `LOCATION_UPDATED`
- `BATTERY_UPDATED`
- `SHARING_STARTED` / `SHARING_STOPPED`
- `CAMERA_SESSION_REQUEST` / `CAMERA_SESSION_RESPONSE`
- `VOICE_SESSION_REQUEST`
- `SCREEN_SESSION_REQUEST`
- `webrtc_offer` / `webrtc_answer` / `ice_candidate` (WebRTC P2P signaling relay)
