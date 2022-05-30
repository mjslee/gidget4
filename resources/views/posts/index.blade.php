<x-layout> <!--Calls to the layout file in components for header, title, and links. Content below fills in slot-->
    @include ('posts._header') <!--Refers to partial conmtaing HTML and CSS for header-->

        <main class="max-w-6xl mx-auto mt-6 lg:mt-20 space-y-6">
            @if ($posts->count())
                <x-posts-grid :posts="$posts" />

                {{ $posts->links() }} <!--Calls in pagination links-->
            @else
                <p class="text-center">No posts yet. Please come back later</p>
            @endif
        </main>
</x-layout>