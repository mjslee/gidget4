<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


class CreateLevelSessionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('level_sessions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->nullable(true);
            $table->unsignedBigInteger('level_id')->nullable(true);
            $table->json('data')->nullable();
            $table->boolean('completed')->default(false);
            $table->integer('update_count')->default(0);
            $table->datetime('completed_at')->nullable(true);
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
        Schema::table('level_sessions', function($table) {
            $table->dropForeign('level_sessions_user_id_foreign');
            $table->dropForeign('level_sessions_level_id_foreign');
        });

        Schema::dropIfExists('level_session');
    }
}
