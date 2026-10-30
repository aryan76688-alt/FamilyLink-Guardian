import React from 'react';

interface BatteryIndicatorProps {
  level: number;
  isCharging?: boolean;
  showText?: boolean;
  className?: string;
}

export const BatteryIndicator: React.FC<BatteryIndicatorProps> = ({
  level,
  isCharging = false,
  showText = true,
  className = '',
}) => {
  const clampedLevel = Math.max(0, Math.min(100, level));

  let colorClass = 'bg-[#22B573]';
  let textClass = 'text-[#22B573]';

  if (clampedLevel <= 20) {
    colorClass = 'bg-[#EF4444]';
    textClass = 'text-[#EF4444]';
  } else if (clampedLevel <= 40) {
    colorClass = 'bg-[#F4A62A]';
    textClass = 'text-[#F4A62A]';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="relative w-6 h-3.5 border border-slate-300 dark:border-slate-600 rounded-sm p-[1px] flex items-center">
        {/* Fill level */}
        <div
          className={`h-full rounded-[1px] transition-all duration-300 ${colorClass}`}
          style={{ width: `${clampedLevel}%` }}
        />
        {/* Terminal nub */}
        <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1.5 bg-slate-400 dark:bg-slate-500 rounded-r-xs" />

        {isCharging && (
          <svg
            className="absolute inset-0 m-auto w-2.5 h-2.5 text-white drop-shadow-sm"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        )}
      </div>

      {showText && (
        <span className={`text-xs font-semibold ${textClass}`}>
          {clampedLevel}%
        </span>
      )}
    </div>
  );
};
