<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        $categories = Category::withCount('aiTools')->get();

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