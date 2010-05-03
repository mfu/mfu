dojo.provide("multiplefileuploader.widget.ErrorCategorizer");

multiplefileuploader.widget.errorType = {
	"ERROR_TYPE_RECOVERABLE" : "ERROR_TYPE_RECOVERABLE",
	"ERROR_TYPE_NON_RECOVERABLE" : "ERROR_TYPE_NON_RECOVERABLE"
};

multiplefileuploader.widget.errorCode = {
	"NETWORK_ERROR" :  multiplefileuploader.widget.errorType.ERROR_TYPE_RECOVERABLE,
	"SERVER_ERROR" : multiplefileuploader.widget.errorType.ERROR_TYPE_NON_RECOVERABLE,
	"MALFORMED_JSON_EXCEPTION" : multiplefileuploader.widget.errorType.ERROR_TYPE_NON_RECOVERABLE,
	"NULL_JSON_EXCEPTION" : multiplefileuploader.widget.errorType.ERROR_TYPE_NON_RECOVERABLE,
	"SIZE_EXCEEDED" : multiplefileuploader.widget.errorType.ERROR_TYPE_NON_RECOVERABLE,
	"SIZE_UPLOAD_ERR_NO_FILE" : multiplefileuploader.widget.errorType.ERROR_TYPE_NON_RECOVERABLE,
	"UNSUPPORTED_FORMAT" : multiplefileuploader.widget.errorType.ERROR_TYPE_NON_RECOVERABLE
};



dojo.declare("multiplefileuploader.widget.ErrorCategorizer", null, {
	constructor: function(){
	},
	
	getErrorType : function(errorCode) {
			if(multiplefileuploader.widget.errorCode[errorCode] == null)
				throw errorCode+" Is not defined";
			else
				return multiplefileuploader.widget.errorCode[errorCode];
	}


});