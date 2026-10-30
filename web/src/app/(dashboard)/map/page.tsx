'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFleetDevices } from '@/lib/useFleetDevices';
import { DeviceData } from '@/components/ui/DeviceCard';
import { BatteryIndicator } from '@/components/ui/BatteryIndicator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { GoogleMapsFleetView } from '@/components/ui/GoogleMapsFleetView';
import {
  History,
  Route,
  Video,
  Shield,
  Radio,
  Download,
  Smartphone,
  ExternalLink,
  QrCode,
  Crosshair,
  Volume2,
} from 'lucide-react';

export default function LiveMapPage() {
  const router = useRouter();
  const { devices, selectedDevice, setSelectedDevice, pairingInfo } = useFleetDevices();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(true);

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col lg:flex-row gap-4 relative rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl bg-[#060B16]">
      {/* Center / Full Viewport Google Maps Canvas */}
      <div className="flex-1 relative w-full h-full overflow-hidden bg-[#030712]">
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

        {/* Selected Device Floating Card (Responsive Desktop Overlay) */}
        {selectedDevice && (
          <div className="hidden lg:block absolute bottom-6 right-6 w-96 bg-[#090E1C]/95 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-5 shadow-2xl z-20 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base">
                    {selectedDevice.name}
                  </h3>
                  <StatusBadge
                    status={selectedDevice.isOnline ? 'online' : 'offline'}
                    label={selectedDevice.isOnline ? 'Live GPS' : 'Standby'}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Last updated {selectedDevice.lastSeen}
                </p>
              </div>

              <BatteryIndicator
                level={selectedDevice.battery}
                isCharging={selectedDevice.isCharging}
                showText
              />
            </div>

            {/* Telemetry Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block">
                  Distance from you
                </span>
                <span className="font-bold text-cyan-300">
                  {selectedDevice.distance || 'GPS Tracking Active'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">
                  Network Link
                </span>
                <span className="font-bold text-slate-200">
                  {selectedDevice.networkType} (Keystore Verified)
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[11px] text-slate-400 block">
                  Coordinates
                </span>
                <span className="font-mono text-cyan-400 text-[11px] truncate block">
                  {selectedDevice.lat?.toFixed(5)}°, {selectedDevice.lng?.toFixed(5)}°
                </span>
              </div>
            </div>

            {/* Action Buttons: Live, Route, History */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => router.push(`/devices/${selectedDevice.id}/camera`)}
                className="py-2.5 px-3 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-cyan-500/20 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Live</span>
              </button>
              <button
                onClick={() => {
                  if (selectedDevice.lat && selectedDevice.lng) {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${selectedDevice.lat},${selectedDevice.lng}`,
                      '_blank'
                    );
                  }
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <Route className="w-3.5 h-3.5 text-cyan-400" />
                <span>Route</span>
              </button>
              <button
                onClick={() => router.push('/history')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <History className="w-3.5 h-3.5 text-cyan-400" />
                <span>History</span>
              </button>
            </div>

            <button
              onClick={() => router.push(`/devices/${selectedDevice.id}`)}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all font-mono"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Open Device Controls &amp; Keystore</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Desktop Fleet Selector Panel */}
      <div className="hidden lg:flex w-80 bg-[#090E1C] border-l border-cyan-500/20 flex-col p-4 space-y-3 flex-shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-extrabold text-white text-sm font-mono flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Installed Fleet ({devices.length})</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Real APK devices paired
            </p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {/* Device List or Empty Prompt */}
        {devices.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 text-center space-y-3">
            <span className="text-xs text-slate-400 font-mono block">No mobile app connected</span>
            {pairingInfo && (
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                <span className="text-[10px] text-cyan-400 font-mono block">PAIRING PIN</span>
                <span className="text-xl font-mono font-bold text-white tracking-widest">
                  {pairingInfo.code}
                </span>
              </div>
            )}
            <a
              href="/downloads/member-debug.apk"
              download="member-debug.apk"
              className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK</span>
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {devices.map((device) => {
              const isSelected = selectedDevice?.id === device.id;
              return (
                <div
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {device.name}
                    </span>
                    <StatusBadge
                      status={device.isOnline ? 'online' : 'offline'}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                    <span className="text-cyan-300 font-mono">{device.distance || 'Tracked'}</span>
                    <BatteryIndicator level={device.battery} showText />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Responsive Bottom Sheet */}
      <div
        className={`lg:hidden fixed bottom-16 left-0 right-0 bg-[#090E1C] border-t border-cyan-500/20 p-4 rounded-t-3xl shadow-2xl z-30 transition-transform ${
          mobileSheetOpen ? 'translate-y-0' : 'translate-y-[85%]'
        }`}
      >
        <button
          onClick={() => setMobileSheetOpen(!mobileSheetOpen)}
          className="w-full flex items-center justify-center pb-2 text-slate-400"
        >
          <div className="w-12 h-1 bg-slate-700 rounded-full mb-1" />
        </button>

        {selectedDevice && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white">
                  {selectedDevice.name}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedDevice.locationName}
                </p>
              </div>
              <BatteryIndicator level={selectedDevice.battery} />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => router.push(`/devices/${selectedDevice.id}/camera`)}
                className="py-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-1"
              >
                <Video className="w-3.5 h-3.5" />
                Live
              </button>
              <button
                onClick={() => {
                  if (selectedDevice.lat && selectedDevice.lng) {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${selectedDevice.lat},${selectedDevice.lng}`,
                      '_blank'
                    );
                  }
                }}
                className="py-2 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1 border border-slate-700"
              >
                <Route className="w-3.5 h-3.5 text-cyan-400" />
                Route
              </button>
              <button
                onClick={() => router.push(`/devices/${selectedDevice.id}`)}
                className="py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono"
              >
                Controls
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
