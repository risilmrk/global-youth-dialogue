import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Shield,
  Calendar,
  Lightbulb,
  MessageSquareQuote,
  BookOpen,
  BarChart3,
  FileClock,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, isSuperAdmin } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Vetting Applications', path: '/applications', icon: Inbox },
    { label: 'User Management', path: '/users', icon: Users },
    { label: 'Sessions & Chambers', path: '/sessions', icon: Calendar },
    { label: 'Topic Pipeline', path: '/topics/pipeline', icon: Lightbulb },
    { label: 'Delegate Feedback', path: '/feedback', icon: MessageSquareQuote },
    { label: 'Research Papers', path: '/publications', icon: BookOpen },
    { label: 'Live Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Audit Trail Logs', path: '/audit-logs', icon: FileClock },
    { label: 'Platform Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-800 dark:text-slate-100">
      {/* Sidebar Desktop */}
      <aside className="w-full md:w-64 bg-gyde-navy text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>GYDE</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gyde-gold text-slate-950 uppercase tracking-widest">
                Secretariat
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
              Executive Administrator Console
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-xs font-bold text-white truncate">{user?.name}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              {user?.role}
            </span>
            <span className="text-[11px] text-slate-400 truncate">{user?.country}</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className={`flex-1 px-3 py-2 space-y-1 overflow-y-auto ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-gyde-green text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
