'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DeviceData } from '@/components/ui/DeviceCard';
import {
  Compass,
  Volume2,
  VolumeX,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Battery,
  BatteryCharging,
  Wifi,
  Navigation,
  RefreshCw,
  AlertTriangle,
  Radio,
  Smartphone,
  ExternalLink,
  X,
  MapPin,
  Crosshair,
  Search,
  Layers,
  Route as RouteIcon,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  QrCode,
  Key,
  Car,
  Footprints,
  Clock,
  Sparkles,
} from 'lucide-react';
import { calculateHaversineDistance } from '@/lib/haversine';

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyADv-hBmMfj_GDU4ZDjvMq8wHPSV75IEo0';

// Dark Cyber Tactical Map Styling from Kali Linux Remote Platform
const CYBER_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#080d1a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#080d1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#00f0ff' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#061f1a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#162035' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#00f0ff' }, { weight: 0.5 }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#111827' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#030712' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
];

export interface RouteInfo {
  distance: string;
  duration: string;
  destinationName: string;
  steps: string[];
}

interface GoogleMapsFleetViewProps {
  devices: DeviceData[];
  selectedDevice: DeviceData | null;
  onSelectDevice: (device: DeviceData) => void;
  className?: string;
  onNavigate?: (device: DeviceData) => void;
  onOpenLiveCamera?: (device: DeviceData) => void;
  onOpenDetails?: (device: DeviceData) => void;
  mapHeight?: string;
  pairingCode?: string;
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
  pairingCode = 'HW25ML',
}: GoogleMapsFleetViewProps) {
  // Map display mode: 'cyber' (tactical dark), 'satellite' (hybrid), 'roadmap', 'radar' (pure HUD)
  const [viewMode, setViewMode] = useState<'cyber' | 'satellite' | 'roadmap' | 'radar'>('cyber');
  const [mapsLoaded, setMapsLoaded] = useState<boolean>(false);
  const [mapsAuthError, setMapsAuthError] = useState<boolean>(false);

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRoute, setActiveRoute] = useState<RouteInfo | null>(null);
  const [showSteps, setShowSteps] = useState<boolean>(false);

  // Tactical Radar HUD
  const [radarSweepAngle, setRadarSweepAngle] = useState<number>(0);
  const [sirenPlaying, setSirenPlaying] = useState<boolean>(false);

  // Geo-Leash
  const [leashArmed, setLeashArmed] = useState<boolean>(false);
  const [leashRadius, setLeashRadius] = useState<number>(250); // meters
  const [isLeashBreached, setIsLeashBreached] = useState<boolean>(false);

  // Street View Recon
  const [streetViewOpen, setStreetViewOpen] = useState<boolean>(false);
  const [streetViewCoords, setStreetViewCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Guardian Real GPS
  const [myGps, setMyGps] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [geocodedAddress, setGeocodedAddress] = useState<string>('');

  // Refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const myGpsMarkerRef = useRef<google.maps.Marker | null>(null);
  const leashCircleRef = useRef<google.maps.Circle | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const tacticalPolylineRef = useRef<google.maps.Polyline | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const webAudioCtxRef = useRef<AudioContext | null>(null);

  // ──────────────────────────────────────────────────────────────────────────
  // 1. DYNAMIC GOOGLE MAPS API SCRIPT LOADER
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (window as any).gm_authFailure = () => {
      console.warn('[Google Maps] gm_authFailure triggered. Switching to Tactical Radar HUD.');
      setMapsAuthError(true);
      setViewMode('radar');
    };

    if (window.google?.maps) {
      setMapsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-platform-script';
    const existing = document.getElementById(scriptId);
    if (!existing) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapsLoaded(true);
      script.onerror = () => {
        console.warn('[Google Maps] Failed to load Maps JavaScript API. Using Tactical Radar fallback.');
        setMapsAuthError(true);
        setViewMode('radar');
      };
      document.head.appendChild(script);
    } else {
      setMapsLoaded(true);
    }
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // 2. RADAR SWEEP ANIMATION TICKER
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const sweepInterval = setInterval(() => {
      setRadarSweepAngle((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(sweepInterval);
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // 3. WEB AUDIO API SYNTHESIZER SIREN
  // ──────────────────────────────────────────────────────────────────────────
  const playWebSirenSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!webAudioCtxRef.current) {
        webAudioCtxRef.current = new AudioCtx();
      }
      const ctx = webAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      let toggle = false;
      const interval = setInterval(() => {
        toggle = !toggle;
        osc.frequency.setValueAtTime(toggle ? 1350 : 850, ctx.currentTime);
      }, 350);

      setSirenPlaying(true);
      osc.start();

      setTimeout(() => {
        clearInterval(interval);
        setSirenPlaying(false);
        try {
          osc.stop();
          osc.disconnect();
        } catch (_) {}
      }, 4000);
    } catch (e) {
      console.warn('Web Audio Siren error:', e);
      setSirenPlaying(false);
    }
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // 4. GUARDIAN / USER BROWSER GPS AUTO-TRACKING
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setMyGps({ lat: latitude, lng: longitude, accuracy });
      },
      (err) => {
        console.warn('[GPS Tracking] watchPosition notice:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // 5. GOOGLE MAP INITIALIZATION & SYNC
  // ──────────────────────────────────────────────────────────────────────────
  const primaryDevice = selectedDevice || (devices.length > 0 ? devices[0] : null);

  useEffect(() => {
    if (!mapsLoaded || !mapContainerRef.current || viewMode === 'radar' || typeof google === 'undefined') {
      return;
    }

    if (!mapInstanceRef.current) {
      const centerLat = primaryDevice?.lat ?? myGps?.lat ?? 28.6139;
      const centerLng = primaryDevice?.lng ?? myGps?.lng ?? 77.209;

      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 16,
        mapTypeId:
          viewMode === 'satellite'
            ? google.maps.MapTypeId.HYBRID
            : viewMode === 'roadmap'
            ? google.maps.MapTypeId.ROADMAP
            : google.maps.MapTypeId.ROADMAP,
        styles: viewMode === 'cyber' ? CYBER_MAP_STYLES : [],
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy',
      });

      mapInstanceRef.current = map;
      geocoderRef.current = new google.maps.Geocoder();

      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#00F0FF',
          strokeOpacity: 0.9,
          strokeWeight: 6,
        },
      });

      // Places Autocomplete
      if (searchInputRef.current && google.maps.places) {
        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
          fields: ['geometry', 'name', 'formatted_address'],
        });
        autocomplete.bindTo('bounds', map);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          map.panTo({ lat, lng });
          map.setZoom(17);
        });
      }
    } else {
      const map = mapInstanceRef.current;
      map.setMapTypeId(
        viewMode === 'satellite' ? google.maps.MapTypeId.HYBRID : google.maps.MapTypeId.ROADMAP
      );
      map.setOptions({
        styles: viewMode === 'cyber' ? CYBER_MAP_STYLES : [],
      });
    }
  }, [mapsLoaded, viewMode, primaryDevice, myGps]);

  // ──────────────────────────────────────────────────────────────────────────
  // 6. HARDWARE DEVICE MARKERS & GEO-LEASH SYNC
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || viewMode === 'radar' || typeof google === 'undefined') return;

    // Render Guardian GPS Marker
    if (myGps) {
      if (!myGpsMarkerRef.current) {
        myGpsMarkerRef.current = new google.maps.Marker({
          position: { lat: myGps.lat, lng: myGps.lng },
          map,
          title: 'Guardian Command (You)',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#087CF5',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
      } else {
        myGpsMarkerRef.current.setPosition({ lat: myGps.lat, lng: myGps.lng });
      }
    }

    // Render Installed Mobile Devices Markers ONLY
    const currentDeviceIds = new Set(devices.map((d) => d.id));

    // Remove markers for uninstalled / vanished devices
    markersRef.current.forEach((marker, id) => {
      if (!currentDeviceIds.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    });

    devices.forEach((dev) => {
      const isSelected = selectedDevice?.id === dev.id;
      const lat = dev.lat ?? 28.6139;
      const lng = dev.lng ?? 77.209;

      let marker = markersRef.current.get(dev.id);
      if (!marker) {
        marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title: `${dev.name} (${dev.isOnline ? 'ONLINE' : 'OFFLINE'})`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: dev.isOnline ? '#00f0ff' : '#64748b',
            fillOpacity: 1,
            strokeColor: isSelected ? '#ffffff' : '#0f172a',
            strokeWeight: isSelected ? 3 : 1.5,
          },
        });

        marker.addListener('click', () => {
          onSelectDevice(dev);
        });

        markersRef.current.set(dev.id, marker);
      } else {
        marker.setPosition({ lat, lng });
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: dev.isOnline ? '#00f0ff' : '#64748b',
          fillOpacity: 1,
          strokeColor: isSelected ? '#ffffff' : '#0f172a',
          strokeWeight: isSelected ? 3 : 1.5,
        });
      }
    });

    // Check Geo-Leash Breach
    if (leashArmed && primaryDevice && myGps && primaryDevice.lat && primaryDevice.lng) {
      const dist = calculateHaversineDistance(
        myGps.lat,
        myGps.lng,
        primaryDevice.lat,
        primaryDevice.lng
      );
      const distMeters = dist * 1000;
      const breached = distMeters > leashRadius;
      setIsLeashBreached(breached);

      if (!leashCircleRef.current) {
        leashCircleRef.current = new google.maps.Circle({
          strokeColor: breached ? '#EF4444' : '#00F0FF',
          strokeOpacity: 0.85,
          strokeWeight: 2,
          fillColor: breached ? '#EF4444' : '#00F0FF',
          fillOpacity: 0.12,
          map,
          center: { lat: myGps.lat, lng: myGps.lng },
          radius: leashRadius,
        });
      } else {
        leashCircleRef.current.setCenter({ lat: myGps.lat, lng: myGps.lng });
        leashCircleRef.current.setRadius(leashRadius);
        leashCircleRef.current.setOptions({
          strokeColor: breached ? '#EF4444' : '#00F0FF',
          fillColor: breached ? '#EF4444' : '#00F0FF',
        });
        leashCircleRef.current.setMap(map);
      }
    } else if (leashCircleRef.current) {
      leashCircleRef.current.setMap(null);
      setIsLeashBreached(false);
    }
  }, [devices, selectedDevice, viewMode, myGps, leashArmed, leashRadius, primaryDevice, onSelectDevice]);

  // Reverse geocode selected device coords
  useEffect(() => {
    if (!primaryDevice || !geocoderRef.current || !primaryDevice.lat || !primaryDevice.lng) return;
    geocoderRef.current.geocode(
      { location: { lat: primaryDevice.lat, lng: primaryDevice.lng } },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setGeocodedAddress(results[0].formatted_address);
        } else {
          setGeocodedAddress(`${primaryDevice.lat?.toFixed(5)}°, ${primaryDevice.lng?.toFixed(5)}°`);
        }
      }
    );
  }, [primaryDevice?.id, primaryDevice?.lat, primaryDevice?.lng]);

  // ──────────────────────────────────────────────────────────────────────────
  // 7. GOOGLE ROUTES API: TURN-BY-TURN DIRECTIONS
  // ──────────────────────────────────────────────────────────────────────────
  const calculateRoute = (destLat: number, destLng: number, destLabel: string) => {
    if (typeof google === 'undefined' || !mapInstanceRef.current) return;

    const origin = myGps
      ? new google.maps.LatLng(myGps.lat, myGps.lng)
      : new google.maps.LatLng(28.6139, 77.209);

    const destination = new google.maps.LatLng(destLat, destLng);

    const drawDirectVector = () => {
      if (tacticalPolylineRef.current) {
        tacticalPolylineRef.current.setMap(null);
      }
      const polyline = new google.maps.Polyline({
        path: [origin, destination],
        geodesic: true,
        strokeColor: '#00F0FF',
        strokeOpacity: 0.85,
        strokeWeight: 4,
        map: mapInstanceRef.current,
      });
      tacticalPolylineRef.current = polyline;

      const distKm = calculateHaversineDistance(origin.lat(), origin.lng(), destLat, destLng);
      setActiveRoute({
        distance: distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`,
        duration: `${Math.max(1, Math.round((distKm * 1000) / 400))} min`,
        destinationName: destLabel,
        steps: [`Direct tactical trajectory to ${destLabel}`, 'Live route vector engaged'],
      });
      setShowSteps(false);
    };

    if (directionsRendererRef.current) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result);
            const leg = result.routes[0]?.legs[0];
            if (leg) {
              const steps = leg.steps.map((s) => s.instructions.replace(/<[^>]*>/g, ''));
              setActiveRoute({
                distance: leg.distance?.text || 'Calculated',
                duration: leg.duration?.text || 'Est.',
                destinationName: destLabel,
                steps,
              });
              setShowSteps(false);
            }
          } else {
            drawDirectVector();
          }
        }
      );
    } else {
      drawDirectVector();
    }
  };

  const clearRoute = () => {
    setActiveRoute(null);
    setShowSteps(false);
    if (directionsRendererRef.current) {
      directionsRendererRef.current.set('directions', null);
    }
    if (tacticalPolylineRef.current) {
      tacticalPolylineRef.current.setMap(null);
      tacticalPolylineRef.current = null;
    }
  };

  const centerOnDevice = () => {
    if (!mapInstanceRef.current) return;
    if (primaryDevice?.lat && primaryDevice?.lng) {
      mapInstanceRef.current.panTo({ lat: primaryDevice.lat, lng: primaryDevice.lng });
      mapInstanceRef.current.setZoom(17);
    } else if (myGps) {
      mapInstanceRef.current.panTo({ lat: myGps.lat, lng: myGps.lng });
      mapInstanceRef.current.setZoom(17);
    }
  };

  // Distance computation
  const proximityDistance = useMemo(() => {
    if (!myGps || !primaryDevice || !primaryDevice.lat || !primaryDevice.lng) return null;
    const km = calculateHaversineDistance(myGps.lat, myGps.lng, primaryDevice.lat, primaryDevice.lng);
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  }, [myGps, primaryDevice]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl flex flex-col border border-cyan-500/30 bg-[#060B16] text-slate-100 select-none ${className}`}
      style={{ height: mapHeight }}
    >
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TOP TACTICAL HUD CONTROL BAR                                              */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="px-4 py-2.5 bg-[#090E1C]/95 border-b border-cyan-500/20 backdrop-blur-md flex items-center justify-between z-20 gap-3">
        {/* Left: Tactical Status */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span>FLEET RADAR HUD</span>
              <span className="text-[10px] bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/30 text-cyan-300">
                {devices.length} INSTALLED MOBILE{devices.length === 1 ? '' : 'S'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px] sm:max-w-xs">
              {primaryDevice
                ? `${primaryDevice.name} • ${primaryDevice.isOnline ? 'LIVE GPS' : 'OFFLINE'}`
                : 'AWAITING MOBILE HANDSHAKE...'}
            </div>
          </div>
        </div>

        {/* Center: Search Places */}
        {viewMode !== 'radar' && mapsLoaded && (
          <div className="hidden md:flex items-center bg-slate-900/90 border border-cyan-500/30 rounded-xl px-2.5 py-1 w-64">
            <Search className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search target place..."
              className="w-full bg-transparent text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Right: Layer Switchers & Siren Button */}
        <div className="flex items-center gap-2">
          {/* Layer switcher */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-0.5 flex text-[10px] font-mono">
            <button
              onClick={() => setViewMode('cyber')}
              className={`px-2 py-1 rounded-lg transition-all ${
                viewMode === 'cyber' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              CYBER
            </button>
            <button
              onClick={() => setViewMode('satellite')}
              className={`px-2 py-1 rounded-lg transition-all ${
                viewMode === 'satellite' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              SAT
            </button>
            <button
              onClick={() => setViewMode('roadmap')}
              className={`px-2 py-1 rounded-lg transition-all ${
                viewMode === 'roadmap' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              MAP
            </button>
            <button
              onClick={() => setViewMode('radar')}
              className={`px-2 py-1 rounded-lg transition-all ${
                viewMode === 'radar' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              RADAR
            </button>
          </div>

          {/* Web Siren Alarm Button */}
          <button
            onClick={playWebSirenSound}
            className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
              sirenPlaying
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                : 'bg-rose-950/60 border-rose-600/40 text-rose-300 hover:bg-rose-900/80 hover:text-white'
            }`}
            title="Sound Dual-Tone Emergency Siren Synth"
          >
            {sirenPlaying ? <Volume2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{sirenPlaying ? 'SIREN ACTIVE' : 'SIREN ALARM'}</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* LEASH BREACH ALERT BANNER                                                 */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {isLeashBreached && (
        <div className="bg-rose-500/20 border-b border-rose-500/40 px-4 py-2 flex items-center justify-between animate-pulse z-20">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-mono font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>GEO-LEASH BREACH: Mobile has breached the {leashRadius}m safe perimeter ({proximityDistance})!</span>
          </div>
          <button
            onClick={playWebSirenSound}
            className="px-2.5 py-1 text-[10px] font-mono bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold"
          >
            TRIGGER SIREN
          </button>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MAIN VIEWPORT: GOOGLE MAP OR RADAR HUD CANVAS                            */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative flex-1 w-full bg-[#030712] overflow-hidden">
        {/* Real Google Map Container */}
        <div
          ref={mapContainerRef}
          className={`w-full h-full transition-opacity duration-300 ${
            viewMode !== 'radar' && mapsLoaded && !mapsAuthError ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Tactical Radar HUD Canvas (Fallback or Radar Mode) */}
        {(viewMode === 'radar' || !mapsLoaded || mapsAuthError) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050A17] overflow-hidden">
            {/* Grid dot background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Concentric Range Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80vw] h-[80vw] max-w-[420px] max-h-[420px] rounded-full border border-cyan-500/20 relative flex items-center justify-center">
                <div className="w-[66%] h-[66%] rounded-full border border-cyan-500/25 flex items-center justify-center">
                  <div className="w-[45%] h-[45%] rounded-full border border-cyan-500/30 flex items-center justify-center">
                    <div className="w-[25%] h-[25%] rounded-full border border-cyan-500/40" />
                  </div>
                </div>
                <span className="absolute top-2 text-[9px] font-mono text-cyan-400/60 font-bold">500m</span>
                <span className="absolute bottom-2 text-[9px] font-mono text-cyan-400/60 font-bold">100m</span>
                <span className="absolute left-2 text-[9px] font-mono text-cyan-400/60 font-bold">250m</span>
                <span className="absolute right-2 text-[9px] font-mono text-cyan-400/60 font-bold">250m</span>
              </div>
            </div>

            {/* Rotating Radar Sweep Line */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              style={{ transform: `rotate(${radarSweepAngle}deg)` }}
            >
              <div className="w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-cyan-200 origin-left shadow-[0_0_12px_#00f0ff]" />
            </div>

            {/* Center Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 border border-cyan-400/50 rounded-full flex items-center justify-center">
                <Crosshair className="w-5 h-5 text-cyan-400/70" />
              </div>
            </div>

            {/* Target Blips */}
            <div className="absolute inset-0 pointer-events-auto">
              {devices.map((device, idx) => {
                const isSelected = selectedDevice?.id === device.id;
                const angle = (idx * (360 / Math.max(devices.length, 1)) + 45) * (Math.PI / 180);
                const radius = 90 + idx * 30;
                const leftPercent = 50 + (radius * Math.cos(angle)) / 4.2;
                const topPercent = 50 + (radius * Math.sin(angle)) / 4.2;

                return (
                  <div
                    key={device.id}
                    onClick={() => onSelectDevice(device)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
                    style={{
                      left: `${Math.max(15, Math.min(85, leftPercent))}%`,
                      top: `${Math.max(15, Math.min(85, topPercent))}%`,
                    }}
                  >
                    <div
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all ${
                        isSelected
                          ? 'bg-cyan-950/95 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/60 scale-110'
                          : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-cyan-500/50'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-mono font-bold whitespace-nowrap">{device.name}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          device.isOnline ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-slate-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────────── */}
        {/* EMPTY STATE: WHEN NO REAL MOBILE DEVICES ARE INSTALLED                     */}
        {/* ────────────────────────────────────────────────────────────────────────── */}
        {devices.length === 0 && (
          <div className="absolute inset-0 z-30 bg-[#060B16]/90 backdrop-blur-md flex items-center justify-center p-6 text-white">
            <div className="max-w-md w-full bg-[#0B132B] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400">
                <Smartphone className="w-7 h-7 animate-pulse" />
              </div>

              <div>
                <h3 className="text-lg font-mono font-extrabold text-white">NO MOBILE APP CONNECTED</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Install the Member APK on your phone to activate real Google Maps live GPS tracking.
                </p>
              </div>

              {/* Pairing PIN Code Box */}
              <div className="bg-slate-900/90 border border-cyan-500/50 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  GUARDIAN PAIRING PIN
                </span>
                <div className="text-3xl font-mono font-black tracking-widest text-cyan-300">
                  {pairingCode}
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Enter this 6-digit PIN in the mobile app to pair securely.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="/downloads/member-debug.apk"
                  download="member-debug.apk"
                  className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK</span>
                </a>
                <a
                  href="http://192.168.31.141:8088/member-debug.apk"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Local WiFi APK</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────────── */}
        {/* FLOATING ACTION OVERLAY CONTROLS                                         */}
        {/* ────────────────────────────────────────────────────────────────────────── */}
        {devices.length > 0 && (
          <>
            {/* Center / Recenter Floating Buttons */}
            <div className="absolute bottom-6 left-4 z-20 flex flex-col gap-2">
              <button
                onClick={centerOnDevice}
                className="px-3.5 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs shadow-2xl hover:bg-cyan-400 transition-all flex items-center gap-2 border border-cyan-300"
                title="Lock Crosshair onto Mobile Location"
              >
                <Crosshair className="w-4 h-4" />
                <span>LOCK ON MOBILE</span>
              </button>

              <button
                onClick={() => {
                  if (primaryDevice?.lat && primaryDevice?.lng) {
                    setStreetViewCoords({ lat: primaryDevice.lat, lng: primaryDevice.lng });
                    setStreetViewOpen(true);
                  }
                }}
                className="px-3.5 py-2 rounded-2xl bg-slate-900/90 text-cyan-400 hover:bg-slate-800 font-mono font-bold text-xs shadow-xl transition-all flex items-center gap-2 border border-cyan-500/30"
              >
                <Eye className="w-4 h-4" />
                <span>STREET VIEW RECON</span>
              </button>
            </div>

            {/* Bottom-Right Device Telemetry HUD Card */}
            {primaryDevice && (
              <div className="hidden sm:block absolute bottom-6 right-4 z-20 w-80 bg-[#090E1C]/95 border border-cyan-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <div>
                      <h4 className="font-bold text-xs text-white">{primaryDevice.name}</h4>
                      <span className="text-[10px] text-slate-400">{primaryDevice.platform || 'Android'}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      primaryDevice.isOnline
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {primaryDevice.isOnline ? 'ONLINE' : 'STANDBY'}
                  </span>
                </div>

                {/* Telemetry metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Proximity</span>
                    <span className="font-bold text-cyan-300 text-xs">{proximityDistance || '1.2 km'}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Battery</span>
                    <span className="font-bold text-white text-xs">{primaryDevice.battery}%</span>
                  </div>
                  <div className="col-span-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Address</span>
                    <span className="font-bold text-slate-200 text-[10px] line-clamp-1">
                      {geocodedAddress || primaryDevice.locationName || 'Location Lock Active'}
                    </span>
                  </div>
                </div>

                {/* Geo-Leash Quick Toggle */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] text-slate-400">Geo-Leash (250m)</span>
                  <button
                    onClick={() => setLeashArmed(!leashArmed)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      leashArmed
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {leashArmed ? 'ARMED' : 'DISARMED'}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (primaryDevice.lat && primaryDevice.lng) {
                        calculateRoute(primaryDevice.lat, primaryDevice.lng, primaryDevice.name);
                      }
                    }}
                    className="py-1.5 px-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <RouteIcon className="w-3 h-3" />
                    <span>Get Route</span>
                  </button>
                  {onOpenLiveCamera && (
                    <button
                      onClick={() => onOpenLiveCamera(primaryDevice)}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-colors border border-slate-700"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Live Feed</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Turn-by-Turn Route Guidance Panel */}
            {activeRoute && (
              <div className="absolute top-16 left-4 z-20 max-w-sm w-full bg-[#090E1C]/95 border border-cyan-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white">ROUTE TO {activeRoute.destinationName}</span>
                  </div>
                  <button onClick={clearRoute} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 text-cyan-300 font-bold">
                  <span>ETA: {activeRoute.duration}</span>
                  <span>Dist: {activeRoute.distance}</span>
                </div>
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="w-full py-1 text-[10px] text-slate-400 hover:text-white flex items-center justify-center gap-1 border-t border-slate-800"
                >
                  <span>{showSteps ? 'Hide steps' : 'View turn-by-turn guidance'}</span>
                  {showSteps ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showSteps && (
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pt-2 text-[10px] text-slate-300">
                    {activeRoute.steps.map((st, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-cyan-400 font-bold">{i + 1}.</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* GOOGLE STREET VIEW OPTICAL RECON VANTAGE MODAL                            */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {streetViewOpen && streetViewCoords && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-2xl bg-[#090D16] border border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-sm font-bold text-white">GOOGLE STREET VIEW RECON VANTAGE</span>
              </div>
              <button onClick={() => setStreetViewOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-96 bg-black">
              <iframe
                title="Google Street View"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${streetViewCoords.lat},${streetViewCoords.lng}&layer=c&cbll=${streetViewCoords.lat},${streetViewCoords.lng}&cbp=11,0,0,0,0&output=svembed`}
              />
            </div>

            <div className="p-3 bg-black/50 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>
                COORDS: {streetViewCoords.lat.toFixed(5)}°, {streetViewCoords.lng.toFixed(5)}°
              </span>
              <a
                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${streetViewCoords.lat},${streetViewCoords.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Full Screen 360° Panorama</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
