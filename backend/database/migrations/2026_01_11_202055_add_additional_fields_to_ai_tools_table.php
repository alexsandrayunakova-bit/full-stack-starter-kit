<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->string('documentation_url')->nullable()->after('url');
            $table->text('how_to_use')->nullable()->after('description');
            $table->text('examples')->nullable()->after('how_to_use');
            $table->json('images')->nullable()->after('logo_url');
        });
    }

    public function down(): void
    {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->dropColumn(['documentation_url', 'how_to_use', 'examples', 'images']);
        });
    }
};