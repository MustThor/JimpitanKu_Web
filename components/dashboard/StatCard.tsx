'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  darkMode: boolean;
}

export function StatCard({ title, value, icon: Icon, color, darkMode }: StatCardProps) {
  const formatRupiah = (number: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl
        ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatRupiah(value)}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
