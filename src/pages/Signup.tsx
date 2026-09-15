import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { LineChart } from 'lucide-react';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    // Mock signup
    login({ name, email, role });
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] flex flex-col items-center justify-center p-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
          <LineChart className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-semibold text-white tracking-tight">Student Intel</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
              <select 
                value={role || 'student'}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors mt-2"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
