<?php
namespace App\Http\Controllers\Levels;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\Controller;
use App\Http\Resources\LevelResource;
use App\Http\Resources\LevelIndexResource;
use App\Models\Level;


class LevelController extends Controller
{

    /**
     * Constructor of LevelController.
     */
    public function __construct()
    {
        //$this->authorizeResource(Level::class, 'level');
    }

    /**
     * Show index page.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $levels = Level::all();
        return LevelIndexResource::collection($levels);
    }
    

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $level = Level::fromRequest($request);
        $level->save();

        return new LevelResource($level);
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Level  $level
     * @return \Illuminate\Http\Response
     */
    public function show(Level $level)
    {
        return new LevelResource($level); //Response::json($level, 200);
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
