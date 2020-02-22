<?php
namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Helpers\GameRandomizationHelper as Game;


class GameRandomizationHelperTest extends TestCase
{
    /**
     * Test randomPosition method.
     *
     * @return void
     */
    public function testRandomPosition()
    {
        $obj = Game::randomPosition(3);

        $this->assertGreaterThanOrEqual(0, $obj['x']);
        $this->assertGreaterThanOrEqual(0, $obj['y']);
    }

    /**
     * Test randomGameObject method.
     *
     * @return void
     */
    public function testRandomGameObject()
    {
        $obj = Game::randomGameObject(3, ['test_mixin']);

        $this->assertIsString($obj['type']);
        $this->assertIsNotNumeric($obj['type']);
        $this->assertIsNumeric($obj['position']['x']);
        $this->assertIsNumeric($obj['position']['y']);
        $this->assertContains('test_mixin', $obj['mixins']);
    }

    /**
     * Test randomGameObject method.
     *
     * @return void
     */
    public function testRandomTile()
    {
        $obj = Game::randomTile(3);

        $this->assertIsString($obj['type']);
        $this->assertIsNotNumeric($obj['type']);
        $this->assertIsNumeric($obj['position']['x']);
        $this->assertIsNumeric($obj['position']['y']);
    }
}
