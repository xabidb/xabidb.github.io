import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Users, AlertTriangle, Calendar, Clock, Sparkles } from 'lucide-react';

export default function ForecastStaffingScreen({ forecastData }) {
  const [horizon, setHorizon] = useState('24h');
  const [staffRatio, setStaffRatio] = useState(20);
  const [department, setDepartment] = useState('all');

  const filterHours = horizon === '24h' ? 24 : horizon === '72h' ? 72 : 168;

  // Derive forecast stats dynamically
  const predictions = useMemo(() => {
    if (!forecastData?.predictions) return [];
    return forecastData.predictions.slice(0, filterHours);
  }, [forecastData, filterHours]);

  const stats = useMemo(() => {
    if (predictions.length === 0) {
      return { total: 0, peakTime: 'N/A', peakVal: 0, recommendedStaff: 0 };
    }
    let total = 0;
    let peakVal = 0;
    let peakTime = '';

    predictions.forEach((p) => {
      total += p.predicted_footfall;
      if (p.predicted_footfall > peakVal) {
        peakVal = p.predicted_footfall;
        const dt = new Date(p.timestamp);
        peakTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    });

    const recommendedStaff = Math.max(1, Math.ceil(peakVal / staffRatio));

    return {
      total: Math.round(total),
      peakTime,
      peakVal: Math.round(peakVal),
      recommendedStaff,
    };
  }, [predictions, staffRatio]);

  // Hourly curve mapping for chart
  const chartData = useMemo(() => {
    return predictions.map((p) => {
      const timeLabel = new Date(p.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        month: 'short',
        day: '2-digit',
      });
      return {
        time: timeLabel,
        predicted: p.predicted_footfall,
        lower: p.lower_bound,
        upper: p.upper_bound,
        staff: Math.ceil(p.predicted_footfall / staffRatio),
      };
    });
  }, [predictions, staffRatio]);

  return (
    <div className="p-6 space-y-6">
      {/* Parameters Controls */}
      <div className="bg-[#3b3b3b] p-6 rounded-lg border border-[#444444] shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Horizon Toggle */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            Forecast Horizon
          </label>
          <div className="flex bg-[#2b2b2b] p-1 rounded-lg border border-[#444444]">
            {['24h', '72h', '7d'].map((opt) => (
              <button
                key={opt}
                onClick={() => setHorizon(opt)}
                className={`flex-1 py-1.5 rounded text-xs font-semibold uppercase transition-all ${
                  horizon === opt
                    ? 'bg-[#fcb712] text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Ratio Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Staffing Ratio
            </label>
            <span className="text-xs font-bold text-[#fcb712]">
              1 Staff / {staffRatio} Visitors
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            value={staffRatio}
            onChange={(e) => setStaffRatio(parseInt(e.target.value))}
            className="w-full accent-[#fcb712] bg-[#2b2b2b] h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            Target Area
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-[#2b2b2b] text-white border border-[#444444] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#fcb712] focus:outline-none"
          >
            <option value="all">All Departments</option>
            <option value="science">Science Area</option>
            <option value="activities">Activities Zone</option>
            <option value="parties">Party Rooms</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#3b3b3b] p-5 rounded-lg border border-[#444444] shadow flex items-center gap-4">
          <div className="p-3 bg-[#fcb712]/10 rounded-lg">
            <Users className="h-6 w-6 text-[#fcb712]" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase">Total Predicted Visitors</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#3b3b3b] p-5 rounded-lg border border-[#444444] shadow flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-lg">
            <Clock className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase">Peak Time & Count</p>
            <p className="text-2xl font-bold text-white">
              {stats.peakVal} <span className="text-xs font-medium text-gray-400">({stats.peakTime})</span>
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#3b3b3b] p-5 rounded-lg border border-[#444444] shadow flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase">Peak Recommended Staff</p>
            <p className="text-2xl font-bold text-white">{stats.recommendedStaff}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#3b3b3b] p-5 rounded-lg border border-[#444444] shadow flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase">Model Bounds</p>
            <p className="text-2xl font-bold text-white">
              ±15% <span className="text-xs font-medium text-gray-400">Confidence</span>
            </p>
          </div>
        </div>
      </div>

      {/* Hourly Curve and Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Footfall Chart */}
        <div className="lg:col-span-8 bg-[#3b3b3b] p-6 rounded-lg border border-[#444444] shadow-md">
          <h3 className="text-lg font-semibold text-white mb-6">Hourly Forecast Curve</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fcb712" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#fcb712" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" vertical={false} />
                <XAxis dataKey="time" stroke="#888888" fontSize={10} tickLine={false} />
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
                  dataKey="predicted"
                  stroke="#fcb712"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorForecast)"
                />
                {chartData[0]?.upper && (
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="#555"
                    strokeDasharray="3 3"
                    fill="transparent"
                  />
                )}
                {chartData[0]?.lower && (
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stroke="#555"
                    strokeDasharray="3 3"
                    fill="transparent"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suggested Shift Blocks */}
        <div className="lg:col-span-4 bg-[#3b3b3b] p-6 rounded-lg border border-[#444444] shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Suggested Shifts</h3>
            <div className="space-y-4">
              {/* Shift 1 */}
              <div className="p-4 bg-[#2b2b2b] rounded-lg border border-[#444444]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#fcb712] uppercase tracking-wider">
                    Morning Block
                  </span>
                  <span className="text-xs text-gray-400">08:30 AM - 01:30 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">Recommended Staff:</span>
                  <span className="bg-[#fcb712]/10 text-[#fcb712] px-3 py-0.5 rounded text-sm font-bold border border-[#fcb712]/20">
                    {Math.max(1, Math.ceil(stats.recommendedStaff * 0.7))} Staff
                  </span>
                </div>
              </div>

              {/* Shift 2 */}
              <div className="p-4 bg-[#2b2b2b] rounded-lg border border-[#444444]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Afternoon Block
                  </span>
                  <span className="text-xs text-gray-400">01:00 PM - 06:30 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">Recommended Staff:</span>
                  <span className="bg-indigo-500/10 text-indigo-400 px-3 py-0.5 rounded text-sm font-bold border border-indigo-400/20">
                    {stats.recommendedStaff} Staff
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#444444] text-[11px] text-gray-400 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Shift plan is synchronized with predicted peak time {stats.peakTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
