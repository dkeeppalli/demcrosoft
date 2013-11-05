$.Controller.extend("CCL.Controllers.Usertag", {
    init: function () {
        this.sAppInstallDir = g_sAppInstallDir;
        this.userTagsContainer = this.element.find('.contentArea');
        CCL.Models.Usertag.findAll({criteria:{max:50}},this.callback('list'), this.callback('error'));
    }
    , list: function (statusObj,usertags) {
    	ccl.utils.removeLoaderCSS(this.userTagsContainer);
    	if(statusObj.success){
    		this.userTagsContainer.html(this.view(this.sAppInstallDir 
    									+ 'views/usertag/list'
    									, { usertags: usertags.tags }));
    	}else{
    		this.userTagsContainer.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    	$([this.Class]).triggerHandler("loadCompleted", this);
    }
    , error: function(errorObj){
    	ccl.utils.removeLoaderCSS(this.userTagsContainer);
    	this.userTagsContainer.text("Oops! SERVER ERROR " + errorObj.toString());
    	$([this.Class]).triggerHandler("loadCompleted", this);
    }
});