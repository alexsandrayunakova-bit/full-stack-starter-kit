"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LoadingPage } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { adminApi, AdminStats } from "@/lib/adminApi";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is owner
    if (!authLoading && (!isAuthenticated || user?.role?.name !== 'owner')) {
      router.push("/dashboard");
      return;
    }

    if (isAuthenticated && user?.role?.name === 'owner') {
      loadStats();
    }
  }, [isAuthenticated, authLoading, user, router]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || user?.role?.name !== 'owner') {
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
            🛡️ Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Manage tools, users, and view system statistics
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all hover:border-slate-300 dark:hover:border-slate-600">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2 text-slate-700 dark:text-slate-200">{stats?.total_tools || 0}</div>
              <div className="text-slate-600 dark:text-slate-400 font-semibold text-lg">Total Tools</div>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all hover:border-slate-300 dark:hover:border-slate-600">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2 text-slate-700 dark:text-slate-200">{stats?.pending_tools || 0}</div>
              <div className="text-slate-600 dark:text-slate-400 font-semibold text-lg">Pending Approval</div>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all hover:border-slate-300 dark:hover:border-slate-600">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2 text-slate-700 dark:text-slate-200">{stats?.active_tools || 0}</div>
              <div className="text-slate-600 dark:text-slate-400 font-semibold text-lg">Active Tools</div>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all hover:border-slate-300 dark:hover:border-slate-600">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2 text-slate-700 dark:text-slate-200">{stats?.total_users || 0}</div>
              <div className="text-slate-600 dark:text-slate-400 font-semibold text-lg">Total Users</div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/tools"
                className="p-6 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900/70 rounded-lg transition-all border-2 border-blue-400 dark:border-blue-500 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🛠️</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">Manage Tools</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Approve, reject, or delete tools
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="p-6 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900/70 rounded-lg transition-all border-2 border-purple-400 dark:border-purple-500 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👥</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">Manage Users</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  View and manage user accounts
                </div>
              </Link>

              <Link
                href="/admin/audit-logs"
                className="p-6 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900/70 rounded-lg transition-all border-2 border-emerald-400 dark:border-emerald-500 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📋</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">Audit Logs</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  View system activity history
                </div>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Tools by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tools by Category</h2>
            </CardHeader>
            <CardBody>
              {stats?.tools_by_category.map((item) => (
                <div key={item.category_id} className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {item.category?.name}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                    {item.count}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tools by Status</h2>
            </CardHeader>
            <CardBody>
              {stats?.tools_by_status.map((item) => (
                <div key={item.status} className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                  <span className="font-medium text-slate-800 dark:text-slate-100 capitalize">
                    {item.status}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                    {item.count}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
