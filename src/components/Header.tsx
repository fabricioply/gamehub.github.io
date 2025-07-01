import React from 'react';
import { PlusCircleIcon, SettingsIcon, ShieldCheckIcon } from './icons/Icons';
import { Permission } from '../types';
import { usePermissions } from '../hooks/usePermissions';

interface HeaderProps {
  onAddTaskClick: () => void;
  onLogout: () => void;
  onSettingsClick: () => void;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTaskClick, onLogout, onSettingsClick, onAdminClick }) => {
  const { currentUser, userRole, hasPermission } = usePermissions();
  
  return (
    <header className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-20">
      <div className="flex items-center space-x-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 text-purple-400"
        >
          <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.933l-9 5.25v9l8.628-5.033A.75.75 0 0021.75 16.5V7.933zM2.25 7.933V16.5a.75.75 0 00.372.648L11.25 22.18v-9l-9-5.25z" />
        </svg>
        <h1 className="text-2xl font-bold tracking-tight text-gray-100">
          GameDev Hub
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onAddTaskClick}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span>New Task</span>
        </button>
        <div className="flex items-center space-x-3 bg-gray-800/50 rounded-full pl-3 pr-1 py-1">
            <div className="text-right">
                <div className="font-semibold text-white">{currentUser.name}</div>
                <div className="text-xs text-gray-400">{userRole?.name || 'User'}</div>
            </div>
            <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-10 h-10 rounded-full border-2 border-slate-600"
            />
             <div className="flex items-center_pl-1">
                 {hasPermission(Permission.AccessAdminDashboard) && (
                    <button onClick={onAdminClick} className="p-2 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white transition-colors" title="Admin Dashboard">
                        <ShieldCheckIcon className="w-5 h-5" />
                    </button>
                )}
                <button onClick={onSettingsClick} className="p-2 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white transition-colors" title="Settings">
                    <SettingsIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
         <button
          onClick={onLogout}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white font-semibold transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;