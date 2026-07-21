import React from 'react';
import { AreaChart, BarChart2, Calendar, Activity, Zap } from 'lucide-react';

export default function Sidebar({ activeScreen, setActiveScreen, isApiConnected }) {
  const menuItems = [
    { id: '24h', label: '24h Model Performance', icon: AreaChart },
    { id: '72h', label: '72h Model Performance', icon: BarChart2 },
    { id: 'forecast', label: 'Daily Forecast & Staffing', icon: Calendar },
  ];

  return (
    <div className="w-64 bg-[#2b2b2b] border-r border-[#3b3b3b] h-screen flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#3b3b3b] flex items-center gap-3">
          <Zap className="h-6 w-6 text-[#fcb712]" />
          <div>
            <h1 className="font-bold text-lg text-white leading-none">StaffOpt</h1>
            <span className="text-xs text-gray-400">Visitor & Shift Planning</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#fcb712] text-black font-semibold shadow-lg shadow-[#fcb712]/15'
                    : 'text-gray-400 hover:text-white hover:bg-[#333333]'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Connection Status Indicator */}
      <div className="p-4 border-t border-[#3b3b3b] flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isApiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
          }`}
        />
        <div className="text-xs">
          <p className="text-gray-300 font-medium">{isApiConnected ? 'System Online' : 'System Offline'}</p>
          <p className="text-gray-500">v2.0.0 (FastAPI)</p>
        </div>
      </div>
    </div>
  );
}
