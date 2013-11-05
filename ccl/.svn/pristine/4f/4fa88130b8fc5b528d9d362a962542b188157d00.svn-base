$.Controller.extend("CCL.Controllers.RegistrationModalDialog", {
    init: function (obj,classname,userObj,isTopic) {		
        var sourceObj = this;    
        this.userObj = userObj;
        this.isTopic = isTopic;
        this.sAppInstallDir = g_sAppInstallDir;
        this.userInfoArea = this.element.find("#userInfoArea");
        this.popupLayout = $(this.view(this.sAppInstallDir + 'views/modals/popupLayout'));
        this.RegistrationContent = this.popupLayout.find("#popupContent");
        this.RegistrationContent = this.RegistrationContent.html(this.view(this.sAppInstallDir + 'views/modals/registration',{userObj:userObj }));
        this.closeButton = this.popupLayout.find(".close");
        this.SaveMyProfileButton = this.RegistrationContent.find("#SaveMyProfileButton");
		this.SchoolName = this.RegistrationContent.find("#schoolName");
		this.Role = this.RegistrationContent.find("#role");
		this.Location = this.RegistrationContent.find("#location");
		this.CheckAvailability = this.RegistrationContent.find("#CheckAvailability");
		this.SchoolNameText = this.SchoolName.val();
		this.RoleText = this.Role.val();
		this.LocationText = this.Location.val();
        this.hintClass = "hint";
		this.popupLayout[0].className = classname;
        this.closeButton.click(function () {
        	jQuery("#createProfileFormClass").validationEngine('hideFaster'); 
        	sourceObj.close();
            delete sourceObj;
        });
		
		if( this.Role ){
			this.Role.waterMark(	{ "waterMarkClass": "hint"
								 	, "waterMarkText" : ccl.bundle.roleText
									} 
								);
		}
		
		if( this.Location ){
			this.Location.waterMark(	{ "waterMarkClass": "hint"
								 	, "waterMarkText" : ccl.bundle.locationText
									} 
								);
		}
		
		
		this.CheckAvailability.click(
			function() {
				sourceObj.CheckAvailabilityClick();
			}
		);
        this.SaveMyProfileButton.click(
            function () {
            	jQuery("#createProfileFormClass").validationEngine('hideFaster');
				var validity = jQuery("#createProfileFormClass").validationEngine('validate');
				if(validity){
					sourceObj.showRegFormProcessing();
					sourceObj.SaveMyProfileButtonClick();
					//CCL.Models.User.checkAvailability(sourceObj.RegistrationContent, sourceObj.callback('SaveMyProfileButtonClick'), sourceObj.callback('checkAvailabilityerror'));
				}	
				else{
					sourceObj.hideRegFormProcessing();
				}
            }
        );
		
	CCL.Controllers.PagesHolder.pageTrackerForGoogleAnalytics(
		"/ccl/uimodals/Registration"
	);
		
        this._width = 670;
        $.blockUI({
            message: this.popupLayout
            , css: {
                top: '5%'
                , left: ($(window).width() - this._width) / 2 + 'px'
                , border: 'none'
                , backgroundColor: 'transparent'
                , position: 'absolute'
                , cursor: 'auto'
            }
            , overlayCSS: {
                cursor: 'auto'
            }
        });
		jQuery("#createProfileFormClass").validationEngine('attach', {promptPosition : "topRight", scroll : false, validationEventTrigger : "none", multiplePrompts : false});
    }
    , close: function () {
        $.unblockUI();
        this.destroy();
    }
	, CheckAvailabilityClick: function () {
		var validity = jQuery("#createProfileFormClass").validationEngine('validate');
		if(validity){
				$('.screenAvailability').hide();
				$('.editInputField .loadingIcon').show();
				var criteriaObj = {screen_name : ccl.utils.urlEncode(this.RegistrationContent.find("#screenName").val())};
				CCL.Models.User.checkAvailability(criteriaObj, this.callback('checkAvailabilitysuccess'), this.callback('checkAvailabilityerror'));
			}
    }
    , SaveMyProfileButtonClick: function () {
    	var schoolName = this.RegistrationContent.find("#schoolName").val();
		var roleValue = this.RegistrationContent.find("#role").val();
		var locationValue = this.RegistrationContent.find("#location").val();
		if(roleValue == this.RoleText)
			roleValue = '';
		if(locationValue == this.LocationText)
			locationValue = '';		
		
			var criteriaObj = {screen_name : this.RegistrationContent.find("#screenName").val()
					,school : schoolName
					,role : roleValue
					,location : locationValue
					,first_name : this.userObj.user.firstName
					,last_name : this.userObj.user.lastName
					,email_id : this.userObj.user.userEmail
			};		
			CCL.Models.User.saveProfile(criteriaObj, this.callback('success'), this.callback('error'));		
		
    }
	/*, RoleFocus:function(){
		if (this.Role.val() == this.RoleText){
            this.Role.val("");
			this.Role.css('color', '#000');
		}
	}
	, RoleBlur:function(){
		if (this.Role.val() == "") {
            this.Role.val(this.RoleText);
			this.Role.css('color', '#999999');
        }
	}
	, LocationFocus:function(){
		if (this.Location.val() == this.LocationText)
            this.Location.val("");
			this.Location.css('color', '#000');
	}
	, LocationBlur:function(){
		if (this.Location.val() == "") {
            this.Location.val(this.LocationText);
            this.Location.css('color', '#999999');
        }
	}*/
	, checkAvailabilitysuccess:function (statusObj, registrationDetails) {
		$('.screenAvailability').show();
		$('.loadingIcon').hide();
    	if(statusObj.success){
    		jQuery("#screenName").validationEngine('showPrompt', 'This screen name is available.', 'pass', 'topRight', true);
    	}else{
    		jQuery("#screenName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
    	}
    }
    , checkAvailabilityerror: function(errorObj){
    	$('.screenAvailability').show();
		$('.loadingIcon').hide();
    	jQuery("#screenName").validationEngine('showPrompt', errorObj.toString(), 'error', 'topRight', true);
    }
    , success:function (statusObj, tokenDetails) {
    	if(statusObj.success){
    		CCL.Models.User.registration({userToken:tokenDetails.user_token}, this.callback('registerSuccess'), this.callback('error')); 
    		jQuery("#createProfileFormClass").validationEngine('hideFaster'); 
    	}else{
    		this.hideRegFormProcessing();
    		jQuery("#screenName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
    	}
    }
    , error: function(errorObj){
    	this.hideRegFormProcessing();
    	jQuery("#screenName").validationEngine('showPrompt', errorObj.toString(), 'error', 'topRight', true);
    }
	, registerSuccess : function(statusObj, registrationDetails){
		if(statusObj.success){
			this.hideRegFormProcessing();
			GLOBALS[10] = registrationDetails.user.screenName;
			this.publish("user.loggedIn",registrationDetails);
			jQuery("#createProfileFormClass").validationEngine('hideFaster');
			this.close();
			if(this.isTopic){
				$("#pagesHolder").ccl_copy_to_site("popup",registrationDetails,this.isTopic);
			}
			
    	}else{
    		steal.dev.log("error");
    	}
	}
	, showRegFormProcessing : function(){
		$('#createProfileFormClass .spinnerContainer').css('margin', '2px 45px 0 0');
		$('#createProfileFormClass .spinnerContainer').css('float', 'right');
		$('#createProfileFormClass .spinnerContainer').show();
	}	
	, hideRegFormProcessing : function(){
		$('#createProfileFormClass .spinnerContainer').hide();
	}	
});