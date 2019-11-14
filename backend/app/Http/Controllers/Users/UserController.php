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
    public function user(Request $request)
    {
        $user = $request->user();
        $user->profile = $user->profile;  // Fetch profile relation

        return response()->json($user);
    }
}
