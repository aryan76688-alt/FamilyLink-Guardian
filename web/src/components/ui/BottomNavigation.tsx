'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Smartphone, Activity, MoreHorizontal } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Map', href: '/map', icon: MapPin },
    { label: 'Devices', href: '/command-center', icon: Smartphone },
    { label: 'Activity', href: '/audit', icon: Activity },
    { label: 'More', href: '/settings', icon: MoreHorizontal },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#071321]/95 backdrop-blur-lg border-t border-[#E4EAF2] dark:border-[#1E3A5A] px-3 py-2 flex items-center justify-around z-40 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname?.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-[#087CF5] font-bold'
                : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#10243E] dark:hover:text-white'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-blue-50 dark:bg-blue-950/80' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
