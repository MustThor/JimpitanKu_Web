'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DailyBarChartProps {
  data: { day: string; amount: number }[];
  darkMode: boolean;
}

export function DailyBarChart({ data, darkMode }: DailyBarChartProps) {
  const formatRupiah = (number: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Gradient colors for each bar
  const barColors = [
    '#3b82f6', // Senin - Blue
    '#10b981', // Selasa - Green
    '#f59e0b', // Rabu - Amber
    '#ef4444', // Kamis - Red
    '#8b5cf6', // Jumat - Purple
    '#06b6d4', // Sabtu - Cyan
    '#ec4899', // Minggu - Pink
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="day"
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1000)}K`}
          />
          <Tooltip
            formatter={(value) => [formatRupiah(value as number), 'Total Pemasukan Bulan Sebelumnya']}
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
            itemStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
          />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
