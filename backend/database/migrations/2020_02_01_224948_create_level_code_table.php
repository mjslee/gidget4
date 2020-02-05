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
            $table->unsignedBigInteger('user_id')->nullable(true);
            $table->unsignedBigInteger('level_id')->nullable(true);

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
        Schema::table('level_code', function($table) {
            $table->dropForeign('level_code_user_id_foreign');
            $table->dropForeign('level_code_level_id_foreign');
        });
        Schema::dropIfExists('level_code');
    }
}
