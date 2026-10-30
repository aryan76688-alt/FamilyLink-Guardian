'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FamilyLogo } from './FamilyLogo';
import {
  LayoutDashboard,
  MapPin,
  Smartphone,
  History,
  Camera,
  PhoneCall,
  HardDrive,
  Bot,
  ShieldCheck,
  Lock,
  FileText,
  Settings,
  Compass,
  Users,
} from 'lucide-react';

interface SideNavigationProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  collapsed = false,
  className = '',
}) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Map', href: '/map', icon: MapPin },
    { label: 'Command Center', href: '/command-center', icon: Compass },
    { label: 'Devices', href: '/dashboard', icon: Smartphone },
    { label: 'Location History', href: '/history', icon: History },
    { label: 'Camera & Media', href: '/devices/1/camera', icon: Camera },
    { label: 'Calls & Messages', href: '/devices/1/calls', icon: PhoneCall },
    { label: 'Backups & Storage', href: '/storage', icon: HardDrive },
    { label: 'AI Assistant', href: '/ai', icon: Bot },
    { label: 'Privacy Center', href: '/privacy', icon: ShieldCheck },
    { label: 'Security Center', href: '/security', icon: Lock },
    { label: 'Activity Log', href: '/audit', icon: FileText },
    { label: 'Member App Mode', href: '/member', icon: Users, special: true },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-white dark:bg-[#071321] border-r border-[#E4EAF2] dark:border-[#1E3A5A] flex flex-col justify-between transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      {/* Top Brand Logo */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center">
          <FamilyLogo size="sm" showText={!collapsed} />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#087CF5] font-bold shadow-xs'
                  : item.special
                  ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                  : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#10243E] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-[#087CF5]' : ''
                }`}
              />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.special && (
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  Member
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Profile */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#087CF5] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
          AS
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-[#10243E] dark:text-[#F0F4F8] truncate">
              Aryan (Guardian)
            </h5>
            <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] truncate">
              aryan@guardian.local
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
