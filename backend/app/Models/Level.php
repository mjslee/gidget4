<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class Level extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'type',
        'level',
        'published'
    ];


    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'difficulty', 'level', 'user'
    ];


    /**
     * Types of levels and the keys they can keep.
     *
     * @var array
     */
    public static $rules = [
        'title'       => 'required',
        'description' => 'required',
        'type'        => 'required',
    ];


    /**
     * Types of levels and the keys they can keep.
     *
     * @var array
     */
    public static $levelRules = [
        'DEBUGGING' => [
            'code'     => 'required',
            'solution' => 'required'
        ]
    ];


    /**
     * Get the user that this level belongs to.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo('App\Models\User');
    }


    /**
     * Create or update a Level instance from a request.
     *
     * @return Level
     */
    public static function fromRequest(Request $request, Level $level = null): Level
    {
        $request->validate(self::$rules);

        // TODO: Find a better way to do this
        // Validation error if level type doesn't exist
        $type = strtoupper($request->type);
        if (!array_key_exists($type, self::$levelRules)) {
            $request['type'] = null;
            $request->validate(['type' => 'required']);
        }

        if ($level == null)
            $level = new Level;

        $levelRules = !array_key_exists($type, self::$levelRules)
            ?: self::$levelRules[$type];

        $request->validate($levelRules);

        $level->setRelation('user', $request->user('api'));
        $level->title       = $request->title;
        $level->description = $request->description;
        $level->type        = $type;
        $level->level       = json_encode($request->all());

        return $level;
    }

}
