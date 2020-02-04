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
        $code = "if   (true ) {\r\nconsole.log(\"This is a test.\") }; \r\n" .
            "test ();\r\n\t\ttest;\r\ntest( param, 'apostrophe' );\r\n";

        $expected = "if(true){console.log(\"   \")}test()testtest(param,'apostrophe')";

        $minified = CodeHelper::minifyJavaScript($code);
        $this->assertEquals($expected, $minified);
    }

}
