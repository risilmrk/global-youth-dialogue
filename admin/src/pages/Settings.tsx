import React from 'react';
import { Settings as SettingsIcon, Shield, Server, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Settings & Security</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure GYDE infrastructure, authentication parameters, and email dispatchers.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm max-w-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Server className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">API Service Connectivity</h3>
            <p className="text-xs text-slate-500">
              REST endpoint is connected to <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">http://localhost:5000/api/v1</code>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">MongoDB Data Layer</h3>
            <p className="text-xs text-slate-500">
              MongoDB with Mongoose schemas, automated memory-server fallback enabled for resilient offline operations.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Role-Based Access Control (RBAC)</h3>
            <p className="text-xs text-slate-500">
              Strict RBAC enforcement for <code>SUPER_ADMIN</code>, <code>ADMIN</code>, <code>COORDINATOR</code>, <code>PRESENTER</code>, and <code>MEMBER</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
