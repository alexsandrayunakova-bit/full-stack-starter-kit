<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of roles
     */
    public function index()
    {
        $roles = Role::all();
        
        return response()->json([
            'data' => $roles
        ]);
    }

    /**
     * Display the specified role
     */
    public function show($id)
    {
        $role = Role::findOrFail($id);
        
        return response()->json([
            'data' => $role
        ]);
    }
}