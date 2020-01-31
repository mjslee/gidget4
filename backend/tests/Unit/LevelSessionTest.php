<?php
namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\User;
use App\Models\Level;
use App\Models\LevelSession;


class LevelSessionTest extends TestCase
{

    use RefreshDatabase;

    /**
     * Test create session model function.
     *
     * @return void
     */
    public function testCreateSession()
    {
        $level = factory(Level::class)->create();
        $user = factory(User::class)->create();
        $session = LevelSession::newSession($level, $user);

        $session->save();

        $this->assertNotNull($session);
    }

    /**
     * Test create session model function with null user.
     *
     * @return void
     */
    public function testGuestCreateSession()
    {
        $level = factory(Level::class)->create();
        $user = null;
        $session = LevelSession::newSession($level, $user);

        $session->save();

        $this->assertNotNull($session);
    }

}
