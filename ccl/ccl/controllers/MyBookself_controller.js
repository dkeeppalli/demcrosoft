$.Controller.extend("CCL.Controllers.MyBookself", {}, {
    init: function () {
		this._ccl_bundle = ccl.bundle;
		this.currentSelectedTab = this.element.find(".tabs > a.active");
		this.contentSection = this.element.find(".contentArea");
		this.getTopics(this.currentSelectedTab.id);
    }
	, ".tabs > a click" : function(el,ev){
		el = $(el);
		var currentId;

		if(el.hasClass("active"))
			return;

		this.currentSelectedTab.removeClass('active');
		currentId = $(this.currentSelectedTab)[0].id;
		$('#'+currentId+'ContentArea').hide();
		this.currentSelectedTab = el;
		this.currentSelectedTab.addClass('active');
		currentId = $(this.currentSelectedTab)[0].id;
		$('#'+currentId+'ContentArea').show();
		
		//this.contentSection.html(this._ccl_bundle.LOADER_HTML);
		this.getTopics(el.id);
	}
	, getTopics :  function (topicType){
		
	}
	, topicsList : function (statusObj, topicsList){
		
	}
	, serverError :  function(errorObj){
    	this.contentSection.text("Oops! SERVER ERROR " + errorObj.toString());
    }
	
});