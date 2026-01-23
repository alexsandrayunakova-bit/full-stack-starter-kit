import api from './api';

export interface AdminStats {
  total_tools: number;
  pending_tools: number;
  active_tools: number;
  archived_tools: number;
  total_users: number;
  total_categories: number;
  tools_by_category: Array<{
    category_id: number;
    count: number;
    category: { id: number; name: string };
  }>;
  tools_by_status: Array<{
    status: string;
    count: number;
  }>;
  recent_tools: any[];
}

export interface ToolsFilter {
  status?: 'active' | 'pending' | 'archived';
  category_id?: number;
  creator_role?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export const adminApi = {
  /**
   * Get admin dashboard statistics
   */
  async getStats() {
    return api.get<AdminStats>('/api/admin/stats');
  },

  /**
   * Get all tools with filters
   */
  async getTools(filters: ToolsFilter = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    return api.get(`/api/admin/tools?${params.toString()}`);
  },

  /**
   * Approve a tool
   */
  async approveTool(toolId: number) {
    return api.put(`/api/admin/tools/${toolId}/approve`, {});
  },

  /**
   * Reject a tool
   */
  async rejectTool(toolId: number) {
    return api.put(`/api/admin/tools/${toolId}/reject`, {});
  },

  /**
   * Delete a tool permanently
   */
  async deleteTool(toolId: number) {
    return api.delete(`/api/admin/tools/${toolId}`);
  },

  /**
   * Get all users
   */
  async getUsers(filters: { role_id?: number; search?: string; per_page?: number; page?: number } = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    return api.get(`/api/admin/users?${params.toString()}`);
  },

  /**
   * Get single user details with login history and activity
   */
  async getUserDetails(userId: number) {
    return api.get(`/api/admin/users/${userId}`);
  },

  /**
   * Update user information
   */
  async updateUser(userId: number, data: any) {
    return api.put(`/api/admin/users/${userId}`, data);
  },

  /**
   * Get audit logs with filters
   */
  async getAuditLogs(filters: {
    user_id?: number;
    action?: string;
    from_date?: string;
    to_date?: string;
    per_page?: number;
    page?: number;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    return api.get(`/api/admin/audit-logs?${params.toString()}`);
  },
};
