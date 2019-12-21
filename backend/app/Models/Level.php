<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Level extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'type',
        'level',
        'published'
    ];


    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'difficulty'
    ];
}
