<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'GPT Models & Chatbots',
                'slug' => 'gpt-models-chatbots',
                'icon' => '💬',
                'color' => '#3B82F6',
                'description' => 'Large language models and conversational AI',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Code Assistants',
                'slug' => 'code-assistants',
                'icon' => '💻',
                'color' => '#10B981',
                'description' => 'AI tools for coding, debugging, and code review',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Design Tools',
                'slug' => 'design-tools',
                'icon' => '🎨',
                'color' => '#F59E0B',
                'description' => 'AI-powered design, image generation, and creative tools',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Productivity & Automation',
                'slug' => 'productivity-automation',
                'icon' => '⚡',
                'color' => '#8B5CF6',
                'description' => 'Workflow automation and productivity enhancers',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Data & Analytics',
                'slug' => 'data-analytics',
                'icon' => '📊',
                'color' => '#EC4899',
                'description' => 'AI for data analysis, visualization, and insights',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Testing & QA',
                'slug' => 'testing-qa',
                'icon' => '🧪',
                'color' => '#EF4444',
                'description' => 'Automated testing and quality assurance tools',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Project Management',
                'slug' => 'project-management',
                'icon' => '📋',
                'color' => '#06B6D4',
                'description' => 'AI tools for project planning and team coordination',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('categories')->insert($categories);
    }
}