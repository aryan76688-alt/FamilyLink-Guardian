import React from 'react';
import { StatusBadge, StatusType } from './StatusBadge';

export interface PermissionItem {
  id: string;
  name: string;
  description: string;
  status: 'allowed' | 'active' | 'paused' | 'consent_required' | 'revoked';
  requiredFor: string;
  icon: React.ReactNode;
}

interface PermissionCardProps {
  permission: PermissionItem;
  onToggle?: (id: string, newStatus: boolean) => void;
  className?: string;
}

export const PermissionCard: React.FC<PermissionCardProps> = ({
  permission,
  onToggle,
  className = '',
}) => {
  const badgeMap: Record<string, { status: StatusType; label: string }> = {
    allowed: { status: 'online', label: 'Allowed' },
    active: { status: 'active', label: 'Active Session' },
    paused: { status: 'paused', label: 'Paused' },
    consent_required: { status: 'consent_required', label: 'Consent Required' },
    revoked: { status: 'offline', label: 'Permission Off' },
  };

  const badge = badgeMap[permission.status] || {
    status: 'offline',
    label: 'Disabled',
  };

  return (
    <div
      className={`p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm flex flex-col justify-between gap-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#087CF5] flex items-center justify-center flex-shrink-0">
            {permission.icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#10243E] dark:text-[#F0F4F8]">
              {permission.name}
            </h4>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5 line-clamp-1">
              {permission.description}
            </p>
          </div>
        </div>

        <StatusBadge status={badge.status} label={badge.label} size="sm" />
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
          Used by: <strong className="font-medium text-slate-700 dark:text-slate-300">{permission.requiredFor}</strong>
        </span>

        {onToggle && (
          <button
            onClick={() => onToggle(permission.id, permission.status !== 'allowed')}
            className="text-[#087CF5] hover:underline font-semibold text-xs"
          >
            {permission.status === 'allowed' ? 'Disable' : 'Manage'}
          </button>
        )}
      </div>
    </div>
  );
};
