<?php
namespace App\Http\Controllers\Levels;

use App\Http\Controllers\Controller;
use App\Models\Level;
use Illuminate\Http\Request;


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
        // Validate level content
        $request->validate([
            'title'       => 'required|max:255',
            'description' => 'required',
            'level'       => 'required',
            'type'        => 'required',
        ]);

        // Create level
        $level = new Level;
        $level->title       = $request->title;
        $level->description = $request->description;
        $level->level       = $request->level;
        $level->type        = $request->type;
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
