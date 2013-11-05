$.Controller.extend("CCL.Controllers.RegistrationPage", {
    init: function () {
		var sourceObj = this;  
		this.oSearchOptionsFisrtName = this.options.firstName;
        this.oSearchOptionsSchoolName = this.options.schoolName;
        this.sAppInstallDir = g_sAppInstallDir;
        $("#userInfoArea").hide();
        this.userObj = USER_SESSION_OBJ;
        this.element.html(this.view(this.sAppInstallDir 
        							+ 'views/modals/inlineRegistration'
                                    , {
                                        firstName: this.oSearchOptionsFisrtName
                                      , schoolName: this.oSearchOptionsSchoolName
                                    }
                                    ));
        this.RegistrationContent = this.element.find("#registrationPage");
        this.SaveMyProfileButton = this.RegistrationContent.find("#SaveMyProfileButton");
		this.SchoolName = this.RegistrationContent.find("#schoolName");
		this.Role = this.RegistrationContent.find("#role");
		this.Location = this.RegistrationContent.find("#location");
		this.CheckAvailability = this.RegistrationContent.find("#CheckAvailability");
		this.SchoolNameText = this.SchoolName.val();
		this.RoleText = this.Role.val();
		this.LocationText = this.Location.val();
        this.hintClass = "hint";
        
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
				//jQuery("#createProfileInlineFormClass").validationEngine('hideFaster'); 
				sourceObj.CheckAvailabilityClick();
			}
		);
        this.SaveMyProfileButton.click(
            function () {
            	jQuery("#createProfileInlineFormClass").validationEngine('hideFaster');
				var validity = jQuery("#createProfileInlineFormClass").validationEngine('validate');
				if(validity){
					sourceObj.SaveMyProfileButtonClick();
				}
            }
        );
        jQuery("#createProfileInlineFormClass").validationEngine('attach', {promptPosition : "topRight", scroll : false, validationEventTrigger : "none", multiplePrompts : false});
    }
	, CheckAvailabilityClick: function () {
		var validity = jQuery("#createProfileInlineFormClass").validationEngine('validate');
		if(validity){
			$('.screenAvailability').hide();
				$('.editInputField .loadingIcon').show();
				var criteriaObj = {screen_name : ccl.utils.urlEncode(this.element.find("#screenName").val())};
				CCL.Models.User.checkAvailability(criteriaObj, this.callback('checkAvailabilitysuccess'), this.callback('checkAvailabilityerror'));
			
		}
	}
	, SaveMyProfileButtonClick: function () {
		var schoolName = this.element.find("#schoolName").val();
		var roleValue = this.element.find("#role").val();
		var locationValue = this.element.find("#location").val();
		if(roleValue == this.RoleText)
			roleValue = "";
		if(locationValue == this.LocationText)
			locationValue = "";
		
		var criteriaObj = {screen_name : this.element.find("#screenName").val()
							 , school : schoolName
						 	 , role : roleValue
						 	 , location : locationValue
						 	 , first_name : this.userObj.user.firstName
						 	 , last_name : this.userObj.user.lastName
						 	 , email_id : this.userObj.user.userEmail
			};
			
			CCL.Models.User.saveProfile(criteriaObj, this.callback('success'), this.callback('error'));
		
	}
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
			jQuery("#createProfileInlineFormClass").validationEngine('hideFaster');  
		}else{
			jQuery("#screenName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
		}
	}
	, error: function(errorObj){
		jQuery("#screenName").validationEngine('showPrompt', errorObj.toString(), 'error', 'topRight', true);
	}
	, registerSuccess : function(statusObj, registrationDetails){
		if(statusObj.success){
			GLOBALS[10] = registrationDetails.user.screenName;
			this.publish("user.loggedIn",registrationDetails);
			if(this.options.callbackURL)
			window.location.href = "http://"+location.hostname+"/#!/topic/"+this.options.callbackURL;
			else
			window.location.href = "http://"+location.hostname+"/";
	
			$("#userInfoArea").show();
			jQuery("#createProfileInlineFormClass").validationEngine('hideFaster'); 
		}else{
			steal.dev.log("error");
		}
	}
});