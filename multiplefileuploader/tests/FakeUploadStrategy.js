dojo.provide("multiplefileuploader.tests.FakeUploadStrategy");
dojo.declare("multiplefileuploader.tests.FakeUploadStrategy", null, {

    constructor: function(){

	this._fakeResponse = '{ "id" : "45562", "name" : "Screenshot-1.png",  "status" : "OK", "mimetype" : "image/png", "size" : "168562" , "errorcode" : ""}';
	this._fakeUploadValuePrefix="uploadedFile_";   
},
	
	upload : function (uploadRequest, callbacks) {		
				callbacks.onSuccess(this._fakeResponse, this._fakeUploadValuePrefix);		
	}
});	