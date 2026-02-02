'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { BackupHistory } from '@/lib/supabase/types';

export function useBackup() {
  const [data, setData] = useState<BackupHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: backups, error: fetchError } = await supabase
        .from('backup_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setData(backups || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch backups');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      const backupName = `Backup_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${new Date().toTimeString().slice(0, 5).replace(':', '')}`;
      
      // Fetch all jimpitan data to backup
      const { data: jimpitanData, error: fetchError } = await supabase
        .from('jimpitan')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const { data: newBackup, error: insertError } = await supabase
        .from('backup_history')
        .insert({ 
          backup_name: backupName,
          backup_data: jimpitanData || []
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Refresh the backup list from server to ensure data consistency
      await fetchBackups();
      return { success: true, data: newBackup };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create backup';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const createAutoBackup = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const autoBackupName = `AutoBackup_${today}`;
      
      // Fetch current jimpitan data to backup
      const { data: jimpitanData, error: fetchError } = await supabase
        .from('jimpitan')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Check if today's auto-backup already exists
      const { data: existingBackup } = await supabase
        .from('backup_history')
        .select('id')
        .eq('backup_name', autoBackupName)
        .maybeSingle();

      if (existingBackup) {
        // Update existing auto-backup
        const { error: updateError } = await supabase
          .from('backup_history')
          .update({ backup_data: jimpitanData || [] })
          .eq('id', existingBackup.id);

        if (updateError) throw updateError;
      } else {
        // Create new auto-backup
        const { error: insertError } = await supabase
          .from('backup_history')
          .insert({ 
            backup_name: autoBackupName,
            backup_data: jimpitanData || []
          });

        if (insertError) throw insertError;
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create auto-backup';
      console.error('Auto-backup error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const restoreBackup = async (id: string) => {
    try {
      // First, fetch the backup data
      const { data: backup, error: fetchError } = await supabase
        .from('backup_history')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (!backup.backup_data || backup.backup_data.length === 0) {
        throw new Error('Backup data is empty or corrupted');
      }

      // Delete all existing jimpitan data
      const { error: deleteError } = await supabase
        .from('jimpitan')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // This deletes all rows

      if (deleteError) throw deleteError;

      // Restore the jimpitan data from backup
      const { error: insertError } = await supabase
        .from('jimpitan')
        .insert(backup.backup_data);

      if (insertError) throw insertError;

      // Update the backup's restored_at timestamp
      const { error: updateError } = await supabase
        .from('backup_history')
        .update({ restored_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;
      
      // Refresh the backup list from server to ensure data consistency
      await fetchBackups();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore backup';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteBackup = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('backup_history')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      // Refresh the backup list from server to ensure data consistency
      await fetchBackups();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete backup';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  return {
    data,
    loading,
    error,
    fetchBackups,
    createBackup,
    createAutoBackup,
    restoreBackup,
    deleteBackup,
  };
}

// Standalone auto-backup function for use in other hooks (e.g., useJimpitan)
export async function createAutoBackup() {
  try {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const autoBackupName = `AutoBackup_${today}`;
    
    // Fetch current jimpitan data to backup
    const { data: jimpitanData, error: fetchError } = await supabase
      .from('jimpitan')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    // Check if today's auto-backup already exists
    const { data: existingBackup } = await supabase
      .from('backup_history')
      .select('id')
      .eq('backup_name', autoBackupName)
      .maybeSingle();

    if (existingBackup) {
      // Update existing auto-backup
      const { error: updateError } = await supabase
        .from('backup_history')
        .update({ backup_data: jimpitanData || [] })
        .eq('id', existingBackup.id);

      if (updateError) throw updateError;
    } else {
      // Create new auto-backup
      const { error: insertError } = await supabase
        .from('backup_history')
        .insert({ 
          backup_name: autoBackupName,
          backup_data: jimpitanData || []
        });

      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create auto-backup';
    console.error('Auto-backup error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
