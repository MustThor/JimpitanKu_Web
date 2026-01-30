export type MenuItem = {
  id: string;
  label: string;
  href: string;
  adminOnly?: boolean;
};

export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'input', label: 'Input Jimpitan', href: '/input' },
  { id: 'riwayat', label: 'Riwayat', href: '/riwayat' },
  { id: 'backup', label: 'Backup', href: '/backup' },
  { id: 'about', label: 'Tentang Aplikasi', href: '/about' },
  { id: 'cutoff', label: 'Cut Off', href: '/cutoff', adminOnly: true },
  // TEMPORARILY HIDDEN - Uncomment the line below to restore settings menu
  // { id: 'settings', label: 'Settings', href: '/settings', adminOnly: true },
];

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const;

export const ITEMS_PER_PAGE = 5;

export const DEFAULT_SETTINGS = {
  app_name: 'Angsana Residence',
  nominal_default: '2000',
  theme: 'light',
} as const;
