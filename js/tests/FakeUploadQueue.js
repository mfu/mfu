dojo.provide("multiplefileuploader.tests.FakeUploadQueue");

dojo.declare("multiplefileuploader.tests.FakeUploadQueue", null, {
	 constructor: function() {						

	}, 
	onImageUploadRequest : function(uploadRequest) {

	},	
	onBeforeUploadStart : function(uploadRequest) {
		
	},	
	onUploadSuccess : function() {
		
	},
	
	onUploadFailure  : function(uploadRequest) {

	},
	getTotalNumberOfUploadRequests : function () {

	},	
	getNumberOfFinishedUploads : function () {

	},
	getNumberUploadsInProgress : function () {

	},	
	getPendingElements : function () {
	
	},	
	isUploading : function () {

	},	
	getNextUploadRequest : function() {	

	},	
	getCurrentlyUploadingFilename : function() {		

	},
	_enqueueAtBegining : function(uploadRequest) {

	}
});