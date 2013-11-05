$.Controller.extend("CCL.Controllers.TopicListingPage",{
	defaults: {
		  show: 1 // represents page number
		, perPage: 20
	}
}, {
	init: function(){
		this.load();
	}
	/*Initialization starts here*/
    , load: function () {
    	
		this.sAppInstallDir = g_sAppInstallDir;
        this._ccl_bundle = ccl.bundle;
        
        this.startIndex = 1;
        
        this.searchType = this.options.browseBy;
        var searchValue = this.options.browseFor;
        searchValue = searchValue.specialCharacterEntities();
		this.searchValue = ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(searchValue));
		
		this.element.html(  this.view(this.sAppInstallDir + 'views/topics/init'
						  , { browseData: this.options }));
		
		this.topicsListContainer = this.element.find("#listContainerData");
    	this.paginationButton = this.element.find("#paginationButton");
    	this.paginationLoader = this.element.find("#fetchinDataDiv");
    	this.totalTopicsShow = this.element.find("#totalTopicsShow");
    	this.browseTopicsCount = this.element.find("#browseTopicsCount");
    	/*Local object for local sort*/
    	var localTopicsObj = {};
		localTopicsObj.topics = [];
		localTopicsObj.topics_count = 0;
		localTopicsObj.total_favorites = null;
		localTopicsObj.total_private_topics = 0;
		localTopicsObj.total_shared_topics = 0;
		localTopicsObj.total_users_matched = null;
		
		this.localTopicsObj = localTopicsObj;
		
    	this.isTopicListLoaderVisible = false;
    	
    	this.totalTopicsCount = 0;
    	
    	this.isFirstRequest = true;
    	this.divPageNo = 1;
    	this.showTopicListLoader();
    	/* Check condition for page number not a number*/
    	if(isNaN(this.options.show)){
    		this.options.show = 1;
    		
    		this.historyAdd(
    				{  controller: "!/topic"
    				 , action:    this.options.browseBy
    							+ "/" 
    							+ ccl.utils.encodePredefinedChars(this.options.browseFor)
    							+ "?sortBy=" 
    							+ this.options.sortBy 
    							+ "&show="
    							+ 1
    				});

    		this.recordCount = this.options.perPage;

    		return false;
    	}
    	
    	this.options.show = (this.options.show - 0 < 1) ? 1 : this.options.show;
		this.options.showCount = this.options.show*this.options.perPage;

		this.recordCount = this.options.showCount;
    	
		this.getTopics();
	}
	/* topic list loader*/
	, showTopicListLoader : function(){
		this.isTopicListLoaderVisible = true;
		this.topicsListContainer.html(this._ccl_bundle.LOADER_HTML);		
	}
	/* send api request to fetch topics */
	, getTopics: function(){
		
		switch (this.options.browseBy)
		{
			case "types":
				this.searchType = "topic_type";
				this.sortLocally = false;
				this.options.sortBy = (this.options.sortBy ? this.options.sortBy : 'date_added');
				break;
			case "downloaded":
				this.searchType = "top_downloaded";
				this.sortLocally = true;
				this.options.sortBy = (this.options.sortBy ? this.options.sortBy : 'most_downloaded');
				break;
			case "shared":
				this.searchType = "recently_shared";
				this.sortLocally = true;
				this.options.sortBy = (this.options.sortBy ? this.options.sortBy : 'date_added');
				break;
			case "rated":
				this.searchType = "top_rated";
				this.sortLocally = true;
				this.options.sortBy = (this.options.sortBy ? this.options.sortBy : 'top_rated');
				break;
			default:
				this.sortLocally = false;
				if(this.options.sortBy == 'most_downloaded' || this.options.sortBy == 'top_rated'){
					this.options.sortBy = this.options.sortBy;
				}else{
					this.options.sortBy = 'date_added';
				}
				break;
			
		}
		
		var criteriaObj = {};		
		
		criteriaObj.type = this.searchType; 
		criteriaObj.value = this.searchValue;
		criteriaObj.sortType = this.options.sortBy;
		criteriaObj.sortValue = "desc";
		criteriaObj.start = this.startIndex;
		criteriaObj.count = this.recordCount;
		
	   	CCL.Models.Topic.getTopics(
	   			 criteriaObj
			   , this.callback("loadTopics")
			   , this.callback('listError'));
	}
	
	/* load topics into the topic-list-container*/
	, loadTopics: function(statusObj, topicsListObj){
		if(!this.element){
			return;		
		}
		
		if(statusObj.success){
			
			this.totalTopicsCount = topicsListObj.topics_count - 0;
			if(this.totalTopicsCount > 0){
				this.totalTopicsShow.show();
				var topicText = this.totalTopicsCount > 1 ? "topics" :"topic";
				this.browseTopicsCount.html('('+this.totalTopicsCount+' '+topicText+')');
			}else{
				this.totalTopicsShow.hide();
			}
			
			var contentData = this.view(this.sAppInstallDir 
					+ 'views/topics/viewlist'
					, { topicsList: topicsListObj
						, browseOptions : this.options
						, additionalInfo: {
							loggedInUser: GLOBALS[10]
						  , sortOptionsObj : this._ccl_bundle.topicsSortOptions.options
						  , isTopicListLoaderVisible : this.isTopicListLoaderVisible
						  , pageNo : this.divPageNo
						}
					});
			
			
			
			
			
			
			/*to sort locally, the local topics object is needed with the topics as total topics currentlyVisible
			 as the object when assigned to other variable is passed by reference, if the object is new variable is 
			 updated, the original object gets effected. To get overcome that problem, stringifying and then assigning the 
			 eval of that string to create a new and cloned object.*/
			var localTopicsListObj = eval("("+JSON.stringify(topicsListObj)+")");
			localTopicsListObj.topics = (this.localTopicsObj.topics).concat(topicsListObj.topics);
			this.localTopicsObj = localTopicsListObj;
			
			this.paginationLoader.hide();
			
				if(this.isTopicListLoaderVisible){
					this.isTopicListLoaderVisible = false;
					this.topicsListContainer.html(contentData);
				}else{
					this.topicsListContainer.append(contentData);
				}
			
			if(this.isFirstRequest)
				this.divPageNo = (topicsListObj.topics.length/this.options.perPage)+1;

			else
				this.divPageNo += (topicsListObj.topics.length/this.options.perPage);
			
			
			this.isFirstRequest = false;
			
			
			/* pagination call*/
			this.showPagination();
			/*if topic has rating then need to show the rating for that ned to call below function*/
			this.topicsListContainer.find('.star').rating();
			
		} else {
			this.topicsListContainer.text("Oops! Error Message:" + statusObj.errorMessage);	
		}
	}
	
	/* show pagination button with appropriate pagination values*/
	, showPagination: function(){
		if( this.totalTopicsCount == this.options.showCount ){
			this.paginationButton.hide();
		}else{
			var nextResultCount = 0;
			if(this.totalTopicsCount - this.options.showCount >= this.options.perPage){
				nextResultCount = this.options.perPage;
			}else if(this.totalTopicsCount - this.options.showCount <= 0){
				this.paginationButton.hide();
				this.paginationLoader.hide();
				return false;
			}else{
				nextResultCount = this.totalTopicsCount - this.options.showCount;
			}
			this.options.showCount = this.options.showCount - 0;
			this.paginationButton.find("#pagination").html(this._ccl_bundle.TOPICS_PAGINATION_LABEL.formatString(
					  nextResultCount
					, ((this.options.show*this.options.perPage)+1)
					, this.options.showCount + nextResultCount
					, this.totalTopicsCount
				));				
			this.paginationLoader.hide();
			this.paginationButton.show();
		}
	}
	/* Sort options changes then change the url by using historyAdd*/
	, "#sortByOptions change" : function (el, ev){
		var currentSort = el.val();
		this.paginationButton.hide();
		this.showTopicListLoader();
		
		var showCount = this.options.show;
		if(this.sortLocally == false){
			showCount = 1;
		}
   		this.historyAdd(
				{  controller: "!/topic"
				 , action:    this.options.browseBy
							+ "/" 
							+ ccl.utils.encodePredefinedChars(this.options.browseFor)
							+ "?sortBy=" 
							+ currentSort 
							+ "&show="
							+ showCount
				});
	}	
	/* Sort option change functionality called by using update method*/
	, sortOptionsChanged: function(){
		
		if(this.sortLocally == false){
			this.paginationButton.hide();
			this.load();
		}else{
			this.sortTopics();
		}
	}
	/* Pagination button click then below function will fire*/
	, "#paginationButton click": function (el) {
		this.paginationButton.hide();
		this.paginationLoader.show();
		
		this.options.show = this.options.show-0; // converting to integer
		this.historyAdd(
				{  controller: "!/topic"
				 , action:    this.options.browseBy
							+ "/" 
							+ ccl.utils.encodePredefinedChars(this.options.browseFor)
							+ "?sortBy=" 
							+ this.options.sortBy 
							+ "&show="
							+ (this.options.show+1)
				});
	}
	/* Pagination button clicked function will call by using update method*/
	, paginationButtonClicked: function(){
		this.paginationButton.hide();
		this.paginationLoader.show();
		this.getTopics();
	}
	/* Remove the pages as per requirement in the url*/
	, removePages: function(fromPage){
		var i = fromPage;
		while(this.find('#page_'+i).length == 1){
			this.find('#page_'+i).remove();
			i++;
			this.divPageNo--;
		}
		this.showPagination();
	}
	/* !important functionality in the controller this is update the default option*/
	, update : function(options){
		/* change the url if page number is not a number*/
		if(options.show && isNaN(options.show)){
				//this.divPageNo = 1;
				this.historyAdd(
						{  controller: "!/topic"
						 , action:    this.options.browseBy
									+ "/" 
									+ ccl.utils.encodePredefinedChars(this.options.browseFor)
									+ "?sortBy=" 
									+ this.options.sortBy 
									+ "&show="
									+ this.options.show
						});
				return false;
			}
		
		options.show = (!options.show || options.show - 0 < 1) ? 1 : options.show;
		if(!options.sortBy){
			if(this.options.browseBy == "rated")
				options.sortBy = "top_rated";
			
			else if(this.options.browseBy == "downloaded")
				options.sortBy = "most_downloaded";
			
			else
				options.sortBy = "date_added";
			
		}
		/* if browse option will change the need to reset the options and also clear the content and then load new topics*/
		if((options.browseBy != this.options.browseBy) || (options.browseFor != this.options.browseFor)){
			this._super(options);
			this.element.empty();
			this.load();
		}else{
			this.recordCount = this.options.perPage;
			var showDifference = options.show-this.options.show;
			if(showDifference > 1){
				this.recordCount = this.options.perPage*(showDifference);
			}
			
			if( this.options.sortBy != options.sortBy ){
				this._super(options);
				this.divPageNo = 1;
				
				// send request related to sortby dropdown change
				this.sortOptionsChanged();
			}else{
				var sendRequestFlag = true;
				// if user played with url and made the "show" value lessthan the existing value
				if(this.isFirstRequest){
					if(options.show < this.options.show){
						sendRequestFlag = false;
					}
				}
				else{
					if(options.show <= this.options.show){
						sendRequestFlag = false;
					}
				}
				
				this._super(options);
				// update showCount variable WRT the "show"(pageNumber) updated in the url
				this.options.showCount = this.options.show*this.options.perPage;
				this.startIndex = ((this.options.show-showDifference)*this.options.perPage)+1;
				if(sendRequestFlag){
					// send request related to pagination click
					this.paginationButtonClicked();
				}else{
					this.removePages( (options.show-0+1)); // remove the divs from the next page..
				}
			}
		}
	}
	/*Local sorting functionality*/
	, sortTopics: function(){
		if(this.options.sortBy == "date_added")
			sortedTopics =  this.datePublishedSort(this.localTopicsObj.topics);		
		else if(this.options.sortBy == "most_downloaded")
			sortedTopics =  this.mostDownloadSort(this.localTopicsObj.topics);
		else if(this.options.sortBy == "top_rated")
			sortedTopics =  this.topRatedSort(this.localTopicsObj.topics);
		
		this.localTopicsObj.topics = sortedTopics;
		var contentData = this.view(this.sAppInstallDir 
				+ 'views/topics/viewlist'
				, { topicsList: this.localTopicsObj
					, browseOptions : this.options
					, additionalInfo: {
						loggedInUser: GLOBALS[10]
					  , sortOptionsObj : this._ccl_bundle.topicsSortOptions.options
					  , isTopicListLoaderVisible : this.isTopicListLoaderVisible
					  , pageNo : this.divPageNo
					}
				});
		
		this.topicsListContainer.html(contentData);
		
		this.showPagination();
		
		this.topicsListContainer.find('.star').rating();
	}
	, datePublishedSort : function (topicsArray){
		return topicsArray.reverse(topicsArray.sort(this.dateSort));
	}
	, mostDownloadSort : function(topicsArray){
		return topicsArray.reverse(topicsArray.sort(this.downloadSort));
	}
	, topRatedSort : function(topicsArray){		
		return topicsArray.reverse(topicsArray.sort(this.ratedSort));
	}
	, dateSort : function(a, b) {
		var aKey = new Date(a.topic.topic_created_timestamp);
		var bKey = new Date(b.topic.topic_created_timestamp);
		return (aKey - bKey);
	}
	, downloadSort : function(a, b){
		var aTopic = a.topic;
		var bTopic = b.topic;
		
		var aKey = aTopic.num_downloads;
		var bKey = bTopic.num_downloads;

		if(aKey == bKey){
			aKey = new Date(aTopic.topic_created_timestamp);
			bKey = new Date(bTopic.topic_created_timestamp);
		}
		aKey = aKey || 0;
		bKey = bKey || 0;

		return (aKey - bKey);
	}
	, ratedSort : function(a, b){
		var aTopic = a.topic;
		var bTopic = b.topic;
		
		var aKey = aTopic.toprated_value;
		var bKey = bTopic.toprated_value;

		if(aKey == bKey){
			aKey = new Date(aTopic.topic_created_timestamp);
			bKey = new Date(bTopic.topic_created_timestamp);
		}
		aKey = aKey || 0;
		bKey = bKey || 0;

		return (aKey - bKey);			
	}
	/* Copy to site or get the topic button clicked then below functionality fired*/
	, ".copyButton click": function (el, ev) {
		
   		sourceObj = el;
   		if($(ev.target).text() == "Copy to My Site"){
    		var sitesListObj = sitesObj;
			var cSites = sitesListObj.length;
			GLOBALS[6] = $(el)[0].id;
			GLOBALS[4] = $(el)[0].name;
			GLOBALS[7] = sitesListObj[0].siteId;
			GLOBALS[2] = sitesListObj[0].siteName;
			GLOBALS[3] = sitesListObj[0].publishUrl;
			if(cSites == 1){
				CCL.Models.Topic.checkIfTopicDownloaded({publish_url:ccl.utils.urlEncode(GLOBALS[3]),ccl_topic_id:GLOBALS[6]}, this.callback('copytopicsuccess'), this.callback('error'));
			}else{
				el.ccl_copy_to_site("popup");
    			//$("#selectSite").show();
    			$("#loggedLinkPopUp").show();
			}
    	}else if(GLOBALS[10] == ""){
    		el.ccl_copy_to_site("popup copy-register");
    		//$("#copyToSiteRegistration").show();
    		$("#linkPopUp").show();
    	}else{
    		el.ccl_copy_to_site("popup");
    		$("#createSiteNow").show();
    	}
    }
   	, copytopicsuccess: function (statusObj,copyDetails) {
        if(statusObj.success){
        	
        	CCL.Models.Topic.checkValidTopicType({site_id:GLOBALS[7],topic_type:GLOBALS[4]}, this.callback('copytopicagainsuccess'), this.callback('error'));
    	}else{
    		sourceObj.ccl_copy_to_site("popup");
    		$("#alreadyCopied").show();
    	}
    }
   	, copytopicagainsuccess: function (statusObj,userToken) {
		if(statusObj.success){
			var CollaborizeUrl = ccl.bundle.copyToSiteURL+userToken.userToken+'&publishUrl='+GLOBALS[3]+'&cclTopicId='+GLOBALS[6]; 
			var oWin = window.open(CollaborizeUrl,'_blank');
			window.setTimeout(function () {
											if (oWin == null || typeof(oWin)=="undefined" || (oWin!=null && oWin.outerHeight == 0)) {
												sourceObj.ccl_copy_to_site("popup");
												$("#alreadyCopied").hide();
												$("#selectSite").hide();
												$("#popupBlocker").show();
											} else {
												return;
											}
										}, 100);
    	}else{
    		sourceObj.ccl_copy_to_site("popup");
    		$("#cannotCopied").show();
    		$("#siteName").text(GLOBALS[2]);
    		$(".disableTopicType").text(ccl.bundle.disableCopyText[GLOBALS[4]]);
    	}
    }
    , ".loggedInCopyButton click": function (el, ev) {
    	sourceObj = el;
    	var sitesListObj = sitesObj;
		var cSites = sitesListObj.length;
		GLOBALS[6] = $(el)[0].id;
		GLOBALS[4] = $(el)[0].name;
		GLOBALS[7] = sitesListObj[0].siteId;
		GLOBALS[2] = sitesListObj[0].siteName;
		GLOBALS[3] = sitesListObj[0].publishUrl;
		if(cSites == 1){
			CCL.Models.Topic.checkIfTopicDownloaded({publish_url:ccl.utils.urlEncode(GLOBALS[3]),ccl_topic_id:GLOBALS[6]}, this.callback('copytopicsuccess'), this.callback('error'));
		}else{
			el.ccl_copy_to_site("popup");
			$("#selectSite").show();
		}
    }
    , ".topicAction click": function (el, ev) {
    	$(".copySiteDropDown").hide();
    	if($(ev.target).text() == "Share Topic"){
    		CCL.Models.Topic.getTopicDetails({"ccl_topic_id":$(ev.target)[0].id}
			, this.callback('topicData')
			, this.callback('error'));
    		sourceObj = el;
    	} else{
    		el.ccl_copy_to_site("popup");
    		$("#deleteTopic").show();
    	}
    }
    , topicData : function (statusObj, topicDetails) {
    	if(statusObj.success){
    		window.scrollTo(0,0);
    		sourceObj.ccl_share_topic("popup copy-register",topicDetails);
    	}else{
    		this.element.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    }
    , error: function(errorObj){
    	this.element.text("Oops! SERVER ERROR " + errorObj.toString());
    }
   	, ".dropDownButton click": function (el, ev) {
		$(ev.target).next().find('ul').slideToggle();
    }
	, ".dropDownButton blur": function (el, ev) {
		$(ev.target).next().find('ul').slideUp();
    }
    , 'user.loggedIn subscribe': function (called, user) {
    	this.load();
    }
    , 'topic.deleted subscribe': function (called, user) {
    	this.load();
    }
    , 'a.topicTitle click' : function(){
    	CCL.Controllers.PagesHolder.previousBookmark = CCL.Controllers.PagesHolder.makeBookmark(this.options.browseBy, this.options.browseFor, this.options.sortBy, "desc");	
	}
	/* error callback*/
	, listError: function(errorObj){
		this.topicsListContainer.text("Oops! SERVER ERROR " + errorObj.toString());
	}
});