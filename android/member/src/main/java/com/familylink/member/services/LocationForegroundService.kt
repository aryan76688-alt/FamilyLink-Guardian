package com.familylink.member.services

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.location.Location
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.os.BatteryManager
import android.os.Build
import android.os.IBinder
import android.os.Looper
import android.os.PowerManager
import android.util.Log
import androidx.core.app.NotificationCompat
import com.familylink.member.MainActivity
import com.familylink.shared.data.local.AppDatabase
import com.familylink.shared.data.local.entity.LocationQueueEntity
import com.familylink.shared.data.models.BatchLocationRequest
import com.familylink.shared.data.models.LocationRecord
import com.familylink.shared.network.ApiClient
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class LocationForegroundService : Service() {
    private val TAG = "LocationForegroundService"
    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val CHANNEL_ID = "familylink_sharing_channel"
    private val NOTIFICATION_ID = 1001

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var locationCallback: LocationCallback? = null
    private var isSosMode = false

    private var wakeLock: PowerManager.WakeLock? = null
    private var networkCallback: ConnectivityManager.NetworkCallback? = null

    companion object {
        const val ACTION_START_TRACKING = "com.familylink.member.START_TRACKING"
        const val ACTION_STOP_TRACKING = "com.familylink.member.STOP_TRACKING"
        const val ACTION_TRIGGER_SOS = "com.familylink.member.TRIGGER_SOS"
        const val ACTION_CANCEL_SOS = "com.familylink.member.CANCEL_SOS"
        const val EXTRA_INTERVAL_MS = "extra_interval_ms"
    }

    override fun onCreate() {
        super.onCreate()
        Log.i(TAG, "LocationForegroundService onCreate - Initializing bulletproof background tracking")
        createNotificationChannel()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        // 1. Acquire partial wake lock for uninterrupted lockscreen execution
        try {
            val pm = getSystemService(Context.POWER_SERVICE) as? PowerManager
            wakeLock = pm?.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "FamilyLink::LockscreenWakeLock")?.apply {
                setReferenceCounted(false)
                acquire(24 * 60 * 60 * 1000L) // 24 hours lock
            }
            Log.d(TAG, "WakeLock acquired for lockscreen continuity.")
        } catch (e: Exception) {
            Log.w(TAG, "Could not acquire WakeLock: ${e.message}")
        }

        // 2. Register real-time Network Callback for instant offline->online queue drain
        registerNetworkMonitor()

        // 3. Ensure watchdog is scheduled
        BootReceiver.scheduleWatchdog(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "onStartCommand action: ${intent?.action}")

        when (intent?.action) {
            ACTION_TRIGGER_SOS -> {
                isSosMode = true
                val notification = buildPersistentNotification("🚨 EMERGENCY SOS ACTIVE • 1-Sec Live GPS Beacon")
                startForeground(NOTIFICATION_ID, notification)
                restartFusedLocationTracking(intervalMs = 1000L, priority = Priority.PRIORITY_HIGH_ACCURACY)
                return START_STICKY
            }
            ACTION_CANCEL_SOS -> {
                isSosMode = false
                val notification = buildPersistentNotification("Transparent family safety • Periodic GPS updates • Tap to open")
                startForeground(NOTIFICATION_ID, notification)
                restartFusedLocationTracking(intervalMs = 10000L, priority = Priority.PRIORITY_HIGH_ACCURACY)
                return START_STICKY
            }
            ACTION_STOP_TRACKING -> {
                Log.i(TAG, "Explicit stop requested by user.")
                stopFusedLocationTracking()
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
                return START_NOT_STICKY
            }
        }

        val notification = buildPersistentNotification("Transparent family safety • Periodic GPS updates • Tap to open")
        startForeground(NOTIFICATION_ID, notification)

        val requestedInterval = intent?.getLongExtra(EXTRA_INTERVAL_MS, 10000L) ?: 10000L
        restartFusedLocationTracking(intervalMs = requestedInterval, priority = Priority.PRIORITY_HIGH_ACCURACY)

        // Return START_STICKY to guarantee Android auto-restarts this service if killed
        return START_STICKY
    }

    @SuppressLint("MissingPermission")
    private fun restartFusedLocationTracking(intervalMs: Long, priority: Int) {
        stopFusedLocationTracking()

        try {
            // Immediate last known location fix
            fusedLocationClient.lastLocation.addOnSuccessListener { loc: Location? ->
                loc?.let { handleNewLocation(it) }
            }

            // High-precision FusedLocationProviderClient request
            val locationRequest = LocationRequest.Builder(priority, intervalMs)
                .setMinUpdateIntervalMillis(if (isSosMode) 500L else intervalMs / 2)
                .setMinUpdateDistanceMeters(if (isSosMode) 1f else 5f)
                .setWaitForAccurateLocation(isSosMode)
                .build()

            locationCallback = object : LocationCallback() {
                override fun onLocationResult(result: LocationResult) {
                    for (location in result.locations) {
                        handleNewLocation(location)
                    }
                }
            }

            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback as LocationCallback,
                Looper.getMainLooper()
            )
            Log.d(TAG, "FusedLocationProviderClient tracking registered. Interval: ${intervalMs}ms")
        } catch (e: SecurityException) {
            Log.e(TAG, "Location permission missing: ${e.message}")
        }
    }

    private fun stopFusedLocationTracking() {
        locationCallback?.let {
            fusedLocationClient.removeLocationUpdates(it)
            locationCallback = null
        }
    }

    private fun handleNewLocation(location: Location) {
        serviceScope.launch {
            try {
                val db = AppDatabase.getDatabase(applicationContext)
                val point = LocationQueueEntity(
                    latitude = location.latitude,
                    longitude = location.longitude,
                    accuracy = if (location.hasAccuracy()) location.accuracy else null,
                    speed = if (location.hasSpeed()) location.speed else null,
                    heading = if (location.hasBearing()) location.bearing else null,
                    battery = getBatteryLevel(),
                    timestamp = location.time.takeIf { it > 0 } ?: System.currentTimeMillis(),
                    syncStatus = "PENDING"
                )
                db.locationDao().insertLocation(point)

                // If online, immediately drain and upload to server
                if (isNetworkOnline()) {
                    flushPendingQueue(db)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error handling location point: ${e.message}")
            }
        }
    }

    private suspend fun flushPendingQueue(db: AppDatabase) {
        try {
            val pending = db.locationDao().getPendingLocations()
            if (pending.isEmpty()) return

            val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
                timeZone = TimeZone.getTimeZone("UTC")
            }
            val records = pending.map {
                LocationRecord(
                    latitude = it.latitude,
                    longitude = it.longitude,
                    accuracy = it.accuracy,
                    speed = it.speed,
                    heading = it.heading,
                    battery = it.battery,
                    isOfflineQueued = pending.size > 1,
                    timestamp = dateFormat.format(Date(it.timestamp))
                )
            }
            val response = ApiClient.apiService.recordLocation(BatchLocationRequest(records))
            if (response.isSuccessful) {
                val ids = pending.map { it.id.toString() }
                db.locationDao().markSynced(ids)
                Log.d(TAG, "Uploaded ${pending.size} locations successfully to server.")
            }
        } catch (e: Exception) {
            Log.w(TAG, "Offline flush paused; network transient or server unreachable: ${e.message}")
        }
    }

    private fun registerNetworkMonitor() {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager ?: return
        val request = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()

        networkCallback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                Log.i(TAG, "Internet connection RESTORED! Triggering immediate offline queue drain...")
                serviceScope.launch {
                    val db = AppDatabase.getDatabase(applicationContext)
                    flushPendingQueue(db)
                }
            }
        }
        cm.registerNetworkCallback(request, networkCallback as ConnectivityManager.NetworkCallback)
    }

    private fun isNetworkOnline(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager ?: return false
        val active = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(active) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun getBatteryLevel(): Int {
        val bm = getSystemService(Context.BATTERY_SERVICE) as? BatteryManager
        return bm?.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY) ?: 85
    }

    private fun buildPersistentNotification(contentText: String): Notification {
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val channelPriority = if (isSosMode) NotificationCompat.PRIORITY_MAX else NotificationCompat.PRIORITY_LOW

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("FamilyLink • Location sharing active • Guardian: Aryan")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true)
            .setContentIntent(pendingIntent)
            .setPriority(channelPriority)
            .setCategory(if (isSosMode) NotificationCompat.CATEGORY_ALARM else NotificationCompat.CATEGORY_SERVICE)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "FamilyLink Active Monitoring",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows visible notification while sensitive family sharing is active."
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.w(TAG, "Service onDestroy called. Releasing resources...")
        stopFusedLocationTracking()

        try {
            networkCallback?.let {
                val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
                cm?.unregisterNetworkCallback(it)
            }
        } catch (e: Exception) {
            // Ignore unregister issues on destroy
        }

        try {
            if (wakeLock?.isHeld == true) {
                wakeLock?.release()
            }
        } catch (e: Exception) {
            // Ignore
        }

        serviceScope.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
