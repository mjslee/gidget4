<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class LevelSet extends Model
{
    /**
     * Get levels belonging to the level set.
     */
    public function levels()
    {
        return $this->hasMany(Level::class);
    }
    
}
