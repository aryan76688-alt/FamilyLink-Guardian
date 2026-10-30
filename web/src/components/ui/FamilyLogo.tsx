import React from 'react';

interface FamilyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const FamilyLogo: React.FC<FamilyLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl font-extrabold',
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Shield + Family + Location Pin Logo Concept */}
      <div
        className={`${iconSizes[size]} rounded-2xl bg-gradient-to-tr from-[#062B52] via-[#087CF5] to-[#53B9FF] p-[2px] shadow-sm flex items-center justify-center flex-shrink-0`}
      >
        <div className="w-full h-full bg-[#062B52] rounded-[14px] flex items-center justify-center relative overflow-hidden">
          <svg
            className="w-3/5 h-3/5 text-[#53B9FF]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer Shield */}
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            {/* Inner Family Dot / Pin Marker */}
            <circle cx="12" cy="10" r="2.5" fill="#087CF5" stroke="#FFFFFF" strokeWidth="1" />
            <path d="M9 16c0-1.8 1.3-3 3-3s3 1.2 3 3" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`text-[#062B52] dark:text-white tracking-tight flex items-center gap-1 ${textSizes[size]}`}>
            FamilyLink
            <span className="text-[#087CF5] font-semibold">Guardian</span>
          </div>
          <span className="text-[10px] text-[#718096] dark:text-[#94A3B8] font-medium tracking-wide">
            Stay Connected • Stay Safe
          </span>
        </div>
      )}
    </div>
  );
};
