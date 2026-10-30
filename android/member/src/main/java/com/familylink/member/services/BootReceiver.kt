package com.familylink.member.services

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.SystemClock
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    private val TAG = "FamilyLinkBootReceiver"

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        Log.i(TAG, "Device event received: $action. Initiating autostart...")

        // 1. Immediately launch LocationForegroundService
        val serviceIntent = Intent(context, LocationForegroundService::class.java).apply {
            this.action = LocationForegroundService.ACTION_START_TRACKING
        }
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }
            Log.i(TAG, "LocationForegroundService autostarted successfully.")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start service directly from boot: ${e.message}", e)
        }

        // 2. Schedule Watchdog Alarm to safeguard against future crash or kill
        scheduleWatchdog(context)
    }

    companion object {
        fun scheduleWatchdog(context: Context) {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
            val watchdogIntent = Intent(context, WatchdogAlarmReceiver::class.java).apply {
                action = WatchdogAlarmReceiver.ACTION_WATCHDOG_PULSE
            }
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                WatchdogAlarmReceiver.REQUEST_CODE,
                watchdogIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // Trigger pulse every 15 minutes to guarantee service continuity
            val intervalMs = 15 * 60 * 1000L
            val triggerAtMs = SystemClock.elapsedRealtime() + intervalMs

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtMs, pendingIntent)
            } else {
                alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtMs, intervalMs, pendingIntent)
            }
            Log.d("FamilyLinkBootReceiver", "Watchdog pulse scheduled.")
        }
    }
}
