package com.familylink.shared.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.familylink.shared.data.local.dao.LocationDao
import com.familylink.shared.data.local.entity.LocationQueueEntity

@Database(entities = [LocationQueueEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun locationDao(): LocationDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "familylink_guardian.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
