<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\Level;


class LevelProgress extends Model
{
    /**
     * Table name for LevelProgress.
     * @var String
     */
    protected $table = 'level_progress';

    /**
     * Create new progression session.
     *
     * @param \App\Models\Level $level A level object.
     * @param \App\Models\User $user (optional) A user object.
     * @return LevelProgress Instance of LevelProgress.
     */
    public static function createInstance(Level $level, User $user = null): LevelProgress
    {
        $obj = new LevelProgress;
        $obj->level()->associate($level);
        $obj->user()->associate($user);

        if (is_null($user)) {
            do {
                $obj->string_id = Str::random(64);
            }
            while (self::where('string_id', '=', $obj->string_id)->exists());
        }

        return $obj;
    }

    /**
     * Get user that created level progress.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get level progress created for level.
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }

}
