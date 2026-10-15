import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const DEMO_ACTIVITY = [
  { month: 'May', sessions: 4, attendees: 48 },
  { month: 'Jun', sessions: 4, attendees: 52 },
  { month: 'Jul', sessions: 5, attendees: 61 },
  { month: 'Aug', sessions: 4, attendees: 58 },
  { month: 'Sep', sessions: 4, attendees: 64 },
  { month: 'Oct', sessions: 5, attendees: 72 },
];

const DISCIPLINE_DISTRIBUTION = [
  { name: 'Technology & AI', value: 35, color: '#4851BA' },
  { name: 'Geopolitics', value: 25, color: '#9E59AC' },
  { name: 'Climate Policy', value: 20, color: '#10B981' },
  { name: 'Education', value: 12, color: '#F59E0B' },
  { name: 'Civil Society', value: 8, color: '#6366F1' },
];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Analytics & Deliberations</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time metrics on debate session attendance, geographic distribution, and paper citations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance trend chart */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Chamber Attendance</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="attendees" fill="#4851BA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Discipline distribution pie chart */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Topic Disciplines Breakdown</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DISCIPLINE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DISCIPLINE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            {DISCIPLINE_DISTRIBUTION.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-slate-600 dark:text-slate-300">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
