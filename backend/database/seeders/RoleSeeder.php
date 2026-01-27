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
            ],
            [
                'name' => 'backend',
                'display_name' => 'Backend Developer',
                'description' => 'Backend development team member',
            ],
            [
                'name' => 'frontend',
                'display_name' => 'Frontend Developer',
                'description' => 'Frontend development team member',
            ],
            [
                'name' => 'qa',
                'display_name' => 'QA Engineer',
                'description' => 'Quality Assurance team member',
            ],
            [
                'name' => 'designer',
                'display_name' => 'Designer',
                'description' => 'UI/UX Designer',
            ],
            [
                'name' => 'pm',
                'display_name' => 'Project Manager',
                'description' => 'Project management team member',
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['name' => $role['name']],
                [
                    'display_name' => $role['display_name'],
                    'description' => $role['description'],
                    'updated_at' => now(),
                    'created_at' => DB::raw('COALESCE(created_at, "' . now() . '")'),
                ]
            );
        }
    }
}