package com.familylink.member.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.familylink.member.ui.theme.*

/**
 * SCREEN 13: Member App Home Screen
 * Transparent safety dashboard, unilateral pause/resume controls,
 * One-Tap SOS Emergency Dispatch, Automated Crash Detection,
 * Smart Activity Recognition status, and Downtime Focus mode.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MemberHomeScreen(
    isSharingActive: Boolean,
    onToggleSharing: () -> Unit,
    onOpenPrivacyCenter: () -> Unit,
    onOpenPairing: () -> Unit,
    deviceKey: String,
    onTriggerSos: () -> Unit = {},
    onCancelSos: () -> Unit = {}
) {
    var isSosActive by remember { mutableStateOf(false) }
    var transitMode by remember { mutableStateOf("Still • Home Zone") }
    var isFocusModeEnabled by remember { mutableStateOf(false) }

    // Pulsing animation for SOS Beacon
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.08f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "sosPulse"
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("FamilyLink Member", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = NavyPrimary)
                        Text("Guardian: Aryan • Transparent Safety", fontSize = 11.sp, color = TextSecondaryLight)
                    }
                },
                actions = {
                    IconButton(onClick = onOpenPrivacyCenter) {
                        Icon(Icons.Default.Security, contentDescription = "Privacy Center", tint = BluePrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = SurfaceLight)
            )
        },
        bottomBar = {
            NavigationBar(containerColor = SurfaceLight) {
                NavigationBarItem(
                    selected = true,
                    onClick = {},
                    icon = { Icon(Icons.Default.Shield, contentDescription = "Status") },
                    label = { Text("Protection", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onOpenPrivacyCenter,
                    icon = { Icon(Icons.Default.Lock, contentDescription = "Privacy") },
                    label = { Text("Privacy", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onOpenPairing,
                    icon = { Icon(Icons.Default.QrCode, contentDescription = "Pairing") },
                    label = { Text("Pairing", fontSize = 10.sp) }
                )
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(BackgroundLight)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // ONE-TAP SOS EMERGENCY DISPATCH CARD
            Card(
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isSosActive) Color(0xFFFEF2F2) else Color(0xFFFFF1F2)
                ),
                border = androidx.compose.foundation.BorderStroke(
                    1.5.dp,
                    if (isSosActive) DangerRed else Color(0xFFFECDD3)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = DangerRed, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (isSosActive) "EMERGENCY SOS BROADCASTING" else "ONE-TAP EMERGENCY SOS",
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 12.sp,
                                color = DangerRed
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = if (isSosActive) DangerRed else Color(0xFFFFE4E6)
                        ) {
                            Text(
                                text = if (isSosActive) "LIVE 1s GPS" else "READY",
                                color = if (isSosActive) Color.White else DangerRed,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    if (!isSosActive) {
                        Text(
                            text = "Tap to immediately dispatch emergency distress alert, activate high-accuracy 1-second GPS beacon, and notify guardians.",
                            fontSize = 12.sp,
                            color = TextPrimaryLight,
                            lineHeight = 16.sp
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        Button(
                            onClick = {
                                isSosActive = true
                                onTriggerSos()
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = DangerRed)
                        ) {
                            Icon(Icons.Default.Emergency, contentDescription = null, tint = Color.White)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("HOLD OR TAP FOR SOS EMERGENCY", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                    } else {
                        Box(
                            modifier = Modifier
                                .scale(pulseScale)
                                .size(72.dp)
                                .clip(CircleShape)
                                .background(DangerRed),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.NotificationsActive, contentDescription = null, tint = Color.White, modifier = Modifier.size(36.dp))
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(
                            text = "Distress signal active! Guardian Aryan notified with high-priority audio alarm.",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = DangerRed
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        OutlinedButton(
                            onClick = {
                                isSosActive = false
                                onCancelSos()
                            },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = NavyPrimary)
                        ) {
                            Icon(Icons.Default.Close, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("I'm Safe • Cancel Emergency Alert", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }
                }
            }

            // Hero Sharing Status Card
            Card(
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isSharingActive) Color(0xFFF0FDF4) else Color(0xFFFEF2F2)
                ),
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (isSharingActive) Color(0xFFBBF7D0) else Color(0xFFFECACA)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(12.dp)
                                    .clip(CircleShape)
                                    .background(if (isSharingActive) SuccessGreen else DangerRed)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (isSharingActive) "LOCATION SHARING ACTIVE" else "SHARING PAUSED",
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 12.sp,
                                color = if (isSharingActive) SuccessGreen else DangerRed
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color.White
                        ) {
                            Text(
                                text = if (isSharingActive) "SYNCED" else "STANDBY",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSharingActive) SuccessGreen else DangerRed,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = if (isSharingActive)
                            "Your location and telemetry are actively synced with Guardian Aryan. An ongoing notification is pinned in your Android notification tray."
                        else
                            "All background sharing is paused. Your guardian cannot see your live position until you resume sharing.",
                        fontSize = 13.sp,
                        color = TextPrimaryLight,
                        lineHeight = 18.sp
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = onToggleSharing,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isSharingActive) DangerRed else BluePrimary
                        )
                    ) {
                        Icon(
                            imageVector = if (isSharingActive) Icons.Default.Pause else Icons.Default.PlayArrow,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isSharingActive) "Pause Location Sharing" else "Resume Location Sharing",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                }
            }

            // SMART SENSORS & SAFETY FEATURES
            Text("Proactive Protection Matrix", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = NavyPrimary)

            MemberFeatureTile(
                icon = Icons.Default.DirectionsRun,
                title = "Smart Transit & Activity Recognition",
                desc = "Play Services AI detects Walking, Vehicle, Cycling. Current: $transitMode",
                status = "Auto-Adapting",
                isOk = true
            )

            MemberFeatureTile(
                icon = Icons.Default.Sensors,
                title = "Automated Crash & Fall Detection",
                desc = "Sensor fusion monitors accelerometer for severe impact (>4G) with 30s auto-dispatch",
                status = "Active Guard",
                isOk = true
            )

            MemberFeatureTile(
                icon = Icons.Default.BatteryAlert,
                title = "Last-Gasp Low Battery Beacon",
                desc = "Transmits final GPS coordinates, Wi-Fi SSID, and cell info before battery hits 0%",
                status = "Armed (<=5%)",
                isOk = true
            )

            MemberFeatureTile(
                icon = Icons.Default.Bedtime,
                title = "Downtime & Study Focus Mode",
                desc = if (isFocusModeEnabled) "Active: Distracting apps blocked & DND enabled until 21:00" else "Scheduled: 18:00 - 21:00 daily",
                status = if (isFocusModeEnabled) "Enforced" else "Scheduled",
                isOk = isFocusModeEnabled
            )

            // Hardware Keystore Integrity Card
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.VpnKey, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Hardware Keystore Security", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = NavyPrimary)
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        "Public Key Fingerprint:",
                        fontSize = 11.sp,
                        color = TextSecondaryLight
                    )
                    Text(
                        text = deviceKey.ifEmpty { "EC-P256: 7b84:ae19:22c0:4ff1..." },
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = BluePrimary
                    )
                }
            }
        }
    }
}

@Composable
private fun MemberFeatureTile(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    desc: String,
    status: String,
    isOk: Boolean
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceLight),
        border = CardDefaults.outlinedCardBorder(),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = CircleShape,
                color = BluePrimary.copy(alpha = 0.1f),
                modifier = Modifier.size(36.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(icon, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(18.dp))
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextPrimaryLight)
                Text(desc, fontSize = 10.sp, color = TextSecondaryLight)
            }

            Surface(
                shape = RoundedCornerShape(6.dp),
                color = if (isOk) Color(0xFFF0FDF4) else Color(0xFFF1F5F9)
            ) {
                Text(
                    text = status,
                    color = if (isOk) SuccessGreen else TextSecondaryLight,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }
        }
    }
}
