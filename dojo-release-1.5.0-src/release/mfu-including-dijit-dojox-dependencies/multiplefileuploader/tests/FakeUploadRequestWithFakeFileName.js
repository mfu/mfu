if(!dojo._hasResource["multiplefileuploader.tests.FakeUploadRequestWithFakeFileName"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.tests.FakeUploadRequestWithFakeFileName"] = true;
dojo.provide("multiplefileuploader.tests.FakeUploadRequestWithFakeFileName");
		
dojo.declare("multiplefileuploader.tests.FakeUploadRequestWithFakeFileName", multiplefileuploader.widget._FileUploadRequest , {  
	constructor: function(params){
		dojo.mixin(this,params);
	},
	_doGetUploadingFilename : function () {
		return this.currentFilename;
	},		
	_doGetFileInput : function () {			
	},
	setUnit : function(unit) {
		this._unit = unit;
	},
	setAssociatedID : function(currentID) {
	}

});

}
