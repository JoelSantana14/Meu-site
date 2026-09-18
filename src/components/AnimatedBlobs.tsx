import React from 'react';

interface AnimatedBlobsProps {
  variant?: 'hero' | 'section' | 'subtle';
  className?: string;
}

export const AnimatedBlobs: React.FC<AnimatedBlobsProps> = ({ variant = 'hero', className = '' }) => {
  if (variant === 'subtle') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none ${className}`} aria-hidden="true">
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl animate-blob-1" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-600/15 blur-3xl animate-blob-2" />
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none ${className}`} aria-hidden="true">
        <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 dark:from-indigo-900/20 dark:to-blue-900/15 blur-3xl animate-blob-1" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-gradient-to-tl from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/20 dark:to-teal-900/15 blur-3xl animate-blob-2" />
      </div>
    );
  }

  // Default: Hero premium background
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none ${className}`} aria-hidden="true">
      {/* Primary Indigo/Blue Blob */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-blue-500/10 to-transparent dark:from-indigo-600/20 dark:via-blue-500/15 blur-[100px] animate-blob-1" />
      
      {/* Secondary Emerald/Teal Blob */}
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-emerald-500/12 via-teal-500/10 to-transparent dark:from-emerald-600/18 dark:via-teal-500/12 blur-[100px] animate-blob-2" />

      {/* Center Subtle Sky Accent */}
      <div className="absolute bottom-10 left-1/3 w-[380px] h-[380px] rounded-full bg-gradient-to-r from-sky-400/8 to-indigo-400/8 dark:from-sky-500/10 dark:to-indigo-500/10 blur-[90px] animate-blob-3" />
    </div>
  );
};
