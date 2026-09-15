import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, ArrowRight, Sparkles } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic mock login validation
    if ((email === 'admin@studentintel.com' || email === 'admin@successintel.com') && password === 'admin123') {
      login({ name: 'System Admin', email, role: 'admin' });
      navigate('/admin/dashboard');
    } else if (email.includes('student')) {
      login({ name: 'Demo Student', email, role: 'student' });
      navigate('/student/dashboard');
    } else if (email.includes('teacher')) {
      login({ name: 'Demo Teacher', email, role: 'teacher' });
      navigate('/teacher/dashboard');
    } else if (email.includes('parent')) {
      login({ name: 'Demo Parent', email, role: 'parent' });
      navigate('/parent/dashboard');
    } else {
      alert('Invalid credentials. Try demo buttons.');
    }
  };

  const demoLogin = (role: 'student' | 'teacher' | 'parent' | 'admin') => {
    let user;
    if (role === 'admin') {
      user = { name: 'System Admin', email: 'admin@studentintel.com', role };
    } else if (role === 'teacher') {
      user = { name: 'Dr. Alan Turing', email: 'alan.turing@studentintel.edu', role };
    } else {
      user = { name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`, email: `${role}@demo.com`, role };
    }
    login(user);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex bg-[#0a0f1c] font-sans selection:bg-indigo-500/30">
      {/* Left Panel - Branding & Info */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-[#0a0f1c] via-indigo-950/40 to-purple-950/40 border-r border-slate-800/50">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/abstract/1920/1080?blur=10')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#0a0f1c]"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Student Intel
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Analytics</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Predict, Intervene, and <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Empower Student Success
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Join the next generation of educational intelligence. Monitor performance, predict outcomes, and provide targeted support when it matters most.
          </p>
        </div>

        <div className="relative z-10 mt-auto pt-20">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>© 2026 Student Intel AI</span>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Student Intel</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-3">Welcome back</h2>
            <p className="text-slate-400">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 mb-8">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.edu"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              Sign In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0f1c] text-slate-500 font-medium">Or continue with demo access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button onClick={() => demoLogin('student')} className="py-2.5 border border-slate-800 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all">
              Student Demo
            </button>
            <button onClick={() => demoLogin('teacher')} className="py-2.5 border border-slate-800 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all">
              Teacher Demo
            </button>
            <button onClick={() => demoLogin('parent')} className="py-2.5 border border-slate-800 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all">
              Parent Demo
            </button>
            <button onClick={() => demoLogin('admin')} className="py-2.5 border border-slate-800 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all">
              Admin Demo
            </button>
          </div>

          <p className="text-center text-sm text-slate-400">
            Don't have an account? <Link to="/signup" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">Request access</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
