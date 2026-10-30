# Google Drive Integration Guide

Unlike surveillance apps that use Google Drive hidden `appDataFolder`, FamilyLink Guardian deliberately creates a transparent, user-accessible Google Drive folder:
`FamilyLink Guardian/Members/<MemberName>/`

## Directory Hierarchy in Drive
```
My Drive/
 └── FamilyLink Guardian/
      ├── Members/
      │    ├── Aryan Phone/
      │    │    ├── Location/
      │    │    ├── Camera/
      │    │    └── Voice/
      │    └── Mom Phone/
      ├── Reports/
      ├── Backups/
      └── Audit/
```

## Setup Instructions
1. Open [Google Cloud Console](https://console.cloud.google.com).
2. Create project `FamilyLink-Guardian`.
3. Enable **Google Drive API**.
4. Configure OAuth Consent Screen (Internal or External).
5. Add OAuth Scope: `https://www.googleapis.com/auth/drive.file` (access only to files created by this application).
6. Create OAuth 2.0 Client ID (Web Application).
7. Obtain Refresh Token via OAuth Playground or server initiation script.
8. Store `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` in the Railway Worker environment.
