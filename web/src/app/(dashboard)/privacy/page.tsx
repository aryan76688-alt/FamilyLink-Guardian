'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PermissionCard, PermissionItem } from '@/components/ui/PermissionCard';
import {
  ShieldCheck,
  MapPin,
  Camera,
  Mic,
  Share2,
  Cloud,
  FileText,
  Lock,
  Trash2,
  Download,
  AlertTriangle,
} from 'lucide-react';

export default function PrivacyCenterPage() {
  const router = useRouter();

  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: 'loc',
      name: 'Location Sharing',
      description: 'Reports latitude, longitude, and accuracy circle to the guardian map.',
      status: 'allowed',
      requiredFor: 'Safety Perimeter & Geofences',
      icon: <MapPin className="w-5 h-5 text-[#087CF5]" />,
    },
    {
      id: 'cam',
      name: 'Remote Camera Access',
      description: 'Stream on-demand video. A system chime and notification must prompt the member.',
      status: 'consent_required',
      requiredFor: 'Live Emergency Video',
      icon: <Camera className="w-5 h-5 text-indigo-500" />,
    },
    {
      id: 'mic',
      name: 'Microphone & Audio',
      description: 'Push-to-talk voice session. Strictly active only during authorized communication.',
      status: 'consent_required',
      requiredFor: 'Voice Sessions & Walkie-Talkie',
      icon: <Mic className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: 'scr',
      name: 'Screen Projection',
      description: 'Streams phone screen using Android MediaProjection tokens with member prompt.',
      status: 'consent_required',
      requiredFor: 'Remote Tech Assistance',
      icon: <Share2 className="w-5 h-5 text-sky-500" />,
    },
    {
      id: 'bak',
      name: 'Google Drive Cloud Backup',
      description: 'Backs up encrypted emergency media to your personal Google Drive folder.',
      status: 'allowed',
      requiredFor: 'Transparent Storage Vault',
      icon: <Cloud className="w-5 h-5 text-blue-500" />,
    },
  ]);

  const handleToggle = (id: string, enable: boolean) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: enable ? 'allowed' : 'paused',
            }
          : p
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#10243E] dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#087CF5]" />
            Privacy Center & Consent Governance
          </h2>
          <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
            Clear visibility into what data is collected, who has access, and member controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/audit')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#10243E] dark:text-white hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#087CF5]" />
            <span>Audit Log</span>
          </button>
          <button
            onClick={() => alert('Data export initiated: Generating encrypted JSON package of all locations and audit events.')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Permission Cards Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#10243E] dark:text-white">
          Active Sensitive Capabilities
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {permissions.map((perm) => (
            <PermissionCard
              key={perm.id}
              permission={perm}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>

      {/* Member Autonomy Rights Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-md space-y-4">
        <h3 className="text-sm font-bold text-[#10243E] dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#087CF5]" />
          <span>Member Rights & Data Deletion Controls</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-100 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-xs text-[#10243E] dark:text-white">
              Pause All Sharing
            </h4>
            <p className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
              Temporarily stops GPS beacons, telemetry updates, and session requests.
            </p>
            <button
              onClick={() => alert('All family telemetry paused.')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors"
            >
              Pause All Beacons
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-100 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-xs text-[#EF4444]">
              Disconnect & Purge Local Data
            </h4>
            <p className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
              Removes the cryptographic keypair from Keystore and clears local Room DB.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to purge local cache?')) {
                  alert('Local cache wiped.');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-red-100 text-[#EF4444] dark:bg-red-950/60 font-bold text-xs hover:bg-red-200 transition-colors"
            >
              Delete Local Cache
            </button>
          </div>
        </div>
      </div>

      {/* Transparency Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-[#22B573] flex-shrink-0" />
        <span>
          <strong>Zero Surveillance Principle:</strong> FamilyLink Guardian is engineered solely for family peace of mind with full mutual transparency. We never sell personal location data or maintain secret device channels.
        </span>
      </div>
    </div>
  );
}
