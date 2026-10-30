package com.familylink.guardian

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.runtime.*
import com.familylink.guardian.screens.ComposeDevice
import com.familylink.guardian.screens.GuardianHomeScreen
import com.familylink.guardian.screens.GuardianSplashScreen
import com.familylink.guardian.screens.sampleFleet
import com.familylink.guardian.ui.screens.*
import com.familylink.guardian.ui.theme.FamilyLinkGuardianTheme

sealed class GuardianDestination {
    object Splash : GuardianDestination()
    object Home : GuardianDestination()
    object LiveMap : GuardianDestination()
    data class DeviceDetail(val device: ComposeDevice) : GuardianDestination()
    data class Camera(val device: ComposeDevice) : GuardianDestination()
    data class ScreenMirror(val device: ComposeDevice) : GuardianDestination()
    data class History(val device: ComposeDevice) : GuardianDestination()
    data class Storage(val device: ComposeDevice) : GuardianDestination()
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FamilyLinkGuardianTheme {
                GuardianAppNavHost()
            }
        }
    }
}

@Composable
fun GuardianAppNavHost() {
    var currentScreen by remember { mutableStateOf<GuardianDestination>(GuardianDestination.Splash) }
    var selectedDevice by remember { mutableStateOf(sampleFleet.first()) }

    AnimatedContent(
        targetState = currentScreen,
        transitionSpec = { fadeIn() togetherWith fadeOut() },
        label = "GuardianNavigation"
    ) { screen ->
        when (screen) {
            is GuardianDestination.Splash -> {
                GuardianSplashScreen(
                    onGetStarted = { currentScreen = GuardianDestination.Home }
                )
            }
            is GuardianDestination.Home -> {
                GuardianHomeScreen(
                    onDeviceClick = { device ->
                        selectedDevice = device
                        currentScreen = GuardianDestination.DeviceDetail(device)
                    },
                    onMapClick = {
                        currentScreen = GuardianDestination.LiveMap
                    },
                    onAddMember = {
                        // In future opens pairing wizard
                    }
                )
            }
            is GuardianDestination.LiveMap -> {
                LiveMapScreen(
                    onBack = { currentScreen = GuardianDestination.Home },
                    onSelectDevice = { device ->
                        selectedDevice = device
                        currentScreen = GuardianDestination.DeviceDetail(device)
                    }
                )
            }
            is GuardianDestination.DeviceDetail -> {
                DeviceDetailScreen(
                    device = screen.device,
                    onBack = { currentScreen = GuardianDestination.Home },
                    onOpenLiveMap = { currentScreen = GuardianDestination.LiveMap },
                    onOpenLiveCamera = { currentScreen = GuardianDestination.Camera(screen.device) },
                    onOpenScreenMirror = { currentScreen = GuardianDestination.ScreenMirror(screen.device) },
                    onOpenLocationHistory = { currentScreen = GuardianDestination.History(screen.device) },
                    onOpenStorageBackup = { currentScreen = GuardianDestination.Storage(screen.device) }
                )
            }
            is GuardianDestination.Camera -> {
                CameraViewerScreen(
                    device = screen.device,
                    onBack = { currentScreen = GuardianDestination.DeviceDetail(screen.device) }
                )
            }
            is GuardianDestination.ScreenMirror -> {
                ScreenMirrorViewerScreen(
                    device = screen.device,
                    onBack = { currentScreen = GuardianDestination.DeviceDetail(screen.device) }
                )
            }
            is GuardianDestination.History -> {
                LocationHistoryScreen(
                    device = screen.device,
                    onBack = { currentScreen = GuardianDestination.DeviceDetail(screen.device) }
                )
            }
            is GuardianDestination.Storage -> {
                StorageBackupScreen(
                    device = screen.device,
                    onBack = { currentScreen = GuardianDestination.DeviceDetail(screen.device) }
                )
            }
        }
    }
}
