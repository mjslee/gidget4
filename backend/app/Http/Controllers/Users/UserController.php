<?php
namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;


class UserController extends Controller
{
    /**
     * Get authenticated user and profile (if exists).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return [json] user object
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $user->profile = $user->profile;  // Fetch profile relation

        return response()->json($user);
    }

    /**
     * Update user and/or user profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return [json] message
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            // User Fields
            'name' => 'sometimes|required|max:255',

            // User Profile Fields
            'gender' => 'sometimes|required|max:255',
            'birthdate' => 'sometimes|required|date'
        ]);
        
        // Fetch user
        $user = $request->user();

        // Update user
        if ($request->filled('name'))
            $user->update(['name' => $request->name]);

        // Update profile
        $user->profile()->updateOrCreate([], $request->except('name'));

        return response()->json(['message' => 'User updated.']);
    }
}
