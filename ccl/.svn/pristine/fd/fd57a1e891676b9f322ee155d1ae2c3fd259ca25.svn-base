<?php
require_once("common.inc.php");
require_once "JSON.php";

function getResponseByUrl($Url,$method="GET")
{
	$json = new Services_JSON();
	//echo $Url;
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $Url);
	curl_setopt($ch, CURLOPT_HEADER,0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FORBID_REUSE, true);
	$file = "request.log";
	$handle = fopen($file,"a+");
	fwrite($handle,"\n".time()."  ::  ".$Url);
	fclose($handle);

	$response = curl_exec($ch);
	
	curl_close($ch);
	$file = "request.log";
	$handle = fopen($file,"a+");
	fwrite($handle,"\n".time()."  ::  Response Returned");
	fclose($handle);
	
	//echo "<br>***************************************<br>";
	//echo $response;

	$responseData=$json->decode($response);
	return $responseData;
}
function getResponseByDirectUrl($Url,$method)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $Url);
	curl_setopt($ch, CURLOPT_HEADER,0);
	if($method=="delete")
	{
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
	}
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FORBID_REUSE, true);
	$response = curl_exec($ch);
	curl_close($ch);
	return $response;
}
function getResponseByParams($url,$params,$method="get",$enableHeader=false,$havingParams=false)
{
		$json = new Services_JSON();
		
		$serviceUrl = $url;
		$queryString = "";
			if($method=="get" || $method=="delete")
			{
					foreach($params as $key=>$value) 
						
					{ $queryString .= $key.'='.$value.'&'; }
					rtrim($queryString,'&');

					if($havingParams)
						$url = $url."&".$queryString;
					else
						$url = $url."?".$queryString;

			}
			else if($method=="post")
			{
						foreach($params as $key=>$value) 
							{ 
								if(stristr($key,"oauth_"))
								{
									if($havingParams)
										$url = $url."&".$key.'='.$value;
									else
									{
										$url = $url."?".$key.'='.$value;
										$havingParams = true;
									}
								}
								else if($key=="jsonRequest")
								{
									if($queryString=="")
									{
										$queryString = $value;
									}
								}
								else
								{
									if($queryString=="")
									{
										$queryString = $key.'='.$value;
									}
									else
									{
										$queryString .= '&'.$key.'='.$value;
									}
								}
							}
						rtrim($queryString,'&');
						//echo $url;
						//exit;
			}
		
		$url = stripslashes(urldecode($url));
		if(stristr($url,"%2527"))
		{
			$url = str_replace("%2527","%27",$url);
		}
		$file = "request.log";
			$handle = fopen($file,"a+");
			fwrite($handle,"\n".time()."  ::  ".$serviceUrl.$url);
			fclose($handle);
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		//curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
		//echo $method;
		//echo $url;
		//echo "<br><br>";
		
		if($method=="post")
		{
			trim($queryString,'&');
			if(!isset($_GET['userToken']))
			{
				$queryString = stripslashes(urldecode(urldecode($queryString)));
			}
			curl_setopt($ch, CURLOPT_POST, count($params));
			curl_setopt($ch, CURLOPT_POSTFIELDS,$queryString);
		}
		else if($method=="get" || $method=="delete")
		{
			curl_setopt($ch, CURLOPT_POST, 0);
		}
		
		if($method=="delete")
		{
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
		}
		//echo $url;exit;
			
		curl_setopt($ch, CURLOPT_URL, $url);
		if($enableHeader)
		{
			curl_setopt($ch,CURLOPT_HTTPHEADER,array (
			"Accept: application/json",
			"Content-Type: application/library.collaborizeclassroom+json",
			));
		}
		//curl_setopt($ch, CURLOPT_FORBID_REUSE, true);

		$response = curl_exec($ch);
		
		 $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		
		curl_close($ch);
		$file = "request.log";
		$handle = fopen($file,"a+");
		fwrite($handle,"\n".time()."  ::  Response Returned");
		fclose($handle);
		return $response;
}

function generate_timestamp() {
    return time();
  }

  /**
   * util function: current nonce
   */
function generate_nonce() {
    $mt = microtime();
    $rand = mt_rand();

    return md5($mt . $rand); // md5s look nicer than numbers
  }

function autoVer($url){
    $path = pathinfo($url);
    //$ver = '.'.filemtime($_SERVER['DOCUMENT_ROOT'].$url).'.';
    //echo $path['dirname'].'/'.str_replace('.', $ver, $path['basename']);
	$ver = filemtime($_SERVER['DOCUMENT_ROOT'].$url);
    echo $path['dirname'].'/'.$path['basename'].'?v='.$ver;
}
function autoVerJs($url,$params){
    $path = pathinfo($url);
    //$ver = '.'.filemtime($_SERVER['DOCUMENT_ROOT'].$url).'.';
    //echo $path['dirname'].'/'.str_replace('.', $ver, $path['basename']);
	$ver = filemtime($_SERVER['DOCUMENT_ROOT'].$url);
    echo $path['dirname'].'/'.$path['basename'].'?'.$params.','.$ver;
}
?>