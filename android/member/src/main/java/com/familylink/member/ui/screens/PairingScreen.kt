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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.familylink.member.ui.theme.*

/**
 * SCREEN 19: Pairing Screen (Member Mobile)
 * Expiring 6-digit code entry, QR scanner simulation,
 * Keystore cryptographic key generation, and informed consent agreement.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PairingScreen(
    onBack: () -> Unit,
    onPairSuccess: () -> Unit
) {
    var pairingCode by remember { mutableStateOf("") }
    var consentAgreed by remember { mutableStateOf(false) }
    var isPairing by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Connect Guardian", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = NavyPrimary)
                        Text("Secure Cryptographic Handshake", fontSize = 11.sp, color = TextSecondaryLight)
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
            // Pairing instructions card
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Surface(
                        shape = CircleShape,
                        color = BluePrimary.copy(alpha = 0.1f),
                        modifier = Modifier.size(64.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.QrCodeScanner, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(32.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text("Enter Guardian Pairing PIN", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = NavyPrimary)
                    Text(
                        "Ask your Family Guardian for the 6-digit PIN displayed on their dashboard, or scan their QR code.",
                        fontSize = 11.sp,
                        color = TextSecondaryLight,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 4.dp)
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    // Code Input Field
                    OutlinedTextField(
                        value = pairingCode,
                        onValueChange = { if (it.length <= 6) pairingCode = it },
                        placeholder = { Text("e.g. 839204", color = TextSecondaryLight) },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = BluePrimary,
                            unfocusedBorderColor = BorderLight
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text("PIN valid for 15 minutes • Single-use", fontSize = 10.sp, color = TextSecondaryLight)
                }
            }

            // Cryptographic Keystore Card
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
                    Icon(Icons.Default.VpnKey, contentDescription = null, tint = BluePrimary, modifier = Modifier.size(24.dp))
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text("Android Hardware Keystore Handshake", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = NavyPrimary)
                        Text(
                            "Pairing generates an EC P-256 private key inside your device's Secure Element (StrongBox/TEE). Your private key never leaves this phone.",
                            fontSize = 10.sp,
                            color = TextSecondaryLight,
                            lineHeight = 14.sp
                        )
                    }
                }
            }

            // Informed Consent Checkbox
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceLight),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Checkbox(
                        checked = consentAgreed,
                        onCheckedChange = { consentAgreed = it },
                        colors = CheckboxDefaults.colors(checkedColor = BluePrimary)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        "I consent to transparently share my location and device diagnostics with my Family Guardian. I understand a permanent notification will be displayed on my device, and I can pause or revoke sharing at any time.",
                        fontSize = 11.sp,
                        color = TextPrimaryLight,
                        lineHeight = 15.sp
                    )
                }
            }

            // Complete Pairing Button
            Button(
                onClick = {
                    isPairing = true
                    onPairSuccess()
                },
                enabled = pairingCode.length == 6 && consentAgreed,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BluePrimary)
            ) {
                if (isPairing) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                } else {
                    Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Authorize & Complete Pairing", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }
            }
        }
    }
}
