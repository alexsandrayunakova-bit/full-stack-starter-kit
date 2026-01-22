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
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-accent-600 via-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            🛡️ Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
            Manage tools, users, and view system statistics
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2">{stats?.total_tools || 0}</div>
              <div className="text-primary-100 font-bold text-lg">Total Tools</div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2">{stats?.pending_tools || 0}</div>
              <div className="text-secondary-100 font-bold text-lg">Pending Approval</div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2">{stats?.active_tools || 0}</div>
              <div className="text-green-100 font-bold text-lg">Active Tools</div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-info-500 to-info-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2">{stats?.total_users || 0}</div>
              <div className="text-info-100 font-bold text-lg">Total Users</div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/tools"
                className="p-6 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-all border-2 border-primary-200 dark:border-primary-800 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🛠️</div>
                <div className="font-semibold text-gray-900 dark:text-white">Manage Tools</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Approve, reject, or delete tools
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="p-6 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-lg transition-all border-2 border-secondary-200 dark:border-secondary-800 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👥</div>
                <div className="font-semibold text-gray-900 dark:text-white">Manage Users</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  View and manage user accounts
                </div>
              </Link>

              <Link
                href="/admin/audit-logs"
                className="p-6 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all border-2 border-green-200 dark:border-green-800 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📋</div>
                <div className="font-semibold text-gray-900 dark:text-white">Audit Logs</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  View system activity history
                </div>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Tools by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tools by Category</h2>
            </CardHeader>
            <CardBody>
              {stats?.tools_by_category.map((item) => (
                <div key={item.category_id} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.category?.name}
                  </span>
                  <Badge variant="primary">{item.count}</Badge>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tools by Status</h2>
            </CardHeader>
            <CardBody>
              {stats?.tools_by_status.map((item) => (
                <div key={item.status} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {item.status}
                  </span>
                  <Badge
                    variant={
                      item.status === 'active' ? 'success' :
                      item.status === 'pending' ? 'warning' :
                      'secondary'
                    }
                  >
                    {item.count}
                  </Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
