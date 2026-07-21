import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  AlertCircle,
  LogIn,
  LogOut,
  Sparkles,
  CheckCircle2,
  Sliders,
  Database,
  BarChart3,
} from 'lucide-react';

export default function LoginScreen({ onLoginSuccess }) {
  const { user, isLoggedIn, login, logout, hasRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-[#fcb712]/10 text-[#fcb712] border-[#fcb712]/30';
      case 'manager':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-400/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30';
    }
  };

  return (
    <div className="p-6 max-w-[1440px] space-y-6">
      {isLoggedIn ? (
        /* Logged In User Profile View */
        <div className="bg-[#3b3b3b] p-8 rounded-xl border border-[#444444] shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4 border-b border-[#444444] pb-6">
            <div className="p-4 bg-[#fcb712]/10 rounded-full border border-[#fcb712]/30">
              <User className="h-10 w-10 text-[#fcb712]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">{user.full_name}</h3>
                <span
                  className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded border ${getRoleBadgeStyle(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Role Permissions Overview
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-[#2b2b2b] rounded-lg border border-[#444444] text-xs">
                <div className="flex items-center gap-2 font-semibold text-white mb-1">
                  <BarChart3 className="h-4 w-4 text-emerald-400" /> Dashboard Viewing
                </div>
                <span className="text-emerald-400 font-bold">Enabled</span>
              </div>

              <div className="p-3 bg-[#2b2b2b] rounded-lg border border-[#444444] text-xs">
                <div className="flex items-center gap-2 font-semibold text-white mb-1">
                  <Sliders className="h-4 w-4 text-indigo-400" /> Roster Tuning
                </div>
                <span className={hasRole(['admin', 'manager']) ? 'text-indigo-400 font-bold' : 'text-gray-500'}>
                  {hasRole(['admin', 'manager']) ? 'Enabled' : 'Restricted'}
                </span>
              </div>

              <div className="p-3 bg-[#2b2b2b] rounded-lg border border-[#444444] text-xs">
                <div className="flex items-center gap-2 font-semibold text-white mb-1">
                  <Database className="h-4 w-4 text-[#fcb712]" /> ML Retraining
                </div>
                <span className={hasRole('admin') ? 'text-[#fcb712] font-bold' : 'text-gray-500'}>
                  {hasRole('admin') ? 'Enabled' : 'Restricted'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#444444] flex justify-end">
            <button
              onClick={logout}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase rounded-lg shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out Account
            </button>
          </div>
        </div>
      ) : (
        /* Sign In Screen View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Role Capabilities */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#3b3b3b] p-6 rounded-xl border border-[#444444] shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-[#fcb712]/10 rounded-lg border border-[#fcb712]/20">
                  <ShieldCheck className="h-6 w-6 text-[#fcb712]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">StaffOpt Access Control</h3>
                  <p className="text-xs text-gray-400">Multi-tier RBAC for Forecasting & Planning</p>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                StaffOpt V2 implements strict Role-Based Access Control to govern forecasting engines, sensitive pipeline retraining routines, and facility staffing configurations.
              </p>
            </div>

            {/* Role Tiers Breakdown */}
            <div className="space-y-4">
              {/* Admin Tier */}
              <div className="bg-[#3b3b3b] p-5 rounded-xl border border-[#444444] hover:border-[#fcb712]/50 transition-all shadow">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#fcb712]/10 text-[#fcb712] border border-[#fcb712]/30 px-2.5 py-0.5 rounded text-xs font-extrabold uppercase">
                      Admin
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Full Privileges</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-[#fcb712]" />
                </div>
                <ul className="text-xs text-gray-300 space-y-1 mt-2 list-disc list-inside">
                  <li>Trigger ML model pipeline retraining</li>
                  <li>Ingest and overwrite historical footfall datasets</li>
                  <li>Full access to 24h & 72h evaluation metrics</li>
                </ul>
              </div>

              {/* Manager Tier */}
              <div className="bg-[#3b3b3b] p-5 rounded-xl border border-[#444444] hover:border-indigo-400/50 transition-all shadow">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-400/30 px-2.5 py-0.5 rounded text-xs font-extrabold uppercase">
                      Manager
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Planning Control</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                </div>
                <ul className="text-xs text-gray-300 space-y-1 mt-2 list-disc list-inside">
                  <li>Configure staffing ratios & department filters</li>
                  <li>Generate shift recommendations and roster blocks</li>
                  <li>Ingest data records</li>
                </ul>
              </div>

              {/* Viewer Tier */}
              <div className="bg-[#3b3b3b] p-5 rounded-xl border border-[#444444] hover:border-emerald-400/50 transition-all shadow">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-400/30 px-2.5 py-0.5 rounded text-xs font-extrabold uppercase">
                      Viewer
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Read Only</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <ul className="text-xs text-gray-300 space-y-1 mt-2 list-disc list-inside">
                  <li>View 24h & 72h footfall evaluation charts</li>
                  <li>Inspect predicted vs actual model accuracy curves</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Form */}
          <div className="lg:col-span-6 bg-[#3b3b3b] p-8 rounded-xl border border-[#444444] shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Sign In to StaffOpt</h3>
              <p className="text-xs text-gray-400 mt-1">
                Enter your credentials or choose a quick demo profile below.
              </p>
            </div>

            {/* Quick Demo Pre-fill Cards */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#fcb712]" /> Pre-fill Demo Profile Credentials
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin@explorium.io', 'adminpassword')}
                  className="p-3 bg-[#2b2b2b] hover:bg-[#fcb712]/20 border border-[#444444] hover:border-[#fcb712] rounded-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#fcb712] group-hover:text-white">Admin</span>
                  <span className="text-[10px] text-gray-400 mt-1">Full Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemo('manager@explorium.io', 'managerpassword')}
                  className="p-3 bg-[#2b2b2b] hover:bg-indigo-500/20 border border-[#444444] hover:border-indigo-400 rounded-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <span className="text-xs font-bold text-indigo-400 group-hover:text-white">Manager</span>
                  <span className="text-[10px] text-gray-400 mt-1">Schedules</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemo('viewer@explorium.io', 'viewerpassword')}
                  className="p-3 bg-[#2b2b2b] hover:bg-emerald-500/20 border border-[#444444] hover:border-emerald-400 rounded-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <span className="text-xs font-bold text-emerald-400 group-hover:text-white">Viewer</span>
                  <span className="text-[10px] text-gray-400 mt-1">Read Only</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#444444] w-full"></div>
              <span className="bg-[#3b3b3b] px-3 text-[11px] font-semibold text-gray-500 uppercase absolute">
                Credentials Form
              </span>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@explorium.io"
                    className="w-full bg-[#2b2b2b] text-white border border-[#444444] rounded-lg pl-9 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-[#fcb712] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#2b2b2b] text-white border border-[#444444] rounded-lg pl-9 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-[#fcb712] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#fcb712] hover:bg-[#e0a20f] text-black font-bold text-xs uppercase rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                {isSubmitting ? 'Authenticating...' : 'Sign In Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
