<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\LevelProgress;


class LevelCode extends Model
{
    /**
     * @var Table name of LevelCode model.
     */
    protected $table = 'level_code';

    public static function createInstance(LevelProgress $levelProgress, String $code) : LevelCode
    {
        $obj = new LevelCode;
        $obj->progress()->associate($levelProgress);

        return $obj;
    }

    public function progress()
    {
        return $this->belongsTo(LevelProgress::class);
    }
}
