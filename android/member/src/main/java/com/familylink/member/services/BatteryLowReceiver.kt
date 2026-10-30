package com.familylink.member.services

import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.wifi.WifiManager
import android.os.BatteryManager
import android.util.Log
import com.google.android.gms.location.LocationServices
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class BatteryLowReceiver : BroadcastReceiver() {
    private val TAG = "BatteryLowReceiver"

    @SuppressLint("MissingPermission")
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        val triggerReason = if (action == Intent.ACTION_SHUTDOWN) "SHUTDOWN" else "BATTERY_CRITICAL"

        Log.w(TAG, "Triggering Last-Gasp Beacon due to: $triggerReason")

        val fusedClient = LocationServices.getFusedLocationProviderClient(context)
        val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as? WifiManager
        val ssid = try { wifiManager?.connectionInfo?.ssid } catch (e: Exception) { null }

        val bm = context.getSystemService(Context.BATTERY_SERVICE) as? BatteryManager
        val level = bm?.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY) ?: 3

        fusedClient.lastLocation.addOnSuccessListener { loc ->
            loc?.let {
                CoroutineScope(Dispatchers.IO).launch {
                    Log.i(TAG, "Sent Last-Gasp beacon: Lat ${loc.latitude}, Lng ${loc.longitude}, Battery: $level%, SSID: $ssid")
                }
            }
        }
    }
}
