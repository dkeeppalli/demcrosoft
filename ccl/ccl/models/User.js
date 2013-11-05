$.Model.extend( 'CCL.Models.User',
/* @Static */
{
	getProfile: function(criteriaObj, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.serviceName = "profile";
		serviceObj.params = criteriaObj;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, saveProfileEdits : function(criteriaObj, successCallback, errorCallback){
		var serviceObj = {};
		var aAdditionalParams = [];
		serviceObj.serviceName = "editprofile";
		aAdditionalParams.push("task=profileUpdate");
		aAdditionalParams.push("screen_name="+criteriaObj.screenName);
		serviceObj.additionalParams = aAdditionalParams.join("&");
		
	    serviceObj.params = {first_name : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.profileFirstName))
				,last_name : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.profileLastName))
				,updated_emailId : ccl.utils.urlEncode(criteriaObj.profileEmail)
				,password : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.newPassword))
				,old_password : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.oldPassword))
				,screen_name : ccl.utils.urlEncode(criteriaObj.screenName)
				,school : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.schoolName))
				,role : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.role))
				,location : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.location))
				,website_url : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.websiteUrl))
	    };
	    
		serviceObj.type = "post";
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, saveProfile: function(criteriaObj, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.serviceName = "saveProfile";
		serviceObj.params = {screen_name : ccl.utils.urlEncode(criteriaObj.screen_name)
							,school : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.school))
							,role : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.role))
							,location : ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(criteriaObj.location))
							,website_url : ""
							,first_name : ccl.utils.urlEncode(criteriaObj.first_name)
							,last_name : ccl.utils.urlEncode(criteriaObj.last_name)
							,email_id : ccl.utils.urlEncode(criteriaObj.email_id)
		};
		serviceObj.type = "post";
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, checkAvailability: function(criteriaObj, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.serviceName = "checkAvailability";
		serviceObj.params = criteriaObj;
		serviceObj.type = "get";
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, login: function ( params, successCallback , errorCallback )
	{

		var serviceObj = {};
	    var aAdditionalParams = [];
	    aAdditionalParams.push("emailId="+ccl.utils.urlEncode(params.userDetails.username));
	    aAdditionalParams.push("password="+params.userDetails.password);
	    aAdditionalParams.push("siteType="+params.userDetails.siteType)
	    aAdditionalParams.push("task=login");
	    serviceObj.type = "post";
		serviceObj.serviceName = "loginRequest";
	    serviceObj.additionalParams = aAdditionalParams.join("&");
	    
	    CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	    
	}
	, logOut:function(successCallback , errorCallback){
		var serviceObj = {};
		serviceObj.serviceName = "logoutRequest";
		var sAdditionalParams = "task=logout";
	    serviceObj.additionalParams = sAdditionalParams;
	    
	    CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, registration: function ( params, successCallback , errorCallback )
	{
		var serviceObj = {};
	    var aAdditionalParams = [];
	    aAdditionalParams.push("userToken="+ccl.utils.urlEncode(params.userToken));
	    aAdditionalParams.push("task=login");
	    serviceObj.type = "post";
	    serviceObj.additionalParams = aAdditionalParams.join("&");
	    CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, getUsers : function(countCriteria, successCallback, errorCallback){
		countCriteria = countCriteria || {};
		var serviceObj = {};
		serviceObj.type = "get";
		serviceObj.serviceName = "topicDownloadedUsers";
		serviceObj.params = {criteria:{}};
		var criteria = serviceObj.params.criteria;
		criteria.filters = [{filter:{
									type:countCriteria.type
								,	value:countCriteria.value
							}}];
		criteria.sort = [{sortBy:{
									type:countCriteria.sortType
								,	value:countCriteria.sortValue
							}}];
		if(countCriteria.hasOwnProperty("count") && countCriteria.hasOwnProperty("start")){	
			criteria.max = countCriteria.count;
			criteria.start = countCriteria.start;
		}
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, copyToSiteLogin: function ( params, successCallback , errorCallback )
	{
		var serviceObj = {};
	    var aAdditionalParams = [];
	    aAdditionalParams.push("emailId="+ccl.utils.urlEncode(params.userDetails.username));
	    aAdditionalParams.push("password="+params.userDetails.password);
	    aAdditionalParams.push("task=login");
	    aAdditionalParams.push("rememberAction=getTopic");
	    serviceObj.type = "post";
		serviceObj.serviceName = "loginRequest";
	    serviceObj.additionalParams = aAdditionalParams.join("&");
	    
	    CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, clearRememberAction: function ( params, successCallback , errorCallback )
	{
		var serviceObj = {};
		var sAdditionalParams = "task=clearRememberAction";
	    serviceObj.additionalParams = sAdditionalParams;
	    
	    CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, getUserToken : function(params, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "post";
		var sAdditionalParams = "site="+params;
	    serviceObj.additionalParams = sAdditionalParams;
		serviceObj.serviceName = "getUserToken";
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, forgotPassword : function(params, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "post";
		var aAdditionalParams = [];
		aAdditionalParams.push("emailId="+ccl.utils.urlEncode(params));
	    aAdditionalParams.push("task=forgotpassword");
	    serviceObj.additionalParams = aAdditionalParams.join("&");
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
},
/* @Prototype */
{} );