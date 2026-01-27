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
        Schema::table('ai_tools', function (Blueprint $table) {
            // Add indexes for frequently searched/filtered columns
            $table->index('status', 'ai_tools_status_index');
            $table->index('name', 'ai_tools_name_index');
            $table->index('views_count', 'ai_tools_views_count_index');
            $table->index('created_at', 'ai_tools_created_at_index');
        });

        Schema::table('tool_recommendations', function (Blueprint $table) {
            // Add composite index for tool recommendations aggregation
            $table->index(['tool_id', 'rating'], 'tool_recommendations_tool_rating_index');
        });

        Schema::table('tags', function (Blueprint $table) {
            // Add index for tag name sorting
            $table->index('name', 'tags_name_index');
        });

        Schema::table('categories', function (Blueprint $table) {
            // Add index for category name and slug
            $table->index('name', 'categories_name_index');
        });

        Schema::table('user_login_history', function (Blueprint $table) {
            // Add index for user login history queries
            $table->index('login_at', 'user_login_history_login_at_index');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            // Add indexes for audit log queries
            $table->index('user_id', 'audit_logs_user_id_index');
            $table->index('created_at', 'audit_logs_created_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->dropIndex('ai_tools_status_index');
            $table->dropIndex('ai_tools_name_index');
            $table->dropIndex('ai_tools_views_count_index');
            $table->dropIndex('ai_tools_created_at_index');
        });

        Schema::table('tool_recommendations', function (Blueprint $table) {
            $table->dropIndex('tool_recommendations_tool_rating_index');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->dropIndex('tags_name_index');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_name_index');
        });

        Schema::table('user_login_history', function (Blueprint $table) {
            $table->dropIndex('user_login_history_login_at_index');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex('audit_logs_user_id_index');
            $table->dropIndex('audit_logs_created_at_index');
        });
    }
};
