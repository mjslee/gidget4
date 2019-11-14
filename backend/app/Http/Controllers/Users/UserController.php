<?php
namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


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
        
        $user = $request->user();

        // Update user
        if (isset($user->name)) {
            $user->name = $request->name;
            $user->save();
        }

        // Update user profile
        $user->profile()->updateOrCreate([], [
            'gender' => $request->gender,
            'birthdate' => $request->birthdate,
        ]);

        return response()->json(['message' => 'User updated.']);
    }
}
