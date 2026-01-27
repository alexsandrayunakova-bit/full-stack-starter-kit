<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    /**
     * Enable 2FA for the authenticated user
     */
    public function enable(Request $request)
    {
        $request->validate([
            'method' => 'required|in:email,google_authenticator',
            'password' => 'required|string',
        ]);

        $user = auth()->user();

        // Verify password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Invalid password'
            ], 401);
        }

        $method = $request->method;

        if ($method === 'google_authenticator') {
            // Generate secret for Google Authenticator
            $google2fa = new Google2FA();
            $secret = $google2fa->generateSecretKey();

            // Generate QR code URL
            $qrCodeUrl = $google2fa->getQRCodeUrl(
                config('app.name'),
                $user->email,
                $secret
            );

            // Save secret temporarily (not enabled yet)
            $user->two_factor_secret = encrypt($secret);
            $user->save();

            return response()->json([
                'message' => '2FA setup initiated. Please scan the QR code and verify with a code.',
                'secret' => $secret,
                'qr_code_url' => $qrCodeUrl,
            ]);
        } elseif ($method === 'email') {
            // Generate and send verification code via email
            $code = rand(100000, 999999);

            // Store code in cache for 10 minutes
            Cache::put("2fa_setup_{$user->id}", $code, 600);

            // Send email (using log for development, configure SMTP for production)
            Mail::raw("Your 2FA verification code is: {$code}\n\nThis code will expire in 10 minutes.", function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Two-Factor Authentication Setup');
            });

            return response()->json([
                'message' => 'Verification code sent to your email. Please verify to enable 2FA.',
                'method' => 'email',
            ]);
        }
    }

    /**
     * Verify and activate 2FA
     */
    public function verify(Request $request)
    {
        $request->validate([
            'method' => 'required|in:email,google_authenticator',
            'code' => 'required|string',
        ]);

        $user = auth()->user();
        $method = $request->method;

        if ($method === 'google_authenticator') {
            if (!$user->two_factor_secret) {
                return response()->json([
                    'error' => '2FA not initiated. Please enable 2FA first.'
                ], 400);
            }

            $google2fa = new Google2FA();
            $secret = decrypt($user->two_factor_secret);

            $valid = $google2fa->verifyKey($secret, $request->code);

            if (!$valid) {
                return response()->json([
                    'error' => 'Invalid verification code'
                ], 400);
            }

            // Generate recovery codes
            $recoveryCodes = $this->generateRecoveryCodes();

            // Enable 2FA
            $user->two_factor_enabled = true;
            $user->two_factor_method = 'google_authenticator';
            $user->two_factor_recovery_codes = encrypt(json_encode($recoveryCodes));
            $user->save();

            return response()->json([
                'message' => '2FA enabled successfully with Google Authenticator',
                'recovery_codes' => $recoveryCodes,
            ]);

        } elseif ($method === 'email') {
            $cachedCode = Cache::get("2fa_setup_{$user->id}");

            if (!$cachedCode) {
                return response()->json([
                    'error' => 'Verification code expired. Please request a new one.'
                ], 400);
            }

            if ($cachedCode !== (string)$request->code) {
                return response()->json([
                    'error' => 'Invalid verification code'
                ], 400);
            }

            // Generate recovery codes
            $recoveryCodes = $this->generateRecoveryCodes();

            // Enable 2FA
            $user->two_factor_enabled = true;
            $user->two_factor_method = 'email';
            $user->two_factor_recovery_codes = encrypt(json_encode($recoveryCodes));
            $user->save();

            // Clear cache
            Cache::forget("2fa_setup_{$user->id}");

            return response()->json([
                'message' => '2FA enabled successfully with Email',
                'recovery_codes' => $recoveryCodes,
            ]);
        }
    }

    /**
     * Disable 2FA
     */
    public function disable(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = auth()->user();

        // Verify password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Invalid password'
            ], 401);
        }

        // Disable 2FA
        $user->two_factor_enabled = false;
        $user->two_factor_method = null;
        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->save();

        return response()->json([
            'message' => '2FA disabled successfully'
        ]);
    }

    /**
     * Verify 2FA code during login
     */
    public function verifyLogin(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'code' => 'required|string',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);

        if (!$user->two_factor_enabled) {
            return response()->json([
                'error' => '2FA is not enabled for this user'
            ], 400);
        }

        if ($user->two_factor_method === 'google_authenticator') {
            $google2fa = new Google2FA();
            $secret = decrypt($user->two_factor_secret);

            $valid = $google2fa->verifyKey($secret, $request->code);

            if (!$valid) {
                // Check if it's a recovery code
                if ($this->verifyRecoveryCode($user, $request->code)) {
                    return response()->json([
                        'success' => true,
                        'message' => '2FA verified with recovery code',
                        'token' => $user->createToken('auth_token')->plainTextToken,
                        'user' => $user->load('role'),
                    ]);
                }

                return response()->json([
                    'error' => 'Invalid verification code'
                ], 400);
            }

        } elseif ($user->two_factor_method === 'email') {
            $cachedCode = Cache::get("2fa_login_{$user->id}");

            if (!$cachedCode) {
                return response()->json([
                    'error' => 'Verification code expired. Please request a new one.'
                ], 400);
            }

            if ($cachedCode !== (string)$request->code) {
                // Check if it's a recovery code
                if ($this->verifyRecoveryCode($user, $request->code)) {
                    Cache::forget("2fa_login_{$user->id}");
                    return response()->json([
                        'success' => true,
                        'message' => '2FA verified with recovery code',
                        'token' => $user->createToken('auth_token')->plainTextToken,
                        'user' => $user->load('role'),
                    ]);
                }

                return response()->json([
                    'error' => 'Invalid verification code'
                ], 400);
            }

            // Clear cache
            Cache::forget("2fa_login_{$user->id}");
        }

        return response()->json([
            'success' => true,
            'message' => '2FA verified successfully',
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user->load('role'),
        ]);
    }

    /**
     * Send 2FA code for email method during login
     */
    public function sendLoginCode(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);

        if (!$user->two_factor_enabled || $user->two_factor_method !== 'email') {
            return response()->json([
                'error' => 'Email 2FA is not enabled for this user'
            ], 400);
        }

        // Generate and send verification code via email
        $code = rand(100000, 999999);

        // Store code in cache for 10 minutes
        Cache::put("2fa_login_{$user->id}", $code, 600);

        // Send email
        Mail::raw("Your login verification code is: {$code}\n\nThis code will expire in 10 minutes.", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Login Verification Code');
        });

        return response()->json([
            'message' => 'Verification code sent to your email',
        ]);
    }

    /**
     * Get 2FA status for authenticated user
     */
    public function status()
    {
        $user = auth()->user();

        return response()->json([
            'enabled' => $user->two_factor_enabled,
            'method' => $user->two_factor_method,
        ]);
    }

    /**
     * Generate recovery codes
     */
    private function generateRecoveryCodes($count = 8)
    {
        $codes = [];
        for ($i = 0; $i < $count; $i++) {
            $codes[] = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        }
        return $codes;
    }

    /**
     * Verify recovery code
     */
    private function verifyRecoveryCode($user, $code)
    {
        if (!$user->two_factor_recovery_codes) {
            return false;
        }

        $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);

        if (in_array(strtoupper($code), $recoveryCodes)) {
            // Remove used code
            $recoveryCodes = array_diff($recoveryCodes, [strtoupper($code)]);
            $user->two_factor_recovery_codes = encrypt(json_encode(array_values($recoveryCodes)));
            $user->save();

            return true;
        }

        return false;
    }
}
