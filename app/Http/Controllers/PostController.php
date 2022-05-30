<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    
    public function index()
    {
        return view('posts.index', [ //Passes Post object to view to be displayed
            'posts' => Post::latest()->filter(
                request(['search', 'category', 'author'])
            )->paginate(6)->withQueryString() //Calls "all" method in Post class to return a collection of all Post objects WITH their associated category relationship
        ]);     
    }

    public function show (Post $post)
    {
        return view('posts.show', [
            'post' => $post
        ]);
    }
}