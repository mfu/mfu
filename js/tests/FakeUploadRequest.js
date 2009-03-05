dojo.provide("multiplefileuploader.tests.FakeUploadRequest");

		
dojo.declare("multiplefileuploader.tests.FakeUploadRequest", null, {
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
	_doOnUploadSuccess : function(uploadedFileInformation, uploadValuePrefix) {		
		
	},
	_doOnUploadFailure : function(error, reason) {

	},
	_doOnRetry : function() {

	}

});