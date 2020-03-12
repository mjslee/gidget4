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
    public function testProgressControllerIndexAsGuest()
    {
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
            'user_id'  => $user->id
        ]);

        $response = $this->actingAs($user)->get(route('levels.progress.index', [
            'level' => $level->id
        ]));

        $response->assertSuccessful();
    }


    /**
     * Ensure guests are shown the proper individual progress instance.
     *
     * @return void
     */
    public function testProgressControllerShowAsGuest()
    {
        $user = factory(User::class)->create();
        $level = factory(Level::class)->create();
        $userProgress = factory(LevelProgress::class)->create([
            'level_id' => $level->id,
            'user_id' => $user->id
        ]);
        $guestProgress = factory(LevelProgress::class)->create([
            'level_id' => $level->id
        ]);

        // unauthorized because the progress belongs to a user
        $response = $this->get(route('levels.progress.show', [
            'level'    => $level->id,
            'progress' => $userProgress->id
        ]));
        $response->assertSuccessful();
        $response->assertJson(['data' => ['level_id' => $level->id]]);

        // by id
        $response = $this->get(route('levels.progress.show', [
            'level'    => $level->id,
            'progress' => $guestProgress->id
        ]));
        $response->assertSuccessful();
        $response->assertJson(['data' => ['level_id' => $level->id]]);
    }


    /**
     * Ensure guests are shown the proper individual progress instance.
     *
     * @return void
     */
    public function testProgressControllerShowAsUser()
    {
        $level = factory(Level::class)->create();
        $user = factory(User::class)->create();
        $userProgress = factory(LevelProgress::class)->create([
            'level_id' => $level->id,
            'user_id' => $user->id
        ]);

        $response = $this->actingAs($user)->get(route('levels.progress.show', [
            'level'    => $level->id,
            'progress' => $userProgress->id
        ]));
        $response->assertSuccessful();
        $response->assertJson(['data' => ['level_id' => $level->id]]);

        // another user should not be able to access our progress
        $otherUser = factory(User::class)->create();
        $response = $this->actingAs($otherUser)->get(route('levels.progress.show', [
            'level'    => $level->id,
            'progress' => $userProgress->id
        ]));
        $response->assertForbidden();
    }


    /**
     * Ensure that a Progress can be created by a guest.
     *
     * @return void
     */
    public function testProgressControllerStoreAsGuest()
    {
        $level = factory(Level::class)->create();
        $response = $this->post(
            route('levels.progress.store', ['level' => $level->id]), []
        );

        $this->assertEquals(strlen($response->json('data')['id']), 128);
        $this->assertEquals(strlen($response->json('data')['level_id']), $level->id);
    }


    /**
     * Ensure that a Progress can be created by a guest.
     *
     * @return void
     */
    public function testProgressControllerStoreAsUser()
    {
        $level = factory(Level::class)->create();
        $user = factory(User::class)->create();
        $response = $this->actingAs($user)->post(
            route('levels.progress.store', ['level' => $level->id]), []
        );

        $data = $response->json('data');
        $progress = LevelProgress::query()->where('string_id', $data['id'])->firstOrFail();

        $this->assertEquals(strlen($data['id']), 128);
        $this->assertEquals(strlen($data['level_id']), $level->id);
        $this->assertTrue($progress->user->is($user));
        $this->assertNotEmpty($progress->user_agent, 'Symfony');
        $this->assertEquals($progress->ip_address, '127.0.0.1');
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
