export interface Jimpitan {
  id: string;
  amount: number;
  collection_date: string;
  week_number: number | null;
  month: number | null;
  year: number | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface BackupHistory {
  id: string;
  backup_name: string;
  created_at: string;
  restored_at: string | null;
  backup_data: Jimpitan[] | null;
}

export interface Pengaturan {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface CreateJimpitanInput {
  amount: number;
  collection_date: string;
  notes?: string;
  photo?: File | null;
}

export interface UpdateJimpitanInput {
  amount?: number;
  collection_date?: string;
  notes?: string;
  photo_url?: string | null;
}

export interface CreateBackupInput {
  backup_name: string;
}

export interface UpdateBackupInput {
  restored_at?: string;
}

export interface UpdatePengaturanInput {
  value: string;
}

export type UserRole = 'admin' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}
