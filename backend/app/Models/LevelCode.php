<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\LevelProgress;
use App\Models\Level;
use App\Models\User;


class LevelCode extends Model
{

    /**
     * @var String Table name of LevelCode model.
     */
    protected $table = 'level_code';

    /**
     * @var array Fields that can be mass-assigned.
     */
    protected $fillable = [
        'code',
        'hash',
        'data',

        'step_count',
        'eval_count',
        'eval_duration',
    ];

    /**
     * LevelCode instance belongs to a LevelProgress instance.
     *
     * @return LevelProgress
     */
    public function progress()
    {
        return $this->belongsTo(LevelProgress::class);
    }

    /**
     * LevelCode instance belongs to a Level.
     *
     * @return Level
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    /**
     * LevelCode instance belongs to a User.
     *
     * @return User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
