$.Model
		.extend(
				'CCL.Models.DataService',
				/* @Static */
				{
					baseURL : "/cclibrary/restapi/",
					fixturesURL : {
							editprofile : "fixtures/editprofile.json.get"
						,	topRatedList : "fixtures/topRatedList.json.get"	
						,	commentsList : "fixtures/commentsList.json.get"
						,	postComment : "fixtures/postComment.json.get"
					}
					, serviceURLFragment : {
						search : {
							fragment : "search/topics"
						}
						, tags : {
							fragment : "tags/get"
						}
						, profile : {
							fragment : "profiles/get"
						}
						, editprofile : {
							fragment : "profiles/edit"
						}
						, topicdetail : {
							fragment : "topics/get"
						}
						, checkIfTopicDownloaded :{
							fragment : "topics/checkIfTopicDownloaded"
						}
						, checkValidTopicType :{
							fragment : "topics/checkValidTopicType"
						}
						, editGrades :{
							fragment : "topics/grades/edit"
						}
						, editSubjects:{
							fragment : "topics/subjects/edit"
						}
						, editAuthorNotes:{
							fragment : "topics/authorNotes/edit"
						}
						, loginRequest:{
							fragment : "services/oauth/authorize"
						}
						, saveProfile:{
							fragment : "profiles/create"
						}
						, checkAvailability:{
							fragment : "profiles/checkScreenName"
						}
						, topicShare:{
							fragment : "topics/share"
						}
						, topicDownloadedUsers:{
							fragment : "users/topic/downloaded"
						}
						, deleteTopic:{
							fragment : "topics/delete"
						}
						, editTags:{
							fragment : "topics/tags/edit"
						}
						, getTags : {
							fragment : "tags/search"
						}
						, addTags:{
							fragment : "topics/tags/add"
						}
						, deleteTags:{
							fragment : "topics/tags/delete"
						}
						, getUserToken:{
							fragment : "services/oauth/getAuthToken"
						}
						, getComment:{
							fragment : "comments/get"
						}
						, postComment:{
							fragment : "comments/create"
						}
						, searchAll : {
							fragment : "search/all"
						}
						, searchUsers : {
							fragment : "search/users"
						}
						, topicsRate : {
							fragment : "topics/rate"
						}
						, deleteTopicRating : {
							fragment : "topics/rating/delete"
						}
						, previousNext : {
							fragment : "topics/previousnext"
						}
						
					}
					, sendRequest : function(serviceObj, successCallback, errorCallback) {
						var serviceURLFragmentObj = this.serviceURLFragment[serviceObj.serviceName || ""] || {};
						var sAdditionalParams = serviceObj.additionalParams|| null;
						var aDataExtras = [];
						
						aDataExtras.push("targetUrl="+ this.baseURL + (serviceURLFragmentObj.fragment || ""));
						aDataExtras.push("apiMethodType=" + (serviceObj.type || "get"));
						if(sAdditionalParams)
							aDataExtras.push(sAdditionalParams);
						
						var jsonRequest = JSON.stringify(serviceObj.params || {});
						var ajaxObj = {};
						ajaxObj.url = "ccl/restapi.proxy.php";
						ajaxObj.type = "post";
						ajaxObj.dataType = serviceObj.dataType || "json";
						ajaxObj.data = "jsonRequest=" + jsonRequest + "&" + aDataExtras.join("&");
						ajaxObj.success = this.callback("processResponse",successCallback);
						ajaxObj.error = errorCallback;
						if (serviceObj.fixture) {
							ajaxObj.fixture = g_sAppInstallDir
									+ this.fixturesURL[serviceObj.serviceName];
						}
						$.ajax(ajaxObj);
						/*tracePage*/
						this.trackAnalytics(serviceObj.serviceName);
					}
					, processResponse : function(successCallback, serverResponse,status, xhr) {
						var statusObj = {};
						if(serverResponse){
							var responseObj = serverResponse.response || {};
							var resultObj = responseObj.result;
							if (status == "success" && responseObj) {
	
								if (responseObj.hasOwnProperty('stat')) {
									statusObj.success = (responseObj.stat == "ok") ? true : false;
									if (!statusObj.success) {
										statusObj.errorCode = responseObj.err_code || "-3";
										statusObj.errorMessage = responseObj.err_msg || "missing info!";
									}
								} else {
									statusObj.success = false;
									statusObj.errorCode = "-2";
									statusObj.errorMessage = "Service Name: "
															+ responseNodeName
															+ ", {stat Object} Missing!";
								}
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
					},
					trackAnalytics:function(context){
						window._gat && window._gat._getTracker && GOOGLE_ANALYTICS_TRACKER_ID && _gat._getTracker(GOOGLE_ANALYTICS_TRACKER_ID)._trackPageview("/ccl/services/"+context);
					}
				},
				/* @Prototype */
				{});
