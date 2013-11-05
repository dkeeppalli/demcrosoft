$.Controller.extend("CCL.Controllers.CategoryListPanel", {
    init: function () {
        this.browseby = escape(this.options.browseOptions.browseBy);
    }
    , ".contentArea click": function (el, ev) {
        if (ev.target.tagName.toLowerCase() == "a") {
            $(ev.target).attr("href"
            				, "#!/topic/" 
        					+ ccl.utils.encodePredefinedChars(this.browseby)
        					+ "/" 
        					+  ccl.utils.encodePredefinedChars($(ev.target).text())
        					);
        }
    }
});