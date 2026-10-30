'use client';

import React, { useState } from 'react';
import { SideNavigation } from '@/components/ui/SideNavigation';
import { TopBar } from '@/components/ui/TopBar';
import { BottomNavigation } from '@/components/ui/BottomNavigation';
import { AddDeviceModal } from '@/components/modals/AddDeviceModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F8FC] dark:bg-[#071321] text-[#10243E] dark:text-[#F0F4F8]">
      {/* Desktop / Tablet Sidebar */}
      <SideNavigation className="hidden md:flex flex-shrink-0" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <TopBar onOpenAddDevice={() => setIsAddDeviceOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Add Device Modal Wizard */}
      <AddDeviceModal
        isOpen={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        onSuccess={() => {
          alert('Device paired successfully! Telemetry synchronization initiated.');
        }}
      />
    </div>
  );
}
