<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    public function posts() //Eloquent Relationship that returns post associated with this category
    {
        return $this->hasMany(Post::class);
    }
}