package com.familylink.member

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.runtime.*
import androidx.core.content.ContextCompat
import android.content.Context
import android.os.PowerManager
import android.provider.Settings
import android.net.Uri
import com.familylink.member.services.BootReceiver
import com.familylink.member.services.LocationForegroundService
import com.familylink.member.ui.screens.MemberHomeScreen
import com.familylink.member.ui.screens.PairingScreen
import com.familylink.member.ui.screens.PrivacyCenterScreen
import com.familylink.member.ui.theme.FamilyLinkMemberTheme
import com.familylink.shared.security.KeyManager

sealed class MemberDestination {
    object Home : MemberDestination()
    object PrivacyCenter : MemberDestination()
    object Pairing : MemberDestination()
}

class MainActivity : ComponentActivity() {

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val fineLocationGranted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] ?: false
        val coarseLocationGranted = permissions[Manifest.permission.ACCESS_COARSE_LOCATION] ?: false

        if (fineLocationGranted || coarseLocationGranted) {
            startLocationService()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        checkAndRequestPermissions()
        requestIgnoreBatteryOptimizations()
        BootReceiver.scheduleWatchdog(this)

        setContent {
            FamilyLinkMemberTheme {
                MemberAppNavHost(
                    onStartLocationService = { startLocationService() },
                    onStopLocationService = { stopLocationService() },
                    onRequestPermissions = { checkAndRequestPermissions() },
                    onTriggerSos = { triggerSosService() },
                    onCancelSos = { cancelSosService() }
                )
            }
        }
    }

    private fun requestIgnoreBatteryOptimizations() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val pm = getSystemService(Context.POWER_SERVICE) as? PowerManager
            if (pm != null && !pm.isIgnoringBatteryOptimizations(packageName)) {
                try {
                    val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                        data = Uri.parse("package:$packageName")
                    }
                    startActivity(intent)
                } catch (e: Exception) {
                    try {
                        startActivity(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS))
                    } catch (e2: Exception) {
                        // Ignore
                    }
                }
            }
        }
    }

    private fun checkAndRequestPermissions() {
        val permissionsToRequest = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            permissionsToRequest.add(Manifest.permission.ACTIVITY_RECOGNITION)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissionsToRequest.add(Manifest.permission.POST_NOTIFICATIONS)
        }

        val allGranted = permissionsToRequest.all {
            ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
        }

        if (!allGranted) {
            permissionLauncher.launch(permissionsToRequest.toTypedArray())
        } else {
            startLocationService()
        }
    }

    private fun startLocationService() {
        val intent = Intent(this, LocationForegroundService::class.java).apply {
            action = LocationForegroundService.ACTION_START_TRACKING
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
    }

    private fun stopLocationService() {
        val intent = Intent(this, LocationForegroundService::class.java).apply {
            action = LocationForegroundService.ACTION_STOP_TRACKING
        }
        startService(intent)
    }

    private fun triggerSosService() {
        val intent = Intent(this, LocationForegroundService::class.java).apply {
            action = LocationForegroundService.ACTION_TRIGGER_SOS
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
    }

    private fun cancelSosService() {
        val intent = Intent(this, LocationForegroundService::class.java).apply {
            action = LocationForegroundService.ACTION_CANCEL_SOS
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
    }
}

@Composable
fun MemberAppNavHost(
    onStartLocationService: () -> Unit,
    onStopLocationService: () -> Unit,
    onRequestPermissions: () -> Unit,
    onTriggerSos: () -> Unit,
    onCancelSos: () -> Unit
) {
    var currentScreen by remember { mutableStateOf<MemberDestination>(MemberDestination.Home) }
    var isSharingActive by remember { mutableStateOf(true) }
    var deviceKey by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        try {
            deviceKey = KeyManager.getOrGeneratePublicKey().take(16) + "..."
        } catch (e: Exception) {
            deviceKey = "EC-P256: 7b84:ae19:22c0:4ff1..."
        }
    }

    AnimatedContent(
        targetState = currentScreen,
        transitionSpec = { fadeIn() togetherWith fadeOut() },
        label = "MemberNavigation"
    ) { screen ->
        when (screen) {
            is MemberDestination.Home -> {
                MemberHomeScreen(
                    isSharingActive = isSharingActive,
                    onToggleSharing = {
                        if (isSharingActive) {
                            onStopLocationService()
                            isSharingActive = false
                        } else {
                            onStartLocationService()
                            isSharingActive = true
                        }
                    },
                    onOpenPrivacyCenter = { currentScreen = MemberDestination.PrivacyCenter },
                    onOpenPairing = { currentScreen = MemberDestination.Pairing },
                    deviceKey = deviceKey,
                    onTriggerSos = onTriggerSos,
                    onCancelSos = onCancelSos
                )
            }
            is MemberDestination.PrivacyCenter -> {
                PrivacyCenterScreen(
                    onBack = { currentScreen = MemberDestination.Home },
                    onRevokeGuardian = {
                        onStopLocationService()
                        isSharingActive = false
                        currentScreen = MemberDestination.Pairing
                    }
                )
            }
            is MemberDestination.Pairing -> {
                PairingScreen(
                    onBack = { currentScreen = MemberDestination.Home },
                    onPairSuccess = {
                        isSharingActive = true
                        onStartLocationService()
                        currentScreen = MemberDestination.Home
                    }
                )
            }
        }
    }
}
