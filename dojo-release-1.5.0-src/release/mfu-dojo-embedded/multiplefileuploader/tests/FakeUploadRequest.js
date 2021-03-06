if(!dojo._hasResource["multiplefileuploader.tests.FakeUploadRequest"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.tests.FakeUploadRequest"] = true;
dojo.provide("multiplefileuploader.tests.FakeUploadRequest");
		
dojo.declare("multiplefileuploader.tests.FakeUploadRequest", multiplefileuploader.widget.FileUploadRequestMixin , {
	constructor: function(params){
		dojo.mixin(this,params);
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
	_doGetUploadingFilename : function () {
		return this.currentFilename;
	},		
	_doGetFileInput : function () {	
				
	},
	_doGetAssociatedID : function() {
		
	}

});


}
