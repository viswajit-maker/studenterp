import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Activity, Users, ShieldCheck, ArrowRight, Sparkles, BarChart3, Zap } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 bg-[#0a0f1c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Student Intel
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Get Demo Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0f1c] to-[#0a0f1c]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Next-Generation AI Analytics</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-tight">
            Predict Student Success <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Before They Fall Behind
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Student Intel transforms raw educational data into actionable insights. Identify at-risk students instantly and intervene proactively with our AI-driven early warning system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2">
              Access Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800/50 border border-slate-700 text-white font-semibold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              View Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Problem -> Solution Section */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">The Problem with Traditional Education Systems</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <Activity className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2">Reactive, Not Proactive</h3>
                    <p className="text-slate-400">Educators only discover students are struggling after they fail an exam. By then, it's often too late to intervene effectively.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2">Siloed Data</h3>
                    <p className="text-slate-400">Attendance, grades, and participation data live in different systems, making it impossible to see the full picture of a student's academic health.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
              <h2 className="text-3xl font-bold text-white mb-8 relative z-10">The Student Intel Solution</h2>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block mb-1">Unified Intelligence Score (SSIS)</strong>
                    <span className="text-slate-300">A single, comprehensive metric that evaluates real-time student performance across all parameters.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block mb-1">Automated Early Warnings</strong>
                    <span className="text-slate-300">AI algorithms detect subtle patterns of decline and instantly alert teachers before failure occurs.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <BrainCircuit className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block mb-1">AI-Driven Recommendations</strong>
                    <span className="text-slate-300">Get personalized intervention strategies for each at-risk student based on their specific weak points.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Platform Capabilities</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to monitor, analyze, and improve student outcomes in one powerful dashboard.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/40 border border-slate-700 hover:border-indigo-500/50 transition-colors rounded-2xl p-8 group">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Monitoring</h3>
              <p className="text-slate-400 leading-relaxed">Track attendance, assignment completion, and participation metrics as they happen, not weeks later.</p>
            </div>
            
            <div className="bg-slate-800/40 border border-slate-700 hover:border-purple-500/50 transition-colors rounded-2xl p-8 group">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Predictive Analytics</h3>
              <p className="text-slate-400 leading-relaxed">Our machine learning models forecast final grades with 92% accuracy, allowing for timely interventions.</p>
            </div>
            
            <div className="bg-slate-800/40 border border-slate-700 hover:border-emerald-500/50 transition-colors rounded-2xl p-8 group">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Parent & Teacher Portals</h3>
              <p className="text-slate-400 leading-relaxed">Dedicated interfaces for all stakeholders ensure everyone is aligned on the student's academic journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <span className="text-lg font-bold text-white">Student Intel</span>
        </div>
        <p className="text-slate-500 text-sm">© 2026 Student Intel AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
