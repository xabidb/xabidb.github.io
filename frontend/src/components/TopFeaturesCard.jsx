import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function TopFeaturesCard({ data }) {
  // Map colors dynamically based on category
  const formattedData = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.map((item) => {
      let color = '#7173e2'; // default ENGINEERED
      if (item.type === 'WEATHER') color = '#edc24a';
      else if (item.type === 'CALENDAR') color = '#e62b76';
      
      return {
        ...item,
        color,
      };
    });
  }, [data]);

  const featureData = formattedData || [
    { name: '1day Lag Walk-Ins', value: 23.1, color: '#7173e2', type: 'ENGINEERED' },
    { name: '24h Science Booking Velocity', value: 18.2, color: '#7173e2', type: 'ENGINEERED' },
    { name: 'Daily Max Temperature', value: 13.9, color: '#edc24a', type: 'WEATHER' },
    { name: 'Bank Holiday', value: 11.2, color: '#e62b76', type: 'CALENDAR' },
    { name: 'Daily Total Rain', value: 7.4, color: '#edc24a', type: 'WEATHER' },
  ];

  return (
    <div className="bg-[#3b3b3b] p-6 rounded-lg border border-[#444444] shadow-md flex flex-col justify-between">
      {/* Header & Legend */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Top Features</h3>
        <div className="flex items-center gap-3 text-[11px] font-semibold tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#7173e2]" />
            <span className="text-gray-300">ENGINEERED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#edc24a]" />
            <span className="text-gray-300">WEATHER</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#e62b76]" />
            <span className="text-gray-300">CALENDAR</span>
          </div>
        </div>
      </div>

      {/* Content Layout: Donut + List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Donut Chart */}
        <div className="md:col-span-4 h-48 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={featureData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={4}
                dataKey="value"
              >
                {featureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2b2b2b',
                  borderColor: '#555555',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Feature List */}
        <div className="md:col-span-8 space-y-2.5">
          {featureData.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-2 rounded-lg bg-[#333333] border border-[#444444]/50"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-gray-200">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-white bg-[#2b2b2b] px-2 py-0.5 rounded border border-[#555555]">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
