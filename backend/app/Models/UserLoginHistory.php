<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLoginHistory extends Model
{
    protected $table = 'user_login_history';

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'platform',
        'login_at',
    ];

    protected $casts = [
        'login_at' => 'datetime',
    ];

    /**
     * Get the user that owns the login history
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
