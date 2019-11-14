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


/**
 * User Authentication
 */
Route::group(['prefix' => 'auth'], function() {
    Route::post('register', 'Auth\RegisterController@register')->name('register');
    Route::post('login', 'Auth\LoginController@login')->name('login');
});


/**
 *
 */
Route::group(['prefix' => 'user', 'middleware' => 'auth:api'], function() {
    Route::put('profile', 'UserProfileController@updateOrCreate');
});


/**
 * API Resources
 */
Route::group(['middleware' => 'auth:api'], function() {
    Route::apiResource('levels', 'LevelController');
});
