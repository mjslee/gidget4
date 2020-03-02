<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
Route::group(['prefix' => 'auth'], function () {
    Route::post('register', 'Auth\RegisterController@register')->name('register');
    Route::post('login', 'Auth\LoginController@login')->name('login');
});


/**
 * Users
 */
Route::group(['prefix' => 'user', 'middleware' => 'auth:api'], function () {
    Route::get('/', 'Users\UserController@show')->name('user.show');
    Route::patch('/', 'Users\UserController@update')->name('user.update');
});


/**
 * Levels
 */
Route::group(['prefix' => 'levels'], function () {
    Route::get('/', 'Levels\LevelController@index')
        ->name('level.index');

    Route::post('/', 'Levels\LevelController@store')
        ->middleware('auth:api')
        ->name('level.store');

    Route::post('/', 'Levels\LevelController@store')
        ->middleware('auth:api')
        ->name('level.store');

    Route::get('/{level}', 'Levels\LevelController@show')
        ->name('level.show');

    Route::get('/{level}/progress', 'Levels\ProgressController@show')
        ->name('progress.show');

    Route::post('/{level}/progress', 'Levels\ProgressController@run')
        ->name('progress.run');

    Route::post('/{level}/progress/complete', 'Levels\ProgressController@complete')
        ->name('progress.complete');
});
