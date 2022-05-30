<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory; // Post::factory()

    protected $fillable = ['title', 'slug', 'excerpt', 'body', 'category_id'];
     protected $with = ['category', 'author'];

    public function scopeFilter($query, array $filters) // Called by Post::newQuery()->filter()
    {
        $query->when($filters['search'] ?? false, fn($query, $search) =>
            $query->where(fn($query) =>
                $query->where('title', 'like', '%' . request('search') . '%')
                ->orWhere('excerpt', 'like', '%' . request('search') . '%') 
            )
        );
        
        $query->when($filters['category'] ?? false, fn($query, $category) =>
            $query
                ->whereHas('category', fn($query) => $query->where('slug', $category)));
        
        $query->when($filters['author'] ?? false, fn($query, $author) =>
            $query
                ->whereHas('author', fn($query) => $query->where('username', $author)));
        

    }

    public function category() //Eloquent Relationship that returns the kind of post it is by calling $post->category;
    {
        return $this->belongsTo(Category::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
