<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\User;
use App\Models\Level;
use App\Models\LevelProgress;


class LevelProgressTest extends TestCase
{

    use RefreshDatabase;

    /**
     * Test creating LevelProgress instance with user.
     *
     * @return void
     */
    public function testCreateProgress()
    {
        $level = factory(Level::class)->create();
        $user = factory(User::class)->create();

        $session = LevelProgress::createInstance($level, $user);
        $session->save();

        $freshSession = $session->fresh();
        $this->assertNotNull($freshSession);
        $this->assertEquals($freshSession->level->id, $level->id);
        $this->assertEquals($freshSession->user->id, $user->id);
        $this->assertNull($freshSession->string_id);
    }

    /**
     * Test creating LevelProgress instance with null user.
     *
     * @return void
     */
    public function testCreateProgressGuest()
    {
        $level = factory(Level::class)->create();
        $user = null;

        $session = LevelProgress::createInstance($level, $user);
        $session->save();

        $freshSession = $session->fresh();
        $this->assertNotNull($freshSession);
        $this->assertEquals($freshSession->level->id, $level->id);
        $this->assertNull($freshSession->user);
        $this->assertNotNull($freshSession->string_id);
    }

    /**
     * Test finding an already created session as a user.
     *
     * @return void
     */
    public function testFindLatestIncompleteAsUser()
    {
        $user = factory(User::class)->create();
        $level = factory(Level::class)->create();

        // can't get what doesn't exist
        $progress1 = LevelProgress::findIncomplete($level, $user);
        $this->assertNull($progress1);

        // create and get existing progress
        factory(LevelProgress::class)->create([
            'level_id' => $level->id,
            'user_id'  => $user->id
        ]);
        $progress2 = LevelProgress::findIncomplete($level, $user);
        $this->assertNotNull($progress2);

        // gets the same progress again
        $progress3 = LevelProgress::findIncomplete($level, $user);
        $this->assertEquals($progress2->id, $progress3->id);
    }

    /**
     * Test getting an already created session as a guest.
     *
     * @return void
     */
    public function testFindLatestIncompleteAsGuest()
    {
        // create level
        $level = factory(Level::class)->create();

        // try to get progress, none exists
        $progress = LevelProgress::findIncomplete($level, null);
        $this->assertNull($progress);
    }

    /**
     * Test getting progress or creating if it doesn't exist yet.
     *
     * @return void
     */
    public function testFindOrNewAsUser()
    {
        $user = factory(User::class)->create();
        $level = factory(Level::class)->create();

        // does not exist
        $progress1 = LevelProgress::findOrNew($level, $user);
        $progress2 = LevelProgress::findOrNew($level, $user);

        // ensure they're the same row by id
        self::assertEquals($progress1->id, $progress2->id);
        self::assertEquals($progress2->string_id, null);
    }

    /**
     * undocumented function
     *
     * @return void
     */
    public function testFindOrNewAsGuest()
    {
        $level = factory(Level::class)->create();

        // does not exist
        $progress1 = LevelProgress::findOrNew($level);
        $progress2 = LevelProgress::findOrNew($level, null, $progress1->string_id);
        $progress3 = LevelProgress::findOrNew($level);

        self::assertEquals($progress1->id, $progress2->id);
        self::assertNotNull($progress2->string_id);
        self::assertNotEquals($progress2->id, $progress3->id);
    }
}
