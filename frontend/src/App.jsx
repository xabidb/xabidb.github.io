import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import PredictedVsActualChart from './components/PredictedVsActualChart';
import ModelComparisonCard from './components/ModelComparisonCard';
import TopFeaturesCard from './components/TopFeaturesCard';
import ForecastStaffingScreen from './components/ForecastStaffingScreen';
import LoginModal from './components/LoginModal';
import LoginScreen from './components/LoginScreen';


import { AuthProvider, useAuth } from './context/AuthContext';
import {
  fetchHealthStatus,
  fetchLatestForecast,
  fetchEvaluationData,
  triggerPipelineRetrain,
} from './services/api';

function MainApp() {
  const { isLoggedIn, loading } = useAuth();
  const [activeScreen, setActiveScreen] = useState('24h');
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [evalData24h, setEvalData24h] = useState(null);
  const [evalData72h, setEvalData72h] = useState(null);
  const [isRetraining, setIsRetraining] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Load health, real-time forecast, and evaluation data with 5s polling interval (only when logged in)
  useEffect(() => {
    if (!isLoggedIn) return;

    async function loadData() {
      const health = await fetchHealthStatus();
      setIsApiConnected(health);

      const latestFc = await fetchLatestForecast();
      if (latestFc) setForecastData(latestFc);

      if (activeScreen === '24h') {
        const data = await fetchEvaluationData('24h');
        if (data) setEvalData24h(data);
      } else if (activeScreen === '72h') {
        const data = await fetchEvaluationData('72h');
        if (data) setEvalData72h(data);
      }
    }

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [activeScreen, isLoggedIn]);


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

  // Loading state while resolving token/auth
  if (loading) {
    return (
      <div className="flex h-screen bg-[#1c1c1c] text-white items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-[#fcb712] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading StaffOpt...</span>
        </div>
      </div>
    );
  }

  // Standalone Full-Screen Login Gate
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col justify-center items-center p-6 overflow-y-auto">
        <div className="w-full max-w-5xl space-y-6 my-auto">
          <div className="text-center space-y-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#f9b233] font-serif tracking-tight">
              explorium
            </h1>
            <p className="text-xs font-extrabold tracking-[0.3em] text-gray-400 uppercase">
              Staffing Optimizer V2
            </p>
          </div>
          <LoginScreen />
        </div>
      </div>
    );
  }

  // Authenticated Main Application Layout
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

          {/* Screen 3: User Authentication & Role Permissions */}
          {activeScreen === 'login' && (
            <LoginScreen onLoginSuccess={() => setActiveScreen('24h')} />
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
