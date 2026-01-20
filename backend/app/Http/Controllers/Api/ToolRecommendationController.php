<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ToolRecommendation;
use Illuminate\Http\Request;

class ToolRecommendationController extends Controller
{
    /**
     * Store a new recommendation
     */
    public function store(Request $request)
    {
        $request->validate([
            'tool_id' => 'required|exists:ai_tools,id',
            'rating' => 'nullable|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Check if user already recommended this tool
        $existing = ToolRecommendation::where('tool_id', $request->tool_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already recommended this tool. Use update instead.',
            ], 422);
        }

        $recommendation = ToolRecommendation::create([
            'tool_id' => $request->tool_id,
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'message' => 'Recommendation added successfully',
            'recommendation' => $recommendation->load(['user.role']),
        ], 201);
    }

    /**
     * Update existing recommendation
     */
    public function update(Request $request, $id)
    {
        $recommendation = ToolRecommendation::findOrFail($id);

        // Check if user owns this recommendation
        if ($recommendation->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized to update this recommendation',
            ], 403);
        }

        $request->validate([
            'rating' => 'nullable|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $recommendation->update($request->only(['rating', 'comment']));

        return response()->json([
            'message' => 'Recommendation updated successfully',
            'recommendation' => $recommendation,
        ]);
    }

    /**
     * Delete recommendation
     */
    public function destroy(Request $request, $id)
    {
        $recommendation = ToolRecommendation::findOrFail($id);

        // Check if user owns this recommendation
        if ($recommendation->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this recommendation',
            ], 403);
        }

        $recommendation->delete();

        return response()->json([
            'message' => 'Recommendation deleted successfully',
        ]);
    }
}