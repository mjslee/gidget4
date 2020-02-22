<?php
namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Helpers\GameHelper as Game;


class GameHelperTest extends TestCase
{
    /**
     * Test gameObject method.
     *
     * @return void
     */
    public function testGameObject()
    {
        $obj = Game::gameObject(
            'Gidget', ['x' => 1, 'y' => 2], ['mixin']);

        $this->assertEquals($obj['type'], 'Gidget');
        $this->assertEquals($obj['position']['x'], 1);
        $this->assertEquals($obj['position']['y'], 2);
    }
}
