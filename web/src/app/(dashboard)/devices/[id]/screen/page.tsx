'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { initialDevices } from '@/lib/mockData';
import {
  ArrowLeft,
  Maximize2,
  Pause,
  Play,
  Square,
  Shield,
  Cast,
  Smartphone,
  AlertCircle,
} from 'lucide-react';

export default function ScreenMirrorPage() {
  const router = useRouter();
  const params = useParams();
  const deviceId = (params?.id as string) || '1';
  const device = initialDevices.find((d) => d.id === deviceId) || initialDevices[0];

  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleStop = () => {
    alert('Screen sharing session terminated. Android MediaProjection service stopped.');
    router.push(`/devices/${device.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-[#10243E] dark:text-white hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-[#10243E] dark:text-white flex items-center gap-2">
              <span>{device.name}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-[#087CF5] font-semibold dark:bg-blue-950/60 flex items-center gap-1">
                <Cast className="w-3.5 h-3.5" />
                Screen Mirror
              </span>
            </h2>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
              Low-latency WebRTC display stream via Android MediaProjection
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-white hover:bg-slate-100 transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Prominent Session Status Indicator */}
      <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs text-[#087CF5] dark:text-[#53B9FF]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#087CF5] animate-ping" />
          <strong className="tracking-wide">SCREEN SHARING ACTIVE</strong>
          <span>• Authorized by Member via Android System Dialog</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">60 FPS • 1080x2400</span>
      </div>

      {/* Large Device Screen Preview Canvas */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[9/19] rounded-[36px] bg-slate-900 border-4 border-slate-700 shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Device Notch / Punch hole */}
        <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>

        {/* Screen Content Simulator */}
        <div className="flex-1 w-full bg-[#0a1e35] rounded-[24px] p-4 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle phone UI preview */}
          <div className="flex items-center justify-between text-[10px] text-slate-300">
            <span>09:41</span>
            <div className="flex items-center gap-1">
              <span>5G</span>
              <span>82%</span>
            </div>
          </div>

          <div className="my-auto flex flex-col items-center text-center space-y-3">
            <Smartphone className="w-16 h-16 text-[#087CF5] opacity-80" />
            <div>
              <h4 className="text-sm font-bold text-white">
                {isPaused ? 'Stream Paused' : 'Display Streaming Active'}
              </h4>
              <p className="text-xs text-blue-200 mt-1 max-w-[200px]">
                {isPaused
                  ? 'The guardian paused visual capture'
                  : 'Member app home screen active on target device'}
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 bg-black/40 py-1.5 rounded-lg">
            Hardware H.264 Encoder • End-to-End Encrypted
          </div>
        </div>

        {/* Home gesture bar */}
        <div className="w-28 h-1 bg-white/40 rounded-full mx-auto mt-2" />
      </div>

      {/* Bottom Controls: Pause, Stop, Fullscreen */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-md flex items-center justify-center gap-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`py-2.5 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            isPaused
              ? 'bg-[#22B573] text-white hover:bg-emerald-600'
              : 'bg-slate-100 dark:bg-slate-800 text-[#10243E] dark:text-white hover:bg-slate-200'
          }`}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span>{isPaused ? 'Resume Mirror' : 'Pause Mirror'}</span>
        </button>

        <button
          onClick={handleStop}
          className="py-2.5 px-6 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 flex items-center gap-2 transition-all"
        >
          <Square className="w-4 h-4 fill-white" />
          <span>Stop Session</span>
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#10243E] dark:text-white font-semibold text-xs flex items-center gap-2 hover:bg-slate-200 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Fullscreen</span>
        </button>
      </div>

      {/* Android MediaProjection Disclosure */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-800 text-xs text-[#718096] dark:text-[#94A3B8] flex items-center gap-3">
        <Shield className="w-5 h-5 text-[#087CF5] flex-shrink-0" />
        <span>
          <strong>Zero Stealth Capture:</strong> In compliance with Android security standards, screen mirroring relies strictly on official MediaProjection tokens. The member was prompted and can revoke the capture session at any moment.
        </span>
      </div>
    </div>
  );
}
