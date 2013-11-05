$.Controller.extend("CCL.Controllers.PagesHolder", {
	pageTrackerForGoogleAnalytics :  function(context){
		window._gat && window._gat._getTracker && GOOGLE_ANALYTICS_TRACKER_ID && _gat._getTracker(GOOGLE_ANALYTICS_TRACKER_ID)._trackPageview(context);
	}
	, previousBookmark : ""
	, makeBookmark : function(fromStr, valueStr, sortType, sortValue){		
		return {from:fromStr, value:valueStr, sortType:sortType, sortValue:sortValue};
	}
},
{
   	init: function () {
		
		this.currentPage = null;
		this.currentPage = this.element.find('#internalPage');
		this.doc = document;
		this._data = null;
		this.openProfileForEdit = false;
		this.loaderHTML = ccl.bundle.LOADER_HTML;
		if(USER_SESSION_OBJ){
			USER_SESSION_OBJ = JSON.parse(USER_SESSION_OBJ);
			var userData = USER_SESSION_OBJ = USER_SESSION_OBJ.response.result;
			var hasRegisteredPropExists = userData.hasOwnProperty('registered');
			
			if(!hasRegisteredPropExists || (hasRegisteredPropExists && userData.registered === true))
				this.publish("user.loggedIn",userData);
		}           
        
   	}
	, gotoProfile : function (called, data) {
		this.pageTracker();
		$(".headerSearch").show();
		$("#headerSearchInput").val("");
		var sUserScreenName = unescape(ccl.utils.decodePredefinedChars($.trim(called.split(".").pop())));
   	
		this.clearCurrentPage();
  		this.showLoader(this.currentPage);
		
		this.doc.title = g_sAppTitile + ": " + sUserScreenName;
		this.currentPage = this.currentPage.ccl_profile_page({
            		profileOption: {
                  		  userName: sUserScreenName
                  		, editMode : this.openProfileForEdit
            		}
        	});
		this.openProfileForEdit = false;
		this.Class.previousBookmark = "";
    }
	, gotoUsers : function (called, data) {

		var sAction = called.split(".")[2].toLowerCase().split("?")[0];
		if(sAction == "registration"){
			this.pageTracker();
			this.clearCurrentPage();
	        	this.showLoader(this.currentPage);
	    	
			var __sActionString = location.hash
										.substr(1)
										.split("/")
										.slice(1)
										.join("/");


		var __data;
		var queryParamIndex = __sActionString.lastIndexOf("?");
		var lastEqualsIndex = __sActionString.lastIndexOf("=");
		if(queryParamIndex != -1 && lastEqualsIndex > queryParamIndex){
		    var params = (__sActionString.substr(queryParamIndex + 1));
		    try{
		    	__data = $.String.deparam(params);
		    }catch(e){
		    	//user played with url
		    	//do noting
		    }
		}	

		var __options = {
		        		   firstName : __data.fn
		        		, schoolName : unescape(ccl.utils.decodePredefinedChars(__data.sn))
		        	};

		if(__data.topic)
			__options.callbackURL = __data.topic;


		this.doc.title = g_sAppTitile + ": Registration For: " + __data.fn;

        	this.currentPage = this.currentPage.ccl_registration_page(__options);
		}else{
			this.gotoHome(called, data);
		}
		this.Class.previousBookmark = "";
    }
	, gotoTopics : function (called, data) {

		/*
			Example:
			var called= "history.topic.search/global env. this /is wrost.";
			action = search
			actionString = global env. this is wrost.		
		*/

		var aCalled = called.split(".").slice(2);
		var aActionFragments = aCalled.join(".").split("/");
		var sAction = aActionFragments[0];
		var __sActionString = location.hash
										.substr(1)
										.replace("!/", "")
										.split("/")
										.slice(2)
										.join("/");


		var __data;
		var queryParamIndex = __sActionString.lastIndexOf("?");
		var lastEqualsIndex = __sActionString.lastIndexOf("=");
		if(queryParamIndex != -1 && lastEqualsIndex > queryParamIndex){
		    var params = (__sActionString.substr(queryParamIndex + 1));
		    try{
		    	__data = $.String.deparam(params);
		    	__sActionString = __sActionString.substring(0, queryParamIndex);
		    }catch(e){
		    	//user played with url
		    	//do noting
		    }
		}	

		var sActionString = ccl.utils.decodePredefinedChars(
				unescape(__sActionString)
		);
		this.pageTracker();
		$(".headerSearch").show();
		$("#headerSearchInput").val("");
    	var aQuery;
    	switch (sAction) {
			case "downloaded":
			case "shared":
			case "rated":
				if(this.getCurrentPageClassName() != "ccl_topic_listing_page"){
					this.clearCurrentPage();
					this.showLoader(this.currentPage);
		    	}
		        this.doc.title = g_sAppTitile + " :Topics: " + sAction.toUpperCaseFirstChar();
				
				var __options = {
		        		  browseBy: sAction
		        		, browseFor: "true"
		        };
		        
				if(__data && __data.show)
					__options.show = __data.show;
				
				
				if(__data && __data.sortBy)
					__options.sortBy = __data.sortBy;
				
				this.currentPage = this.currentPage.ccl_topic_listing_page(__options);
				
				this.Class.previousBookmark = this.Class.makeBookmark(sAction, "");
				break;

			case "subject":
			case "grade":
			case "tag":
			case "types":
		    	if(this.getCurrentPageClassName() != "ccl_topic_listing_page"){
					this.clearCurrentPage();
					this.showLoader(this.currentPage);
		    	}
		        this.doc.title = g_sAppTitile + ": " + sAction.toUpperCaseFirstChar() + ": " + sActionString;
				
		        var __options = {
		        		  browseBy: sAction
		        		, browseFor: sActionString
		        };
		        
				if(__data && __data.show)
					__options.show = __data.show;
				
				
				if(__data && __data.sortBy)
					__options.sortBy = __data.sortBy;

				this.currentPage = this.currentPage.ccl_topic_listing_page(__options);
				this.Class.previousBookmark = this.Class.makeBookmark(sAction, sActionString);
				break;

			case "userslist":
				this.clearCurrentPage();
				this.showLoader(this.currentPage);
				
				var firstSlashIndex = sActionString.indexOf('/');
				var topicId = sActionString.substring(0, firstSlashIndex);
				var topicTitile = sActionString.substr(firstSlashIndex+1);
				this.doc.title = g_sAppTitile + ": Educators who have downloaded: " + topicTitile;
				this.currentPage = this.currentPage.ccl_users_listing_page({
		            browseOptions: {
		                  browseBy: sAction
		                , browseFor: sActionString
		            }
		        });
				this.Class.previousBookmark = this.Class.makeBookmark(sAction, sActionString);
				break;
			default:
				//default is topic details page
				this.clearCurrentPage();
				this.showLoader(this.currentPage);

				var topicId = sAction;
				var topicTitle = sActionString;
		        this.doc.title = g_sAppTitile + ": " + topicTitle;
		        this.currentPage = this.currentPage.ccl_topic_detail_page({
		            topicOptions: {
		                id: topicId,
		                previousBookmark: this.Class.previousBookmark
		            }
		        	, user:this._data
		        });
		        this.Class.previousBookmark = this.Class.makeBookmark("topicdetail", topicId);
	        	break;
		}
    }
	
	
	, gotoSearch : function (called, data) {
		var aCalled = called.split(".").slice(2);
		var aActionFragments = aCalled.join(".").split("/");
		var sAction = aActionFragments[0];
		
		var __sActionString = location.hash
										.substr(1)
										.replace("!/", "")
										.split("/")
										.slice(2)
										.join("/");
		
		
		var __data;
		var queryParamIndex = __sActionString.lastIndexOf("?");
		var lastEqualsIndex = __sActionString.lastIndexOf("=");
		if(queryParamIndex != -1 && lastEqualsIndex > queryParamIndex){
			var params = (__sActionString.substr(queryParamIndex + 1));
			try{
				__data = $.String.deparam(params);
				__sActionString = __sActionString.substring(0, queryParamIndex);
			}catch(e){
				//user played with url
				//do noting
			}
		}	
		
		var sActionString = ccl.utils.decodePredefinedChars(
		unescape(__sActionString)
		);
		
		if(this.getCurrentPageClassName() != "ccl_search_results_page"){
			this.clearCurrentPage();
			this.showLoader(this.currentPage);
    	}
		
		this.pageTracker();		
		$(".headerSearch").hide();
		$("#headerSearchInput").val("");
		$("#headerSearchInput").addClass('hint');
		
        this.doc.title = g_sAppTitile + ": Search: " + sActionString;
        
        var __options = {
        		searchFor: sActionString
              ,	searchOn : sAction
        };
      
		if(__data && __data.show)
			__options.show = __data.show;
		
		
		if(__data && __data.sortBy)
			__options.sortBy = __data.sortBy;
		
		if(__data && __data.tab)
			__options.tab = __data.tab;

		this.currentPage = this.currentPage.ccl_search_results_page(__options);
		
		
		
        
        
        this.Class.previousBookmark = this.Class.makeBookmark("search/"+sAction, sActionString);		
		
    }
	
    , gotoHome : function (called, data) {
		this.pageTracker("homepage");
        $(".headerSearch").hide();
        $("#headerSearchInput").val("");
		$("#headerSearchInput").addClass('hint');
		
		this.clearCurrentPage();
        this.doc.title = g_sAppTitile;
        this.showLoader(this.currentPage);
		var aCalled = called.split(".");
		var scrolltoObjId = aCalled[1] || "";

		this.currentPage = this.currentPage.ccl_home_page({user:this._data, scrollTo:scrolltoObjId});
		this.Class.previousBookmark = "";
    }
    , "history.** subscribe": function (called, data) {
    	
    	var aCalled = called.split(".");
    	var controller = aCalled[1].toLowerCase();

    	if(controller == "%21"){
    		location.hash = location.hash.replace("%21", "!");
    		return;
    	}
		if(controller == "!"){
			aCalled.splice(1,1);
			called = aCalled.join(".").replace("/", ".");
			aCalled = called.split(".");
			controller = aCalled[1].toLowerCase();
		}

    	switch (controller) {
    		case "profile":
    			this.gotoProfile(called, data);
    			break;
    		case "user":
    			this.gotoUsers(called, data);
    			break;
    		case "topic":
    			this.gotoTopics(called, data);
    			break;
    		case "search":
    			this.gotoSearch(called, data);
    			break;
    		default:
    			this.gotoHome(called, data);
    			break;
    	}
    }
    , 'user.loggedIn subscribe': function (called, user) {
		this._data = user.user;
	}
	, 'user.profileUpdated subscribe': function (called, user) {
		this._data = user = user.user;
		var oldScreenName = this.screenName; 
		this.screenName = user.screenName;
		
		//update the user pref with new screenname
		$.cookie(
					this.screenName + "_userPref", 
					$.cookie(oldScreenName + "_userPref"),  
					{expires:365}
		);
		
		$.cookie(
					oldScreenName + "_userPref", 
					null,  
					{expires:-1}
		);
	}
	, 'profile.openForEdit subscribe': function(called, data){
		this.openProfileForEdit = true;
	}
	, pageTracker : function(pageName){
		pageName = pageName || "";
		var context = "/ccl/pages/" + window.location.hash + pageName;
		this.Class.pageTrackerForGoogleAnalytics(context);
	}
	, clearCurrentPage : function(){
		if(this.currentPage.controller()){
			this.currentPage.controller().destroy();
		}
	}
	, getCurrentPageClassName : function(){
		var _controller = this.currentPage.controller();
		return (_controller)?_controller.Class._fullName:"";
	}
	, showLoader : function(target){
		target.html(this.loaderHTML);
	}

});
