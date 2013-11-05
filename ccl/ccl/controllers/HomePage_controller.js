$.Controller.extend("CCL.Controllers.HomePage", {
    init: function () {
		this.sAppInstallDir = g_sAppInstallDir;
		this.dynamicContentLoaded = false;
		this.usertagsLoaded = false;
		this.mostDownloadedLoaded = false;
		this.recentlySharedLoaded = false;
		this.topRatedLoaded = false;
		this.loadHomePage();
	    this.containersIDHasMap = {
			media:'browseByMedia',
			types: 'browseByTopicType',
			tag: 'browseByUserTags',
			grade: 'browsebyGradeLevel',
			subject: 'browserbySubject'
		};
    }
	, '{CCL.Controllers.Usertag} loadCompleted' : function(data){
		this.usertagsLoaded = true;
		this.scrollToAnchor();
	}
	, '{CCL.Controllers.MostDownloadedTopics} loadCompleted' : function(data){
		this.mostDownloadedLoaded = true;
		this.scrollToAnchor();
	}
	, '{CCL.Controllers.RecentlySharedTopics} loadCompleted' : function(data){
		this.recentlySharedLoaded = true;
		this.scrollToAnchor();
	}
	, '{CCL.Controllers.TopRatedTopics} loadCompleted' : function(data){
		this.topRatedLoaded = true;
		this.scrollToAnchor();
	}
	, 'user.loggedIn subscribe': function (called, user) {
		user = user.user;
		this.options.user = user;
		this.myBookSelfView.html(this.view(this.sAppInstallDir + 'views/homepage/mybookself'));
		this.myBookSelf = this.myBookSelf.ccl_my_bookself();
		this.screenName = user.screenName;
		this.loadHomePage();
	}
	, 'user.loggedOut subscribe': function (called) {
		
	}
	, 'a#topicLibraryProfile click' : function(el, ev){
		this.publish("profile.openForEdit");
		this.historyAdd({ controller: "!/profile"
			, action: ccl.utils.encodePredefinedChars(this.options.user.screenName) });
		ev.preventDefault();

	}
	, '#welcomeContentCloseButton click' : function(el, ev){
		this.dynamicContentArea.toggle();
		$('.gettingStartedButton').toggle();
		this.userPref.gettingStartedNote.visible = false;
		$.cookie(this.screenName + "_userPref", this.userPref, {expires:365});
	}
	, 'a.gettingStartedButton click' : function(el, ev){
		this.dynamicContentArea.toggle();
		$('.gettingStartedButton').toggle();
		this.userPref.gettingStartedNote.visible = true;
		$.cookie(this.screenName + "_userPref", this.userPref,  {expires:365});
	}
	, loadHomePage : function(){
		this.element.html(this.view(this.sAppInstallDir + 'views/homepage/homepage',{isLoggedIn : this.options.user}));	
		this.screenName = "";
		this.userPref = {};
		this.userPref.gettingStartedNote = {};
		
		
		this.dynamicContentArea = this.element.find("div#dynamicContentArea");
		this.welcomeNote = this.element.find("h1.welcomeNote");
	    this.welcomeNoteSection = this.element.find("#welcomeNoteSection");
	    this.profileImage = this.element.find("div.profileImage");
	    this.myBookSelf = this.element.find("div#myBookSelf");
	    this.myBookSelfView = this.element.find("div.myBookSelf");
	    this.welcomeContent = this.element.find("div.welcomeContent");
	    
	    if(this.options.user){
	    	var oUser = this.options.user;
	    	this.screenName = oUser.screenName;
			this.myBookSelfView.html(this.view(this.sAppInstallDir + 'views/homepage/mybookself'));
			this.myBookSelf = this.myBookSelf.ccl_my_bookself();
	    }
	   
	    this.welcomeContentCloseButton = this.element.find("#welcomeContentCloseButton");
	    this.welcomeContentImg = this.welcomeNote.find(".welcomeContentImg");
	    this.browserbySubject = this.element.find('#browserbySubject')
	                            .ccl_category_list_panel({
	                                browseOptions: {
	                                    browseBy: "subject"
	                                }
	                            });
	
	    this.browsebyGradeLevel = this.element.find('#browsebyGradeLevel')
	                            .ccl_category_list_panel({
	                                browseOptions: {
	                                    browseBy: "grade"
	                                }
	                            });
	    this.browseByUserTags = this.element.find('#browseByUserTags')
						        .ccl_usertag()
						        .ccl_category_list_panel({
						            browseOptions: {
						                browseBy: "tag"
						            }
						        });
	    this.browseByTopicType = this.element.find('#browseByTopicType')
	                            .ccl_category_list_panel({
	                                browseOptions: {
	                                    browseBy: "types"
	                                }
	                            });
	    this.browseByMedia = this.element.find('#browseByMedia')
						        .ccl_category_list_panel({
						            browseOptions: {
						                browseBy: "media"
						            }
						        });
	    this.topRatedTopicsPanel = this.element.find('#topRatedTopics').ccl_top_rated_topics();
	    this.recentlySharedTopicsPanel = this.element.find('#recentlySharedTopics').ccl_recently_shared_topics();
	    this.mostDownloadedTopics = this.element.find('#mostDownloadedTopics').ccl_most_downloaded_topics();
	    this.topicsFinder = this.element.find('#topicsFinder').ccl_topics_finder();
	    this.getDynamicContent(this.options.user);
	}
	, getDynamicContent : function(isLoggedIn){
		var oThis = this;
		var bUserPref = true;
		if(isLoggedIn){
			var oUserPref = $.cookie(isLoggedIn.screenName + "_userPref");
			
			if(oUserPref != null){
				bUserPref = oUserPref.gettingStartedNote.visible;
			}
		}
		$.get((isLoggedIn ? ccl.config.welcomeNoteLoggedIn : ccl.config.welcomeNoteNotLoggedIn),function(data){
			if(data){
				oThis.dynamicContentArea.find(".dynamicContentText").html(data);
				if(!bUserPref)
					oThis.dynamicContentArea.hide();
				else
					oThis.dynamicContentArea.show();
			}
			else
				oThis.dynamicContentArea.hide();
			oThis.dynamicContentLoaded = true;
			oThis.scrollToAnchor();
		});
	}
	, scrollToAnchor : function(){
		if(!this.usertagsLoaded 
				|| !this.mostDownloadedLoaded 
				|| !this.recentlySharedLoaded 
				|| !this.topRatedLoaded
				|| !this.dynamicContentLoaded
		)
			return;
		
		var oThis = this, scrollToObjId = oThis.containersIDHasMap[oThis.options.scrollTo] || oThis.options.scrollTo || "";
		if(scrollToObjId){
			var containerObj = oThis.element.find("#"+scrollToObjId);
			if(containerObj[0]){
				var scrollObj = containerObj.offset();
				window.scrollTo(0, scrollObj.top);
			}
		}
	}
});
