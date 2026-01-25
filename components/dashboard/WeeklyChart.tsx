'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyChartProps {
  data: { week: string; amount: number }[];
  darkMode: boolean;
}

export function WeeklyChart({ data, darkMode }: WeeklyChartProps) {
  const formatRupiah = (number: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="week"
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1000)}K`}
          />
          <Tooltip
            formatter={(value) => [formatRupiah(value as number), 'Pemasukan']}
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: '#2563eb' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
