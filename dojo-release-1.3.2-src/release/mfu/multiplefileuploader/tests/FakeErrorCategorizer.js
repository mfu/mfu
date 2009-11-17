if(!dojo._hasResource["multiplefileuploader.tests.FakeErrorCategorizer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.tests.FakeErrorCategorizer"] = true;
dojo.provide("multiplefileuploader.tests.FakeErrorCategorizer");


dojo.declare("multiplefileuploader.tests.FakeErrorCategorizer", null, {
	constructor: function(errorType){
	 this.errorType =	errorType	
	},
	
	getErrorType : function(errorCode) {
			return this.errorType;
	}
});

}
