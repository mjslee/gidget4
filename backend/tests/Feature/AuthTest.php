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

        // Create personal access client
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

        $this->json('post', route('register'), $payload)
             ->assertStatus(201)
             ->assertJsonStructure(['message']);
    }

    /**
     * Test user logging in returns a token.
     *
     * @return void
     */
    public function testLogin(): void
    {
        $email = 'test@user.com';
        $password = 'test1234';

        $user = factory(User::class)->create([
            'email' => $email,
            'password' => bcrypt($password),
        ]);

        $payload = ['email' => $email, 'password' => $password];

        $this->json('post', route('login'), $payload)
             ->assertJsonStructure(['access_token', 'token_type', 'expires_at'])
             ->assertStatus(200);
    }
}
