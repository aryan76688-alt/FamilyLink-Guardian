package com.familylink.guardian.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.familylink.guardian.screens.ComposeDevice
import com.familylink.guardian.screens.sampleFleet
import com.familylink.guardian.ui.theme.*

/**
 * SCREEN 4: Live Location Map Screen (Guardian Mobile)
 * Real-time fleet tracking, geofence perimeters, battery pins,
 * SOS Emergency Dispatch Banner, Activity Recognition, and Live Route Pickup ETA.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LiveMapScreen(
    onBack: () -> Unit,
    onSelectDevice: (ComposeDevice) -> Unit
) {
    var selectedDevice by remember { mutableStateOf(sampleFleet.first()) }
    var isSatelliteMode by remember { mutableStateOf(false) }
    var hasActiveSos by remember { mutableStateOf(false) }
    var activeSosDevice by remember { mutableStateOf(sampleFleet.first()) }
    var showEtaCard by remember { mutableStateOf(true) }

    // Flashing transition for SOS banner
    val infiniteTransition = rememberInfiniteTransition(label = "sosPulse")
    val alphaAnim by infiniteTransition.animateFloat(
        initialValue = 0.85f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "sosAlpha"
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Live Family Radar", fontWeight = FontWeight.Bold, fontSize = 17.sp, color = NavyPrimary)
                        Text("5 devices tracked • Real-time GPS & Safe Zones", fontSize = 11.sp, color = TextSecondaryLight)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = NavyPrimary)
                    }
                },
                actions = {
                    IconButton(onClick = { isSatelliteMode = !isSatelliteMode }) {
                        Icon(
                            imageVector = if (isSatelliteMode) Icons.Default.Layers else Icons.Default.Map,
                            contentDescription = "Map Style",
                            tint = BluePrimary
                        )
                    }
                    IconButton(onClick = { /* Recenter */ }) {
                        Icon(Icons.Default.MyLocation, contentDescription = "Recenter", tint = BluePrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = SurfaceLight)
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Simulated / Vector Map Canvas Background
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        if (isSatelliteMode)
                            Brush.verticalGradient(listOf(Color(0xFF1E293B), Color(0xFF0F172A)))
                        else
                            Brush.verticalGradient(listOf(Color(0xFFE2E8F0), Color(0xFFCBD5E1)))
                    )
            ) {
                // Polygon / Circular Safe Zone Geofence Circle Overlay
                Box(
                    modifier = Modifier
                        .align(Alignment.Center)
                        .size(320.dp)
                        .clip(CircleShape)
                        .background(BluePrimary.copy(alpha = 0.08f))
                        .border(2.dp, BluePrimary.copy(alpha = 0.4f), CircleShape)
                )

                // Geofence Label
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = BluePrimary.copy(alpha = 0.85f),
                    modifier = Modifier
                        .align(Alignment.Center)
                        .offset(y = (-130).dp)
                ) {
                    Text(
                        text = "🛡️ Safe Zone: Central High School (450m)",
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }

                // Device Map Pin: Aryan
                Box(
                    modifier = Modifier
                        .align(Alignment.Center)
                        .offset(x = (-30).dp, y = (-20).dp)
                        .clickable { selectedDevice = sampleFleet[0] }
                ) {
                    MapMarkerPin(
                        name = "Aryan",
                        battery = 82,
                        isOnline = true,
                        activityBadge = "🚗 48 km/h",
                        isSelected = selectedDevice.id == "1"
                    )
                }

                // Device Map Pin: Mom
                Box(
                    modifier = Modifier
                        .align(Alignment.Center)
                        .offset(x = 90.dp, y = 60.dp)
                        .clickable { selectedDevice = sampleFleet[1] }
                ) {
                    MapMarkerPin(
                        name = "Mom",
                        battery = 68,
                        isOnline = true,
                        activityBadge = "🚶 Walking",
                        isSelected = selectedDevice.id == "2"
                    )
                }

                // Device Map Pin: Dad
                Box(
                    modifier = Modifier
                        .align(Alignment.Center)
                        .offset(x = (-100).dp, y = 80.dp)
                        .clickable { selectedDevice = sampleFleet[2] }
                ) {
                    MapMarkerPin(
                        name = "Dad",
                        battery = 54,
                        isOnline = true,
                        activityBadge = "🏠 Still",
                        isSelected = selectedDevice.id == "3"
                    )
                }
            }

            // TOP OVERLAYS: SOS Alarm Banner & Fleet Quick-Switch Bar
            Column(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // HIGH PRIORITY SOS EMERGENCY DISPATCH BANNER
                AnimatedVisibility(visible = hasActiveSos) {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = DangerRed.copy(alpha = alphaAnim),
                        shadowElevation = 10.dp,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Warning, contentDescription = null, tint = Color.White, modifier = Modifier.size(24.dp))
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text("🚨 SOS DISTRESS BEACON ACTIVE", fontWeight = FontWeight.ExtraBold, fontSize = 12.sp, color = Color.White)
                                    Text("${activeSosDevice.memberName} • 1.2 km away • 1s GPS Live", fontSize = 11.sp, color = Color.White.copy(alpha = 0.9f))
                                }
                            }
                            Button(
                                onClick = { hasActiveSos = false },
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Color.White)
                            ) {
                                Text("Acknowledge", color = DangerRed, fontWeight = FontWeight.Bold, fontSize = 10.sp)
                            }
                        }
                    }
                }

                // Fleet Quick-Switch Bar
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = SurfaceLight.copy(alpha = 0.95f),
                    shadowElevation = 6.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    LazyRow(
                        modifier = Modifier.padding(8.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(sampleFleet) { device ->
                            FilterChip(
                                selected = selectedDevice.id == device.id,
                                onClick = { selectedDevice = device },
                                label = { Text(device.memberName, fontSize = 12.sp, fontWeight = FontWeight.Bold) },
                                leadingIcon = {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(CircleShape)
                                            .background(if (device.isOnline) SuccessGreen else DangerRed)
                                    )
                                },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = BluePrimary,
                                    selectedLabelColor = Color.White
                                )
                            )
                        }
                    }
                }
            }

            // Bottom Selected Device Card & Action Panel
            Card(
                shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                elevation = CardDefaults.cardElevation(defaultElevation = 12.dp),
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp)
                ) {
                    // LIVE ROUTE PICKUP ETA PILL (Google Routes API integration)
                    if (showEtaCard) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = BluePrimary.copy(alpha = 0.08f),
                            border = androidx.compose.foundation.BorderStroke(1.dp, BluePrimary.copy(alpha = 0.2f)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 12.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.DirectionsCar, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(20.dp))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text("Pickup Route ETA • Google Routes API", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = BluePrimary)
                                        Text("14 mins (5.8 km) via Oakway Blvd • Light traffic", fontSize = 10.sp, color = TextSecondaryLight)
                                    }
                                }
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = BluePrimary
                                ) {
                                    Text("LIVE ETA", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                                }
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = CircleShape,
                                color = BluePrimary,
                                modifier = Modifier.size(46.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = selectedDevice.memberName.take(1),
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 18.sp
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(selectedDevice.name, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimaryLight)
                                Text(
                                    text = "37.7749° N, 122.4194° W • ±4m accuracy",
                                    fontSize = 11.sp,
                                    color = TextSecondaryLight
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (selectedDevice.isOnline) SuccessGreen.copy(alpha = 0.15f) else Color.Gray.copy(alpha = 0.15f)
                        ) {
                            Text(
                                text = if (selectedDevice.isOnline) "LIVE" else "OFFLINE",
                                color = if (selectedDevice.isOnline) SuccessGreen else Color.Gray,
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Location telemetry pills
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = BackgroundLight,
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(8.dp)) {
                                Text("BATTERY", fontSize = 9.sp, color = TextSecondaryLight, fontWeight = FontWeight.SemiBold)
                                Text("${selectedDevice.battery}%", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = BluePrimary)
                            }
                        }
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = BackgroundLight,
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(8.dp)) {
                                Text("ACTIVITY", fontSize = 9.sp, color = TextSecondaryLight, fontWeight = FontWeight.SemiBold)
                                Text("🚗 In Transit", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextPrimaryLight)
                            }
                        }
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = BackgroundLight,
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(8.dp)) {
                                Text("SAFE ZONE", fontSize = 9.sp, color = TextSecondaryLight, fontWeight = FontWeight.SemiBold)
                                Text("School Campus", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = SuccessGreen)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Action buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedButton(
                            onClick = { /* Trigger directions */ },
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.Navigation, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Navigate", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }

                        Button(
                            onClick = { onSelectDevice(selectedDevice) },
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = BluePrimary),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Open Details", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun MapMarkerPin(
    name: String,
    battery: Int,
    isOnline: Boolean,
    activityBadge: String = "",
    isSelected: Boolean
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = if (isSelected) BluePrimary else SurfaceLight,
            shadowElevation = 8.dp,
            modifier = Modifier.border(
                2.dp,
                if (isSelected) BlueSky else Color.White,
                RoundedCornerShape(16.dp)
            )
        ) {
            Column(
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(if (isOnline) SuccessGreen else DangerRed)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "$name ($battery%)",
                        color = if (isSelected) Color.White else NavyPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp
                    )
                }
                if (activityBadge.isNotEmpty()) {
                    Text(
                        text = activityBadge,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = if (isSelected) Color.White.copy(alpha = 0.9f) else BluePrimary
                    )
                }
            }
        }
        Icon(
            imageVector = Icons.Default.ArrowDropDown,
            contentDescription = null,
            tint = if (isSelected) BluePrimary else SurfaceLight,
            modifier = Modifier.size(20.dp)
        )
    }
}
