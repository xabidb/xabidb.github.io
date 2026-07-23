import React from 'react';
import { RefreshCw, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ activeScreen, bestModel, onRetrain, isRetraining, onOpenLogin, onToggleSidebar }) {
  const { hasRole } = useAuth();

  const getTitle = () => {
    if (activeScreen === '24h') {
      return `Current 24h Model: ${bestModel || 'Random Forest'}`;
    }
    if (activeScreen === '72h') {
      return `Current 72h Model: ${bestModel || 'Random Forest'}`;
    }
    if (activeScreen === 'forecast') {
      return 'Daily Forecast & Staff Headcount Suggestions';
    }
    return 'User Authentication & Role Permissions';
  };

  const showRetrain = activeScreen === '24h' || activeScreen === '72h';
  const isAdmin = hasRole('admin');

  return (
    <header className="flex flex-row justify-between items-center px-4 sm:px-6 lg:px-10 py-4 lg:py-6 border-b border-[#3b3b3b] bg-[#333333] gap-3 font-roboto shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-300 hover:text-white p-2 -ml-1 rounded-lg bg-[#2b2b2b] hover:bg-[#444444] border border-[#444444] transition-colors cursor-pointer shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-semibold text-white tracking-tight truncate">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Retrain Button with Admin RBAC Guarding */}
        {showRetrain && (
          <div className="relative group">
            <button
              onClick={onRetrain}
              disabled={isRetraining || !isAdmin}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase flex items-center gap-1.5 sm:gap-2 transition-all shadow-md ${isAdmin
                ? 'bg-[#e62b76] hover:bg-[#c20651] text-white active:scale-[0.98] cursor-pointer'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRetraining ? 'Retraining...' : 'Retrain Pipeline'}</span>
              <span className="sm:hidden">{isRetraining ? '...' : 'Retrain'}</span>
            </button>
            {!isAdmin && (
              <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-[#1f1f1f] text-gray-300 text-[11px] px-2.5 py-1 rounded shadow-lg border border-[#444] whitespace-nowrap z-30">
                Requires <span className="text-[#fcb712] font-bold">Admin</span> role
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
