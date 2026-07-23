import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import realModelEvalData from '../data/real_model_evaluation.json';

export default function PredictedVsActualChart({ data }) {
  // Real trained ML model evaluation dataset (Holdout Test Split from backend training)
  const defaultRealModelData = React.useMemo(() => {
    return realModelEvalData?.['24h']?.test_eval_points || [];
  }, []);

  // Format dataset for 98-day test split chart
  const chartData = React.useMemo(() => {
    const rawData = (data && data.length > 0) ? data : defaultRealModelData;
    return rawData.map((item) => {
      let displayDate = item.displayDate || item.date;
      let monthName = item.month || item.date;

      if (item.date && item.date.includes('-')) {
        const parts = item.date.split('-');
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          monthName = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      }

      return {
        ...item,
        dateLabel: displayDate,
        monthName: monthName,
        actual: Math.round(item.actual),
        predicted: Math.round(item.predicted),
      };
    });
  }, [data, defaultRealModelData]);

  return (
    <div className="bg-[#363636] p-3.5 sm:p-5 rounded-xl border border-[#454545] shadow-lg">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div>
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold font-roboto text-white leading-snug">
            Predicted vs Actual Walk-Ins
          </h3>
          <p className="text-[11px] sm:text-xs text-white/50 font-roboto font-light mt-0.5">
            Currently displaying the best model's test split predictions vs actual walk-ins
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] font-bold tracking-wider shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#edc24a]" />
            <span className="text-xs sm:text-sm font-medium font-roboto text-white/60">ACTUAL WALK-INS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e62b76]" />
            <span className="text-xs sm:text-sm font-medium font-roboto text-white/60">PREDICTED WALK-INS</span>
          </div>
        </div>
      </div>

      {/* 98-Day Holdout Test Split Composed Chart */}
      <div className="h-48 sm:h-56 md:h-64 lg:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 15 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#edc24a" stopOpacity={0.2} />
                <stop offset="85%" stopColor="#edc24a" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#454545" vertical={true} horizontal={false} />
            <XAxis
              dataKey="monthName"
              stroke="#999999"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={14}
              dy={10}
            />
            <YAxis stroke="#999999" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: '#242424',
                borderColor: '#555555',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value, name) => [
                `${value} visitors`,
                name === 'actual' ? 'Actual Walk-Ins' : 'Predicted Walk-Ins',
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0 && payload[0].payload) {
                  return `Date: ${payload[0].payload.dateLabel}`;
                }
                return `Date: ${label}`;
              }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#edc24a"
              strokeWidth={2}
              fill="url(#actualGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#edc24a' }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#e62b76"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#e62b76' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
