'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mockCallHistory } from '@/lib/mockData';
import { useFleetDevices } from '@/lib/useFleetDevices';
import {
  ArrowLeft,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  Shield,
  Filter,
} from 'lucide-react';

export default function CallHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const deviceId = (params?.id as string) || '2';
  const { devices } = useFleetDevices();
  const device = devices.find((d) => d.id === deviceId) || devices[0] || {
    id: deviceId,
    name: 'Android Mobile Device',
    memberName: 'Family Member',
    isOnline: true,
    lastSeen: 'Live GPS',
    battery: 100,
    networkType: '5G' as const,
  };

  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing' | 'missed'>('all');

  const filtered = mockCallHistory.filter((c) => {
    if (filter === 'all') return true;
    return c.type === filter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-[#10243E] dark:text-white hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-[#10243E] dark:text-white tracking-tight flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#087CF5]" />
              Call History ({device.name})
            </h2>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
              Legitimate call metadata reported via Android CallLog Provider
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0D2035] rounded-2xl border border-[#E4EAF2] dark:border-[#1E3A5A] w-fit">
        {(['all', 'incoming', 'outgoing', 'missed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? 'bg-[#087CF5] text-white shadow-sm'
                : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#10243E]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Call History Cards */}
      <div className="space-y-3">
        {filtered.map((call) => {
          const isIncoming = call.type === 'incoming';
          const isOutgoing = call.type === 'outgoing';
          const isMissed = call.type === 'missed';

          return (
            <div
              key={call.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isMissed
                      ? 'bg-red-50 text-[#EF4444] dark:bg-red-950/60'
                      : isIncoming
                      ? 'bg-emerald-50 text-[#22B573] dark:bg-emerald-950/60'
                      : 'bg-blue-50 text-[#087CF5] dark:bg-blue-950/60'
                  }`}
                >
                  {isMissed ? (
                    <PhoneMissed className="w-5 h-5" />
                  ) : isIncoming ? (
                    <PhoneIncoming className="w-5 h-5" />
                  ) : (
                    <PhoneOutgoing className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#10243E] dark:text-white">
                    {call.contact}
                  </h4>
                  <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                    {call.number} • <span className="capitalize">{call.type} Call</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-[#10243E] dark:text-white block">
                  {call.time}
                </span>
                <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] flex items-center justify-end gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {call.duration}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Metadata Transparency Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-800 text-xs text-[#718096] dark:text-[#94A3B8] flex items-center gap-3">
        <Shield className="w-5 h-5 text-[#087CF5] flex-shrink-0" />
        <span>
          <strong>Privacy Compliance:</strong> Only authorized metadata (timestamps, contact representation, duration) is captured. FamilyLink Guardian strictly never intercepts, tampers with, or records audio from phone conversations.
        </span>
      </div>
    </div>
  );
}
