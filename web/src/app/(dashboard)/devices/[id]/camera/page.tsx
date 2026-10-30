'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFleetDevices } from '@/lib/useFleetDevices';
import {
  ArrowLeft,
  Settings,
  Mic,
  MicOff,
  Square,
  Camera,
  RefreshCw,
  Sparkles,
  Download,
  ShieldCheck,
  AlertCircle,
  Radio,
} from 'lucide-react';

export default function LiveCameraPage() {
  const router = useRouter();
  const params = useParams();
  const deviceId = (params?.id as string) || '2';
  const { devices } = useFleetDevices();
  const device = devices.find((d) => d.id === deviceId) || devices[0] || {
    id: deviceId,
    name: 'Android Mobile Device',
    memberName: 'Family Member',
    isOnline: true,
    lastSeen: 'Live GPS',
    battery: 100,
    networkType: '5G' as const,
  };

  const [sessionTime, setSessionTime] = useState(12);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isHD, setIsHD] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [consentGranted, setConsentGranted] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    alert('Camera session ended. Member notified and session recorded in audit log.');
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
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-[#EF4444] font-semibold dark:bg-red-950/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
                Live Camera
              </span>
            </h2>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
              Authorized WebRTC video stream
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Camera Settings: 1080p WebRTC, 30fps, Opus Audio Codec')}
          className="p-2.5 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-white hover:bg-slate-100 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Large Rounded Video Preview Canvas */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 flex items-center justify-center group">
        {/* Simulated Camera Feed View */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 z-10 pointer-events-none" />

        {/* Ambient Camera Simulator */}
        <div className="w-full h-full bg-[#040e1b] flex flex-col items-center justify-center text-center p-6 relative">
          {/* Subtle Video Scanning Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(8,124,245,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(8,124,245,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Camera Frame Icon / Visualization */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-blue-900/30 border border-blue-500/30 flex items-center justify-center animate-pulse">
            <Camera className="w-10 h-10 text-[#087CF5]" />
          </div>
          <p className="relative z-10 text-xs font-semibold text-blue-200 mt-3">
            WebRTC Encrypted Feed ({cameraFacing === 'back' ? 'Rear Camera' : 'Front Selfie Camera'})
          </p>
          <p className="relative z-10 text-[11px] text-slate-400">
            Android CameraX • Resolution: {isHD ? '1080p FHD' : '720p HD'} • 30 FPS
          </p>
        </div>

        {/* Top-Left Overlay: LIVE + Timer */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF4444] text-white text-xs font-extrabold tracking-wider shadow-lg">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>LIVE</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20">
            {formatTime(sessionTime)}
          </div>
        </div>

        {/* Top-Right Overlay: Secondary Controls (Switch, HD, Screenshot) */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
          <button
            onClick={() => setCameraFacing(cameraFacing === 'back' ? 'front' : 'back')}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 text-xs font-semibold flex items-center gap-1 transition-all"
            title="Switch Front/Back Camera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline capitalize">{cameraFacing}</span>
          </button>
          <button
            onClick={() => setIsHD(!isHD)}
            className={`px-2.5 py-1.5 rounded-xl backdrop-blur-md text-xs font-bold border transition-all ${
              isHD
                ? 'bg-[#087CF5] text-white border-blue-400 shadow-sm'
                : 'bg-black/60 text-slate-300 border-white/20'
            }`}
          >
            {isHD ? 'HD 1080p' : 'SD'}
          </button>
          <button
            onClick={() => alert('Screenshot captured and securely saved to encrypted local media storage.')}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition-all"
            title="Take Screenshot"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Floating Controls: Mic, Stop, Camera */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          {/* Microphone Mute Toggle */}
          <button
            onClick={() => setIsMicMuted(!isMicMuted)}
            className={`p-3.5 rounded-2xl backdrop-blur-md border transition-all shadow-lg ${
              isMicMuted
                ? 'bg-[#EF4444] text-white border-red-400'
                : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
            }`}
            title="Microphone Toggle"
          >
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Stop Session Button */}
          <button
            onClick={handleStop}
            className="py-3 px-6 rounded-2xl bg-[#EF4444] hover:bg-red-600 text-white font-bold text-xs shadow-xl shadow-red-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>End Session</span>
          </button>

          {/* Snapshot Trigger */}
          <button
            onClick={() => alert('Snapshot captured!')}
            className="p-3.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 transition-all shadow-lg"
            title="Instant Snapshot"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Session Consent Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#22B573] flex-shrink-0" />
          <span>
            <strong>Consent Verified:</strong> The member phone accepted this camera session. An Android system indicator and camera dot remain visible on the member screen.
          </span>
        </div>
        <span className="font-bold text-[11px] underline cursor-pointer" onClick={() => router.push('/audit')}>
          Audit Log
        </span>
      </div>
    </div>
  );
}
