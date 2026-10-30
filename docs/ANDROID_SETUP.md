# Android Development & Build Guide

## Modules
1. `:shared`: Kotlin Multiplatform/Android library containing Room database, DataStore, Retrofit network interfaces, and WebRTC models.
2. `:member`: The family member client app (CameraX, FusedLocationProviderClient, MediaProjection, WorkManager).
3. `:guardian`: The guardian viewer app (Live Maps, WebRTC stream renderer, Remote request triggers).

## Prerequisites
- Android Studio Iguana / Jellyfish or later
- JDK 17
- Android SDK 34 (UpsideDownCake)
- Min SDK: 24 (Android 7.0+)

## Building Debug APKs
```bash
cd android
./gradlew :member:assembleDebug
./gradlew :guardian:assembleDebug
```
Output locations:
- `member/build/outputs/apk/debug/member-debug.apk`
- `guardian/build/outputs/apk/debug/guardian-debug.apk`

## Production Signing
Add your keystore properties in `android/keystore.properties` (never commit this file):
```properties
RELEASE_STORE_FILE=my-release-key.jks
RELEASE_STORE_PASSWORD=********
RELEASE_KEY_ALIAS=familylink
RELEASE_KEY_PASSWORD=********
```
Then execute:
```bash
./gradlew :member:bundleRelease :guardian:bundleRelease
```
