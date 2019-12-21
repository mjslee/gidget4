<?php
namespace Tests\Feature;

use App\Models\Level;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Carbon\Carbon;


class LevelTest extends TestCase
{
    use RefreshDatabase;
       
    /**
     * Test creating a level by a user.
     *
     * @return void
     */
    public function testCreateLevel(): void
    {
        // Partial update, only one profile field
        $user = factory(User::class)->create();
        $this->actingAs($user, 'api')
             ->post(route('level.store'), [
                 'title' => 'My Level',
                 'description' => 'Description of my new level.',
                 'type' => 'DEBUGGING',
                 'level' => '{code:"Gidget.left();"}'
             ]);

        dd(Level::all());
        // $this->assertNotNull();
        // $this->assertEquals($user->profile->gender, 'New Gender');
        // $this->assertNull($user->profile->birthdate);
    }
}
