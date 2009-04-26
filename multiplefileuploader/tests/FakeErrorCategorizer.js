dojo.provide("multiplefileuploader.tests.FakeErrorCategorizer");


dojo.declare("multiplefileuploader.tests.FakeErrorCategorizer", null, {
	constructor: function(errorType){
	 this.errorType =	errorType	
	},
	
	getErrorType : function(errorCode) {
			return this.errorType;
	}
});