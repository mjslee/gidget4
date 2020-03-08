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
    function getIndex(Request $request)
    {
        $levels = LevelCollection::paginate(10);
        return LevelCollectionResource::collection($levels);
    }

    /**
     * Display the specified level collection.
     *
     * @param  \App\Level  $level
     * @return \Illuminate\Http\Response
     */
    public function getShow(LevelCollection $collection)
    {
        return new LevelCollectionResource($collection);
    }
}
