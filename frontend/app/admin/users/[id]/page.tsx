"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { LoadingPage } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { adminApi } from "@/lib/adminApi";

export default function UserDetail() {
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [toolsUsed, setToolsUsed] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const canEdit = currentUser?.role?.name === 'owner' || currentUser?.role?.name === 'project_manager';

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || currentUser?.role?.name !== 'owner')) {
      router.push("/dashboard");
      return;
    }

    if (isAuthenticated && currentUser?.role?.name === 'owner') {
      loadUserDetails();
    }
  }, [isAuthenticated, authLoading, currentUser, router, userId]);

  const loadUserDetails = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUserDetails(Number(userId));

      if (response.data) {
        setUser(response.data.user);
        setLoginHistory(response.data.login_history || []);
        setToolsUsed(response.data.tools_used || []);
        setAuditLogs(response.data.audit_logs || []);
        setStats(response.data.stats);

        // Initialize edit form
        setEditForm({
          name: response.data.user.name,
          email: response.data.user.email,
          company: response.data.user.company || '',
          date_of_birth: response.data.user.date_of_birth || '',
          country: response.data.user.country || '',
          profession: response.data.user.profession || '',
        });
      }
    } catch (error) {
      console.error("Failed to load user details:", error);
      showToast("Failed to load user details", "error");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      const response = await adminApi.updateUser(Number(userId), editForm);

      if (response.data) {
        showToast("User updated successfully", "success");
        setUser(response.data.user);
        setIsEditing(false);
      }
    } catch (error: any) {
      showToast(error?.response?.data?.error || "Failed to update user", "error");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (authLoading || loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || currentUser?.role?.name !== 'owner' || !user) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: user?.name || `User #${userId}` }
        ]} />

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
              User Profile: {user.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View and manage user information
            </p>
          </div>
          <Link href="/admin/users">
            <Button variant="secondary">← Back to Users</Button>
          </Link>
        </div>

        {/* User Information Card */}
        <Card className="mb-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">User Information</h2>
            {canEdit && !isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="secondary">
                ✏️ Edit
              </Button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  💾 Save
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="secondary">
                  Cancel
                </Button>
              </div>
            )}
          </CardHeader>
          <CardBody>
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Name</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Company</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{user.company || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Profession</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{user.profession || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Date of Birth</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{user.date_of_birth || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Country</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{user.country || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Role</label>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold">
                    {user.role.display_name}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Registered</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{formatDate(user.created_at)}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  fullWidth
                  disabled={!canEdit}
                />
                <Input
                  type="email"
                  label="Email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  fullWidth
                  disabled={!canEdit}
                />
                <Input
                  type="text"
                  label="Company"
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  fullWidth
                  disabled={!canEdit}
                />
                <Input
                  type="text"
                  label="Profession"
                  value={editForm.profession}
                  onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })}
                  fullWidth
                  disabled={!canEdit}
                />
                <Input
                  type="date"
                  label="Date of Birth"
                  value={editForm.date_of_birth}
                  onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                  fullWidth
                  disabled={!canEdit}
                />
                <Input
                  type="text"
                  label="Country"
                  value={editForm.country}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  fullWidth
                  disabled={!canEdit}
                />
              </div>
            )}
          </CardBody>
        </Card>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
              <CardBody className="text-center py-6">
                <div className="text-4xl font-extrabold mb-2 text-slate-700 dark:text-slate-200">{stats.total_logins}</div>
                <div className="text-slate-600 dark:text-slate-400 font-semibold">Total Logins</div>
              </CardBody>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
              <CardBody className="text-center py-6">
                <div className="text-4xl font-extrabold mb-2 text-slate-700 dark:text-slate-200">{stats.tools_created}</div>
                <div className="text-slate-600 dark:text-slate-400 font-semibold">Tools Created</div>
              </CardBody>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
              <CardBody className="text-center py-6">
                <div className="text-4xl font-extrabold mb-2 text-slate-700 dark:text-slate-200">{stats.tools_recommended}</div>
                <div className="text-slate-600 dark:text-slate-400 font-semibold">Tools Recommended</div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Login History */}
        <Card className="mb-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Login History</h2>
          </CardHeader>
          <CardBody>
            {loginHistory.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">No login history</p>
            ) : (
              <div className="space-y-3">
                {loginHistory.map((login) => (
                  <div key={login.id} className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{formatDate(login.login_at)}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          IP: <span className="font-mono">{login.ip_address}</span>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {login.browser} · {login.platform} · {login.device_type}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Tools Used */}
        {toolsUsed.length > 0 && (
          <Card className="mb-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tools Used/Recommended</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {toolsUsed.map((rec) => (
                  <div key={rec.id} className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{rec.tool?.name}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Rating: {rec.rating}/5 · {formatDate(rec.created_at)}
                        </div>
                        {rec.comment && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{rec.comment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
