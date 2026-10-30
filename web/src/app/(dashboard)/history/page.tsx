'use client';

import React, { useState } from 'react';
import { useFleetDevices } from '@/lib/useFleetDevices';
import { mockLocationHistory } from '@/lib/mockData';
import { GoogleMapsFleetView } from '@/components/ui/GoogleMapsFleetView';
import {
  History,
  Calendar,
  Download,
  Clock,
  Navigation,
  Smartphone,
} from 'lucide-react';

export default function LocationHistoryPage() {
  const { devices, selectedDevice, setSelectedDevice, pairingInfo } = useFleetDevices();
  const [selectedRange, setSelectedRange] = useState<'today' | '7days' | '30days' | 'custom'>('today');
  const [timeline] = useState(mockLocationHistory);

  const handleExport = (format: 'csv' | 'json') => {
    alert(`Exporting Location History for ${selectedDevice?.name || 'Device'} as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Title and Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#10243E] dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-[#087CF5]" />
            Location History &amp; Route Playback
          </h2>
          <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
            Verified timeline of movements and locations visited on Google Maps
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Selector */}
          {devices.length > 0 && (
            <select
              value={selectedDevice?.id || ''}
              onChange={(e) => {
                const d = devices.find((x) => x.id === e.target.value);
                if (d) setSelectedDevice(d);
              }}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#10243E] dark:text-white outline-none"
            >
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}

          {/* Export Dropdown */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#0D2035] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#10243E] dark:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="px-3 py-2 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white text-xs font-bold transition-all shadow-sm"
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Selector & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white dark:bg-[#0D2035] rounded-2xl border border-[#E4EAF2] dark:border-[#1E3A5A]">
        <div className="flex items-center gap-1">
          {(['today', '7days', '30days', 'custom'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedRange(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedRange === tab
                  ? 'bg-[#087CF5] text-white shadow-sm'
                  : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#10243E]'
              }`}
            >
              {tab === 'today'
                ? 'Today'
                : tab === '7days'
                ? '7 Days'
                : tab === '30days'
                ? '30 Days'
                : 'Custom Range'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1 text-xs text-[#718096] dark:text-[#94A3B8]">
          <Calendar className="w-3.5 h-3.5" />
          <span>Real-time GPS Historical Waypoints</span>
        </div>
      </div>

      {/* Full Google Map with Waypoints */}
      <div className="h-80 w-full rounded-3xl overflow-hidden border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-lg relative">
        <GoogleMapsFleetView
          devices={devices}
          selectedDevice={selectedDevice}
          onSelectDevice={(device) => setSelectedDevice(device)}
          mapHeight="320px"
          onNavigate={(device) => {
            if (device.lat && device.lng) {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${device.lat},${device.lng}`,
                '_blank'
              );
            }
          }}
          pairingCode={pairingInfo?.code || 'HW25ML'}
        />
      </div>

      {/* Timeline Underneath */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#10243E] dark:text-white">
          Chronological Route Timeline
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-200 dark:before:bg-blue-950">
          {timeline.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Pin Marker */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-[#0D2035] border-2 border-[#087CF5] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#087CF5]" />
              </div>

              {/* Timeline Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#087CF5]">
                      {item.time}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-[#10243E] dark:text-white">
                        {item.place}
                      </h4>
                      <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
                        {item.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#718096] dark:text-[#94A3B8]">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-[#087CF5]" />
                      <span>{item.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
