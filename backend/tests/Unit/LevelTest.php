<?php
namespace Tests\Unit;

use DB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

use App\Models\Level;
use LevelsTableSeeder;


class LevelTest extends TestCase
{

    use RefreshDatabase;

    /**
     * Test level factory.
     *
     * @return void
     */
    public function testLevelFactory()
    {
        $obj = factory(Level::class)->create();
        $obj = $obj->fresh();

        $this->assertJson($obj->level);
        $level = json_decode($obj->level);
        $this->assertIsObject($level);
    }

    /**
     * Test level table seeder.
     *
     * @return void
     */
    public function testLevelSeeder()
    {
        $this->seed(LevelsTableSeeder::class);

        $levelCount = DB::table('levels')->count();

        $this->assertGreaterThan(1, $levelCount);
    }

}
