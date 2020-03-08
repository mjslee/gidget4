<?php

namespace App\Http\Controllers\Levels;

use App\Helpers\CodeHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Level;
use App\Models\LevelProgress;
use App\Http\Resources\ProgressResource;
use App\Http\Controllers\Controller;


class ProgressController extends Controller
{
    /**
     * Show a user's progress of a level.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Level $level
     * @return ProgressResource
     */
    public function getShow(Request $request, Level $level): ProgressResource
    {
        $progress = LevelProgress::findOrNew(
            $level, $request->user(), $request->input('id'), [
                'user_agent' => $request->header('User-Agent'),
                'ip_address' => $request->ip()
            ]
        );
        $progress->incrementLoads();

        return new ProgressResource($progress);
    }

    /**
     * Receive a player's code submission and evaluation feedback.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Level $level
     */
    public function postRun(Request $request, Level $level)
    {
        // TODO: Combine show and run methods
        $progress = LevelProgress::findOrNew(
            $level, $request->user(), $request->input('id'), [
                'user_agent' => $request->header('User-Agent'),
                'ip_address' => $request->ip()
            ]
        );

        $data = CodeHelper::isValidJSON($request->input('data'))
            ? $request->input('data') : '{}';

        $progress->incrementUpdates();
        $progress->addCode([
            'code'       => $request->input('code'),
            'step_count' => $request->input('step_count', 0),
            'data'       => $data
        ]);

        return ':)';
    }

    /**
     * Player has completed the level.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Level $level
     */
    public function complete(Request $request, Level $level)
    {
        $progress = LevelProgress::findIncomplete(
            $level, $request->user(), $request->input('id')
        );
        $progress->setComplete();
    }

}
