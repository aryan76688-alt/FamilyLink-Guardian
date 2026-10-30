package com.familylink.member.services

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.GeofencingEvent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class GeofenceBroadcastReceiver : BroadcastReceiver() {
    private val TAG = "GeofenceReceiver"

    override fun onReceive(context: Context, intent: Intent) {
        val geofencingEvent = GeofencingEvent.fromIntent(intent) ?: return

        if (geofencingEvent.hasError()) {
            Log.e(TAG, "Geofencing error code: ${geofencingEvent.errorCode}")
            return
        }

        val transitionType = geofencingEvent.geofenceTransition
        val triggeringGeofences = geofencingEvent.triggeringGeofences ?: emptyList()
        val location = geofencingEvent.triggeringLocation

        val eventName = when (transitionType) {
            Geofence.GEOFENCE_TRANSITION_ENTER -> "ENTER"
            Geofence.GEOFENCE_TRANSITION_EXIT -> "EXIT"
            else -> "DWELL"
        }

        Log.i(TAG, "Geofence event: $eventName at (${location?.latitude}, ${location?.longitude})")

        CoroutineScope(Dispatchers.IO).launch {
            for (geofence in triggeringGeofences) {
                val zoneId = geofence.requestId
                // Broadcast local transition or push to API
                Log.d(TAG, "Triggered zone: $zoneId with event $eventName")
            }
        }
    }
}
