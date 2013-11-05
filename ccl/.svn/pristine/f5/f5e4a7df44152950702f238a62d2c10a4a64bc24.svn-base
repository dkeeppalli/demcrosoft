$.Controller.extend("CCL.Controllers.RecentlySharedTopics", {
    init: function () {
        this.sAppInstallDir = g_sAppInstallDir;
        this.topicListHolder = this.element.find('.topicListHolder');
        CCL.Models.Topic.getTopics({type:"recently_shared"
									, value:true
									, sortType:"date_added"
									, sortValue:"asc"
									, start:1
									, count:5}
								    , this.callback('list')
								    , this.callback('error'));
    }
    , list: function (statusObj, topiclist) {
    	if(statusObj.success){
    		this.topicListHolder.html(this.view( this.sAppInstallDir 
    										   + 'views/topics/mini'
										   	   , { topicsList: topiclist
    										   , viewMode:"recentlyShared" }));
    	}else{
    		this.topicListHolder.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    	$([this.Class]).triggerHandler("loadCompleted", this);
    }
    , error: function(errorObj){
    	this.topicListHolder.text("Oops! SERVER ERROR " + errorObj.toString());
    	$([this.Class]).triggerHandler("loadCompleted", this);
    }
    , 'a.topicTitle click' : function(){
    	CCL.Controllers.PagesHolder.previousBookmark = CCL.Controllers.PagesHolder.makeBookmark("shared", ""); 
	}
});