import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function PredictedVsActualChart({ data }) {
  // Format dates for display
  const formattedData = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.map((item) => {
      let formattedDate = item.date;
      if (item.date && item.date.includes('-')) {
        const parts = item.date.split('-');
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          formattedDate = d.toLocaleDateString('en-US', { month: 'short' });
        }
      }
      return {
        ...item,
        date: formattedDate,
        actual: Math.round(item.actual),
        predicted: Math.round(item.predicted),
      };
    });
  }, [data]);

  const chartData = formattedData || [
    { date: 'Sep', actual: 25, predicted: 15 },
    { date: 'Oct', actual: 48, predicted: 22 },
    { date: 'Nov', actual: 18, predicted: 28 },
    { date: 'Dec', actual: 32, predicted: 12 },
    { date: 'Jan', actual: 55, predicted: 25 },
    { date: 'Feb', actual: 10, predicted: 32 },
    { date: 'Mar', actual: 42, predicted: 12 },
    { date: 'Apr', actual: 28, predicted: 32 },
    { date: 'May', actual: 20, predicted: 60 },
    { date: 'Jun', actual: 28, predicted: 25 },
    { date: 'Jul', actual: 12, predicted: 30 },
    { date: 'Aug', actual: 50, predicted: 55 },
  ];

  return (
    <div className="bg-[#363636] p-6 rounded-xl border border-[#454545] shadow-lg">
      {/* Header & Legend matching Figma Demo 4 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h3 className="text-base font-bold text-white">Predicted vs Actual</h3>
        <div className="flex items-center gap-5 text-[11px] font-bold tracking-wider">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f9b233]" />
            <span className="text-gray-300">ACTUAL WALK-INS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e62b76]" />
            <span className="text-gray-300">PREDICTED WALK-INS</span>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#454545" vertical={true} horizontal={false} />
            <XAxis dataKey="date" stroke="#999999" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#999999" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} ticks={[0, 25, 50, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#242424',
                borderColor: '#555555',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#f9b233"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#f9b233' }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#e62b76"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#e62b76' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
