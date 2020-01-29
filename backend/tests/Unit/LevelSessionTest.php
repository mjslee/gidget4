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

    /**
     * Test create session model function.
     *
     * @return void
     */
    public function testCreateSession()
    {
        $user = factory(User::class)->create();
        $level = factory(Level::class)->create();
        $levelSession = LevelSession::newSession($level, $user);

        $this->assertNotNull($levelSession);
    }

}
