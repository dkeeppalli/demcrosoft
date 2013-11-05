$.Controller.extend("CCL.Controllers.UsersListingPage",{}, {
    init: function () {
        this.sAppInstallDir = g_sAppInstallDir;
        var sourceObj;
        this._ccl_bundle = ccl.bundle;
        
        var sActionString = this.options.browseOptions.browseFor;
        var firstSlashIndex = sActionString.indexOf('/');
        this.topicId = sActionString.substring(0, firstSlashIndex);
        this.element.html(this.view(this.sAppInstallDir + 'views/users/init'
        							, { browseData: this.options.browseOptions 
        								, sortOptionsObj : this._ccl_bundle.downloadedUsersSortOptions.options
      								  
        							  }));
        this.usersListContainer = this.element.find("#listContainer");
		CCL.Models.User.getUsers({type:"ccl_topic_id"
								, value: this.topicId 
								, sortType:"date_downloaded"
								, sortValue:"desc"
								}
								, this.callback('userslist')
								, this.callback('error'));
		
    }
    , userslist: function (statusObj, userlist) {
    	if(statusObj.success){
    		this.usersListContainer.html(this.view(this.sAppInstallDir + 'views/users/userslist'
    										, { userlist: userlist
    										, additionalInfo: {
    											loggedInUser: GLOBALS[10]
    										}}));
    		if(userlist.users.length > 1)
    			$(".downloadedUsersListContainer").show();
    	}else{
    		this.usersListContainer.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    }
    , error: function(errorObj){
    	this.usersListContainer.text("Oops! SERVER ERROR " + errorObj.toString());
    }
    , "#sortByUserOptions change" : function (el) {
    	var sortOptionType = el.val();
    	var sortOptionValue = $('#sortByUserOptions>option:selected')[0].id;	
    	this.usersListContainer.html(this._ccl_bundle.LOADER_HTML);		
    	CCL.Models.User.getUsers({type:"ccl_topic_id"
			, value: this.topicId 
			, sortType:sortOptionType
			, sortValue:sortOptionValue
			}
			, this.callback('userslist')
			, this.callback('error'));
    }	
});