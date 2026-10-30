import React from 'react';

export type StatusType =
  | 'online'
  | 'offline'
  | 'paused'
  | 'consent_required'
  | 'active'
  | 'pending'
  | 'warning'
  | 'syncing';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  pulse = false,
  size = 'md',
}) => {
  const configs: Record<
    StatusType,
    { text: string; dotClass: string; containerClass: string }
  > = {
    online: {
      text: label || 'Online',
      dotClass: 'bg-[#22B573]',
      containerClass:
        'bg-[#22B573]/10 text-[#15803d] dark:text-[#4ade80] border-[#22B573]/25',
    },
    offline: {
      text: label || 'Offline',
      dotClass: 'bg-[#718096]',
      containerClass:
        'bg-slate-100 dark:bg-slate-800 text-[#718096] dark:text-[#94A3B8] border-slate-200 dark:border-slate-700',
    },
    active: {
      text: label || 'Active',
      dotClass: 'bg-[#087CF5]',
      containerClass:
        'bg-[#087CF5]/10 text-[#087CF5] dark:text-[#53B9FF] border-[#087CF5]/25',
    },
    paused: {
      text: label || 'Paused',
      dotClass: 'bg-[#F4A62A]',
      containerClass:
        'bg-[#F4A62A]/10 text-[#b45309] dark:text-[#fbbf24] border-[#F4A62A]/25',
    },
    consent_required: {
      text: label || 'Consent Required',
      dotClass: 'bg-[#F4A62A]',
      containerClass:
        'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    },
    warning: {
      text: label || 'Alert',
      dotClass: 'bg-[#EF4444]',
      containerClass:
        'bg-[#EF4444]/10 text-[#b91c1c] dark:text-[#f87171] border-[#EF4444]/25',
    },
    pending: {
      text: label || 'Pending Pair',
      dotClass: 'bg-blue-400',
      containerClass:
        'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    },
    syncing: {
      text: label || 'Syncing...',
      dotClass: 'bg-[#087CF5]',
      containerClass:
        'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    },
  };

  const current = configs[status];
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] gap-1.5'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${sizeClasses} ${current.containerClass}`}
    >
      <span className="relative flex h-2 w-2">
        {(pulse || status === 'online' || status === 'active') && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dotClass}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${current.dotClass}`}
        />
      </span>
      <span>{current.text}</span>
    </span>
  );
};
