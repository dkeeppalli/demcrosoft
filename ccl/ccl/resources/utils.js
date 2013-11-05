var ccl = window.ccl  = ccl || {};
ccl.utils = ccl.utils || {};

ccl.utils.urlEncode = function(sSource){
	var resturnString = sSource;
	if(resturnString)
			resturnString = encodeURIComponent(encodeURIComponent(encodeURIComponent(resturnString)))
	
	return resturnString;

};

ccl.utils.urlDecode = function(sSource){
	var resturnString = sSource;
	if(resturnString)
			resturnString = decodeURIComponent(decodeURIComponent(decodeURIComponent(resturnString)))

	return resturnString;
};
ccl.utils.encodePredefinedChars = function(sSource){
	if(sSource && sSource.length > 0){
		sSource = sSource.toString();
		sSource = sSource.replace(/\+/g, "%2B");
		sSource = sSource.replace(/\s/g, "+");
		sSource = sSource.replace(/ /g, "+");
		sSource = sSource.replace(/\"/g, "&#34;");
	}
	return sSource;
};
ccl.utils.decodePredefinedChars = function(sSource){
	sSource = sSource.toString();
	sSource = sSource.replace(/\+/g, " ");
	sSource = sSource.replace(/%2B/g, "+");
	sSource = sSource.replace(/&#34;/g, "\"");	
	return sSource;
};
ccl.utils.escapeSpecialCharacters = function(sSource){
	if(sSource && sSource.length > 0){
		sSource = sSource.replace(/\"/g, "&#34;");
		sSource = sSource.replace(/</g, "&lt;");
		sSource = sSource.replace(/>/g, "&gt;");
	}
		return sSource;
};
//implement JSON.stringify serialization
JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

$(document).ready(function() {
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("dropdown"))
			$(".dropdown dd ul").hide();
	});
});

ccl.utils.removeLoaderCSS = function(el){
	el = $(el);
	if(el.hasClass("loadingIcon"))
		el.removeClass("loadingIcon");
};
ccl.utils.attachLoaderCSS = function(el){
	el = $(el);
	if(!el.hasClass("loadingIcon"))
		el.addClass("loadingIcon");
};
String.prototype.toUpperCaseFirstChar = function() {
    return this.substr( 0, 1 ).toUpperCase() + this.substr( 1 );
};
String.prototype.formatString = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
ccl.utils.escapePreDefinedCharacters = function(sSource){
	
	if(sSource && sSource.length > 0){
		sSource = sSource.toString();
		sSource = sSource.replace(/%252522/g, "\\\""); //console.log(remember production.js will change it to \\\"
		sSource = sSource.replace(/%25255C/g, "\\\\\\\\");
		//sSource = sSource.replace(/%252522/g, "\"");
	}
	return sSource;
};
ccl.utils.unescapePreDefinedCharactersWithHTML = function(sSource){
	
	if(sSource && sSource.length > 0){
		sSource = sSource.toString();
		sSource = sSource.replace(/\"/g, "&#34;");
	}
	return sSource;
};
ccl.utils.unescapePreDefinedCharactersWithHTMLForSearch = function(sSource){
	
	if(sSource && sSource.length > 0){
		sSource = sSource.toString();
		sSource = sSource.replace(/^ /, "+");
		sSource = sSource.replace(/\"/g, "&#34;");
	}
	return sSource;
};
ccl.utils.escapePreDefinedCharactersForComments = function(sSource){
	
	if(sSource && sSource.length > 0){
		sSource = sSource.toString();
		sSource = sSource.replace(/%252509/g, "%252520");
		sSource = sSource.replace(/%252522/g, "\\\""); //console.log(remember production.js will change it to \\\"
		sSource = sSource.replace(/%25250A/g, "\\n");
		sSource = sSource.replace(/%25255Cn/g, "\\n");
		sSource = sSource.replace(/%25255C/g, "\\\\\\\\");
		//sSource = sSource.replace(/%252522/g, "\"");
	}
	return sSource;
};
ccl.utils.unescapePreDefinedCharactersForCommentsWithHTML = function(sSource){
	
	if(sSource && sSource.length > 0){
		sSource = sSource.toString();
		sSource = sSource.replace(/\"/g, "&#34;");
		sSource = sSource.replace(/\\n/g, "<br/>");
	}
	return sSource;
};

inputRequired  = function(field, rules, i, options){
	if($.trim(field.val()) == ''){
		field.val("");
		return (options.allrules[rules[i+2]]).alertText;
		
	}
};

ccl.utils.alert = function(data){
	alert(data);
};

ccl.utils.presentDate = function(){
	var d=new Date();
	var month=new Array(12);
	month[0]="January";
	month[1]="February";
	month[2]="March";
	month[3]="April";
	month[4]="May";
	month[5]="June";
	month[6]="July";
	month[7]="August";
	month[8]="September";
	month[9]="October";
	month[10]="November";
	month[11]="December";
	
	var date = month[d.getMonth()]+ " " + d.getDate() +", "+ d.getFullYear();
	return date;
	
};


ccl.utils.fullTitles = function(sSource){
	var fullTitles = [];
	fullTitles["downloaded"] = "Most Downloaded Topics";
	fullTitles["shared"] = "Recently Shared Topics";
	fullTitles["rated"] = "Top Rated Topics";
	fullTitles["subject"] = "Subject";
	fullTitles["grade"] = "Grade Level";
	fullTitles["tag"] = "User Tags";
	fullTitles["types"] = "Topic Type";
	
	return fullTitles[sSource];

};
ccl.utils.nl2br = function (sSource) {
	return (sSource + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
};

ccl.utils.convertGtLt = function (sSource){
	return sSource.replace(/>/g, "&gt;").replace(/</g, "&lt;");
};
ccl.utils.sortValueFullId = function(sSource){
	var sortValueFullId = [];
	sortValueFullId["downloaded"] = "most_downloaded";
	sortValueFullId["shared"] = "date_added";
	sortValueFullId["rated"] = "top_rated";
	
	return sortValueFullId[sSource];

};
ccl.utils.breadCrumbType = function(sSource){
	var breadCrumbType = [];
	breadCrumbType["downloaded"] = "top_downloaded";
	breadCrumbType["shared"] = "recently_shared";
	breadCrumbType["rated"] = "top_rated";
	breadCrumbType["types"] = "topic_type";
	
	return breadCrumbType[sSource];
};
ccl.utils.encodeAndCharacter = function(sSource){
	if(sSource && sSource.length > 0){
		sSource = sSource.toString();
		sSource = sSource.replace(/\&/g, "%26");
	}
		return sSource;
};
String.prototype.specialCharacterEntities = function () {
	return this;
};