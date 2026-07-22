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
      <div className="bg-[#3b3b3b] text-white w-full max-w-3xl rounded-2xl border border-[#444444] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative animate-in fade-in zoom-in duration-200">
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
        <div className="p-8 space-y-6 bg-[#3b3b3b] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold p-1 rounded transition-colors cursor-pointer"
          >
            &times;
          </button>
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
    </div>
  );
}
