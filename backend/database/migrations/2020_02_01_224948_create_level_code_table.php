<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLevelCodeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('level_code', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('level_id');

            $table->longText('code');
            $table->string('hash');

            $table->unsignedInteger('step_count');
            $table->unsignedInteger('evaluation_count');
            $table->unsignedBigInteger('evaluation_duration');

            $table->ipAddress('ip_address');
            $table->string('user_agent');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('level_id')->references('id')->on('levels');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('level_code');
    }
}
