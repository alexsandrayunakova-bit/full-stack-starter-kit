"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { LoadingPage } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { adminApi, ToolsFilter } from "@/lib/adminApi";
import type { AiTool, Category } from "@/lib/types";
import api from "@/lib/api";

export default function AdminToolsManagement() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [tools, setTools] = useState<AiTool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState<ToolsFilter>({
    status: undefined,
    category_id: undefined,
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 20,
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role?.name !== 'owner')) {
      router.push("/dashboard");
      return;
    }

    if (isAuthenticated && user?.role?.name === 'owner') {
      loadCategories();
      loadTools();
    }
  }, [isAuthenticated, authLoading, user, router, currentPage, filters]);

  const loadCategories = async () => {
    const response = await api.get<{ data: Category[] }>('/api/categories');
    if (response.data?.data) {
      setCategories(response.data.data);
    }
  };

  const loadTools = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getTools({ ...filters, page: currentPage });
      if (response.data?.data) {
        setTools(response.data.data);
        setTotalPages(response.data.last_page || 1);
      }
    } catch (error) {
      console.error("Failed to load tools:", error);
      showToast("Failed to load tools", "error");
    }
    setLoading(false);
  };

  const handleApproveTool = async (toolId: number) => {
    try {
      await adminApi.approveTool(toolId);
      showToast("Tool approved successfully", "success");
      loadTools(); // Reload
    } catch (error) {
      console.error("Failed to approve tool:", error);
      showToast("Failed to approve tool", "error");
    }
  };

  const handleRejectTool = async (toolId: number) => {
    try {
      await adminApi.rejectTool(toolId);
      showToast("Tool rejected and archived", "success");
      loadTools(); // Reload
    } catch (error) {
      console.error("Failed to reject tool:", error);
      showToast("Failed to reject tool", "error");
    }
  };

  const handleDeleteTool = async (toolId: number, toolName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${toolName}"?`)) {
      return;
    }

    try {
      await adminApi.deleteTool(toolId);
      showToast("Tool deleted permanently", "success");
      loadTools(); // Reload
    } catch (error) {
      console.error("Failed to delete tool:", error);
      showToast("Failed to delete tool", "error");
    }
  };

  const handleFilterChange = (key: keyof ToolsFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page
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
          { label: "Tools Management" }
        ]} />

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
              🛠️ Tools Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Approve, reject, or delete AI tools
            </p>
          </div>
          <Link href="/admin">
            <Button variant="secondary">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category_id || ''}
                  onChange={(e) => handleFilterChange('category_id', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                  placeholder="Search by name..."
                  className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tools List */}
        <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Tools ({tools.length})
            </h2>
          </CardHeader>
          <CardBody>
            {tools.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-slate-500 dark:text-slate-400 text-lg">No tools found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {tool.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tool.status === 'active'
                              ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              : tool.status === 'pending'
                              ? 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-200'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {tool.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {tool.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                          <span>Category: {tool.category?.name}</span>
                          <span>Created by: {tool.creator?.name}</span>
                          <span>Views: {tool.views_count}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {tool.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleApproveTool(tool.id)}
                              className="text-sm bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white"
                            >
                              ✓ Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectTool(tool.id)}
                              variant="secondary"
                              className="text-sm border-2 border-slate-300 dark:border-slate-600"
                            >
                              ✗ Reject
                            </Button>
                          </>
                        )}
                        {tool.status === 'active' && (
                          <Button
                            onClick={() => handleRejectTool(tool.id)}
                            variant="secondary"
                            className="text-sm border-2 border-slate-300 dark:border-slate-600"
                          >
                            Archive
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteTool(tool.id, tool.name)}
                          className="text-sm bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white border-2 border-red-400 dark:border-red-500"
                        >
                          🗑️ Delete
                        </Button>
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
