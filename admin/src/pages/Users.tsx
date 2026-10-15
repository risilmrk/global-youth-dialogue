import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';
import { User, UserRole } from '../types';
import {
  Users as UsersIcon,
  Search,
  Shield,
  UserCheck,
  UserX,
  KeyRound,
  Filter
} from 'lucide-react';

export const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users', roleFilter],
    queryFn: () =>
      apiRequest<User[]>(
        `/admin/users${roleFilter !== 'all' ? `?role=${roleFilter}` : ''}`
      ),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      apiRequest(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' }) =>
      apiRequest(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.country && u.country.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Directory & Roles</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage authenticated youth debaters, keynote presenters, and secretariat coordinators.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'MEMBER', 'PRESENTER', 'COORDINATOR', 'ADMIN', 'SUPER_ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                roleFilter === r
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading user records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <UsersIcon className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Country & Org</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{u.country || 'Global'}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                        {u.organization || 'Independent'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          updateRoleMutation.mutate({ id: u.id, role: e.target.value as UserRole })
                        }
                        className="text-xs font-semibold px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                      >
                        <option value="MEMBER">Member</option>
                        <option value="PRESENTER">Presenter</option>
                        <option value="COORDINATOR">Coordinator</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: u.id,
                            status: u.status === 'active' ? 'suspended' : 'active',
                          })
                        }
                        className={`px-2.5 py-1 text-xs font-semibold rounded ${
                          u.status === 'active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
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
