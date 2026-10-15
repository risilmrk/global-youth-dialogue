import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';
import { DashboardStats } from '../types';
import {
  Users,
  Inbox,
  Calendar,
  BookOpen,
  Lightbulb,
  FileClock,
  ArrowRight,
  TrendingUp,
  Globe,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: () => apiRequest<DashboardStats>('/admin/dashboard/stats'),
  });

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Aggregating live platform metrics...</p>
      </div>
    );
  }

  const kpis = [
    { label: 'Pending Applications', value: stats?.pendingApplications || 0, icon: Inbox, color: 'text-amber-600', link: '/applications?status=pending' },
    { label: 'Approved Members', value: stats?.totalMembers || 0, icon: Users, color: 'text-emerald-600', link: '/users' },
    { label: 'Active Presenters', value: stats?.activePresenters || 0, icon: Award, color: 'text-purple-600', link: '/users?role=PRESENTER' },
    { label: 'Upcoming Sessions', value: stats?.upcomingSessions || 0, icon: Calendar, color: 'text-blue-600', link: '/sessions' },
    { label: 'Topics in Pipeline', value: stats?.topicsInReview || 0, icon: Lightbulb, color: 'text-yellow-600', link: '/topics/pipeline' },
    { label: 'Published Papers', value: stats?.publishedPapers || 0, icon: BookOpen, color: 'text-teal-600', link: '/publications' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Secretariat Programme Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time platform metrics, application intake, and chamber pipeline monitoring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/sessions"
            className="px-4 py-2 bg-gyde-green text-white text-xs font-bold rounded-lg shadow hover:bg-gyde-green-light transition-colors"
          >
            Create Session
          </Link>
          <Link
            to="/applications"
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow hover:bg-slate-800 transition-colors"
          >
            Review Intake
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={i}
              to={kpi.link}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-gyde-green transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${kpi.color}`} />
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                  {kpi.value}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                  {kpi.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sessions Activity Trend */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gyde-green" />
              <span>Chamber Sessions & Debates Trend</span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.sessionsTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0E4D3C" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications by Country */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gyde-gold" />
              <span>Delegates by Country Representation</span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Intake</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.applicationsByCountry || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="country" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#B88E3E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Secretariat Audit Activity Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <FileClock className="w-4 h-4 text-gyde-green" />
            <span>Recent Administrative Audit Events</span>
          </h2>
          <Link to="/audit-logs" className="text-xs font-bold text-gyde-green hover:underline">
            View Complete Audit Log
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Performed By</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{log.performedBy?.name}</div>
                      <div className="text-[10px] text-slate-400">{log.performedBy?.role}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {log.targetType}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400 italic">
                    No recent audit entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
