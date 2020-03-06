<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

use App\Models\Level;
use App\Models\LevelProgress;

use Tests\TestCase;


class ProgressTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test creating new level progress as a guest.
     *
     * @return void
     */
    public function testNewProgressRouteAsGuest()
    {
        $level = factory(Level::class)->create();
        $response = $this->get(route('progress.show', [
            'level' => $level->id
        ]));

        $response->assertSuccessful();
        $json = $response->json('data');

        $this->assertEquals($json['level_id'], $level->id);
        $this->assertEquals($json['user_id'], null);
        $this->assertEquals($json['load_count'], 1);
        $this->assertNotNull($json['string_id']);
    }


    /**
     * Test that showing progress with an ID increments the load account.
     *
     * @return void
     */
    public function testShowProgressRouteAsGuest()
    {
        // first GET creates the progress
        $level = factory(Level::class)->create();
        $response = $this->get(route('progress.show', [
            'level' => $level->id
        ]));

        $this->assertEquals($response['data']['load_count'], '1');

        // using the string_id of the progress response, check that the load
        // count is incremented
        $stringId = $response->json('data')['string_id'];
        $response = $this->get(route('progress.show', [
            'level' => $level->id, 'id' => $stringId
        ]));

        $progress = LevelProgress::query()->where([
            'string_id' => $stringId
        ])->first();

        $this->assertEquals($progress->load_count, '2');
    }


    /**
     * Test progress code update.
     *
     * @return void
     */
    public function testProgressRunAsGuest()
    {
        //
    }


    public function testProgressCompletionGuest()
    {
        //
    }
}
