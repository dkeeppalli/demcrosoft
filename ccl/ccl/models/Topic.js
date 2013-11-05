$.Model.extend('CCL.Models.Topic',
/* @Static */
{
	getTopics : function(topicCriteria, successCallback, errorCallback){
		topicCriteria = topicCriteria || {};
		var serviceObj = {};
		serviceObj.serviceName = topicCriteria.serviceName || "search";
		serviceObj.params = {criteria:{}};
		var criteria = serviceObj.params.criteria;
		criteria.filters = [{filter:{
									type:topicCriteria.type
								,	value:topicCriteria.value
							}}];
		criteria.sort = [{sortBy:{
									type:topicCriteria.sortType
								,	value:topicCriteria.sortValue
							}}];
		criteria.searchOn = topicCriteria.searchOn;
		
		if(topicCriteria.hasOwnProperty("count") && topicCriteria.hasOwnProperty("start")){	
			criteria.max = topicCriteria.count;
			criteria.start = topicCriteria.start;
		}
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, getPreviousNextTopicDetails : function(topicCriteria, successCallback, errorCallback){
		topicCriteria = topicCriteria || {};
		var serviceObj = {};
		serviceObj.serviceName = "previousNext";
		serviceObj.params = {criteria:{}};
		var criteria = serviceObj.params.criteria;
		criteria.filters = [{filter:{
									type:topicCriteria.type
								,	value:topicCriteria.value
							}}
							, {filter:{
									type:topicCriteria.breadCrumbType
								,	value:ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(topicCriteria.breadCrumbValue))
							}}
							];
		criteria.sort = [{sortBy:{
									type:topicCriteria.sortType
								,	value:topicCriteria.sortValue
							}}];
		
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, getSearchResults : function(searchCriteria, successCallback, errorCallback){
		searchCriteria = searchCriteria || {};
		var serviceObj = {};
		serviceObj.serviceName = searchCriteria.serviceName || "search";
		serviceObj.params = {criteria:{}};
		var criteria = serviceObj.params.criteria;
		criteria.filters = [{filter:{
									type:searchCriteria.type
								,	value:searchCriteria.value
							}}];
		criteria.sort = [{sortBy:{
									type:searchCriteria.sortType
								,	value:searchCriteria.sortValue
							}}];
		criteria.searchOn = searchCriteria.searchOn;
		
		if(searchCriteria.hasOwnProperty("count") && searchCriteria.hasOwnProperty("start")){	
			criteria.max = searchCriteria.count;
			criteria.start = searchCriteria.start;
		}
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}

	, checkIfTopicDownloaded : function(criteriaObj, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.serviceName = "checkIfTopicDownloaded";
		serviceObj.params = criteriaObj;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, checkValidTopicType : function(criteriaObj, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.serviceName = "checkValidTopicType";
		serviceObj.params = criteriaObj;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, getTopicDetails : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.serviceName = "topicdetail";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, saveGradesList : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "post";
		serviceObj.serviceName = "editGrades";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, saveSubjectsList : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "post";
		serviceObj.serviceName = "editSubjects";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, saveAuthorNotes : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "post";
		serviceObj.serviceName = "editAuthorNotes";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, shareTopic : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "post";
		serviceObj.serviceName = "topicShare";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, deleteTopic : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "delete";
		serviceObj.serviceName = "deleteTopic";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, addTagsList : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "post";
		serviceObj.serviceName = "addTags";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, deleteTagsList : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "delete";
		serviceObj.serviceName = "deleteTags";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, getTags : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "get";
		serviceObj.serviceName = "getTags";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, getTopRatedTopics : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.fixture = true;
		serviceObj.serviceName = "topRatedList";
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	/*, getCommentsList : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		//serviceObj.params = criteria;
		serviceObj.fixture = true;
		serviceObj.serviceName = "commentsList";
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}*/
	/*, postUserComment : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		//serviceObj.params = criteria;
		serviceObj.fixture = true;
		serviceObj.serviceName = "postComment";
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}*/
	, postUserComment : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.params = criteria;
		serviceObj.type = "post";
		serviceObj.serviceName = "postComment";
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	
	, getCommentsList : function(commentsCriteria, successCallback, errorCallback){
		commentsCriteria = commentsCriteria || {};
		var serviceObj = {};
		serviceObj.type = "get";
		serviceObj.serviceName = "getComment";
		serviceObj.params = {criteria:{}};
		var criteria = serviceObj.params.criteria;
		criteria.filters = [{filter:{
									type:commentsCriteria.type
								,	value:commentsCriteria.value
							}}];
		criteria.sort = [{sortBy:{
									type:commentsCriteria.sortType
								,	value:commentsCriteria.sortValue
							}}];
		if(commentsCriteria.hasOwnProperty("count") && commentsCriteria.hasOwnProperty("start")){	
			criteria.max = commentsCriteria.count;
			criteria.start = commentsCriteria.start;
		}
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, rateTopic : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "post";
		serviceObj.serviceName = "topicsRate";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	, deleteRateTopic : function(criteria, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.type = "delete";
		serviceObj.serviceName = "deleteTopicRating";
		serviceObj.params = criteria;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
	
},

/* @Prototype */
{});