dojo.provide("multiplefileuploader.tests.FakeUploadStrategy");
dojo.require("multiplefileuploader.widget.UploadManager");		
dojo.declare("multiplefileuploader.tests.FakeUploadStrategy", null, {

    constructor: function(fakeResponse){
		this._fakeResponse = fakeResponse;
		this._fakeUploadValuePrefix="uploadedFile_";   
},
	
	upload : function (uploadRequest, callbacks) {		
				
				var uploadedFileInformation = new multiplefileuploader.widget._UploadedFileInformation( dojo.fromJson(this._fakeResponse));
				if(uploadedFileInformation.getStatus() == "OK")
					callbacks.onSuccess(this._fakeResponse, this._fakeUploadValuePrefix);	
				else
					callbacks.onError(this._fakeResponse, this._fakeUploadValuePrefix);	
	}
});	