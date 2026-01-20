<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AiToolController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ToolRecommendationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/status', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'AI Tools API is running',
        'timestamp' => now()->toDateTimeString(),
    ]);
});

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public - Get tags (no auth required)
Route::get('/tags', [App\Http\Controllers\Api\TagController::class, 'index']);
Route::get('/tags/{id}', [App\Http\Controllers\Api\TagController::class, 'show']);

// Public - Get categories (no auth required)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Public - Get roles (no auth required)
Route::get('/roles', [App\Http\Controllers\Api\RoleController::class, 'index']);
Route::get('/roles/{id}', [App\Http\Controllers\Api\RoleController::class, 'show']);

// Public - Browse AI tools (no auth required)
Route::get('/tools', [AiToolController::class, 'index']);
Route::get('/tools/{id}', [AiToolController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // AI Tools (authenticated actions)
    Route::post('/tools', [AiToolController::class, 'store']);
    Route::match(['put', 'post'], '/tools/{id}', [AiToolController::class, 'update']); // Support POST with _method=PUT for file uploads
    Route::delete('/tools/{id}', [AiToolController::class, 'destroy']);
    
    // Recommendations
    Route::post('/recommendations', [ToolRecommendationController::class, 'store']);
    Route::put('/recommendations/{id}', [ToolRecommendationController::class, 'update']);
    Route::delete('/recommendations/{id}', [ToolRecommendationController::class, 'destroy']);
    
});