<?php
/*
define("PHOSTNAME",'db-master.collaborizeclassroom.com');
define("PUSERNAME",'dsdbadmin');
define("PPASSWORD",'p@s$4cC!u6srS');
define("PDATABASE","democrasoft");
*/

$rootUrl = "http://library.collaborizeinfrastructure3.com/";


define("PHOSTNAME",'50.16.69.104');
define("PUSERNAME",'dsdbadmin');
define("PPASSWORD",'cC$^876@room');

define("DB_DEMOCRASOFT","democrasoft");
define("DB_CMS","cms");
define("DB_COLLABORIZE","collaborize");
define("DB_COLLABORIZE_LIBRARY","collaborizelibrary");


$XmlFile = "sitemap.xml";
$TopicsQuery = '

							SELECT 
								ccl_topic_id, 
								ccl_topic_title,
								created_dtm
							FROM
								'.DB_COLLABORIZE_LIBRARY.'.ccl_topics
							WHERE
										created_dtm > "TOPIC_CREATE_START_DATE"
								AND 
										created_dtm < "TOPIC_CREATE_END_DATE"
							
						';

?>