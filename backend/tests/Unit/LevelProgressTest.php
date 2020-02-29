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
    public function testCreateGuestProgress()
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
     * Test getting an already created session as a user.
     *
     * @return void
     */
    public function testGetLatestIncompleteAsUser()
    {
        $user = factory(User::class)->create();
        $level = factory(Level::class)->create();

        // can't get what doesn't exist
        $progress1 = LevelProgress::getLatestIncomplete($level, $user);
        $this->assertNull($progress1);

        // create and get existing progress
        factory(LevelProgress::class)->create([
            'level_id' => $level,
            'user_id'  => $user
        ]);
        $progress2 = LevelProgress::getLatestIncomplete($level, $user);
        $this->assertNotNull($progress2);

        // gets the same progress again
        $progress3 = LevelProgress::getLatestIncomplete($level, $user);
        $this->assertEquals($progress2->id, $progress3->id);
    }
}
