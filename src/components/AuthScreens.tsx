import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  ArrowRight,
  User,
  ShieldCheck,
  Check,
  AlertTriangle,
  Github,
  Chrome,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

type ScreenType = 'login' | 'register' | 'forgot' | 'reset' | 'verify';

interface AuthScreensProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
  onBackToLanding: () => void;
  initialScreen?: ScreenType;
}

export default function AuthScreens({ onAuthSuccess, onBackToLanding, initialScreen = 'login' }: AuthScreensProps) {
  const [screen, setScreen] = useState<ScreenType>(initialScreen);
  
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Interactive error & loading indicators
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password strength meter logic
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', color: 'bg-slate-800', width: 'w-0', score: 0 };
    let score = 1;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4', score };
    if (score === 3) return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/4', score };
    if (score === 4) return { label: 'Good', color: 'bg-indigo-500', width: 'w-3/4', score };
    return { label: 'Strongest', color: 'bg-emerald-400', width: 'w-full', score };
  };

  const strength = getPasswordStrength();

  const handleOAuth = (provider: 'github' | 'google') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess({
        name: provider === 'github' ? 'GitHub Architect' : 'Google Developer',
        email: `auth.${provider}@vexio.ai`
      });
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (screen === 'login') {
      if (!email || !password) {
        setErrorMsg('Please complete all credential fields prior to verification.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onAuthSuccess({
          name: name || 'SaaS Workspace User',
          email: email
        });
      }, 1500);
    } 
    
    else if (screen === 'register') {
      if (!name || !email || !password) {
        setErrorMsg('All registration detail keys are required.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters in length.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg('Register credentials verified! Verification code dispatched to email.');
        setScreen('verify');
      }, 1400);
    } 
    
    else if (screen === 'forgot') {
      if (!email) {
        setErrorMsg('Email address required to dispatch recovery token.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg('Dispatched recovery code successfully!');
        setScreen('reset');
      }, 1200);
    } 
    
    else if (screen === 'reset') {
      if (!resetCode || !password) {
        setErrorMsg('Required token or new credential fields empty.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg('Credentials successfully updated. Try signing in now!');
        setScreen('login');
      }, 1400);
    } 
    
    else if (screen === 'verify') {
      if (!verificationCode) {
        setErrorMsg('Verify code target missing.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onAuthSuccess({
          name: name || 'Verified Developer',
          email: email || 'user@vexio.ai'
        });
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col md:flex-row relative overflow-hidden text-slate-100" id="auth-host">
      
      {/* Visual left column decoration */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-[#0D1530] via-[#0A0F1E] to-[#0A0F1E] border-r border-white/5 relative p-12 flex-col justify-between">
        <div className="absolute top-[-20%] left-[-20%] w-[450px] h-[450px] bg-[#6C63FF]/15 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Core Branding */}
        <div className="flex items-center gap-2 cursor-pointer z-10" onClick={onBackToLanding}>
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/40 rounded-lg text-indigo-400">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <span className="text-xl font-heading font-semibold text-white">Vexio<span className="text-cyan-400">.ai</span></span>
        </div>

        {/* Feature Highlights panel */}
        <div className="my-auto max-w-sm z-10">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">ENTERPRISE GATEWAY</span>
          <h2 className="text-3xl font-heading font-medium text-white tracking-tight leading-tight">
            Secure, multi-tenant pipeline control.
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Access automated categorical analysis, missing value imputation algorithms, and professional analytics dashboards.
          </p>

          <div className="flex flex-col gap-3 mt-8">
            <div className="flex gap-2.5 items-center text-xs text-slate-300 border-b border-white/5 pb-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>SOC2 Type II Private Cloud Compliance</span>
            </div>
            <div className="flex gap-2.5 items-center text-xs text-slate-300 border-b border-white/5 pb-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Full Local Web Sandbox Executions</span>
            </div>
            <div className="flex gap-2.5 items-center text-xs text-slate-400">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Auto Sync with Enterprise Data Warehouses</span>
            </div>
          </div>
        </div>

        {/* System copyright indicator */}
        <div className="text-[11px] text-slate-500 font-mono tracking-widest uppercase z-10">
          VEXIO COMPUTING ENGINE // V3.0
        </div>
      </div>

      {/* Main interaction right column */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        
        {/* Mobile floating layout close button */}
        <button
          onClick={onBackToLanding}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all bg-white/5 py-1.5 px-3 rounded-lg border border-white/10"
          id="btn-close-auth"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Site
        </button>

        <div className="max-w-md w-full glass-panel rounded-2xl p-6 sm:p-9 border-white/10 shadow-2xl relative overflow-hidden" id="form-card">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />

          {/* SCREEN: LOGIN */}
          {screen === 'login' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <h3 className="text-2xl font-heading font-semibold text-white">Welcome back</h3>
                <p className="text-xs text-slate-400 mt-1">Provide your workspace credentials to enter the dashboard</p>
              </div>

              {/* Input: Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all"
                    placeholder="user@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Input: Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-slate-400 font-medium">SECRET PASSWORD</label>
                  <button
                    type="button"
                    onClick={() => setScreen('forgot')}
                    className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Forgot passphrase?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-[11px] text-red-200 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-[11px] text-emerald-200 flex gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Action sign-in */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#6C63FF] hover:bg-[#5b51ff] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-45"
                id="btn-login"
              >
                {loading ? 'Validating Workspace Keys...' : 'Authenticate Profile'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Social Logins */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest text-slate-500">
                  <span className="bg-[#0b1022] px-2">OR SECURE INTER-TIER</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2 border border-white/10 hover:bg-white/5 hover:border-white/20 rounded-xl text-xs text-slate-300 font-medium transition-all cursor-pointer disabled:opacity-40"
                >
                  <Chrome className="w-4 h-4 text-red-400" />
                  Google Core
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2 border border-white/10 hover:bg-white/5 hover:border-white/20 rounded-xl text-xs text-slate-300 font-medium transition-all cursor-pointer disabled:opacity-40"
                >
                  <Github className="w-4 h-4" />
                  GitHub API
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 mt-2">
                New to the Vexio mesh?{' '}
                <button
                  type="button"
                  onClick={() => setScreen('register')}
                  className="text-[#00D4FF] font-semibold hover:underline cursor-pointer"
                >
                  Create Architect Profile First
                </button>
              </p>
            </form>
          )}

          {/* SCREEN: REGISTER */}
          {screen === 'register' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <h3 className="text-2xl font-heading font-semibold text-white">Create Workspace</h3>
                <p className="text-xs text-slate-400 mt-1">Register a new isolated multi-tenant secure sandbox</p>
              </div>

              {/* Input: Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">FULL NAME</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] transition-all"
                    placeholder="Alexander Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Input: Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">EMAIL ACCOUNT</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] transition-all"
                    placeholder="alex@mercer.tech"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Input: Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">SECRET PASSPHRASE</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] transition-all"
                    placeholder="Min 6 characters..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {/* Strength slider */}
                {password && (
                  <div className="mt-1 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">Strength Indicator:</span>
                      <span className="font-mono font-bold text-[#00D4FF] uppercase">{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input: Repeat Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">VERIFY PASSPHRASE</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] transition-all"
                    placeholder="Verify password input..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-[11px] text-red-200 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#6C63FF] hover:bg-[#5b51ff] text-white text-xs font-bold uppercase tracking-wide rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
              >
                {loading ? 'Spinning isolated sandbox...' : 'Generate Profile'}
              </button>

              <p className="text-center text-xs text-slate-400 mt-2">
                Already registered with Vexio?{' '}
                <button
                  type="button"
                  onClick={() => setScreen('login')}
                  className="text-cyan-400 font-semibold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* SCREEN: FORGOT PASSWORD */}
          {screen === 'forgot' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => setScreen('login')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return To Sign In
                </button>
                <h3 className="text-2xl font-heading font-semibold text-white">Recover Key</h3>
                <p className="text-xs text-slate-400 mt-1">Dispatched secret authentication tokens directly to your registered terminal</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">REGISTERED EMAIL</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#6C63FF] transition-all"
                    placeholder="Your secure email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-[11px] text-red-200">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#00D4FF] hover:bg-[#00c6ee] text-slate-950 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
              >
                {loading ? 'Broadcasting Recovery Protocol...' : 'Send Recovery Token'}
              </button>
            </form>
          )}

          {/* SCREEN: RESET PASSWORD */}
          {screen === 'reset' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <h3 className="text-2xl font-heading font-semibold text-white">Reset Credentials</h3>
                <p className="text-xs text-slate-400 mt-1">Input the dispatched alpha token to configure new credentials</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">RECOVERY CODE</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-200 font-mono tracking-widest text-center"
                  placeholder="VEX-XXXX"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">NEW PASSPHRASE</label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-200"
                  placeholder="Enter secure password credentials..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-[11px] text-red-200">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-lg"
              >
                {loading ? 'Re-keying credential algorithms...' : 'Change Password'}
              </button>
            </form>
          )}

          {/* SCREEN: EMAIL VERIFICATION */}
          {screen === 'verify' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <h3 className="text-2xl font-heading font-semibold text-white">Verify Account</h3>
                <p className="text-xs text-slate-400 mt-1">An isolated verification code was broadcasted to your verified mail server.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium uppercase font-mono">Input 6-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 text-lg font-mono tracking-[0.5em] text-center text-cyan-400 font-semibold"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-[11px] text-red-200">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#6C63FF] hover:bg-[#5b51ff] text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-lg"
              >
                {loading ? 'Checking code array...' : 'Activate Portal Mesh'}
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
