package com.familylink.guardian.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.familylink.guardian.screens.ComposeDevice
import com.familylink.guardian.ui.theme.*

data class HistoryPoint(
    val time: String,
    val location: String,
    val dwellTime: String,
    val speed: String,
    val battery: Int,
    val isGeofenceEvent: Boolean = false
)

val sampleHistory = listOf(
    HistoryPoint("08:15 AM", "Departed Home Safe Zone", "Left area", "28 km/h (In Vehicle)", 95, isGeofenceEvent = true),
    HistoryPoint("08:42 AM", "Arrived at Central High School", "Dwell 6h 30m", "0 km/h (Stationary)", 91, isGeofenceEvent = true),
    HistoryPoint("03:15 PM", "Departed Central High School", "Left area", "14 km/h (Cycling)", 78, isGeofenceEvent = true),
    HistoryPoint("03:40 PM", "Westwood Public Library", "Dwell 1h 45m", "0 km/h (Stationary)", 72),
    HistoryPoint("05:30 PM", "Returned to Home Safe Zone", "Arrived", "0 km/h (Stationary)", 65, isGeofenceEvent = true)
)

/**
 * SCREEN 8: Location History Screen (Guardian Mobile)
 * Breadcrumb trail timeline, geofence enter/exit triggers, and time scrubber.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LocationHistoryScreen(
    device: ComposeDevice,
    onBack: () -> Unit
) {
    var selectedFilter by remember { mutableStateOf("Today") }
    var scrubTime by remember { mutableStateOf(0.7f) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Location History", fontWeight = FontWeight.Bold, fontSize = 17.sp, color = NavyPrimary)
                        Text("${device.name} • 10-day retention verified", fontSize = 11.sp, color = TextSecondaryLight)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = NavyPrimary)
                    }
                },
                actions = {
                    IconButton(onClick = { /* Export */ }) {
                        Icon(Icons.Default.Share, contentDescription = "Export GPX", tint = BluePrimary)
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
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Day selector tabs
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("Today", "Yesterday", "3 Days Ago", "Past Week").forEach { filter ->
                    FilterChip(
                        selected = selectedFilter == filter,
                        onClick = { selectedFilter = filter },
                        label = { Text(filter, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = BluePrimary,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            // Timeline Map Scrubber Card
            Card(
                shape = RoundedCornerShape(18.dp),
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
                        Text("Interactive Timeline Scrub", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = NavyPrimary)
                        Text("08:00 AM — 06:00 PM", fontSize = 11.sp, color = BluePrimary, fontWeight = FontWeight.SemiBold)
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Slider(
                        value = scrubTime,
                        onValueChange = { scrubTime = it },
                        colors = SliderDefaults.colors(
                            thumbColor = BluePrimary,
                            activeTrackColor = BluePrimary,
                            inactiveTrackColor = BorderLight
                        )
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Start: 08:00 AM", fontSize = 10.sp, color = TextSecondaryLight)
                        Text("Total Distance: 18.4 km", fontSize = 10.sp, color = TextSecondaryLight, fontWeight = FontWeight.Bold)
                        Text("End: 06:00 PM", fontSize = 10.sp, color = TextSecondaryLight)
                    }
                }
            }

            // Chronological Stops & Events List
            Text("Stops & Geofence Milestones (5)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = NavyPrimary)

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(sampleHistory) { point ->
                    Card(
                        shape = RoundedCornerShape(16.dp),
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
                            // Milestone icon
                            Surface(
                                shape = CircleShape,
                                color = if (point.isGeofenceEvent) BluePrimary.copy(alpha = 0.15f) else Color(0xFFF1F5F9),
                                modifier = Modifier.size(40.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = if (point.isGeofenceEvent) Icons.Default.Shield else Icons.Default.Place,
                                        contentDescription = null,
                                        tint = if (point.isGeofenceEvent) BluePrimary else TextSecondaryLight,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(point.location, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextPrimaryLight)
                                    Text(point.time, fontSize = 10.sp, color = TextSecondaryLight, fontWeight = FontWeight.SemiBold)
                                }
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "${point.dwellTime} • ${point.speed}",
                                    fontSize = 11.sp,
                                    color = TextSecondaryLight
                                )
                            }

                            Spacer(modifier = Modifier.width(8.dp))

                            // Battery at waypoint
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = BackgroundLight
                            ) {
                                Text(
                                    text = "${point.battery}%",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SuccessGreen,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
