<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            ['name' => 'Machine Learning', 'color' => '#3B82F6'],
            ['name' => 'Natural Language Processing', 'color' => '#10B981'],
            ['name' => 'Computer Vision', 'color' => '#F59E0B'],
            ['name' => 'Text Generation', 'color' => '#8B5CF6'],
            ['name' => 'Image Generation', 'color' => '#EC4899'],
            ['name' => 'Code Assistant', 'color' => '#6366F1'],
            ['name' => 'Data Analysis', 'color' => '#14B8A6'],
            ['name' => 'Automation', 'color' => '#F97316'],
            ['name' => 'Chatbot', 'color' => '#06B6D4'],
            ['name' => 'Free', 'color' => '#22C55E'],
            ['name' => 'Paid', 'color' => '#EF4444'],
            ['name' => 'API Available', 'color' => '#A855F7'],
        ];

        foreach ($tags as $tag) {
            Tag::create([
                'name' => $tag['name'],
                'slug' => Str::slug($tag['name']),
                'color' => $tag['color'],
            ]);
        }
    }
}