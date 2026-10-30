import React from 'react';

interface MemberAvatarProps {
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  name,
  avatarUrl,
  isOnline = false,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const ringColor = isOnline
    ? 'border-[#22B573]'
    : 'border-slate-300 dark:border-slate-600';

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Color generator based on name hash for distinct avatars
  const bgColors = [
    'bg-blue-600',
    'bg-indigo-600',
    'bg-teal-600',
    'bg-sky-600',
    'bg-violet-600',
    'bg-emerald-600',
  ];
  const colorIndex =
    Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
    bgColors.length;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full border-2 ${ringColor} flex items-center justify-center font-bold text-white overflow-hidden shadow-sm ${bgColors[colorIndex]}`}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Online indicator dot */}
      <span
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#0D2035] ${
          isOnline ? 'bg-[#22B573]' : 'bg-slate-400'
        }`}
      />
    </div>
  );
};
