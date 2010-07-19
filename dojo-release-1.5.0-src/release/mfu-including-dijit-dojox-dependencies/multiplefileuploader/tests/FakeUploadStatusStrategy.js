if(!dojo._hasResource["multiplefileuploader.tests.FakeUploadStatusStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.tests.FakeUploadStatusStrategy"] = true;
dojo.provide("multiplefileuploader.tests.FakeUploadStatusStrategy");
dojo.declare("multiplefileuploader.tests.FakeUploadStatusStrategy", null, {

    constructor: function(FakeUploadStatusStrategy){
		this._fakeResponse = dojo.toJson([{ "id" : 45562 }]) ;
},
	
	getStatus : function (callbacks, uploadRequest) {						
	},
	
	getID : function(callbacks) {
		callbacks.onIDSuccess(this._fakeResponse);			
	}
});	

}
