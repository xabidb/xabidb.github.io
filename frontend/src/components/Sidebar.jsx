import React from 'react';
import { Users, PieChart, ShieldCheck, Zap } from 'lucide-react';

export default function Sidebar({ activeScreen, setActiveScreen, isApiConnected }) {
  const isModelPerfActive = activeScreen === '24h' || activeScreen === '72h';

  return (
    <div className="w-64 bg-[#f9b233] text-[#1c1c1c] h-screen flex flex-col justify-between shrink-0 font-sans shadow-2xl">
      <div>
        {/* Brand Header matching Figma Demo 4 */}
        <div className="p-6 border-b border-[#e5a024]/40">
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-2xl tracking-tight text-[#1c1c1c] font-serif">
              explorium
            </h1>
          </div>
          <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#332200] block mt-0.5 uppercase opacity-80">
            Staffing Optimizer
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-3">
          {/* Daily Forecast */}
          <button
            onClick={() => setActiveScreen('forecast')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
              activeScreen === 'forecast'
                ? 'bg-[#1c1c1c] text-white shadow-md'
                : 'text-[#1c1c1c] hover:bg-[#e5a024]/30'
            }`}
          >
            <Users className="h-4 w-4 shrink-0" />
            <span>Daily Forecast</span>
          </button>

          {/* Model Performance Container */}
          <div
            className={`rounded-xl p-2 transition-all ${
              isModelPerfActive ? 'bg-[#e09923]/40 border border-[#d68f1c]/50' : ''
            }`}
          >
            <button
              onClick={() => setActiveScreen('24h')}
              className="w-full flex items-center gap-3 px-2 py-1.5 text-xs font-bold text-[#1c1c1c] text-left cursor-pointer"
            >
              <PieChart className="h-4 w-4 shrink-0" />
              <span>Model Performance</span>
            </button>

            {/* Sub-items */}
            <div className="ml-7 mt-1.5 space-y-1">
              <button
                onClick={() => setActiveScreen('24h')}
                className={`block w-full text-left text-xs font-semibold py-1 px-2 rounded transition-colors cursor-pointer ${
                  activeScreen === '24h'
                    ? 'text-[#1c1c1c] font-extrabold bg-[#f9b233] shadow-sm'
                    : 'text-[#3d2b00] hover:text-black'
                }`}
              >
                24h Model
              </button>
              <button
                onClick={() => setActiveScreen('72h')}
                className={`block w-full text-left text-xs font-semibold py-1 px-2 rounded transition-colors cursor-pointer ${
                  activeScreen === '72h'
                    ? 'text-[#1c1c1c] font-extrabold bg-[#f9b233] shadow-sm'
                    : 'text-[#3d2b00] hover:text-black'
                }`}
              >
                72h Model
              </button>
            </div>
          </div>

          {/* Sign In / Account */}
          <button
            onClick={() => setActiveScreen('login')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
              activeScreen === 'login'
                ? 'bg-[#1c1c1c] text-white shadow-md'
                : 'text-[#1c1c1c] hover:bg-[#e5a024]/30'
            }`}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Sign In / Account</span>
          </button>
        </nav>
      </div>

      {/* API Connection Indicator at bottom */}
      <div className="p-4 border-t border-[#e5a024]/40 flex items-center gap-2.5">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isApiConnected?.status === 'offline' ? 'bg-rose-700' : 'bg-emerald-700 animate-pulse'
          }`}
        />
        <div className="text-[11px]">
          <p className="font-bold text-[#1c1c1c]">
            {isApiConnected?.status === 'offline' ? 'System Offline' : 'System Online'}
          </p>
          <p className="text-[#4a3600] text-[10px]">
            {isApiConnected?.isBackend ? 'v2.0.0 (FastAPI)' : 'v2.0.0 (Demo Mode)'}
          </p>
        </div>
      </div>
    </div>

  );
}
