import React from 'react';

interface SegmentOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  activeId,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex p-1 bg-slate-100 dark:bg-[#071321] rounded-2xl border border-slate-200 dark:border-[#1E3A5A] ${className}`}
    >
      {options.map((option) => {
        const isActive = option.id === activeId;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-white dark:bg-[#0D2035] text-[#087CF5] shadow-sm border border-slate-200/60 dark:border-[#1E3A5A]'
                : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#10243E] dark:hover:text-white'
            }`}
          >
            {option.icon && <span className="w-4 h-4">{option.icon}</span>}
            <span>{option.label}</span>
            {option.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive
                    ? 'bg-blue-100 text-[#087CF5] dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
