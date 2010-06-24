dojo.provide("multiplefileuploader.widget.IframeUploadStrategy");
dojo.require("dojo.io.iframe");		
		
dojo.declare("multiplefileuploader.widget.IframeUploadStrategy", null , {
	
	constructor: function(config_server, config_status,config_UI){

	this._config_server = config_server;
	this._config_status = config_status;
	this._config_UI = config_UI;
	this._temporaryUploadForm = null;
	this._createTemporaryForm();
	this._createAdditionalFields();
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
			this._createAdditionalFields();


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

	_createAdditionalFields : function() {

			if(this._config_UI.enableThumbs) {

				var input = document.createElement('input');
				dojo.attr(input, "type", "hidden");
				dojo.attr(input, "name", "thumbHeight");
				dojo.attr(input, "value", this._config_UI.thumbsHeight);
				dojo.place(input, this._temporaryUploadForm);	

				var input = document.createElement('input');
				dojo.attr(input, "type", "hidden");
				dojo.attr(input, "name", "thumbWidth");
				dojo.attr(input, "value", this._config_UI.thumbsWidth);
				dojo.place(input, this._temporaryUploadForm);					
				
			}
	
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
