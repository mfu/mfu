dojo.provide("multiplefileuploader.widget.MultipleFileUploader");
dojo.require("multiplefileuploader.widget.UploadManager");
//dojo.require("multiplefileuploader.widget.FakeUploadManager");
dojo.require("multiplefileuploader.widget.UploadUnit");
dojo.require("multiplefileuploader.widget.UploadUnitContainer");
dojo.require("multiplefileuploader.widget.UploadInputPane");
dojo.require("dojox.data.dom");
dojo.require("dojox.collections.ArrayList");
dojo.require("dijit._Templated");

dojo.requireLocalization("multiplefileuploader", "messages");
multiplefileuploader.widget._uploadContainerMessages = dojo.i18n.getLocalization("multiplefileuploader","messages");

dojo.declare("multiplefileuploader.widget.MultipleFileUploader", [dijit._Widget,dijit._Templated], {
   
   
	    templatePath: dojo.moduleUrl("multiplefileuploader.widget","MultipleFileUploader.html"),	
		
	   	ajaxUploadUrl : "",
		
		uploadParameterName : "upload",
	
		uploadValuePrefix : "uploadedFile_",
		
		timeout : "",
		
		fakeMode: false,
	
   
	    postCreate: function(){
			
			var params = {
					onError: dojo.hitch(this, this._onError),
					onProgress: dojo.hitch(this, function(queueStatus){
						this._onProgress(queueStatus);
					}),
					onFinishedUploads: dojo.hitch(this, function() {
						this._onFinishedUploads();
					}),
					onFinishedUpload: dojo.hitch(this, function(uploadedFileInformation) {
						this._onFinishedUpload(uploadedFileInformation);
					}), 
					onAfterUploadStart: dojo.hitch(this, function(uploadRequest) {
						this._onAfterUploadStart(uploadRequest);
					})					
			};
			
			if (this.fakeMode) {
				this._uploadManager = new multiplefileuploader.widget.FakeUploadManager(params);
			}
			else {
				this._uploadManager = new multiplefileuploader.widget.UploadManager( params, 
					this.ajaxUploadUrl, this.timeout, this.uploadParameterName, this.uploadValuePrefix);
			}
			
			var params = {
				uploadManager: this._uploadManager,
				onInputDisplay : dojo.hitch(this, function(fileInput) {
					this.onInputDisplay(fileInput);
				})
			};
			
			var uploadUnitContainer = new multiplefileuploader.widget.UploadUnitContainer(params, this.fileUploadContainer , this.uploadActionsContainer);			
 	},

	 
	 _onError : function() {
		this.onError();
	 },
	 _onProgress : function(queueStatus) {
	 	this.onProgress( queueStatus);
	 },
	 _onFinishedUpload : function(uploadedFileInformation) {
		this.onFinishedUpload(uploadedFileInformation);
	 },	 
	 _onFinishedUploads : function() {
		this.onFinishedUploads();
	 }, 
	 _onAfterUploadStart : function(uploadRequest){
	 	this.onAfterUploadStart(uploadRequest);
	 },
	 _onInputDisplay : function(fileInput){
	 	this.onInputDisplay(fileInput);
	 },
	 onError : function() {
	 }, 
	 onProgress : function(queueStatus) {	 	
	 },	 
	 onFinishedUploads : function() {
	 },	 
	 onFinishedUpload : function(uploadedFileInformation) { 	
	 },	
	 onAfterUploadStart : function(uploadRequest) {
	 },
	 onInputDisplay : function(fileInput) {
	 },
	 fireProgress : function() {
		this._uploadManager.fireProgress();
	 }

});

