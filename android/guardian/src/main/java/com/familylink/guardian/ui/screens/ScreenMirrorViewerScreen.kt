package com.familylink.guardian.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
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
 * SCREEN 7: Screen Mirror Viewer Screen (Guardian Mobile)
 * Authorized MediaProjection screen stream with FPS/latency counters,
 * consent confirmation banner, and member unilateral termination support.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScreenMirrorViewerScreen(
    device: ComposeDevice,
    onBack: () -> Unit
) {
    var isFullScreen by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Screen Mirror", fontWeight = FontWeight.Bold, fontSize = 17.sp, color = NavyPrimary)
                        Text("${device.name} • MediaProjection Stream", fontSize = 11.sp, color = TextSecondaryLight)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = NavyPrimary)
                    }
                },
                actions = {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = BluePrimary.copy(alpha = 0.15f),
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        Text(
                            text = "60 FPS • 38ms",
                            color = BluePrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
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
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Anti-Surveillance Banner
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = Color(0xFFEFF6FF),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFBFDBFE)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Security, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text("OFFICIAL MEDIAPROJECTION SESSION", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = NavyPrimary)
                        Text(
                            "This session was explicitly authorized on the member's device. No hidden screen casting is possible.",
                            fontSize = 10.sp,
                            color = TextSecondaryLight,
                            lineHeight = 13.sp
                        )
                    }
                }
            }

            // Simulated Device Screen Frame
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(vertical = 12.dp),
                contentAlignment = Alignment.Center
            ) {
                Surface(
                    shape = RoundedCornerShape(28.dp),
                    color = Color(0xFF1E293B),
                    shadowElevation = 8.dp,
                    modifier = Modifier
                        .width(260.dp)
                        .fillMaxHeight()
                        .border(3.dp, Color(0xFF334155), RoundedCornerShape(28.dp))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        // Simulated Device Status Bar
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("10:42", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.CastConnected, contentDescription = null, tint = SuccessGreen, modifier = Modifier.size(10.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("5G", color = Color.White, fontSize = 9.sp)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("${device.battery}%", color = Color.White, fontSize = 9.sp)
                            }
                        }

                        // Simulated App UI being mirrored
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Surface(
                                shape = RoundedCornerShape(16.dp),
                                color = NavyPrimary,
                                modifier = Modifier.size(64.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(Icons.Default.Shield, contentDescription = null, tint = BlueSky, modifier = Modifier.size(36.dp))
                                }
                            }
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(device.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text("Screen Projection Active", color = Color(0xFF94A3B8), fontSize = 10.sp)
                        }

                        // Bottom Navigation Bar pill
                        Box(
                            modifier = Modifier
                                .width(60.dp)
                                .height(4.dp)
                                .clip(RoundedCornerShape(2.dp))
                                .background(Color.White.copy(alpha = 0.5f))
                        )
                    }
                }
            }

            // Bottom Actions Toolbar
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = SurfaceLight,
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        IconButton(onClick = { isFullScreen = !isFullScreen }) {
                            Icon(Icons.Default.Fullscreen, contentDescription = "Fullscreen", tint = NavyPrimary)
                        }
                        IconButton(onClick = { /* Rotate */ }) {
                            Icon(Icons.Default.ScreenRotation, contentDescription = "Rotate", tint = NavyPrimary)
                        }
                    }

                    Button(
                        onClick = onBack,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = DangerRed)
                    ) {
                        Icon(Icons.Default.StopScreenShare, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Disconnect", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
