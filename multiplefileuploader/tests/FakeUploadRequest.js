dojo.provide("multiplefileuploader.tests.FakeUploadRequest");
		
dojo.declare("multiplefileuploader.tests.FakeUploadRequest", multiplefileuploader.widget.FileUploadRequestMixin , {
	constructor: function(params){
		dojo.mixin(this,params);
	},
	getUploadingFilename : function() {		
		return this.currentFilename;
	},
	_doOnBeforeUploadStart : function() {
	
	},	
	_doOnAfterUploadStart : function() {
		
	},	
	_doOnUploadSuccess : function(uploadedImageInformation, uploadValuePrefix) {				

	},
	_doOnUploadFailure : function(response, errorCode) {

	},
	_doOnRetry : function() {

	},
	_doOnUploadRequestEnqueued : function() {

	},
	_doGetFileInput : function () {	
				
	}	

});

