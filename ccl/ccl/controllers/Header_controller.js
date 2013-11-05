$.Controller.extend("CCL.Controllers.Header", {
    init: function () {
        this.sAppInstallDir = g_sAppInstallDir;
        this.userInfoArea = this.element.find("#userInfoArea");
		this.profileEmail = null;
		this.userInfoArea.html(this.view(this.sAppInstallDir + 'views/header/normal'));
		this.publishUrl = "";
	    var sitesObj = {};
	    var sourceObj;
    }
	, ".logo click": function(){
		$('.formError').remove();
	}
	, "a.linkToSignIn click": function (el, ev) {
        ev.preventDefault();
        el.ccl_sign_in_modal_dialog("popup");
    }
	, "a.linkToSignOut click": function (el, ev) {
		ev.preventDefault();
		
		$.cookie(
				"u_crm", 
				null,  
				{expires:-1}
		);
		
		this.logout();
		
        CCL.Models.User.logOut(this.callback('logoutDone'), this.callback('logoutDone'));
    }
	, "a.sites click": function (el, ev) {
        var text = $(ev.target).text();
        this.publishUrl = $(el)[0].name;
        sourceObj = el;
        CCL.Models.User.getUserToken("cc", this.callback('getUserTokenForHomePageSuccess'), this.callback('getUserTokenError'));
		$(".dropdown dd ul").hide();
    }
	, "a.downArrow click": function (el, ev) {
        $(".dropdown dd ul").toggle();
    }
	, "a.downArrow blur": function (el, ev) {
       // $(".dropdown dd ul").slideUp();
    }
	, getUserTokenForHomePageSuccess: function (statusObj,tokenResponse) {
		if(statusObj.success){
			var CollaborizeUrl = ccl.bundle.autoLoginURL+'/portal/portal/collaborize/site/window?action=2&actionEvent=homePage&fpg=1&unId='+tokenResponse.key+'&publishUrl='+this.publishUrl; 
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
			steal.dev.log("error");
		}
	}
	, 'user.loggedIn subscribe': function (called, user) {
		GLOBALS[10] = user.user.screenName;
		this.userInfoArea.html(this.view(this.sAppInstallDir 
        								+ "views/header/loggedIn"
        								, { userDetails: user }
        								)
        					  );
    }
	, 'user.profileUpdated subscribe': function (called, user){
		GLOBALS[10] = user.user.screenName;
		this.userInfoArea.html(this.view(this.sAppInstallDir 
				+ "views/header/loggedIn"
				, { userDetails: user }
				)
	  );	
	}
	, 'a#createNewSite click': function(el,ev){
		sourceObj = el;
		CCL.Models.User.getUserToken("", this.callback('getUserTokenSuccess'), this.callback('getUserTokenError'));	
	}
	, getUserTokenSuccess: function (statusObj,tokenResponse) {
		if(statusObj.success){
			if(tokenResponse.user_status == "deleted"){
				CollaborizeUrl = ccl.bundle.classroomURL+'/ccl_account.php?step=2&page=home&user='+tokenResponse.key; 
			}else{
				if(tokenResponse.site_id){
					CollaborizeUrl = ccl.bundle.siteCreationStep2URL+tokenResponse.key+"&siteId="+tokenResponse.site_id;
				}else{
					CollaborizeUrl = ccl.bundle.siteCreationStep2URL+tokenResponse.key;
				}
				
			}
			var oWin = window.open(CollaborizeUrl,'_blank');
			window.setTimeout(function () {
											if (oWin == null || typeof(oWin)=="undefined" || (oWin!=null && oWin.outerHeight == 0)) {
												sourceObj.ccl_copy_to_site("popup");
												$("#createSiteNow").hide();
												$("#popupBlocker").show();
											} else {
												return;
											}
							}, 100);
		}else{
			steal.dev.log("error");
		}
	}
	, getUserTokenError: function(errorObj){
		steal.dev.log("Oops..conection problem!");
	}
	, logoutDone : function(errorObj){
		GLOBALS[10] = "";
		window.location.href = "http://"+location.hostname+"/";
    }
	, rememberClear:function(errorObj){}
	, logout : function() {
		this.eraseCookie("u_crm");
	}
    , eraseCookie: function(name) {
				document.cookie = name +'=; path=/;domain=.'+ccl.bundle.coockieDomain+';expires=Thu, 01-Jan-70 00:00:01 GMT;';
	} 
});