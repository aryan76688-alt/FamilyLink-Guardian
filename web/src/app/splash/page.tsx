'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, MapPin, Users, ArrowRight, Smartphone, Lock } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#062B52] via-[#073666] to-[#087CF5] flex flex-col justify-between p-6 sm:p-10 text-white overflow-hidden">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#53B9FF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#087CF5]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Branding */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium">
          <Shield className="w-3.5 h-3.5 text-[#53B9FF]" />
          <span>v2.4 Transparent Protection</span>
        </div>

        <Link
          href="/login"
          className="text-xs font-semibold text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Center Brand Identity */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto py-8">
        {/* Shield + Family + Location Pin Logo */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#087CF5] to-[#53B9FF] p-[3px] shadow-2xl shadow-blue-500/40 animate-pulse duration-1000">
            <div className="w-full h-full bg-[#062B52] rounded-[21px] flex items-center justify-center relative overflow-hidden">
              <svg
                className="w-14 h-14 sm:w-16 sm:h-16 text-[#53B9FF]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="10" r="2.5" fill="#087CF5" stroke="#FFFFFF" strokeWidth="1" />
                <path d="M9 16c0-1.8 1.3-3 3-3s3 1.2 3 3" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#22B573] border-2 border-[#062B52] flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          FamilyLink <span className="text-[#53B9FF]">Guardian</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base font-medium text-blue-100 tracking-wide max-w-xs">
          Stay Connected • Stay Safe
        </p>

        {/* Value Prop Badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium border border-white/15">
            <Lock className="w-3 h-3 text-[#53B9FF]" /> Consent-First Safety
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium border border-white/15">
            <Users className="w-3 h-3 text-[#22B573]" /> Real-time Family Fleet
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium border border-white/15">
            <Smartphone className="w-3 h-3 text-amber-300" /> Offline Sync
          </span>
        </div>
      </div>

      {/* Bottom Family Card Preview & Get Started */}
      <div className="relative z-10 w-full max-w-md mx-auto space-y-4">
        {/* Family Illustration / Preview Card */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-xs font-bold">
                A
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-white flex items-center justify-center text-xs font-bold">
                M
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-xs font-bold">
                D
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">4 Family Devices Active</h4>
              <p className="text-[11px] text-blue-200">Protected & Encrypted</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#22B573] animate-ping" />
        </div>

        {/* Primary Action Button */}
        <Link
          href="/dashboard"
          className="group w-full py-4 px-6 rounded-2xl bg-white hover:bg-blue-50 text-[#062B52] font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 text-[#087CF5] group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="text-center text-[11px] text-blue-200/80">
          Transparent family safety with member consent controls.
        </p>
      </div>
    </div>
  );
}
