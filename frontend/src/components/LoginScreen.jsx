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
    <div className="p-6 w-full space-y-6">
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
        <div className="max-w-3xl mx-auto w-full bg-[#3b3b3b] rounded-2xl border border-[#444444] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Half: Yellow Brand Accent */}
          <div className="bg-[#f9b233] text-[#333333] p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <img src="/Logo.svg" alt="Explorium Staffing Optimizer" className="h-10 w-auto object-contain" />
              <div>
                <p className="text-xs font-semibold text-[#333333]/80 mt-1">
                  AI-Powered Visitor Footfall & Workforce Forecasting
                </p>
              </div>
            </div>
            <div className="text-xs text-[#333333]/70 font-medium">
              <p>© Explorium Staffing Optimizer V1</p>
            </div>
          </div>

          {/* Right Half: Sign In Form */}
          <div className="p-8 space-y-6 bg-[#3b3b3b]">
            <div>
              <h3 className="text-xl font-bold text-white">Sign In to StaffOpt</h3>
              <p className="text-xs text-gray-400 mt-1">
                Enter your credentials below to access the staffing optimization system.
              </p>
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
