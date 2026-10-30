'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mockMessages } from '@/lib/mockData';
import { useFleetDevices } from '@/lib/useFleetDevices';
import { MemberAvatar } from '@/components/ui/MemberAvatar';
import {
  ArrowLeft,
  MessageSquare,
  Shield,
  MessageCircle,
  Clock,
  CheckCheck,
} from 'lucide-react';

export default function MessagesPage() {
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

  const [activeTab, setActiveTab] = useState<'sms' | 'integrations'>('sms');

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
              <MessageSquare className="w-5 h-5 text-[#087CF5]" />
              Messages & Notifications ({device.name})
            </h2>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
              Authorized family communications and notification feeds
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: SMS | Authorized Integrations */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0D2035] rounded-2xl border border-[#E4EAF2] dark:border-[#1E3A5A] w-fit">
        <button
          onClick={() => setActiveTab('sms')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'sms'
              ? 'bg-[#087CF5] text-white shadow-sm'
              : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#10243E]'
          }`}
        >
          SMS & Emergency Broadcasts
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'integrations'
              ? 'bg-[#087CF5] text-white shadow-sm'
              : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#10243E]'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 text-green-500" />
          <span>Authorized Integrations</span>
        </button>
      </div>

      {/* Message List */}
      <div className="space-y-3">
        {activeTab === 'sms' ? (
          mockMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <MemberAvatar name={msg.sender} isOnline size="md" />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#10243E] dark:text-white truncate">
                      {msg.sender}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#087CF5] dark:bg-blue-950">
                      {msg.channel}
                    </span>
                  </div>
                  <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-1 line-clamp-1">
                    {msg.preview}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-xs text-[#718096] dark:text-[#94A3B8]">
                  {msg.timestamp}
                </span>
                {msg.unread > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-[#087CF5] text-white text-[11px] font-bold flex items-center justify-center">
                    {msg.unread}
                  </span>
                ) : (
                  <CheckCheck className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 dark:bg-green-950/60 flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#10243E] dark:text-white">
                Official Messaging Integration Framework
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8] max-w-md mx-auto mt-1">
                FamilyLink Guardian integrates via Android Notification Listener Service. WhatsApp private databases are never scraped or bypassed, ensuring strict compliance with Google Play Developer policies.
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#071321] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-left max-w-md mx-auto space-y-1">
              <div className="flex justify-between">
                <span className="text-[#718096]">Listener Status:</span>
                <span className="text-[#22B573] font-bold">Active & Bound</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Data Captured:</span>
                <span className="font-semibold text-[#10243E] dark:text-white">Notification Sender & Summary</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compliance Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-800 text-xs text-[#718096] dark:text-[#94A3B8] flex items-center gap-3">
        <Shield className="w-5 h-5 text-[#087CF5] flex-shrink-0" />
        <span>
          <strong>Anti-Surveillance Guarantee:</strong> No WhatsApp database extraction, keylogging, or covert message harvesting. All integrations are transparently documented in the member device audit logs.
        </span>
      </div>
    </div>
  );
}
