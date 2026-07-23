import React from 'react';
import { User, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeScreen, setActiveScreen, isApiConnected, isOpen, onClose }) {
  const { user, isLoggedIn, logout } = useAuth();
  const isModelPerfActive = activeScreen === '24h' || activeScreen === '72h';

  const handleSelect = (screen) => {
    setActiveScreen(screen);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-64 bg-[#f9b233] text-[#333333] h-screen flex flex-col justify-between shrink-0 font-roboto shadow-2xl overflow-y-auto fixed inset-y-0 left-0 z-50 transform lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-[#e5a024]/40 flex items-center justify-between">
            <img src="/Logo.svg" alt="Explorium Staffing Optimizer" className="h-9 w-auto object-contain" />
            <button
              onClick={onClose}
              className="lg:hidden text-[#333333] hover:bg-[#333333]/10 p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-3">
            {/* Model Performance Container */}
            <div
              className={`rounded-xl transition-all ${
                isModelPerfActive ? 'bg-[#333333]/10 pb-2.5' : ''
              }`}
            >
              <button
                onClick={() => handleSelect('24h')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                  isModelPerfActive
                    ? 'text-[#333333]'
                    : 'text-[#333333] hover:bg-[#333333]/10'
                }`}
              >
                <img src="/Graph.svg" alt="Model Performance" className="w-5 h-5 shrink-0 object-contain" />
                <span>Model Performance</span>
              </button>

              {/* Sub-items */}
              {isModelPerfActive && (
                <div className="ml-8 pr-3 space-y-1">
                  <button
                    onClick={() => handleSelect('24h')}
                    className={`block w-full text-left text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                      activeScreen === '24h'
                        ? 'text-[#333333] bg-[#333333]/15 font-extrabold'
                        : 'text-[#333333]/70 hover:text-[#333333] hover:bg-[#333333]/10 font-bold'
                    }`}
                  >
                    24h Model
                  </button>
                  <button
                    onClick={() => handleSelect('72h')}
                    className={`block w-full text-left text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                      activeScreen === '72h'
                        ? 'text-[#333333] bg-[#333333]/15 font-extrabold'
                        : 'text-[#333333]/70 hover:text-[#333333] hover:bg-[#333333]/10 font-bold'
                    }`}
                  >
                    72h Model
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="flex flex-col">
          {/* User Auth Profile Card */}
          {isLoggedIn && user && (
            <div className="px-4 pt-3 pb-1 border-t border-[#e5a024]/40">
              <div className="flex items-center justify-between bg-[#f9b233] text-[#333333] p-3 rounded-xl shadow-md border border-[#e5a024]/60">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-1.5 bg-[#333333] text-[#f9b233] rounded-full shrink-0">
                    <User className="h-4 w-4 text-[#f9b233]" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-bold truncate text-[#333333]">{user.full_name}</p>
                    <span className="text-[10px] text-[#333333]/80 font-semibold block uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out Account"
                  className="text-[#333333] hover:text-rose-700 p-1.5 rounded-lg hover:bg-black/10 transition-colors shrink-0 cursor-pointer ml-1"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* API Connection Indicator */}
          <div className="p-4 border-t border-[#e5a024]/40 flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isApiConnected?.status === 'offline' ? 'bg-rose-700' : 'bg-emerald-700 animate-pulse'
              }`}
            />
            <div className="text-[11px]">
              <p className="font-bold text-[#333333]">
                {isApiConnected?.status === 'offline' ? 'System Offline' : 'System Online'}
              </p>
              <p className="text-[#333333]/80 text-[10px]">
                {isApiConnected?.isBackend ? 'v2.0.0 (FastAPI)' : 'v2.0.0 (Demo Mode)'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
