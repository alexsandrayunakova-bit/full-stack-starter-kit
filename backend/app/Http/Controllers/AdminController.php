<?php

namespace App\Http\Controllers;

use App\Models\AiTool;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class AdminController extends Controller
{
    /**
     * Get all tools with filters for admin panel
     */
    public function getTools(Request $request)
    {
        $query = AiTool::with(['category', 'creator', 'tags']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by creator role
        if ($request->has('creator_role')) {
            $query->whereHas('creator.role', function ($q) use ($request) {
                $q->where('name', $request->creator_role);
            });
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort - with whitelist to prevent SQL injection
        $allowedSortFields = ['name', 'created_at', 'status', 'views_count'];
        $sortBy = in_array($request->get('sort_by'), $allowedSortFields)
            ? $request->get('sort_by')
            : 'created_at';
        $sortOrder = in_array(strtolower($request->get('sort_order', 'desc')), ['asc', 'desc'])
            ? strtolower($request->get('sort_order', 'desc'))
            : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $tools = $query->paginate($request->get('per_page', 20));

        return response()->json($tools);
    }

    /**
     * Get admin dashboard statistics
     */
    public function getStats()
    {
        // Cache stats for 5 minutes (300 seconds)
        $stats = Cache::remember('admin_dashboard_stats', 300, function () {
            return [
                'total_tools' => AiTool::count(),
                'pending_tools' => AiTool::where('status', 'pending')->count(),
                'active_tools' => AiTool::where('status', 'active')->count(),
                'archived_tools' => AiTool::where('status', 'archived')->count(),
                'total_users' => User::count(),
                'total_categories' => Category::count(),
                'tools_by_category' => AiTool::select('category_id', DB::raw('count(*) as count'))
                    ->with('category:id,name')
                    ->groupBy('category_id')
                    ->get(),
                'tools_by_status' => AiTool::select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->get(),
                'recent_tools' => AiTool::with(['category', 'creator'])
                    ->orderBy('created_at', 'desc')
                    ->take(10)
                    ->get(),
            ];
        });

        return response()->json($stats);
    }

    /**
     * Approve a tool
     */
    public function approveTool($id)
    {
        $tool = AiTool::findOrFail($id);
        $tool->status = 'active';
        $tool->save();

        // Log activity
        $this->logActivity('approved_tool', $tool->id, [
            'tool_name' => $tool->name,
            'previous_status' => $tool->getOriginal('status'),
        ]);

        // Clear caches
        $this->clearCaches();

        return response()->json([
            'message' => 'Tool approved successfully',
            'tool' => $tool->load(['category', 'creator'])
        ]);
    }

    /**
     * Reject a tool
     */
    public function rejectTool($id)
    {
        $tool = AiTool::findOrFail($id);
        $tool->status = 'archived';
        $tool->save();

        // Log activity
        $this->logActivity('rejected_tool', $tool->id, [
            'tool_name' => $tool->name,
            'previous_status' => $tool->getOriginal('status'),
        ]);

        // Clear caches
        $this->clearCaches();

        return response()->json([
            'message' => 'Tool rejected and archived',
            'tool' => $tool->load(['category', 'creator'])
        ]);
    }

    /**
     * Delete a tool permanently
     */
    public function deleteTool($id)
    {
        $tool = AiTool::findOrFail($id);
        $toolName = $tool->name;
        $tool->delete();

        // Log activity
        $this->logActivity('deleted_tool', $id, [
            'tool_name' => $toolName,
        ]);

        // Clear caches
        $this->clearCaches();

        return response()->json([
            'message' => 'Tool deleted successfully'
        ]);
    }

    /**
     * Get all users for admin panel
     */
    public function getUsers(Request $request)
    {
        $query = User::with(['role', 'latestLogin']);

        // Filter by role
        if ($request->has('role_id')) {
            $query->where('role_id', $request->role_id);
        }

        // Search
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->paginate($request->get('per_page', 20));

        return response()->json($users);
    }

    /**
     * Get single user details with login history and activity
     */
    public function getUserDetails($id)
    {
        $user = User::with(['role', 'aiTools', 'recommendations'])
            ->withCount('aiTools')
            ->findOrFail($id);

        // Get login history
        $loginHistory = \App\Models\UserLoginHistory::where('user_id', $id)
            ->orderBy('login_at', 'desc')
            ->take(50)
            ->get();

        // Get tools used (via recommendations)
        $toolsUsed = \App\Models\ToolRecommendation::where('user_id', $id)
            ->with('tool')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get audit logs for this user
        $auditLogs = DB::table('audit_logs')
            ->where('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();

        return response()->json([
            'user' => $user,
            'login_history' => $loginHistory,
            'tools_used' => $toolsUsed,
            'audit_logs' => $auditLogs,
            'stats' => [
                'total_logins' => \App\Models\UserLoginHistory::where('user_id', $id)->count(),
                'tools_created' => $user->ai_tools_count,
                'tools_recommended' => $toolsUsed->count(),
            ],
        ]);
    }

    /**
     * Update user information (only owner and project manager can edit)
     */
    public function updateUser(Request $request, $id)
    {
        $currentUser = auth()->user();

        // Check if user has permission to edit
        if (!in_array($currentUser->role->name, ['owner', 'project_manager'])) {
            return response()->json([
                'error' => 'Unauthorized. Only owners and project managers can edit user information.'
            ], 403);
        }

        $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'company' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date|before:today',
            'country' => 'nullable|string|max:255',
            'profession' => 'nullable|string|max:255',
            'role_id' => 'sometimes|exists:roles,id',
        ]);

        $user->update($validatedData);

        // Log activity
        $this->logActivity('updated_user', null, [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'fields_updated' => array_keys($validatedData),
        ]);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->load('role'),
        ]);
    }

    /**
     * Get audit logs with user information
     */
    public function getAuditLogs(Request $request)
    {
        $query = DB::table('audit_logs')
            ->join('users', 'audit_logs.user_id', '=', 'users.id')
            ->select('audit_logs.*', 'users.name as user_name', 'users.email as user_email');

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('audit_logs.user_id', $request->user_id);
        }

        // Filter by action
        if ($request->has('action')) {
            $query->where('audit_logs.action', $request->action);
        }

        // Date range
        if ($request->has('from_date')) {
            $query->where('audit_logs.created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->where('audit_logs.created_at', '<=', $request->to_date);
        }

        $logs = $query->orderBy('audit_logs.created_at', 'desc')
            ->paginate($request->get('per_page', 50));

        return response()->json($logs);
    }

    /**
     * Log admin activity
     */
    private function logActivity(string $action, $toolId = null, array $metadata = [])
    {
        DB::table('audit_logs')->insert([
            'user_id' => auth()->id(),
            'action' => $action,
            'tool_id' => $toolId,
            'metadata' => json_encode($metadata),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ]);
    }

    /**
     * Clear cached data after tool changes
     */
    private function clearCaches()
    {
        // Clear admin stats cache
        Cache::forget('admin_dashboard_stats');

        // Clear categories with count cache
        Cache::forget('categories_with_count');
    }
}
