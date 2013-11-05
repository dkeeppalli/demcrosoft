$.Controller.extend("CCL.Controllers.SignInModalDialog", {
    init: function (obj,classname) {		
        var sourceObj = this;
        this.sAppInstallDir = g_sAppInstallDir;
        this.userInfoArea = this.element.find("#userInfoArea");
        this.popupLayout = $(this.view(this.sAppInstallDir + 'views/modals/popupLayout'));
        this.SignInContent = this.popupLayout.find("#popupContent");
        this.SignInContent.html(this.view(this.sAppInstallDir + 'views/modals/signIn'));
        this.closeButton = this.popupLayout.find(".close");
        this.userNameField = this.SignInContent.find("#userName");
        this.passwordField = this.SignInContent.find("#password");
        this.signInButton = this.SignInContent.find("#signInButton");
        this.wejitSignInButton = this.SignInContent.find("#wejitSignInButton");
		this.submitButton = this.SignInContent.find("#submitButton");
        this.forgotLink = this.SignInContent.find("#linkToForgotPassword");
		this.forgotForm = this.SignInContent.find('#forgotPasswordForm');
		this.signInForm = this.SignInContent.find('#signInFormClass');
        this.backtoLogin = this.SignInContent.find(".backtoLogin");
        this.signIn = this.SignInContent.find("#signInModal");
        this.forgotPassword = this.SignInContent.find("#fgPwdModal");
        this.forgotPasswordFeilds = this.SignInContent.find("#forgotPasswordFeilds");
        this.forgotPasswordConfirmation = this.SignInContent.find("#forgotPasswordConfirmation");
        this.popupLayout[0].className = classname;
        this.closeButton.click(function () {
			jQuery("#signInFormClass").validationEngine('hideFaster');
			jQuery("#forgotPasswordForm").validationEngine('hideFaster');
            sourceObj.close();
            delete sourceObj;
        });
        this.forgotLink.click(function () {
			jQuery("#signInFormClass").validationEngine('hideFaster');			
            sourceObj.forgotLinkClick();
            $("#email").focus();
        });
        this.submitButton.click(
            function () {

            	var validity = jQuery("#forgotPasswordForm").validationEngine('validate');
				if(validity){
					sourceObj.submitButtonClick();
					sourceObj.showForgotFormProcessing();
				}
            }
        );
		this.forgotForm.submit(function(){
			var validity = jQuery("#forgotPasswordForm").validationEngine('validate');
			if(validity)
				sourceObj.showForgotFormProcessing();
		});
		this.signInForm.submit(function(){

			var validity = jQuery("#signInFormClass").validationEngine('validate');
			if(validity)
				sourceObj.showSignInFormProcessing();
		});
		this.signInButton.click(
            function () {

            	var validity = jQuery("#signInFormClass").validationEngine('validate');
				if(validity){
					sourceObj.signInButtonClick();
					sourceObj.showSignInFormProcessing();
				}
            }
        );
        this.wejitSignInButton.click(
            function () {

                var wejitValidity = jQuery("#wejitSignInButton").validationEngine('validate');
                if(wejitValidity){
                    sourceObj.signInButtonClick();
                    sourceObj.showSignInFormProcessing();
                }
            }
        );
        this.backtoLogin.click(function () {
			jQuery("#forgotPasswordForm").validationEngine('hideFaster');
            sourceObj.backtoLoginClick();
            $("#userName").focus();
        });
 	CCL.Controllers.PagesHolder.pageTrackerForGoogleAnalytics(
		"/ccl/uimodals/SignIn"
	);
        this._width = 530;
        $.blockUI({
            message: this.popupLayout
            , css: {
                top: '20%'
                , left: ($(window).width() - this._width) / 2 + 'px'
                , border: 'none'
                , backgroundColor: 'transparent'
                , cursor: 'auto'
            }
            , overlayCSS: {
                cursor: 'auto'
            }
        });
		jQuery("#signInFormClass").validationEngine('attach', {promptPosition : "topRight", scroll : false, validationEventTrigger : "none", multiplePrompts : false});
		jQuery("#forgotPasswordForm").validationEngine('attach', {promptPosition : "topRight", scroll : false, validationEventTrigger : "none"});
    }
    , close: function () {
        $.unblockUI();		
        this.element.controller().destroy();
    }
    , signInButtonClick: function (el , ev) {
		GLOBALS[12]=this.userNameField.val();
        CCL.Models.User.login({ userDetails: { username: this.userNameField.val()
        									 , password: this.passwordField.val()} }
        									 , this.callback('success')
        									 , this.callback('error'));
    }
	, submitButtonClick: function (el , ev) {
		var emailID = $('#email').val(); 
		CCL.Models.User.forgotPassword(emailID
									 , this.callback('forgotSuccess')
									 , this.callback('forgotError'));
		
		
    }
	, forgotSuccess: function (statusObj) {
    	this.hideForgotFormProcessing();
    	$('#email').val("");
		if(statusObj.success){
    		this.forgotPasswordFeilds.hide();
            this.forgotPasswordConfirmation.show();
    	}else{
    		jQuery("#email").validationEngine('showPrompt', "You have entered wrong Email!", 'error', 'topRight', true);
    	}
    }
	, forgotError: function (errorObj) {
		this.hideForgotFormProcessing();
    }
    , forgotLinkClick: function () {
        this.signIn.hide();
        this.forgotPassword.show();
    }
    , backtoLoginClick: function () {
        this.signIn.show();
        $('#email').val("");
        this.forgotPassword.hide();
        this.forgotPasswordFeilds.show();
        this.forgotPasswordConfirmation.hide();
    }
	, success: function (statusObj, userData) {
    	if(statusObj.success){
			if(userData.registered==false)
			{
				this.close();
				$("#pagesHolder").ccl_registration_modal_dialog("popup register",userData,null);
			}
			else
			{
				 this.close();
				 GLOBALS[10] = userData.user.screenName;
				 this.publish("user.loggedIn",userData);
				
			}
			
    	}else{
			this.hideSignInFormProcessing();
    		if(statusObj.errorCode == "DS3012")
    			jQuery("#userName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
    		if(statusObj.errorCode == "DS3013")
    			jQuery("#password").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
    	}
    }
    , error: function(errorObj){
    	/*steal.dev.log("Oops! SERVER ERROR " + errorObj.toString());*/
    }
	, showForgotFormProcessing: function(){
		$('#backtoLogin').hide();
		$('#submitButton').css('margin-left', '117px');
		$('#submitButton').css('float', 'left');
		$('#forgotPasswordForm .spinnerContainer').css('float', 'left');
		$('#forgotPasswordForm .spinnerContainer').show();
		$('#submitButton').attr('disabled', true);
	}
	, hideForgotFormProcessing: function(){
		$('#backtoLogin').show();
		$('#submitButton').css('margin-left', '152px');
		$('#forgotPasswordForm .spinnerContainer').hide();
		$('#submitButton').attr('disabled', false);
	}
	, showSignInFormProcessing: function(){
		$('#linkToForgotPassword').hide();
		$('#signInFormClass .spinnerContainer').css('float', 'right');
		$('#signInFormClass .spinnerContainer').css('margin-left', '70px');
		$('#signInFormClass .spinnerContainer').show();
		$('#signInButton').attr('disabled', true);
	}
	, hideSignInFormProcessing: function(){
		$('#linkToForgotPassword').show();
		$('#signInFormClass .spinnerContainer').hide();
		$('#signInButton').attr('disabled', false);
	}
});