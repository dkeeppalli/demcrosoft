$.Controller.extend("CCL.Controllers.PreviewTopicModalDialog", {
    init: function () {
        var sourceObj = this;   
        this.sAppInstallDir = g_sAppInstallDir;
        this.previewModal = $(this.view(this.sAppInstallDir + 'views/modals/previewTopic'));		
		this.previewModalWidth = $(this.previewModal).width();
		this.previewModalClose = this.previewModal.find("#previewModalClose");
		this.videoAttachment = this.previewModal.find("#videoAttachment");
		this.videoAttachment.click(function (el, ev) {
			var videoObj = GLOBALS[16].indexOf("src");
			var srcobj = GLOBALS[16].indexOf('"',videoObj+1);
			var urlObj = GLOBALS[16].indexOf('"',srcobj+1);
			src_value = GLOBALS[16].substring(srcobj+1,urlObj);
            window.open(src_value+ '', '', 'directories=0, height=385, location=0, menubar=0, resizable=0, scrollbars=0, status=0, toolbar=0, width=420, left=500, top=300', false, 420, 385);
        });
		this.previewModalClose.click(function (el, ev) {
			$(".blockMsg").hide();
        });
        this._width = 530;		
		var blockUIObj = {
							message: this.previewModal
							, css: {
								  width: ($(this.previewModal).width()) + 40
								, border: 'none'
								, backgroundColor: 'transparent'
								, cursor: 'auto'
								, left: '167px'
							}
							, overlayCSS: {
								  cursor: 'auto'
								, opacity: 0.1
							}
							, centerX : false
						};
		$('#topicDetailsContainer').block(blockUIObj);
		$('#topicDetailsContainer').hover(function(){
			jQuery(this).block(blockUIObj);
		},function(){
			jQuery(this).unblock(blockUIObj);
		});
    }
});