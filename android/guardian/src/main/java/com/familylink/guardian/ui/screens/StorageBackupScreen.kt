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
 * SCREEN 11: Storage & Cloud Backup Screen (Guardian Mobile)
 * Room database local storage gauge, 10-day retention status,
 * SHA-256 cloud verification, and Google Drive auto-sync.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StorageBackupScreen(
    device: ComposeDevice,
    onBack: () -> Unit
) {
    var autoSyncEnabled by remember { mutableStateOf(true) }
    var wifiOnlyEnabled by remember { mutableStateOf(true) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Storage & Cloud Backup", fontWeight = FontWeight.Bold, fontSize = 17.sp, color = NavyPrimary)
                        Text("${device.name} • Google Drive E2EE", fontSize = 11.sp, color = TextSecondaryLight)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = NavyPrimary)
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
            // Local Capacity Gauge Card
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("LOCAL ROOM DATABASE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = TextSecondaryLight)
                        Surface(shape = RoundedCornerShape(6.dp), color = SuccessGreen.copy(alpha = 0.15f)) {
                            Text("HEALTHY", fontSize = 9.sp, fontWeight = FontWeight.ExtraBold, color = SuccessGreen, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("1.2 GB / 10 GB", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold, color = NavyPrimary)
                            Text("12% allocated storage used across 1,420 records", fontSize = 11.sp, color = TextSecondaryLight)
                        }

                        // Progress Circle indicator
                        Box(contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(
                                progress = 0.12f,
                                modifier = Modifier.size(54.dp),
                                color = BluePrimary,
                                trackColor = BorderLight,
                                strokeWidth = 6.dp
                            )
                            Text("12%", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = BluePrimary)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    LinearProgressIndicator(
                        progress = 0.12f,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .clip(RoundedCornerShape(4.dp)),
                        color = BluePrimary,
                        trackColor = BorderLight
                    )
                }
            }

            // Strict 10-Day Retention Guarantee Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color(0xFFEFF6FF),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFBFDBFE)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("10-Day Strict Retention Rule", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = NavyPrimary)
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        "• All location breadcrumbs, audio snippets, and system logs remain on the member device for 10 days.\n" +
                        "• Auto-purge only deletes records that have been successfully uploaded and SHA-256 verified against Google Drive storage.\n" +
                        "• Zero telemetry loss occurs during network disconnects.",
                        fontSize = 11.sp,
                        color = TextSecondaryLight,
                        lineHeight = 16.sp
                    )
                }
            }

            // Google Drive Connected Account Card
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CloudQueue, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(28.dp))
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text("Google Drive Backup", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimaryLight)
                                Text("family.guardian@gmail.com", fontSize = 11.sp, color = TextSecondaryLight)
                            }
                        }

                        Surface(shape = RoundedCornerShape(8.dp), color = SuccessGreen.copy(alpha = 0.15f)) {
                            Text("CONNECTED", color = SuccessGreen, fontWeight = FontWeight.Bold, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Divider(color = BorderLight)
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Last Verified Cloud Sync", fontSize = 11.sp, color = TextSecondaryLight)
                        Text("Today at 10:15 AM (SHA-256 OK)", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = SuccessGreen)
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Cloud Target Folder", fontSize = 11.sp, color = TextSecondaryLight)
                        Text("/FamilyLink_Guardian_Encrypted_Backups", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = BluePrimary)
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = { /* Force Immediate Sync */ },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = BluePrimary)
                    ) {
                        Icon(Icons.Default.Sync, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Sync All Queued Records Now", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // Sync Settings & Preferences
            Text("Sync Preferences", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = NavyPrimary)

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Automatic Hourly Cloud Backup", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextPrimaryLight)
                            Text("Sync queued records in background automatically", fontSize = 10.sp, color = TextSecondaryLight)
                        }
                        Switch(checked = autoSyncEnabled, onCheckedChange = { autoSyncEnabled = it })
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Divider(color = BorderLight)
                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Wi-Fi Only Sync", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextPrimaryLight)
                            Text("Preserve cellular mobile data allowance", fontSize = 10.sp, color = TextSecondaryLight)
                        }
                        Switch(checked = wifiOnlyEnabled, onCheckedChange = { wifiOnlyEnabled = it })
                    }
                }
            }
        }
    }
}
