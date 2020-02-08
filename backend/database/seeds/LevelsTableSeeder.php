<?php
use Illuminate\Database\Seeder;
use App\Models\Level;


class LevelsTableSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Level::class, 50)->create();
    }

}
