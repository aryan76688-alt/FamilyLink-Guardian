# Troubleshooting & Diagnostics

## Common Issues & Resolutions

### 1. Member Device Shows "OFFLINE"
- **Cause:** Android Doze mode or aggressive OEM battery optimization killed the foreground service.
- **Fix:** In Member App Settings -> "Battery Optimization", ensure FamilyLink Member is set to "Unrestricted".
- **Verification:** Ensure the persistent notification "FamilyLink: Location sharing active" is visible in the status bar.

### 2. Camera or Screen Sharing Request Rejected
- **Cause:** By design, Android requires user consent on each MediaProjection session and when camera access starts.
- **Resolution:** The family member must tap "Allow" on the incoming prompt on their device screen.

### 3. Google Drive Uploads Pending
- **Cause:** OAuth token expired or worker queue stalled.
- **Fix:** Check Worker service logs in Railway: `railway logs -s familylink-worker`. Verify `GOOGLE_REFRESH_TOKEN` validity.
