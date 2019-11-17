<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Carbon\Carbon;


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
             ->json('get', route('user.show'))
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
        $this->json('get', route('user.show'))->assertStatus(401);
    }
        
    /**
     * Creates a user without a profile. Updates no profile fields.
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

        $this->assertEquals($user->name, 'New Name');
    }

    /**
     * Creates a user without a profile. Updates all fields: users and profiles.
     * A profile should be created along with user field being updated.
     *
     * @return void
     */
    public function testUpdateUserCreateProfile(): void
    {
        $data = [
            'name' => 'New Name',
            'gender' => 'New Gender',
            'birthdate' => '2020-01-01'
        ];
        // Full update
        $user = factory(User::class)->create();
        $this->actingAs($user, 'api')
             ->patch(route('user.update'), $data);

        $this->assertNotNull($user->profile);

        // Name is a user field, user_profiles will not have a name column
        unset($data['name']);
        $this->assertDatabaseHas('user_profiles', $data);
    }
       
    /**
     * Creates a user without a profile. Updates profile fields. A profile
     * should be created with no update to user.
     *
     * @return void
     */
    public function testCreateProfile(): void
    {
        // Partial update, profile fields only
        $user = factory(User::class)->create();
        $this->actingAs($user, 'api')
             ->patch(route('user.update'), [
                 'gender' => 'New Gender',
                 'birthdate' => '2020-01-01'
             ]);
        $this->assertNotNull($user->profile);
    }
       
    /**
     * 
     * Creates a user with a profile. Updates profile fields. A profile should
     * be created.
     *
     * @return void
     */
    public function testUpdateProfile(): void
    {
        // Partial update, only one profile field
        $user = factory(User::class)->create();
        $this->actingAs($user, 'api')
             ->patch(route('user.update'), [
                 'gender' => 'New Gender'
             ]);

        $this->assertNotNull($user->profile);
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
        // Partial update, only one profile field
        $user = factory(User::class)->create();
        $this->actingAs($user, 'api')
             ->patch(route('user.update'), [
                 'gender' => 'New Gender'
             ]);

        $this->assertNotNull($user->profile);
        $this->assertEquals($user->profile->gender, 'New Gender');
        $this->assertNull($user->profile->birthdate);
    }
}
