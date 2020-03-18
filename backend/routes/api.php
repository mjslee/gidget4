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
Route::apiResource('levels', 'Levels\LevelController');

/**
 * Level Progress
 */
Route::apiResource('levels.progress', 'Levels\ProgressController');
Route::group(['prefix' => '/{level}/progress/{progress}'], function() {
    Route::post('/run', 'Levels\ProgressController@run')->name('levels.progress.run');
    Route::post('/complete', 'Levels\ProgressController@complete')->name('levels.progress.complete');
});

/**
 * Level Collections
 */
Route::group(['prefix' => 'collections'], function () {
    Route::get('/', 'Levels\LevelCollectionController@getIndex')
        ->name('collection.index');

    Route::get('/{collection}', 'Levels\LevelCollectionController@getShow')
        ->name('collection.show');
});
