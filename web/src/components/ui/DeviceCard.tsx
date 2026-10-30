import React from 'react';
import { MemberAvatar } from './MemberAvatar';
import { StatusBadge } from './StatusBadge';
import { BatteryIndicator } from './BatteryIndicator';
import { NetworkIndicator } from './NetworkIndicator';

export interface DeviceData {
  id: string;
  name: string;
  memberName: string;
  isThisDevice?: boolean;
  isOnline: boolean;
  lastSeen: string;
  battery: number;
  isCharging?: boolean;
  networkType?: '5G' | '4G' | 'LTE' | 'WIFI' | 'OFFLINE';
  locationName?: string;
  distance?: string;
  activeFeature?: string;
}

interface DeviceCardProps {
  device: DeviceData;
  isSelected?: boolean;
  onClick?: () => void;
  onLocate?: () => void;
  className?: string;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  isSelected = false,
  onClick,
  onLocate,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      className={`group relative w-full p-4 rounded-2xl transition-all duration-200 cursor-pointer text-left border ${
        isSelected
          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#087CF5] shadow-md shadow-blue-500/10 ring-1 ring-[#087CF5]'
          : 'bg-white dark:bg-[#0D2035] border-[#E4EAF2] dark:border-[#1E3A5A] hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-3.5 min-w-0">
          <MemberAvatar
            name={device.memberName || device.name}
            isOnline={device.isOnline}
            size="md"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-[#10243E] dark:text-[#F0F4F8] truncate">
                {device.name}
              </h4>
              {device.isThisDevice && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-[#087CF5] dark:bg-blue-900/60 dark:text-blue-300">
                  This device
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  device.isOnline ? 'bg-[#22B573]' : 'bg-slate-400'
                }`}
              />
              <span className="truncate">
                {device.isOnline ? 'Online' : 'Offline'} • {device.lastSeen}
              </span>
            </div>

            {device.locationName && (
              <p className="text-[11px] text-[#087CF5] dark:text-[#53B9FF] truncate mt-1 flex items-center gap-1">
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {device.locationName}
                {device.distance && (
                  <span className="text-[#718096] dark:text-[#94A3B8]">
                    ({device.distance})
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Right: Battery & Network */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <BatteryIndicator
            level={device.battery}
            isCharging={device.isCharging}
            showText
          />
          {device.networkType && (
            <NetworkIndicator type={device.networkType} showLabel={false} />
          )}
        </div>
      </div>

      {/* Quick Action row on hover / select */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
          {device.activeFeature ? (
            <span className="text-[#087CF5] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#087CF5] animate-ping" />
              {device.activeFeature}
            </span>
          ) : (
            'Tap for details'
          )}
        </span>

        <div className="flex items-center gap-1">
          {onLocate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLocate();
              }}
              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-[#087CF5] rounded-md transition-colors"
              title="Locate on map"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            </button>
          )}

          <svg
            className="w-4 h-4 text-slate-400 group-hover:text-[#087CF5] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
