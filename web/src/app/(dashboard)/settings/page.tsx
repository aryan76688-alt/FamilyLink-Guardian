'use client';

import React, { useState } from 'react';
import {
  User,
  Users,
  Smartphone,
  Key,
  Bell,
  Shield,
  Lock,
  MapPin,
  Cloud,
  HardDrive,
  Bot,
  Sun,
  Globe,
  Info,
  ChevronRight,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState('account');
  const [locationInterval, setLocationInterval] = useState('30');
  const [themePreference, setThemePreference] = useState('system');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoDriveBackup, setAutoDriveBackup] = useState(true);

  const sections = [
    { id: 'account', name: 'Account Profile', icon: User },
    { id: 'family', name: 'Family Group', icon: Users },
    { id: 'devices', name: 'Devices & Keystore', icon: Smartphone },
    { id: 'permissions', name: 'System Permissions', icon: Key },
    { id: 'notifications', name: 'Notifications & Alerts', icon: Bell },
    { id: 'privacy', name: 'Privacy Center', icon: Shield },
    { id: 'security', name: 'Security & 2FA', icon: Lock },
    { id: 'maps', name: 'Maps & Geofencing', icon: MapPin },
    { id: 'backup', name: 'Google Drive Backup', icon: Cloud },
    { id: 'storage', name: 'Room DB & 10-Day Retention', icon: HardDrive },
    { id: 'ai', name: 'Gemini AI Assistant', icon: Bot },
    { id: 'appearance', name: 'Appearance & Theme', icon: Sun },
    { id: 'language', name: 'Language & Locale', icon: Globe },
    { id: 'about', name: 'About FamilyLink Guardian', icon: Info },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#10243E] dark:text-white tracking-tight">
          System Preferences & Configuration
        </h2>
        <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
          Configure security policies, update frequency, and cloud integrations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Navigation Menu (4 Cols) */}
        <div className="md:col-span-4 bg-white dark:bg-[#0D2035] rounded-3xl border border-[#E4EAF2] dark:border-[#1E3A5A] p-3 shadow-md h-fit space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#087CF5] font-bold shadow-xs'
                    : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#10243E] hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{sec.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            );
          })}
        </div>

        {/* Right Settings Configuration Details (8 Cols) */}
        <div className="md:col-span-8 bg-white dark:bg-[#0D2035] rounded-3xl border border-[#E4EAF2] dark:border-[#1E3A5A] p-6 shadow-md space-y-6">
          {/* Section: Account */}
          {selectedSection === 'account' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#10243E] dark:text-white">
                Account Information
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#10243E] dark:text-white mb-1">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Aryan Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#10243E] dark:text-white mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="aryan@guardian.local"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Maps & Geofencing */}
          {selectedSection === 'maps' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#10243E] dark:text-white">
                Location Update Frequency
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                Adjust battery-aware GPS polling rate across all authorized family members.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {['5', '10', '15', '30', '60'].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setLocationInterval(mins)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      locationInterval === mins
                        ? 'bg-[#087CF5] text-white border-[#087CF5] shadow-sm'
                        : 'bg-slate-50 dark:bg-[#071321] text-[#718096] dark:text-[#94A3B8] border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mins} min{mins === '30' ? ' (Default)' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Backup & Storage */}
          {(selectedSection === 'backup' || selectedSection === 'storage') && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#10243E] dark:text-white">
                Cloud Backup & 10-Day Retention
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="block text-[#10243E] dark:text-white">
                      Google Drive Auto-Sync
                    </strong>
                    <span className="text-[#718096]">
                      Uploads encrypted media to FamilyLink Guardian/
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoDriveBackup}
                    onChange={() => setAutoDriveBackup(!autoDriveBackup)}
                    className="w-4 h-4 rounded accent-[#087CF5]"
                  />
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[#718096]">Local Cache Retention:</span>
                  <strong className="text-[#10243E] dark:text-white font-mono">
                    10 Days (Safe Cloud Verified)
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Section: AI Assistant */}
          {selectedSection === 'ai' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#10243E] dark:text-white">
                Google Gemini AI Integration
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                Allows natural language summaries and battery health interpretations.
              </p>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <strong className="block text-[#10243E] dark:text-white">
                    Enable AI Features
                  </strong>
                  <span className="text-[#718096]">
                    Sensitive telemetry is redacted before Gemini prompt dispatch
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={() => setAiEnabled(!aiEnabled)}
                  className="w-4 h-4 rounded accent-[#087CF5]"
                />
              </div>
            </div>
          )}

          {/* Section: Appearance */}
          {selectedSection === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#10243E] dark:text-white">
                Theme & Interface Appearance
              </h3>
              <div className="grid grid-cols-3 gap-3 pt-1">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setThemePreference(t);
                      if (t === 'dark') document.documentElement.classList.add('dark');
                      else document.documentElement.classList.remove('dark');
                    }}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold capitalize border transition-all ${
                      themePreference === t
                        ? 'bg-[#087CF5] text-white border-[#087CF5] shadow-sm'
                        : 'bg-slate-50 dark:bg-[#071321] text-[#718096] border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t} Mode
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: About */}
          {selectedSection === 'about' && (
            <div className="space-y-3 text-xs text-[#718096] dark:text-[#94A3B8]">
              <h3 className="text-base font-bold text-[#10243E] dark:text-white">
                FamilyLink Guardian v2.4.0
              </h3>
              <p>
                A modern consent-based family safety and device management platform designed to protect loved ones without compromising their autonomy or privacy.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span>Backend Platform:</span>
                  <strong className="text-[#10243E] dark:text-white">Railway Cloud NestJS + PostgreSQL 15</strong>
                </div>
                <div className="flex justify-between">
                  <span>Android Client:</span>
                  <strong className="text-[#10243E] dark:text-white">Jetpack Compose Material 3</strong>
                </div>
                <div className="flex justify-between">
                  <span>AI Architecture:</span>
                  <strong className="text-[#10243E] dark:text-white">Google Gemini 1.5 Flash via Secure Railway API</strong>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => alert('Settings saved successfully!')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
