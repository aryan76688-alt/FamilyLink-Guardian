'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ensureAuthToken } from './api';
import { DeviceData } from '@/components/ui/DeviceCard';
import { calculateHaversineDistance } from './haversine';

export interface PairingCodeInfo {
  code: string;
  expiresAt: string;
  qrPayload: string;
}

export function formatTimeAgo(dateString?: string | Date): string {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 15) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function useFleetDevices(guardianLocation?: { lat: number; lng: number } | null) {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pairingInfo, setPairingInfo] = useState<PairingCodeInfo | null>(null);
  const [isPairingLoading, setIsPairingLoading] = useState<boolean>(false);
  const isFirstLoadRef = useRef(true);

  // Fetch Pairing Code for Android APK
  const refreshPairingCode = useCallback(async () => {
    try {
      setIsPairingLoading(true);
      await ensureAuthToken();
      const res = await api.get('/api/auth/pairing-code');
      if (res.data?.code) {
        setPairingInfo(res.data);
      }
    } catch (err: any) {
      console.warn('[useFleetDevices] Failed to fetch pairing code:', err?.message);
    } finally {
      setIsPairingLoading(false);
    }
  }, []);

  // Fetch Real Devices & Coordinates
  const fetchDevices = useCallback(async () => {
    try {
      await ensureAuthToken();
      const [devicesRes, locationsRes] = await Promise.all([
        api.get('/api/devices').catch(() => ({ data: [] })),
        api.get('/api/location/family/latest').catch(() => ({ data: [] })),
      ]);

      const rawDevices: any[] = Array.isArray(devicesRes.data) ? devicesRes.data : [];
      const rawLocations: any[] = Array.isArray(locationsRes.data) ? locationsRes.data : [];

      // Map locations by deviceId
      const locationMap = new Map<string, any>();
      rawLocations.forEach((item) => {
        if (item.deviceId && item.location) {
          locationMap.set(item.deviceId, item.location);
        }
      });

      // Filter and transform ONLY real installed devices from database
      const mappedDevices: DeviceData[] = rawDevices.map((d: any) => {
        const latestLoc = locationMap.get(d.id) || (d.locations && d.locations[0]) || null;
        const lat = latestLoc ? Number(latestLoc.latitude) : 28.6139;
        const lng = latestLoc ? Number(latestLoc.longitude) : 77.209;
        const speed = latestLoc?.speed != null ? Number(latestLoc.speed) : undefined;
        const heading = latestLoc?.heading != null ? Number(latestLoc.heading) : undefined;
        const accuracy = latestLoc?.accuracy != null ? Number(latestLoc.accuracy) : undefined;

        // Compute distance from Guardian / user location if available
        let distanceStr = 'Location synced';
        if (guardianLocation && lat && lng) {
          const distKm = calculateHaversineDistance(
            guardianLocation.lat,
            guardianLocation.lng,
            lat,
            lng
          );
          if (distKm < 1) {
            distanceStr = `${Math.round(distKm * 1000)} m away`;
          } else {
            distanceStr = `${distKm.toFixed(1)} km away`;
          }
        }

        const network = d.networkType || (d.isOnline ? '5G' : 'OFFLINE');

        return {
          id: d.id,
          name: d.name || 'Android Device',
          memberName: d.name || 'Member Phone',
          isThisDevice: false,
          isOnline: Boolean(d.isOnline),
          lastSeen: formatTimeAgo(d.lastSeenAt || latestLoc?.timestamp),
          battery: d.battery != null ? Number(d.battery) : 100,
          isCharging: false,
          networkType: network as any,
          locationName: latestLoc ? `${lat.toFixed(5)}°, ${lng.toFixed(5)}°` : 'Awaiting GPS Fix',
          distance: distanceStr,
          activeFeature: d.isOnline ? 'Live Satellite Beacon' : 'Standby Mode',
          lat,
          lng,
          speed,
          heading,
          accuracy,
          platform: d.platform || 'Android',
          leashActive: false,
          leashRadius: 150,
        };
      });

      setDevices(mappedDevices);
      setError(null);

      // Auto-select first device if none selected
      setSelectedDeviceId((prev) => {
        if (prev && mappedDevices.some((d) => d.id === prev)) {
          return prev;
        }
        return mappedDevices.length > 0 ? mappedDevices[0].id : null;
      });
    } catch (err: any) {
      console.warn('[useFleetDevices] Error fetching devices:', err?.message);
      setError(err?.message || 'Failed to fetch devices');
    } finally {
      if (isFirstLoadRef.current) {
        setLoading(false);
        isFirstLoadRef.current = false;
      }
    }
  }, [guardianLocation]);

  useEffect(() => {
    fetchDevices();
    refreshPairingCode();

    // Auto-poll every 4 seconds for live telemetry
    const interval = setInterval(fetchDevices, 4000);
    return () => clearInterval(interval);
  }, [fetchDevices, refreshPairingCode]);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || (devices.length > 0 ? devices[0] : null);

  const setSelectedDevice = useCallback((device: DeviceData | null) => {
    setSelectedDeviceId(device?.id || null);
  }, []);

  return {
    devices,
    selectedDevice,
    setSelectedDevice,
    loading,
    error,
    refreshDevices: fetchDevices,
    pairingInfo,
    refreshPairingCode,
    isPairingLoading,
  };
}
