'use client';

import { Menu, X, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  title: string;
  darkMode: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ title, darkMode, onToggleTheme, onToggleSidebar, sidebarOpen }: HeaderProps) {
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
    </header>
  );
}
