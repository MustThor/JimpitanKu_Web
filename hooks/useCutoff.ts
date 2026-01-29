'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { CutoffHistory } from '@/lib/supabase/types';

export function useCutoff() {
  const [cutoffHistory, setCutoffHistory] = useState<CutoffHistory[]>([]);
  const [totalPemasukan, setTotalPemasukan] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCutoffHistory = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('cutoff_history')
        .select('*')
        .order('cutoff_date', { ascending: false });

      if (fetchError) throw fetchError;
      setCutoffHistory(data || []);
    } catch (err) {
      console.error('Error fetching cutoff history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cutoff history');
    }
  };

  const fetchTotalPemasukan = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('pengaturan')
        .select('value')
        .eq('key', 'total_pemasukan')
        .single();

      if (fetchError) {
        // If not found, initialize with 0
        if (fetchError.code === 'PGRST116') {
          setTotalPemasukan(0);
          return;
        }
        throw fetchError;
      }
      setTotalPemasukan(parseInt(data?.value || '0', 10));
    } catch (err) {
      console.error('Error fetching total pemasukan:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch total pemasukan');
    }
  };

  const performCutoff = async (month: number, year: number, amount: number) => {
    try {
      setError(null);

      // 1. Archive all jimpitan records for the selected month/year
      const { error: archiveError } = await supabase
        .from('jimpitan')
        .update({ is_archived: true })
        .eq('is_archived', false)
        .gte('collection_date', `${year}-${String(month).padStart(2, '0')}-01`)
        .lt('collection_date', month === 12 
          ? `${year + 1}-01-01` 
          : `${year}-${String(month + 1).padStart(2, '0')}-01`);

      if (archiveError) {
        console.error('Archive error:', archiveError);
        throw archiveError;
      }

      // 2. Update total_pemasukan in pengaturan
      const newTotal = totalPemasukan + amount;
      const { error: updateError } = await supabase
        .from('pengaturan')
        .upsert({ 
          key: 'total_pemasukan', 
          value: String(newTotal),
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (updateError) {
        console.error('Update total error:', updateError);
        throw updateError;
      }

      // 3. Insert cutoff history record
      const { error: insertError } = await supabase
        .from('cutoff_history')
        .insert({
          cutoff_date: new Date().toISOString(),
          amount: amount,
          period_month: month,
          period_year: year,
        });

      if (insertError) {
        console.error('Insert history error:', insertError);
        throw insertError;
      }

      // 4. Refresh data
      setTotalPemasukan(newTotal);
      await fetchCutoffHistory();

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform cutoff';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const initialize = async () => {
    setLoading(true);
    await Promise.all([fetchCutoffHistory(), fetchTotalPemasukan()]);
    setLoading(false);
  };

  useEffect(() => {
    initialize();
  }, []);

  return {
    cutoffHistory,
    totalPemasukan,
    loading,
    error,
    performCutoff,
    fetchCutoffHistory,
    fetchTotalPemasukan,
    refetch: initialize,
  };
}
