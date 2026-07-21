import React from 'react';

export default function MetricCard({ title, value, unit = '', maxVal = 100, colorScheme = 'purple' }) {
  const schemeConfig = {
    purple: {
      gradient: 'from-[#7173e2] to-[#4a4de6]',
      ticks: ['0', '25', '50'],
    },
    gold: {
      gradient: 'from-[#edc24a] to-[#bc8f12]',
      ticks: ['0', '50', '100'],
    },
    pink: {
      gradient: 'from-[#e62b76] to-[#c20651]',
      ticks: ['0', '50', '100'],
    },
  };

  const currentScheme = schemeConfig[colorScheme] || schemeConfig.purple;
  const numVal = parseFloat(value) || 0;
  const percentage = Math.min(100, Math.max(0, (numVal / maxVal) * 100));

  return (
    <div className="bg-[#3b3b3b] p-5 rounded-lg border border-[#444444] shadow-md flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <span className="text-3xl font-bold text-white tracking-tight">
          {value}
          {unit}
        </span>
      </div>

      <div>
        <div className="w-full bg-[#333333] h-2 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full bg-gradient-to-r ${currentScheme.gradient} rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-medium">
          {currentScheme.ticks.map((t, idx) => (
            <span key={idx}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
