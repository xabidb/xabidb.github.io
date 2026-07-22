import React from 'react';

export default function MetricCard({ title, value, unit = '', maxVal = 100, colorScheme = 'purple' }) {
  const schemeConfig = {
    purple: {
      barBg: 'bg-gradient-to-r from-[#4A4DE6] to-[#7173E2]',
      ticks: ['0', '25', '50'],
    },
    gold: {
      barBg: 'bg-gradient-to-r from-[#BC8F12] to-[#EDC24A]',
      ticks: ['0', '50', '100'],
    },
    pink: {
      barBg: 'bg-gradient-to-r from-[#C20651] to-[#E62B76]',
      ticks: ['0', '50', '100'],
    },
  };

  const currentScheme = schemeConfig[colorScheme] || schemeConfig.purple;
  const numVal = parseFloat(value) || 0;
  const percentage = Math.min(100, Math.max(0, (numVal / maxVal) * 100));

  return (
    <div className="bg-[#363636] p-4 2xl:p-6 rounded-xl border border-[#454545] shadow-lg flex flex-col justify-between min-h-32 2xl:min-h-40">
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-base lg:text-lg 2xl:text-2xl font-semibold font-roboto text-gray-100 leading-snug">{title}</h3>
        <span className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-bold font-roboto text-white tracking-tight shrink-0">
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
