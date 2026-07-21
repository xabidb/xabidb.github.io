import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
          formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
    { date: 'Sep 10', actual: 45, predicted: 42 },
    { date: 'Oct 15', actual: 58, predicted: 54 },
    { date: 'Nov 20', actual: 38, predicted: 41 },
    { date: 'Dec 05', actual: 72, predicted: 68 },
    { date: 'Jan 12', actual: 64, predicted: 65 },
    { date: 'Feb 18', actual: 82, predicted: 79 },
    { date: 'Mar 22', actual: 95, predicted: 91 },
    { date: 'Apr 10', actual: 61, predicted: 64 },
    { date: 'May 04', actual: 88, predicted: 84 },
    { date: 'Jun 19', actual: 76, predicted: 78 },
    { date: 'Jul 25', actual: 110, predicted: 104 },
    { date: 'Aug 30', actual: 125, predicted: 118 },
  ];

  return (
    <div className="bg-[#3b3b3b] p-6 rounded-lg border border-[#444444] shadow-md">
      {/* Header & Legend */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Predicted vs Actual</h3>
        <div className="flex items-center gap-6 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#edc24a]" />
            <span className="text-gray-300">ACTUAL WALK-INS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e62b76]" />
            <span className="text-gray-300">PREDICTED WALK-INS</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#edc24a" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#edc24a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e62b76" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#e62b76" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#444444" vertical={false} />
            <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} interval="preserveStartEnd" />
            <YAxis stroke="#888888" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2b2b2b',
                borderColor: '#555555',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#edc24a"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorActual)"
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#e62b76"
              strokeWidth={4}
              fillOpacity={0}
              fill="url(#colorActual)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
