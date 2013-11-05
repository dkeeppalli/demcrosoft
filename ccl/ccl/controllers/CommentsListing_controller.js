$.Controller.extend("CCL.Controllers.CommentsListing", {}, {
    init: function () {
		this.sAppInstallDir = g_sAppInstallDir;
        this.loggedInUserInfo = this.options.user;
		this._ccl_bundle = ccl.bundle;
		this._cclUtils = ccl.utils;
		this.showCommentsListLoader();
		this.sDefaultSortType = this._ccl_bundle.commentsSortOptions.defaultOption;
		this.sortOptionsSelectKey = this.sDefaultSortType;
		var criteriaObj = {};		
		
		criteriaObj.type = "ccl_topic_id"; 
		criteriaObj.value = this.options.topicOptions.id;
		criteriaObj.sortType = "date_added";
		criteriaObj.sortValue = "desc";
		
		
		this.beFirstToComment;
		
		CCL.Models.Topic.getCommentsList(criteriaObj
										 , this.callback('loadCommentsPage')
										 , this.callback('error'));
		
		/* The div which holds all the comments... (commentslist.ejs) */
		this.commentsListContainer;
		this.aCommentsList = [];
		this.commentPostingObj;
		this.postingCommnetLoader;
		this.commentSubmitButton;
		this.myCommentTextarea;
    }
	, error: function(errorObj){
    	this._cclUtils.removeLoaderCSS(this.element);
    	this.element.text("Oops! SERVER ERROR " + errorObj.toString());
    }
	, showCommentsListLoader : function(){ 
		this.element.html(this._ccl_bundle.COMMENTS_LOADER_HTML);
	}
	, loadCommentsPage : function (statusObj, commetsListObj) {
		if(!this.element)
		return;
		
		if(statusObj.success){
    		
			this.aCommentsList = commetsListObj.comments;
			this.element.html(this.view(this.sAppInstallDir 
											+ 'views/topics/commentsMainSection'
											, { commentsDetails: commetsListObj,
												userObj: this.loggedInUserInfo,
												sortOptionsObj : this._ccl_bundle.commentsSortOptions.options,
												sortOptionsSelectKey : this.sDefaultSortType
											  }
											));
			this.commentsListContainer = this.element.find("#commentsListContainer");
			this.postingCommnetLoader = this.element.find("#postingCommnetLoader");
			this.commentSubmitButton = this.element.find("#commentSubmitButton");
			this.myCommentTextarea = this.element.find("#myCommentTextarea");
			this.comment_sort_dropdown = this.element.find("#comment_sort_dropdown");

			this.beFirstToComment = this.element.find('#comment_be_first');
			
			// attaching the waterMark plugin to the myCommentTextArea
			if( this.myCommentTextarea ){
				this.watermarkComment();
			}
    	}else{
    		this.element.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    }
	, postCommentCallback : function (statusObj, postCommentRespObj) {
		if(statusObj.success){
			if(this.sortOptionsSelectKey == "date_asc")
				this.aCommentsList.push(this.commentPostingObj);
			
			else if(this.sortOptionsSelectKey == "date_desc")
				this.aCommentsList.splice(0,0,this.commentPostingObj);
			
			//this.sortCommentsListArray(sortOptionsSelectKey);
			this.loadCommentsListContainer(this.sortOptionsSelectKey);
			this.beFirstToComment.hide();
			this.commentSubmitButton.attr('disabled', false);
			this.myCommentTextarea.attr('disabled', false).val('');
			this.watermarkComment();
			
			// publish the comments count ...
			this.publish("commentPosted", this.aCommentsList.length);
    	}else{
    		this.commentsListContainer.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
		this.postingCommnetLoader.hide();
    }
	, loadCommentsListContainer : function(sortOptionsSelectKey){
		this.commentsListContainer.html(this.view(this.sAppInstallDir 
											+ 'views/topics/commentsList'
											, { commentsDetails: this.aCommentsList,
												sortOptionsObj : this._ccl_bundle.commentsSortOptions.options,
												sortOptionsSelectKey : sortOptionsSelectKey
											  }
											));
	}
	, "a.linkToSignIn click": function (el, ev) {
        ev.preventDefault();
        el.ccl_sign_in_modal_dialog("popup");
    }
	, "#commentSubmitButton click": function (el, ev) {
		
		if( this.myCommentTextarea.hasClass("hint") ){
			this._cclUtils.alert(this._ccl_bundle.label.enterComments);
			this.myCommentTextarea.focus();
		}else{
			this.commentSubmitButton.attr('disabled', true);
			this.myCommentTextarea.attr('disabled', true);
			this.commentPostingObj = {
				"comment":{
							"comment_text": this.myCommentTextarea.val()
						  , "comment_author": 
						  	{
								"screen_name"		: this.loggedInUserInfo.screenName,
								"first_last_name"	: this.loggedInUserInfo.firstName+' '+this.loggedInUserInfo.lastName, 
								"large_image_url"	: this.loggedInUserInfo.gravatorUrl
							}
						  ,	"comment_created_date": this._cclUtils.presentDate()
				
						  }
		    };
			
			this.postingCommnetLoader.show();
			CCL.Models.Topic.postUserComment(	{
													"ccl_topic_id":this.options.topicOptions.id
												,	"comment_text":ccl.utils.escapePreDefinedCharactersForComments(ccl.utils.urlEncode(this.myCommentTextarea.val()))
												}
											 	, this.callback('postCommentCallback')
											 	, this.callback('error')
											 );
			
		}
	}
	, "#comment_sort_dropdown change" : function(el, ev){
		this.aCommentsList.reverse();
		this.sortOptionsSelectKey = el.val();
		this.loadCommentsListContainer( el.val() );
		
	}
	, sortCommentsListArray : function( optionSelected ){
		if(optionSelected == 'date_asc')
			this.aCommentsList.sort(this.sortCommentsByDateAsc);
		if(optionSelected == 'date_desc')
			this.aCommentsList.sort(this.sortCommentsByDateDesc);
	}
	, sortCommentsByDateAsc : function(a, b) {
		var x = a.comment.comment_created_date.toLowerCase();
		var y = b.comment.comment_created_date.toLowerCase();
		return x < y ? 1 : x > y ? -1 : 0;
	}
	, sortCommentsByDateDesc : function(a, b) {
		var x = a.comment.comment_created_date.toLowerCase();
		var y = b.comment.comment_created_date.toLowerCase();
		return x < y ? -1 : x > y ? 1 : 0;
	}
	, watermarkComment : function(){
		this.myCommentTextarea.waterMark( 
											{ 	"waterMarkClass": "hint",
												"waterMarkText" : "Enter your comment here"
											} 
										);
	}
});