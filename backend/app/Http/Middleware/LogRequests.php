<?php

namespace App\Http\Middleware;

use Closure;
use Log;

class LogRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $data = json_encode($request->all());
        Log::notice($request->ip() . ': /' . $request->path() . ' | ' . $data);
        return $next($request);
    }
}
