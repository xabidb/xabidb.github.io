import React from 'react';
import { RefreshCw, User, LogIn, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ activeScreen, bestModel, onRetrain, isRetraining, onOpenLogin }) {
  const { user, isLoggedIn, logout, hasRole } = useAuth();

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

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-[#fcb712]/10 text-[#fcb712] border-[#fcb712]/30';
      case 'manager':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-400/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30';
    }
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-[#3b3b3b] bg-[#333333] gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">{getTitle()}</h2>
        {showRetrain && (
          <span className="bg-[#aaabdb]/20 text-[#7173e2] text-xs font-semibold px-3 py-1 rounded-full border border-[#7173e2]/20 shrink-0">
            Active
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {/* User Auth Profile Badge */}
        {isLoggedIn ? (
          <div className="flex items-center gap-3 bg-[#2b2b2b] px-3.5 py-1.5 rounded-lg border border-[#444444]">
            <div className="p-1.5 bg-[#3b3b3b] rounded-full border border-[#555]">
              <User className="h-4 w-4 text-gray-300" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">{user.full_name}</span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${getRoleBadgeStyle(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block">{user.email}</span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="ml-2 text-gray-400 hover:text-rose-400 p-1 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 bg-[#2b2b2b] hover:bg-[#3b3b3b] text-white px-3.5 py-2 rounded-lg border border-[#444444] text-xs font-semibold transition-all"
          >
            <LogIn className="h-3.5 w-3.5 text-[#fcb712]" />
            Sign In / Quick Demo
          </button>
        )}

        {/* Retrain Button with Admin RBAC Guarding */}
        {showRetrain && (
          <div className="relative group">
            <button
              onClick={onRetrain}
              disabled={isRetraining || !isAdmin}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition-all shadow-md ${
                isAdmin
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
