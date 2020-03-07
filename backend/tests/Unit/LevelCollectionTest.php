<?php
namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

use App\Models\LevelCollection;


class LevelCollectionTest extends TestCase
{

    use RefreshDatabase;

    /**
     * Test level collection factory.
     *
     * @return void
     */
    public function testLevelCollectionFactory()
    {
        $collection = factory(LevelCollection::class)->create();

        self::assertNotNull($collection);
        self::assertGreaterThan(3, $collection->levels->count());
    }

}
