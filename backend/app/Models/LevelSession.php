<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Level;


class LevelSession extends Model
{
    
    /**
     * Get user that created level session.
     */
    public function user()
    {
        return $this->hasMany(User::class);
    }

    /**
     * New level session instance.
     */
    public function newSession(Level $level, User $user = null) : LevelSession
    {
        $instance = LevelSession::create();
        return $instance;
    }

}
