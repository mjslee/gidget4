<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;


class LevelCollection extends Model
{

    /**
     * Get levels belonging to the level collection.
     */
    public function levels()
    {
        return $this->belongsToMany(Level::class);
    }
    
}
