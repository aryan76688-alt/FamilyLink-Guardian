'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceCard, DeviceData } from '@/components/ui/DeviceCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useFleetDevices } from '@/lib/useFleetDevices';
import { AddDeviceModal } from '@/components/modals/AddDeviceModal';
import {
  Smartphone,
  MapPin,
  Plus,
  ShieldCheck,
  Radio,
  Clock,
  HardDrive,
  Users,
  Filter,
  Download,
  ExternalLink,
  QrCode,
  Key,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { devices, loading, refreshDevices, pairingInfo, refreshPairingCode } = useFleetDevices();
  const [selectedSegment, setSelectedSegment] = useState<'devices' | 'map'>('devices');
  const [filterMode, setFilterMode] = useState<'all' | 'online' | 'offline'>('all');
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);

  const handleSegmentChange = (id: string) => {
    if (id === 'map') {
      router.push('/map');
    } else {
      setSelectedSegment('devices');
    }
  };

  const filteredDevices = devices.filter((d) => {
    if (filterMode === 'online') return d.isOnline;
    if (filterMode === 'offline') return !d.isOnline;
    return true;
  });

  const onlineCount = devices.filter((d) => d.isOnline).length;
  const offlineCount = devices.length - onlineCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Segmented Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#10243E] dark:text-[#F0F4F8] tracking-tight">
            Family Devices Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] dark:text-[#94A3B8] mt-0.5">
            Transparent, consent-based real-time safety telemetry • Real devices only
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SegmentedControl
            options={[
              { id: 'devices', label: 'Devices', icon: <Smartphone className="w-3.5 h-3.5" />, badge: devices.length },
              { id: 'map', label: 'Map View', icon: <MapPin className="w-3.5 h-3.5" /> },
            ]}
            activeId={selectedSegment}
            onChange={handleSegmentChange}
          />

          <button
            onClick={() => setIsAddDeviceOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Pair Android Phone</span>
          </button>
        </div>
      </div>

      {/* Fleet Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#718096] dark:text-[#94A3B8]">
            <span>Active Installed Fleet</span>
            <Users className="w-4 h-4 text-[#087CF5]" />
          </div>
          <div className="text-2xl font-extrabold text-[#10243E] dark:text-white mt-1">
            {devices.length}
          </div>
          <div className="text-[11px] text-[#22B573] font-medium mt-1">
            Registered via APK Keystore
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#718096] dark:text-[#94A3B8]">
            <span>Online Now</span>
            <Radio className="w-4 h-4 text-[#22B573]" />
          </div>
          <div className="text-2xl font-extrabold text-[#22B573] mt-1">
            {onlineCount}
          </div>
          <div className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-1">
            Live GPS Beacon Streaming
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#718096] dark:text-[#94A3B8]">
            <span>Offline / Standby</span>
            <Clock className="w-4 h-4 text-[#F4A62A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#F4A62A] mt-1">
            {offlineCount}
          </div>
          <div className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-1">
            Room DB offline sync active
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#718096] dark:text-[#94A3B8]">
            <span>Google Maps Platform</span>
            <HardDrive className="w-4 h-4 text-[#087CF5]" />
          </div>
          <div className="text-2xl font-extrabold text-[#087CF5] mt-1">
            Live HUD
          </div>
          <div className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-1">
            Tactical Radar &amp; Routes
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-[#718096] dark:text-[#94A3B8] mr-1">
            Filter:
          </span>

          {(['all', 'online', 'offline'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                filterMode === mode
                  ? 'bg-[#087CF5] text-white shadow-xs'
                  : 'bg-white dark:bg-[#0D2035] text-[#718096] dark:text-[#94A3B8] border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {mode} ({mode === 'all' ? devices.length : mode === 'online' ? onlineCount : offlineCount})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshDevices()}
            className="flex items-center gap-1 text-xs text-[#087CF5] hover:underline font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <span className="text-xs text-[#718096] dark:text-[#94A3B8] hidden sm:inline">
            Showing {filteredDevices.length} real device{filteredDevices.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Empty State when no real devices are paired */}
      {devices.length === 0 && !loading && (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0D2035] border border-dashed border-[#CBD5E1] dark:border-[#1E3A5A] text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#087CF5] mx-auto">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#10243E] dark:text-white">
              No Mobile Phones Paired Yet
            </h3>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-1 max-w-md mx-auto">
              All mock demo devices have been removed. Install the Member APK on your mobile phone to see your device live here.
            </p>
          </div>

          {pairingInfo && (
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 max-w-xs mx-auto">
              <span className="text-[10px] uppercase font-bold text-[#087CF5] tracking-wider block mb-1">
                Your 6-Digit Pairing PIN
              </span>
              <div className="text-3xl font-mono font-extrabold tracking-widest text-[#10243E] dark:text-white">
                {pairingInfo.code}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/downloads/member-debug.apk"
              download="member-debug.apk"
              className="px-4 py-2.5 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Member APK (16MB)</span>
            </a>
            <button
              onClick={() => setIsAddDeviceOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-300 dark:border-slate-700"
            >
              <QrCode className="w-4 h-4" />
              <span>Show Pairing QR</span>
            </button>
          </div>
        </div>
      )}

      {/* Device Cards Grid (Real Installed Devices Only) */}
      {devices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onClick={() => router.push(`/devices/${device.id}`)}
              onLocate={() => router.push(`/map?device=${device.id}`)}
            />
          ))}
        </div>
      )}

      {/* Bottom Transparency Notice */}
      <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#087CF5] flex-shrink-0" />
          <p className="text-xs text-[#10243E] dark:text-[#F0F4F8]">
            <strong>Consent &amp; Integrity:</strong> Only mobile phones that have completed the cryptographic handshake via Android Keystore are displayed.
          </p>
        </div>
        <button
          onClick={() => router.push('/privacy')}
          className="text-xs font-bold text-[#087CF5] hover:underline flex-shrink-0"
        >
          Privacy Center →
        </button>
      </div>

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        onSuccess={() => {
          refreshDevices();
        }}
      />
    </div>
  );
}
