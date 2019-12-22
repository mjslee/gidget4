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
    public function testCreateLevelSuccessful(): void
    {
        $user = factory(User::class)->create();
        $data = [
            'title'       => 'My Level',
            'description' => 'Description of my new level.',
            'type'        => 'DEBUGGING',
            'code'        => 'Gidget.left();',
            'solution'    => 'Gidget.right();',
        ];

        $response = $this
            ->actingAs($user, 'api')
            ->json('post', route('level.store'), $data);

        $response
            ->assertStatus(200);

        $level = Level::first();
        $this->assertNotNull($level);
        $this->assertEquals($level->title, $data['title']);
        $this->assertEquals($level->description, $data['description']);
        $this->assertEquals($level->type, $data['type']);

        $levelData = json_decode($level->level);
        $this->assertEquals($levelData->code, $data['code']);
        $this->assertEquals($levelData->solution, $data['solution']);
    }
       

    /**
     * Test creating a level with an invalid level type.
     *
     * @return void
     */
    public function testCreateLevelInvalidType(): void
    {
        $user = factory(User::class)->create();
        $data = [
            'title'       => 'My Level',
            'description' => 'Description of my new level.',
            'type'        => 'COMPLETELY_INVALID',
            'code'        => 'Gidget.left();',
            'solution'    => 'Gidget.right();',
        ];

        $response = $this
            ->actingAs($user, 'api')
            ->json('post', route('level.store'), $data);

        $response
            ->assertStatus(422);
    }

}
