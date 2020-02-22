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

        dd($obj);
        $obj = $obj->fresh();

        $this->assertIsArray($obj->level);
        $this->assertIsArray($obj->level['dialogue']);
        $this->assertIsArray($obj->level['tiles']);
        $this->assertIsArray($obj->level['goals']);
        $this->assertIsArray($obj->level['objects']);
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
