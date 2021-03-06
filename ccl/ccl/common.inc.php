<?php
require_once("OAuth.php");
require_once("OAuth_TestServer.php");

/*
 * Config Section
 */
$domain = $_SERVER['HTTP_HOST'];
$base = "/oauth/example";

//define("website_url","http://192.168.200.116");
define("website_url","http://library.collaborizeclassroom.com");
define("classroom_website_url","http://www.collaborizeclassroom.com/");
define("forgot_password_url","http://collaborize.collaborizeclassroom.com/portal/portal/collaborize/site/window?action=b&cacheability=PAGE&actionEvent=forgotPasswordForCCL");
//define("forgot_password_url","http://192.168.200.113:8080/portal/portal/collaborize/site/window?action=b&cacheability=PAGE&actionEvent=forgotPasswordForCCL");

//$server_address = "http://192.168.200.85:8080";
//$server_address = "http://library.collaborizeclassroom.com";
$server_address = "http://library.collaborizeinfrastructure3.com";
$base_url = $server_address."/cclibrary/restapi/services/oauth";
$ConsumerKey = "VGVzdEFwcA==";
$SecretKey = "bm8=";

define("ConsumerKey",$ConsumerKey);
define("SecretKey",$SecretKey);
define("base_url",$base_url);
/**
 * Some default objects
 */

$lifetime=172800;
session_set_cookie_params($lifetime);
//session_start();
set_time_limit(0);
$test_server = new TestOAuthServer(new MockOAuthDataStore());
$hmac_method = new OAuthSignatureMethod_HMAC_SHA1();
$plaintext_method = new OAuthSignatureMethod_PLAINTEXT();
$rsa_method = new TestOAuthSignatureMethod_RSA_SHA1();

$test_server->add_signature_method($hmac_method);
$test_server->add_signature_method($plaintext_method);
$test_server->add_signature_method($rsa_method);

$sig_methods = $test_server->get_signature_methods();

?>
