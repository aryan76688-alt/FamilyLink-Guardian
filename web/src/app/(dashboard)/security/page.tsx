'use client';

import React, { useState } from 'react';
import { initialDevices } from '@/lib/mockData';
import {
  Lock,
  Key,
  ShieldAlert,
  Smartphone,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  History,
  UserCheck,
} from 'lucide-react';

export default function SecurityCenterPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [devices, setDevices] = useState(initialDevices);
  const [revokedDevices, setRevokedDevices] = useState<string[]>([
    'Old Tablet (Revoked Sept 2026)',
  ]);

  const handleRevoke = (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to permanently revoke ${name}? This will delete the Android Keystore identity and sever all telemetry.`
      )
    ) {
      setDevices(devices.filter((d) => d.id !== id));
      setRevokedDevices([...revokedDevices, `${name} (Revoked just now)`]);
      alert(`${name} has been revoked.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#10243E] dark:text-white tracking-tight flex items-center gap-2">
          <Lock className="w-6 h-6 text-[#087CF5]" />
          Security Center & Key Management
        </h2>
        <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
          Two-factor authentication, cryptographic keypairs, and device access control
        </p>
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#087CF5] flex items-center justify-center flex-shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#10243E] dark:text-white">
                Two-Factor Authentication (2FA)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#22B573] dark:bg-emerald-950/60">
                Active
              </span>
            </div>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
              Requires hardware security key or TOTP authenticator app on Guardian sign-in.
            </p>
          </div>
        </div>

        <button
          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            twoFactorEnabled
              ? 'bg-slate-100 dark:bg-slate-800 text-[#10243E] dark:text-white hover:bg-slate-200'
              : 'bg-[#087CF5] text-white'
          }`}
        >
          {twoFactorEnabled ? 'Configure' : 'Enable 2FA'}
        </button>
      </div>

      {/* Paired Fleet Devices List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#10243E] dark:text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#087CF5]" />
            <span>Authorized Paired Devices ({devices.length})</span>
          </h3>
          <span className="text-xs text-[#718096] dark:text-[#94A3B8]">
            Hardware Keystore Verified
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {devices.map((device) => (
            <div
              key={device.id}
              className="py-3.5 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-bold text-xs text-[#10243E] dark:text-white">
                  {device.name}
                </h4>
                <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-0.5">
                  Member: {device.memberName} • {device.isOnline ? 'Active Online' : 'Offline'}
                </p>
              </div>

              {!device.isThisDevice && (
                <button
                  onClick={() => handleRevoke(device.id, device.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#EF4444] hover:bg-red-100 transition-colors text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke Device</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Revoked Devices History */}
      {revokedDevices.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-md space-y-3">
          <h3 className="text-sm font-bold text-[#10243E] dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#F4A62A]" />
            <span>Revoked Devices History</span>
          </h3>

          <div className="space-y-2">
            {revokedDevices.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-100 dark:border-slate-800 text-xs text-[#718096] dark:text-[#94A3B8] flex items-center justify-between"
              >
                <span>{item}</span>
                <span className="text-[11px] font-bold text-[#EF4444]">Revoked</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Architecture Notice */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-[#062B52] dark:text-blue-300 flex items-center gap-3">
        <UserCheck className="w-5 h-5 text-[#087CF5] flex-shrink-0" />
        <span>
          <strong>Mutual Revocation:</strong> Both the Guardian and the individual Family Member possess independent unilateral revocation privileges. Neither party can lock the other into unauthorized tracking.
        </span>
      </div>
    </div>
  );
}
