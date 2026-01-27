import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create Supabase client for server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Retention period in days
const RETENTION_DAYS = 14;

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (Vercel automatically adds this header)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // In production, verify the cron secret
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log('[Cron Backup] Unauthorized request');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Cron Backup] Starting automated backup...');

    // 1. Fetch all jimpitan data to backup
    const { data: jimpitanData, error: fetchError } = await supabase
      .from('jimpitan')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('[Cron Backup] Failed to fetch jimpitan data:', fetchError);
      throw fetchError;
    }

    // 2. Create backup with unique name
    const now = new Date();
    const backupName = `AutoBackup_${now.toISOString().slice(0, 10).replace(/-/g, '')}_${now.toTimeString().slice(0, 5).replace(':', '')}`;

    const { data: newBackup, error: insertError } = await supabase
      .from('backup_history')
      .insert({
        backup_name: backupName,
        backup_data: jimpitanData || []
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Cron Backup] Failed to create backup:', insertError);
      throw insertError;
    }

    console.log(`[Cron Backup] Backup created: ${backupName}, items: ${jimpitanData?.length || 0}`);

    // 3. Clean up old backups (older than RETENTION_DAYS)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

    const { data: deletedBackups, error: deleteError } = await supabase
      .from('backup_history')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .like('backup_name', 'AutoBackup_%') // Only delete auto backups, keep manual ones
      .select();

    if (deleteError) {
      console.error('[Cron Backup] Failed to cleanup old backups:', deleteError);
      // Don't throw here, backup was still successful
    } else if (deletedBackups && deletedBackups.length > 0) {
      console.log(`[Cron Backup] Cleaned up ${deletedBackups.length} old backup(s)`);
    }

    return NextResponse.json({
      success: true,
      message: 'Backup completed successfully',
      backup: {
        name: backupName,
        itemCount: jimpitanData?.length || 0,
        createdAt: newBackup.created_at
      },
      cleanup: {
        deletedCount: deletedBackups?.length || 0,
        retentionDays: RETENTION_DAYS
      }
    });

  } catch (error) {
    console.error('[Cron Backup] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
