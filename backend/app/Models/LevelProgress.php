<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
     * @var Fields belonging to LevelProgress.
     * This is only for reference!
     * View: 2020_01_28_052259_create_level_progress_table.php
     */
    protected $fields = [
        'id'                => 'unsignedBigInteger',
        'user_id'           => 'unsignedBigInteger',
        'level_id'          => 'unsignedBigInteger',
        'data'              => 'json',
        'load_count'        => 'unsignedInteger',
        'update_count'      => 'unsignedInteger',
        'doc_count'         => 'unsignedInteger',
        'restore_count'     => 'unsignedInteger',
        'reset_count'       => 'unsignedInteger',
        'play_duration'     => 'unsignedInteger',
        'doc_duration'      => 'unsignedInteger',
        'focus_duration'    => 'unsignedInteger',
        'idle_duration'     => 'unsignedInteger',
        'tutorial_duration' => 'unsignedInteger',
        'completed_at'      => 'datetime',
    ];

    /**
     * Create new progression session.
     *
     * @param \App\Models\Level $level A level object.
     * @param \App\Models\User $user (optional) A user object.
     * @return LevelProgress Instance of LevelProgress.
     */
    public static function createInstance(Level $level, User $user = null) : LevelProgress
    {
        $obj = new LevelProgress;
        $obj->level()->associate($level);
        $obj->user()->associate($user);

        return $obj;
    }

    /**
     * User that created level progress.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Level progress created for level.
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    /**
     * Code updates belonging for this progress.
     */
    public function code()
    {
        return $this->hasMany(LevelCode::class);
    }

    /**
     * Add a code update to this progress.
     */
    public function addCode($code)
    {
        $levelCode = LevelCode::createInstance($this, $code);
    }
}
