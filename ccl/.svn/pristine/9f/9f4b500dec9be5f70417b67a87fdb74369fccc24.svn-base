$.Controller.extend("CCL.Controllers.SearchResultsPage",{
	defaults: {
	  show: 1 // represents page number
	, perPage: 20
	, tab: "topics"
}
}, {
    init: function(){
		this.load();
	}
	/*Initialization starts here*/
	, load: function () {
		this.sAppInstallDir = g_sAppInstallDir;
        this._ccl_bundle = ccl.bundle;
        this.element.html(this.view(this.sAppInstallDir 
        							+ 'views/search_result_page/init'
                                    , {
                                        searchOptions: this.options
                                    }
                                    ));
        this.currentSelectedTabOption = (!this.options.tab) ? "topics" : (this.options.tab == "topics" || this.options.tab == "users" ? this.options.tab : "topics");
        
        
        this.startIndex = 1;
        this.currentSelectedTab = this.element.find(".tabs > a.active");
        this.options.show = (this.options.show - 0 < 1) ? 1 : this.options.show;
		this.options.showCount = this.options.show*this.options.perPage;
		this.divTopicPageNo = 1;
		this.divUserPageNo = 1;
		this.isFirstRequest = true;
        this.recordCount = this.options.showCount;
        
        this.searhResultsLoader = this.element.find("#searhResultsLoader");// for default search loader
        this.mainSearchResultsSection = this.element.find("#mainSearchResultsSection"); //search container main section
     // below 2 flags are used to check, whether the tab is loaded previously or not...
		this.usersListContainerLoaded = false;
		this.topicsListContainerLoaded = true; // as the default loading tab will be topics tab
        this.searchTopicsCount = this.mainSearchResultsSection.find("#searchTopicsCount");
        this.searchUsersCount = this.mainSearchResultsSection.find("#searchUsersCount");
        this.ListContainer = this.mainSearchResultsSection.find("#listContainerData");
        this.topicsListContainer = this.element.find("#topicsListContainerData");
        this.topicListContent = this.element.find(".topicListContent");
		this.usersListContainer = this.element.find("#usersListContainerData");
		this.userListContent = this.element.find(".userListContent");
        this.searchByOptions = this.element.find("select option:selected")[0].id;
        this.isTopicListLoaderVisible = false;
        this.isUserListLoaderVisible = false;
    	this.paginationLoader = this.element.find("#fetchinDataDiv");
        this.currentTopicsSort = this._ccl_bundle.searchTopicsSortOptions.defaultOption;
        this.currentUserSort = this._ccl_bundle.usersSortOptions.defaultOption;

		this.paginationLoader = this.element.find("#fetchinDataDiv");
		this.topicsPaginationButton = this.element.find("#topicsPaginationButton");
		this.usersPaginationButton = this.element.find("#usersPaginationButton");
		
		
		this.textBox = this.element.find("#topicsFinderText");
        this.prevSearchText = "";
        var textBoxValue = this.options.searchFor;
        textBoxValue = textBoxValue.specialCharacterEntities()
        this.searchValue = ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(textBoxValue));
		this.showMainSearchResultsSectionLoader(); //calling function for default search loader
		
		this.options.show = (this.options.show - 0 < 1) ? 1 : this.options.show;
		this.options.showCount = this.options.show*this.options.perPage;
		
		
        
		this.getSearchResults();
	}
	, showMainSearchResultsSectionLoader : function (){
		this.isTopicListLoaderVisible = true;
		this.isUserListLoaderVisible = true;
		this.searhResultsLoader.html(this._ccl_bundle.LOADER_HTML).show();
	}
	, getSearchResults : function(){
		var criteriaObj = {};
		
		this.options.show = (this.options.show - 0 < 1) ? 1 : this.options.show;
		this.options.showCount = this.options.show*this.options.perPage;
		
		var tabId = this.currentSelectedTabOption || "topics";
		
		startIndex = this.startIndex;
		
		var sortValue = null;
		
		if(this.options.searchOn == 'all'){
			criteriaObj.serviceName = "searchAll";
			if(tabId == "topics"){
				sortType = this.options.sortBy  || "most_relevant";
				this.currentTopicsSort = sortType;
				callBack = "showTopicsList";
				this.getTopicsInProgressCount++;			
			}else{
				sortType = this.options.sortBy  || "screen_name";
				this.currentUserSort = sortType;
				callBack = "showUsersList";
				this.getUsersInProgressCount++;
				sortValue = "asc";
			}
		}
		else if(this.options.searchOn == 'users'){
			criteriaObj.serviceName = "searchUsers";
			sortValue = "asc";
			sortType = (this.options.sortBy && (this.options.sortBy == "screen_name" || this.options.sortBy == "first_name" || this.options.sortBy == "last_name")) ? this.options.sortBy  : "screen_name";
			this.currentUserSort = sortType;
			this.getUsersInProgressCount++;
			callBack = "showUsersList";
		}
		else if(this.options.searchOn == 'topics'){
			sortType = (this.options.sortBy && (this.options.sortBy != "screen_name" || this.options.sortBy != "first_name" || this.options.sortBy != "last_name")) ? this.options.sortBy  : "most_relevant";
			this.currentTopicsSort = sortType;
			callBack = "showTopicsList";
			this.getTopicsInProgressCount++;	
		}
		this.searchType = this._ccl_bundle.searchPageValues[this.options.searchOn];
		
		criteriaObj.type = this.searchType; 
		criteriaObj.value = this.searchValue;
		criteriaObj.sortType = sortType;
		criteriaObj.sortValue = sortValue || "desc";
		criteriaObj.start = this.startIndex;
		criteriaObj.count = this.recordCount;
		criteriaObj.searchOn = (this.searchType == 'all'? tabId : this.options.searchOn);
		
		
		CCL.Models.Topic.getSearchResults(
	   			 criteriaObj
			   , this.callback(callBack)
			   , this.callback("errorCallBack"));
	   	
	}
	, showTopicsList: function(statusObj, topicsListObj){
		
		if(!this.element)
			return;		
				
		this.mainSearchResultsSection.show();
		this.topicsListContainer.show();
		this.searhResultsLoader.hide();
		if(statusObj.success){
				
			this.totalTopicsCount = topicsListObj.topics_count - 0;
			
			if(this.searchType == 'all'){
				this.totalUsersCount = topicsListObj.users_count - 0;
				this.searchTopicsCount.html(this.totalTopicsCount);
		        this.searchUsersCount.html(this.totalUsersCount);
				
			}
			var contentData = this.view(this.sAppInstallDir 
					+ 'views/search_result_page/viewlist'
					, { topicsList: topicsListObj
						, searchString : this.textBox.val()
						, sViewMode:"searchList" 
						, searchOptions : this.options
						, additionalInfo: {
							loggedInUser: GLOBALS[10]
						,	sortOptionsObj : this._ccl_bundle.searchTopicsSortOptions.options
						,   isTopicListLoaderVisible : this.isTopicListLoaderVisible						
						,   pageNo : this.divTopicPageNo
						}
					});
			
			this.paginationLoader.hide();
			if(this.isTopicListLoaderVisible){
				this.isTopicListLoaderVisible = false;
				this.topicListContent.html(contentData);
			}else{
				this.topicListContent.append(contentData);
			}
			
			this.topicListContent.find('.star').rating();
			
			if(topicsListObj.topics){
			
			if(this.isFirstRequest)
				this.divTopicPageNo = (topicsListObj.topics.length/this.options.perPage)+1;

			else
				this.divTopicPageNo += (topicsListObj.topics.length/this.options.perPage);
			
			}
			this.isFirstRequest = false;
			
			/* pagination call*/
			this.showPagination();
			
		}else {
			this.mainSearchResultsSection.text("Oops! Error Message:" + statusObj.errorMessage);	
		}
	}
	, showUsersList : function (statusObj, userListObj) {
   		this.getUsersInProgressCount--;
		
		if(this.getUsersInProgressCount > 0 || !this.element){
			return;		
		}
   		
		this.mainSearchResultsSection.show();
		this.searhResultsLoader.hide();
		this.topicsListContainer.hide();
		this.usersListContainer.show();
		
   		if(statusObj.success){
    		if(userListObj.users)
   				this.currentVisibleUsers += userListObj.users.length;

			this.totalUsersCount = userListObj.users_count - 0;
			
			if(this.searchType == 'all'){
				this.totalTopicsCount = userListObj.topics_count - 0;
				this.searchTopicsCount.html(this.totalTopicsCount);
		        this.searchUsersCount.html(this.totalUsersCount);
				
			}
   			
   			
   			
			var contentData = this.view(this.sAppInstallDir + 'views/search_result_page/userslist'
    										, { userlist: userListObj
												, searchString : this.textBox.val()
												, sViewMode:"searchList" 
												, searchOptions : this.options
    										, additionalInfo: {
    											loggedInUser: GLOBALS[10]
					                        ,	sortOptionsObj : this._ccl_bundle.usersSortOptions.options
											,   isUserListLoaderVisible : this.isUserListLoaderVisible
											,   pageNo : this.divUserPageNo
    										}});
   			this.paginationLoader.hide();
			if(this.isUserListLoaderVisible){
				this.isUserListLoaderVisible = false;
				this.userListContent.html(contentData);
			}else{
				this.userListContent.append(contentData);
			}
			
			if(userListObj.users){
				if(this.isFirstRequest)
					this.divUserPageNo = (userListObj.users.length/this.options.perPage)+1;

				else
					this.divUserPageNo += (userListObj.users.length/this.options.perPage);
				
				
				this.isFirstRequest = false;
			}
			this.options.tab = "users";
			/* pagination call*/
			this.showPagination();
   			
    	}else{
    		this.mainSearchResultsSection.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    }
	, showPagination :  function(){
		var type = (!this.options.tab) ? "topics" : (this.options.tab == "topics" || this.options.tab == "users" ? this.options.tab : "topics");
		
		
		var pagination = $("#"+type+"PaginationButton");
		var paginationDiv = $("#"+type+"Pagination");
		var nextResultCount = 0;
		if(type=="topics"){
			if( this.totalTopicsCount == this.options.showCount ){
				this.topicsPaginationButton.hide();
			}else{			
				nextResultCount = 0;
				if(this.totalTopicsCount - this.options.showCount >= this.options.perPage){
					nextResultCount = this.options.perPage;
				}else if(this.totalTopicsCount - this.options.showCount <= 0){
					this.topicsPaginationButton.hide();
					this.paginationLoader.hide();
					return false;
				}else{
					nextResultCount = this.totalTopicsCount - this.options.showCount;
				}
			}
		}else{
			if( this.totalUsersCount == this.options.showCount ){
				this.usersPaginationButton.hide();
			}else{
					nextResultCount = 0;
				if(this.totalUsersCount - this.options.showCount >= this.options.perPage){
					nextResultCount = this.options.perPage;
				}else if(this.totalUsersCount - this.options.showCount <= 0){
					this.usersPaginationButton.hide();
					this.paginationLoader.hide();
					return false;
				}else{
					nextResultCount = this.totalUsersCount - this.options.showCount;
				}
			}
		}
		this.options.showCount = this.options.showCount - 0;
		
		paginationDiv.html(this._ccl_bundle.TOPICS_PAGINATION_LABEL.formatString(
			 		nextResultCount
					, ((this.options.show*this.options.perPage)+1)
					, this.options.showCount + nextResultCount
					, (type=="topics" ? this.totalTopicsCount : this.totalUsersCount)
				));	
		pagination.show();
	}
	/* Sort options changes then change the url by using historyAdd*/
	, "#topicSortOptions change" : function (el, ev){
		var currentSort = el.val();
		this.showTopicListLoader();
		this.topicsPaginationButton.hide();
		this.divTopicPageNo = 1;
		var showCount = this.options.show;
		showCount = 1;
		this.options.tab = (!this.options.tab) ? "topics" : (this.options.tab == "topics" || this.options.tab == "users" ? this.options.tab : "topics");
		this.historyAdd(
				{  controller: "!/search"
				 , action:    this.options.searchOn
							+ "/" 
							+ ccl.utils.encodePredefinedChars(ccl.utils.encodeAndCharacter(this.options.searchFor))
							+ "?tab="
							+ this.options.tab
							+ "&sortBy=" 
							+ currentSort 
							+ "&show="
							+ showCount
							
				});
	}	
	/* Sort option change functionality called by using update method*/
	, sortOptionsChanged: function(){
		this.topicsPaginationButton.hide();
		this.usersPaginationButton.hide();
		if(this.options.tab == "topics")
			this.showTopicListLoader();
		
		else 
			this.showUserListLoader();
		
		this.getSearchResults();
	}
	, "#userSortOptions change" : function (el, ev) {
		var currentSort = el.val();
		this.showUserListLoader();
		this.usersPaginationButton.hide();
		this.divUserPageNo = 1;
		var showCount = this.options.show;
		showCount = 1;
		this.options.tab = (!this.options.tab) ? "users" : (this.options.tab == "topics" || this.options.tab == "users" ? this.options.tab : "users");
		this.historyAdd(
				{  controller: "!/search"
				 , action:    this.options.searchOn
							+ "/" 
							+ ccl.utils.encodePredefinedChars(ccl.utils.encodeAndCharacter(this.options.searchFor))
							+ "?tab="
							+ this.options.tab
							+ "&sortBy=" 
							+ currentSort 
							+ "&show="
							+ showCount
							
				});
		
	}
	
	, showTopicListLoader : function(){
    	this.isTopicListLoaderVisible = true;
    	this.topicsPaginationButton.hide();
		this.topicsListContainer.show();
    	this.topicListContent.html(this._ccl_bundle.LOADER_HTML);		
	}
	, showUserListLoader : function(){
    	this.isUserListLoaderVisible = true;
    	this.usersPaginationButton.hide();
    	this.usersListContainer.show();
    	this.userListContent.html(this._ccl_bundle.LOADER_HTML);		
	}
	, "#topicsPaginationButton click": function (el) {
		this.topicsPaginationButton.hide();
		this.paginationLoader.show();
		this.options.show = this.options.show-0; // converting to integer
				this.historyAdd(
				{  controller: "!/search"
				 , action:    this.options.searchOn
							+ "/" 
							+ ccl.utils.encodePredefinedChars(ccl.utils.encodeAndCharacter(this.options.searchFor))
							+ "?tab="
							+ this.options.tab
							+ "&sortBy=" 
							+ this.currentTopicsSort
							+ "&show="
							+ (this.options.show+1)
							
				});
		
	}
	, "#usersPaginationButton click": function (el) {
		this.usersPaginationButton.hide();
		this.paginationLoader.show();
		
		this.options.show = this.options.show-0; // converting to integer
		this.historyAdd(
				{  controller: "!/search"
				 , action:    this.options.searchOn
							+ "/" 
							+ ccl.utils.encodePredefinedChars(ccl.utils.encodeAndCharacter(this.options.searchFor))
							+ "?tab=users"
							+ "&sortBy=" 
							+ this.options.sortBy 
							+ "&show="
							+ (this.options.show+1)
							
				});
	}
	/* Pagination button clicked function will call by using update method*/
	, paginationButtonClicked: function(){
		
		if(this.options.tab =="users"){
			this.usersPaginationButton.hide();
			this.paginationLoader.show();
		}else{
			this.topicsPaginationButton.hide();
			this.paginationLoader.show();
		}
		
		
		this.getSearchResults();
	}
	/* Remove the pages as per requirement in the url*/
	, removePages: function(fromPage){
		var i = fromPage;
		while(this.find('#page_'+this.options.tab+i).length == 1){
			this.find('#page_'+this.options.tab+i).remove();
			i++;
			if(this.options.tab == "topics")
				this.divTopicPageNo--;
			
			else
				this.divUserPageNo--;
		}
		this.showPagination();
	}
	, update: function(options){
		
		if(options.show && isNaN(options.show)){
			
			this.historyAdd(
				{  controller: "!/search"
				 , action:    this.options.searchOn
							+ "/" 
							+ ccl.utils.encodePredefinedChars(ccl.utils.encodeAndCharacter(this.options.searchFor))
							+ "?tab="
							+ this.options.tab
							+ "&sortBy=" 
							+ this.options.sortBy 
							+ "&show="
							+ 1
							
				});
			return false;
		}
		if(!this.options.sortBy){
			
			this.options.sortBy = this.options.tab == "users" ? "screen_name" : "most_relevant";
		}
		
		options.tab = (!options.tab) ? "topics" : (options.tab == "topics" || options.tab == "users" ? options.tab : "topics");
		
		options.show = (!options.show || options.show - 0 < 1) ? 1 : options.show;
		
		if(!options.sortBy){
			if(this.options.searchOn == "users")
				options.sortBy = "screen_name";
			
			else
				options.sortBy = "most_relevant";
			
		}
		
		
		if((options.searchFor != this.options.searchFor) || (options.searchOn != this.options.searchOn)){
			 
	        if(options.searchOn=="users")
	        	options.sortBy = "screen_name";
	        
	        else
	        	options.sortBy = "most_relevant";
			
			this._super(options);
			this.element.empty();
			this.load();
		}else{
			
			this.recordCount = this.options.perPage;
			var showDifference = options.show-this.options.show;
			
			if(showDifference > 1){
				this.recordCount = this.options.perPage*(showDifference);
			}
			if( this.options.tab != options.tab ){
				
				var currentId;
				
				this.currentSelectedTab.removeClass('active');
				currentId = this.options.tab
				$('#'+currentId+'ListContainerData').hide();


				this.currentSelectedTab = this.mainSearchResultsSection.find("#"+options.tab);
				this.currentSelectedTab.addClass('active');
				currentId = options.tab;
				
				this.currentSelectedTabOption = currentId;
				if(currentId == 'users'){
					this.showUserListLoader();	
					this.divUserPageNo = 1;
				}else{
					this.showTopicListLoader();
					this.divTopicPageNo = 1;
				}
				
				this._super(options);
				
				this.startIndex = 1;
				this.recordCount = (this.options.perPage-0)*(this.options.show-0);
				
			
			
				
				
				
				// send request related to tab change
				this.tabChanged();
			}else if( this.options.sortBy != options.sortBy ){

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
					this.removePages((options.show-0+1)); // remove the divs from the next page..
				}
			}
		}
	}
	, ".tabs > a click" : function(el,ev){
		/* el = $(el);
		var currentId;
		console.log(el);
		if(el.hasClass("active"))
			return;

		this.currentSelectedTab.removeClass('active');
		currentId = $(this.currentSelectedTab)[0].id;
		$('#'+currentId+'ListContainerData').hide();


		this.currentSelectedTab = el;
		this.currentSelectedTab.addClass('active');
		currentId = $(this.currentSelectedTab)[0].id;
		this.options.show = 1;
		//var is_loaded = false;
		this.currentSelectedTabOption = currentId;
		if(currentId == 'users'){
			this.showUserListLoader();
			this.options.sortBy = "screen_name";
		}else{
			this.showTopicListLoader();
			this.options.sortBy = "most_relevant";
		}*/
		
		var currentId = $(el)[0].id;
		this.options.show = 1;
		if(currentId == 'users'){
			this.options.sortBy = "screen_name";
		}else{
			this.options.sortBy = "most_relevant";
		}
		
		this.historyAdd(
				{  controller: "!/search"
				 , action:    this.options.searchOn
							+ "/" 
							+ ccl.utils.encodePredefinedChars(ccl.utils.encodeAndCharacter(this.options.searchFor))
							+ "?tab="
							+ currentId
							+ "&sortBy=" 
							+ this.options.sortBy 
							+ "&show="
							+ this.options.show
							
				});
		
	}
	, tabChanged: function(){
		this.getSearchResults();
	}	
	, "#topicsFinderText blur": function (el, ev) {
        if ($.trim(this.textBox.val()) == "")
            this.textBox.val(this.prevSearchText);
    }
    , "#searchButton click": function (el, ev) {
        steal.dev.log("inside click");
        this.sendSearchRequest();
        ev.preventDefault();
    }
    , "#searchForm submit": function () {
        this.sendSearchRequest();
        steal.dev.log("Form submit");
        return false;
    }
    , sendSearchRequest: function () {
        var sSearchQuery = ccl.utils.encodeAndCharacter($.trim(this.textBox.val()));
        this.searchByOptions = $("select option:selected")[0].id;
        if (sSearchQuery == "")
            return;
        
        if(this.searchByOptions=="users")
        	this.options.sortBy = "screen_name";
        
        else
        	this.options.sortBy = "most_relevant";
        
        this.historyAdd(
						{  controller: "!/search"
						 , action:    this.searchByOptions
									+ "/" 
									+ ccl.utils.encodePredefinedChars(ccl.utils.encodeAndCharacter(sSearchQuery))
									+ "?tab="
									+ this.searchByOptions
									+ "&sortBy=" 
									+ this.options.sortBy 
									+ "&show="
									+ 1
									
						});
       // this.historyAdd({ controller: "!/search", action: this.searchByOptions+"/" + ccl.utils.encodePredefinedChars(sSearchQuery) });
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
    			$("#selectSite").show();
			}
    	}else if(GLOBALS[10] == ""){
    		el.ccl_copy_to_site("popup copy-register");
    		$("#copyToSiteRegistration").show();
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
    , 'a.topicTitle click' : function(){
		CCL.Controllers.PagesHolder.previousBookmark = CCL.Controllers.PagesHolder.makeBookmark("search/"+this.options.searchOn, this.options.searchFor, this.options.sortBy, "desc"); 
	}
	, errorCallBack : function (errorObj){
		this.mainSearchResultsSection.text("Oops! SERVER ERROR " + errorObj.toString());
	}
});