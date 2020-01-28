<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class LevelSession extends Model
{
    
    /**
     * Get user that created level session.
     */
    public function user()
    {
        return $this->hasMany(User::class);
    }

}