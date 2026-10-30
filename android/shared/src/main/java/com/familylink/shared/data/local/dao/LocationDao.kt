package com.familylink.shared.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.familylink.shared.data.local.entity.LocationQueueEntity

@Dao
interface LocationDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLocation(point: LocationQueueEntity)

    @Query("SELECT * FROM location_queue WHERE syncStatus = 'PENDING' ORDER BY timestamp ASC LIMIT 50")
    suspend fun getPendingLocations(): List<LocationQueueEntity>

    @Query("UPDATE location_queue SET syncStatus = 'UPLOADED' WHERE id IN (:ids)")
    suspend fun markSynced(ids: List<String>)

    @Query("DELETE FROM location_queue WHERE syncStatus = 'UPLOADED' AND timestamp < :threshold")
    suspend fun deleteOldSynced(threshold: Long)
}
