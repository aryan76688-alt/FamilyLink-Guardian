package com.familylink.member.services

import android.app.ActivityManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.util.Log
import com.familylink.shared.data.local.AppDatabase
import com.familylink.shared.data.models.BatchLocationRequest
import com.familylink.shared.data.models.LocationRecord
import com.familylink.shared.network.ApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class WatchdogAlarmReceiver : BroadcastReceiver() {
    private val TAG = "WatchdogAlarmReceiver"

    override fun onReceive(context: Context, intent: Intent) {
        Log.i(TAG, "Watchdog pulse triggered. Verifying service & network health...")

        // 1. Verify service state; restart if killed by OS or crash
        if (!isServiceRunning(context, LocationForegroundService::class.java)) {
            Log.w(TAG, "LocationForegroundService found STOPPED! Relaunching...")
            val serviceIntent = Intent(context, LocationForegroundService::class.java).apply {
                action = LocationForegroundService.ACTION_START_TRACKING
            }
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(serviceIntent)
                } else {
                    context.startService(serviceIntent)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Watchdog failed to restart service: ${e.message}")
            }
        } else {
            Log.d(TAG, "LocationForegroundService is ALIVE and RUNNING.")
        }

        // 2. Offline Queue Drain: If online, flush pending Room locations to backend
        if (isNetworkAvailable(context)) {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val db = AppDatabase.getDatabase(context.applicationContext)
                    val pending = db.locationDao().getPendingLocations()
                    if (pending.isNotEmpty()) {
                        Log.i(TAG, "Flushing ${pending.size} offline location points...")
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
                                isOfflineQueued = true,
                                timestamp = dateFormat.format(Date(it.timestamp))
                            )
                        }
                        val response = ApiClient.apiService.recordLocation(BatchLocationRequest(records))
                        if (response.isSuccessful) {
                            val ids = pending.map { it.id.toString() }
                            db.locationDao().markSynced(ids)
                            Log.i(TAG, "Successfully flushed ${pending.size} offline points to backend.")
                        }
                    }
                } catch (e: Exception) {
                    Log.w(TAG, "Offline flush attempt encountered error (will retry next pulse): ${e.message}")
                }
            }
        }

        // 3. Re-arm watchdog alarm for continuous 24/7 protection
        BootReceiver.scheduleWatchdog(context)
    }

    @Suppress("DEPRECATION")
    private fun isServiceRunning(context: Context, serviceClass: Class<*>): Boolean {
        val manager = context.getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager ?: return false
        for (service in manager.getRunningServices(Int.MAX_VALUE)) {
            if (serviceClass.name == service.service.className) {
                return true
            }
        }
        return false
    }

    private fun isNetworkAvailable(context: Context): Boolean {
        val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager ?: return false
        val network = cm.activeNetwork ?: return false
        val capabilities = cm.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    companion object {
        const val ACTION_WATCHDOG_PULSE = "com.familylink.member.WATCHDOG_PULSE"
        const val REQUEST_CODE = 9021
    }
}
