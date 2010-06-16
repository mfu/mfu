/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["multiplefileuploader.widget.IframeUploadStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.widget.IframeUploadStrategy"] = true;
dojo.provide("multiplefileuploader.widget.IframeUploadStrategy");
dojo.require("dojo.io.iframe");		
		
dojo.declare("multiplefileuploader.widget.IframeUploadStrategy", null , {
	
	constructor: function(config_server, config_status){

	this._config_server = config_server;
	this._config_status = config_status;
	this._temporaryUploadForm = null;
	this._createTemporaryForm();
	}, 
		
	upload : function (callbacks, uploadRequest) {					
			this._prepareForm(uploadRequest);
			dojo.io.iframe.send( {
					//find a strategy to add params only when progressBar enabled
					url: this._config_server.ajaxUploadUrl,
					method: "POST",	
					timeout: this._config_server.uploadTimeout,
					handleAs: "text",
					form: this._temporaryUploadForm,
					load:  dojo.hitch(this, function(response){ 
					dojox.data.dom.removeChildren(this._temporaryUploadForm); 
						callbacks.onSuccess(response, this._config_server.uploadValuePrefix);
					 }),
					 error:  dojo.hitch(this, function(response){
						dojox.data.dom.removeChildren(this._temporaryUploadForm);   
						callbacks.onError(response);
					})
				});					
	},
		
	_prepareForm : function(uploadRequest) {
			 if(this._config_server.apc_php_enabled) {
				this._createAPCInput(uploadRequest);
			 }
			this._createFileInput(uploadRequest);
			this._createStatusIDInput(uploadRequest);


	},
	
	_createFileInput : function(uploadRequest) {
			var fileInput = uploadRequest.getFileInput();
			dojo.attr(fileInput, "name", this._config_server.uploadParameterName);
			dojo.place(fileInput, this._temporaryUploadForm);		
	},
	 _createStatusIDInput : function(uploadRequest) {
			var input = document.createElement('input');
			dojo.attr(input, "type", "hidden");
			dojo.attr(input, "name", this._config_status.statusParameterName);
			dojo.attr(input, "value", uploadRequest.getAssociatedID());
			dojo.place(input, this._temporaryUploadForm);

	 },
	 	
	_createAPCInput : function(uploadRequest) {
			var input = document.createElement('input');
			dojo.attr(input, "type", "hidden");
			dojo.attr(input, "name", "APC_UPLOAD_PROGRESS");
			dojo.attr(input, "value", uploadRequest.getAssociatedID());
			dojo.place(input, this._temporaryUploadForm);	
	},


	 	
	_createTemporaryForm : function () {

			if(dojo.isIE){
				this._temporaryUploadForm = document.createElement('<form style="display:none" enctype="multipart/form-data" method="post">');
				this._temporaryUploadForm.encoding = "multipart/form-data";
    		}else{
	        	this._temporaryUploadForm = document.createElement('form');
				dojo.style(this._temporaryUploadForm,{ display: "none"});
	            this._temporaryUploadForm.setAttribute("enctype","multipart/form-data");
				} 
			 dojo.body().appendChild(this._temporaryUploadForm);
	}	
});

}
