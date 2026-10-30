'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FamilyLogo } from '@/components/ui/FamilyLogo';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Shield,
  MapPin,
  Camera,
  Mic,
  Share2,
  Cloud,
  Pause,
  Play,
  Lock,
  RefreshCw,
  Bell,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

export default function MemberPortalPage() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Consent states
  const [locationActive, setLocationActive] = useState(true);
  const [cameraSessionRequested, setCameraSessionRequested] = useState(false);

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      alert('All family sharing paused. Guardian notified that sharing is temporarily suspended.');
    } else {
      alert('Sharing resumed. Encrypted telemetry active.');
    }
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Encrypted Room queue synced with Guardian backend.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#071321] text-[#10243E] dark:text-[#F0F4F8] p-4 sm:p-8 flex flex-col justify-between max-w-xl mx-auto">
      {/* Top Persistent Android Notification Simulation */}
      <div className="w-full mb-6">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0D2035] border border-blue-200 dark:border-blue-900 shadow-md flex items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#087CF5] text-white flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-[#062B52] dark:text-white">
                  FamilyLink
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#22B573] animate-pulse" />
                <span className="text-[11px] text-[#22B573] font-semibold">
                  {isPaused ? 'Sharing Paused' : 'Location sharing active'}
                </span>
              </div>
              <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] truncate">
                Guardian: Aryan • Last update: 20:14
              </p>
            </div>
          </div>

          <button
            onClick={handlePauseToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              isPaused
                ? 'bg-[#22B573] text-white'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6 flex-1">
        {/* App Title & Guardian Trust Lockup */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-[#10243E] dark:text-white hover:bg-slate-100 transition-colors"
              title="Return to Guardian Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-[#10243E] dark:text-white tracking-tight">
                FamilyLink <span className="text-[#087CF5]">Member</span>
              </h1>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                Transparent, consent-based safety on this phone
              </p>
            </div>
          </div>

          <StatusBadge
            status={isPaused ? 'paused' : 'online'}
            label={isPaused ? 'Paused' : 'Active'}
          />
        </div>

        {/* Guardian Connection Info Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#718096] dark:text-[#94A3B8] uppercase tracking-wider">
              Sharing Status
            </span>
            <span className="text-xs text-[#22B573] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Connected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#071321] p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[#718096] block text-[11px]">Primary Guardian</span>
              <strong className="text-[#10243E] dark:text-white text-sm">Aryan</strong>
            </div>
            <div>
              <span className="text-[#718096] block text-[11px]">Last Sync</span>
              <strong className="text-[#10243E] dark:text-white text-sm">2 min ago</strong>
            </div>
            <div>
              <span className="text-[#718096] block text-[11px]">GPS Tracking</span>
              <strong className={isPaused ? 'text-amber-500' : 'text-[#22B573]'}>
                {isPaused ? 'PAUSED' : 'ACTIVE'}
              </strong>
            </div>
            <div>
              <span className="text-[#718096] block text-[11px]">Cloud Sync</span>
              <strong className="text-[#087CF5]">CONNECTED</strong>
            </div>
          </div>
        </div>

        {/* Sharing Controls & Permissions Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#10243E] dark:text-white">
            Monitored Channels & Consent Settings
          </h3>

          <div className="space-y-2.5">
            {/* Location Sharing Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#087CF5] dark:bg-blue-950 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#10243E] dark:text-white">
                    Location Sharing
                  </h4>
                  <p className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                    {isPaused ? 'Suspended by user' : 'Active (Fused Location 30m)'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={locationActive && !isPaused}
                onChange={() => setLocationActive(!locationActive)}
                className="w-5 h-5 rounded accent-[#087CF5] cursor-pointer"
              />
            </div>

            {/* Camera Sessions Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#10243E] dark:text-white">
                    Camera Sessions
                  </h4>
                  <p className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                    Requires immediate prompt & audio chime
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                Prompt Required
              </span>
            </div>

            {/* Microphone Sessions Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#10243E] dark:text-white">
                    Microphone Sessions
                  </h4>
                  <p className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                    Consent prompt • No background recording
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                Prompt Required
              </span>
            </div>

            {/* Screen Sharing Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#10243E] dark:text-white">
                    Screen Sharing
                  </h4>
                  <p className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                    Official Android MediaProjection prompt
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                Prompt Required
              </span>
            </div>

            {/* Cloud Backup Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#087CF5] dark:bg-blue-950 flex items-center justify-center">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#10243E] dark:text-white">
                    Cloud Backup
                  </h4>
                  <p className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                    Transparent User Google Drive Folder
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-[#22B573] dark:bg-emerald-950/60 dark:text-emerald-400">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Action Button Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handlePauseToggle}
            className={`py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
              isPaused
                ? 'bg-[#22B573] text-white hover:bg-emerald-600'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isPaused ? 'Resume All' : 'Pause All Sharing'}</span>
          </button>

          <button
            onClick={() => router.push('/privacy')}
            className="py-3 px-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-[#10243E] dark:text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Lock className="w-4 h-4 text-[#087CF5]" />
            <span>Privacy Center</span>
          </button>

          <button
            onClick={() => router.push('/settings')}
            className="py-3 px-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-[#10243E] dark:text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Sliders className="w-4 h-4 text-[#087CF5]" />
            <span>Permissions</span>
          </button>

          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="py-3 px-4 rounded-2xl bg-[#087CF5] hover:bg-[#168DFF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Member Privacy Safeguard Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-1">
        <p className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
          FamilyLink Guardian guarantees no stealth access.
        </p>
        <button
          onClick={() => {
            if (confirm('Disconnect this device from Guardian Aryan? This will revoke all sharing.')) {
              alert('Guardian access disconnected.');
            }
          }}
          className="text-xs font-bold text-[#EF4444] hover:underline"
        >
          Disconnect Guardian & Revoke Key
        </button>
      </div>
    </div>
  );
}
