'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { initialDevices } from '@/lib/mockData';
import { MemberAvatar } from '@/components/ui/MemberAvatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BatteryIndicator } from '@/components/ui/BatteryIndicator';
import { NetworkIndicator } from '@/components/ui/NetworkIndicator';
import {
  ArrowLeft,
  MapPin,
  Camera,
  Share2,
  Mic,
  PhoneCall,
  MessageSquare,
  MessageCircle,
  HardDrive,
  Shield,
  Key,
  RefreshCw,
  FolderLock,
  ChevronRight,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export default function DeviceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const deviceId = (params?.id as string) || '1';

  const device =
    initialDevices.find((d) => d.id === deviceId) || initialDevices[1];

  const [activeSession, setActiveSession] = useState<string | null>(null);

  const featureGrid = [
    {
      title: 'Location',
      desc: 'Fused GPS tracking',
      icon: <MapPin className="w-5 h-5 text-[#087CF5]" />,
      action: () => router.push(`/map?device=${device.id}`),
      status: 'Active (30m interval)',
      active: true,
    },
    {
      title: 'Camera',
      desc: 'Consent-based video',
      icon: <Camera className="w-5 h-5 text-indigo-500" />,
      action: () => router.push(`/devices/${device.id}/camera`),
      status: 'Consent Required',
      active: false,
    },
    {
      title: 'Screen Share',
      desc: 'MediaProjection prompt',
      icon: <Share2 className="w-5 h-5 text-sky-500" />,
      action: () => router.push(`/devices/${device.id}/screen`),
      status: 'Consent Required',
      active: false,
    },
    {
      title: 'Microphone',
      desc: 'Push-to-talk voice',
      icon: <Mic className="w-5 h-5 text-emerald-500" />,
      action: () => {
        alert(
          'Microphone voice session requested. A visible consent notification has been sent to the member.'
        );
      },
      status: 'Consent Required',
      active: false,
    },
    {
      title: 'Call History',
      desc: 'Permitted metadata only',
      icon: <PhoneCall className="w-5 h-5 text-blue-500" />,
      action: () => router.push(`/devices/${device.id}/calls`),
      status: '4 recent calls',
      active: true,
    },
    {
      title: 'Messages',
      desc: 'Official SMS integration',
      icon: <MessageSquare className="w-5 h-5 text-violet-500" />,
      action: () => router.push(`/devices/${device.id}/messages`),
      status: 'Synchronized',
      active: true,
    },
    {
      title: 'WhatsApp Info',
      desc: 'Supported notification API',
      icon: <MessageCircle className="w-5 h-5 text-green-500" />,
      action: () => {
        alert(
          'WhatsApp Status: Official Android Notification Listener Metadata. Direct database scraping is strictly prohibited for user privacy.'
        );
      },
      status: 'Notification Metadata',
      active: true,
    },
    {
      title: 'Storage & Drive',
      desc: '10-day retention cache',
      icon: <HardDrive className="w-5 h-5 text-amber-500" />,
      action: () => router.push('/storage'),
      status: '1.2 GB / 10 GB',
      active: true,
    },
  ];

  const sections = [
    {
      icon: <SmartphoneInfoIcon />,
      title: 'Device Hardware & OS',
      subtitle: 'Google Pixel 8 Pro • Android 14 • Keystore Encrypted',
      action: () => alert('Hardware ID: HW-9941849 • Keystore: Hardware backed TEE'),
    },
    {
      icon: <Key className="w-5 h-5 text-[#087CF5]" />,
      title: 'Permissions & System Grants',
      subtitle: 'GPS High Precision granted • Camera/Mic on-demand consent',
      action: () => router.push('/privacy'),
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-[#22B573]" />,
      title: 'Sync & Cloud Backup',
      subtitle: 'Google Drive connected • Last successful sync 2 min ago',
      action: () => router.push('/storage'),
    },
    {
      icon: <FolderLock className="w-5 h-5 text-amber-500" />,
      title: 'Local Room Storage & Retention',
      subtitle: '10 Days local retention • Verified cloud verification required',
      action: () => router.push('/storage'),
    },
    {
      icon: <Shield className="w-5 h-5 text-red-500" />,
      title: 'Privacy & Emergency Revocation',
      subtitle: 'Member can pause at any time • Emergency unlink available',
      action: () => router.push('/security'),
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-[#10243E] dark:text-white hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-[#10243E] dark:text-white tracking-tight">
            Device Details
          </h2>
          <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
            Manage oversight, consent channels, and live telemetry
          </p>
        </div>
      </div>

      {/* Device Identity Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <MemberAvatar
            name={device.memberName}
            isOnline={device.isOnline}
            size="lg"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold text-[#10243E] dark:text-white">
                {device.name}
              </h3>
              <StatusBadge
                status={device.isOnline ? 'online' : 'offline'}
                size="sm"
              />
            </div>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-1">
              Member: <strong className="text-[#10243E] dark:text-white">{device.memberName}</strong> • Last seen {device.lastSeen}
            </p>
            <p className="text-xs text-[#087CF5] mt-0.5">
              Current: {device.locationName}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
          <BatteryIndicator level={device.battery} isCharging={device.isCharging} />
          {device.networkType && (
            <NetworkIndicator type={device.networkType} />
          )}
        </div>
      </div>

      {/* Feature Action Grid (4x2) */}
      <div>
        <h4 className="text-sm font-bold text-[#10243E] dark:text-white mb-3">
          Remote Features & Telemetry
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featureGrid.map((feat) => (
            <div
              key={feat.title}
              onClick={feat.action}
              className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] hover:border-[#087CF5] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-32 group"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#071321] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-colors">
                  {feat.icon}
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    feat.active
                      ? 'bg-emerald-50 text-[#22B573] dark:bg-emerald-950/60'
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                  }`}
                >
                  {feat.status}
                </span>
              </div>

              <div>
                <h5 className="font-bold text-xs text-[#10243E] dark:text-white group-hover:text-[#087CF5] transition-colors">
                  {feat.title}
                </h5>
                <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] truncate mt-0.5">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Information Sections */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-[#10243E] dark:text-white">
          Configuration & Policies
        </h4>

        <div className="bg-white dark:bg-[#0D2035] rounded-3xl border border-[#E4EAF2] dark:border-[#1E3A5A] divide-y divide-slate-100 dark:divide-slate-800/80 shadow-sm overflow-hidden">
          {sections.map((sec, i) => (
            <div
              key={i}
              onClick={sec.action}
              className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#071321]">
                  {sec.icon}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#10243E] dark:text-white">
                    {sec.title}
                  </h5>
                  <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-0.5">
                    {sec.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Sensitive Consent Architecture Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Consent Protection Protocol:</strong> Under official Android standards, starting a camera or screen mirror session requires immediate on-screen approval from the member. No background hidden streaming is supported.
        </div>
      </div>
    </div>
  );
}

function SmartphoneInfoIcon() {
  return (
    <svg className="w-5 h-5 text-[#087CF5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
