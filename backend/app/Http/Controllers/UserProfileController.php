<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\UserProfile;


class UserProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateOrCreate(Request $request)
    {
        request()->validate([
            'name'                  => 'string',
            'gender'                => 'string',
            'age'                   => 'integer',
            'has_coding_experience' => 'string',
        ]);

        $year = date('Y');
        $birthyear = $year - $request->age;

        $birthdate = $birthyear > 0 && $birthyear < $year ?
            Carbon::create($birthyear, 1, 1, 0, 0, 0, 'GMT') : null;

        $user = $request->user();
        $profile = $user->profile()->updateOrCreate([], [
            'name'                  => $request->name,
            'gender'                => $request->gender,
            'has_coding_experience' => $request->has_coding_experience
            'birthdate'             => $birthdate,
        ]);

        return response()->json([
            'mesage' => 'User profile updated.'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\UserProfile  $userProfile
     * @return \Illuminate\Http\Response
     */
    public function show(UserProfile $userProfile)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\UserProfile  $userProfile
     * @return \Illuminate\Http\Response
     */
    public function edit(UserProfile $userProfile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\UserProfile  $userProfile
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserProfile $userProfile)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\UserProfile  $userProfile
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserProfile $userProfile)
    {
        //
    }
}
