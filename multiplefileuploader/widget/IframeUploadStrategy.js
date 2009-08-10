dojo.provide("multiplefileuploader.widget.IframeUploadStrategy");
dojo.require("dojo.io.iframe");		
		
dojo.declare("multiplefileuploader.widget.IframeUploadStrategy", null , {
	constructor: function(targetPost, timeout, uploadParameterName ,uploadValuePrefix){
	
	this._targetPost = targetPost;
	this._timeout = timeout;
	this._uploadParameterName = uploadParameterName;
	this._uploadValuePrefix = uploadValuePrefix;
	this._temporaryUploadForm = null;
	this._createTemporaryForm();	
	
	},
		
	upload : function (uploadRequest, callbacks) {					
			this._prepareForm(uploadRequest);
			dojo.io.iframe.send( {
					url: this._targetPost,
					method: "post",
					timeout: this._timeout,					
					handleAs: "text",
					form: this._temporaryUploadForm,
					load:  dojo.hitch(this, function(response){ 
						console.debug("in load");
						dojox.data.dom.removeChildren(this._temporaryUploadForm); 
						callbacks.onSuccess(response, this._uploadValuePrefix );
					 }),
					 error:  dojo.hitch(this, function(response){
							console.debug("in error");
						dojox.data.dom.removeChildren(this._temporaryUploadForm);   
						callbacks.onError(response);
					})
				});					
	},
		
	_prepareForm : function(uploadRequest) {
			var fileInput = uploadRequest.getFileInput();
			dojo.attr(fileInput, "name", this._uploadParameterName);
			dojo.place(fileInput, this._temporaryUploadForm);			
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
