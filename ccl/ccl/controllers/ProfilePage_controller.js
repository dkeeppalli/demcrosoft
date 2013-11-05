$.Controller.extend("CCL.Controllers.ProfilePage",{}, {
    init: function () {
		this.currentProfileUserName = this.options.profileOption.userName;	
		this.editMode = this.options.profileOption.editMode || false;
		this.sAppInstallDir = g_sAppInstallDir;
		this._ccl_bundle = ccl.bundle;
		this.userObject = {};
		this.isOwner = false;
		this.totalTopicsCount = 0;
		this.topicsListContainer = null;
		this.topicPageSize = 20;
		this.currentFilter = 'all';
		this.currentSort = 'date_added';
		this.getTopicsInProgressCount = 0;
		this.paginationButton = null;
		this.isTopicListLoaderVisible = false;
		this.paginationLoader = null;
		this.changePassword = false;
		this.currentVisibleTopics = 0;
		this.totalTopicsCount = 0;
		
		this.nextTopicsTo = 20;
		this.nextRecordsCount = 20;
		
		this.screenNameChanged = false;
		this.changedScreenName = "";
		
		
		
		CCL.Models.User.getProfile(
									{
										screen_name:ccl.utils.urlEncode(this.currentProfileUserName)
									}
									, this.callback('showProfile')
									, this.callback('profileError')
								);
	}
	, showProfile : function(statusObj, userdata){
		if(!this.element)
			return;
		
		
		if(statusObj.success){
			this.userObject = userdata;
			this.userObject._extraInfo = {};
			
			this.userObject._extraInfo.fullName = this.userObject.first_name + " " + this.userObject.last_name;
			this.isOwner = this.userObject._extraInfo.isOwner = ((this.userObject.private_topic_count - 0) > -1);
			this.sharedTopicsCount = this.userObject.shared_topic_count = this.userObject.shared_topic_count - 0;
			this.privateTopicsCount = this.userObject.private_topic_count = this.userObject.private_topic_count - 0;
			this.privateTopicsCount = (this.privateTopicsCount <= -1)? 0 : this.privateTopicsCount;
			this.totalTopicsCount = this.userObject._extraInfo.totalTopicsCount = this.sharedTopicsCount + this.privateTopicsCount;
			
			if(this.editMode){
				this.openForEdit();
				this.editMode = false;
			}else{
			
				this.element.html(this.view(this.sAppInstallDir 
	        							  + 'views/profile_page/view'
	        							  , { 
												userdata: this.userObject
											,	sortOptionsObj : this._ccl_bundle.topicsSortOptions.options
											}));
	        	
	        	this.topicsListContainer = this.element.find("#listContainerData");
	        	this.paginationButton = this.element.find("#paginationButton");
	        	this.paginationLoader = this.element.find("#fetchinDataDiv");
	        	
	        	
	        	this.showTopicListLoader();
	        	
	        	if(this.totalTopicsCount > 0)
	        		this.getTopics();
			}
		}else{
			this.element.text("Oops! Error Message:" + statusObj.errorMessage);			
		}
		
	}
	, getTopics : function(startIndex, recordCount, sortType, topicType){
		this.getTopicsInProgressCount++;
		var criteriaObj = {};
		topicType = topicType || "all";
		sortType = sortType || "date_added";
		startIndex = startIndex || 1;
		recordCount = recordCount || this.topicPageSize;
		var screenNameValue = ccl.utils.urlEncode(this.userObject.screen_name);
		criteriaObj.type = (topicType == "all")? "screen_name" : "shared_type";
		criteriaObj.value = (topicType == "all") ? screenNameValue : topicType;
		criteriaObj.sortType = sortType;
		criteriaObj.sortValue = "desc";
		criteriaObj.start = startIndex;
		criteriaObj.count = recordCount;
		this.breadCrumbType = criteriaObj.type;
		this.breadCrumbValue = criteriaObj.value;
       	CCL.Models.Topic.getTopics(
       			 criteriaObj
			   , this.callback('listTopics')
			   , this.callback('listError'));
    }
	, listTopics : function(statusObj, topicsListObj){
		this.getTopicsInProgressCount--;
		
		if(this.getTopicsInProgressCount > 0 || !this.element){
			return;		
		}
		
		if(statusObj.success){
			
			this.currentVisibleTopics += topicsListObj.topics.length;
			this.totalTopicsCount = topicsListObj.topics_count - 0;
			var contentData = this.view(this.sAppInstallDir 
					+ 'views/profile_page/viewlist'
					, { topicsList: topicsListObj
						, sViewMode:"profileList" 
						, additionalInfo: {
							loggedInUser: GLOBALS[10]
						}
					});
			
			this.paginationLoader.hide();
			if(this.isTopicListLoaderVisible){
				this.isTopicListLoaderVisible = false;
				this.topicsListContainer.html(contentData);
			}else{
				this.topicsListContainer.append(contentData);
			}
			var nextTopicsFrom = null;
			if(this.totalTopicsCount - this.currentVisibleTopics >= this.topicPageSize){
				nextTopicsFrom =  this.currentVisibleTopics + 1;
				this.nextTopicsTo = this.currentVisibleTopics + this.topicPageSize;
				this.nextRecordsCount = this.topicPageSize;
			}else if(this.totalTopicsCount - this.currentVisibleTopics <= 0){
				/*do nothing*/
			}else{
				nextTopicsFrom =  this.currentVisibleTopics + 1;
				this.nextTopicsTo = this.totalTopicsCount;
				this.nextRecordsCount = (this.totalTopicsCount % this.topicPageSize);
			}

			if(nextTopicsFrom)
				this.showPagination(nextTopicsFrom, this.nextTopicsTo, this.nextRecordsCount);
			
			this.topicsListContainer.find('.star').rating();
			
		} else {
			this.topicsListContainer.text("Oops! Error Message:" + statusObj.errorMessage);	
		}
	}
	, listError : function (errorObj){
		this.topicsListContainer.text("Oops! SERVER ERROR " + errorObj.toString());
	}
	, profileError: function(errorObj){
    	this.element.text("Oops! SERVER ERROR " + errorObj.toString());
    }
	, openForEdit : function(){
		this.element.html(this.view(this.sAppInstallDir 
				+ 'views/profile_page/edit',{userData: this.userObject
										   , errorMessage:null
											}));
				jQuery("#editProfileFormClass").validationEngine('attach', {promptPosition : "topRight", scroll : false, validationEventTrigger : "none", multiplePrompts : false});
				jQuery("#editProfileScreenNameFormClass").validationEngine('attach', {promptPosition : "topRight", scroll : false, validationEventTrigger : "none", multiplePrompts : false});
				this.element.find('#screenName').focus();
				
				this.oldPassword = this.element.find("#oldPassword");
				this.newPassword = this.element.find("#newPassword");
				this.confirmNewPassword = this.element.find("#confirmNewPassword");
				this.role = this.element.find("#role");
				this.location = this.element.find("#location");
				
				if( this.role && this.userObject.role == "" ){
					this.role.waterMark(	{ "waterMarkClass": "hint"
										 	, "waterMarkText" : ccl.bundle.roleText
											} 
										);
				}
				
				if( this.location && this.userObject.location == "" ){
					this.location.waterMark(	{ "waterMarkClass": "hint"
										 	, "waterMarkText" : ccl.bundle.locationText
											} 
										);
				}
		
		
	}
	, '#editProfile click' : function(el){
		this.openForEdit();
	}
	, "a.changePassword click": function (el, ev) {
    	jQuery("#confirmNewPassword").validationEngine('hide');
    	jQuery("#oldPassword").validationEngine('hide');
    	jQuery("#newPassword").validationEngine('hide');
    	this.oldPassword.val("");
    	this.newPassword.val("");
    	this.confirmNewPassword.val("");
    	this.element.find('#changePasswordLink').toggle();
    	this.element.find('#changePasswordFields').toggle();        
        var chgPsd = this.changePassword;
        if(chgPsd === true){
        	this.changePassword = false;
        	this.element.find('#profileFirstName').focus();
        }
        else if(chgPsd === false){
        	this.element.find('#oldPassword').focus();
        	this.changePassword = true;
        }
    }
	, '.cancelBtn click' : function(el){
		jQuery("#editProfileFormClass").validationEngine('hideFaster');
    	jQuery("#editProfileScreenNameFormClass").validationEngine('hideFaster'); 
    	this.hideEditProfileFormProcessing();
		this.reloadPage();
	}
	
	, '.saveBtn click' : function(el){
		var validity = (jQuery("#editProfileFormClass").validationEngine('validate') && jQuery("#editProfileScreenNameFormClass").validationEngine('validate'));
		if(!validity)
			return;
		
		
		var roleValue = this.element.find("#role").val();
		var locationValue = this.element.find("#location").val();
		if(roleValue == ccl.bundle.roleText)
			roleValue = '';
		if(locationValue == ccl.bundle.locationText)
			locationValue = '';		

			this.showEditProfileFormProcessing();
			var criteriaObj = {profileFirstName : this.element.find("#profileFirstName").val()
				, profileLastName : this.element.find("#profileLastName").val()
				, profileEmail : this.element.find("#profileEmail").val()
				, newPassword : this.element.find("#newPassword").val()
				, oldPassword : this.element.find("#oldPassword").val()
				, screenName : this.element.find("#screenName").val()
				, schoolName : this.element.find("#schoolName").val()
				, role : roleValue
				, location : locationValue
				, websiteUrl : this.element.find("#websiteUrl").val()
			};		
			this.screenNameChanged = (ccl.utils.urlDecode(this.currentProfileUserName) != criteriaObj.screenName);
			this.changedScreenName = $.trim(criteriaObj.screenName);
			
			CCL.Models.User.saveProfileEdits(criteriaObj, this.callback('saveProfileSuccess'), this.callback('saveProfileFailed'));
		
	}
	, saveProfileSuccess :  function(statusObj, result){
		this.hideEditProfileFormProcessing();
		if(statusObj.success){
			this.publish("user.profileUpdated", result);
			if(this.screenNameChanged){
				this.screenNameChanged = false;
				this.historyAdd({ controller: "!/profile", action: ccl.utils.encodePredefinedChars(this.changedScreenName)});
				jQuery("#editProfileFormClass").validationEngine('hideFaster');
	        	jQuery("#editProfileScreenNameFormClass").validationEngine('hideFaster'); 
			}else{
				this.reloadPage();
			}
		}else{
			if(statusObj.errorCode == "2034")
				this.reloadPage();
			else if(statusObj.errorCode == "2050")
				jQuery("#screenName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "2051")
				jQuery("#profileEmail").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);			
			else if(statusObj.errorCode == "2054")
				jQuery("#oldPassword").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);			
			else if(statusObj.errorCode == "2055")
				jQuery("#newPassword").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "1006")
				jQuery("#screenName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "1007")
				jQuery("#profileFirstName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "1008")
				jQuery("#profileLastName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "1009")
				jQuery("#role").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "1010")
				jQuery("#profileEmail").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "1011")
				jQuery("#websiteUrl").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "1012")
				jQuery("#newPassword").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "1013")
				jQuery("#oldPassword").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "1014")
				jQuery("#schoolName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			else if(statusObj.errorCode == "1015")
				jQuery("#location").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
			
			 
				
		}
	}
	
	, saveProfileFailed :  function(errorObj){
		this.hideEditProfileFormProcessing();
		this.element.find(".errorMessage").text("Oops! SERVER ERROR " + errorObj.toString());
	}
	, "#screenNameAvailable click": function () {
		var validity = jQuery("#editProfileScreenNameFormClass").validationEngine('validate');
		if(validity){
			var screenName = this.element.find("#screenName").val();
			var acceptCharacters = /[^a-zA-Z0-9 _-]/;
			if(screenName.search(acceptCharacters) == -1){
				$('.screenAvailability').hide();
				$('.editInputField .loadingIcon').show();
				var criteriaObj = {screen_name : ccl.utils.urlEncode(screenName)};
				CCL.Models.User.checkAvailability(criteriaObj, this.callback('checkAvailabilitysuccess'), this.callback('checkAvailabilityerror'));
			}else{
				jQuery("#screenName").validationEngine('showPrompt', "Your screen name can only contain letters, numbers, spaces, hyphens, and underscores", 'error', 'topRight', true);
			}
		}
    }
    , checkAvailabilitysuccess:function (statusObj, registrationDetails) {
    	$('.screenAvailability').show();
		$('.editInputField .loadingIcon').hide();
    	if(statusObj.success){
    		jQuery("#screenName").validationEngine('showPrompt', 'This screen name is available.', 'pass', 'topRight', true);
    	}else{
    		jQuery("#screenName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
    	}
    }
    , checkAvailabilityerror: function(errorObj){
    	$('.screenAvailability').show();
		$('.editInputField .loadingIcon').hide();
    	jQuery("#screenName").validationEngine('showPrompt', errorObj.toString(), 'error', 'topRight', true);
    }
    
	, showPagination :  function(recordsFrom, recordsTo, recordsCount){
		this.paginationButton.find("#pagination").html(this._ccl_bundle.TOPICS_PAGINATION_LABEL.formatString(
				recordsCount
				, recordsFrom
				, recordsTo
				, this.totalTopicsCount
			));				
		this.paginationButton.show();
	}
	, reloadPage : function(){
		this.screenNameChanged = false;
		this.changedScreenName = "";
		this.isOwner = false;
		this.totalTopicsCount = 0;
		this.topicsListContainer = null;
		this.topicPageSize = 20;
		this.currentFilter = 'all';
		this.currentSort = 'date_added';
		this.getTopicsInProgressCount = 0;
		this.paginationButton = null;
		this.paginationLoader = null;
		
		this.currentVisibleTopics = 0;
		this.totalTopicsCount = 0;
		
		this.nextTopicsTo = 20;
		this.nextRecordsCount = 20;
		
		this.element.html(this._ccl_bundle.LOADER_HTML);
		
		CCL.Models.User.getProfile(
				{
					screen_name:ccl.utils.urlEncode(this.currentProfileUserName)
				}
				, this.callback('showProfile')
				, this.callback('profileError')
			);
	}
	, "#paginationButton click": function (el) {
		this.paginationButton.hide();
		this.paginationLoader.show();
		this.getTopics(this.currentVisibleTopics + 1, this.nextRecordsCount, this.currentSort, this.currentFilter);
	}
	, "showTopicListLoader" : function(){
    	this.isTopicListLoaderVisible = true;
    	this.topicsListContainer.html(this._ccl_bundle.LOADER_HTML);		
	}
    , ".sortLinks click": function(el, ev){
    	if(el.hasClass("sortSelectedLink")){
    		return;
    	};
    	$('.sortLinks').each(function(){
    		if($(this).hasClass("sortSelectedLink"))
    			$(this).removeClass("sortSelectedLink");
    	});
    	el.addClass("sortSelectedLink");
    	this.sortOption = this.element.find('#sortByOptions');
		this.currentFilter = el[0].name;
		if (this.currentFilter == 'archive') {
			if (this.sortOption.find('option#top_rated'))
				this.sortOption.find('option#top_rated').remove();	
		} else {
			if(this.sortOption.find('option#top_rated').length == 0)
				this.sortOption.append('<option id="top_rated" > Top Rated </option>');	
		}
		
    	this.sortOption[0].options[0].selected = true;
    	
    	this.showTopicListLoader();
    	

		this.currentVisibleTopics = 0;
		this.totalTopicsCount = 0;
		
		this.nextTopicsTo = 20;
		this.nextRecordsCount = 20;
		
		this.paginationButton.hide();
    	this.getTopics(null, null, null, this.currentFilter);
    }
	, "#sortByOptions change" : function (el) {
		var elDOMRef = el[0];
		this.showTopicListLoader();
		this.currentSort = elDOMRef.options[elDOMRef.selectedIndex].id;

		this.currentVisibleTopics = 0;
		this.totalTopicsCount = 0;
		
		this.nextTopicsTo = 20;
		this.nextRecordsCount = 20;
		
		this.paginationButton.hide();
		this.getTopics(null, null, this.currentSort, this.currentFilter);
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
	, ".dropDownButton click": function (el, ev) {
		$(ev.target).next().find('ul').slideToggle();
    }
	, ".dropDownButton blur": function (el, ev) {
		$(ev.target).next().find('ul').slideUp();
    }
    , 'user.loggedIn subscribe': function (called, user) {
    	this.reloadPage();
    }
    , 'topic.deleted subscribe': function (called, user) {
    	this.reloadPage();
    }
    , showEditProfileFormProcessing: function(){
		//$('.left .spinnerContainer').css('float', 'right');
		$('.left .spinnerContainer').css('margin', '0px 0px 0px 200px');
		$('.left .spinnerContainer').show();
		$('.saveBtn').attr('disabled', true);
	}
    , hideEditProfileFormProcessing: function(){
		$('.left .spinnerContainer').hide();
		$('.saveBtn').attr('disabled', false);
	}
    , "#role focus":function(el,ev){
    	if (el.val() == ccl.bundle.roleText){
            el.val("");
            if(el.hasClass("hint"))
        		el.removeClass("hint");
		}
	}
    , "#role blur":function(el,ev){
		if (el.val() == "") {
            el.val(ccl.bundle.roleText);
            if(!el.hasClass("hint"))
        		el.addClass("hint");
        }
	}
    , "#location focus":function(el,ev){
		if (el.val() == ccl.bundle.locationText){
            el.val("");
			if(el.hasClass("hint"))
        		el.removeClass("hint");
		}
	}
    , "#location blur":function(el,ev){
		if (el.val() == "") {
            el.val(ccl.bundle.locationText);
             if(!el.hasClass("hint"))
        		el.addClass("hint");
        }
	}
    , 'a.topicTitle click' : function(){
    	CCL.Controllers.PagesHolder.previousBookmark = CCL.Controllers.PagesHolder.makeBookmark(this.breadCrumbType, this.breadCrumbValue, this.currentSort, "desc");	
	}
});
