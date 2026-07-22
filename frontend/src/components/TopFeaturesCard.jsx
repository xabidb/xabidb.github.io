import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function TopFeaturesCard({ data }) {
  // Map colors dynamically based on category
  const formattedData = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.map((item) => {
      let color = '#6c5ce7'; // default ENGINEERED
      if (item.type === 'WEATHER') color = '#f9b233';
      else if (item.type === 'CALENDAR') color = '#e62b76';

      return {
        ...item,
        color,
      };
    });
  }, [data]);

  const featureData = formattedData || [
    { name: '1day Lag Walk-Ins', value: 23.1, color: '#6c5ce7', type: 'ENGINEERED' },
    { name: '24h Science Booking Velocity', value: 18.2, color: '#6c5ce7', type: 'ENGINEERED' },
    { name: 'Daily Max Temperature', value: 13.9, color: '#f9b233', type: 'WEATHER' },
    { name: 'Both Holiday', value: 11.2, color: '#e62b76', type: 'CALENDAR' },
    { name: 'Daily Total Rain', value: 7.4, color: '#f9b233', type: 'WEATHER' },
  ];

  return (
    <div className="bg-[#363636] p-6 rounded-xl border border-[#454545] shadow-lg flex flex-col justify-between">
      {/* Header & Legend matching Figma Demo 4 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl md:text-2xl font-semibold font-roboto text-gray-100 leading-snug">Top Features</h3>
        <div className="flex items-center gap-3 text-[11px] font-bold tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#6c5ce7]" />
            <span className="text-gray-300">ENGINEERED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#f9b233]" />
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
        <div className="md:col-span-4 h-52 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={featureData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={3}
                dataKey="value"
              >
                {featureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#242424',
                  borderColor: '#555555',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Feature List */}
        <div className="md:col-span-8 space-y-2">
          {featureData.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-[#2b2b2b] border border-[#444444]/60"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-gray-200">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-white">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
