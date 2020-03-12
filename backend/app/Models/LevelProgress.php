<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\Level;
use App\Models\LevelCode;

use App\Helpers\CodeHelper;


class LevelProgress extends Model
{
    /**
     * Table name for LevelProgress.
     * @var String
     */
    protected $table = 'level_progress';

    protected $fillable = [
        'ip_address',
        'user_agent',
    ];

    /**
     * The "boot" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function (LevelProgress $progress) {
            do {
                $progress->string_id = Str::random(128);
            } while (self::where('string_id', $progress->string_id)->exists());
        });
    }

    /**
     * Get user that created level progress.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Code relationship that belongs to level progress.
     */
    public function code()
    {
        return $this->hasMany(LevelCode::class);
    }

    /**
     * Get level progress created for level.
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    /**
     * Get latest incomplete progress of user for a level.
     *
     * @param \App\Models\Level $level
     * @param \App\Models\User $user (optional)
     * @param String $strId (optional) String ID of progress.
     * @return LevelProgress
     */
    public static function findIncomplete(Level $level, User $user = null, String $strId = null): ?LevelProgress
    {
        if (is_null($level))
            return null;

        return self::query()
            ->where(function ($query) use ($user, $strId) {
                if (!is_null($user))
                    $query->where('user_id', $user->id);
                else
                    $query->where('string_id', $strId);
            })
            ->firstWhere('level_id', $level->id);
    }

    /**
     * Find current progress or create a new progress session.
     *
     * @param \App\Models\Level $level
     * @param \App\Models\User $user (optional)
     * @param String $strId (optional)
     * @return LevelProgress
     */
    public static function findOrNew(Level $level, User $user = null, String $strId = null, array $attributes = [])
    {
        $progress = self::findIncomplete($level, $user, $strId);

        if (is_null($progress)) {
            $progress = self::makeInstance($level, $user, $attributes);
            $progress->save();
        }

        return $progress;
    }

    /**
     * Set Progress as completed.
     * TODO: Compare against solution result.
     *
     * @return void
     */
    public function setComplete(): void
    {
        $this->update(['completed_at' => Carbon::now()]);
    }

    /**
     * Add a new level code relation to this progress.
     *
     * @param Array $attributes  Attributes for the new LevelCode instance.
     *   $attributes = [
     *     'code'          => (string)  Code to import. **Required**
     *     'step_count'    => (int)     Amount to increase step count by.
     *     'ip_address'    => (string)  IP address of the submitter.
     *     'user_agent'    => (string)  User agent of the submitter.
     *   ]
     * @return void
     */
    public function addCode(Array $attributes):? LevelCode
    {
        if (!array_key_exists('code', $attributes))
            return null;

        $code = $attributes['code'];
        if (empty($code))
            return null;

        $hash = CodeHelper::hashCode($code);
        $levelCode = $this->code()->firstOrNew(
            [ 'hash' => $hash ], $attributes
        );

        // code eval already exists, user ran the same code again
        // if $levelCode was just created then it wouldn't have an id
        if ($levelCode->id)
            $levelCode->increment('eval_count', 1);
        else
            $levelCode->save();

        return $levelCode;
    }

    /**
     * Increment count of level progress loads.
     *
     * @return int
     */
    public function incrementLoads(): int
    {
        return $this->increment('load_count');
    }

    /**
     * Increment count of level progress updates.
     *
     * @return int
     */
    public function incrementUpdates(): int
    {
        return $this->increment('update_count');
    }

    /**
     * Increment count of times documentation has been accessed.
     *
     * @return int
     */
    public function incrementDocumentation(): int
    {
        return $this->increment('doc_count');
    }

    /**
     * Increment count of times documentation has been accessed.
     *
     * @return int
     */
    public function incrementRestore(): int
    {
        return $this->increment('restore_count');
    }

    /**
     * Increment count of times player has reset their progress.
     *
     * @return int
     */
    public function incrementReset(): int
    {
        return $this->increment('reset_count');
    }
}
