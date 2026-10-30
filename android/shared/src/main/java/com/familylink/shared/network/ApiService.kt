package com.familylink.shared.network

import com.familylink.shared.data.models.*
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface ApiService {
    @POST("api/auth/register")
    suspend fun register(@Body body: Map<String, String>): Response<AuthResponse>

    @POST("api/auth/login")
    suspend fun login(@Body body: Map<String, String>): Response<AuthResponse>

    @GET("api/auth/pairing-code")
    suspend fun getPairingCode(): Response<PairingCodeResponse>

    @POST("api/auth/pair-device")
    suspend fun pairDevice(@Body request: DevicePairRequest): Response<DevicePairResponse>

    @POST("api/location/record")
    suspend fun recordLocation(@Body request: BatchLocationRequest): Response<Map<String, Any>>

    @GET("api/location/family/latest")
    suspend fun getFamilyLocations(): Response<List<Map<String, Any>>>

    @GET("api/devices")
    suspend fun getDevices(): Response<List<Device>>

    @PATCH("api/devices/{id}/permissions")
    suspend fun updatePermissions(
        @Path("id") deviceId: String,
        @Body permissions: DevicePermissions
    ): Response<DevicePermissions>

    // SOS Emergency Dispatch
    @POST("api/sos/trigger")
    suspend fun triggerSos(@Body request: TriggerSosRequest): Response<SosAlert>

    @PATCH("api/sos/{id}/resolve")
    suspend fun resolveSos(
        @Path("id") id: String,
        @Body request: ResolveSosRequest
    ): Response<SosAlert>

    @GET("api/sos/active")
    suspend fun getActiveSosAlerts(@Query("familyGroupId") familyGroupId: String? = null): Response<List<SosAlert>>

    // Geofencing
    @POST("api/geofence")
    suspend fun createGeofence(@Body zone: GeofenceZone): Response<GeofenceZone>

    @GET("api/geofence")
    suspend fun getGeofences(@Query("familyGroupId") familyGroupId: String): Response<List<GeofenceZone>>

    @POST("api/geofence/event")
    suspend fun recordGeofenceEvent(@Body event: GeofenceEventRequest): Response<Map<String, Any>>

    // Smart Transit & Activity Recognition
    @POST("api/activity/record")
    suspend fun recordActivity(@Body request: ActivityRecordRequest): Response<Map<String, Any>>

    // Last-Gasp Battery Beacon
    @POST("api/beacon/last-gasp")
    suspend fun sendLastGaspBeacon(@Body request: LastGaspRequest): Response<Map<String, Any>>

    // Downtime & Focus Mode
    @GET("api/focus/{deviceId}")
    suspend fun getFocusConfig(@Path("deviceId") deviceId: String): Response<FocusModeConfig>

    @POST("api/focus/update")
    suspend fun updateFocusConfig(@Body config: FocusModeConfig): Response<FocusModeConfig>
}

object ApiClient {
    private var baseUrl: String = "http://192.168.31.141:3000/"

    fun setBaseUrl(url: String) {
        baseUrl = if (url.endsWith("/")) url else "$url/"
        retrofitInstance = null
    }

    private var retrofitInstance: Retrofit? = null

    val apiService: ApiService
        get() {
            if (retrofitInstance == null) {
                retrofitInstance = Retrofit.Builder()
                    .baseUrl(baseUrl)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build()
            }
            return retrofitInstance!!.create(ApiService::class.java)
        }
}
