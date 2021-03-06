<?php

ini_set('display_errors', '0'); 
error_reporting(E_ALL | E_STRICT);

require_once("common.inc.php");
require_once("JSON.php");
require_once("functions.php");
error_reporting(E_ALL);
//create a new instance of Services_JSON
$json = new Services_JSON();
session_start();
$sessionParams = $_SESSION;

if(!isset($sessionParams['authToken']) || !isset($sessionParams['authTokenSecret']) || $sessionParams['authTokenSecret']=="" || $sessionParams['authToken']=="")
{
	$ccl_consumer = new OAuthConsumer(ConsumerKey, SecretKey, NULL);
	$hmac_method = new OAuthSignatureMethod_HMAC_SHA1();
	$json = new Services_JSON();
	$sig_method = $hmac_method;
	$user_sig_method = @$_GET['sig_method'];
	
	if ($user_sig_method) {
	  $sig_method = $sig_methods[$user_sig_method];
	}
	$signatureMethodName =  $sig_method->get_name();

	$req_req = OAuthRequest::from_consumer_and_token($ccl_consumer, NULL, "GET", $base_url.'/requestToken');
	$req_req->sign_request($sig_method, $ccl_consumer, NULL);
	if(!isset($_SESSION['ccl_user_logged_in']) || (!$_SESSION['ccl_user_logged_in']))
	{
		$responseDataR = getResponseByUrl($req_req);

		if($responseDataR->response->stat=="ok")
		{
			$authToken = $responseDataR->response->result->token;
			$authTokenSecret = $responseDataR->response->result->secretkey;

			$_SESSION['authToken'] = $authToken;
			$_SESSION['authTokenSecret'] = $authTokenSecret;

		}
	}
}
$sessionParams = $_SESSION;
if(isset($_REQUEST['task']))
{
	if(isset($_REQUEST['task']) && $_REQUEST['task']!="profileUpdate" && $_REQUEST['task']!="login" && $_REQUEST['task']!="logout" && $_REQUEST['task']!="clearRememberAction")
	{
		session_write_close();
	}
}
else
{
	session_write_close();
}
if(isset($sessionParams['authToken']) && isset($sessionParams['authTokenSecret']) && $sessionParams['authTokenSecret']!="" && $sessionParams['authToken']!="")
{
	if(isset($_REQUEST['task']) && $_REQUEST['task']=="login")
	{
			$url = $server_address.$_REQUEST['targetUrl'];
			echo $res = getUserAuthentication($url);
			session_write_close();
	}
	else if(isset($_REQUEST['task']) && $_REQUEST['task']=="logout")
	{
			$serviceUrl = $base_url.'/signOut';
			$ccl_consumer = new OAuthConsumer(ConsumerKey, SecretKey, NULL);
			$hmac_method = new OAuthSignatureMethod_HMAC_SHA1();
			$json = new Services_JSON();
			$sig_method = $hmac_method;
			$user_sig_method = @$_GET['sig_method'];
			
			if ($user_sig_method) {
			  $sig_method = $sig_methods[$user_sig_method];
			}
			$signatureMethodName =  $sig_method->get_name();
			$req_token = new OAuthConsumer($sessionParams['authToken'], $sessionParams['authTokenSecret'], 1);
			$acc_req = OAuthRequest::from_consumer_and_token($ccl_consumer,$req_token, "GET", $serviceUrl);
			
			$params['oauth_version'] = $acc_req->get_parameter('oauth_version');
			$params['oauth_nonce'] = $acc_req->get_parameter('oauth_nonce');
			$params['oauth_timestamp'] = $acc_req->get_parameter('oauth_timestamp');
			$params['oauth_consumer_key'] = $acc_req->get_parameter('oauth_consumer_key');
			$params['oauth_signature_method'] = $signatureMethodName;
			$params['oauth_token'] = $sessionParams['authToken'];
		
			$acc_req->sign_request($sig_method, $ccl_consumer, $req_token);
			$params['oauth_signature'] = $acc_req->get_parameter('oauth_signature');

			
			
			$QueryString = "";
			foreach($params as $key=>$value)
			{
				if($QueryString=="")
					$QueryString = $key."=".$value;
				else
					$QueryString.= "&".$key."=".$value;
			}
			$serviceUrl = $serviceUrl."?".$QueryString;
			$res = getResponseByDirectUrl($serviceUrl,"delete");
			unset($_SESSION['ccl_user_logged_in']);
			unset($_SESSION['ccl_user_logged_object']);
			unset($_SESSION['authToken']);
			unset($_SESSION['authTokenSecret']);
			echo '{"response":{"stat":"ok"}}';
			session_write_close();
			
	}
	else if(isset($_REQUEST['task']) && $_REQUEST['task']=="forgotpassword")
	{
			$Email = $_REQUEST['emailId'];
			$resetPasswordUrl = classroom_website_url."reset_password.php?email=".base64_encode(urldecode(urldecode($Email)))."&no_login=false";
			$serviceUrl = forgot_password_url."&emailId=".$Email."&url=".urlencode(urlencode($resetPasswordUrl));
			$res = getResponseByDirectUrl($serviceUrl,"get");
			echo $res;
	}
	else if(isset($_REQUEST['task']) && $_REQUEST['task']=="clearRememberAction")
	{
			unset($_SESSION['rememberAction']);
			echo '{"response":{"stat":"ok"}}';
			session_write_close();
	}
	else
	{
		$url = $server_address.$_REQUEST['targetUrl'];
		if(isset($_POST['jsonRequest']) && $_POST['jsonRequest']!="{}")
		{
			$params['jsonRequest'] = str_replace('\"','%22',$_POST['jsonRequest']);

			$params['jsonRequest'] = str_replace('\"','%22',$params['jsonRequest']);
		}
		//echo $params['jsonRequest'] = htmlspecialchars($_POST['jsonRequest']);
		
		$enableHeader = true;
		if(isset($_REQUEST['site']))
		{
			$params['site'] = urlencode($_REQUEST['site']);
			$enableHeader = false;
		}
		$ccl_consumer = new OAuthConsumer(ConsumerKey, SecretKey, NULL);
		$hmac_method = new OAuthSignatureMethod_HMAC_SHA1();
		$json = new Services_JSON();
		$sig_method = $hmac_method;
		$user_sig_method = @$_GET['sig_method'];
		
		if ($user_sig_method) {
		  $sig_method = $sig_methods[$user_sig_method];
		}
		$signatureMethodName =  $sig_method->get_name();

		$req_token = new OAuthConsumer($_SESSION['authToken'], $_SESSION['authTokenSecret'], 1);

		$acc_req = OAuthRequest::from_consumer_and_token($ccl_consumer,$req_token, "GET", $url);
		
		$params['oauth_version'] = $acc_req->get_parameter('oauth_version');
		$params['oauth_nonce'] = $acc_req->get_parameter('oauth_nonce');
		$params['oauth_timestamp'] = $acc_req->get_parameter('oauth_timestamp');
		$params['oauth_consumer_key'] = $acc_req->get_parameter('oauth_consumer_key');
		$params['oauth_signature_method'] = $signatureMethodName;
		$params['oauth_token'] = $sessionParams['authToken'];
	
		$acc_req->sign_request($sig_method, $ccl_consumer, $req_token);
		$params['oauth_signature'] = $acc_req->get_parameter('oauth_signature');


		if(stristr($url,"?"))
		{
			$havingParams = true;
		}
		else
		{
			$havingParams = false;
		}

		$apiMethodType = $_REQUEST['apiMethodType'];
		
		$Response = getResponseByParams($url,$params,$apiMethodType,$enableHeader,$havingParams);
		
		if(isset($_REQUEST['task']) && $_REQUEST['task']=="profileUpdate")
		{
			
			$responseDataAccess=$json->decode($Response);
			if(isset($sessionParams['ccl_user_logged_object']))
			{
				$responseDataSession = $json->decode($sessionParams['ccl_user_logged_object']);
			}

			if(isset($responseDataAccess) && $responseDataAccess->response->stat=="ok")
			{
				$responseDataSession->response->result->user->screenName = trim($_REQUEST['screen_name']);
				$ResponseSession = $json->encode($responseDataSession);
				$_SESSION['ccl_user_logged_object'] = $ResponseSession;
				echo $_SESSION['ccl_user_logged_object'];
				session_write_close();
			}
			else
			{
				echo $Response;
			}
		}
		else
		{
			echo $Response;
		}
	}

}
function getUserAuthentication($url)
{
	$ccl_consumer = new OAuthConsumer(ConsumerKey, SecretKey, NULL);
	$hmac_method = new OAuthSignatureMethod_HMAC_SHA1();
	$json = new Services_JSON();
	$sig_method = $hmac_method;
	$user_sig_method = @$_GET['sig_method'];
	
	if ($user_sig_method) {
	  $sig_method = $sig_methods[$user_sig_method];
	}
	
	$req_token = new OAuthConsumer($_SESSION['authToken'], $_SESSION['authTokenSecret'], 1);

	$acc_req = OAuthRequest::from_consumer_and_token($ccl_consumer,$req_token, "GET", base_url . "/authorize");
	
	$accessParams['oauth_version'] = $acc_req->get_parameter('oauth_version');
	$accessParams['oauth_nonce'] = $acc_req->get_parameter('oauth_nonce');
	$accessParams['oauth_timestamp'] = $acc_req->get_parameter('oauth_timestamp');
	$accessParams['oauth_consumer_key'] = $acc_req->get_parameter('oauth_consumer_key');
	$accessParams['oauth_token'] = $_SESSION['authToken'];
	
	if(isset($_POST['userToken']) && $_POST['userToken']!="")
	{
		$accessParams['userToken'] = urlencode($_POST['userToken']);
		
	}
	else
	{
		$accessParams['emailId'] = urlencode($_REQUEST['emailId']);
		$accessParams['password'] = $_REQUEST['password'];
	}

	$acc_req->sign_request($sig_method, $ccl_consumer, $req_token);
	$accessParams['oauth_signature'] = $acc_req->get_parameter('oauth_signature');

	$enableHeader=true;
	$havingParams=false;
	
	$responseDataA = getResponseByParams(base_url . "/authorize",$accessParams,"post");
	$responseDataAccess=$json->decode($responseDataA);

	if(isset($responseDataAccess) && $responseDataAccess->response->stat=="ok")
	{
		if(isset($responseDataAccess->response->result->oauthToken))
		{
		$authToken = $responseDataAccess->response->result->oauthToken;
		$authTokenSecret = $responseDataAccess->response->result->oauthSecret;

		$_SESSION['authToken'] = $authToken;
		$_SESSION['authTokenSecret'] = $authTokenSecret;
		$_SESSION['ccl_user_logged_in'] = true;
		$_SESSION['ccl_user_logged_object'] = $responseDataA;
		}
		
		if(isset($_POST['rememberAction']) && trim($_POST['rememberAction'])!="")
		{
			$_SESSION['rememberAction'] = trim($_POST['rememberAction']);
		}
	}
	return $responseDataA;
}
?>