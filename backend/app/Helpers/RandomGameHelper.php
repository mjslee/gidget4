<?php
namespace App\Helpers;


class RandomGameHelper
{
    /**
     * @var array List of possible game object types.
     */
    public static $gameObjectTypes = ['Cat', 'Dog', 'Kitten', 'Puppy'];

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
}
