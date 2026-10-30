'use client';

import React, { useState } from 'react';
import { StorageGauge } from '@/components/ui/StorageGauge';
import { mockStorageCategories } from '@/lib/mockData';
import {
  HardDrive,
  Cloud,
  RefreshCw,
  FolderLock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Folder,
} from 'lucide-react';

export default function StorageBackupPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [retentionDays] = useState(10);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Local Room database synced and Google Drive checksums verified via SHA-256.');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#10243E] dark:text-white tracking-tight flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-[#087CF5]" />
            Storage & Cloud Backup
          </h2>
          <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
            Transparent user Google Drive backup and local Room DB retention
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Verifying Uploads...' : 'Sync Now'}</span>
          </button>
          <button
            onClick={() => alert('Storage Management: Cache clean-up policy set to 10 days.')}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-[#10243E] dark:text-white font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Manage Storage
          </button>
        </div>
      </div>

      {/* Storage Gauge Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-md flex flex-col items-center">
        <h3 className="text-sm font-bold text-[#10243E] dark:text-white mb-6">
          Fleet Device Storage Utilization
        </h3>
        <StorageGauge
          usedGB={1.2}
          totalGB={10}
          categories={mockStorageCategories}
          className="w-full max-w-lg"
        />
      </div>

      {/* Google Drive Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#087CF5] flex items-center justify-center flex-shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-[#10243E] dark:text-white">
                  Google Drive Backup
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#22B573] dark:bg-emerald-950/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </span>
              </div>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
                Target Folder: <span className="font-mono text-[#087CF5]">FamilyLink Guardian/Members/</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => window.open('https://drive.google.com', '_blank')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#10243E] dark:text-white font-semibold text-xs transition-colors self-start sm:self-auto"
          >
            <span>View in Drive</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#087CF5]" />
          </button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
              Auto Backup Status
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-bold text-[#10243E] dark:text-white">
                {autoBackup ? 'Enabled' : 'Disabled'}
              </span>
              <input
                type="checkbox"
                checked={autoBackup}
                onChange={() => setAutoBackup(!autoBackup)}
                className="rounded accent-[#087CF5] w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
              Last Backup Sync
            </span>
            <span className="text-xs font-bold text-[#10243E] dark:text-white block mt-1">
              5 min ago (Verified)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] block">
              Backup Architecture
            </span>
            <span className="text-xs font-bold text-[#087CF5] block mt-1">
              User Visible Drive Folder
            </span>
          </div>
        </div>
      </div>

      {/* Local Retention Policy Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-md space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#F4A62A] flex items-center justify-center flex-shrink-0">
            <FolderLock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#10243E] dark:text-white">
              Local Storage Retention Policy: {retentionDays} Days
            </h4>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
              Auto delete local temporary files after successful backup and retention period.
            </p>
          </div>
        </div>

        {/* Critical Safety Notice */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-[#062B52] dark:text-blue-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#087CF5] flex-shrink-0 mt-0.5" />
          <span>
            <strong>Zero Data Loss Guarantee:</strong> Never delete a local file before cloud upload verification. Local cache files remain in Room encrypted storage until the background worker verifies the remote SHA-256 checksum in Google Drive.
          </span>
        </div>
      </div>
    </div>
  );
}
