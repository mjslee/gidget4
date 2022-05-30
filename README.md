<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Message From Previous Gidget Dev
Everything within the "gidgetbuild" directory was made using Laravel Sail + Laravel Breeze. Laravel Sail is an all in one container with Docker and PHP, while Laravel Breeze is a kit with built in authentication features. I worked on everything contained in this "gidgetbuild" folder, focusing specificslly on the backend. I never worked on anything with the Gidget 4.0 front end, but I am told it is already completed. 
In its current form it looks and acts as a blog, but this code will be used as the backbone of Gidget 4.0 backend


If you are not at all familiar with Gidget, learn through this video series: https://laracasts.com/series/laravel-8-from-scratch


It may ask for money, but that is not necissary and can be ignored. As of the time of writing, this video series is free
While very long, it will teach you all the basics of Laravel (though it skims over Breeze, which is used for the login/logout, Auth system)
Following this video series, and integrating it with Laravel Breeze will get you the exact blog created here. In fact, it was made originally by me following it set by step, until I created a new project with Breeze and transfered over my progress from the original to the new project
You will learn about controllers, views, factories, and models through the video series, all of which are used in this project
More on Laravel Sail: https://laravel.com/docs/9.x/sail
More on Laravel Breeze: https://laravel.com/docs/9.x/starter-kits


This blog, while not integrated with Gidget Frontend, is designed to do so relatively 1-to-1
"Post" model is a stand-in for a gidget level, with slight tweeks to the model and controller, levels can be stored using the same attributes
This means levels can then be shared (like how blog post are) and searched by tags (category), filters, or keywords
This will allow Gidget 4.0 to have user generated content through the level creator to be shared, similar to thinks such as Roblox

.env file is where metadata about your database, email services, and making your site live is all held. Make sure you go here when setting up your database for testing. Personally, I used MySQL through TablePlus. Feel free to use the migrations and factories to populate the databases with test data once all is set up.

Routes are where you establish how to connect from one page (or blade) to another. I mainly worked on web.php routes, but auth.php routes are important when dealing with password reset, authentication, etc.

Speaking of which, test functionslity for password reset is working up to the point where a recovery email is sent to the user. While in the test, the site
successful "sends an email" no actual email is sent as there is no mail service set up in the .env at this time. When you add this, you will be able to further test. For now, when a request for a recovery email is sent, you can see a recovery_token is made in the password_reset table, which is a good sign that it is working. While Laravel Sail is capable of also verifying and authentication emails, this is not currently active, but all the controllers and routes for it can be found in this project
More on linking an email to .env: https://laracasts.com/series/laravel-6-from-scratch/episodes/42


With a function backend and frontend, your main task now are: 
1) Fill in the gaps in the recovery/authentication procedure detailed above, again a lot of the controllers you need to do these things are already written 
2) Connect the front end to the backend. In my opinion, once you have a good understanding in Laravel, you should start by modifying the Post model, table, etc. to moreso fit a gidget level then a blog post. You can have Gidget's prebuilt levels be flagged with a specific order, and then traverse them in order with the ability to save the current level ID for each user in the user table. After this, the level builder can use the blog base to make it able to share user-generated levels if desired. If user content is desired, it may be good to create files allowing for admin (this was never done by me, but it can be detailed how at the end of the Laracast video series). Continue to modify the routes and the views to link them more and more towards the Gidget front end, and less and less from the "Laravel Blog" design it current has.  
The rest of this README file is autogenerated by Laravel, and while its more generic, it still contains useful information on LAravel documentation. Parting advice, if you get stuck try to use the resources linked above, the documentation, Stack Overflow, of the Laracast question form. At the very least, Google the error your getting and see what others were able to find. Helped me get out of most of my errors, even the most frustrating ones had solutions hidden somewhere. Best of luck in finishing this project, I can't wait to see how it turns out!


## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 2000 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**
- **[WebReinvent](https://webreinvent.com/?utm_source=laravel&utm_medium=github&utm_campaign=patreon-sponsors)**
- **[Lendio](https://lendio.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
