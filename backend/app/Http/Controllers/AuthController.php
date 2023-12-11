<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\LogoutRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'UnAuthorised, Email address or password is not correct'], 401);
        }

        $user = Auth::user();

        if ($user === null) {
            return response()->json(['error' => 'UnAuthorised, Failed to find a user'], 401);
        }

        $token = $user->createToken('authToken')->accessToken;

        return response()->json(['token' => $token], 200);
    }

    public function logout(LogoutRequest $request): JsonResponse
    {
        if ($request->user()) {
            $request->user()->token()->revoke();
            return response()->json([
                'message' => 'Successfully logged out',
            ]);
        }

        return response()->json(['error' => 'UnAuthorised'], 401);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        //create and save user
        User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        return response()->json(['message' => 'Successfully created user'], 201);
    }

}
