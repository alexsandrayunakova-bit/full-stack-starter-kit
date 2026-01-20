<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Display a listing of tags
     */
    public function index()
    {
        $tags = Tag::withCount('aiTools')
            ->orderBy('name')
            ->get();

        return response()->json($tags);
    }

    /**
     * Display the specified tag
     */
    public function show($id)
    {
        $tag = Tag::with(['aiTools.category'])
            ->withCount('aiTools')
            ->findOrFail($id);

        return response()->json($tag);
    }
}