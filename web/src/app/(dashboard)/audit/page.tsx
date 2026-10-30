'use client';

import React, { useState } from 'react';
import { mockAuditLogs } from '@/lib/mockData';
import {
  FileText,
  Clock,
  Shield,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function AuditLogPage() {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'info' | 'success' | 'warning'>('all');

  const filtered = mockAuditLogs.filter((log) => {
    if (filterSeverity === 'all') return true;
    return log.severity === filterSeverity;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#10243E] dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#087CF5]" />
            Security & Activity Audit Log
          </h2>
          <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
            Immutable chronological record of sensitive consent events, sessions, and synchronization
          </p>
        </div>

        <button
          onClick={() => alert('Exporting full audit trail as signed CSV...')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#10243E] dark:text-white hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#087CF5]" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0D2035] rounded-2xl border border-[#E4EAF2] dark:border-[#1E3A5A] w-fit">
        {(['all', 'info', 'success', 'warning'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterSeverity(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filterSeverity === tab
                ? 'bg-[#087CF5] text-white shadow-sm'
                : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#10243E]'
            }`}
          >
            {tab === 'all' ? 'All Activities' : tab}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filtered.map((log) => {
          const isSuccess = log.severity === 'success';
          const isWarning = log.severity === 'warning';

          return (
            <div key={log.id} className="relative group">
              <div
                className={`absolute -left-6 top-2 w-5 h-5 rounded-full bg-white dark:bg-[#0D2035] border-2 flex items-center justify-center ${
                  isSuccess
                    ? 'border-[#22B573]'
                    : isWarning
                    ? 'border-[#F4A62A]'
                    : 'border-[#087CF5]'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSuccess
                      ? 'bg-[#22B573]'
                      : isWarning
                      ? 'bg-[#F4A62A]'
                      : 'bg-[#087CF5]'
                  }`}
                />
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#087CF5] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950">
                      {log.time}
                    </span>
                    <h4 className="text-sm font-bold text-[#10243E] dark:text-white">
                      {log.action}
                    </h4>
                  </div>
                  <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                    Actor: <strong className="text-slate-700 dark:text-slate-300">{log.actor}</strong> • Target: {log.device}
                  </p>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      isSuccess
                        ? 'bg-emerald-50 text-[#22B573] dark:bg-emerald-950/60'
                        : isWarning
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60'
                        : 'bg-blue-50 text-[#087CF5] dark:bg-blue-950/60'
                    }`}
                  >
                    {log.result}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Note */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-800 text-xs text-[#718096] dark:text-[#94A3B8] flex items-center gap-3">
        <Shield className="w-5 h-5 text-[#087CF5] flex-shrink-0" />
        <span>
          <strong>Cryptographic Audit Guarantee:</strong> Every remote action records WHO initiated the request, WHAT device was targeted, the TIMESTAMP, and the RESULT. Records cannot be tampered with or deleted unilaterally.
        </span>
      </div>
    </div>
  );
}
