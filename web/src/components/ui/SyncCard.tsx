import React from 'react';
import { StatusBadge } from './StatusBadge';

interface SyncCardProps {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string;
  queuedItems: number;
  googleDriveConnected: boolean;
  retentionDays?: number;
  onSyncNow?: () => void;
  className?: string;
}

export const SyncCard: React.FC<SyncCardProps> = ({
  isOnline,
  isSyncing,
  lastSyncTime,
  queuedItems,
  googleDriveConnected,
  retentionDays = 10,
  onSyncNow,
  className = '',
}) => {
  return (
    <div
      className={`p-5 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#087CF5] flex items-center justify-center">
            <svg
              className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#10243E] dark:text-[#F0F4F8]">
              Offline-First Sync Engine
            </h4>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
              {isOnline ? 'Real-time WebSocket & Drive backup' : 'Operating in offline cache mode'}
            </p>
          </div>
        </div>

        <StatusBadge
          status={isSyncing ? 'syncing' : isOnline ? 'online' : 'offline'}
          label={
            isSyncing
              ? 'Syncing...'
              : isOnline
              ? 'Connected'
              : 'Offline Mode'
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-[#071321] p-3 rounded-xl border border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[#718096] dark:text-[#94A3B8] block text-[11px]">
            Last Synchronized
          </span>
          <span className="font-semibold text-[#10243E] dark:text-[#F0F4F8]">
            {lastSyncTime}
          </span>
        </div>
        <div>
          <span className="text-[#718096] dark:text-[#94A3B8] block text-[11px]">
            Encrypted Queue
          </span>
          <span className="font-semibold text-[#10243E] dark:text-[#F0F4F8]">
            {queuedItems} items pending
          </span>
        </div>
        <div>
          <span className="text-[#718096] dark:text-[#94A3B8] block text-[11px]">
            Google Drive Vault
          </span>
          <span className={`font-semibold ${googleDriveConnected ? 'text-[#22B573]' : 'text-[#EF4444]'}`}>
            {googleDriveConnected ? 'Transparent Backup ON' : 'Disconnected'}
          </span>
        </div>
        <div>
          <span className="text-[#718096] dark:text-[#94A3B8] block text-[11px]">
            Local Retention
          </span>
          <span className="font-semibold text-[#10243E] dark:text-[#F0F4F8]">
            {retentionDays} Days (Protected)
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
          Files pruned only after SHA-256 cloud verification
        </span>
        {onSyncNow && (
          <button
            onClick={onSyncNow}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>
    </div>
  );
};
