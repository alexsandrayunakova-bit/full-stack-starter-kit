<?php

namespace App\Http\Controllers;

use App\Models\AiTool;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
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
        $stats = [
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

        return response()->json([
            'message' => 'Tool deleted successfully'
        ]);
    }

    /**
     * Get all users for admin panel
     */
    public function getUsers(Request $request)
    {
        $query = User::with('role');

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
}
