<?php
namespace App\Http\Controllers\Levels;

use App\Http\Controllers\Controller;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class LevelController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // TODO: Move this logic to a Level model method
        // Validate level content
        $request->validate([
            'title'       => 'required',
            'description' => 'required',
            'type'        => 'required',
            'code'        => 'required',
            'solution'    => 'required',
        ]);

        // Create level instance
        $level = new Level;

        $level->title       = $request->title;
        $level->description = $request->description;
        $level->type        = $request->type;

        // TODO: Run this through an array_filter
        $level->level = json_encode($request->all());

        $level->save();
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Level  $level
     * @return \Illuminate\Http\Response
     */
    public function show(Level $level)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Level  $level
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Level $level)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Level  $level
     * @return \Illuminate\Http\Response
     */
    public function destroy(Level $level)
    {
        //
    }

}
