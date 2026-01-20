<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class AiTool extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'url',
        'documentation_url',
        'how_to_use',
        'examples',
        'logo_url',
        'images',
        'category_id',
        'created_by',
        'suitable_for_roles',
        'status',
        'views_count',
    ];

    protected $casts = [
        'suitable_for_roles' => 'array',
        'images' => 'array',
        'views_count' => 'integer',
    ];

    /**
     * Get the category this tool belongs to
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the user who created this tool
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all recommendations for this tool
     */
    public function recommendations(): HasMany
    {
        return $this->hasMany(ToolRecommendation::class, 'tool_id');
    }

    /**
     * Get average rating
     */
    public function getAverageRatingAttribute()
    {
        return $this->recommendations()->avg('rating');
    }

    /**
     * Get total recommendations count
     */
    public function getRecommendationsCountAttribute()
    {
        return $this->recommendations()->count();
    }

    /**
     * Scope for active tools
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for tools by category
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope for tools suitable for a specific role
     */
    public function scopeForRole($query, $roleId)
    {
        return $query->whereJsonContains('suitable_for_roles', $roleId);
    }

    /**
     * Increment views count
     */
    public function incrementViews()
    {
        $this->increment('views_count');
    }
    
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'ai_tool_tag');
    }
}