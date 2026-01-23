"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { LoadingPage } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/adminApi";

interface AuditLog {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  action: string;
  tool_id?: number;
  metadata?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export default function AuditLogs() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role?.name !== 'owner')) {
      router.push("/dashboard");
      return;
    }

    if (isAuthenticated && user?.role?.name === 'owner') {
      loadAuditLogs();
    }
  }, [isAuthenticated, authLoading, user, router, currentPage]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAuditLogs({
        page: currentPage,
        per_page: 50,
      });

      if (response.data) {
        setLogs(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
      }
    } catch (error) {
      console.error("Failed to load audit logs:", error);
    }
    setLoading(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('approved')) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    if (action.includes('rejected') || action.includes('deleted')) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    if (action.includes('updated')) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (authLoading || loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || user?.role?.name !== 'owner') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Audit Logs" }
        ]} />

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
              📋 Audit Logs
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View system activity history and user actions
            </p>
          </div>
          <Link href="/admin">
            <Button variant="secondary">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Audit Logs */}
        <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Activity Log ({logs.length})
            </h2>
          </CardHeader>
          <CardBody>
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-slate-500 dark:text-slate-400 text-lg">No audit logs found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionBadgeColor(log.action)}`}>
                            {formatAction(log.action)}
                          </span>
                          <Link
                            href={`/admin/users/${log.user_id}`}
                            className="text-slate-800 dark:text-slate-100 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {log.user_name}
                          </Link>
                          <span className="text-slate-500 dark:text-slate-400 text-sm">{log.user_email}</span>
                        </div>

                        {log.metadata && (
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            <pre className="bg-slate-100 dark:bg-slate-900 p-2 rounded text-xs overflow-x-auto">
                              {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                            </pre>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 mt-2">
                          <span>🕐 {formatDate(log.created_at)}</span>
                          {log.ip_address && (
                            <span>🌐 {log.ip_address}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
    </AdminLayout>
  );
}
