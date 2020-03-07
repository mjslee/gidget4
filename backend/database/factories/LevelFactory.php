<?php
use Faker\Generator as Faker;
use App\Helpers\GameHelper as Game;
use App\Helpers\GameRandomizationHelper as GameRand;
use App\Models\Level;


$factory->define(Level::class, function (Faker $faker) {

    $options = [
        'Gidget.left();', 'Gidget.right();', 'Gidget.up();', 'Gidget.down();',
        'Gidget.left()', 'Gidget.right()', 'Gidget.up()', 'Gidget.down()'
    ];

    $lc = rand(2, 15);
    $code = '';
    for ($i = 0; $i < $lc; $i++)
        $code .= $options[rand(0, count($options) - 1)] . "\r\n";

    $size = rand(2, 9);
    $levelTypes = array_keys(Level::levelRules());
    $level = [
        'title'       => $faker->sentence(3),
        'description' => $faker->sentence(10),
        'type'        => $faker->randomElement($levelTypes),
        'code'        => $code,
        'solution'    => '// SOLUTION',
        'published'   => $faker->boolean(95),
        'official'    => $faker->boolean(5),

        'size'     => $size + 1,
        'imports'  => ['Player'],
        'objects'  => [],
        'tiles'    => [],
        'dialogue' => [],
        'goals'    => [],
    ];

    // Player object
    $position = GameRand::randomPosition($size);
    $player = Game::gameObject('Gidget', $position, ['Player']);
    array_push($level['objects'], $player);

    // Tiles
    for ($i = $faker->numberBetween(1, 5); $i > 0; $i--)
        array_push($level['tiles'], GameRand::randomTile($level));

    // Objects
    for ($i = $faker->numberBetween(2, 5); $i > 0; $i--)
        array_push($level['objects'], GameRand::randomGameObject($level));

    // Dialogue
    for ($i = $faker->numberBetween(1, 5); $i > 0; $i--)
        array_push($level['dialogue'], Game::dialogue($faker->sentence($faker->numberBetween(10, 20))));

    // Goals
    for ($i = $faker->numberBetween(1, 5); $i > 0; $i--)
        array_push($level['goals'], GameRand::randomGoal($level));

    return [
        'title'       => $level['title'],
        'description' => $level['description'],
        'type'        => $level['type'],
        'difficulty'  => $faker->numberBetween(0, 10),
        'level'       => $level
    ];
});
