'use client';

import React, { useState } from 'react';
import { Search, Bell, PhoneCall, Moon, Sun, Shield, Plus } from 'lucide-react';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  onOpenAddDevice?: () => void;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  onOpenAddDevice,
  className = '',
}) => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header
      className={`h-16 px-6 bg-white/90 dark:bg-[#071321]/90 backdrop-blur-md border-b border-[#E4EAF2] dark:border-[#1E3A5A] flex items-center justify-between sticky top-0 z-20 ${className}`}
    >
      {/* Left: Title or Search */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        {title ? (
          <div>
            <h1 className="text-base font-bold text-[#10243E] dark:text-[#F0F4F8] leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                {subtitle}
              </p>
            )}
          </div>
        ) : null}

        {/* Global Search Bar */}
        <div className="relative flex-1 hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search devices, locations, or backup files..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-[#10243E] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087CF5]/20 focus:border-[#087CF5]"
          />
        </div>
      </div>

      {/* Right Action Icons & Status */}
      <div className="flex items-center gap-3">
        {/* Shield Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#22B573] animate-pulse" />
          <span>All Shields Active • 4 Devices Synced</span>
        </div>

        {/* Add Device Button */}
        {onOpenAddDevice && (
          <button
            onClick={onOpenAddDevice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Member</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
        </button>

        {/* Emergency Call Quick Trigger */}
        <button
          className="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
          title="Quick Emergency Voice Call"
        >
          <PhoneCall className="w-4 h-4" />
        </button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#062B52] border border-[#087CF5] text-[#53B9FF] flex items-center justify-center font-bold text-xs flex-shrink-0 cursor-pointer">
          <Shield className="w-4 h-4 text-[#53B9FF]" />
        </div>
      </div>
    </header>
  );
};
