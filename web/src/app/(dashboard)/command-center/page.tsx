'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialDevices } from '@/lib/mockData';
import { DeviceData } from '@/components/ui/DeviceCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BatteryIndicator } from '@/components/ui/BatteryIndicator';
import { NetworkIndicator } from '@/components/ui/NetworkIndicator';
import { GoogleMapsFleetView, defaultCoordinates } from '@/components/ui/GoogleMapsFleetView';
import {
  Compass,
  Radio,
  Video,
  Route,
  History,
  Navigation,
  Shield,
  Clock,
} from 'lucide-react';

export default function DesktopCommandCenterPage() {
  const router = useRouter();
  const [devices] = useState<DeviceData[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData>(initialDevices[1]); // Mom Phone
  const [filterMode, setFilterMode] = useState<'all' | 'online' | 'offline'>('all');

  const filtered = devices.filter((d) => {
    if (filterMode === 'online') return d.isOnline;
    if (filterMode === 'offline') return !d.isOnline;
    return true;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#10243E] dark:text-white tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#087CF5]" />
            Live Map Command Center
          </h2>
          <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
            Mission-critical family perimeter telemetry and remote device operations powered by Google Maps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-[#22B573] animate-pulse" />
            Google Maps Platform Live Radar
          </span>
        </div>
      </div>

      {/* Main Grid: Map (majority) + Right Device Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[620px]">
        {/* Left/Center: Interactive Google Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-[#071321] rounded-3xl border border-[#E4EAF2] dark:border-[#1E3A5A] overflow-hidden shadow-xl relative">
          <div className="flex-1 w-full relative">
            <GoogleMapsFleetView
              devices={devices}
              selectedDevice={selectedDevice}
              onSelectDevice={(device) => setSelectedDevice(device)}
              onNavigate={(device) => {
                const coord = defaultCoordinates[device.id];
                if (coord) {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${coord.lat},${coord.lng}`, '_blank');
                }
              }}
              onOpenLiveCamera={(device) => router.push(`/devices/${device.id}/camera`)}
              onOpenDetails={(device) => router.push(`/devices/${device.id}`)}
              mapHeight="100%"
            />
          </div>

          {/* Bottom Statistics Bar */}
          <div className="p-4 bg-white dark:bg-[#0D2035] border-t border-[#E4EAF2] dark:border-[#1E3A5A] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
                Direct Distance
              </span>
              <span className="font-bold text-[#10243E] dark:text-white">
                {selectedDevice.distance || '1.4 mi'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
                Fastest Route
              </span>
              <span className="font-bold text-[#087CF5]">
                8 min (Google Routes)
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
                Battery Level
              </span>
              <div className="mt-0.5">
                <BatteryIndicator level={selectedDevice.battery} isCharging={selectedDevice.isCharging} />
              </div>
            </div>
            <div>
              <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
                Active Perimeter
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Safe Zone Protected
              </span>
            </div>
          </div>
        </div>

        {/* Right: Device Inspector & Fleet Selector (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col bg-white dark:bg-[#0D2035] rounded-3xl border border-[#E4EAF2] dark:border-[#1E3A5A] p-4 shadow-xl space-y-4 overflow-hidden">
          {/* Segmented Filter: All | Online | Offline */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-[#10243E] dark:text-white">
              Family Fleet ({devices.length})
            </h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[10px]">
              {(['all', 'online', 'offline'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2 py-0.5 rounded-lg font-bold capitalize transition-all ${
                    filterMode === mode
                      ? 'bg-white dark:bg-[#062B52] text-[#087CF5] shadow-xs'
                      : 'text-[#718096] dark:text-[#94A3B8]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Device List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filtered.map((device) => {
              const isSelected = selectedDevice.id === device.id;
              return (
                <div
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/60 border-[#087CF5] ring-2 ring-blue-500/20'
                      : 'bg-slate-50 dark:bg-[#071321] border-slate-100 dark:border-slate-800 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#10243E] dark:text-white">
                          {device.name}
                        </span>
                        {device.isThisDevice && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-[#087CF5] font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-0.5">
                        {device.locationName}
                      </p>
                    </div>

                    <StatusBadge
                      status={device.isOnline ? 'online' : 'offline'}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-[11px] pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
                    <span className="text-[#718096] dark:text-[#94A3B8]">
                      {device.lastSeen}
                    </span>
                    <BatteryIndicator level={device.battery} showText />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Remote Operations for Selected Device */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-extrabold text-[#718096] dark:text-[#94A3B8] uppercase tracking-wider block">
              Authorized Remote Sessions
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => router.push(`/devices/${selectedDevice.id}/camera`)}
                className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#087CF5] hover:bg-blue-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Camera</span>
              </button>
              <button
                onClick={() => router.push(`/devices/${selectedDevice.id}/screen`)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#10243E] dark:text-white hover:bg-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#087CF5]" />
                <span>Mirror</span>
              </button>
            </div>

            <button
              onClick={() => router.push(`/devices/${selectedDevice.id}`)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Full Device Controls</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
