<?php
require_once("ccl/common.inc.php");
require_once("ccl/functions.php");
require_once("ccl/JSON.php");
session_start();
$json = new Services_JSON();
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

		$url = $server_address.'/cclibrary/restapi/topics/get';

		$json_request = '{"ccl_topic_id":"'.trim($_REQUEST['topic_id']).'"}';

		if(isset($json_request) && $json_request!="{}")
		{
			$params['jsonRequest'] = str_replace('\"','%22',$json_request);

			$params['jsonRequest'] = str_replace('\"','%22',$params['jsonRequest']);
		}
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

		$apiMethodType = 'get';
		
		$Response = getResponseByParams($url,$params,$apiMethodType,$enableHeader,$havingParams);

		$TopicDetails=$json->decode($Response);
	
	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>	
    <title><?php echo $TopicDetails->response->result->topic_title; ?></title>
	<meta name="robots" content="index,follow" /> 
	<meta name="fragment" content="!">
	<link rel="shortcut icon" href="/ccl/img/CC_icon-favicon.ico">
    <link rel="icon" type="image/png" href="/ccl/img/CC_icon-favicon.png">
	<link rel="stylesheet" href="/ccl/css/screen.css" type="text/css" media="screen, projection" />
    <link rel="stylesheet" href="/ccl/css/main.css" type="text/css" />
</head>
<body>
	<div id="page" class="container unauthenticated">
        <!-- Header DIV Start -->
        <div id="header" class="span-20">
            <a href="#!" class="logo">Collaborize Classroom Library</a>
            <div id="userInfoArea">
            </div>
        </div>
        <!-- Header DIV End -->
        <p class="clear" />
        <!-- Header Info Aread Start -->
        <div id="headerAdditionalInfo">
            <span class="left">Topics For Your Collaborize Classroom</span>
            <p class="clear" />
        </div>
        <!-- Header Info Aread End -->
        <div id="pagesHolder">
            <div id="internalPage">
				<!-- Topic Details Start -->
				<div id="topicDetailsContainer" class="topicDetailsContainer ccl_preview_topic_modal_dialog" style="position: relative;">
                        <h1><?php echo $TopicDetails->response->result->topic_title; ?></h1>    
                        <div class="topicDescription"><div id="tDesc_29101" class="topic-description"><?php echo $TopicDetails->response->result->topic_desc; ?></div></div>

						<!--<div class="attachments " style="text-align: center;">
							    <img  src="<?php echo $TopicDetails->response->result->attachment_details; ?>" title="photo" class="photoAttachment">
						</div>-->
                    </div>
				<!-- Topic Details End -->
				</div>
            </div>
			<?php if( count($TopicDetails->response->result->subjects)>0) { ?>
			<div class="topicDetailsRightContent">
					<h4>Subjects 	</h4>
					<span id="subjectsList">
					<?php foreach($TopicDetails->response->result->subjects as $subject) { ?>
						<span id="5"><?php echo $subject->subject->name; ?></span>,
					<?php } ?>
					</span>
					
			</div>
			<?php } ?>
			<?php if( count($TopicDetails->response->result->grades)>0) { ?>
			<div class="topicDetailsRightContent">
					<h4>Grade Levels </h4>
					<span id="gradesList"> 
					<?php foreach($TopicDetails->response->result->grades as $grade) { ?>
						<span id="1"><?php echo $grade->grade->name; ?></span>,
						<?php } ?>
					</span>
					
			</div>
			<?php } ?>
			<?php if( count($TopicDetails->response->result->tags)>0) { ?>
			<div class="topicDetailsRightContent">
					<h4>Tags </h4>
					<div id="displayTags">
					<?php foreach($TopicDetails->response->result->tags as $tags) { ?>
									<span id="1"><?php echo $tags->tag->name; ?></span>,
					<?php } ?>
						<p class="clear"></p>
					<div>
			</div>
			<?php } ?>
            <p class="clear" />
        </div>
</body>
</html>