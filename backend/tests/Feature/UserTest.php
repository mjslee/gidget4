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
        
    /**
     * Creates a user without a profile. Updates no profile fields. Therefore,
     * no profile should exist.
     *
     * @return void
     */
    public function testUpdateUser(): void
    {
        // Partial update, name fields only
        $user = factory(User::class)->create();
        $this->actingAs($user, 'api')
             ->patch(route('user.update'), [
                 'name' => 'New Name'
             ]);

        $this->assertNull($user->profile);
    }

    /**
     * Creates a user without a profile. Updates all fields: users and profiles.
     * A profile should be created along with user field being updated.
     *
     * @return void
     */
    public function testUpdateUserCreateProfile(): void
    {
    }
       
    /**
     * Creates a user without a profile. Updates profile fields. A profile
     * should be created with no update to user.
     *
     * @return void
     */
    public function testCreateProfile(): void
    {
    }
       
    /**
     * 
     * Creates a user with a profile. Updates profile fields.
     * profile should be created.
     *
     * @return void
     */
    public function testUpdateProfile(): void
    {
    }
       
    /**
     * 
     * Creates a user without a profile. Updates one profile field. A partial
     * profile should be created.
     *
     * @return void
     */
    public function testCreatePartialProfile(): void
    {
    }
}
