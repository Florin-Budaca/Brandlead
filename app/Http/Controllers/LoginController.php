<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /**
     * Logins the user
     *
     * @param \App\Http\Requests\LoginRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()
            ->select('id', 'email', 'password')
            ->where('email', $request->input('email'))
            ->first();

        if (!$user) {
            return response()->json('User not found', 401);
        }

        if (Hash::check($request->input('password'), $user->password)) {
            auth()->login($user);

            return response()->json($user);
        }

        return response()->json('Password is incorrect', 401);
    }

    /**
     * Logs the csrf token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function csrfToken(): JsonResponse
    {
        return response()->json(csrf_token());
    }
}
