'use client';

import { MenuItem } from '@/lib/constants';
import { Home, PlusCircle, History, Database, Settings } from 'lucide-react';

const icons = {
  Home,
  PlusCircle,
  History,
  Database,
  Settings,
};

interface SidebarProps {
  menuItems: MenuItem[];
  currentPage: string;
  onPageChange: (page: string) => void;
  darkMode: boolean;
  appName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ menuItems, currentPage, onPageChange, darkMode, appName, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r`}
      >
        <div className="flex flex-col h-full">
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {appName}
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Sistem Pencatatan
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = icons[item.id as keyof typeof icons];
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${currentPage === item.id
                      ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} shadow-lg`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                    }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
