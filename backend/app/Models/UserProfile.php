<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $hidden = [
        'id', 'user_id', 'created_at', 'updated_at'
    ];

    protected $fillable = [
        'name',
        'gender',
        'birthday',
        'has_coding_experience'
    ];
}
