import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LineChart, FileText, Bell, UserCircle, Search, BookOpen, Activity, Calendar, LogOut, Clock, ChevronDown, Briefcase } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Assignments', path: '/student/assignments', icon: BookOpen },
          { name: 'Performance', path: '/student/performance', icon: Activity },
          { name: 'Notifications', path: '/student/notifications', icon: Bell },
          { 
            name: 'Academics', 
            icon: BookOpen, 
            children: [
              { name: 'Timetable', path: '/student/timetable', icon: Clock },
              { name: 'Exams', path: '/student/exams', icon: FileText },
              { name: 'Career Hub', path: '/student/career-hub', icon: Briefcase },
            ]
          },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
          { name: 'Students', path: '/teacher/students', icon: Users },
          { name: 'Class Analytics', path: '/teacher/analytics', icon: LineChart },
          { name: 'Reports', path: '/teacher/reports', icon: FileText },
          { 
            name: 'Academics', 
            icon: BookOpen, 
            children: [
              { name: 'Timetable', path: '/teacher/timetable', icon: Clock },
              { name: 'Exams', path: '/teacher/exams', icon: FileText },
              { name: 'Career Hub', path: '/teacher/career-hub', icon: Briefcase },
            ]
          },
        ];
      case 'parent':
        return [
          { name: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
          { name: 'Child Progress', path: '/parent/progress', icon: Activity },
          { name: 'Attendance', path: '/parent/attendance', icon: Calendar },
          { name: 'Meetings', path: '/parent/meetings', icon: Users },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Students', path: '/admin/students', icon: Users },
          { name: 'Teachers', path: '/admin/teachers', icon: Users },
          { name: 'Departments', path: '/admin/departments', icon: BookOpen },
          { name: 'Insights', path: '/admin/insights', icon: LineChart },
          { name: 'Reports', path: '/admin/reports', icon: FileText },
          { 
            name: 'Academics', 
            icon: BookOpen, 
            children: [
              { name: 'Timetable', path: '/admin/timetable', icon: Clock },
              { name: 'Exams', path: '/admin/exams', icon: FileText },
              { name: 'Career Hub', path: '/admin/career-hub', icon: Briefcase },
            ]
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-200 font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-800 bg-[#0b1220] flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">Student Intel</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-2 ml-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              if (item.children) {
                const isActive = item.children.some(child => location.pathname === child.path);
                return (
                  <div key={item.name} className="relative group">
                    <button
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative",
                        isActive 
                          ? "text-white bg-indigo-500/10" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                      )}
                      <Icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "group-hover:text-slate-300")} />
                      {item.name}
                      <ChevronDown className="w-3 h-3 ml-1 opacity-50 transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-[#1b2433] border border-slate-700 rounded-lg shadow-xl overflow-hidden min-w-[160px] py-1">
                        {item.children.map(child => {
                          const ChildIcon = child.icon;
                          const isChildActive = location.pathname === child.path;
                          return (
                            <Link
                              key={child.name}
                              to={child.path}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                                isChildActive
                                  ? "bg-indigo-500/10 text-indigo-400"
                                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                              )}
                            >
                              <ChildIcon className="w-4 h-4" />
                              {child.name}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group",
                    isActive 
                      ? "text-white bg-indigo-500/10" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                  )}
                  <Icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "group-hover:text-slate-300")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full max-w-[250px] bg-[#1b2433] border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>
          
          <button className="p-2 text-slate-400 hover:text-white transition-colors relative flex-shrink-0">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0b1220]"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700 flex-shrink-0">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user?.name}</span>
              <span className="text-xs text-slate-400 capitalize">{user?.role}</span>
            </div>
            <button className="p-1 rounded-full border border-slate-700 hover:border-slate-500 transition-colors">
              <UserCircle className="w-7 h-7 text-slate-300" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors ml-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
