<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'icon',
        'color',
        'description',
    ];

    /**
     * Get all AI tools in this category
     */
    public function aiTools(): HasMany
    {
        return $this->hasMany(AiTool::class);
    }

    /**
     * Get active AI tools in this category
     */
    public function activeTools(): HasMany
    {
        return $this->hasMany(AiTool::class)->where('status', 'active');
    }

    /**
     * Scope a query to find category by slug
     */
    public function scopeBySlug($query, string $slug)
    {
        return $query->where('slug', $slug);
    }
}