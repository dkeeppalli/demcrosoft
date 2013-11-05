var g_sAppInstallDir = "//ccl/";
var g_sAppTitile = "Collaborize Classroom Library";
var GLOBALS = [
                 "" // 0 - ccl-root
               , ""	// 1 - Application Title
               , "" // 2 - site name
               , "" // 3 - publish url
               , "" // 4 - topic type
               , "" // 5 - sessionStartedTime - timeStamp new Date();
               , "" // 6 - topic id
               , "" // 7 - site id
               , "" // 8 - initial token
               , "" // 9 - initial secret
               , "" // 10 - loged-in user screen name
               , "" // 11 - loged-in user screen name encrypted
               , "" // 12 - loged-in user email
               , "" // 13 - loged-in timestamp
               , "" // 14 - loged-in boolean  
			   , "" // 15 - attachmenttype
			   , "" // 16 - attachmentcontent
               ];
var arrayOfTags = [];
var arrayOfSavedTags = [];
GLOBALS[5] = new Date().toUTCString();
GLOBALS[0] = g_sAppInstallDir;
GLOBALS[1] = g_sAppTitile;
GLOBALS[10] = "";
GLOBALS[12] = "";
GLOBALS[14] = true;
GLOBALS[15] = "";
GLOBALS[16] = "";
steal.plugins(
	'jquery/controller', 		// a widget factory
	'jquery/controller/subscribe', // subscribe to OpenAjax.hub
    'jquery/controller/history',
	'jquery/view/ejs', 			// client side templates
	'jquery/controller/view', 	// lookup views with the controller's name
	'jquery/model', 				// Ajax wrappers
	'jquery/dom/fixture', 		// simulated Ajax requests
	'jquery/dom/cookie', 		// simulated Ajax requests
	'jquery/dom/form_params')		// form data helper

//.css('collaborizeclassroom')			// Loads 'collaborizeclassroom.css,screen.css,ie.css,main.css'

    .resources('jquery.blockUI'
    			, 'json'
    			, 'css_browser_selector'
    			, 'autocomplete'
    			, 'resourceBundle'
    			, 'utils'
    			, 'jquery.validationEngine'
    			, 'jquery.autocomplete'
    			, 'jquery.rating'
    			, 'water_mark'
				, 'base64'
    		)					// 3rd party script's (like jQueryUI), in resources folder

	.models( 'DataService'
		   , 'UserTag'
           , 'Topic'
           , 'User'
            )						// loads files in models folder 

	.controllers( 'Header'
				, 'TopHeaderSearch'
				, 'MyBookself'
                , 'PagesHolder'
                , 'HomePage'
                , 'UserTag'
                , 'MostDownloadedTopics'
                , 'TopRatedTopics'
                , 'RecentlySharedTopics'
                , 'TopicsFinder'
                , 'CategoryListPanel'
                , 'TopicListingPage'
                , 'SearchResultsPage'
                , 'RegistrationModalDialog'
                , 'SignInModalDialog'
				, 'CopyToSite'
                , 'ProfilePage'
                , 'TopicDetailPage'	
                , 'UsersListingPage'
				, 'PreviewTopicModalDialog'
				, 'RegistrationPage'
				, 'ShareTopic'
				, 'CommentsListing'
                )					// loads files in controllers folder

	.views( 'header/normal.ejs'
		  , 'header/loggedIn.ejs'
		  , 'homepage/homepage.ejs'
		  , 'homepage/mybookself.ejs'
		  , 'modals/copyToSite.ejs'
		  , 'modals/inlineRegistration.ejs'
		  , 'modals/popupLayout.ejs'
		  , 'modals/previewTopic.ejs'
		  , 'modals/registration.ejs'
		  , 'modals/shareTopic.ejs'
		  , 'modals/signIn.ejs'
		  , 'profile_page/edit.ejs'
		  , 'profile_page/view.ejs'
		  , 'profile_page/viewlist.ejs'
		  , 'search_result_page/init.ejs'	
		  , 'search_result_page/userslist.ejs'
		  , 'search_result_page/viewlist.ejs'	
		  , 'topics/commentsList.ejs'
		  , 'topics/commentsMainSection.ejs'
		  , 'topics/mini.ejs'
		  , 'topics/topicdetail.ejs'
		  , 'topics/init.ejs'
		  , 'topics/viewlist.ejs'		  
		  , 'users/init.ejs'
		  , 'users/userslist.ejs'
		  , 'usertag/list.ejs'
		  
	).then(
        function () {
            $("#header").ccl_header();
            $("#pagesHolder").ccl_pages_holder();
            $("#headerSearch").ccl_top_header_search();
           
        }
    );   					// adds views to be added to build
