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

    /**
     * Create a SHA-1 hash of minified code.
     *
     * @param String $minifiedCode Code that has been minified.
     * @return String Hash of the parameter.
     */
    public static function hashCode(String $minifiedCode) : String
    {
        return sha1($minifiedCode);
    }

    /**
     * Test if value is a valid JSON string.
     *
     * @param String $value JSON string.
     * @return Boolean
     */
    public static function isValidJSON(String $value)
    {
        json_decode($value);
        return json_last_error() == JSON_ERROR_NONE;
    }
    
}
