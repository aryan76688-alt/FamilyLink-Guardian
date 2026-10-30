package com.familylink.member.services

import android.app.Service
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.IBinder
import android.util.Log
import kotlin.math.sqrt

class CrashDetectionService : Service(), SensorEventListener {
    private val TAG = "CrashDetection"
    private var sensorManager: SensorManager? = null
    private var accelerometer: Sensor? = null
    private var lastImpactTimestamp: Long = 0

    override fun onCreate() {
        super.onCreate()
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as? SensorManager
        accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        accelerometer?.let {
            sensorManager?.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null || event.sensor.type != Sensor.TYPE_ACCELEROMETER) return

        val x = event.values[0]
        val y = event.values[1]
        val z = event.values[2]

        val magnitude = sqrt(x * x + y * y + z * z)

        // Threshold for crash / severe fall: > 38 m/s^2 (~4G impact)
        if (magnitude > 38f) {
            val now = System.currentTimeMillis()
            if (now - lastImpactTimestamp > 30000) { // Throttle to prevent duplicate alarms
                lastImpactTimestamp = now
                Log.w(TAG, "Severe impact detected: $magnitude m/s^2! Dispatching Crash Detection alert.")
                // Notify user with audio prompt & start 30s countdown before triggering SOS
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onDestroy() {
        super.onDestroy()
        sensorManager?.unregisterListener(this)
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
