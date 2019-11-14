<?php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Set up test environment.
     *
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        Artisan::call('passport:install');
    }

    /**
     * Test registering a user.
     *
     * @return void
     */
    public function testRegister(): void
    {
        $payload = [
            'name' => 'Test User',
            'email' => 'test@user.com',
            'password' => 'test1234',
            'password_confirmation' => 'test1234'
        ];

        $this->json('post', '/api/auth/register', $payload)
             ->assertStatus(201)
             ->assertJsonStructure(['message']);
    }
}
