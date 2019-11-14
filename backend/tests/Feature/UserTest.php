<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;


class UserTest extends TestCase
{

    use RefreshDatabase;

    /**
     * Gets a user when authenticated.
     *
     * @return void
     */
    public function testGetUserAuthenticated(): void
    {
        $user = factory(User::class)->create();
        $this->actingAs($user, 'api')
             ->json('get', route('user'))
             ->assertStatus(200)
             ->assertJsonStructure(['id', 'name', 'email', 'profile']);
    }

    /**
     * Does not get user when not authenticated and receives a 401 error.
     *
     * @return void
     */
    public function testGetUserUnauthenticated(): void
    {
        $this->json('get', route('user'))->assertStatus(401);
    }

}
