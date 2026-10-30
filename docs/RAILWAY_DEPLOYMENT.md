# Railway Deployment Guide

FamilyLink Guardian is designed to deploy seamlessly on Railway using Nixpacks.

## Services Architecture in Railway
1. **familylink-postgres**: Managed PostgreSQL Database.
2. **familylink-redis**: Managed Redis instance for WebSocket session states and caching.
3. **familylink-api**: NestJS REST & WebSocket API service.
4. **familylink-web**: Next.js frontend web dashboard.
5. **familylink-worker**: Background worker daemon handling Google Drive backups, media validation, and data retention.

## Environment Variables
In Railway Dashboard, link your PostgreSQL & Redis databases, then configure:
```env
DATABASE_URL=${{postgres.DATABASE_URL}}
REDIS_URL=${{redis.REDIS_URL}}
JWT_SECRET=super_strong_random_secret_string
GEMINI_API_KEY=AIzaSy...
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REFRESH_TOKEN=1//...
STORAGE_BUCKET=familylink-media
```
