<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'company',
        'date_of_birth',
        'country',
        'profession',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
        ];
    }
    /**
     * Get the user's role
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get AI tools created by this user
     */
    public function aiTools(): HasMany
    {
        return $this->hasMany(AiTool::class, 'created_by');
    }

    /**
     * Get recommendations made by this user
     */
    public function recommendations(): HasMany
    {
        return $this->hasMany(ToolRecommendation::class);
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $roleName): bool
    {
        return $this->role && $this->role->name === $roleName;
    }

    /**
     * Check if user is owner
     */
    public function isOwner(): bool
    {
        return $this->hasRole('owner');
    }

    /**
     * Get user's login history
     */
    public function loginHistory(): HasMany
    {
        return $this->hasMany(UserLoginHistory::class);
    }

    /**
     * Get user's latest login
     */
    public function latestLogin()
    {
        return $this->hasOne(UserLoginHistory::class)->latestOfMany('login_at');
    }
}