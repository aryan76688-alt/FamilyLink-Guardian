'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialDevices } from '@/lib/mockData';
import { DeviceData } from '@/components/ui/DeviceCard';
import { BatteryIndicator } from '@/components/ui/BatteryIndicator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { GoogleMapsFleetView, defaultCoordinates } from '@/components/ui/GoogleMapsFleetView';
import {
  History,
  Route,
  Video,
  Shield,
  Radio,
} from 'lucide-react';

export default function LiveMapPage() {
  const router = useRouter();
  const [devices] = useState<DeviceData[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData>(initialDevices[1]); // Default Mom Phone
  const [mobileSheetOpen, setMobileSheetOpen] = useState(true);

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col lg:flex-row gap-4 relative rounded-3xl overflow-hidden border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-xl bg-white dark:bg-[#071321]">
      {/* Center / Full Viewport Google Maps Canvas */}
      <div className="flex-1 relative w-full h-full overflow-hidden bg-slate-100 dark:bg-[#06182c]">
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

        {/* Selected Device Floating Card (Responsive Desktop Overlay) */}
        {selectedDevice && (
          <div className="hidden lg:block absolute bottom-6 right-6 w-96 bg-white/95 dark:bg-[#0D2035]/95 backdrop-blur-xl border border-[#E4EAF2] dark:border-[#1E3A5A] rounded-3xl p-5 shadow-2xl z-20 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[#10243E] dark:text-white text-base">
                    {selectedDevice.name}
                  </h3>
                  <StatusBadge
                    status={selectedDevice.isOnline ? 'online' : 'offline'}
                    label={selectedDevice.isOnline ? 'Online' : 'Offline'}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
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
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-[#071321] p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
                  Distance from you
                </span>
                <span className="font-bold text-[#10243E] dark:text-[#F0F4F8]">
                  {selectedDevice.distance || '1.4 miles away'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
                  Est. Route Time
                </span>
                <span className="font-bold text-[#087CF5]">
                  8 min ETA (Google Routes)
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
                  Current Location
                </span>
                <span className="font-bold text-[#10243E] dark:text-[#F0F4F8] truncate block">
                  {selectedDevice.locationName}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
                  Network Link
                </span>
                <span className="font-bold text-[#10243E] dark:text-[#F0F4F8]">
                  {selectedDevice.networkType} (Verified)
                </span>
              </div>
            </div>

            {/* Action Buttons: Live, Route, History */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => router.push(`/devices/${selectedDevice.id}/camera`)}
                className="py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#087CF5] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Live</span>
              </button>
              <button
                onClick={() => {
                  const coord = defaultCoordinates[selectedDevice.id];
                  if (coord) {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${coord.lat},${coord.lng}`, '_blank');
                  }
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#10243E] dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors"
              >
                <Route className="w-3.5 h-3.5 text-[#087CF5]" />
                <span>Route</span>
              </button>
              <button
                onClick={() => router.push('/history')}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#10243E] dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors"
              >
                <History className="w-3.5 h-3.5 text-[#087CF5]" />
                <span>History</span>
              </button>
            </div>

            <button
              onClick={() => router.push(`/devices/${selectedDevice.id}`)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Open Device Controls & Consent</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Desktop Fleet Selector Panel */}
      <div className="hidden lg:flex w-80 bg-white dark:bg-[#0D2035] border-l border-[#E4EAF2] dark:border-[#1E3A5A] flex-col p-4 space-y-3 flex-shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-[#10243E] dark:text-white text-sm">
              Family Fleet ({devices.length})
            </h3>
            <p className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
              Select device to track & route
            </p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#22B573] animate-pulse" />
        </div>

        <div className="space-y-2">
          {devices.map((device) => {
            const isSelected = selectedDevice?.id === device.id;
            return (
              <div
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-[#087CF5] shadow-xs'
                    : 'bg-slate-50 dark:bg-[#071321] border-slate-200/80 dark:border-slate-800 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#10243E] dark:text-white">
                    {device.name}
                  </span>
                  <StatusBadge
                    status={device.isOnline ? 'online' : 'offline'}
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-[#718096] dark:text-[#94A3B8]">
                  <span>{device.distance || 'Near'}</span>
                  <BatteryIndicator level={device.battery} showText />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Responsive Bottom Sheet */}
      <div
        className={`lg:hidden fixed bottom-16 left-0 right-0 bg-white dark:bg-[#0D2035] border-t border-[#E4EAF2] dark:border-[#1E3A5A] p-4 rounded-t-3xl shadow-2xl z-30 transition-transform ${
          mobileSheetOpen ? 'translate-y-0' : 'translate-y-[85%]'
        }`}
      >
        <button
          onClick={() => setMobileSheetOpen(!mobileSheetOpen)}
          className="w-full flex items-center justify-center pb-2 text-slate-400"
        >
          <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mb-1" />
        </button>

        {selectedDevice && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#10243E] dark:text-white">
                  {selectedDevice.name}
                </h4>
                <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                  {selectedDevice.locationName}
                </p>
              </div>
              <BatteryIndicator level={selectedDevice.battery} />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => router.push(`/devices/${selectedDevice.id}/camera`)}
                className="py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#087CF5] font-bold text-xs flex items-center justify-center gap-1"
              >
                <Video className="w-3.5 h-3.5" />
                Live
              </button>
              <button
                onClick={() => {
                  const coord = defaultCoordinates[selectedDevice.id];
                  if (coord) {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${coord.lat},${coord.lng}`, '_blank');
                  }
                }}
                className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center gap-1"
              >
                <Route className="w-3.5 h-3.5 text-[#087CF5]" />
                Route
              </button>
              <button
                onClick={() => router.push(`/devices/${selectedDevice.id}`)}
                className="py-2 rounded-xl bg-[#087CF5] text-white font-bold text-xs"
              >
                Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
