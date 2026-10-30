'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FamilyLogo } from '@/components/ui/FamilyLogo';
import { Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#071321] flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#0D2035] rounded-3xl border border-[#E4EAF2] dark:border-[#1E3A5A] p-8 shadow-xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <FamilyLogo size="lg" showText={false} />
          <h2 className="text-2xl font-bold text-[#10243E] dark:text-white mt-3">
            Create Guardian Account
          </h2>
          <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
            Set up transparent family safety and protect your loved ones
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#10243E] dark:text-[#F0F4F8] mb-1.5">
              Your Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aryan Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#087CF5]/20 focus:border-[#087CF5] outline-none text-[#10243E] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#10243E] dark:text-[#F0F4F8] mb-1.5">
              Family Group Name
            </label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g. Sharma Family Group"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#087CF5]/20 focus:border-[#087CF5] outline-none text-[#10243E] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#10243E] dark:text-[#F0F4F8] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aryan@guardian.local"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#087CF5]/20 focus:border-[#087CF5] outline-none text-[#10243E] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#10243E] dark:text-[#F0F4F8] mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-[#087CF5]/20 focus:border-[#087CF5] outline-none text-[#10243E] dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Create & Onboard Devices</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
            Already have a FamilyLink account?{' '}
            <Link
              href="/login"
              className="font-bold text-[#087CF5] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
