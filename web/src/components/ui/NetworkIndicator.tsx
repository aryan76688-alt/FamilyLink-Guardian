import React from 'react';

interface NetworkIndicatorProps {
  type?: '5G' | '4G' | 'LTE' | 'WIFI' | 'OFFLINE';
  bars?: number; // 1-4
  showLabel?: boolean;
  className?: string;
}

export const NetworkIndicator: React.FC<NetworkIndicatorProps> = ({
  type = 'WIFI',
  bars = 4,
  showLabel = true,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 text-xs text-[#718096] dark:text-[#94A3B8] ${className}`}>
      {type === 'WIFI' ? (
        <svg
          className="w-3.5 h-3.5 text-[#087CF5]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      ) : (
        <div className="flex items-end gap-[1.5px] h-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-[2.5px] rounded-xs ${
                i <= bars
                  ? 'bg-[#087CF5]'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
              style={{ height: `${i * 25}%` }}
            />
          ))}
        </div>
      )}

      {showLabel && (
        <span className="font-medium text-[11px]">
          {type === 'WIFI' ? 'Wi-Fi' : type}
        </span>
      )}
    </div>
  );
};
