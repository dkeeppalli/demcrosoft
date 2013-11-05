$.Model.extend( 'CCL.Models.Usertag',
/* @Static */
{
	findAll: function(criteriaObj, successCallback, errorCallback){
		var serviceObj = {};
		serviceObj.serviceName = "tags";
		serviceObj.params = criteriaObj;
		CCL.Models.DataService.sendRequest(serviceObj, successCallback , errorCallback);
	}
},
/* @Prototype */
{} );