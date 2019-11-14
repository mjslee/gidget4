<?php
namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;

use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\RegistersUsers;


class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => [
                'required', 'string', 'max:255'
            ],
            'email' => [
                'required', 'string', 'email', 'max:255', 'unique:users'
            ],
            'password' => [
                'required', 'string', 'min:8', 'confirmed'
            ],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    /**
     * User registration attempt.
     * 
     * @param  Illuminate\Http\Request  $request
     */
    public function register(Request $request)
    {
        // POST data
        $data = $request->all();

        // Validate request and create user
        $this->validator($data)->validate();

        // Create user
        $user = $this->create($data);
        event(new Registered($user));

        return $this->registered($request, $user);
    }


    /**
     * User has been registered.
     *
     * @param  Illuminate\Http\Request  $request
     * @return \App\User
     */
    protected function registered(Request $request, User $user)
    {
        return response()->json(['message' => 'Successfully registered.'], 201);
    }
}
