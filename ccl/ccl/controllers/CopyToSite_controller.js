$.Controller.extend("CCL.Controllers.CopyToSite", {
    init: function (obj,classname,shareObj,isTopic) {
		this.shareObj = shareObj || {};
        var sourceObj = this;
        var siteType =true;
        var flag = true;

        GLOBALS[6] = GLOBALS[6] || obj.id;
		GLOBALS[4] = GLOBALS[4] || obj.name;
		if(GLOBALS[10] == ""){
			this.sitesObj = null;
		}else{
			this.sitesObj = sitesObj;
		}
        this.sAppInstallDir = g_sAppInstallDir;
        this.userInfoArea = this.element.find("#userInfoArea");
        this.popupLayout = $(this.view(this.sAppInstallDir + 'views/modals/popupLayout'));
        this.CopyToSiteContent = this.popupLayout.find("#popupContent");
        this.CopyToSiteContent.html(this.view(this.sAppInstallDir 
        									+ 'views/modals/copyToSite'
        									, { shareObj :this.shareObj
        									  , sitesObj :this.sitesObj	
        									})
        									);
        this.closeButton = this.popupLayout.find(".close");
        this.linkToWeJit = this.popupLayout.find(".linkToWeJit");
        this.linkToCollaborize = this.popupLayout.find(".linkToCollaborize");
        this.loggedLinkToWeJit = this.popupLayout.find(".loggedLinkToWeJit");
        this.loggedLinkToCollaborize = this.popupLayout.find(".loggedLinkToCollaborize");
        this.linkPopUp = this.popupLayout.find("#linkPopUp");
        this.popupHeader = this.popupLayout.find("#popupHeader");
        this.iframeContent = this.popupLayout.find(".iframeContent");
        this.wejitFacebook = this.popupLayout.find("#wejitFacebook");
        this.wejitGoogle = this.popupLayout.find("#wejitGoogle"); 
        this.wejitSignUpPopupLink = this.popupLayout.find("#wejitSignUpPopupLink");
        this.wejitSignInPopupLink = this.popupLayout.find("#wejitSignInPopupLink"); 
        this.signUpForm = this.popupLayout.find('#signUpForm');   
        this.signUpButton = this.popupLayout.find('#signUpButton');
        this.wejitRememberme = this.popupLayout.find('#wejitSignUpRememberme');
        this.spinnerContainer = this.popupLayout.find('#signUpForm .spinnerContainer');
        this.signUpRememberMe = this.popupLayout.find('#signUpRememberMe');
        this.wejitEmailId = this.popupLayout.find("#wejitSignUpEmailId");
        this.wejitFirstName =this.popupLayout.find("#wejitFirstName");
        this.wejitLastName = this.popupLayout.find("#wejitLastName");
        /*this.wejitSignUpPassword*/
        this.wejitPassword = this.popupLayout.find("#wejitSignUpPassword");   
        //this.popupContent = this.popupHTMLContent.find("#popupContent");
        this.signInContainer = this.popupLayout.find("#signInContainer");
		this.CancelLink = this.popupLayout.find("#linkTocancel");
        this.CopyTopicButton = this.CopyToSiteContent.find("#copyToSiteButton");
		this.CopyTopicAgainButton = this.CopyToSiteContent.find("#copyTopicAgain");
		this.ShareTopicButton = this.CopyToSiteContent.find("#shareTopicButton");
		this.DeleteTopicButton = this.CopyToSiteContent.find("#deleteTopicButton");
		this.userNameField = this.CopyToSiteContent.find("#userName");
        this.passwordField = this.CopyToSiteContent.find("#password");
        this.siteTypeField = this.CopyToSiteContent.find("#siteType");
        
        /*this.siteTypeField = this.CopyToSiteContent.find("#wejitSiteType");*/
        this.signInButton = this.CopyToSiteContent.find("#signInButton");
		this.submitButton = this.CopyToSiteContent.find("#submitButton");
        this.forgotLink = this.CopyToSiteContent.find("#linkToForgotPassword");
		this.forgotForm = this.CopyToSiteContent.find('#forgotPasswordFormClass');
		this.signInForm = this.CopyToSiteContent.find('#signInFormClass');
        this.backtoLogin = this.CopyToSiteContent.find(".backtoLogin");
        this.signIn = this.CopyToSiteContent.find("#copyToSiteRegistration");
        this.forgotPassword = this.CopyToSiteContent.find("#forgotPasswordModal");
        this.creatSiteNowButton = this.CopyToSiteContent.find("#creatSiteNow");
        this.forgotPasswordFeilds = this.CopyToSiteContent.find("#forgotPasswordFeildsCopyToSite");
        this.forgotPasswordConfirmation = this.CopyToSiteContent.find("#forgotPasswordConfirmationCopyToSite");
		this.popupLayout[0].className = classname;
       
		this.wejitUserNameField = this.CopyToSiteContent.find("#wejitUserName");
        this.wejitPasswordField = this.CopyToSiteContent.find("#wejitPassword");

       	if(isTopic){
			this.getThisTopic(shareObj);
		}
		
		
		this.CancelLink.click( function () {
            sourceObj.Cancel();
            delete sourceObj;
        });

        
        this.linkToWeJit.click( function (el) {
        	var me =this;
        	me.siteType = true;
        	me.flag = true;
        	/*$(".popupHeader").show();
        	$("#signInContainer").show();*/
        	$("#linkPopUp").hide();
        	$(".wejitLogin").show();
        	
        });
        
        this.loggedLinkToWeJit.click( function (el) {
            var me =this;
            me.siteType = true;
            me.flag = true;
            /*$(".popupHeader").show();
            $("#signInContainer").show();*/
            $(".popup").hide();
            $('.close').trigger('click');
            var wejitUrl="9d841e1435da4dd1069ea79bbae2eabb";
            var oWin = window.open("http://localhost/wejit/#!"+wejitUrl,'_blank');
            
            
        });

        this.linkToCollaborize.click( function () {
        	var me=this;
        	siteType = false;
        	me.flag = true;
           $("#copyToSiteRegistration").show();
           $("#linkPopUp").hide();
        });
        this.loggedLinkToCollaborize.click( function () {
            var me=this;
            siteType = false;
            me.flag = true;
            $("#selectSite").show();
            $("#loggedLinkPopUp").hide();
        });
        this.wejitFacebook.click(function(){
            var callbackurl = wejit.bundle.rpxCallBackURL+(this.siteId ? "?site_id="+this.siteId : "");
            var str="https://collaborize.rpxnow.com/facebook/connect_start?token_url="+callbackurl+"&api_key=a19656ed12bf84827a2a514c29fab801a48cbfb3";
            window.open(str,'test','height=650,width=650');
        });
        this.wejitGoogle.click(function(){
            var callbackurl = wejit.bundle.rpxCallBackURL+(this.siteId ? "?site_id="+this.siteId : "");
            var str="https://collaborize.rpxnow.com/openid/start?openid_identifier=https%3a%2f%2fwww.google.com%2faccounts%2fo8%2fid&token_url="+callbackurl+"&api_key=a19656ed12bf84827a2a514c29fab801a48cbfb3";
            window.open(str,'test','height=650,width=650');
        });
        this.wejitSignUpPopupLink.click(function(){
             $(".wejitLogin").hide();
             $(".wejitSignUp").show();
        });
        this.wejitSignInPopupLink.click(function(){
             $(".wejitLogin").show();
             $(".wejitSignUp").hide();
        });
        this.signUpForm.submit(function(){
        var isFormValid = jQuery("#signUpForm").validationEngine('validate');
            if(sourceObj.wejitEmailId.val()==''){
                $(".wejitSignUpEmailIdformError").show();
                $(".wejitFirstNameformError").hide();
                $(".wejitLastNameformError").hide();
                $(".wejitSignUpPasswordformError").hide();
            }
            if(sourceObj.wejitEmailId.val()!='' && sourceObj.wejitFirstName.val()==''){
                $(".wejitSignUpEmailIdformError").hide();
                $(".wejitFirstNameformError").show(); 
                $(".wejitLastNameformError").hide();
                $(".wejitSignUpPasswordformError").hide();
            }
            if(sourceObj.wejitEmailId.val()!='' && sourceObj.wejitFirstName.val()!='' && sourceObj.wejitLastName.val()==''){
                $(".wejitSignUpEmailIdformError").hide();
                $(".wejitLastNameformError").show();
                $(".wejitSignUpPasswordformError").hide();
            }
            if(sourceObj.wejitEmailId.val()!='' && sourceObj.wejitFirstName.val()!='' && sourceObj.wejitLastName.val()!='' && sourceObj.wejitPassword.val()==''){
                $(".wejitSignUpEmailIdformError").hide();
                $(".wejitSignUpPasswordformError").show();
            }
            if(sourceObj.wejitEmailId.val()!='' && sourceObj.wejitFirstName.val()!='' && sourceObj.wejitLastName.val()!='' && sourceObj.wejitPassword.val()!=''){
                 $(".wejitSignUpEmailIdformError").show();   
            }
            if(isFormValid)
                console.log(isFormValid);
              /*this.showsignUpFormProcessing();*/
            });
        this.signUpButton.click(
            function () {
                
              var isFormValid = jQuery("#signUpForm").validationEngine('validate');
              if(isFormValid){
                sourceObj.showsignUpFormProcessing();
                sourceObj.signUpButtonClick()
              }
              
            }
        );


		this.closeButton.click(function () {
			jQuery("#signInFormClass").validationEngine('hideFaster');
			jQuery("#forgotPasswordFormClass").validationEngine('hideFaster');
			sourceObj.close();
            delete sourceObj;
        });
        this.CopyTopicButton.click(
            function () {
                sourceObj.CopyTopicButtonClick();
            }
        );
		this.CopyTopicAgainButton.click(
            function () {
                sourceObj.CopyTopicAgainButtonClick();
            }
        );
		
		this.DeleteTopicButton.click(
	            function () {
	            	sourceObj.DeleteTopicButtonClick();
	            	sourceObj.showDeleteTopicProcessing();
	            }
	        );
		this.forgotLink.click(function () {
			jQuery("#signInFormClass").validationEngine('hideFaster');			
            sourceObj.forgotLinkClick();
        });
        this.submitButton.click(
            function () {
            	var validity = jQuery("#forgotPasswordFormClass").validationEngine('validate');
				if(validity){
					sourceObj.submitButtonClick();
					sourceObj.showForgotFormProcessing();
				}
            }
        );
		this.forgotForm.submit(function(){
			var validity = jQuery("#forgotPasswordFormClass").validationEngine('validate');
			if(validity)
				sourceObj.showForgotFormProcessing();
		});
		this.signInForm.submit(function(){
			var validity = jQuery("#signInFormClass").validationEngine('validate');
           /* var wejitValidity = jQuery("#wejitSignInFormClass").validationEngine('validate');*/
			if(validity)
				sourceObj.showSignInFormProcessing();
		});
		this.signInButton.click(
            function (event) {
                sourceObj.copyToWejit();

    //         	console.log(siteType);
    //         	if(siteType){
    //                 event.preventDefault();
    //         		var validity = jQuery("#wejitSignInFormClass").validationEngine('validate');
    //                 if(sourceObj.wejitUserNameField.val()=='' ){
    //                     $('.wejitPasswordformError').hide();
                        
    //                 }
    //                 if(sourceObj.wejitUserNameField.val()!='' && sourceObj.wejitPasswordField.val()==''){

    //                     $('.wejitPasswordformError').show(); 
    //                     $('.wejitUserNameformError').hide();
    //                 }
    //                 if(sourceObj.wejitUserNameField.val()!='' && sourceObj.wejitPasswordField.val()!=''){
    //                     $('.wejitUserNameformError').show();
    //                 }

    //             }    
    //         	else
    //         		var validity = jQuery("#signInFormClass").validationEngine('validate');
				// if(validity){
					
				// 	sourceObj.signInButtonClick();
				// 	sourceObj.showSignInFormProcessing();
				// }
             }
        );
        this.backtoLogin.click(function () {
			jQuery("#forgotPasswordFormClass").validationEngine('hideFaster');
            sourceObj.backtoLoginClick();
        });
        this.creatSiteNowButton.click(
                function () {
                    sourceObj.creatSiteNowButtonClick();
                }
       	);
 	CCL.Controllers.PagesHolder.pageTrackerForGoogleAnalytics(
		"/ccl/uimodals/CopyToSite"
	);
       this._width = 620;
        $.blockUI({
            message: this.popupLayout
            , css: {
                top: '5%'
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
		jQuery("#forgotPasswordFormClass").validationEngine('attach', {promptPosition : "topRight", scroll : false, validationEventTrigger : "none"});
    }
    /*,'.weJITLink click':function(){
    	alert(0);
    }*/
    , showsignUpFormProcessing: function(){
          this.wejitRememberme.hide();
          this.spinnerContainer.css('float', 'right');
          this.spinnerContainer.show();
          this.signUpButton.attr('disabled', true);
    }
    , signUpButtonClick: function () {
        var userDetails = {};
       /* userDetails.first_name = wejit.utils.urlEncode(this.wejitFirstName.val());
        userDetails.last_name = wejit.utils.urlEncode(this.wejitLastName.val());
        userDetails.email_id  = wejit.utils.urlEncode(this.wejitEmailId.val());
        userDetails.password = wejit.Base64.encode(wejit.Base64.encode(this.wejitPassword.val()));*/
        userDetails.email_id  =ccl.utils.urlEncode(this.wejitEmailId.val());
        userDetails.password = ccl.Base64.encode(ccl.Base64.encode(this.wejitPassword.val()));
        console.log(userDetails.email_id);
        console.log(userDetails.password);

        if(this.siteId){

          userDetails.site_id = this.siteId;
        }
        userDetails.remember_me = false;
        if(this.signUpRememberMe.is(':checked')){
          userDetails.remember_me = true;
        }

        /*Wejit.Model.Wejitmodel.prototype.wejitSignup( userDetails
                                           , this.proxy('successcallback')
                                           , this.proxy('error'));*/

    }

    , close: function () {
    	jQuery("#listOfSGrds").validationEngine('hideFaster');
    	jQuery("#listOfSSub").validationEngine('hideFaster');
    	$.unblockUI();
    	if(this.element){
    		this.element.controller().destroy();
		}
    }
	, Cancel: function () {
		jQuery("#listOfSGrds").validationEngine('hideFaster');
    	jQuery("#listOfSSub").validationEngine('hideFaster');
		$.unblockUI();
		if(this.element){
    		this.element.controller().destroy();
		}
    }
	, creatSiteNowButtonClick: function () {
		CCL.Models.User.getUserToken("", this.callback('getUserTokenSuccess'), this.callback('getUserTokenError'));	
	}
	, getUserTokenSuccess: function (statusObj,tokenResponse) {
		var CollaborizeUrl;
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
    , CopyTopicButtonClick: function () {
    	this.showCopyTopicProcessing();
    	GLOBALS[7] = $('#copySites>option:selected')[0].id;
    	GLOBALS[2] = $('#copySites>option:selected').text();
    	GLOBALS[3] = $('#copySites>option:selected').val();
    	$("#siteName").text(GLOBALS[2]);
		$(".disableTopicType").text(ccl.bundle.disableCopyText[GLOBALS[4]]);
		CCL.Models.Topic.checkIfTopicDownloaded({publish_url:ccl.utils.urlEncode(GLOBALS[3]),ccl_topic_id:GLOBALS[6]}, this.callback('copytopicsuccess'), this.callback('error'));
    }
	, CopyTopicAgainButtonClick: function () {
		this.showCopyTopicAgainProcessing();
        CCL.Models.Topic.checkValidTopicType({site_id:GLOBALS[7],topic_type:GLOBALS[4]}, this.callback('copytopicagainsuccess'), this.callback('error'));
    }
	, copytopicsuccess: function (statusObj,copyDetails) {
        if(statusObj.success){
			console.log(statusObj);
    	}else{
    		this.hideCopyTopicProcessing();
			$("#selectSite").hide();
			$("#alreadyCopied").show();
    	}
    }
    , copyToWejitsuccess: function (statusObj,copyDetails) {
        if(statusObj.success){
            CCL.Models.Topic.checkValidTopicType({site_id:GLOBALS[7],topic_type:GLOBALS[4]}, this.callback('copytopicagainsuccess'), this.callback('error'));
        }else{
            this.hideCopyTopicProcessing();
            $("#selectSite").hide();
            $("#alreadyCopied").show();
        }
    }
	, copytopicagainsuccess: function (statusObj,userToken) {

		if(statusObj.success){
            if(flag){
                /*var wejitUrl = ccl.bundle.copyToWejitURL+'&cclTopicId='+GLOBALS[6]; */
                var wejitUrl="9d841e1435da4dd1069ea79bbae2eabb";
                var oWin = window.open("http://localhost/wejit/#!"+wejitUrl,'_blank');
            }
            else{
    			var CollaborizeUrl = ccl.bundle.copyToSiteURL+userToken.userToken+'&publishUrl='+GLOBALS[3]+'&cclTopicId='+GLOBALS[6]; 
    			var oWin = window.open(CollaborizeUrl,'_blank');
            }
			closeObj = this;
			window.setTimeout(function () {
											if (oWin == null || typeof(oWin)=="undefined" || (oWin!=null && oWin.outerHeight == 0)) {
												sourceObj.ccl_copy_to_site("popup");
												$("#alreadyCopied").hide();
												$("#selectSite").hide();
												$("#popupBlocker").show();
											} else {
												closeObj.close();
											}
							}, 100);
    	}else{
    		this.hideCopyTopicProcessing();
    		this.hideCopyTopicAgainProcessing();
    		$("#siteName").text(GLOBALS[2]);

			$(".disableTopicType").text(ccl.bundle.disableCopyText[GLOBALS[4]]);
    		$("#alreadyCopied").hide();
			$("#selectSite").hide();
			$("#cannotCopied").show();
			$("#loaderimage").hide();
    	}
    }
    , error: function(errorObj){
		steal.dev.log("oops..conection problem!");
    	this.popupLayout.text("Oops! SERVER ERROR " + errorObj.toString());
    }
    , DeleteTopicButtonClick : function () {
    	CCL.Models.Topic.deleteTopic({ ccl_topic_id : GLOBALS[6]}
									, this.callback('deleteTopicSuccess')
									, this.callback('deleteTopicError'));
    	  
    }
	, deleteTopicSuccess: function (statusObj) {
		if(statusObj.success){
			steal.dev.log("success");
			GLOBALS[6] = "";
			$.unblockUI();
			this.publish("topic.deleted",statusObj);
    	}else{
    		steal.dev.log("error");
    	}
    }
    , deleteTopicError: function(errorObj){
    	this.popupLayout.text("Oops! SERVER ERROR " + errorObj.toString());
    }
    , signInButtonClick: function (el , ev) {
        ev.preventDefault();
    	var userName;
    	var password;
    	var siteType;
    	if(this.userNameField.val()==''){
    		 console.log("empty username");
    		userName=this.wejitUserNameField.val();
    		password=this.wejitPasswordField.val();
    		siteType='wejit';
    		flag=true;
            
    	}
    	else
    	{
    		userName=this.userNameField.val();
    		password=this.passwordField.val();
    		siteType='cc';	
    		flag = false;
    	}
        
    		
    	GLOBALS[12]=userName;
        CCL.Models.User.login({ userDetails: { username: userName
        									 , password: password
        									 , siteType: siteType} }
        									 , this.callback('signInSuccess')
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
    , signInSuccess: function (statusObj, userData) {
    	// if(flag){
           
     //        if(statusObj.success){
     //           $(".popup").hide();
     //            /*var wejitUrl = ccl.bundle.copyToWejitURL+'&cclTopicId='+GLOBALS[6]; */
     //            CCL.Models.Topic.copyToWejit({})
     //            var wejitUrl="9d841e1435da4dd1069ea79bbae2eabb";
     //            var oWin = window.open("http://localhost/wejit/#!"+wejitUrl,'_blank');
     //        }
     //        else{
                
     //            this.hideSignInFormProcessing();
     //            if(statusObj.errorCode == "DS3012")
     //                jQuery("#wejitUserName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
     //            if(statusObj.errorCode == "DS3013")
     //                jQuery("#wejitPassword").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
     //        }
    	
    	// }
    	if(statusObj.success){
			if(userData.registered==false)
			{
				 this.close();
				 $("#pagesHolder").ccl_registration_modal_dialog("popup register",userData,"getTopic");
			}
			else
			{	


				GLOBALS[10] = userData.user.screenName;
				this.publish("user.loggedIn",userData);
				if($('.popup').hasClass('copy-register'))
					$('.popup').removeClass('copy-register');
				this.CopyToSiteContent.find("#copyToSiteRegistration").hide();
				this.CopyToSiteContent.find("#loaderimage").show();
				var sitesListObj = userData.sites;
				var cSites = sitesListObj.length;
                 if(flag){
                    $(".blockOverlay").hide();
                    $(".popup").hide();
                   // CCL.Models.Topic.wejitAuthorize({email_id:})
                    /*var wejitUrl = ccl.bundle.copyToWejitURL+'&cclTopicId='+GLOBALS[6]; */
                    /*var wejitUrl="9d841e1435da4dd1069ea79bbae2eabb";
                    var oWin = window.open("http://localhost/wejit/#!"+wejitUrl,'_blank');*/
                    this.copyToWejit();
                }    
                else{
    				if(cSites == 0){
    					this.CopyToSiteContent.find("#loaderimage").hide();
    					this.CopyToSiteContent.find("#createSiteNow").show();
    				}
    				else if(cSites > 1){
    					var siteList = "";
    					siteList += '<select class="select-sites" id="copySites">';
    					
    					var siteNameObj = null;
    					for(var i = 0; i < cSites; i++){
    						siteNameObj = sitesListObj[i];
    					    siteList += '<option id="'+siteNameObj.siteId+'" value="'+siteNameObj.publishUrl+'">'+siteNameObj.siteName+'</option>';
    					}
    					siteList += '</select>';
    					this.CopyToSiteContent.find("#siteDropDown").html(siteList);
    					this.CopyToSiteContent.find("#selectSite").show();
    					this.CopyToSiteContent.find("#loaderimage").hide();
    				}
    				else{
    					GLOBALS[7] = sitesListObj[0].siteId;
    					GLOBALS[2] = sitesListObj[0].siteName;
    			    	GLOBALS[3] = sitesListObj[0].publishUrl;
    					CCL.Models.Topic.checkIfTopicDownloaded({publish_url:ccl.utils.urlEncode(GLOBALS[3]),ccl_topic_id:GLOBALS[6]}, this.callback('copytopicsuccess'), this.callback('error'));
    				}
                }
			}
			
    	}else{
    		this.hideSignInFormProcessing();
    		if(statusObj.errorCode == "DS3012"){
                if(!flag)
    			     jQuery("#userName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
                 else
                    jQuery("#wejitUserName").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
            }
            if(statusObj.errorCode == "DS3013"){
                if(!flag)
    			     jQuery("#password").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
                 else
                    jQuery("#wejitPassword").validationEngine('showPrompt', statusObj.errorMessage, 'error', 'topRight', true);
            }
    	}
    }    
    , getThisTopic : function (userData){
    	var sitesListObj = userData.sites;
		var cSites = sitesListObj.length;
		if(cSites == 0){
			this.CopyToSiteContent.find("#createSiteNow").show();
		}
		else if(cSites > 1){
			var siteList = "";
			siteList += '<select class="select-sites" id="copySites">';
			
			var siteNameObj = null;
			for(var i = 0; i < cSites; i++){
				siteNameObj = sitesListObj[i];
			    siteList += '<option id="'+siteNameObj.siteId+'" value="'+siteNameObj.publishUrl+'">'+siteNameObj.siteName+'</option>';
			}
			siteList += '</select>';
			this.CopyToSiteContent.find("#siteDropDown").html(siteList);
			this.CopyToSiteContent.find("#selectSite").show();
		}
		else{
			GLOBALS[7] = sitesListObj[0].siteId;
			GLOBALS[2] = sitesListObj[0].siteName;
	    	GLOBALS[3] = sitesListObj[0].publishUrl;
			CCL.Models.Topic.checkIfTopicDownloaded({publish_url:ccl.utils.urlEncode(GLOBALS[3]),ccl_topic_id:GLOBALS[6]}, this.callback('copytopicsuccess'), this.callback('error'));
		}
	}
    , error: function(errorObj){
    	/*steal.dev.log("Oops! SERVER ERROR " + errorObj.toString());*/
    }
	, showForgotFormProcessing: function(){
		$('#backtoLogin').hide();
		$('#submitButton').css('margin-left', '117px');
		$('#submitButton').css('float', 'left');
		$('#forgotPasswordFormClass .spinnerContainer').css('float', 'left');
		$('#forgotPasswordFormClass .spinnerContainer').show();
		$('#submitButton').attr('disabled', true);
	}
	, hideForgotFormProcessing: function(){
		$('#backtoLogin').show();
		$('#submitButton').css('margin-left', '152px');
		$('#forgotPasswordFormClass .spinnerContainer').hide();
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
	, showDeleteTopicProcessing: function(){
		$('#deleteTopic .spinnerContainer').css('float', 'left');
		$('#deleteTopic .spinnerContainer').css('margin-left', '70px');
		$('#deleteTopic .spinnerContainer').show();
		$('#deleteTopicButton').attr('disabled', true);
	}
	, hideDeleteTopicProcessing: function(){
		$('#deleteTopic .spinnerContainer').hide();
		$('#deleteTopicButton').attr('disabled', false);
	}
	, showCopyTopicProcessing: function(){
		$('#selectSite .spinnerContainer').css('float', 'right');
		$('#selectSite .spinnerContainer').css('margin-left', '0px');
		$('#selectSite .spinnerContainer').show();
		$('#copyToSiteButton').attr('disabled', true);
	}
	, hideCopyTopicProcessing: function(){
		$('#selectSite .spinnerContainer').hide();
		$('#copyToSiteButton').attr('disabled', false);
	}
	, showCopyTopicAgainProcessing: function(){
		$('#alreadyCopied .spinnerContainer').css('float', 'left');
		$('#alreadyCopied .spinnerContainer').css('margin-left', '70px');
		$('#alreadyCopied .spinnerContainer').show();
		$('#copyTopicAgain').attr('disabled', true);
	}
	, hideCopyTopicAgainProcessing: function(){
		$('#alreadyCopied .spinnerContainer').hide();
		$('#copyTopicAgain').attr('disabled', false);
	}
    
    , wejitSuccessResponse : function(successCallback, serverResponse,status, xhr) {
        var statusObj = {};
        if(serverResponse){
            var responseObj = serverResponse.response || {};
            var resultObj = responseObj.result;
            if (status == "success" && responseObj) {
                console.log(responseObj);
                successCallback.call(this, statusObj, resultObj);
            } else {
                statusObj.success = false;
                statusObj.errorCode = "-1";
                statusObj.errorMessage = "Service Name: "
                                        + responseNodeName 
                                        + ", Unknown Error!";
            }
        }else{
            statusObj.success = false;
            statusObj.errorCode = "-1";
            statusObj.errorMessage = "Unknown Server Error!";
            successCallback.call(this, statusObj, null);
        }
    }
    , copyToWejit: function(){
        $.ajax({
           type: 'POST',
            //url : 'http://192.168.200.149:8080/classroom/api/wejit/downloadTopicFromCCL?cclTopicId='+GLOBALS[6]+'&emailId='+GLOBALS[12],
            url : 'http://192.168.200.149:8080/classroom/api/wejit/downloadTopicFromCCL?cclTopicId=15040&emailId=spyla@innominds.com',
            async : true,
            crossDomain: true,
            success : function(response) {
                console.log(response);
               // var response = '{"response":{"stat":"ok","result":{"topic_id":"30861","site_id":"15135","wejit_url":"5603fe9331cdd2544e170fe19448c474"}}}';

              var objResponse = eval("(" + JSON.stringify(response) + ")");
                console.log(objResponse.response.result.site_id);
                var combinedToken= objResponse.response.result.site_id+"-"+"spyla@innominds.com";
                var encodedValue=ccl.Base64.encode(combinedToken);
               // this.wejitAutoLogin(encodedValue);
                console.log(encodedValue);
                 var oWin = window.open("http://collaborizeinfrastructure4.com/?userToken="+encodedValue+"#!"+objResponse.response.result.wejit_url,'_blank');
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.status);
                console.log(jqXHR.responseText);
            }
        });
       
        console.log("inside copyToWejit ")
    }


       /* oWejitResp = ccl.bundle.copyToWejitURL+"wejit/downloadTopicFromCCL"+'&emailId='+GLOBALS[12]+'&cclTopicId='+GLOBALS[6]; 
        console.log(oWejitResp);*/
//                var oWin = window.open(CollaborizeUrl,'_blank');


    , wejitAutoLogin : function(userToken){
       
    }
});
