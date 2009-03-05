dojo.provide("multiplefileuploader.tests.LoggingUploadManager");
dojo.require("multiplefileuploader.widget.AbstractUploadManager");


dojo.declare("multiplefileuploader.tests.LoggingUploadManager", multiplefileuploader.widget.AbstractUploadManager, {
	constructor: function(params){
 		console.debug(params);
	},

	_upload: function() {		
	
		console.debug("LoggingUploadManager triggerd in _upload() ");
	}

});



