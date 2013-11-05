<?php
require_once("sitemap_config.php");
require_once("DbConnection.php");

$xmlHeader = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
$urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
$urlsetValue = "";
$urlsetClose = "</urlset>\n";

// Processing Records
$Query = $TopicsQuery;

$LastDay = date("Y-m-d", mktime(0, 0, 0, date("m"),date("d")-1,date("Y")));

$StartDate = $LastDay." 00:00:00";
//$StartDate = "2011-05-01 00:00:00";
$EndDate = $LastDay." 23:59:59";
//$EndDate = "2011-12-20 00:00:00";

$UpdatedQuery = str_replace("TOPIC_CREATE_START_DATE",$StartDate,$Query);
$UpdatedQuery = str_replace("TOPIC_CREATE_END_DATE",$EndDate,$UpdatedQuery);


$databaseTrans = new DBConnectionTrans(PHOSTNAME, PUSERNAME, PPASSWORD, DB_COLLABORIZE_LIBRARY);
$databaseTrans->beginTransaction();

$Results = $databaseTrans->multiAssocQuery($UpdatedQuery);

$Content = "";
if($Results)
{

		foreach($Results as $Record)
		{
			$Url =	$rootUrl."#!/topic/".$Record['ccl_topic_id']."/".urlencode(str_replace(" ","+",$Record['ccl_topic_title']));
			$Time = makeIso8601TimeStamp($Record['created_dtm']);
			$Frequency = 'weekly';
			$Priority = '1.0';
			
			$Content.="\n<url>";
				$Content.="\n\t<loc>".$Url."</loc>";
				$Content.="\n\t<lastmod>".$Time."</lastmod>";
				$Content.="\n\t<changefreq>".$Frequency."</changefreq>";
				$Content.="\n\t<priority>".$Priority."</priority>";
			$Content.="\n</url>";

		}
}

$Content.="\n</urlset>";

$XmlContent = file_get_contents("../".$XmlFile);

$NewContent = str_replace("</urlset>",$Content,$XmlContent);

// Writing new content to sitemap.xml file
$handle = fopen("../".$XmlFile,"w");
if(fwrite($handle,$NewContent))
{
	echo "Sitemap Updated";
}
else
{
	echo "Failed to update Sitemap";
}

echo "\n".count($Results) .' records processed';

// Utility Functions
function makeUrlString ($urlString) {
    return htmlentities($urlString, ENT_QUOTES, 'UTF-8');
}

function makeIso8601TimeStamp ($dateTime) {
    if (!$dateTime) {
        $dateTime = date('Y-m-d H:i:s');
    }
    if (is_numeric(substr($dateTime, 11, 1))) {
        $isoTS = substr($dateTime, 0, 10) ."T"
                 .substr($dateTime, 11, 8) ."+00:00";
    }
    else {
        $isoTS = substr($dateTime, 0, 10);
    }
    return $isoTS;
}
?>