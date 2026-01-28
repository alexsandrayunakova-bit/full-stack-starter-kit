<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if 2FA is enabled
        if ($user->two_factor_enabled) {
            // If email 2FA, send code
            if ($user->two_factor_method === 'email') {
                $code = random_int(100000, 999999);
                Cache::put("2fa_login_{$user->id}", $code, 600);

                Mail::raw("Your login verification code is: {$code}\n\nThis code will expire in 10 minutes.", function ($message) use ($user) {
                    $message->to($user->email)
                        ->subject('Login Verification Code');
                });
            }

            return response()->json([
                'requires_2fa' => true,
                'two_factor_method' => $user->two_factor_method,
                'user_id' => $user->id,
                'message' => $user->two_factor_method === 'email'
                    ? 'Verification code sent to your email'
                    : 'Please enter your authenticator code',
            ]);
        }

        // Log the login
        $this->logUserLogin($user, $request);

        // Delete old tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Register new user
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'max:128',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/',
            ],
            'role_id' => 'required|exists:roles,id',
            'company' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date|before:today',
            'country' => 'nullable|string|max:255',
            'profession' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'company' => $request->company,
            'date_of_birth' => $request->date_of_birth,
            'country' => $request->country,
            'profession' => $request->profession,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
        ], 201);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('role');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Log user login
     */
    private function logUserLogin(User $user, Request $request)
    {
        $userAgent = $request->userAgent();

        \App\Models\UserLoginHistory::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $userAgent,
            'device_type' => $this->detectDeviceType($userAgent),
            'browser' => $this->detectBrowser($userAgent),
            'platform' => $this->detectPlatform($userAgent),
            'login_at' => now(),
        ]);
    }

    /**
     * Detect device type from user agent
     */
    private function detectDeviceType(?string $userAgent): string
    {
        if (!$userAgent) return 'unknown';

        if (preg_match('/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i', $userAgent)) {
            return 'mobile';
        } elseif (preg_match('/tablet|ipad/i', $userAgent)) {
            return 'tablet';
        }
        return 'desktop';
    }

    /**
     * Detect browser from user agent
     */
    private function detectBrowser(?string $userAgent): string
    {
        if (!$userAgent) return 'unknown';

        if (preg_match('/Edge/i', $userAgent)) return 'Edge';
        if (preg_match('/Chrome/i', $userAgent)) return 'Chrome';
        if (preg_match('/Safari/i', $userAgent)) return 'Safari';
        if (preg_match('/Firefox/i', $userAgent)) return 'Firefox';
        if (preg_match('/MSIE|Trident/i', $userAgent)) return 'Internet Explorer';

        return 'unknown';
    }

    /**
     * Detect platform from user agent
     */
    private function detectPlatform(?string $userAgent): string
    {
        if (!$userAgent) return 'unknown';

        if (preg_match('/Windows/i', $userAgent)) return 'Windows';
        if (preg_match('/Mac OS X/i', $userAgent)) return 'macOS';
        if (preg_match('/Linux/i', $userAgent)) return 'Linux';
        if (preg_match('/Android/i', $userAgent)) return 'Android';
        if (preg_match('/iOS|iPhone|iPad/i', $userAgent)) return 'iOS';

        return 'unknown';
    }
}