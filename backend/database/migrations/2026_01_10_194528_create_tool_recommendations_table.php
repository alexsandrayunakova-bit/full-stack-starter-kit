<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('tool_recommendations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tool_id')->constrained('ai_tools')->onDelete('cascade');
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->integer('rating')->nullable(); // 1-5 звезди
        $table->text('comment')->nullable();
        $table->timestamps();
        
        $table->unique(['tool_id', 'user_id']); // един потребител - една препоръка на tool
        $table->index('tool_id');
    });
}

public function down(): void
{
    Schema::dropIfExists('tool_recommendations');
}
};
