package com.familylink.member.services

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.google.android.gms.location.ActivityTransitionResult
import com.google.android.gms.location.DetectedActivity

class ActivityTransitionReceiver : BroadcastReceiver() {
    private val TAG = "ActivityReceiver"

    override fun onReceive(context: Context, intent: Intent) {
        if (!ActivityTransitionResult.hasResult(intent)) {
            return
        }

        val result = ActivityTransitionResult.extractResult(intent) ?: return

        for (event in result.transitionEvents) {
            val activityName = when (event.activityType) {
                DetectedActivity.IN_VEHICLE -> "IN_VEHICLE"
                DetectedActivity.ON_BICYCLE -> "ON_BICYCLE"
                DetectedActivity.WALKING -> "WALKING"
                DetectedActivity.RUNNING -> "RUNNING"
                DetectedActivity.STILL -> "STILL"
                else -> "UNKNOWN"
            }

            Log.i(TAG, "Activity Transition: $activityName, TransitionType: ${event.transitionType}")

            // If entering vehicle transit, automatically boost GPS frequency
            if (event.activityType == DetectedActivity.IN_VEHICLE) {
                val serviceIntent = Intent(context, LocationForegroundService::class.java).apply {
                    putExtra(LocationForegroundService.EXTRA_INTERVAL_MS, 5000L)
                }
                context.startService(serviceIntent)
            }
        }
    }
}
