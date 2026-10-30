'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceCard, DeviceData } from '@/components/ui/DeviceCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { initialDevices } from '@/lib/mockData';
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
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<DeviceData[]>(initialDevices);
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
            Transparent, consent-based real-time safety telemetry
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
            <span>Add Family Member</span>
          </button>
        </div>
      </div>

      {/* Fleet Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#718096] dark:text-[#94A3B8]">
            <span>Total Fleet</span>
            <Users className="w-4 h-4 text-[#087CF5]" />
          </div>
          <div className="text-2xl font-extrabold text-[#10243E] dark:text-white mt-1">
            {devices.length}
          </div>
          <div className="text-[11px] text-[#22B573] font-medium mt-1">
            All paired via Keystore
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
            Real-time GPS active
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#718096] dark:text-[#94A3B8]">
            <span>Offline Devices</span>
            <Clock className="w-4 h-4 text-[#F4A62A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#F4A62A] mt-1">
            {offlineCount}
          </div>
          <div className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-1">
            Queuing to Room DB
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#718096] dark:text-[#94A3B8]">
            <span>Drive Backup</span>
            <HardDrive className="w-4 h-4 text-[#087CF5]" />
          </div>
          <div className="text-2xl font-extrabold text-[#087CF5] mt-1">
            Verified
          </div>
          <div className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-1">
            10-Day Retention Active
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

        <span className="text-xs text-[#718096] dark:text-[#94A3B8] hidden sm:inline">
          Showing {filteredDevices.length} devices
        </span>
      </div>

      {/* Device Cards Grid */}
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

      {/* Bottom Transparency Notice */}
      <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#087CF5] flex-shrink-0" />
          <p className="text-xs text-[#10243E] dark:text-[#F0F4F8]">
            <strong>Zero Stealth Guarantee:</strong> Every connected member device displays a persistent Android status bar notification and retains independent control to pause sharing at any time.
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
        onSuccess={(newDev) => {
          setDevices([
            ...devices,
            {
              id: String(devices.length + 1),
              name: newDev.name,
              memberName: newDev.memberName,
              isOnline: true,
              lastSeen: 'Just now',
              battery: 100,
              networkType: 'WIFI',
              locationName: 'Home Perimeter',
              distance: '0.0 mi',
            },
          ]);
        }}
      />
    </div>
  );
}
