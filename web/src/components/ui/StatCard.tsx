import React from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}

export const StatCard: React.FC<Props> = ({ title, value, icon, subtitle }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-3 bg-slate-800/80 rounded-lg text-blue-400 border border-slate-700/50">
        {icon}
      </div>
    </div>
  );
};
