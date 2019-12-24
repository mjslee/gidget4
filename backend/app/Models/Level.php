<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class Level extends Model
{

    /**
     * Fields belonging to the Level model.
     *
     * @var array
     */
    protected $fields = [
        'id'          => 'integer',
        'user_id'     => 'integer',
        'title'       => 'string',
        'description' => 'string',
        'type'        => 'string',
        'level'       => 'json',
        'difficulty'  => 'integer',
        'published'   => 'boolean',
        'official'    => 'boolean',
    ];


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
     * Validation rules for Level forms.
     *
     * @return array
     */
    public static function rules(): array
    {
        return [
            'title'       => 'required',
            'description' => 'required',
            'type'        => 'required|in:DEBUGGING',
        ];
    }


    /**
     * Validation rules for level types.
     *
     * @return array
     */
    public static function levelRules(): array
    {
        return [
            'DEBUGGING' => [
                'code'     => 'required',
                'solution' => 'required'
            ]
        ];
    }


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
        $request->validate(self::rules());

        if ($level == null)
            $level = new Level;

        $levelRules = self::levelRules();
        $request->validate($levelRules[$request->type]);

        $level->user()->associate($request->user());
        $level->title       = $request->title;
        $level->description = $request->description;
        $level->type        = $request->type;
        $level->level       = json_encode($request->all());

        return $level;
    }

}
