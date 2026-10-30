package com.familylink.shared.data.models

data class User(
    val id: String,
    val email: String,
    val name: String,
    val role: String,
    val familyGroupId: String?
)

data class Device(
    val id: String,
    val name: String,
    val battery: Int,
    val networkType: String,
    val isOnline: Boolean,
    val lastSeenAt: String,
    val permissions: DevicePermissions?
)

data class DevicePermissions(
    val locationEnabled: Boolean = true,
    val cameraEnabled: Boolean = false,
    val microphoneEnabled: Boolean = false,
    val screenShareEnabled: Boolean = false,
    val cloudBackupEnabled: Boolean = true,
    val locationInterval: Int = 30
)

data class LocationRecord(
    val latitude: Double,
    val longitude: Double,
    val accuracy: Float? = null,
    val speed: Float? = null,
    val heading: Float? = null,
    val battery: Int? = null,
    val isOfflineQueued: Boolean = false,
    val timestamp: String
)

data class BatchLocationRequest(
    val points: List<LocationRecord>
)

data class AuthResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: User
)

data class PairingCodeResponse(
    val code: String,
    val expiresAt: String,
    val qrPayload: String
)

data class DevicePairRequest(
    val pairingCode: String,
    val deviceName: String,
    val publicKey: String,
    val platform: String = "Android"
)

data class DevicePairResponse(
    val deviceId: String,
    val deviceToken: String,
    val familyGroupId: String
)

data class TriggerSosRequest(
    val deviceId: String,
    val latitude: Double,
    val longitude: Double,
    val address: String? = null,
    val battery: Int? = null,
    val reason: String = "MANUAL_SOS",
    val audioRecordingUrl: String? = null
)

data class ResolveSosRequest(
    val status: String = "RESOLVED",
    val resolvedBy: String? = null
)

data class SosAlert(
    val id: String,
    val deviceId: String,
    val status: String,
    val reason: String,
    val latitude: Double,
    val longitude: Double,
    val address: String? = null,
    val battery: Int? = null,
    val startedAt: String,
    val device: Device? = null
)

data class GeofenceZone(
    val id: String = "",
    val familyGroupId: String,
    val name: String,
    val type: String = "SAFE",
    val centerLat: Double? = null,
    val centerLng: Double? = null,
    val radiusMeters: Double? = null,
    val notifyOnEnter: Boolean = true,
    val notifyOnExit: Boolean = true
)

data class GeofenceEventRequest(
    val deviceId: String,
    val geofenceZoneId: String,
    val eventType: String,
    val latitude: Double,
    val longitude: Double
)

data class ActivityRecordRequest(
    val deviceId: String,
    val activityType: String,
    val confidence: Int = 100,
    val speedKmh: Float? = null
)

data class LastGaspRequest(
    val deviceId: String,
    val latitude: Double,
    val longitude: Double,
    val batteryLevel: Int,
    val wifiSsid: String? = null,
    val cellInfo: String? = null,
    val triggerReason: String = "BATTERY_CRITICAL"
)

data class FocusModeConfig(
    val deviceId: String,
    val enabled: Boolean = false,
    val modeName: String = "Study Focus",
    val scheduledStart: String? = null,
    val scheduledEnd: String? = null,
    val dndActive: Boolean = false,
    val blockedApps: List<String>? = null
)
