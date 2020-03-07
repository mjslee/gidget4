<?php
use Illuminate\Database\Seeder;
use App\Models\LevelCollection;


class LevelCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(LevelCollection::class, 50)->create();
    }
}
