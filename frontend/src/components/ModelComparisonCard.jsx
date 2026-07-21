import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function ModelComparisonCard({ horizon = '24h', metricsData }) {
  const defaultData24h = [
    { name: 'LightGBM', MAE: 14.3, RMSE: 23.8, R2: 60 },
    { name: 'XGBoost', MAE: 14.0, RMSE: 23.1, R2: 62 },
    { name: 'Random Forest', MAE: 12.15, RMSE: 21.74, R2: 66 },
  ];

  const defaultData72h = [
    { name: 'LightGBM', MAE: 24.1, RMSE: 32.8, R2: 80 },
    { name: 'XGBoost', MAE: 22.8, RMSE: 33.7, R2: 79 },
    { name: 'Random Forest', MAE: 21.86, RMSE: 31.93, R2: 81 },
  ];

  const data = metricsData || (horizon === '24h' ? defaultData24h : defaultData72h);

  return (
    <div className="bg-[#363636] p-6 rounded-xl border border-[#454545] shadow-lg">
      {/* Header & Legend matching Figma Demo 4 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-white">Model Comparison</h3>
        <div className="flex items-center gap-4 text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#6c5ce7]" />
            <span className="text-gray-300">MAE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f9b233]" />
            <span className="text-gray-300">RMSE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e62b76]" />
            <span className="text-gray-300">R²</span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#454545" vertical={true} horizontal={false} />
            <XAxis dataKey="name" stroke="#999999" fontSize={11} tickLine={false} axisLine={false} />
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
            <Bar dataKey="MAE" fill="#6c5ce7" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar dataKey="RMSE" fill="#f9b233" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar dataKey="R2" fill="#e62b76" radius={[4, 4, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
