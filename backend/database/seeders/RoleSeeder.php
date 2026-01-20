<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'owner',
                'display_name' => 'Owner',
                'description' => 'Company owner with full access',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'backend',
                'display_name' => 'Backend Developer',
                'description' => 'Backend development team member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'frontend',
                'display_name' => 'Frontend Developer',
                'description' => 'Frontend development team member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'qa',
                'display_name' => 'QA Engineer',
                'description' => 'Quality Assurance team member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'designer',
                'display_name' => 'Designer',
                'description' => 'UI/UX Designer',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'pm',
                'display_name' => 'Project Manager',
                'description' => 'Project management team member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('roles')->insert($roles);
    }
}