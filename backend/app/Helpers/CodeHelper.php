<?php
namespace App\Helpers;


class CodeHelper
{
    /**
     * Minify JavaScript code by removing whitespace and semicolons.
     *
     * @param String $code JavaScript code to be minified.
     * @return String Minified JavaScript code.
     */
    public static function minifyJavaScript(String $code) : String
    {
        return preg_replace('/[\s;\r\n]+/', '', $code);
    }

}
