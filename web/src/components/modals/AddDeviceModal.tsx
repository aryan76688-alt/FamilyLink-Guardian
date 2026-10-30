'use client';

import React, { useState } from 'react';
import { X, QrCode, Shield, CheckCircle2, ArrowRight, Smartphone, RefreshCw, Key } from 'lucide-react';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (device: { name: string; memberName: string }) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(1);
  const [memberName, setMemberName] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [pairingCode] = useState('742-891');
  const [codeExpiry] = useState('04:59');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      onSuccess?.({ name: deviceName || 'Member Phone', memberName: memberName || 'Family Member' });
      onClose();
      setStep(1);
    }
  };

  const stepsTitle = [
    'Member Name',
    'Device Details',
    'Generate Secure Pairing Key',
    'Scan QR Code',
    'Permission Setup',
    'Pair Device',
    'Pairing Complete',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0D2035] border border-[#E4EAF2] dark:border-[#1E3A5A] rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[#087CF5] mb-2">
            <span>Step {step} of 7</span>
            <span className="text-[#718096] dark:text-[#94A3B8]">
              {stepsTitle[step - 1]}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-[#087CF5] h-full transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Contents */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#087CF5] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#10243E] dark:text-white">
                Who will use this device?
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-1">
                Enter the name of the family member you want to connect.
              </p>
            </div>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="e.g. Mom, Maya, Dad, Sister"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-[#087CF5]/20 focus:border-[#087CF5] outline-none"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#087CF5] flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#10243E] dark:text-white">
                Device Nickname
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-1">
                Choose a clear name to identify this device on the map.
              </p>
            </div>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g. Mom Phone, Sister Phone, Tablet"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-[#087CF5]/20 focus:border-[#087CF5] outline-none"
            />
          </div>
        )}

        {(step === 3 || step === 4) && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-44 h-44 bg-white p-3 rounded-2xl border-2 border-dashed border-blue-400 flex flex-col items-center justify-center shadow-inner relative">
              <QrCode className="w-28 h-28 text-[#062B52]" />
              <div className="mt-1 text-[11px] font-mono text-[#087CF5] font-bold">
                CODE: {pairingCode}
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#10243E] dark:text-white">
                Scan with FamilyLink Member
              </h3>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-1">
                Open FamilyLink Member on the phone and point camera or enter pairing code.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-xs font-semibold">
              <Key className="w-3.5 h-3.5" />
              <span>Token expires in {codeExpiry}</span>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#10243E] dark:text-white">
              Member Consent & Permissions
            </h3>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
              The member phone will now prompt for explicit Android permissions:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-[#10243E] dark:text-white">Location Access</span>
                  <span className="text-[#718096] dark:text-[#94A3B8] text-[11px]">Fused Location Provider • 30m default</span>
                </div>
                <span className="text-[#22B573] font-bold">Granted</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-[#10243E] dark:text-white">Foreground Service</span>
                  <span className="text-[#718096] dark:text-[#94A3B8] text-[11px]">Persistent transparency notification</span>
                </div>
                <span className="text-[#22B573] font-bold">Active</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071321] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-[#10243E] dark:text-white">Camera & Screen</span>
                  <span className="text-[#718096] dark:text-[#94A3B8] text-[11px]">On-demand per-session consent</span>
                </div>
                <span className="text-amber-500 font-bold">Prompted</span>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4 text-center py-4">
            <RefreshCw className="w-12 h-12 text-[#087CF5] animate-spin mx-auto" />
            <h3 className="text-base font-bold text-[#10243E] dark:text-white">
              Pairing Device & Exchanging Keys...
            </h3>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
              Generating hardware-backed Android Keystore keypair and registering UUID.
            </p>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4 text-center py-4">
            <CheckCircle2 className="w-16 h-16 text-[#22B573] mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-[#10243E] dark:text-white">
              Device Added Successfully!
            </h3>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
              <strong>{deviceName || 'New Device'}</strong> is now safely connected with guardian oversight and member privacy controls.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 && step < 7 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-semibold text-[#718096] dark:text-[#94A3B8] hover:text-[#10243E]"
            >
              Back
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087CF5] hover:bg-[#168DFF] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all ml-auto"
          >
            <span>{step === 7 ? 'Done' : step === 6 ? 'Confirm' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
