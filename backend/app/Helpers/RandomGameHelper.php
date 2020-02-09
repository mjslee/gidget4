<?php
namespace App\Helpers;
use Faker\Generator as Faker;


class RandomGameHelper
{
    /**
     * @var array List of possible game object types.
     */
    public static $gameObjectTypes = ['Cat', 'Dog', 'Kitten', 'Puppy'];

    /**
     * @var array List of possible tile types.
     */
    public static $tileTypes = ['dirt'];

    /**
     * Create a game object.
     *
     * @param string $type
     * @param array $position [ 'x' = 1, 'y' = 2 ]
     * @param array $mixins (optional)
     * @return array
     */
    public static function gameObject(string $type, array $position, array $mixins = []): array
    {
        return [
            'type' => $type,
            'mixins' => $mixins,
            'position' => $position
        ];
    }

    /**
     * Create a tile.
     *
     * @param string $type
     * @param array $position
     * @return array
     */
    public static function tile(string $type, array $position): array
    {
        return [
            'type' => $type,
            'position' => $position
        ];
    }

    /**
     * Create a goal.
     *
     * @param string $assert
     * @param array $arguments
     * @return array
     */
    public static function goal(string $assert, array $arguments): array
    {
        return [
            'assert' => $assert,
            'arguments' => $arguments
        ];
    }


    /**
     * Create a dialogue.
     *
     * @param string $text
     * @return array
     */
    public static function dialogue(string $text): array
    {
        return [ 'text' => $text ];
    }

    /**
     * Generate random position array.
     *
     * @param int $worldSize
     * @return array
     */
    public static function randomPosition(int $worldSize): array
    {
        return [
            'x' => rand(0, $worldSize),
            'y' => rand(0, $worldSize)
        ];
    }

    /**
     * Generate a random game object.
     *
     * @return array
     */
    public static function randomGameObject(int $worldSize): array
    {
        return self::gameObject(
            self::$gameObjectTypes[array_rand(self::$gameObjectTypes)],
            self::randomPosition($worldSize)
        );
    }


    /**
     * Generate a random goal.
     *
     * @return array
     */
    public static function randomTile(int $worldSize): array
    {
        return self::tile(
            self::$tileTypes[array_rand(self::$tileTypes)],
            self::randomPosition($worldSize)
        );
    }


    /**
     * Generate a random goal.
     *
     * @return array
     */
    public static function randomGoal(): array
    {
        $num = rand(1, 100);
        return self::goal('equal', [$num, $num]);
    }


    /**
     * Generate random dialogue.
     *
     * @return array
     */
    public static function randomDialogue(): array
    {
        $num = rand(1, 100);
        return self::dialogue($num);
    }
}
