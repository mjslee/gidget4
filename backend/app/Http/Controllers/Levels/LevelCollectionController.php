<?php
namespace App\Http\Controllers\Levels;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Http\Resources\LevelCollectionResource;
use App\Models\LevelCollection;


class LevelCollectionController extends Controller
{
    /**
     * Show index page.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    function index(Request $request)
    {
        $levels = LevelCollection::all();
        return LevelCollectionResource::collection($levels);
    }

    /**
     * Display the specified level collection.
     *
     * @param  \App\Level  $level
     * @return \Illuminate\Http\Response
     */
    public function show(LevelCollection $collection)
    {
        return new LevelCollectionResource($collection);
    }
}
