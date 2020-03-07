<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


class CreateLevelProgressTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('level_progress', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('string_id', 64)->nullable(true);
            $table->unsignedBigInteger('user_id')->nullable(true);
            $table->unsignedBigInteger('level_id')->nullable(true);

            $table->json('data')->nullable(true);

            $table->unsignedInteger('load_count')->default(0);
            $table->unsignedInteger('update_count')->default(0);
            $table->unsignedInteger('doc_count')->default(0);
            $table->unsignedInteger('restore_count')->default(0);
            $table->unsignedInteger('reset_count')->default(0);

            $table->unsignedBigInteger('play_duration')->default(0);
            $table->unsignedBigInteger('doc_duration')->default(0);
            $table->unsignedBigInteger('focus_duration')->default(0);
            $table->unsignedBigInteger('idle_duration')->default(0);
            $table->unsignedBigInteger('tutorial_duration')->default(0);

            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();

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
        Schema::table('level_progress', function($table) {
            $table->dropForeign('level_progress_user_id_foreign');
            $table->dropForeign('level_progress_level_id_foreign');
        });

        Schema::dropIfExists('level_progress');
    }
}
