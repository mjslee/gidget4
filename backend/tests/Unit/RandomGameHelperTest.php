<?php
namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Helpers\RandomGameHelper;


class RandomGameHelperTest extends TestCase
{
    /**
     * Test gameObject method.
     *
     * @return void
     */
    public function testGameObject()
    {
        $obj = RandomGameHelper::gameObject(
            'Gidget', ['x' => 1, 'y' => 2], ['mixin']);

        $this->assertEquals($obj['type'], 'Gidget');
        $this->assertEquals($obj['position']['x'], 1);
        $this->assertEquals($obj['position']['y'], 2);
    }

    /**
     * Test randomPosition method.
     *
     * @return void
     */
    public function testRandomPosition()
    {
        $obj = RandomGameHelper::randomPosition(3);

        $this->assertGreaterThan(0, $obj['x']);
        $this->assertGreaterThan(0, $obj['y']);
    }

    /**
     * Test randomGameObject method.
     *
     * @return void
     */
    public function testRandomGameObject()
    {
        $obj = RandomGameHelper::randomGameObject(3);

        $this->assertIsString($obj['type']);
        $this->assertIsNotNumeric($obj['type']);
        $this->assertIsNumeric($obj['position']['x']);
        $this->assertIsNumeric($obj['position']['y']);
    }
}
