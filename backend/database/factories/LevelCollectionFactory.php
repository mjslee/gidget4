<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Model;
use App\Models\Level;
use App\Models\LevelCollection;
use Faker\Generator as Faker;


$factory->define(LevelCollection::class, function (Faker $faker) {
    return [
        'title'       => $faker->title,
        'description' => $faker->sentences(5, true)
    ];
});


$factory->afterCreating(LevelCollection::class, function (LevelCollection $collection, $faker) {
    $rand = random_int(3, 10);
    for ($i = 0; $i < $rand; $i++)
        $collection->levels()->save(factory(Level::class)->create());
});
