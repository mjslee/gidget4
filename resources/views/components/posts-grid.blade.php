@props(['posts'])
<x-post-featured-card :post="$posts[0]" /> <!--Refers to component and the post being passed-->
                @if ($posts->count() > 1)
                    <div class="lg:grid lg:grid-cols-6">
                        @foreach ($posts->skip(1) as $post) 
                            <x-post-card 
                                :post="$post" 
                                class="{{ $loop->iteration < 3 ? 'col-span-3' : 'col-span-2' }}"
                            /> <!--Refers to component-->
                        @endforeach
                    </div>
                @endif