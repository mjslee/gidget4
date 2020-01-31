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
        return $this->belongsTo(User::class);
    }

    /**
     * Get level session created for level.
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    /**
     * New level session instance.
     */
    public static function newSession(Level $level, User $user = null) : LevelSession
    {
        $instance = new LevelSession;
        $instance->level()->associate($level);
        $instance->user()->associate($user);

        return $instance;
    }

}
