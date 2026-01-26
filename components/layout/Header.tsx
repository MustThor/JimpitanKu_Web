'use client';

import { Menu, X, Sun, Moon, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

interface HeaderProps {
  title: string;
  darkMode: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ title, darkMode, onToggleTheme, onToggleSidebar, sidebarOpen }: HeaderProps) {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      await signOut();
      window.location.href = '/login';
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 px-4 lg:px-8 py-4
        ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}
        border-b backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className={`lg:hidden p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.user_metadata?.name || user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`p-3 rounded-xl transition-all duration-300
                  ${darkMode
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                    : 'bg-red-50 hover:bg-red-100 text-red-600'
                  }`}
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
          <button
            onClick={onToggleTheme}
            className={`p-3 rounded-xl transition-all duration-300
              ${darkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
