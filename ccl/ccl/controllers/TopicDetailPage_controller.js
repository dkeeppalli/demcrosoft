$.Controller.extend("CCL.Controllers.TopicDetailPage", {}, {
    init: function () {
        this.sAppInstallDir = g_sAppInstallDir;
        this.loggedInUserInfo = this.options.user;
        this.topicOptionsObj = this.options.topicOptions;
        CCL.Models.Topic.getTopicDetails({"ccl_topic_id":this.topicOptionsObj.id}
										, this.callback('topicData')
										, this.callback('error'));
        this.subjectsList;
        this.gradsList;
        this.authorTxt;
        this.topicDetails;  
        this.hintClass = "hint";
        var tagInputBox, tagInputBoxText; 
		this.arrayTags = [""];
		this.index = 0; 
		this.tagsGhostText ="";
		this.savingStarted = false;
        this.aTags = [];
		this.savedTags = []
        this.topicPreviewHovered = false;
        this._cclUtils = ccl.utils;
        this.isPublicTopics = true;
        this.userRatingValue = 0;
        this.ratingTopic;
        this.userRating;
        this.changeFlag = true;
        // span element to hold the comments count and will be updated when a new comment is posted..
		this.totalCommentsCountMetaData;
		this.previousNextDiv = "";
		this.previousBookmark = this.options.topicOptions.previousBookmark;
		this.breadCrumbType;
		this.breadCrumbValue;
		
    }
	, userTagsSuccess: function (statusObj,usertags) {
	    if(statusObj.success){
	    	cTags = usertags.tags.length;
	    	var userTagObj =  null;
	    	for(var t= 0; t < cTags; t++){
	    		userTagObj =  usertags.tags[t];
	    		this.aTags.push({tag:userTagObj,freq:"1"});
	    	}
	    }else{
			this.element.text("Oops! Error Message:" + statusObj.errorMessage);
		}
	}
	, userTagserror: function(errorObj){
		this.element.text("Oops! SERVER ERROR " + errorObj.toString());
	}
	, ".copyButtonLarge click": function (el, ev) {
   		sourceObj = el;
   		if($(ev.target).text() == "Copy to My Site"){
    		var sitesListObj = sitesObj;
			var cSites = sitesListObj.length;
			GLOBALS[6] = $(el)[0].id;
			GLOBALS[4] = $(el)[0].name;
			GLOBALS[7] = sitesListObj[0].siteId;
			GLOBALS[2] = sitesListObj[0].siteName;
			GLOBALS[3] = sitesListObj[0].publishUrl;
			if(cSites == 1){
				CCL.Models.Topic.checkIfTopicDownloaded({publish_url:ccl.utils.urlEncode(GLOBALS[3]),ccl_topic_id:GLOBALS[6]}, this.callback('copytopicsuccess'), this.callback('error'));
			}else{
				el.ccl_copy_to_site("popup");
    			//$("#selectSite").show();
    			$("#loggedLinkPopUp").show();
			}
    	}else if(GLOBALS[10] == ""){
    		
    		el.ccl_copy_to_site("popup copy-register");
    		$("#linkPopUp").show();
    		//$("#copyToSiteRegistration").show();
    	}else{
    		el.ccl_copy_to_site("popup");
    		$("#createSiteNow").show();
    	}
    }
   	, copytopicsuccess: function (statusObj,copyDetails) {

        if(statusObj.success){
        	
        	CCL.Models.Topic.checkValidTopicType({site_id:GLOBALS[7],topic_type:GLOBALS[4]}, this.callback('copytopicagainsuccess'), this.callback('error'));
    	}else{
    		sourceObj.ccl_copy_to_site("popup");
    		$("#alreadyCopied").show();
    	}
    }
   	, copytopicagainsuccess: function (statusObj,userToken) {
		if(statusObj.success){
			var CollaborizeUrl = ccl.bundle.copyToSiteURL+userToken.userToken+'&publishUrl='+GLOBALS[3]+'&cclTopicId='+GLOBALS[6]; 
			var oWin = window.open(CollaborizeUrl,'_blank');
			window.setTimeout(function () {
											if (oWin == null || typeof(oWin)=="undefined" || (oWin!=null && oWin.outerHeight == 0)) {
												sourceObj.ccl_copy_to_site("popup");
												$("#alreadyCopied").hide();
												$("#selectSite").hide();
												$("#popupBlocker").show();
											} else {
												return;
											}
							}, 100);
    	}else{
    		sourceObj.ccl_copy_to_site("popup");
    		$("#cannotCopied").show();
    		$("#siteName").text(GLOBALS[2]);
    		$(".disableTopicType").text(ccl.bundle.disableCopyText[GLOBALS[4]]);
    	}
    }
    /*, ".linkToWeJit click": function (el, ev) {
    	alert(0);
    }*/
	, ".loggedInCopyButtonLarge click": function (el, ev) {
		sourceObj = el;
    	var sitesListObj = sitesObj;
		var cSites = sitesListObj.length;
		GLOBALS[6] = $(el)[0].id;
		GLOBALS[4] = $(el)[0].name;
		GLOBALS[7] = sitesListObj[0].siteId;
		GLOBALS[2] = sitesListObj[0].siteName;
		GLOBALS[3] = sitesListObj[0].publishUrl;
		if(cSites == 1){
			CCL.Models.Topic.checkIfTopicDownloaded({publish_url:ccl.utils.urlEncode(GLOBALS[3]),ccl_topic_id:GLOBALS[6]}, this.callback('copytopicsuccess'), this.callback('error'));
		}else{
			el.ccl_copy_to_site("popup");
			$("#selectSite").show();
		}
	}
	, ".topicAction click": function (el, ev) {
		$(".copySiteDropDownLarge").hide();
		if($(ev.target).text() == "Share Topic"){
			CCL.Models.Topic.getTopicDetails({"ccl_topic_id":$(ev.target)[0].id}
			, this.callback('topicDetailsData')
			, this.callback('error'));
			sourceObj = el;
		} else{
			el.ccl_copy_to_site("popup");
			$("#deleteTopic").show();
		}
	}
	, topicDetailsData : function (statusObj, topicDetails) {
		if(statusObj.success){
			window.scrollTo(0,0);
    		sourceObj.ccl_share_topic("popup copy-register",topicDetails);
		}else{
			this.element.text("Oops! Error Message:" + statusObj.errorMessage);
		}
	}
	, ".dropDownButtonLarge click": function (el, ev) {
		$(ev.target).next().find('ul').slideToggle();
    }
	, ".dropDownButtonLarge blur": function (el, ev) {
		$(ev.target).next().find('ul').slideUp();
    }
	, previousNextTopicDetails : function (statusObj, previousNextTopicDetails) {
    	
    	if(statusObj.success){
			this.previousNextDiv.show();
    		this.previousNextDiv.html(this.view(this.sAppInstallDir 
					+ 'views/topics/previousNext'
					, { previousNextTopicOptionsObj : previousNextTopicDetails }
					));
    	}else{
    		//this.element.text("Oops! Error Message:" + statusObj.errorMessage);
		}
    }
	, previousNextError: function(errorObj){
		//this.element.text("Oops! SERVER ERROR " + errorObj.toString());
	}
	, previousNext : function(){
		this.previousNextDiv.hide();
		var criteriaObj = {};
		var navigationFrom = (this.previousBookmark.from || "").split("/")[0];
		var navigationFor = (this.previousBookmark.from || "").split("/")[1];
		if(navigationFrom == null || navigationFrom == "topicdetail" || navigationFrom == undefined || navigationFrom == "" || navigationFrom == 'screen_name' || navigationFrom == 'userslist' ){
			this.breadCrumbType = "screen_name";
			this.breadCrumbValue = this.topicDetails.topic_author.screen_name;
		}else if(navigationFrom == "downloaded" || navigationFrom == "shared" || navigationFrom == "rated"){
			this.breadCrumbType = ccl.utils.breadCrumbType(navigationFrom);
			this.breadCrumbValue = true;
		}else if(navigationFrom == "search"){
			this.breadCrumbType = "search_topics";
			this.breadCrumbValue = this.previousBookmark.value;
		}else{
			this.breadCrumbType = (navigationFrom == "types" ? ccl.utils.breadCrumbType(navigationFrom) : navigationFrom);
			this.breadCrumbValue = this.previousBookmark.value;
		}
		criteriaObj.type = "ccl_topic_id";
		criteriaObj.value = this.topicOptionsObj.id;
		criteriaObj.breadCrumbType = this.breadCrumbType;
		criteriaObj.breadCrumbValue = this.breadCrumbValue;
		criteriaObj.sortType = this.previousBookmark.sortType || "date_added";
		criteriaObj.sortValue = this.previousBookmark.sortValue  || "desc";
		if(this.topicDetails.topic_status_id != "2"){
	        CCL.Models.Topic.getPreviousNextTopicDetails(criteriaObj
															, this.callback('previousNextTopicDetails')
															, this.callback('previousNextError')
														);
		}
	}
	, 'a.previousNextLinks click' : function(){
		CCL.Controllers.PagesHolder.previousBookmark = CCL.Controllers.PagesHolder.makeBookmark(this.previousBookmark.from, this.breadCrumbValue, this.previousBookmark.sortType, this.previousBookmark.sortValue); 
	}
    , topicData : function (statusObj, topicDetails) {
    	this._cclUtils.removeLoaderCSS(this.element);
    	
    	if(!this.element){
			return;		
		}
    	
    	if(statusObj.success){
    		
    		this.topicDetails = topicDetails;
    		if(this.loggedInUserInfo && (this.loggedInUserInfo.screenName == topicDetails.topic_author.screen_name)){
            	CCL.Models.Topic.getTags({"search":""},this.callback('userTagsSuccess'), this.callback('userTagserror'));
            }
    		if(topicDetails.topic_status_id == "2"){
    			CCL.Models.User.getProfile({screen_name:ccl.utils.urlEncode(topicDetails.topic_author.screen_name)}
											, this.callback('getPublicTopics')
											, this.callback('profileError')
											);
    		}
    		
    		else{
				this.element.html(this.view(this.sAppInstallDir 
											+ 'views/topics/topicdetail'
											, { topicDetails: topicDetails
												, additionalInfo: {
													loggedInUser: (this.loggedInUserInfo)?this.loggedInUserInfo.screenName:""
												  , publicTopics : this.isPublicTopics
												  , topicOptionsObj : this.topicOptionsObj
												}
											  }
											));
				/* For loading the comments section, attach CommentsListing_controller */
				this.previousNextDiv = this.element.find("#previousNextDiv");
				this.previousNext();
				this.element.find("#commentsPageContainer").ccl_comments_listing({topicOptions:this.topicOptionsObj, user:this.loggedInUserInfo});
				this.totalCommentsCountMetaData = this.element.find('#totalCommentsCountMetaData');
    		}
    		
			GLOBALS[15] = topicDetails.attachment_type;
			GLOBALS[16] = topicDetails.attachment_details;
			this.imageAttachment();
			this.subjectsList = this.element.find("#subjectsList");
			this.gradsList = this.element.find("#gradesList");
			this.authorTxt = this.element.find("#authorData");
			this.tagsList = this.element.find("#tagsList");
			this.userRating = this.element.find('.userStar');
			this.avgRating = this.element.find('.avgStar');
			this.changeLink = this.element.find('.changeLink');
			this.avgUserRatingDiv = this.element.find('#avgUserRatingDiv');
			this.ratingsCountSpan = this.element.find('#ratingsCountSpan');
			this.ratingsCount = this.element.find('#ratingsCount');
			this.ratingCountValue = this.ratingsCount.html();
			this.noRatingYet = this.element.find('#noRatingYet');
			this.yourRatingTitle = this.element.find('#yourRatingTitle');
			this.RateTopicTitle = this.element.find('#RateTopicTitle');
			
			if(topicDetails.user_rating){
				this.userRating.rating().rating('select',(topicDetails.user_rating-0)-1).rating('readOnly');
				this.changeFlag = false;
			}else{
				this.userRating.rating();
				this.changeFlag = true;
			}
			if(topicDetails.avg_rating)
				this.avgRating.rating().rating('select',(topicDetails.avg_rating-0)-1).rating('readOnly');
			
			
			var tempTags = topicDetails.tags, len = tempTags.length, i, tempArray = [];
			for(i=0;i<len;i++){
				tempArray.push(tempTags[i].tag.name);
			}
			arrayOfSavedTags = tempArray;
			
			
			
			
    	}else{
    		this.element.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    }
    , getPublicTopics : function(statusObj, userdata){
		if(!this.element)
			return;
		if(statusObj.success){
			var sharedTopicsCount = userdata.shared_topic_count - 0;
			if(sharedTopicsCount < 1){
				this.isPublicTopics = false;
			}
			else{
				this.isPublicTopics = true;
			}
			this.element.html(this.view(this.sAppInstallDir 
					+ 'views/topics/topicdetail'
					, { topicDetails: this.topicDetails
						, additionalInfo: {
							loggedInUser: (this.loggedInUserInfo)?this.loggedInUserInfo.screenName:""
						  , publicTopics : this.isPublicTopics
						  , topicOptionsObj : this.topicOptionsObj
						}
					  }
					));
			this.totalCommentsCountMetaData = this.element.find('#totalCommentsCountMetaData');
			this.previousNextDiv = this.element.find("#previousNextDiv");
			this.previousNext();
		}else{
			//console.log("Oops! Error Message:" + statusObj.errorMessage);			
		}
	}
    , profileError: function(errorObj){
    	//console.log("Oops! SERVER ERROR " + errorObj.toString());
    }
    , "div#topicDetailsContainer mouseover": function (el, ev) {
    	if(this.topicPreviewHovered === false){
			this.topicPreviewHovered = true;
			el.ccl_preview_topic_modal_dialog();
		}
    }
    , error: function(errorObj){
    	this._cclUtils.removeLoaderCSS(this.element);
    	this.element.text("Oops! SERVER ERROR " + errorObj.toString());
    }
    , "a#gradesEditLink click": function (el, ev) {
    	$('#gradesEdit').toggle();
        $('#gradesList').toggle();
        $('#listOfGrades').toggle();
        var oGrades = this.topicDetails.grades;
        var lGrade = oGrades.length;
        $("ul#listOfGrds > li input").each(function(index){
        	this.checked = false;
        }).each( function(index){
    		for(var j=0;j<lGrade;j++){
    			var	nGrade = oGrades[j].grade.name;  
    			if(this.value == nGrade){
    				this.checked = true;
    				break;
    			}
    		}
        });
    }
    , "a#gradesCancelLink click": function (el, ev) {
    	$('#gradesEdit').toggle();
        $('#gradesList').toggle();
        $('#listOfGrades').toggle();
        jQuery("#listOfGrades").validationEngine('hideFaster');
    }
    , "a#gradesSave click": function (el, ev) {
    	jQuery("#listOfGrades").validationEngine('hideFaster');
    	var aSelectedGrades = [];
     	var aSelectedGradesLabel =[];
     	$("ul#listOfGrds > li input").each(function(index){
    		if(this.checked == true){
    			aSelectedGrades.push({grade:{name:this.value}});
    			aSelectedGradesLabel.push(ccl.utils.urlEncode(this.value));
    		}
    	});
    	if(aSelectedGrades.length){
    		CCL.Models.Topic.saveGradesList({ccl_topic_id:this.topicDetails.ccl_topic_id
    												  , grades:aSelectedGradesLabel}
    		, this.callback('gradesSuccess', aSelectedGrades)
    		, this.callback('error'));
    	}
    	else{
    		jQuery("#listOfGrades").validationEngine('showPrompt', 'Please select at least one grade level.', 'error', 'topRight', true);
    	}
    }
    , gradesSuccess: function (aGradesObj,statusObj) {
    	if(statusObj.success){
    		this.topicDetails.grades = aGradesObj;
    		$('#gradesEdit').toggle();
            $('#gradesList').toggle();
            $('#listOfGrades').toggle();
            var aGradeLabels = [];
            $(aGradesObj).each(function(index, gradeObj){
            	aGradeLabels.push(gradeObj.grade.name);
            });
            this.gradsList.text(aGradeLabels.join(", "));
    	}else{
    		this.gradsList.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    }
    , "a#subjectsEditLink click": function (el, ev) {
    	$('#subjectsEdit').toggle();
        $('#subjectsList').toggle();
        $('#listOfSubjects').toggle();
        var oSubjects = this.topicDetails.subjects;
        var lSubject = oSubjects.length;
        $("ul#listOfSub > li input").each(function(index){
        	this.checked = false;
        }).each( function(index){
    		for(var j=0;j<lSubject;j++){
    			var	nSubject = oSubjects[j].subject.name;  
    			if(this.value == nSubject){
    				this.checked = true;
    				break;
    			}
    		}
        });
    }
    , "a#subjectsCancelLink click": function (el, ev) {
    	$('#subjectsEdit').toggle();
        $('#subjectsList').toggle();
        $('#listOfSubjects').toggle();
        jQuery("#listOfSubjects").validationEngine('hideFaster');
    }
    , "a#subjectsSave click": function (el, ev) {
    	jQuery("#listOfSubjects").validationEngine('hideFaster');
    	var aSelectedSubjects = [];
     	var aSelectedSubjectsLabel =[];
     	$("ul#listOfSub > li input").each(function(index){
    		if(this.checked == true){
    			aSelectedSubjects.push({subject:{name:this.value}});
    			aSelectedSubjectsLabel.push(ccl.utils.urlEncode(this.value));
    		}
    	});
    	if(aSelectedSubjects.length){
    		CCL.Models.Topic.saveSubjectsList({ccl_topic_id:this.topicDetails.ccl_topic_id
    													, subjects:aSelectedSubjectsLabel}
    													, this.callback('subjectsSuccess', aSelectedSubjects)
    													, this.callback('error'));
    	}
    	else{
    		jQuery("#listOfSubjects").validationEngine('showPrompt', 'Please select at least one subject.', 'error', 'topRight', true);
    	}	    
    },
    subjectsSuccess: function (aSubjectObj,statusObj) {
    	if(statusObj.success){
    		this.topicDetails.subjects = aSubjectObj;
    		$('#subjectsEdit').toggle();
            $('#subjectsList').toggle();
            $('#listOfSubjects').toggle();
            var aSubjectLabels = [];
            $(aSubjectObj).each(function(index, subjectObj){
            	aSubjectLabels.push(subjectObj.subject.name);
            });
            this.subjectsList.text(aSubjectLabels.join(", "));
			
    	}else{
    		this.subjectsList.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    },
    "a#authorEditLink click": function (el, ev) {
		$('#authorEdit').toggle();
        $('#authorData').toggle();
        $('#authorEditArea').toggle(); 
        
    }
    , "a#authorCancelLink click": function (el, ev) {
    	$('#authorEdit').toggle();
        $('#authorData').toggle();
        $('#authorEditArea').toggle();
		var txt = "";
		if (this.topicDetails.author_notes)
			txt = this.topicDetails.author_notes;
		$('#authorDataArea').val(txt);
    }
    , "a#authorSave click": function (el, ev) {
    	var sAuthor = $.trim($('#authorDataArea').val());
		CCL.Models.Topic.saveAuthorNotes({ccl_topic_id:this.topicDetails.ccl_topic_id
    											   , author_notes:ccl.utils.escapePreDefinedCharactersForComments(ccl.utils.urlEncode(sAuthor))}
												   , this.callback('authorSuccess',sAuthor)
												   , this.callback('authorError'));
    	
    }
    , authorSuccess: function (aAuthor,statusObj) {
    	if(statusObj.success){
    		this.topicDetails.author_notes = aAuthor;
    		$('#authorEdit').toggle();
            $('#authorData').toggle();
            $('#authorEditArea').toggle(); 
            this.authorTxt.html(ccl.utils.nl2br(aAuthor));
			$('#authorDataArea').val(aAuthor);
			
    	}else{
    		$('#authorEdit').toggle();
            $('#authorData').toggle();
            $('#authorEditArea').toggle(); 
    		this.authorTxt.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    }
    , authorError: function(errorObj){
		$('#authorEdit').toggle();
        $('#authorData').toggle();
        $('#authorEditArea').toggle();
		this.authorTxt.text("Oops! SERVER ERROR " + errorObj.toString());
	}
    , "a#tagsEditLink click": function (el, ev) {
		 ev.preventDefault();
		 $("#inputTagShare").focus().val("");
		 $("#hiddenTagsShare").val("");
		 $('#ulTags').html('<li id="newTagInputShare" class="newTagInput"> <input type="text"  id="inputTagShare" class="hint" value="Type new tag(s) Here" /> </li>');
		 this.element.find("#inputTagShare").val("Type new tag(s) here");
		 jQuery("#boxTagShare").validationEngine('hideFaster');
		 $('#tagEdit').hide();
         $('#authorTagArea').toggle(); 
         tagInputBox = this.element.find("#inputTagShare");
         tagInputBoxText = tagInputBox.val();
		 
		 if((this.tagsGhostText).length == 0)
			this.tagsGhostText = tagInputBoxText;
			
         tagInputBox.focus(
                 function () {
                	 if (tagInputBox.val() == tagInputBoxText)
             	        tagInputBox.val("");
             			tagInputBox.removeClass(this.hintClass);
						jQuery("#boxTagShare").validationEngine('hideFaster');
                 }
             );
         tagInputBox.blur(
                 function () {
                	 if (tagInputBox.val() == "" && $(".li_tags").length == 0) {
             	        tagInputBox.val(tagInputBoxText);
             	        tagInputBox.addClass(this.hintClass);
             	    }
                 }
             );
		
         var tags = [];
		 $.each(this.aTags, function(){
			tags.push(this.tag);
		 });
		 $("#inputTagShare").autocomplete(tags);
		
	}
    , removeByValue: function (arr, val) {
		 for(var i=0; i<arr.length; i++) {
			 if(arr[i] == val) {
				 arr.splice(i, 1);
				 break;
			 }
		 }
		 this.index--;
	}    
	, removeTag: function (el) {
		tag = $(el).prev().html();
		$(el).parent().remove();
		this.removeByValue(arrayOfTags, tag);
		$("#inputTagShare").focus();
	}
    , insertTag: function(tag) {
		var liEl = '<li id="tag-'+tag+'" class="li_tags">'+
				 '<span class="a_tag">'+tag+'</span>&nbsp;'+
				 '<a href="javascript:void(0);"'+
				 ' class="del" id="del_'+tag+'"></a>'+
				 '</li>';
		return liEl;	
	}
	, applyTag: function(tag){
		tag = tag.split(" ");
		var i,len = tag.length;
		var savedTags = arrayOfSavedTags;
		for(i=0;i<len;i++){
			var isExist = jQuery.inArray(tag[i],  savedTags);
			if (isExist == -1)
				this.createTag(tag[i]);
		}
	}
	, createTag: function(tag) {
		// user apply new tag
		var isExist = jQuery.inArray(tag,  arrayOfTags);
		if (isExist == -1) {
			// insert new tag (visible to user)
			var newTag = this.insertTag(tag);
			$(newTag).insertBefore("#newTagInputShare");
			// insert new tag to js array
			arrayOfTags.push(tag);
			$("#inputTagShare").val("");
		}
	}
	, "#inputTagShare keydown":function(el, event) {
		var textVal = jQuery.trim($(el).val()).toLowerCase();
		var keyCode = event.which;
		var arrayTags = arrayOfTags;
		jQuery("#boxTagShare").validationEngine('hideFaster');
		
		/*
		if (keyCode == 222 || keyCode == 188 || keyCode == 190 || keyCode == 55 || keyCode == 107 || keyCode == 220  ) {
			jQuery("#boxTagShare").validationEngine('showPrompt', "Tags can't contain any of the following characters: ' \" & + \ < >", 'error', 'topRight', true);
		}*/
		
		// move left (left arrow pressed)
		if (keyCode == 37 && textVal == '') {
		 $("#newTagInput").insertBefore($("#newTagInputShare").prev());
		 $("#inputTagShare").focus();
		}

		// move right (right arrow pressed)
		if (keyCode == 39 && textVal == '') {
		 $("#newTagInputShare").insertAfter($("#newTagInputShare").next());
		 $("#inputTagShare").focus();
		}

		// delete prev tag (backspace pressed)
		if (keyCode == 8 && textVal == '') {
		 var deletedTag = $("#newTagInputShare").prev().find(".a_tag").html();
		 removeByValue(arrayTags, deletedTag);
		 $("#newTagInputShare").prev().remove();
		 $("#inputTagShare").focus();
		}

		// delete next tag (delete pressed)
		if (keyCode == 46 && textVal == '') {
		 var deletedTag = $("#newTagInputShare").next().find(".a_tag").html();
		 removeByValue(arrayTags, deletedTag);
		 $("#newTagInputShare").next().remove();
		 $("#inputTagShare").focus();
		}
		if ((47 < keyCode && keyCode < 106) || (keyCode == 32 || keyCode == 13 || keyCode == 9)) {
			
			
			var regexForTags = /['\"&+\\<>]/;
			if(textVal.search(regexForTags) != -1){
				$("#newTagInputShare").next().remove();
				$("#inputTagShare").focus();
				jQuery("#boxTagShare").validationEngine('showPrompt', "Tags can't contain any of the following characters: ' \" & + \\ < >", 'error', 'topRight', true);
				$("#inputTagShare").val("");
			}
			
			else{
			
				//if ((keyCode != 32)?true:((keyCode != 9)?true:(keyCode != 13))) 
					if ((keyCode != 32)?((keyCode != 9)?(keyCode != 13):false):false) {
					 // user still typing a tag, no action needed			 
					} else if ((keyCode == 32 || keyCode == 13 || keyCode == 9) && (textVal != '')) {
						event.preventDefault();
						this.applyTag(textVal);
					} else {
					 $(el).val("");
					}
				}
		}
	}
	, "li a.del click": function (el, ev) {
		this.removeTag(el);
    }
	, "a#tagsCancelLink click": function (el, ev) {
		jQuery("#boxTagShare").validationEngine('hideFaster');
		$('#tagEdit').show();
        $('#authorTagArea').toggle(); 
        arrayOfTags = [];
    }
	, "a#tagsSave click": function (el, ev) {		
		jQuery("#boxTagShare").validationEngine('hideFaster');
		if(this.savingStarted === true)
			return;
			
		var textVal = $("#inputTagShare").val();
		var regexForTags = /['\"&+\\<>]/;
		var tagsGhostText = this.tagsGhostText;	
		if((textVal != "") && (textVal != tagsGhostText))
				this.applyTag(textVal);
		var aTags = [];
     	var aTagsLabel =[];
		var tagsList = $('ul#ulTags > li.li_tags');
		if((tagsList.length > 0) && (textVal != tagsGhostText)){
			var tagNames = "", tempTagText, savedTags = arrayOfSavedTags, tagsArray = [];
			for(j=0;j<tagsList.length;j++)
			{
				tempTagText = tagsList[j].childNodes[0].innerHTML;
				var isExist = jQuery.inArray(tempTagText,  savedTags);
				if (isExist == -1)
					aTagsLabel.push(ccl.utils.urlEncode(tempTagText));
			}
			
			
			var tempLabelsString = aTagsLabel.join("");
			if(tempLabelsString.search(regexForTags) != -1){
				$("#inputTagShare").val("");
				this.savingStarted = false;
				jQuery("#boxTagShare").validationEngine('showPrompt', "Tags can't contain any of the following characters: ' \" & + \\ < >", 'error', 'topRight', true);
			}
			else{
				this.savingStarted = true;

				if(aTagsLabel.length > 0){
					$('.loadingIcon').show();
					CCL.Models.Topic.addTagsList({ccl_topic_id:this.topicDetails.ccl_topic_id
																	, tags:aTagsLabel}
																	, this.callback('tagsSuccess', aTagsLabel)
																	, this.callback('error'));				
				}else{				
					this.savingStarted = false;
					jQuery("#boxTagShare").validationEngine('showPrompt', 'Tag already exists.', 'error', 'topRight', true);
				}
			}
			//tagsList.remove(); // removes all the li tags except input li
		}else if(textVal == tagsGhostText){
			$("#inputTagShare").val("");
			this.savingStarted = false;
			jQuery("#boxTagShare").validationEngine('showPrompt', 'Please enter valid tag.', 'error', 'topRight', true);
		}
	}
	, tagsSuccess: function (aTagsLabel,statusObj) {
		$('.loadingIcon').hide();
		this.savingStarted = false;
    	if(statusObj.success){
    		$('#tagEdit').show();
            $('#authorTagArea').toggle(); 
			var len = aTagsLabel.length, str="";			
    		for(var i=0;i<len; i++){
    			var aTagElem = ccl.utils.urlDecode(aTagsLabel[i]);
    			str += '<li id="tag-'+aTagElem+'"><a class="usersTagList" href="#!/topic/tag/'+aTagElem+'">'+aTagElem+'</a>';
    			str += '<a href="javascript:void(0);" onclick="removeTag(this);" class="close-icon" name="'+aTagElem+'">x</a>&nbsp;</li>';
    			arrayOfSavedTags.push(aTagElem);
    		} 
			$(str).appendTo($('#displayTags ul'));
    	}else{
    		this.tagsList.text("Oops! Error Message:" + statusObj.errorMessage);
    	}
    }
	, "a.close-icon click": function (el, ev) {
		var aDeleteTags = [];
		var tag = $(el).prev().html();
		$(el).parent().remove();
		this.removeByValue(arrayOfTags, tag);
		this.removeByValue(arrayOfSavedTags, tag);
		aDeleteTags.push(ccl.utils.urlEncode($(el)[0].name));
		CCL.Models.Topic.deleteTagsList({ccl_topic_id:this.topicDetails.ccl_topic_id
    													, tags:aDeleteTags}
    													, this.callback('deleteTagsSuccess')
    													, this.callback('error'));
    	
    
	}
	, deleteTagsSuccess : function(statusObj){}
	
	, 'user.loggedIn subscribe': function (called, user) {
		this.loggedInUserInfo = user.user;
		this.loginReloadPage();
    }
	, 'topic.deleted subscribe': function (called, user) {
		this.historyAdd({ controller: "!/profile", action: ccl.utils.encodePredefinedChars(this.loggedInUserInfo.screenName) });	
    }
	, loginReloadPage: function(){
		 CCL.Models.Topic.getTopicDetails({"ccl_topic_id":this.topicOptionsObj.id}
			, this.callback('topicData')
			, this.callback('error'));
	}
	, reloadPage : function(){
        if(this.loggedInUserInfo){
        	CCL.Models.Topic.getTags({"search":""},this.callback('userTagsSuccess'), this.callback('userTagserror'));
        }
		var topicDetailsData = this.topicDetails;
		GLOBALS[15] = topicDetailsData.attachment_type;
		GLOBALS[16] = topicDetailsData.attachment_details;
		this.element.html(this.view(this.sAppInstallDir 
									+ 'views/topics/topicdetail'
									, { topicDetails: topicDetailsData
										, additionalInfo: {
											loggedInUser: (this.loggedInUserInfo)?this.loggedInUserInfo.screenName:""
											, topicOptionsObj : this.topicOptionsObj
										}
									  }
									));
		/* For loading the comments section, attach CommentsListing_controller */
		this.previousNextDiv = this.element.find("#previousNextDiv");
		this.previousNext();
		this.element.find("#commentsPageContainer").ccl_comments_listing({topicOptions:this.topicOptionsObj, user:this.loggedInUserInfo});
		
		this.totalCommentsCountMetaData = this.element.find('#totalCommentsCountMetaData');
		this.imageAttachment();
		this.subjectsList = this.element.find("#subjectsList");
		this.gradsList = this.element.find("#gradesList");
		this.authorTxt = this.element.find("#authorData");
		this.tagsList = this.element.find("#tagsList");
		this.userRating = this.element.find('.userStar');
		this.avgRating = this.element.find('.avgStar');
		this.changeLink = this.element.find('.changeLink');
		this.changeFlag = true;
		this.avgUserRatingDiv = this.element.find('#avgUserRatingDiv');
		this.ratingsCountSpan = this.element.find('#ratingsCountSpan');
		this.ratingsCount = this.element.find('#ratingsCount');
		this.ratingCountValue = this.ratingsCount.html();
		this.noRatingYet = this.element.find('#noRatingYet');
		this.yourRatingTitle = this.element.find('#yourRatingTitle');
		this.RateTopicTitle = this.element.find('#RateTopicTitle');
		
		
		if(topicDetailsData.user_rating){
			this.userRating.rating().rating('select',(topicDetailsData.user_rating-0)-1).rating('readOnly');
			this.changeFlag = false;
		}else{
			this.userRating.rating();
			this.changeFlag = true;
		}
		if(topicDetailsData.avg_rating)
			this.avgRating.rating().rating('select',(topicDetailsData.avg_rating-0)-1).rating('readOnly');
		
		this.topicPreviewHovered = false;
		
		$('div#topicDetailsContainer').bind('mouseover', function(){
			if(this.topicPreviewHovered === false){
				this.topicPreviewHovered = true;
				this.ccl_preview_topic_modal_dialog();
			}
		})
	}
	, imageAttachment : function(){
		var topicDetailsData = this.topicDetails;
		if(topicDetailsData.attachment_type == "photo"){
		    if(topicDetailsData.Topic_type_id != 'yesorno'){
				$('div.attachments').css({'text-align':'center'});
			}
		    var img = new Image();
		    if($.browser.msie)
		    	img.src = topicDetailsData.attachment_details + "?" + new Date().getTime();
		    
		    else
		    	img.src = topicDetailsData.attachment_details;
		    
		    img.onload = function(sourceObj){
		    	var iWidth = this.width;
    		    $('.photoAttachment').attr({src: img.src, width:((iWidth>420)?420:iWidth)});
		    }
	    }	
	}
	, "a.linkToSignIn click": function (el, ev) {
        ev.preventDefault();
        el.ccl_sign_in_modal_dialog("popup");
    }
	, "div#yourRating div.star-rating a click": function (el, ev) {
       this.userRatingValue = $(el)[0].title;
       if(this.changeFlag){
	       CCL.Models.Topic.rateTopic(	{
	    	   								"ccl_topic_id":this.topicOptionsObj.id
	    	   							,	"rating" : 	this.userRatingValue
	    	   							}
										, this.callback('topicRate')
										, this.callback('error')
									);
       }
    }
	, topicRate: function (statusObj, ratedData) {
		if(statusObj.success){
			this.changeFlag = false;
			this.avgUserRatingDiv.show();
			this.ratingsCountSpan.show();
			this.ratingCountValue = (this.ratingCountValue-0) + 1;
			this.ratingsCount.html(this.ratingCountValue);
			this.noRatingYet.hide();
			this.avgRating.rating().rating('readOnly',false).rating("select", (ratedData.rating-0)-1).rating('readOnly');
    		this.userRating.rating("select", this.userRatingValue).rating('disable');
			this.changeLink.show(); 
			this.yourRatingTitle.show();
			this.RateTopicTitle.hide();
    		
    	}else{
    		this._cclUtils.alert(statusObj.errorMessage);
    		this.userRating.rating('enable',false).rating("select",-1).rating("drain");
    	}
    }
	, 'a.changeLink click': function(el, ev){
		this.changeFlag = true;
		this.changeLink.hide();
		if(this.changeFlag){
		       CCL.Models.Topic.deleteRateTopic(	{
		    	   								"ccl_topic_id":this.topicOptionsObj.id
		    	   							}
											, this.callback('deleteRating')
											, this.callback('error')
										);
	       }
		
		
	}
	, deleteRating : function (statusObj, ratedData) {
		if(statusObj.success){
			this.yourRatingTitle.hide();
			this.RateTopicTitle.show();
			this.userRating.rating('enable',false).rating("select",-1).rating("drain");
			this.ratingCountValue = (this.ratingCountValue-0) - 1;
			this.ratingsCount.html(this.ratingCountValue);
			if(ratedData.rating){
				this.avgRating.rating().rating('readOnly',false).rating("select", (ratedData.rating-0)-1).rating('readOnly');
			}else{
				this.avgUserRatingDiv.hide();
				this.ratingsCountSpan.hide();
				this.noRatingYet.show();
			}
    	}else{
    		
    	}
    }
	, "commentPosted subscribe": function(called, commentsCount){
		var commentStaticText = (commentsCount == 1)? "Comment" : "Comments";
		this.totalCommentsCountMetaData.html('<a href="javascript:;" id="commentsCountLink">'+commentsCount+' '+commentStaticText+'</a>');
		
	}
	, "a#commentsCountLink click" : function(el, ev){
		var containerObj = $('#commentsPageContainer');
		var scrollObj = containerObj.offset();
		window.scrollTo(0, scrollObj.top);
	}
	
});