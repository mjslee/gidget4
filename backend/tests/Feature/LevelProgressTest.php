<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

use App\Models\User;
use App\Models\Level;
use App\Models\LevelCode;
use App\Models\LevelProgress;

use Tests\TestCase;


class LevelProgressTest extends TestCase
{
    use RefreshDatabase;


    /**
     * Ensure guests are unauthorized to view the progress index.
     *
     * @return void
     */
    public function testProgressControllerIndexAsGuest() {
        $level = factory(Level::class)->create();
        $response = $this->get(route('levels.progress.index', [
            'level' => $level->id
        ]));

        $response->assertUnauthorized();
    }

    /**
     * Ensure users are shown their progress for the levels they've played.
     *
     * @return void
     */
    public function testProgressControllerIndexAsUser() {
        $user = factory(User::class)->create();
        $level = factory(Level::class)->create();
        factory(LevelProgress::class)->create([
            'level_id' => $level->id,
            'user_id' => $user->id
        ]);

        $response = $this->actingAs($user)->get(route('levels.progress.index', [
            'level' => $level->id
        ]));

        $response->assertSuccessful();
    }


    /**
     * Test creating new level progress as a guest.
     *
     * @return void
     */
    public function testNewProgressAsGuest()
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
    public function testShowProgressAsGuest()
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
        // step 1: get string id
        $level = factory(Level::class)->create();
        $response = $this->get(route('progress.show', [
            'level' => $level->id
        ]));

        $stringId = $response->json('data')['string_id'];
        self::assertEquals(64, strlen($stringId));

        // step 2: run using the string id
        $data = '{"test": 1}';
        $response = $this->post(route('progress.run', [
            'id'    => $stringId,
            'level' => $level->id,
            'code'  => 'true;',
            'data'  => $data
        ]));


        $progress = LevelProgress::first();
        self::assertEquals($progress->user_agent, 'Symfony');
        self::assertEquals($progress->ip_address, '127.0.0.1');
        self::assertEquals($progress->code->first()->code, 'true;');
        self::assertEquals($progress->code->first()->data, $data);
    }


    /**
     * Test route of level progress completion as a guest.
     *
     * @return
     */
    public function testProgressCompletionGuest()
    {
        //
    }
}
