package com.familylink.guardian.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.familylink.guardian.screens.ComposeDevice
import com.familylink.guardian.ui.theme.*

/**
 * SCREEN 5: Device Details Screen (Guardian Mobile)
 * Complete hardware metrics, 10-day retention indicator, consent matrix, and diagnostic controls.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DeviceDetailScreen(
    device: ComposeDevice,
    onBack: () -> Unit,
    onOpenLiveMap: () -> Unit,
    onOpenLiveCamera: () -> Unit,
    onOpenScreenMirror: () -> Unit,
    onOpenLocationHistory: () -> Unit,
    onOpenStorageBackup: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(device.name, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = NavyPrimary)
                        Text(
                            text = if (device.isOnline) "Live Monitoring Active" else "Offline • Last seen ${device.lastSeen}",
                            fontSize = 11.sp,
                            color = if (device.isOnline) SuccessGreen else DangerRed
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = NavyPrimary)
                    }
                },
                actions = {
                    IconButton(onClick = { /* Refresh telemetry */ }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = BluePrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = SurfaceLight)
            )
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
            // Header Device Identity Card
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, BorderLight, RoundedCornerShape(20.dp))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = CircleShape,
                        color = BluePrimary,
                        modifier = Modifier.size(56.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = device.memberName.take(1),
                                color = Color.White,
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 22.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(16.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(device.name, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimaryLight)
                            if (device.isThisDevice) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Surface(color = Color(0xFFDBEAFE), shape = RoundedCornerShape(4.dp)) {
                                    Text("Primary Guardian", fontSize = 9.sp, color = BluePrimary, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                        Text("Google Pixel 8 Pro • Android 14 (API 34)", fontSize = 11.sp, color = TextSecondaryLight)
                        Text("Hardware Keystore ID: 9f8a-44e2-bc10", fontSize = 10.sp, color = BluePrimary)
                    }
                }
            }

            // Real-Time Telemetry Grid
            Text("Hardware Telemetry", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = NavyPrimary)

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Battery Gauge Card
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                    border = CardDefaults.outlinedCardBorder()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("BATTERY", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextSecondaryLight)
                            Icon(Icons.Default.BatteryChargingFull, contentDescription = null, tint = SuccessGreen, modifier = Modifier.size(18.dp))
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("${device.battery}%", fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, color = SuccessGreen)
                        Text("Charging • 38°C Health Normal", fontSize = 10.sp, color = TextSecondaryLight)
                    }
                }

                // Network & Signal Card
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                    border = CardDefaults.outlinedCardBorder()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("NETWORK", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextSecondaryLight)
                            Icon(Icons.Default.Wifi, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(18.dp))
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(device.network, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, color = NavyPrimary)
                        Text("-72 dBm • Stable 5G Uplink", fontSize = 10.sp, color = TextSecondaryLight)
                    }
                }
            }

            // 10-Day Retention & Backup Guarantee Pill
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color(0xFFEFF6FF),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFBFDBFE)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Shield, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(24.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("10-Day Retention & Safe Purge Rule", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = NavyPrimary)
                        Text(
                            "Telemetry and media remain stored in encrypted Room database for 10 days. Local items are never deleted until Google Drive upload is SHA-256 verified.",
                            fontSize = 10.sp,
                            color = TextSecondaryLight,
                            lineHeight = 14.sp
                        )
                    }
                }
            }

            // Quick Diagnostic Actions
            Text("Diagnostic Controls", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = NavyPrimary)

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = onOpenLiveMap,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BluePrimary)
                ) {
                    Icon(Icons.Default.Place, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Live Map", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = onOpenLiveCamera,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = NavyPrimary)
                ) {
                    Icon(Icons.Default.Videocam, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Live Camera", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedButton(
                    onClick = onOpenScreenMirror,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.ScreenShare, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Screen Mirror", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = onOpenLocationHistory,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.History, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("History", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }

            OutlinedButton(
                onClick = onOpenStorageBackup,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.CloudSync, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Storage & Cloud Backup Status", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Transparent Consent Matrix
            Text("Consent & Permissions Matrix", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = NavyPrimary)

            PermissionStatusRow(
                title = "GPS Geolocation",
                desc = "Real-time breadcrumb sharing with high accuracy",
                status = "ACTIVE",
                isGranted = true
            )
            PermissionStatusRow(
                title = "Camera Stream",
                desc = "Consent prompt on member screen on every request",
                status = "CONSENT REQUIRED",
                isGranted = true
            )
            PermissionStatusRow(
                title = "Screen Mirror",
                desc = "Android MediaProjection system dialog authorization",
                status = "PROMPT REQUIRED",
                isGranted = true
            )
            PermissionStatusRow(
                title = "Notification Interception / WhatsApp Scraping",
                desc = "Strictly prohibited by FamilyLink anti-surveillance policy",
                status = "FORBIDDEN",
                isGranted = false
            )
        }
    }
}

@Composable
private fun PermissionStatusRow(
    title: String,
    desc: String,
    status: String,
    isGranted: Boolean
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
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextPrimaryLight)
                Text(desc, fontSize = 10.sp, color = TextSecondaryLight)
            }
            Surface(
                shape = RoundedCornerShape(6.dp),
                color = if (isGranted) SuccessGreen.copy(alpha = 0.15f) else DangerRed.copy(alpha = 0.15f)
            ) {
                Text(
                    text = status,
                    color = if (isGranted) SuccessGreen else DangerRed,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.ExtraBold,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                )
            }
        }
    }
}
