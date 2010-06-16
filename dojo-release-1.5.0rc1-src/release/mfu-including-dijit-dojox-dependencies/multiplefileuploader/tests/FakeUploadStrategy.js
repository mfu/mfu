if(!dojo._hasResource["multiplefileuploader.tests.FakeUploadStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.tests.FakeUploadStrategy"] = true;
dojo.provide("multiplefileuploader.tests.FakeUploadStrategy");
dojo.require("multiplefileuploader.widget.UploadManager");		
dojo.declare("multiplefileuploader.tests.FakeUploadStrategy", null, {

    constructor: function(fakeResponse){
		this._fakeResponse = fakeResponse;
		this._fakeUploadValuePrefix="uploadedFile_";   
},
	
	upload : function ( callbacks, uploadRequest) {		
				var jsonResponse= null;
				try {
					if(this._fakeResponse == null){
						callbacks.onSuccess(this._fakeResponse, this._fakeUploadValuePrefix);	
						return;
					}
					var jsonResponse = dojo.fromJson(this._fakeResponse);
				}
				catch(e) {
					callbacks.onSuccess(this._fakeResponse, this._fakeUploadValuePrefix);	
					return;
				}				
				var uploadedFileInformation = new multiplefileuploader.widget._UploadedFileInformation(jsonResponse);
				if (uploadedFileInformation.getErrorCode() == "NETWORK_ERROR") 
					callbacks.onError(this._fakeResponse, this._fakeUploadValuePrefix);
				else {
					callbacks.onSuccess(this._fakeResponse, this._fakeUploadValuePrefix);
				}
	}
});	

}
