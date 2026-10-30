package com.familylink.guardian.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.familylink.guardian.ui.theme.*

// Mock data model for Compose UI
data class ComposeDevice(
    val id: String,
    val name: String,
    val memberName: String,
    val isOnline: Boolean,
    val lastSeen: String,
    val battery: Int,
    val isThisDevice: Boolean = false,
    val network: String = "5G",
    val location: String = "Perimeter Safe Zone"
)

val sampleFleet = listOf(
    ComposeDevice("1", "Aryan (This device)", "Aryan", true, "1 min ago", 82, isThisDevice = true, network = "5G UW", location = "Central High Corridor"),
    ComposeDevice("2", "Mom Phone", "Mom", true, "2 min ago", 68, network = "Wi-Fi", location = "Westwood Medical"),
    ComposeDevice("3", "Dad Phone", "Dad", true, "3 min ago", 54, network = "5G", location = "Highway 101 North"),
    ComposeDevice("4", "Sister Phone", "Maya", false, "1 hour ago", 22, network = "Standby", location = "Lincoln Middle School"),
    ComposeDevice("5", "Tablet", "Living Room", true, "5 min ago", 90, network = "Wi-Fi", location = "Home Station")
)

/**
 * SCREEN 1: Splash Screen
 */
@Composable
fun GuardianSplashScreen(onGetStarted: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(NavyPrimary, Color(0xFF073666), BluePrimary)
                )
            )
            .padding(24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(vertical = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Shield Pill
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White.copy(alpha = 0.15f)
            ) {
                Text(
                    text = "v2.4 Transparent Protection",
                    color = Color.White,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                )
            }

            // Center Logo & Title
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Surface(
                    shape = RoundedCornerShape(24.dp),
                    color = NavyPrimary,
                    modifier = Modifier
                        .size(96.dp)
                        .border(3.dp, BlueSky, RoundedCornerShape(24.dp))
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = "Shield Logo",
                            tint = BlueSky,
                            modifier = Modifier.size(52.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = "FamilyLink Guardian",
                    color = Color.White,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    text = "Stay Connected • Stay Safe",
                    color = BlueSky,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            // Bottom CTA Card
            Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.15f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("5 Family Devices Monitored", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text("Hardware Keystore Encrypted", color = Color.White.copy(alpha = 0.8f), fontSize = 11.sp)
                        }
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .clip(CircleShape)
                                .background(SuccessGreen)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = onGetStarted,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(54.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White)
                ) {
                    Text(
                        text = "Get Started",
                        color = NavyPrimary,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

/**
 * SCREEN 3: Guardian Home & Device Dashboard
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GuardianHomeScreen(
    onDeviceClick: (ComposeDevice) -> Unit,
    onMapClick: () -> Unit,
    onAddMember: () -> Unit
) {
    var selectedSegment by remember { mutableStateOf("devices") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("FamilyLink Guardian", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = NavyPrimary)
                        Text("Stay Connected • Stay Safe", fontSize = 11.sp, color = TextSecondaryLight)
                    }
                },
                actions = {
                    IconButton(onClick = {}) {
                        Icon(Icons.Default.Notifications, contentDescription = "Alerts", tint = NavyPrimary)
                    }
                    IconButton(onClick = {}) {
                        Surface(shape = CircleShape, color = BluePrimary, modifier = Modifier.size(32.dp)) {
                            Box(contentAlignment = Alignment.Center) {
                                Text("AS", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                            }
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = SurfaceLight)
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = onAddMember,
                containerColor = BluePrimary,
                contentColor = Color.White,
                shape = RoundedCornerShape(18.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add")
                Spacer(modifier = Modifier.width(6.dp))
                Text("+ Add Family Member", fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }
        },
        bottomBar = {
            NavigationBar(containerColor = SurfaceLight) {
                NavigationBarItem(
                    selected = true,
                    onClick = {},
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onMapClick,
                    icon = { Icon(Icons.Default.Place, contentDescription = "Map") },
                    label = { Text("Map", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = {},
                    icon = { Icon(Icons.Default.Devices, contentDescription = "Devices") },
                    label = { Text("Devices", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = {},
                    icon = { Icon(Icons.Default.AccessTime, contentDescription = "Activity") },
                    label = { Text("Activity", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = {},
                    icon = { Icon(Icons.Default.MoreHoriz, contentDescription = "More") },
                    label = { Text("More", fontSize = 10.sp) }
                )
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(BackgroundLight)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(10.dp))

            // Segmented Control: Devices | Map
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color(0xFFE8EEF5),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(modifier = Modifier.padding(4.dp)) {
                    Button(
                        onClick = { selectedSegment = "devices" },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (selectedSegment == "devices") SurfaceLight else Color.Transparent
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Devices (5)", color = if (selectedSegment == "devices") BluePrimary else TextSecondaryLight, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                    Button(
                        onClick = onMapClick,
                        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Map View", color = TextSecondaryLight, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Device Cards List
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(sampleFleet) { device ->
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, BorderLight, RoundedCornerShape(20.dp))
                            .clickable { onDeviceClick(device) }
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                // Avatar with dot
                                Box(contentAlignment = Alignment.BottomEnd) {
                                    Surface(
                                        shape = CircleShape,
                                        color = BluePrimary,
                                        modifier = Modifier.size(44.dp)
                                    ) {
                                        Box(contentAlignment = Alignment.Center) {
                                            Text(
                                                text = device.memberName.take(1),
                                                color = Color.White,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 16.sp
                                            )
                                        }
                                    }
                                    Box(
                                        modifier = Modifier
                                            .size(12.dp)
                                            .clip(CircleShape)
                                            .background(if (device.isOnline) SuccessGreen else Color.Gray)
                                            .border(2.dp, Color.White, CircleShape)
                                    )
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(device.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimaryLight)
                                        if (device.isThisDevice) {
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Surface(color = Color(0xFFDBEAFE), shape = RoundedCornerShape(4.dp)) {
                                                Text("This device", fontSize = 9.sp, color = BluePrimary, modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp))
                                            }
                                        }
                                    }
                                    Text(
                                        text = "${if (device.isOnline) "Online" else "Offline"} • ${device.lastSeen}",
                                        fontSize = 11.sp,
                                        color = TextSecondaryLight
                                    )
                                    Text(
                                        text = device.location,
                                        fontSize = 11.sp,
                                        color = BluePrimary,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }

                            // Right: Battery
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "${device.battery}%",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = if (device.battery <= 25) DangerRed else SuccessGreen
                                )
                                Text(device.network, fontSize = 10.sp, color = TextSecondaryLight)
                            }
                        }
                    }
                }
            }
        }
    }
}
