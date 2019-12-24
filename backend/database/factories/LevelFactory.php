<?php
use Faker\Generator as Faker;
use App\Models\Level;


$factory->define(Level::class, function (Faker $faker) {
    $levelTypes = array_keys(Level::levelRules());
    $level = [
        'title'       => $faker->sentence(4),
        'description' => $faker->sentence(20),
        'type'        => $faker->randomElement($levelTypes),
        'code'        => '// CODE',
        'solution'    => '// SOLUTION',
        'published'   => $faker->boolean(95),
        'official'    => $faker->boolean(5)
    ];

    return [
        'title'       => $level['title'],
        'description' => $level['description'],
        'type'        => $level['type'],
        'difficulty'  => $faker->numberBetween(0, 10),
        'level'       => json_encode($level)
    ];
});
