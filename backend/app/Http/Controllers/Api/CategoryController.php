<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        // Cache categories for 1 hour (3600 seconds)
        $categories = Cache::remember('categories_with_count', 3600, function () {
            return Category::withCount('aiTools')->get();
        });

        return response()->json([
            'data' => $categories,
        ]);
    }

    /**
     * Display the specified category with its tools
     */
    public function show($slug)
    {
        $category = Category::bySlug($slug)
            ->with(['activeTools.creator.role'])
            ->withCount('aiTools')
            ->firstOrFail();

        return response()->json([
            'data' => $category,
        ]);
    }
}