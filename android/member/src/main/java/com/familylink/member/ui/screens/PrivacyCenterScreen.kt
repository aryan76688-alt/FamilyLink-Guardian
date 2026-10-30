package com.familylink.member.ui.screens

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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.familylink.member.ui.theme.*

/**
 * SCREEN 14: Privacy Center Screen (Member Mobile)
 * Anti-surveillance bill of rights, granular toggles,
 * guardian access audit log, and unilateral emergency kill-switch.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PrivacyCenterScreen(
    onBack: () -> Unit,
    onRevokeGuardian: () -> Unit
) {
    var shareGps by remember { mutableStateOf(true) }
    var allowCameraRequests by remember { mutableStateOf(true) }
    var allowScreenRequests by remember { mutableStateOf(true) }
    var allowTelemetry by remember { mutableStateOf(true) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Privacy Center", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = NavyPrimary)
                        Text("Your Data • Your Control", fontSize = 11.sp, color = TextSecondaryLight)
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
            // Anti-Surveillance Charter
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color(0xFFEFF6FF),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFBFDBFE)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(28.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("Anti-Surveillance Guarantee", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = NavyPrimary)
                        Text(
                            "FamilyLink is transparent family safety software. It will never hide from your home screen, bypass permissions, or intercept private chat messages.",
                            fontSize = 11.sp,
                            color = TextSecondaryLight,
                            lineHeight = 15.sp
                        )
                    }
                }
            }

            // Granular Privacy Controls
            Text("Your Permissions", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = NavyPrimary)

            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    PrivacyToggleRow(
                        title = "Share GPS Location",
                        subtitle = "Transmit periodic breadcrumbs and safe zone alerts",
                        checked = shareGps,
                        onCheckedChange = { shareGps = it }
                    )

                    Divider(color = BorderLight, modifier = Modifier.padding(vertical = 10.dp))

                    PrivacyToggleRow(
                        title = "Camera Stream Requests",
                        subtitle = "Always prompt on-screen before video starts",
                        checked = allowCameraRequests,
                        onCheckedChange = { allowCameraRequests = it }
                    )

                    Divider(color = BorderLight, modifier = Modifier.padding(vertical = 10.dp))

                    PrivacyToggleRow(
                        title = "Screen Mirror Requests",
                        subtitle = "Require Android MediaProjection approval dialog",
                        checked = allowScreenRequests,
                        onCheckedChange = { allowScreenRequests = it }
                    )

                    Divider(color = BorderLight, modifier = Modifier.padding(vertical = 10.dp))

                    PrivacyToggleRow(
                        title = "Battery & Health Telemetry",
                        subtitle = "Share battery percentage and network status",
                        checked = allowTelemetry,
                        onCheckedChange = { allowTelemetry = it }
                    )
                }
            }

            // Real-Time Guardian Audit Trail
            Text("Guardian Access Log (Last 24 Hours)", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = NavyPrimary)

            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    AuditTrailItem("Location checked by Guardian Aryan", "2 mins ago", Icons.Default.Place)
                    AuditTrailItem("Safe zone arrival notification sent", "Today 08:42 AM", Icons.Default.Notifications)
                    AuditTrailItem("Camera session prompt accepted by you", "Yesterday 04:12 PM", Icons.Default.Videocam)
                    AuditTrailItem("Battery low alert (22%) sent to family", "Yesterday 07:15 PM", Icons.Default.BatteryAlert)
                }
            }

            // Emergency Disconnect & Revoke Button
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFECACA)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Emergency Unlink & Revocation", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = DangerRed)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "You can sever the connection with Guardian Aryan immediately. This revokes all cryptographic keys and halts all background services.",
                        fontSize = 11.sp,
                        color = Color(0xFF7F1D1D),
                        lineHeight = 15.sp
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Button(
                        onClick = onRevokeGuardian,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = DangerRed),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.LinkOff, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Revoke Guardian Connection", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}

@Composable
private fun PrivacyToggleRow(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextPrimaryLight)
            Text(subtitle, fontSize = 10.sp, color = TextSecondaryLight)
        }
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
}

@Composable
private fun AuditTrailItem(
    title: String,
    time: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            shape = CircleShape,
            color = Color(0xFFF1F5F9),
            modifier = Modifier.size(32.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(icon, contentDescription = null, tint = NavyPrimary, modifier = Modifier.size(16.dp))
            }
        }
        Spacer(modifier = Modifier.width(10.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(title, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = TextPrimaryLight)
            Text(time, fontSize = 10.sp, color = TextSecondaryLight)
        }
    }
}
