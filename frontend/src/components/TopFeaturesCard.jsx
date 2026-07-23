import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatFeatureName } from '../services/api';

export default function TopFeaturesCard({ data }) {
  // Map colors dynamically based on category with tone variation
  const formattedData = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    const categoryCounts = {};
    const purpleShades = ['#7173E2', '#4A4DE6', '#8C8EF2', '#3638B3'];
    const yellowShades = ['#f9b233', '#d98e1d', '#fbc566', '#b3720f'];
    const pinkShades = ['#e62b76', '#ff5495', '#b31955', '#ff7bb1'];

    return data.map((item) => {
      const type = item.type || 'ENGINEERED';
      if (!categoryCounts[type]) categoryCounts[type] = 0;
      const index = categoryCounts[type]++;

      let color = '#7173E2';
      if (type === 'WEATHER') {
        color = yellowShades[index % yellowShades.length];
      } else if (type === 'CALENDAR') {
        color = pinkShades[index % pinkShades.length];
      } else {
        color = purpleShades[index % purpleShades.length];
      }

      return {
        ...item,
        name: formatFeatureName(item.name),
        color,
      };
    });
  }, [data]);

  const featureData = formattedData || [
    { name: 'Previous Day Walk-Ins', value: 23.1, color: '#7173E2', type: 'ENGINEERED' },
    { name: 'Advance Science Center Bookings', value: 18.2, color: '#4A4DE6', type: 'ENGINEERED' },
    { name: 'Daily Peak Temperature', value: 13.9, color: '#f9b233', type: 'WEATHER' },
    { name: 'Public & School Holiday', value: 11.2, color: '#e62b76', type: 'CALENDAR' },
    { name: 'Daily Rainfall Amount', value: 7.4, color: '#d98e1d', type: 'WEATHER' },
  ];

  // Calculate remaining percentage to complete 100% total for true proportions
  const pieChartData = React.useMemo(() => {
    const total = featureData.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const remainder = Math.max(0, parseFloat((100 - total).toFixed(1)));
    if (remainder <= 0) return featureData;

    return [
      ...featureData,
      {
        name: 'Other Features',
        value: remainder,
        color: 'rgba(255, 255, 255, 0.08)',
        isOther: true,
      },
    ];
  }, [featureData]);

  return (
    <div className="bg-[#363636] p-3.5 sm:p-5 rounded-xl border border-[#454545] shadow-lg flex flex-col justify-between">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold font-roboto text-gray-100 leading-snug">Top Features</h3>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7173E2]" />
            <span className="text-xs sm:text-sm font-medium font-roboto text-white/60">ENGINEERED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f9b233]" />
            <span className="text-xs sm:text-sm font-medium font-roboto text-white/60">WEATHER</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e62b76]" />
            <span className="text-xs sm:text-sm font-medium font-roboto text-white/60">CALENDAR</span>
          </div>
        </div>
      </div>

      {/* Content Layout: Donut + List */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Donut Chart */}
        <div className="sm:col-span-4 lg:col-span-3.5 h-32 sm:h-36 lg:h-36 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={46}
                paddingAngle={4}
                cornerRadius={3}
                dataKey="value"
                stroke="none"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isOther ? 'rgba(255, 255, 255, 0.08)' : entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const dataItem = payload[0].payload;
                  if (dataItem.isOther) return null;
                  return (
                    <div className="bg-[#242424] border border-[#555555] rounded-md px-3 py-2 text-xs text-white shadow-md">
                      <p className="font-semibold">{dataItem.name}</p>
                      <p className="text-gray-300 font-bold mt-0.5">{dataItem.value}%</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Feature List */}
        <div className="sm:col-span-8 lg:col-span-8.5 space-y-1.5">
          {featureData.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-1 px-2.5 rounded-lg bg-[#2b2b2b]/50 border border-[#444444]/40"
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs sm:text-sm font-roboto font-medium truncate">{item.name}</span>
              </div>
              <span className="text-xs sm:text-sm font-roboto font-semibold text-white shrink-0">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
