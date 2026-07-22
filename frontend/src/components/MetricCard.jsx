import React from 'react';

export default function MetricCard({ title, value, unit = '', maxVal = 100, colorScheme = 'purple' }) {
  const schemeConfig = {
    purple: {
      barBg: 'bg-[#6c5ce7]',
      ticks: ['0', '25', '50'],
    },
    gold: {
      barBg: 'bg-[#f9b233]',
      ticks: ['0', '50', '100'],
    },
    pink: {
      barBg: 'bg-[#e62b76]',
      ticks: ['0', '50', '100'],
    },
  };

  const currentScheme = schemeConfig[colorScheme] || schemeConfig.purple;
  const numVal = parseFloat(value) || 0;
  const percentage = Math.min(100, Math.max(0, (numVal / maxVal) * 100));

  return (
    <div className="bg-[#363636] p-6 rounded-xl border border-[#454545] shadow-lg flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-300 max-w-[160px] leading-snug">{title}</h3>
        <span className="text-4xl font-bold text-white tracking-tight">
          {value}
          {unit}
        </span>
      </div>

      <div>
        <div className="w-full bg-[#272727] h-2 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full ${currentScheme.barBg} rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-gray-400 font-medium px-0.5">
          {currentScheme.ticks.map((t, idx) => (
            <span key={idx}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
