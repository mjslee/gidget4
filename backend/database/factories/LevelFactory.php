<?php
use Faker\Generator as Faker;
use App\Helpers\RandomGameHelper;
use App\Models\Level;


$factory->define(Level::class, function (Faker $faker) {
    $size = 5;

    $levelTypes = array_keys(Level::levelRules());
    $level = [
        'title'       => $faker->sentence(4),
        'description' => $faker->sentence(1),
        'type'        => $faker->randomElement($levelTypes),
        'code'        => '// CODE',
        'solution'    => '// SOLUTION',
        'published'   => $faker->boolean(95),
        'official'    => $faker->boolean(5),

        'objects'  => [],
        'tiles'    => [],
        'dialogue' => [],
        'goals'    => [],
    ];

    for ($i = 0; $i < 3; $i++)
        array_push($level['objects'], RandomGameHelper::randomGameObject($size));

    for ($i = 0; $i < 3; $i++)
        array_push($level['tiles'], RandomGameHelper::randomTile($size));

    for ($i = 0; $i < 3; $i++)
        array_push($level['goals'], RandomGameHelper::randomGoal());

    for ($i = 0; $i < 3; $i++)
        array_push($level['dialogue'], RandomGameHelper::randomDialogue());

    return [
        'title'       => $level['title'],
        'description' => $level['description'],
        'type'        => $level['type'],
        'difficulty'  => $faker->numberBetween(0, 10),
        'level'       => $level
    ];
});
