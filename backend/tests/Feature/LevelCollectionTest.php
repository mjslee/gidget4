<?php

namespace Tests\Feature;

use App\Models\LevelCollection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use LevelCollectionSeeder;


class LevelCollectionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that level collections return results.
     *
     * @return void
     */
    public function testLevelCollectionIndex()
    {
        $this->seed(LevelCollectionSeeder::class);
        $response = $this->get(route('collection.index'));

        // TODO: Validate JSON structure
        $response->assertStatus(200);
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testLevelCollectionShow()
    {
        $this->seed(LevelCollectionSeeder::class);
        $response = $this->get(route('collection.show', [
            'collection' => LevelCollection::first()->id
        ]));

        // TODO: Validate JSON structure
        $response->assertStatus(200);
    }
}
