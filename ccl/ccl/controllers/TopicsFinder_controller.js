$.Controller.extend("CCL.Controllers.TopicsFinder", {
    init: function () {
        this.textBox = this.element.find("#topicsFinderText");
        this.promptText = this.textBox.val();
        this.hintClass = "hint";
    }
    , "#topicsFinderText focus": function (el, ev) {
        if (this.textBox.val() == this.promptText)
            this.textBox.val("");

        this.textBox.removeClass(this.hintClass);
    }
    , "#topicsFinderText blur": function (el, ev) {
        if ($.trim(this.textBox.val()) == "") {
            this.textBox.val(this.promptText);
            this.textBox.addClass(this.hintClass);
        }
    }
    , "#searchButton click": function (el, ev) {
        this.sendSearchRequest();
        ev.preventDefault();
    }
    , sendSearchRequest: function () {
    	var sSearchQuery = ccl.utils.encodeAndCharacter($.trim(this.textBox.val()));
    	 if (sSearchQuery == "" || sSearchQuery == this.promptText)
            return;

        this.textBox.val(this.promptText);
        this.textBox.addClass(this.hintClass);
        this.textBox.focus();
        this.historyAdd({ controller: "!/search"
        				, action: "all/" + ccl.utils.encodePredefinedChars(sSearchQuery) });

    }
    , reset: function () {
        this.textBox.val(this.promptText);
        this.textBox.removeClass(this.hintClass);
        this.textBox.addClass(this.hintClass);
    }
    , "form submit": function (el, ev) {
        this.sendSearchRequest();
        return false;
    }
});