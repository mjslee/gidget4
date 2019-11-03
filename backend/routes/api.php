<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::group(['middleware' => ['web']], function () {
//     // GitHub Auth
//     Route::get('login/github', 'Auth\GitHubLoginController@redirectToProvider');
//     Route::get('login/github/callback', 'Auth\GitHubLoginController@handleProviderCallback');
// });


Route::group(['prefix' => 'auth'], function () {
    // Guest Access
    Route::post('login', 'API\AuthController@login');
    Route::post('signup', 'API\AuthController@signup');

    // Authorized Access
    Route::group(['middleware' => 'auth:api'], function() {
        Route::get('logout', 'API\AuthController@logout');
        Route::get('user', 'API\AuthController@user');
    });
});


Route::group(['prefix' => 'user', 'middleware' => 'auth:api'], function () {
    Route::put('profile', 'UserProfileController@updateOrCreate');
});


Route::post('login', 'API\AuthController@login');
