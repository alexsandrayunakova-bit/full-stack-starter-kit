<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ToolRecommendation extends Model
{
    protected $fillable = [
        'tool_id',
        'user_id',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Get the tool this recommendation belongs to
     */
    public function tool(): BelongsTo
    {
        return $this->belongsTo(AiTool::class, 'tool_id');
    }

    /**
     * Get the user who made this recommendation
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for recommendations with rating
     */
    public function scopeWithRating($query)
    {
        return $query->whereNotNull('rating');
    }

    /**
     * Scope for recommendations with comments
     */
    public function scopeWithComments($query)
    {
        return $query->whereNotNull('comment');
    }
}