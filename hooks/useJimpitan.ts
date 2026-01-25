'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Jimpitan, CreateJimpitanInput } from '@/lib/supabase/types';
import { getWeekNumber, getMonthAndYear } from '@/lib/utils/format';

export function useJimpitan() {
  const [data, setData] = useState<Jimpitan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJimpitan = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: jimpitanData, error: fetchError } = await supabase
        .from('jimpitan')
        .select('*')
        .order('collection_date', { ascending: false });

      if (fetchError) throw fetchError;
      setData(jimpitanData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jimpitan data');
    } finally {
      setLoading(false);
    }
  };

  const addJimpitan = async (input: CreateJimpitanInput) => {
    try {
      const date = new Date(input.collection_date);
      const { data: newJimpitan, error: insertError } = await supabase
        .from('jimpitan')
        .insert({
          amount: input.amount,
          collection_date: input.collection_date,
          week_number: getWeekNumber(date),
          month: getMonthAndYear(date).month,
          year: getMonthAndYear(date).year,
          notes: input.notes || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setData([newJimpitan, ...data]);
      return { success: true, data: newJimpitan };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add jimpitan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteJimpitan = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('jimpitan')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setData(data.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete jimpitan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getFilteredData = (month: number, year: number) => {
    return data.filter(item => item.month === month && item.year === year);
  };

  const getTotalByPeriod = (month?: number, year?: number) => {
    let filtered = data;
    if (month !== undefined && year !== undefined) {
      filtered = data.filter(item => item.month === month && item.year === year);
    }
    return filtered.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return data
      .filter(item => item.collection_date === today)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const getWeeklyData = (month: number, year: number) => {
    const weeks = [1, 2, 3, 4].map(week => ({
      week: `Minggu ${week}`,
      amount: data
        .filter(d => d.week_number === week && d.month === month && d.year === year)
        .reduce((sum, item) => sum + item.amount, 0),
    }));
    return weeks;
  };

  useEffect(() => {
    fetchJimpitan();
  }, []);

  return {
    data,
    loading,
    error,
    fetchJimpitan,
    addJimpitan,
    deleteJimpitan,
    getFilteredData,
    getTotalByPeriod,
    getTotalToday,
    getWeeklyData,
  };
}
