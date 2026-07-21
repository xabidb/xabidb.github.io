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
    <div className="bg-[#3b3b3b] p-6 rounded-lg border border-[#444444] shadow-md">
      {/* Header & Legend */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Model Comparison</h3>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7173e2]" />
            <span className="text-gray-300">MAE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#edc24a]" />
            <span className="text-gray-300">RMSE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e62b76]" />
            <span className="text-gray-300">R²</span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444444" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2b2b2b',
                borderColor: '#555555',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Bar dataKey="MAE" fill="#7173e2" radius={[4, 4, 0, 0]} />
            <Bar dataKey="RMSE" fill="#edc24a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="R2" fill="#e62b76" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
