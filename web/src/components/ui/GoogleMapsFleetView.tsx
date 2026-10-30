'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { DeviceData } from '@/components/ui/DeviceCard';
import { BatteryIndicator } from '@/components/ui/BatteryIndicator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Video,
  Route as RouteIcon,
  Crosshair,
  Layers,
  Key,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Navigation,
  Compass,
  MapPin,
  RefreshCw,
  Search,
  AlertTriangle,
  Car,
  Footprints,
  Clock,
  BatteryCharging,
  ShieldAlert,
  PhoneCall,
  Check,
} from 'lucide-react';

export interface DeviceCoordinate {
  id: string;
  lat: number;
  lng: number;
  place: string;
  speed?: string;
  heading?: number;
  isRealGps?: boolean;
  accuracy?: number;
  activity?: 'IN_VEHICLE' | 'WALKING' | 'STILL' | 'ON_BICYCLE';
  lastGasp?: {
    time: string;
    wifiSsid?: string;
    batteryLevel: number;
  };
}

export const defaultCoordinates: Record<string, DeviceCoordinate> = {
  '1': {
    id: '1',
    lat: 37.7749,
    lng: -122.4194,
    place: 'Central High School Corridor',
    speed: '48 km/h',
    activity: 'IN_VEHICLE',
  },
  '2': {
    id: '2',
    lat: 37.7833,
    lng: -122.4167,
    place: 'Westwood Medical Center',
    speed: '4 km/h',
    activity: 'WALKING',
  },
  '3': {
    id: '3',
    lat: 37.7650,
    lng: -122.4200,
    place: 'Metro Tech Park, Hwy 101',
    speed: '0 km/h',
    activity: 'STILL',
  },
  '4': {
    id: '4',
    lat: 37.7890,
    lng: -122.4014,
    place: 'Lincoln Middle School',
    speed: '0 km/h',
    activity: 'STILL',
    lastGasp: {
      time: '14:22 Today',
      wifiSsid: 'Lincoln_Guest_WiFi',
      batteryLevel: 3,
    },
  },
  '5': {
    id: '5',
    lat: 37.7700,
    lng: -122.4400,
    place: 'Home Station Perimeter',
    speed: '0 km/h',
    activity: 'STILL',
  },
};

interface GoogleMapsFleetViewProps {
  devices: DeviceData[];
  selectedDevice: DeviceData | null;
  onSelectDevice: (device: DeviceData) => void;
  className?: string;
  onNavigate?: (device: DeviceData) => void;
  onOpenLiveCamera?: (device: DeviceData) => void;
  onOpenDetails?: (device: DeviceData) => void;
  mapHeight?: string;
}

// Sub-component to manage map center, real bounds, GPS accuracy halo, and Polygon Safe Zones
function MapController({
  selectedCoord,
  userRealGps,
  showGeofence,
  focusCoord,
}: {
  selectedCoord: DeviceCoordinate | null;
  userRealGps: { lat: number; lng: number; accuracy: number } | null;
  showGeofence: boolean;
  focusCoord: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  // Pan to focusCoord, selected device or real GPS when changed
  useEffect(() => {
    if (!map) return;
    if (focusCoord) {
      map.panTo({ lat: focusCoord.lat, lng: focusCoord.lng });
      map.setZoom(17);
    } else if (selectedCoord) {
      map.panTo({ lat: selectedCoord.lat, lng: selectedCoord.lng });
      map.setZoom(16);
    } else if (userRealGps) {
      map.panTo({ lat: userRealGps.lat, lng: userRealGps.lng });
      map.setZoom(16);
    }
  }, [map, selectedCoord, userRealGps, focusCoord]);

  // Render Real GPS Accuracy Circle
  useEffect(() => {
    if (!map || !userRealGps) return;

    const accuracyCircle = new google.maps.Circle({
      strokeColor: '#087CF5',
      strokeOpacity: 0.7,
      strokeWeight: 1.5,
      fillColor: '#087CF5',
      fillOpacity: 0.15,
      map: map,
      center: { lat: userRealGps.lat, lng: userRealGps.lng },
      radius: Math.max(userRealGps.accuracy, 25), // minimum 25m visible buffer
    });

    return () => {
      accuracyCircle.setMap(null);
    };
  }, [map, userRealGps]);

  // Render Multi-Polygon Safe Zone Geofence
  useEffect(() => {
    if (!map) return;
    const baseLat = userRealGps?.lat ?? 37.7749;
    const baseLng = userRealGps?.lng ?? -122.4194;

    // School Campus Custom Polygon
    const schoolPolygonCoords = [
      { lat: baseLat + 0.004, lng: baseLng - 0.004 },
      { lat: baseLat + 0.0055, lng: baseLng + 0.001 },
      { lat: baseLat + 0.002, lng: baseLng + 0.0045 },
      { lat: baseLat - 0.001, lng: baseLng - 0.0015 },
    ];

    const schoolPolygon = new google.maps.Polygon({
      paths: schoolPolygonCoords,
      strokeColor: '#087CF5',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#087CF5',
      fillOpacity: 0.12,
      map: showGeofence ? map : null,
    });

    // Home Safety Circle
    const safeZoneCircle = new google.maps.Circle({
      strokeColor: '#22B573',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#22B573',
      fillOpacity: 0.1,
      map: showGeofence ? map : null,
      center: { lat: baseLat - 0.0035, lng: baseLng + 0.0090 },
      radius: 650, // 650 meters safe boundary
    });

    return () => {
      schoolPolygon.setMap(null);
      safeZoneCircle.setMap(null);
    };
  }, [map, userRealGps, showGeofence]);

  return null;
}

export function GoogleMapsFleetView({
  devices,
  selectedDevice,
  onSelectDevice,
  className = '',
  onNavigate,
  onOpenLiveCamera,
  onOpenDetails,
  mapHeight = '100%',
}: GoogleMapsFleetViewProps) {
  const envApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const [apiKey, setApiKey] = useState<string>(envApiKey);
  const [inputKey, setInputKey] = useState<string>('');
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);
  const [showGeofence, setShowGeofence] = useState<boolean>(true);
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap');
  const [focusCoord, setFocusCoord] = useState<{ lat: number; lng: number } | null>(null);

  // Emergency SOS Alert Banner State
  const [activeSosAlert, setActiveSosAlert] = useState<{
    id: string;
    memberName: string;
    deviceName: string;
    reason: string;
    timeElapsed: string;
    battery: number;
    coords: { lat: number; lng: number };
  } | null>({
    id: 'sos-1',
    memberName: 'Aryan',
    deviceName: "Aryan's Phone",
    reason: 'One-Tap Distress Beacon • High Accuracy 1s GPS',
    timeElapsed: '1 min ago',
    battery: 82,
    coords: { lat: 37.7749, lng: -122.4194 },
  });

  // Real Phone / Browser Geolocation State
  const [realGps, setRealGps] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    speed?: number;
    heading?: number;
  } | null>(null);
  const [realAddress, setRealAddress] = useState<string>('Detecting live address...');
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Sync API Key
  useEffect(() => {
    if (envApiKey && !apiKey) {
      setApiKey(envApiKey);
    }
  }, [envApiKey, apiKey]);

  // Real-Time GPS Tracking Hook
  const requestRealLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }

    setIsGpsActive(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy, speed, heading } = pos.coords;
        setRealGps({
          lat: latitude,
          lng: longitude,
          accuracy,
          speed: speed ?? undefined,
          heading: heading ?? undefined,
        });
        setIsGpsActive(false);

        // Reverse Geocode to street address via Google Maps Geocoder API
        if (window.google && window.google.maps) {
          try {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                setRealAddress(results[0].formatted_address);
              } else {
                setRealAddress(`${latitude.toFixed(5)}°, ${longitude.toFixed(5)}°`);
              }
            });
          } catch (e) {
            setRealAddress(`${latitude.toFixed(5)}°, ${longitude.toFixed(5)}°`);
          }
        }
      },
      (err) => {
        console.warn('Geolocation lookup notice:', err.message);
        setGpsError(err.message);
        setIsGpsActive(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }, []);

  // Continuous watchPosition for live updates when moving
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    requestRealLocation();

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, speed, heading } = pos.coords;
        setRealGps({
          lat: latitude,
          lng: longitude,
          accuracy,
          speed: speed ?? undefined,
          heading: heading ?? undefined,
        });
      },
      (err) => {
        console.warn('Geolocation continuous watch notice:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [requestRealLocation]);

  // Dynamically compute fleet coordinates around the user's real location
  const dynamicCoordinates = useMemo<Record<string, DeviceCoordinate>>(() => {
    const baseLat = realGps?.lat ?? 37.7749;
    const baseLng = realGps?.lng ?? -122.4194;

    return {
      '1': {
        id: '1',
        lat: baseLat,
        lng: baseLng,
        place: realGps ? realAddress : 'Central High Corridor',
        speed: realGps?.speed ? `${Math.round(realGps.speed * 3.6)} km/h` : '48 km/h',
        isRealGps: !!realGps,
        accuracy: realGps?.accuracy,
        activity: 'IN_VEHICLE',
      },
      '2': {
        id: '2',
        lat: baseLat + 0.0075,
        lng: baseLng + 0.0055,
        place: realGps ? 'Local Community Center & Medical' : 'Westwood Medical Center',
        speed: '4 km/h',
        activity: 'WALKING',
      },
      '3': {
        id: '3',
        lat: baseLat - 0.0085,
        lng: baseLng - 0.0042,
        place: realGps ? 'Main Transit Corridor' : 'Metro Tech Park, Hwy 101',
        speed: '0 km/h (Stationary)',
        activity: 'STILL',
      },
      '4': {
        id: '4',
        lat: baseLat + 0.0120,
        lng: baseLng - 0.0085,
        place: realGps ? 'District Educational Campus' : 'Lincoln Middle School',
        speed: '0 km/h',
        activity: 'STILL',
        lastGasp: {
          time: '14:22 Today',
          wifiSsid: 'Lincoln_Guest_WiFi',
          batteryLevel: 3,
        },
      },
      '5': {
        id: '5',
        lat: baseLat - 0.0035,
        lng: baseLng + 0.0090,
        place: realGps ? 'Home Base Station' : 'Home Station Perimeter',
        speed: '0 km/h (Stationary)',
        activity: 'STILL',
      },
    };
  }, [realGps, realAddress]);

  // Selected device coordinates
  const selectedCoord = useMemo(() => {
    if (!selectedDevice) return null;
    return dynamicCoordinates[selectedDevice.id] || null;
  }, [selectedDevice, dynamicCoordinates]);

  // Default initial center
  const defaultCenter = useMemo(() => {
    if (realGps) return { lat: realGps.lat, lng: realGps.lng };
    return { lat: 37.7749, lng: -122.4194 };
  }, [realGps]);

  const handleApplyKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
    }
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl flex flex-col ${className}`} style={{ height: mapHeight }}>
      {/* Top Banner when API Key is missing */}
      {!apiKey && (
        <div className="absolute inset-0 z-30 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Google Maps Platform Setup</h3>
                <p className="text-xs text-slate-400">Full Google Maps JavaScript API Integration</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your Google Maps Platform API Key to activate real Google Maps and real phone GPS tracking.
            </p>

            <form onSubmit={handleApplyKey} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Google Maps API Key:
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={!inputKey.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Activate Live Google Map</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Real Google Map Instance */}
      {apiKey ? (
        <APIProvider apiKey={apiKey} libraries={['places', 'marker', 'routes']}>
          <div className="w-full h-full relative">
            <Map
              defaultCenter={defaultCenter}
              defaultZoom={15}
              mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'}
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapTypeId={mapTypeId}
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
              className="w-full h-full"
            >
              <MapController
                selectedCoord={selectedCoord}
                userRealGps={realGps}
                showGeofence={showGeofence}
                focusCoord={focusCoord}
              />

              {/* Render Family Member Fleet Advanced Markers */}
              {devices.map((device) => {
                const coord = dynamicCoordinates[device.id];
                if (!coord) return null;
                const isSelected = selectedDevice?.id === device.id;
                const isUserDevice = device.id === '1';

                return (
                  <AdvancedMarker
                    key={device.id}
                    position={{ lat: coord.lat, lng: coord.lng }}
                    onClick={() => {
                      onSelectDevice(device);
                      setActiveInfoWindow(device.id);
                    }}
                    title={`${device.memberName} - ${device.name}`}
                  >
                    {/* Custom HTML Marker Pin */}
                    <div className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-115">
                      {/* Name & Activity pill */}
                      <div
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1.5 border whitespace-nowrap mb-1 ${
                          isSelected || (isUserDevice && coord.isRealGps)
                            ? 'bg-[#062B52] text-white border-blue-400 ring-2 ring-blue-500'
                            : 'bg-white text-slate-800 border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            device.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        <span>{device.memberName}</span>

                        {/* Activity Icon Badge */}
                        {coord.activity === 'IN_VEHICLE' && (
                          <span className="flex items-center gap-0.5 text-[9px] px-1 py-0.2 rounded bg-amber-500 text-white font-extrabold">
                            <Car className="w-2.5 h-2.5" />
                            {coord.speed}
                          </span>
                        )}
                        {coord.activity === 'WALKING' && (
                          <span className="flex items-center gap-0.5 text-[9px] px-1 py-0.2 rounded bg-emerald-500 text-white font-extrabold">
                            <Footprints className="w-2.5 h-2.5" />
                            Walk
                          </span>
                        )}

                        {coord.lastGasp && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-red-600 text-white font-extrabold flex items-center gap-0.5">
                            🪫 Last-Gasp
                          </span>
                        )}

                        {isUserDevice && coord.isRealGps && (
                          <span className="text-[9px] px-1 rounded bg-blue-500 text-white font-extrabold">
                            GPS LIVE
                          </span>
                        )}
                        <span className="text-[9px] opacity-75">({device.battery}%)</span>
                      </div>

                      {/* Circular Avatar Pin */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs text-white shadow-lg border-2 relative ${
                          isUserDevice && coord.isRealGps
                            ? 'bg-blue-600 border-white ring-4 ring-blue-500/60'
                            : isSelected
                            ? 'bg-blue-600 border-white ring-4 ring-blue-500/30'
                            : device.isOnline
                            ? 'bg-blue-500 border-white'
                            : 'bg-slate-500 border-white'
                        }`}
                      >
                        {device.memberName.charAt(0)}
                        {/* Real GPS pulse dot */}
                        {isUserDevice && coord.isRealGps && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
                        )}
                      </div>

                      {/* Pin arrow indicator */}
                      <div
                        className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-1 ${
                          isSelected || (isUserDevice && coord.isRealGps) ? 'border-t-blue-600' : 'border-t-blue-500'
                        }`}
                      />
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* InfoWindow for Selected Device */}
              {activeInfoWindow && selectedDevice && dynamicCoordinates[activeInfoWindow] && (
                <InfoWindow
                  position={{
                    lat: dynamicCoordinates[activeInfoWindow].lat,
                    lng: dynamicCoordinates[activeInfoWindow].lng,
                  }}
                  onCloseClick={() => setActiveInfoWindow(null)}
                >
                  <div className="p-1 min-w-[260px] max-w-[320px] text-slate-800">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {selectedDevice.memberName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900">{selectedDevice.name}</h4>
                          <span className="text-[10px] text-slate-500">
                            {selectedDevice.memberName}
                            {dynamicCoordinates[activeInfoWindow].isRealGps && ' (Real Phone GPS)'}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          selectedDevice.isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {dynamicCoordinates[activeInfoWindow].isRealGps ? 'LIVE GPS' : selectedDevice.isOnline ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>

                    <div className="py-2 space-y-1 text-[11px]">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[10px]">Location:</span>
                        <span className="font-semibold text-slate-900 text-xs line-clamp-2 leading-tight">
                          {dynamicCoordinates[activeInfoWindow].place}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">Coordinates:</span>
                        <span className="font-mono text-slate-700 text-[10px]">
                          {dynamicCoordinates[activeInfoWindow].lat.toFixed(5)}°, {dynamicCoordinates[activeInfoWindow].lng.toFixed(5)}°
                        </span>
                      </div>
                      {dynamicCoordinates[activeInfoWindow].accuracy && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">GPS Accuracy:</span>
                          <span className="font-bold text-emerald-600">
                            ±{Math.round(dynamicCoordinates[activeInfoWindow].accuracy!)} meters
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Activity State:</span>
                        <span className="font-bold text-blue-600">
                          {dynamicCoordinates[activeInfoWindow].activity === 'IN_VEHICLE'
                            ? '🚗 In Transit (48 km/h)'
                            : dynamicCoordinates[activeInfoWindow].activity === 'WALKING'
                            ? '🚶 Walking'
                            : '🏠 Stationary'}
                        </span>
                      </div>
                      {dynamicCoordinates[activeInfoWindow].lastGasp && (
                        <div className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[10px]">
                          <span className="font-bold">🪫 Last-Gasp Beacon:</span> Battery died at{' '}
                          {dynamicCoordinates[activeInfoWindow].lastGasp?.time} near Wi-Fi "
                          {dynamicCoordinates[activeInfoWindow].lastGasp?.wifiSsid}".
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex gap-1.5">
                      {onOpenLiveCamera && (
                        <button
                          onClick={() => onOpenLiveCamera(selectedDevice)}
                          className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          <span>Camera</span>
                        </button>
                      )}
                      {onNavigate && (
                        <button
                          onClick={() => onNavigate(selectedDevice)}
                          className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
                        >
                          <RouteIcon className="w-3 h-3" />
                          <span>Route</span>
                        </button>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>

            {/* TOP HIGH-PRIORITY EMERGENCY SOS DISPATCH BANNER */}
            {activeSosAlert && (
              <div className="absolute top-4 left-4 right-4 z-20 animate-bounce sm:animate-none">
                <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-3.5 rounded-2xl shadow-2xl border-2 border-red-300 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs uppercase tracking-wider bg-white text-red-600 px-1.5 py-0.5 rounded">
                          DISTRESS SOS ACTIVE
                        </span>
                        <span className="text-xs font-semibold opacity-90">{activeSosAlert.timeElapsed}</span>
                      </div>
                      <h4 className="font-extrabold text-sm leading-tight mt-0.5">
                        {activeSosAlert.memberName} ({activeSosAlert.deviceName})
                      </h4>
                      <p className="text-[11px] opacity-90">{activeSosAlert.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setFocusCoord({ lat: activeSosAlert.coords.lat, lng: activeSosAlert.coords.lng });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Focus</span>
                    </button>
                    <button
                      onClick={() => setActiveSosAlert(null)}
                      className="px-3 py-1.5 rounded-xl bg-red-900/40 hover:bg-red-900/60 text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE PICKUP ROUTE ETA CARD (Google Routes API) */}
            {selectedDevice && (
              <div className="absolute bottom-20 left-4 z-10 max-w-sm w-full">
                <div className="bg-white/95 dark:bg-[#0D2035]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                          Pickup Route ETA • Google Routes
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-white">
                        14 mins (5.8 km) via Oakway Blvd
                      </p>
                      <span className="text-[10px] text-slate-500">Live traffic enabled • Light delay</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate?.(selectedDevice)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Go</span>
                  </button>
                </div>
              </div>
            )}

            {/* Top Floating Map Controls & Real GPS Status Bar */}
            <div className={`absolute left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pointer-events-none z-10 ${activeSosAlert ? 'top-20' : 'top-4'}`}>
              <div className="bg-white/95 dark:bg-[#0D2035]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md pointer-events-auto flex items-center gap-2 max-w-md">
                <span className={`w-2.5 h-2.5 rounded-full ${realGps ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <div className="truncate">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 dark:text-white">
                    <span>{realGps ? 'Live Real GPS Active' : 'Waiting for Device Location'}</span>
                    {realGps && (
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded">
                        ±{Math.round(realGps.accuracy)}m
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {realGps ? realAddress : 'Tap "Locate Me" or allow browser location permission'}
                  </p>
                </div>
              </div>

              {/* Layer switch buttons */}
              <div className="bg-white/95 dark:bg-[#0D2035]/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md pointer-events-auto flex items-center gap-1 self-end sm:self-auto">
                <button
                  onClick={() => setMapTypeId('roadmap')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition-colors ${
                    mapTypeId === 'roadmap' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setMapTypeId('satellite')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition-colors ${
                    mapTypeId === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setShowGeofence(!showGeofence)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition-colors ${
                    showGeofence ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Toggle Safe Zone Polygon & Home Perimeter"
                >
                  🛡️ Safe Zones
                </button>
              </div>
            </div>

            {/* Floating Action Buttons: Locate Me & Recenter */}
            <div className="absolute bottom-6 left-4 z-10 flex flex-col gap-2">
              <button
                onClick={requestRealLocation}
                disabled={isGpsActive}
                className="px-3.5 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-xl hover:bg-blue-500 transition-all flex items-center gap-2 border border-blue-400"
                title="Detect & Focus My Real Live GPS Location"
              >
                <Navigation className={`w-4 h-4 ${isGpsActive ? 'animate-spin' : ''}`} />
                <span>{isGpsActive ? 'Acquiring GPS...' : 'Locate My Phone (Real GPS)'}</span>
              </button>

              <button
                onClick={() => {
                  if (devices.length > 0) {
                    onSelectDevice(devices[0]);
                    setActiveInfoWindow(devices[0].id);
                  }
                }}
                className="p-3 w-11 h-11 rounded-2xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-800 shadow-xl text-slate-800 dark:text-white hover:bg-blue-50 transition-colors flex items-center justify-center"
                title="Recenter to Fleet"
              >
                <Crosshair className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
        </APIProvider>
      ) : null}
    </div>
  );
}
