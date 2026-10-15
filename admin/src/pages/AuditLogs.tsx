import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';
import { AuditLog } from '../types';
import { FileClock, Search } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ['admin-audit-logs'],
    queryFn: () => apiRequest<AuditLog[]>('/admin/audit-logs'),
  });

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const adminName = l.performedBy?.name || '';
    return (
      l.action.toLowerCase().includes(q) ||
      adminName.toLowerCase().includes(q) ||
      l.targetType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security & Deliberation Audit Trail</h1>
        <p className="text-sm text-slate-500 mt-1">
          Immutable logging of coordinator deliberations, user status modifications, and session accreditation.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit records by action or coordinator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading audit records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <FileClock className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">No audit logs recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Type</th>
                  <th className="py-3 px-4">Coordinator</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-400">
                      {log.targetType}
                    </td>
                    <td className="py-3 px-4">
                      {log.performedBy?.name || 'System Automated'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
