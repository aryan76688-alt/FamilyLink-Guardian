import React from 'react';

interface StorageCategory {
  name: string;
  size: string;
  percent: number;
  color: string;
}

interface StorageGaugeProps {
  usedGB: number;
  totalGB: number;
  categories: StorageCategory[];
  className?: string;
}

export const StorageGauge: React.FC<StorageGaugeProps> = ({
  usedGB,
  totalGB,
  categories,
  className = '',
}) => {
  const percentage = Math.round((usedGB / totalGB) * 100);
  const strokeWidth = 14;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Circular Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
          {/* Background Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            className="text-slate-100 dark:text-slate-800"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Indicator */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            className="text-[#087CF5] transition-all duration-1000 ease-out"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-[#10243E] dark:text-white tracking-tight">
            {usedGB.toFixed(1)} GB
          </span>
          <span className="text-xs font-medium text-[#718096] dark:text-[#94A3B8]">
            of {totalGB} GB used
          </span>
          <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#087CF5] dark:bg-blue-950 dark:text-blue-300">
            {percentage}% Full
          </span>
        </div>
      </div>

      {/* Category Breakdown Bar */}
      <div className="w-full mt-6 space-y-3">
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`${cat.color} h-full transition-all`}
              style={{ width: `${cat.percent}%` }}
              title={`${cat.name}: ${cat.size}`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
              <div className="flex flex-col">
                <span className="font-medium text-[#10243E] dark:text-[#F0F4F8]">
                  {cat.name}
                </span>
                <span className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                  {cat.size}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
