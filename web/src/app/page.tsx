'use client';

import React from 'react';
import Link from 'next/link';
import { FamilyLogo } from '@/components/ui/FamilyLogo';
import {
  Shield,
  Smartphone,
  MapPin,
  Camera,
  Share2,
  History,
  PhoneCall,
  MessageSquare,
  HardDrive,
  Bot,
  Lock,
  Compass,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

export default function ShowcaseHubPage() {
  const showcaseScreens = [
    {
      num: 1,
      title: 'Splash Screen',
      desc: 'Gradient hero, brand shield/family logo concept, and Get Started CTA with smooth spring transitions.',
      href: '/splash',
      icon: Shield,
      badge: 'Brand Onboarding',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      num: 2,
      title: 'Login & Authentication',
      desc: 'Email/password form with visibility toggle, OAuth Google & Phone OTP buttons, and validation.',
      href: '/login',
      icon: Lock,
      badge: 'Auth Flow',
      color: 'from-blue-500 to-sky-600',
    },
    {
      num: 3,
      title: 'Guardian Device Dashboard',
      desc: 'Segmented toggle (Devices | Map), dynamic device cards (Aryan, Mom, Dad, Sister, Tablet), battery meters.',
      href: '/dashboard',
      icon: Smartphone,
      badge: 'Fleet Overview',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      num: 4,
      title: 'Live Location Interactive Map',
      desc: 'Full-screen cartographic map, pulsing accuracy circles, route lines, selected device telemetry card.',
      href: '/map',
      icon: MapPin,
      badge: 'Galileo GNSS',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      num: 5,
      title: 'Device Details & Consent',
      desc: 'Device profile, 4x2 sensitive capability action grid, hardware info, and 10-day retention rules.',
      href: '/devices/2',
      icon: Users,
      badge: 'Per-Device Hub',
      color: 'from-indigo-600 to-blue-600',
    },
    {
      num: 6,
      title: 'Live Camera Session',
      desc: 'Rounded video preview, LIVE 00:12 timer overlay, mic/camera controls, and verified consent banner.',
      href: '/devices/2/camera',
      icon: Camera,
      badge: 'WebRTC Low-Latency',
      color: 'from-rose-500 to-red-600',
    },
    {
      num: 7,
      title: 'Screen Mirror',
      desc: 'Device preview canvas, prominent SCREEN SHARING ACTIVE banner, Android MediaProjection disclosure.',
      href: '/devices/1/screen',
      icon: Share2,
      badge: 'MediaProjection',
      color: 'from-sky-500 to-blue-600',
    },
    {
      num: 8,
      title: 'Location History & Playback',
      desc: 'Time tabs (Today, 7D, 30D, Custom), polyline route playback, and chronological stop timeline.',
      href: '/history',
      icon: History,
      badge: 'Trip Timeline',
      color: 'from-amber-500 to-orange-600',
    },
    {
      num: 9,
      title: 'Call History',
      desc: 'Incoming/outgoing/missed filter tabs, contact cards, call duration, and Android CallLog compliance.',
      href: '/devices/2/calls',
      icon: PhoneCall,
      badge: 'Permitted Metadata',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      num: 10,
      title: 'Messages & Notifications',
      desc: 'SMS and authorized integration tabs, contact avatars, message previews, and zero-scraper guarantee.',
      href: '/devices/2/messages',
      icon: MessageSquare,
      badge: 'Official APIs',
      color: 'from-violet-500 to-purple-600',
    },
    {
      num: 11,
      title: 'Storage & Cloud Backup',
      desc: 'Large circular gauge (1.2 GB of 10 GB), categorized breakdown, Google Drive sync, 10-day retention.',
      href: '/storage',
      icon: HardDrive,
      badge: 'Google Drive Sync',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      num: 12,
      title: 'Desktop Live-Map Command Center',
      desc: '3-column responsive layout (Sidebar + Map + Device Inspector + Bottom Telemetry) matching Google Stitch.',
      href: '/command-center',
      icon: Compass,
      badge: 'Google Stitch Flagship',
      color: 'from-cyan-600 to-blue-700',
    },
    {
      num: 13,
      title: 'Member App Experience',
      desc: 'Independent Member UI: persistent notification representation, transparent sharing controls, pause toggle.',
      href: '/member',
      icon: Shield,
      badge: 'Member Autonomy',
      color: 'from-emerald-600 to-green-700',
    },
    {
      num: 14,
      title: 'Privacy Center',
      desc: 'Consent governance cards (Allowed, Active, Paused, Consent Required), data export, local cache purge.',
      href: '/privacy',
      icon: Shield,
      badge: 'Zero Surveillance',
      color: 'from-teal-600 to-emerald-600',
    },
    {
      num: 15,
      title: 'FamilyLink AI Assistant',
      desc: 'Gemini 1.5 Flash assistant with query suggestions, device status summaries, and telemetry triage.',
      href: '/ai',
      icon: Bot,
      badge: 'Gemini Powered',
      color: 'from-blue-600 to-violet-600',
    },
    {
      num: 16,
      title: 'Security Center & Key Management',
      desc: '2FA settings, paired hardware Keystore list, mutual revocation, and security audit integrity.',
      href: '/security',
      icon: Lock,
      badge: 'Keystore Hardware TEE',
      color: 'from-slate-700 to-slate-900',
    },
    {
      num: 17,
      title: 'Activity Audit Log',
      desc: 'Immutable chronological audit trail with actor, target device, timestamp, and verification result.',
      href: '/audit',
      icon: History,
      badge: 'Audit Trail',
      color: 'from-blue-700 to-slate-800',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#071321] text-[#10243E] dark:text-[#F0F4F8]">
      {/* Hero Header */}
      <header className="border-b border-[#E4EAF2] dark:border-[#1E3A5A] bg-white/80 dark:bg-[#0D2035]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <FamilyLogo size="md" />

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Banner */}
      <section className="px-6 py-12 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-[#087CF5]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Google Stitch UI/UX Showcase & Production Full-Stack Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#062B52] dark:text-white tracking-tight max-w-3xl mx-auto">
          FamilyLink <span className="text-[#087CF5]">Guardian</span> Showcase
        </h1>
        <p className="text-sm sm:text-base text-[#718096] dark:text-[#94A3B8] max-w-2xl mx-auto">
          Recreation of all 12 showcase screens from the visual reference as fully responsive, functional UI components with real data models, interactive maps, consent governance, and Android Jetpack Compose code.
        </p>

        {/* Stitch Project Metadata Pill */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-[#10243E] dark:text-white font-mono font-medium">
            Google Stitch Project ID: <strong>13011861436572860769</strong>
          </span>
          <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#0D2035] border border-slate-200 dark:border-slate-700 text-[#10243E] dark:text-white font-mono font-medium">
            Design System: <strong>assets/7180030258661918295</strong>
          </span>
        </div>
      </section>

      {/* Showcase Screen Grid */}
      <main className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {showcaseScreens.map((screen) => {
            const Icon = screen.icon;
            return (
              <Link
                key={screen.num}
                href={screen.href}
                className="group p-5 rounded-3xl bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] hover:border-[#087CF5] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#087CF5]">
                      Screen #{screen.num}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {screen.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${screen.color} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-[#10243E] dark:text-white group-hover:text-[#087CF5] transition-colors">
                      {screen.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#718096] dark:text-[#94A3B8] leading-relaxed">
                    {screen.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#087CF5] group-hover:translate-x-1 transition-transform">
                  <span>Open Interactive UI</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
