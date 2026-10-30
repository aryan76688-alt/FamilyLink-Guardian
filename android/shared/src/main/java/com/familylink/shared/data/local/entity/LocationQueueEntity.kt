package com.familylink.shared.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "location_queue")
data class LocationQueueEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val latitude: Double,
    val longitude: Double,
    val accuracy: Float?,
    val speed: Float?,
    val heading: Float?,
    val battery: Int,
    val timestamp: Long,
    val syncStatus: String = "PENDING" // PENDING, UPLOADED, FAILED
)
