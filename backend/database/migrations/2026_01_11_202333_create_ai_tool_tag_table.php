<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_tool_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_tool_id')->constrained('ai_tools')->onDelete('cascade');
            $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['ai_tool_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_tool_tag');
    }
};