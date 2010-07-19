/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["multiplefileuploader.widget.MultipleFileUploader"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.widget.MultipleFileUploader"] = true;
dojo.provide("multiplefileuploader.widget.MultipleFileUploader");
dojo.require('dojo.parser')
dojo.require("multiplefileuploader.widget.UploadManager");
dojo.require("multiplefileuploader.widget.UploadUnit");
dojo.require("multiplefileuploader.widget.UploadUnitContainer");
dojo.require("multiplefileuploader.widget.UploadInputPane");
dojo.require("dojox.data.dom");
dojo.require("dojox.collections.ArrayList");
dojo.require("dijit._Templated");

dojo.declare("multiplefileuploader.widget.MultipleFileUploader", [dijit._Widget,dijit._Templated], {
   
   
	 templateString: dojo.cache("multiplefileuploader.widget", "MultipleFileUploader.html", "<div>\n\t<div dojoAttachPoint=\"fileUploadContainer\"></div>\n\t<div dojoAttachPoint=\"uploadActionsContainer\"></div>\n</div>\n"),	

/* upload setup */			
		ajaxUploadUrl : "",
		uploadParameterName : "upload",
		uploadValuePrefix : "uploadedFile_",
		uploadTimeout : "50000",
		
	
/* progressBar setup */	
		progressBarMode : true,
			uploadStatusURL : "",
			statusTimeout : "",
			getStatusInterval : "2000", 
			apc_php_enabled : true,

/* UI setup */
		
		progressBarWidth : "15%",
		progressBarHeight : "18px",
	
/* You've got the possibility to have thumb onmouseover the filename when the file is uploaded*/
	
		enableThumbs : true,
			thumbsHeight : 80,
			thumbsWidth : 80,
			showDelay : 50,
/* 
The goal of the input* variables is to place the 'real' button over the 'fake' one, in order to have a clickable fake button 
Depending of your CSS attributes( width, 'browse...' button text length ) , you might adjust the following values
To know where the real browse button is, disable ( by removing the line ) .dijitFileInputReal { opacity:0; } from FileInput.css
we use this trick : http://www.quirksmode.org/dom/inputfile.html 
*/
		 inputWidth : 200, 
		 inputAdditionalWidth : 120,
		 inputWidthUnit : "px",
		 
/* tests setup */			
		fakeMode: false,
		fakeResponse: "",

	    postCreate: function(){
			
			this._sanityCheck(); 
		
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
	         	  dojo.require("multiplefileuploader.tests.FakeUploadStrategy");
				  dojo.require("multiplefileuploader.tests.FakeUploadStatusStrategy");
				  var fakeStrategy = {
						_uploadStrategy : new multiplefileuploader.tests.FakeUploadStrategy(this.fakeResponse),
						_uploadStatusStrategy : new multiplefileuploader.tests.FakeUploadStatusStrategy()
				  };
				  dojo.mixin(params,fakeStrategy);
			}
			
			var config_tests= { 
				fakeMode : this.fakeMode,
				fakeResponse: this.fakeResponse
			};
			var config_server = {
				ajaxUploadUrl : this.ajaxUploadUrl,
				uploadTimeout : this.uploadTimeout,
				uploadParameterName : this.uploadParameterName,
				uploadValuePrefix : this.uploadValuePrefix,
				apc_php_enabled : this.apc_php_enabled
			};
			var config_status = {
				uploadStatusURL : this.uploadStatusURL,
				progressBarMode : this.progressBarMode,
				getStatusInterval : this.getStatusInterval,
				checkInterval : this.checkInterval
			};
			var config_UI = {
				enableThumbs : this.enableThumbs,
				thumbsHeight : this.thumbsHeight,
				thumbsWidth : this.thumbsWidth,
				showDelay : this.showDelay,
				inputWidth : this.inputWidth,
				inputAdditionalWidth: this.inputAdditionalWidth,
				inputWidthUnit : this.inputWidthUnit,
				progressBarWidth : this.progressBarWidth,
				progressBarHeight : this.progressBarHeight			
			};
			
			

			
			this._uploadManager = new multiplefileuploader.widget.UploadManager( params, config_server, config_status, config_UI);
			
			var params = {
				config_status : config_status,
				config_UI : config_UI,
				uploadManager: this._uploadManager
			};
			
			this.uploadUnitContainer = new multiplefileuploader.widget.UploadUnitContainer(params, this.fileUploadContainer , this.uploadActionsContainer);			
 	},

	_sanityCheck : function() {
		if(this.progressBarMode)
			if(this.uploadStatusURL == "")
				throw "When ProgressBarMode enabled, you have to set an uploadStatusURL parameter when instanciate MultipleFileUploader";
				
		if(this.ajaxUploadUrl == "")
			throw "you have to provide an ajaxUploadUrl parameter";
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
	 fireProgress : function() {
		this._uploadManager.fireProgress();
	 },
	 notifyLastFileInputChanged : function(uploadRequest) {
	 	this.uploadUnitContainer.notifyLastFileInputChanged(uploadRequest);
	 }

});

}
