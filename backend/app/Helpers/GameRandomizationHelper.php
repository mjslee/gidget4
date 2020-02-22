<?php
namespace App\Helpers;

use Faker\Generator as Faker;
use App\Helpers\GameHelper as Game;


class GameRandomizationHelper
{
    /**
     * Generate random position array.
     *
     * @param int $worldSize
     * @return array
     */
    public static function randomPosition(int $worldSize): array
    {
        return [
            'x' => rand(0, $worldSize - 1),
            'y' => rand(0, $worldSize - 1)
        ];
    }

    /**
     * Generate a random game object.
     *
     * @return array
     */
    public static function randomGameObject(array $level, array $mixins = []): array
    {
        $type = Game::$gameObjectTypes[array_rand(Game::$gameObjectTypes)];
        return Game::gameObject($type, self::randomPosition($level['size']), $mixins);
    }


    /**
     * Generate a random tile.
     *
     * @return array
     */
    public static function randomTile(array $level): array
    {
        $type = Game::$tileTypes[array_rand(Game::$tileTypes)];
        return Game::tile($type, self::randomPosition($level['size']));
    }


    /**
     * Generate a random goal.
     *
     * @param array $level
     * @return array
     */
    public static function randomGoal(array $level): array
    {
        $type = Game::$assertionTypes[array_rand(Game::$assertionTypes)];
        $obj = $level['objects'][array_rand($level['objects'])];
        $props = ['.x', '.y'];
        $prop = $props[array_rand($props)];

        return Game::goal($type, [$obj['type'] . $prop, 0]);
    }
}
