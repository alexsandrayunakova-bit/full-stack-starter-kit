<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AiToolSeeder extends Seeder
{
    public function run(): void
    {
        $tools = [
            [
                'name' => 'ChatGPT',
                'slug' => 'chatgpt',
                'description' => 'OpenAI\'s conversational AI model for natural language understanding and generation. Perfect for brainstorming, writing, and problem-solving.',
                'url' => 'https://chat.openai.com',
                'logo_url' => null,
                'category_id' => 1, // GPT Models
                'created_by' => 1, // owner
                'suitable_for_roles' => json_encode([1, 2, 3, 4, 5, 6]), // all roles
                'status' => 'active',
                'views_count' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'GitHub Copilot',
                'slug' => 'github-copilot',
                'description' => 'AI pair programmer that helps you write code faster. Suggests entire lines and functions as you type.',
                'url' => 'https://github.com/features/copilot',
                'logo_url' => null,
                'category_id' => 2, // Code Assistants
                'created_by' => 2, // backend dev
                'suitable_for_roles' => json_encode([2, 3]), // backend, frontend
                'status' => 'active',
                'views_count' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Midjourney',
                'slug' => 'midjourney',
                'description' => 'AI image generation tool that creates stunning visuals from text descriptions. Great for mockups and creative exploration.',
                'url' => 'https://www.midjourney.com',
                'logo_url' => null,
                'category_id' => 3, // Design Tools
                'created_by' => 5, // designer
                'suitable_for_roles' => json_encode([5, 6]), // designer, pm
                'status' => 'active',
                'views_count' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cursor',
                'slug' => 'cursor',
                'description' => 'AI-first code editor built on VS Code. Chat with your codebase, refactor code, and build features faster.',
                'url' => 'https://cursor.sh',
                'logo_url' => null,
                'category_id' => 2, // Code Assistants
                'created_by' => 3, // frontend dev
                'suitable_for_roles' => json_encode([2, 3]), // backend, frontend
                'status' => 'active',
                'views_count' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Notion AI',
                'slug' => 'notion-ai',
                'description' => 'AI writing assistant integrated into Notion. Helps with documentation, meeting notes, and project planning.',
                'url' => 'https://www.notion.so/product/ai',
                'logo_url' => null,
                'category_id' => 4, // Productivity
                'created_by' => 6, // pm
                'suitable_for_roles' => json_encode([1, 6]), // owner, pm
                'status' => 'active',
                'views_count' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Playwright AI',
                'slug' => 'playwright-ai',
                'description' => 'AI-powered test generation for Playwright. Automatically creates E2E tests from user interactions.',
                'url' => 'https://playwright.dev',
                'logo_url' => null,
                'category_id' => 6, // Testing & QA
                'created_by' => 4, // qa
                'suitable_for_roles' => json_encode([4]), // qa
                'status' => 'active',
                'views_count' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('ai_tools')->insert($tools);
    }
}