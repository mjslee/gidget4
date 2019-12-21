<?php
use Illuminate\Http\Request;
//use Illuminate\Routing\Route;

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

/**
 * Authentication
 */
Route::group(['prefix' => 'auth'], function() {
    Route::post('register', 'Auth\RegisterController@register')->name('register');
    Route::post('login', 'Auth\LoginController@login')->name('login');
});


/**
 * Users
 */
Route::group(['prefix' => 'user', 'middleware' => 'auth:api'], function() {
    Route::get('/', 'Users\UserController@show')->name('user.show');
    Route::patch('/', 'Users\UserController@update')->name('user.update');
});


/**
 * Levels
 */
Route::group(['prefix' => 'levels'], function() {
    Route::post('/', 'Levels\LevelController@store')->name('level.store');
});
