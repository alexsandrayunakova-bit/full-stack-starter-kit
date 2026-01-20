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
    Schema::create('ai_tools', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug')->unique();
        $table->text('description');
        $table->string('url')->nullable();
        $table->string('logo_url')->nullable();
        $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
        $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
        $table->json('suitable_for_roles')->nullable(); // JSON array с role IDs
        $table->enum('status', ['active', 'pending', 'archived'])->default('active');
        $table->integer('views_count')->default(0);
        $table->timestamps();
        
        $table->index(['category_id', 'status']);
        $table->index('created_by');
    });
}

public function down(): void
{
    Schema::dropIfExists('ai_tools');
}
};
