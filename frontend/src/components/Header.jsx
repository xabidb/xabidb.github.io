import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ activeScreen, bestModel, onRetrain, isRetraining, onOpenLogin }) {
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
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center px-16 pt-20 pb-6 border-b border-[#3b3b3b] bg-[#333333] gap-4 font-roboto">
      <div className="flex items-center gap-3">
        <h2 className="text-xl md:text-4xl font-semibold text-white tracking-tight">{getTitle()}</h2>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">

        {/* Retrain Button with Admin RBAC Guarding */}
        {showRetrain && (
          <div className="relative group">
            <button
              onClick={onRetrain}
              disabled={isRetraining || !isAdmin}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition-all shadow-md ${isAdmin
                ? 'bg-[#e62b76] hover:bg-[#c20651] text-white active:scale-[0.98] cursor-pointer'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
              {isRetraining ? 'Retraining...' : 'Retrain Pipeline'}
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
