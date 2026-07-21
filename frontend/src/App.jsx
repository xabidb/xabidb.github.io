import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import PredictedVsActualChart from './components/PredictedVsActualChart';
import ModelComparisonCard from './components/ModelComparisonCard';
import TopFeaturesCard from './components/TopFeaturesCard';
import ForecastStaffingScreen from './components/ForecastStaffingScreen';
import LoginModal from './components/LoginModal';

import { AuthProvider } from './context/AuthContext';
import {
  fetchHealthStatus,
  fetchLatestForecast,
  fetchEvaluationData,
  triggerPipelineRetrain,
} from './services/api';

function MainApp() {
  const [activeScreen, setActiveScreen] = useState('24h');
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [evalData24h, setEvalData24h] = useState(null);
  const [evalData72h, setEvalData72h] = useState(null);
  const [isRetraining, setIsRetraining] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Load API health and default forecast on mount
  useEffect(() => {
    async function loadInitialData() {
      const health = await fetchHealthStatus();
      const connected = health.status === 'ok';
      setIsApiConnected(connected);

      if (connected) {
        const data = await fetchLatestForecast();
        if (data) {
          setForecastData(data);
        }
      }
    }
    loadInitialData();

    const interval = setInterval(async () => {
      const health = await fetchHealthStatus();
      const connected = health.status === 'ok';
      setIsApiConnected(connected);
      if (connected && !forecastData) {
        const data = await fetchLatestForecast();
        if (data) setForecastData(data);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [forecastData]);

  // Fetch evaluation split data dynamically based on active screen
  useEffect(() => {
    async function loadEvaluation() {
      if (activeScreen === '24h' && !evalData24h) {
        const data = await fetchEvaluationData('24h');
        if (data) setEvalData24h(data);
      } else if (activeScreen === '72h' && !evalData72h) {
        const data = await fetchEvaluationData('72h');
        if (data) setEvalData72h(data);
      }
    }
    if (isApiConnected) {
      loadEvaluation();
    }
  }, [activeScreen, isApiConnected, evalData24h, evalData72h]);

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      await triggerPipelineRetrain();
      setEvalData24h(null);
      setEvalData72h(null);
      const updatedForecast = await fetchLatestForecast();
      if (updatedForecast) {
        setForecastData(updatedForecast);
      }
    } catch (err) {
      alert(`Pipeline retraining failed: ${err.message}`);
    } finally {
      setIsRetraining(false);
    }
  };

  const getBestModel = () => {
    if (activeScreen === '24h') {
      return evalData24h?.best_model || 'Random Forest';
    }
    return evalData72h?.best_model || 'Random Forest';
  };

  // 24h Metrics Extractors (with notebook fallbacks)
  const getMetrics24h = () => {
    const bestModel = getBestModel();
    const metrics = evalData24h?.metrics?.[bestModel] || { MAE: 12.15, RMSE: 21.74, R2: 0.66 };
    return {
      mae: metrics.MAE,
      rmse: metrics.RMSE,
      r2: Math.round(metrics.R2 * 100),
    };
  };

  // 72h Metrics Extractors (with notebook fallbacks)
  const getMetrics72h = () => {
    const bestModel = getBestModel();
    const metrics = evalData72h?.metrics?.[bestModel] || { MAE: 21.86, RMSE: 31.93, R2: 0.81 };
    return {
      mae: metrics.MAE,
      rmse: metrics.RMSE,
      r2: Math.round(metrics.R2 * 100),
    };
  };

  const m24 = getMetrics24h();
  const m72 = getMetrics72h();

  // Map API response to Recharts formatted comparison data
  const getComparisonData = (horizon) => {
    const evalData = horizon === '24h' ? evalData24h : evalData72h;
    if (!evalData?.metrics) return null;
    return Object.keys(evalData.metrics).map((modelName) => ({
      name: modelName,
      MAE: evalData.metrics[modelName].MAE,
      RMSE: evalData.metrics[modelName].RMSE,
      R2: Math.round(evalData.metrics[modelName].R2 * 100),
    }));
  };

  return (
    <div className="flex h-screen bg-[#333333] text-white font-sans overflow-hidden">
      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        isApiConnected={isApiConnected}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header
          activeScreen={activeScreen}
          bestModel={getBestModel()}
          onRetrain={handleRetrain}
          isRetraining={isRetraining}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        <main className="flex-1">
          {/* Screen 1: 24h Model Performance */}
          {activeScreen === '24h' && (
            <div className="p-6 space-y-6 max-w-[1440px]">
              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Mean Absolute Error"
                  value={m24.mae}
                  maxVal={50}
                  colorScheme="purple"
                />
                <MetricCard
                  title="Root Mean Square Error"
                  value={m24.rmse}
                  maxVal={100}
                  colorScheme="gold"
                />
                <MetricCard
                  title="Coefficient of Determination"
                  value={m24.r2}
                  unit="%"
                  maxVal={100}
                  colorScheme="pink"
                />
              </div>

              {/* Middle Section: Predicted vs Actual Chart */}
              <PredictedVsActualChart data={evalData24h?.test_eval_points} />

              {/* Bottom Row: Model Comparison & Top Features */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ModelComparisonCard horizon="24h" metricsData={getComparisonData('24h')} />
                <TopFeaturesCard data={evalData24h?.feature_importances} />
              </div>
            </div>
          )}

          {/* Screen 1: 72h Model Performance */}
          {activeScreen === '72h' && (
            <div className="p-6 space-y-6 max-w-[1440px]">
              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Mean Absolute Error"
                  value={m72.mae}
                  maxVal={50}
                  colorScheme="purple"
                />
                <MetricCard
                  title="Root Mean Square Error"
                  value={m72.rmse}
                  maxVal={100}
                  colorScheme="gold"
                />
                <MetricCard
                  title="Coefficient of Determination"
                  value={m72.r2}
                  unit="%"
                  maxVal={100}
                  colorScheme="pink"
                />
              </div>

              {/* Middle Section: Predicted vs Actual Chart */}
              <PredictedVsActualChart data={evalData72h?.test_eval_points} />

              {/* Bottom Row: Model Comparison & Top Features */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ModelComparisonCard horizon="72h" metricsData={getComparisonData('72h')} />
                <TopFeaturesCard data={evalData72h?.feature_importances} />
              </div>
            </div>
          )}

          {/* Screen 2: Daily Forecast & Staffing */}
          {activeScreen === 'forecast' && (
            <ForecastStaffingScreen forecastData={forecastData} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
