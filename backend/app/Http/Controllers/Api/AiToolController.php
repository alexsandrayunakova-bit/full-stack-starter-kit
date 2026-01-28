<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiTool;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AiToolController extends Controller
{
    /**
     * Display a listing of AI tools
     */
    public function index(Request $request)
    {
        $query = AiTool::with(['category', 'creator.role', 'recommendations', 'tags'])
    ->active();

        // Filter by category
        if ($request->has('category_id')) {
            $query->byCategory($request->category_id);
        }

        // Filter by tags
        if ($request->has('tags')) {
            $tags = is_array($request->tags) ? $request->tags : [$request->tags];
            $query->whereHas('tags', function ($q) use ($tags) {
                $q->whereIn('tags.id', $tags);
            });
        }

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $tools = $query->paginate($request->get('per_page', 12));

        return response()->json($tools);
    }

/**
 * Store a newly created AI tool
 */
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'url' => 'nullable|url',
        'documentation_url' => 'nullable|url',
        'how_to_use' => 'nullable|string',
        'examples' => 'nullable|string',
        'logo_url' => 'nullable|url',
        'category_id' => 'required|exists:categories,id',
        'role_ids' => 'nullable|array',
        'role_ids.*' => 'exists:roles,id',
        'suitable_for_roles' => 'nullable|array',
        'suitable_for_roles.*' => 'exists:roles,id',
        'tag_ids' => 'nullable|array',
        'tag_ids.*' => 'exists:tags,id',
        'images' => 'nullable|array',
        'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $roleIds = $validated['role_ids'] ?? $validated['suitable_for_roles'] ?? [];

    // Create the tool
    $tool = AiTool::create([
        'name' => $validated['name'],
        'description' => $validated['description'],
        'url' => $validated['url'] ?? null,
        'documentation_url' => $validated['documentation_url'] ?? null,
        'how_to_use' => $validated['how_to_use'] ?? null,
        'examples' => $validated['examples'] ?? null,
        'logo_url' => $validated['logo_url'] ?? null,
        'category_id' => $validated['category_id'],
        'created_by' => $request->user()->id,
        'slug' => \Illuminate\Support\Str::slug($validated['name']),
        'status' => 'active',
        'suitable_for_roles' => $roleIds,
    ]);

    // Sync tags if provided
    if (!empty($validated['tag_ids'])) {
        $tool->tags()->sync($validated['tag_ids']);
    }

    // Handle image uploads (files)
    $imagePaths = [];
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $path = $image->store('tools', 'public');
            $imagePaths[] = $path;
        }
    }
    
    // Handle image URLs
    if ($request->has('image_urls')) {
        $imageUrls = is_array($request->image_urls) ? $request->image_urls : [$request->image_urls];
        $imagePaths = array_merge($imagePaths, $imageUrls);
    }
    
    // Also handle images from formData (for backward compatibility)
    if ($request->has('images') && !$request->hasFile('images')) {
        $imageUrls = is_array($request->images) ? $request->images : [$request->images];
        $imagePaths = array_merge($imagePaths, array_filter($imageUrls, function($url) {
            return filter_var($url, FILTER_VALIDATE_URL);
        }));
    }
    
    if (!empty($imagePaths)) {
        $tool->images = $imagePaths;
        $tool->save();
    }

    return response()->json([
        'message' => 'AI Tool created successfully',
        'tool' => $tool->load(['category', 'creator.role', 'tags']),
    ], 201);
}

    /**
     * Display the specified AI tool
     */
    public function show($id)
    {
        $tool = AiTool::with(['category', 'creator.role', 'recommendations.user.role', 'tags'])
            ->findOrFail($id);

        // Increment views
        $tool->incrementViews();

        return response()->json([
            'tool' => $tool,
            'average_rating' => $tool->average_rating,
            'recommendations_count' => $tool->recommendations_count,
        ]);
    }

    /**
     * Update the specified AI tool
     */
    public function update(Request $request, $id)
    {
        $tool = AiTool::findOrFail($id);

        // Check if user is owner or creator
        if ($tool->created_by !== $request->user()->id && !$request->user()->isOwner()) {
            return response()->json([
                'message' => 'Unauthorized to update this tool',
            ], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'url' => 'nullable|url',
            'documentation_url' => 'nullable|url',
            'how_to_use' => 'nullable|string',
            'examples' => 'nullable|string',
            'logo_url' => 'nullable|url',
            'category_id' => 'sometimes|required|exists:categories,id',
            'suitable_for_roles' => 'nullable|array',
            'suitable_for_roles.*' => 'exists:roles,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
            'status' => 'sometimes|in:active,pending,archived',
            'images' => 'nullable|array',
        ]);

        $tool->update($request->only([
            'name',
            'description',
            'url',
            'documentation_url',
            'how_to_use',
            'examples',
            'logo_url',
            'category_id',
            'suitable_for_roles',
            'status',
            'images',
        ]));

        // Sync tags if provided (accept both 'tags' and 'tag_ids' for compatibility)
        if ($request->has('tags') || $request->has('tag_ids')) {
            $tagIds = $request->tags ?? $request->tag_ids ?? [];
            $tool->tags()->sync($tagIds);
        }

        // Handle image uploads (files) for update
        $imagePaths = $tool->images ?? [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('tools', 'public');
                $imagePaths[] = $path;
            }
        }
        
        // Handle image URLs for update
        if ($request->has('image_urls')) {
            $imageUrls = is_array($request->image_urls) ? $request->image_urls : [$request->image_urls];
            $imagePaths = array_merge($imagePaths, array_filter($imageUrls, function($url) {
                return filter_var($url, FILTER_VALIDATE_URL);
            }));
        }
        
        // Update images if provided
        if ($request->has('images') && !$request->hasFile('images')) {
            $imageUrls = is_array($request->images) ? $request->images : [$request->images];
            $imagePaths = array_filter($imageUrls, function($url) {
                return filter_var($url, FILTER_VALIDATE_URL);
            });
        }
        
        if ($request->has('images') || $request->hasFile('images') || $request->has('image_urls')) {
            $tool->images = $imagePaths;
            $tool->save();
        }

        if ($request->has('name')) {
            $tool->slug = Str::slug($request->name);
            $tool->save();
        }

        return response()->json([
            'message' => 'AI Tool updated successfully',
            'tool' => $tool->load(['category', 'creator.role', 'tags']),
        ]);
    }

    /**
     * Remove the specified AI tool
     */
    public function destroy(Request $request, $id)
    {
        $tool = AiTool::findOrFail($id);

        // Check if user is owner or creator
        if ($tool->created_by !== $request->user()->id && !$request->user()->isOwner()) {
            return response()->json([
                'message' => 'Unauthorized to delete this tool',
            ], 403);
        }

        $tool->delete();

        return response()->json([
            'message' => 'AI Tool deleted successfully',
        ]);
    }
}