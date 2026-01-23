"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { LoadingPage } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/adminApi";

interface UserWithLogin {
  id: number;
  name: string;
  email: string;
  company?: string;
  profession?: string;
  role: {
    id: number;
    name: string;
    display_name: string;
  };
  latest_login?: {
    id: number;
    ip_address: string;
    login_at: string;
    device_type: string;
    browser: string;
    platform: string;
  };
  created_at: string;
}

export default function UsersManagement() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithLogin[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<{
    search?: string;
    role_id?: number;
  }>({});
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role?.name !== 'owner')) {
      router.push("/dashboard");
      return;
    }

    if (isAuthenticated && user?.role?.name === 'owner') {
      loadUsers();
      loadRoles();
    }
  }, [isAuthenticated, authLoading, user, router, currentPage, filters]);

  const loadRoles = async () => {
    // Load roles for filter
    const response = await fetch('/api/roles');
    if (response.ok) {
      const data = await response.json();
      setRoles(data.data || []);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers({
        ...filters,
        page: currentPage,
        per_page: 20,
      });

      if (response.data) {
        setUsers(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
    setLoading(false);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const loginDate = new Date(date);
    const diffMs = now.getTime() - loginDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
              👥 Users Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View and manage user accounts
            </p>
          </div>
          <Link href="/admin">
            <Button variant="secondary">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Role
                </label>
                <select
                  value={filters.role_id || ''}
                  onChange={(e) => handleFilterChange('role_id', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                >
                  <option value="">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.display_name}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Users Table */}
        <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Users ({users.length})
            </h2>
          </CardHeader>
          <CardBody>
            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-slate-500 dark:text-slate-400 text-lg">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Last Login</th>
                      <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">IP Address</th>
                      <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="py-3 px-4">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="text-slate-800 dark:text-slate-100 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {user.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold">
                            {user.role.display_name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {user.latest_login ? (
                            <div>
                              <div className="font-medium">{formatTimeAgo(user.latest_login.login_at)}</div>
                              <div className="text-xs text-slate-500">{formatDate(user.latest_login.login_at)}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">Never</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {user.latest_login ? (
                            <div>
                              <div className="font-mono text-sm">{user.latest_login.ip_address}</div>
                              <div className="text-xs text-slate-500">
                                {user.latest_login.browser} · {user.latest_login.platform}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/admin/users/${user.id}`}>
                            <Button
                              variant="secondary"
                              className="text-sm border-2 border-purple-400 dark:border-purple-500"
                            >
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  variant="secondary"
                  className="border-2 border-slate-300 dark:border-slate-600"
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-slate-700 dark:text-slate-300 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  variant="secondary"
                  className="border-2 border-slate-300 dark:border-slate-600"
                >
                  Next
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
