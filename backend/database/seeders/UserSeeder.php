<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Alex Owner',
                'email' => 'owner@vibecode.bg',
                'password' => Hash::make('password123'),
                'role_id' => 1, // owner
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'John Backend',
                'email' => 'backend@vibecode.bg',
                'password' => Hash::make('password123'),
                'role_id' => 2, // backend
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sarah Frontend',
                'email' => 'frontend@vibecode.bg',
                'password' => Hash::make('password123'),
                'role_id' => 3, // frontend
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mike QA',
                'email' => 'qa@vibecode.bg',
                'password' => Hash::make('password123'),
                'role_id' => 4, // qa
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Emma Designer',
                'email' => 'designer@vibecode.bg',
                'password' => Hash::make('password123'),
                'role_id' => 5, // designer
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'David PM',
                'email' => 'pm@vibecode.bg',
                'password' => Hash::make('password123'),
                'role_id' => 6, // pm
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}