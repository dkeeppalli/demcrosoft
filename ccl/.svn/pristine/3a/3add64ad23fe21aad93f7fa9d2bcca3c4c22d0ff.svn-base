$.Controller.extend("CCL.Controllers.TopHeaderSearch", {
	init: function () {
	    this.headerSearchTextBox = this.element.find("#headerSearchInput");
	    this.headerSearchPromptText = this.headerSearchTextBox.val();
	    this.hintClass = "hint";
	}
	, "#headerSearchInput focus": function (el, ev) {
	    if (this.headerSearchTextBox.val() == this.headerSearchPromptText)
	        this.headerSearchTextBox.val("");
	
	    this.headerSearchTextBox.removeClass(this.hintClass);
	}
	, "#headerSearchInput blur": function (el, ev) {
	    if (this.headerSearchTextBox.val() == "") {
	        this.headerSearchTextBox.val(this.headerSearchPromptText);
	        this.headerSearchTextBox.addClass(this.hintClass);
	    }
	}
	, "#headerSearchButton click": function (el, ev) {
	    this.sendSearchRequest();
	}
	, sendSearchRequest: function () {
	    var sSearchQuery = ccl.utils.encodeAndCharacter($.trim(this.headerSearchTextBox.val()));
	    if (sSearchQuery == "" || sSearchQuery == this.headerSearchPromptText)
	        return;
	
	    this.headerSearchTextBox.val(this.headerSearchPromptText);
	    this.headerSearchTextBox.addClass(this.hintClass);
	    this.headerSearchTextBox.focus();
	    this.historyAdd({ controller: "!/search"
	    				, action: "all/" + ccl.utils.encodePredefinedChars(sSearchQuery) });
	
	}
	, reset: function () {
	    this.headerSearchTextBox.val(this.headerSearchPromptText);
	    this.headerSearchTextBox.removeClass(this.hintClass);
	    this.headerSearchTextBox.addClass(this.hintClass);
	}
	, "form submit": function (el, ev) {
	    this.sendSearchRequest();
	    return false;
	}
});