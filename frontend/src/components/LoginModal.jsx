import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, AlertCircle, LogIn, Sparkles } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#2b2b2b] text-white w-full max-w-md rounded-xl border border-[#444444] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#3b3b3b] p-6 border-b border-[#444444] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#fcb712]/10 rounded-lg border border-[#fcb712]/20">
              <ShieldCheck className="h-6 w-6 text-[#fcb712]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">StaffOpt V2 Auth</h2>
              <p className="text-xs text-gray-400">Role-Based Access Control System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold p-1 rounded transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Demo Autofill Buttons */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#fcb712]" /> Autofill Demo Credentials
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin@explorium.io', 'adminpassword')}
                className="p-2.5 bg-[#3b3b3b] hover:bg-[#fcb712]/20 border border-[#444444] hover:border-[#fcb712] rounded-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <span className="text-xs font-bold text-[#fcb712] group-hover:text-white">Admin</span>
                <span className="text-[10px] text-gray-400 mt-1">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('manager@explorium.io', 'managerpassword')}
                className="p-2.5 bg-[#3b3b3b] hover:bg-indigo-500/20 border border-[#444444] hover:border-indigo-400 rounded-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <span className="text-xs font-bold text-indigo-400 group-hover:text-white">Manager</span>
                <span className="text-[10px] text-gray-400 mt-1">Schedules</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('viewer@explorium.io', 'viewerpassword')}
                className="p-2.5 bg-[#3b3b3b] hover:bg-emerald-500/20 border border-[#444444] hover:border-emerald-400 rounded-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <span className="text-xs font-bold text-emerald-400 group-hover:text-white">Viewer</span>
                <span className="text-[10px] text-gray-400 mt-1">Read Only</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#444444] w-full"></div>
            <span className="bg-[#2b2b2b] px-3 text-[11px] font-semibold text-gray-500 uppercase absolute">
              Sign In
            </span>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
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
                  className="w-full bg-[#3b3b3b] text-white border border-[#444444] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#fcb712] focus:outline-none"
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
                  className="w-full bg-[#3b3b3b] text-white border border-[#444444] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#fcb712] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#fcb712] hover:bg-[#e0a20f] text-black font-bold text-xs uppercase rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
