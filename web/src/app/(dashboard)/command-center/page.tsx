'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFleetDevices } from '@/lib/useFleetDevices';
import { DeviceData } from '@/components/ui/DeviceCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BatteryIndicator } from '@/components/ui/BatteryIndicator';
import { GoogleMapsFleetView } from '@/components/ui/GoogleMapsFleetView';
import {
  Compass,
  Video,
  Route,
  Navigation,
  Shield,
  Clock,
  Smartphone,
  Download,
} from 'lucide-react';

export default function DesktopCommandCenterPage() {
  const router = useRouter();
  const { devices, selectedDevice, setSelectedDevice, pairingInfo } = useFleetDevices();
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
            <Compass className="w-6 h-6 text-cyan-400" />
            Live Map Command Center
          </h2>
          <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
            Mission-critical family perimeter telemetry powered by Google Maps Platform &amp; Android GPS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-semibold text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Google Maps Tactical Radar
          </span>
        </div>
      </div>

      {/* Main Grid: Map (majority) + Right Device Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[640px]">
        {/* Left/Center: Interactive Google Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col bg-[#060B16] rounded-3xl border border-cyan-500/20 overflow-hidden shadow-2xl relative">
          <div className="flex-1 w-full relative">
            <GoogleMapsFleetView
              devices={devices}
              selectedDevice={selectedDevice}
              onSelectDevice={(device) => setSelectedDevice(device)}
              onNavigate={(device) => {
                if (device.lat && device.lng) {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${device.lat},${device.lng}`,
                    '_blank'
                  );
                }
              }}
              onOpenLiveCamera={(device) => router.push(`/devices/${device.id}/camera`)}
              onOpenDetails={(device) => router.push(`/devices/${device.id}`)}
              mapHeight="100%"
              pairingCode={pairingInfo?.code || 'HW25ML'}
            />
          </div>

          {/* Bottom Statistics Bar */}
          {selectedDevice && (
            <div className="p-3.5 bg-[#090E1C] border-t border-cyan-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Proximity</span>
                <span className="font-bold text-cyan-300">
                  {selectedDevice.distance || 'GPS Tracked'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Status</span>
                <span className="font-bold text-white">
                  {selectedDevice.isOnline ? 'Online • 5G' : 'Standby'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Battery</span>
                <div className="mt-0.5">
                  <BatteryIndicator level={selectedDevice.battery} isCharging={selectedDevice.isCharging} />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Perimeter</span>
                <span className="font-bold text-emerald-400">
                  Geo-Leash Ready
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Device Inspector & Fleet Selector (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col bg-[#090E1C] rounded-3xl border border-cyan-500/20 p-4 shadow-xl space-y-4 overflow-hidden">
          {/* Segmented Filter */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-white font-mono flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Installed Fleet ({devices.length})</span>
            </h3>
            <div className="flex bg-slate-900 p-0.5 rounded-xl text-[10px] font-mono">
              {(['all', 'online', 'offline'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2 py-0.5 rounded-lg font-bold capitalize transition-all ${
                    filterMode === mode
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'text-slate-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Device List or Empty Prompt */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {devices.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-3 font-mono">
                <span className="text-xs text-slate-400 block">No paired phones</span>
                {pairingInfo && (
                  <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/40">
                    <span className="text-[10px] text-cyan-400 block font-bold">PAIRING CODE</span>
                    <span className="text-2xl font-bold text-white tracking-widest">{pairingInfo.code}</span>
                  </div>
                )}
                <a
                  href="/downloads/member-debug.apk"
                  download="member-debug.apk"
                  className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK</span>
                </a>
              </div>
            ) : (
              filtered.map((device) => {
                const isSelected = selectedDevice?.id === device.id;
                return (
                  <div
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer font-mono ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">
                            {device.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {device.locationName}
                        </p>
                      </div>

                      <StatusBadge
                        status={device.isOnline ? 'online' : 'offline'}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-[10px] pt-2 border-t border-slate-800">
                      <span className="text-slate-400">{device.lastSeen}</span>
                      <BatteryIndicator level={device.battery} showText />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Remote Operations for Selected Device */}
          {selectedDevice && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">
                Remote Operations
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => router.push(`/devices/${selectedDevice.id}/camera`)}
                  className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-cyan-500/30 font-mono"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Camera</span>
                </button>
                <button
                  onClick={() => router.push(`/devices/${selectedDevice.id}/screen`)}
                  className="p-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 font-mono"
                >
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mirror</span>
                </button>
              </div>

              <button
                onClick={() => router.push(`/devices/${selectedDevice.id}`)}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Full Device Controls</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
