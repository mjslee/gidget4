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
    public function testCreateProgressSession()
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
    public function testGuestCreateProgressSession()
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

}
