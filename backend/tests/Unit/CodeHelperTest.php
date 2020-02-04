<?php
namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Helpers\CodeHelper;


class CodeHelperTest extends TestCase
{

    /**
     * Test minifyJavaScript method.
     *
     * @return void
     */
    public function testMinifyJavaScript()
    {
        $code = "if   (true ) {\r\nconsole.log(\"            \") }; \r\n" .
            "test ();\r\n\t\ttest;\r\ntest( param, 'apostrophe' );\r\n";

        $expected = "if(true){console.log(\"\")}test()testtest(param,'apostrophe')";

        $minified = CodeHelper::minifyJavaScript($code);
        $this->assertEquals($expected, $minified);
    }

    /**
     * Test hashCode method.
     *
     * @return void
     */
    public function testHashCode()
    {
        $code = "if(true){console.log(\"\")}test()testtest(param,'apostrophe')";
        $expected = '7cc66303e958f681d2accb666c62584ef0bd0ae2';

        $hash = CodeHelper::hashCode($code);
        $this->assertEquals($expected, $hash);
    }

}
