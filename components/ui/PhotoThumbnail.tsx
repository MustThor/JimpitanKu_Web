'use client';

import { Image as ImageIcon } from 'lucide-react';

interface PhotoThumbnailProps {
  url: string | null;
  alt?: string;
  darkMode?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PhotoThumbnail({ url, alt = 'Foto bukti', darkMode, size = 'sm' }: PhotoThumbnailProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  if (!url) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <ImageIcon className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={`${sizeClasses[size]} object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={() => window.open(url, '_blank')}
    />
  );
}
