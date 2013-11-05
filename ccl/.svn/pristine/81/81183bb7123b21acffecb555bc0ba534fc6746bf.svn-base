$.Controller.extend("CCL.Controllers.ShareTopic", {
    init: function (obj,classname,shareObj) {
		var copysitesObj;
		this.shareObj = shareObj || {};
        var sourceObj = this;
		this.topicId = obj.id;
		this.arrayTags = [""];
        this.index = 0;
		
		this.topicType = obj.name;
		this.sAppInstallDir = g_sAppInstallDir;
        this.popupLayout = $(this.view(this.sAppInstallDir + 'views/modals/popupLayout'));
        this.copyToSiteContent = this.popupLayout.find("#popupContent");
        this.copyToSiteContent.html(this.view(this.sAppInstallDir 
        									+ 'views/modals/shareTopic'
        									, { shareObj :this.shareObj	
        									})
        									);
        this.closeButton = this.popupLayout.find(".close");
		this.cancelLink = this.popupLayout.find("#linkTocancel");
        this.shareTopicButton = this.copyToSiteContent.find("#shareTopicButton");
        this.inputTagShareTopic = this.copyToSiteContent.find("#inputTagShareTopic");
        this.ulTagsContainer = this.copyToSiteContent.find("#ulTags");
		this.popupLayout[0].className = classname;
		this.aTags = [];
		CCL.Models.Topic.getTags({"search":""},this.callback('userTagsSuccess'), this.callback('userTagserror'));
		
		this.ulTagsContainer.click( function (el,ev) {
            sourceObj.removeTag(el);
        });
		
        this.cancelLink.click( function () {
            sourceObj.Cancel();
            arrayOfTags = [];
            delete sourceObj;
        });
		this.closeButton.click(function () {
            sourceObj.close();
            arrayOfTags = [];
            delete sourceObj;
        });
       this.shareTopicButton.click(
	            function () {
	                sourceObj.shareTopicButtonClick();
	            }
	        );
		this._width = 620;
        $.blockUI({
            message: this.popupLayout
            , css: {
                top: '5%'
                , left: ($(window).width() - this._width) / 2 + 'px'
                , border: 'none'
                , backgroundColor: 'transparent'
                , position: 'absolute'
                , cursor: 'auto'
            }
            , overlayCSS: {
                cursor: 'auto'
            }
        });
        
            this.inputTagShareTopic.keydown(
    	            function (el, ev) { 
    	                sourceObj.inputTagShareTopicKeyDown(el, ev);
    	               
    	            }
    	        );   
         
            this.savedTags = [];
      		var tempTags = shareObj.tags, len = tempTags.length, i, tempArray = [];
      		for(i=0;i<len;i++){
      			
      			tempArray.push(tempTags[i].tag.name);
      		}
      		this.savedTags = tempArray;
      		for(var t = 0; t< tempArray.length;t++)
      		{
      			this.createTag(tempArray[t]);
      		}
       
    }
	, removeByValue: function(arr, val) {
	    for(var i=0; i<arr.length; i++) {
	        if(arr[i] == val) {
	            arr.splice(i, 1);
	            break;
	        }
	    }
	    this.index--;
	}
	
	, removeTag : function(el) {
	    var deleteTag = $(el)[0].target;
		tag = $(deleteTag).prev().html();
	    $("#sharetag-"+tag).remove();
		
		this.removeByValue(arrayOfTags, tag);
	    this.inputTagShareTopic.focus();
	}
	, insertTag : function(tag) {
	    var liEl = '<li id="sharetag-'+tag+'" class="li_tags">'+
	                '<span class="a_tag">'+tag+'</span>&nbsp;'+
	                '<a href="javascript:void(0);" '+
	                ' class="del deleteShareTopicTag" id="del_'+tag+'"></a>'+
	                '</li>';
	    return liEl;
	}
	, applyTag : function(tag){
		tag = tag.split(" ");
		var i,len = tag.length;
		for(i=0;i<len;i++){
			this.createTag(tag[i]);
		}
	}
	, createTag : function(tag) {
		// user apply new tag
		var isExist = jQuery.inArray(tag, arrayOfTags);
		if (isExist == -1) {
			// insert new tag (visible to user)
			var newTag = this.insertTag(tag);
			$(newTag).insertBefore("#newTagInputShareTopic");
			// insert new tag to js array
			arrayOfTags[this.index] = tag;
				this.index++;
			this.inputTagShareTopic.val("");
		}
	}
	, inputTagShareTopicKeyDown : function(el, ev) {
	    var textVal = jQuery.trim(this.inputTagShareTopic.val()).toLowerCase();
	    var keyCode = el.which;
	    var arrayTags = arrayOfTags;
	    jQuery("#boxTagShareTopic").validationEngine('hideFaster');
	    // move left (left arrow pressed)
	    if (keyCode == 37 && textVal == '') {
	        $("#newTagInputShareTopic").insertBefore($("#newTagInputShareTopic").prev());
	        this.inputTagShareTopic.focus();
	    }
	    
	    // move right (right arrow pressed)
	    if (keyCode == 39 && textVal == '') {
	        $("#newTagInputShareTopic").insertAfter($("#newTagInputShareTopic").next());
	        this.inputTagShareTopic.focus();
	    }
	
	    // delete prev tag (backspace pressed)
	    if (keyCode == 8 && textVal == '') {
	        deletedTag = $("#newTagInputShareTopic").prev().find(".a_tag").html();
	        this.removeByValue(arrayTags, deletedTag);
	        $("#newTagInputShareTopic").prev().remove();
	        this.inputTagShareTopic.focus();
	    }
	
	    // delete next tag (delete pressed)
	    if (keyCode == 46 && textVal == '') {
	        deletedTag = $("#newTagInputShareTopic").next().find(".a_tag").html();
	        this.removeByValue(arrayTags, deletedTag);
	        $("#newTagInputShareTopic").next().remove();
	        this.inputTagShareTopic.focus();
	    }
	
	    if ((47 < keyCode && keyCode < 106) || (keyCode == 32 || keyCode == 9)) {
	    	
	    	var regexForTags = /['\"&+\\<>]/;
			if(textVal.search(regexForTags) != -1){
				$("#newTagInputShare").next().remove();
				this.inputTagShareTopic.focus();
				jQuery("#boxTagShareTopic").validationEngine('showPrompt', "Tags can't contain any of the following characters: ' \" & + \\ < >", 'error', 'topRight', true);
				this.inputTagShareTopic.val("");
			}
			else{
	    	
		    	
				//if ((keyCode != 32)?true:((keyCode != 9)?true:(keyCode != 13))) 
		        if ((keyCode != 32)?((keyCode != 9)?(keyCode != 13):false):false) {
		            // user still typing a tag, no action needed
		        } else if ((keyCode == 32 || keyCode == 13 || keyCode == 9) && (textVal != '')) {
					el.preventDefault();
					this.applyTag(textVal);
		        } else {
		        	this.inputTagShareTopic.val("");
		        }
			}
	        
	    }
	}

	, userTagsSuccess: function (statusObj,usertags) {
	    if(statusObj.success){
	    	cTags = usertags.tags.length;
	    	var userTagObj =  null;
	    	for(var t= 0; t < cTags; t++){
	    		userTagObj =  usertags.tags[t];
	    		this.aTags.push({tag:userTagObj,freq:"1"});
	    	}
	    	 var tags = [];
	   		 $.each(this.aTags, function(){
	   			tags.push(this.tag);
	   		 });
	   		 $("#inputTagShareTopic").autocomplete(tags);
	    	
	    }else{
			this.element.text("Oops! Error Message:" + statusObj.errorMessage);
		}
	}
	, userTagserror: function(errorObj){
		this.element.text("Oops! SERVER ERROR " + errorObj.toString());
	}
    , close: function () {
    	jQuery("#listOfSGrds").validationEngine('hideFaster');
    	jQuery("#listOfSSub").validationEngine('hideFaster');
    	$.unblockUI();
        this.element.controller().destroy();
    }
	, Cancel: function () {
		jQuery("#listOfSGrds").validationEngine('hideFaster');
    	jQuery("#listOfSSub").validationEngine('hideFaster');
		$.unblockUI();
		this.element.controller().destroy();
    }
   , shareTopicButtonClick : function () {
    	jQuery("#listOfSGrds").validationEngine('hideFaster');
    	jQuery("#listOfSSub").validationEngine('hideFaster');
    	var aSelectedGrades = [];
     	var aSelectedGradesLabel =[];    	
     	var sSAuthor = $('#sAuthorDataArea').val();
     	var aTags = [];
     	var aTagsLabel =[];
		var tagsList = $('ul#ulTags > li.li_tags');
		var tagsArray = [];
		for(j=0;j<tagsList.length;j++)
		{
			tagsArray[j] = tagsList[j].childNodes[0].innerHTML;
			aTagsLabel.push(tagsArray[j]);
		}
		$("ul#listOfSGrds > li input").each(function(index){
    		if(this.checked == true){
    			aSelectedGrades.push({grade:{name:this.value}});
    			aSelectedGradesLabel.push(ccl.utils.urlEncode(this.value));
    		}
    	});
     	var aSelectedSubjects = [];
     	var aSelectedSubjectsLabel =[];
     	$("ul#listOfSSub > li input").each(function(index){
    		if(this.checked == true){
    			aSelectedSubjects.push({subject:{name:this.value}});
    			aSelectedSubjectsLabel.push(ccl.utils.urlEncode(this.value));
    		}
    	});     	
     	if(aSelectedSubjects.length && aSelectedGrades.length){
     		this.showShareTopicProcessing();
     		CCL.Models.Topic.shareTopic({ ccl_topic_id : this.topicId
     												, subjects : aSelectedSubjectsLabel
     												, grades : aSelectedGradesLabel
     												, tags : aTagsLabel
     												, author_notes:ccl.utils.escapePreDefinedCharacters(ccl.utils.urlEncode(sSAuthor))
     												}
     												, this.callback('shareTopicSuccess')
     												, this.callback('shareTopicError'));
     	}else {
     		this.hideShareTopicProcessing();
     		if(aSelectedGrades){
        		if(aSelectedGrades.length == 0){
        			jQuery("#listOfSGrds").validationEngine('showPrompt', 'Please select at least one grade level.', 'error', 'topRight', true);
            	}
        	}
	     	if(aSelectedSubjects){
	     		if(aSelectedSubjects.length == 0){
	     			jQuery("#listOfSSub").validationEngine('showPrompt', 'Please select at least one subject.', 'error', 'topRight', true);
	        	}	
	    	}
     	}
    	  
    }
    , shareTopicSuccess: function (statusObj) {
    	this.hideShareTopicProcessing();
    	if(statusObj.success){
			steal.dev.log("success");
			$.unblockUI();
			this.publish("topic.deleted",statusObj);//need to change delete to share as of now both have same functionality; 
    	}else{
    		steal.dev.log("error");
    	}
    }
    , shareTopicError: function(errorObj){
		steal.dev.log("Oops..conection problem!");
    	this.popupLayout.text("Oops! SERVER ERROR " + errorObj.toString());
    }
    , showShareTopicProcessing: function(){
		$('#shareTopic .spinnerContainer').css('float', 'left');
		$('#shareTopic .spinnerContainer').css('margin-left', '0px');
		$('#shareTopic .spinnerContainer').show();
		$('#shareTopicButton').attr('disabled', true);
	}
	, hideShareTopicProcessing: function(){
		$('#shareTopic .spinnerContainer').hide();
		$('#shareTopicButton').attr('disabled', false);
	}
});