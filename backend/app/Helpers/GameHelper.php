<?php
namespace App\Helpers;


class GameHelper
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
     * @var array List of possible assertion types.
     */
    public static $assertionTypes = ['equal'];

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
}
