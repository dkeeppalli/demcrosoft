<?php
ini_set('display_errors', '0'); 
error_reporting(E_ALL | E_STRICT);

if(isset($_REQUEST['_escaped_fragment_']))
{
	$QueryString = $_SERVER['QUERY_STRING'];
	$data = explode("/",$QueryString);
	$TopicId = $data[2];
	//$NewQueryString = str_replace("_escaped_fragment=","#!",$QueryString);
	//header("Location:/".$NewQueryString);
//	header("Location:/topic_details.php?topic_id=".$TopicId);
$Response = file_get_contents("http://library.collaborizeclassroom.com/topic_details.php?topic_id=".$TopicId);
        echo $Response;
	exit;
}
require_once("ccl/common.inc.php");
require_once("ccl/functions.php");
session_start();
$authToken = "";
$authTokenSecret = "";
$json = new Services_JSON();
$ccl_consumer = new OAuthConsumer($ConsumerKey, $SecretKey, NULL);


$req_token = new OAuthConsumer("requestkey", "requestsecret", 1);
$acc_token = new OAuthConsumer("accesskey", "accesssecret", 1);

$sig_method = $hmac_method;
$user_sig_method = @$_GET['sig_method'];

if ($user_sig_method) {
  $sig_method = $sig_methods[$user_sig_method];
}

$signatureMethodName =  $sig_method->get_name();

// To Handle auto login from cc.com site

if(isset($_REQUEST['userToken']) && $_REQUEST['userToken']!="")
{
	$req_req = OAuthRequest::from_consumer_and_token($ccl_consumer, NULL, "GET", $base_url.'/requestToken');
	$req_req->sign_request($sig_method, $ccl_consumer, NULL);
	
		$responseDataR = getResponseByUrl($req_req);
		

		if($responseDataR->response->stat=="ok")
		{
			$authToken = $responseDataR->response->result->token;
			$authTokenSecret = $responseDataR->response->result->secretkey;

			$_SESSION['authToken'] = $authToken;
			$_SESSION['authTokenSecret'] = $authTokenSecret;
			
			// oAuth Authorize  - start
				$req_token = new OAuthConsumer($_SESSION['authToken'], $_SESSION['authTokenSecret'], 1);
				$acc_req = OAuthRequest::from_consumer_and_token($ccl_consumer,$req_token, "GET", base_url . "/authorize");
				$accessParams['oauth_version'] = $acc_req->get_parameter('oauth_version');
				$accessParams['oauth_nonce'] = $acc_req->get_parameter('oauth_nonce');
				$accessParams['oauth_timestamp'] = $acc_req->get_parameter('oauth_timestamp');
				$accessParams['oauth_consumer_key'] = $acc_req->get_parameter('oauth_consumer_key');
				$accessParams['oauth_token'] = $_SESSION['authToken'];

				$acc_req->sign_request($sig_method, $ccl_consumer, $req_token);
				$accessParams['oauth_signature'] = $acc_req->get_parameter('oauth_signature');
				
				$accessParams['userToken'] = urldecode($_REQUEST['userToken']);

				$enableHeader=false;
				$havingParams=false;
				
				$responseDataA = getResponseByParams(base_url . "/authorize",$accessParams,"post",$enableHeader,$havingParams);
				
				$responseDataAccess=$json->decode($responseDataA);
				

				if(isset($responseDataAccess) && $responseDataAccess->response->stat=="ok")
				{
					if($responseDataAccess->response->result->oauthToken)
					{
						$authToken = $responseDataAccess->response->result->oauthToken;
						$authTokenSecret = $responseDataAccess->response->result->oauthSecret;

						$_SESSION['authToken'] = $authToken;
						$_SESSION['authTokenSecret'] = $authTokenSecret;
					}
					$_SESSION['ccl_user_logged_in'] = true;
					$_SESSION['ccl_user_logged_object'] = $responseDataA;
					

					if(isset($_REQUEST['lpage']) && $_REQUEST['lpage']!="")
					{
						if($_REQUEST['lpage']=="home")
						{
							$landingPageUrl = '';
						}
						else
						{
							$landingPageUrl = '#!/'.$_REQUEST['lpage'];
							if(isset($_REQUEST['lid']))
								$landingPageUrl.='/'.$_REQUEST['lid'];
							if(isset($_REQUEST['topicTitle'])){
								$landingPageUrl.='/'.str_replace(" ","+",urldecode($_REQUEST['topicTitle']));
							}
						}
					}
				$responseDataARecord=$json->decode($responseDataA);
				

					if($responseDataARecord->response->result->registered==false || $responseDataARecord->response->result->registered===false)
					{
						$FirstName = $responseDataARecord->response->result->user->firstName;
						$SchoolName = $responseDataARecord->response->result->user->schoolName;
						$Url = "#user/registration?fn=".urlencode($FirstName)."&sn=".urlencode($SchoolName);

						if(trim($_REQUEST['lid'])!="")
						{
							$Url.="&topic=".$_REQUEST['lid'];
						}
						if(trim($_REQUEST['topicTitle'])!="")
						{
							$Url.='/'.str_replace(" ","+",urldecode($_REQUEST['topicTitle']));
						}
						header("Location:".website_url.'/'.$Url);	
					}
					else
					{
						header("Location:".website_url.'/'.$landingPageUrl);	
					}

					
				echo "<script>window.location='".website_url.'/'.$landingPageUrl."';</script>";
					exit;
				}
			// oAuth Authorize - end
		}

}
else
{
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
// Remember me  - Start
	//if(isset($_COOKIE['u_crm']) || isset($_COOKIE['ccuser_email']))
	if(isset($_COOKIE['u_crm']))
	{
		if(isset($_COOKIE['u_crm']) && $_COOKIE['u_crm']!="")
		{
			$userEmail = base64_decode(base64_decode(urldecode($_COOKIE['u_crm'])));
		}
		/*else if(isset($_COOKIE['ccuser_email']) && $_COOKIE['ccuser_email']!="")
		{
			$userEmail = base64_decode(urldecode($_COOKIE['ccuser_email']));
		}*/
		// Login Process
		
		$req_token = new OAuthConsumer($_SESSION['authToken'], $_SESSION['authTokenSecret'], 1);

		$acc_req = OAuthRequest::from_consumer_and_token($ccl_consumer,$req_token, "GET", base_url . "/authorize");
		
		$accessParams['oauth_version'] = $acc_req->get_parameter('oauth_version');
		$accessParams['oauth_nonce'] = $acc_req->get_parameter('oauth_nonce');
		$accessParams['oauth_timestamp'] = $acc_req->get_parameter('oauth_timestamp');
		$accessParams['oauth_consumer_key'] = $acc_req->get_parameter('oauth_consumer_key');
		$accessParams['oauth_token'] = $_SESSION['authToken'];
		
		$accessParams['emailId'] = urlencode(urlencode(urlencode($userEmail)));
		$accessParams['u_crm'] = 'true';

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
		}

	}
// Remember me  - End


//Clear remember action, if page gets refresh;
if(isset($_SERVER['HTTP_CACHE_CONTROL']))
{
	//unset($_SESSION['rememberAction']);
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>	
    <title>Collaborize Classroom Library</title>
	<meta name="robots" content="noindex,nofollow" />  
	<meta name="fragment" content="!">
	<link rel="shortcut icon" href="ccl/img/CC_icon-favicon.ico">
    <link rel="icon" type="image/png" href="ccl/img/CC_icon-favicon.png">
	<link rel="stylesheet" href="<?php autoVer('ccl/css/screen.css'); ?>" type="text/css" media="screen, projection" />
    <link rel="stylesheet" href="<?php autoVer('ccl/css/print.css'); ?>" type="text/css" media="print" />
    <link rel="stylesheet" href="<?php autoVer('ccl/css/main.css'); ?>" type="text/css" />
    <link rel="stylesheet" href="<?php autoVer('ccl/css/popup.css'); ?>" type="text/css" />
	<?php if(isset($_SESSION['ccl_user_logged_in']) && $_SESSION['ccl_user_logged_in']==true)
	{
		?>
		<script type="text/javascript">
			var USER_SESSION_OBJ = '<?php echo addslashes($_SESSION["ccl_user_logged_object"]); ?>';
		</script>
		<?php
	}else
	{
		?>
		<script type="text/javascript">
			var USER_SESSION_OBJ = null;
		</script>
		<?php
	}
	
		if(isset($_SESSION['rememberAction']) && $_SESSION['rememberAction']!="")
		{
			?>
			<script type="text/javascript">
				rememberAction = '<?php echo $_SESSION["rememberAction"]; ?>';
			</script>
			<?php
		}
		else
		{
			?>
			<script type="text/javascript">
				rememberAction = null;
			</script>
			<?php
		}
	?>
    <!--[if IE]><link rel="stylesheet" href="<?php autoVer('ccl/css/ie.css'); ?>" type="text/css" media="screen, projection"/><![endif]-->
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
            <div class="right headerSearch" id="headerSearch" style="display:none;">
            	<form name="headersearch" action="/">
                    <input id="headerSearchInput" type="text" value="" class="hint left" />
                    <a id="headerSearchButton" href="javascript:void(0);" class="headerSearchButton left">Search</a>
                     <p class="clear" />
                </form>
            </div>
            <p class="clear" />
        </div>
        <!-- Header Info Aread End -->
        <div id="pagesHolder">
            <div id="internalPage">
            	<div class="loadingIcon">Loading...</div>
            </div>
            <p class="clear" />
        </div>
        <!-- Footer Content Area Start -->
		<div id="footer">
			<div class="leftFooterCont left">
				<ul class="subFooterUL">
					<li class="">Powered by</li>
					<li><a href="http://www.democrasoft.com" target="_blank">DEMOCRASOFT</a> | </li>
					<li><a href="http://www.democrasoft.com/privacy-policy.html" target="_blank">PRIVACY POLICY</a> | </li>
					<li><a href="http://www.democrasoft.com/terms.html" target="_blank">TERMS OF USE</a> | </li>
					<li><a href="http://www.collaborizeclassroom.com/contact-us" target="_blank">CONTACT US</a></li>
				</ul>
				<ul class="subFooterUL">
					<li>50 Old Courthouse Square Suite 300 | </li>
					<li>Santa Rosa, CA  95404 | </li>
					<li>888.993.8683</li>
				</ul>
				
			</div>
			<a class="footerImageLink right" href="http://www.collaborizeclassroom.com/" target="_blank"><div class="footerImage"></div></a>
			<p class="clear" />
		</div>
		<!-- Footer Content Area Ends -->
    </div>
    <div id="mask"></div>
		<script>
			var ccl = window.ccl  = ccl || {};
			ccl.config = ccl.config || {}; 
			ccl.config.welcomeNoteNotLoggedIn = "<?php autoVer('gettingStarted/WelcomeNoteNotLoggedIn.html'); ?>";
			ccl.config.welcomeNoteLoggedIn = "<?php autoVer('gettingStarted/WelcomeNoteLoggedIn.html'); ?>";
		</script>
		<script type='text/javascript' src='<?php autoVerJs('steal/steal.js','ccl,development'); ?>'>
		</script>   
		
		
		<!-- <script>
				steal = { app: "ccl",
							env: "production",
							production: "<?php autoVer('/ccl/production.js') ?>"
						}
		</script> 
		
		 <script type='text/javascript' src='<?php autoVer('/steal/steal.production.js'); ?>'>
		 </script> -->
		
		
	<script type="text/javascript">
		var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
		document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
	</script>
	<script type="text/javascript">
	var GOOGLE_ANALYTICS_TRACKER_ID;
	<?php
		if($_SERVER['SERVER_NAME'] == 'library.collaborizeclassroom.com'){
	?>
		GOOGLE_ANALYTICS_TRACKER_ID = "UA-9911741-13";
	<?php
		}else if($_SERVER['SERVER_NAME'] == 'library.collaborizeinfrastructure3.com'){
		
	?>
		GOOGLE_ANALYTICS_TRACKER_ID = "UA-9911741-19";
	<?php
		}else if($_SERVER['SERVER_NAME'] == '192.168.200.116' || $_SERVER['SERVER_NAME'] == 'localhost' ){
	?>
		GOOGLE_ANALYTICS_TRACKER_ID = "ccltest";
	<?php
		}
	?>
		try{
		var pageTracker = _gat._getTracker(GOOGLE_ANALYTICS_TRACKER_ID);
		pageTracker._trackPageview();
		} catch(err) {}			
	</script>
	<?php
		// this is to footprint the current file version.
		echo "<input type='hidden' name='fileModifiedDate' value='".gmdate("D dS M,Y h:i a", getlastmod($_SERVER['SCRIPT_NAME']))."'>";
	?>
	
</body>
</html>
