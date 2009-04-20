dojo.provide("multiplefileuploader.widget.IframeUploadManager");
dojo.require("multiplefileuploader.widget.AbstractUploadManager");
dojo.require("dojo.io.iframe");		
		
dojo.declare("multiplefileuploader.widget.IframeUploadManager", multiplefileuploader.widget.AbstractUploadManager, {
	constructor: function(params, targetPost, timeout,  uploadParameterName, uploadValuePrefix){
		dojo.mixin(this,params);
		this._temporaryUploadForm = null;
		this._timeout = timeout;
		this._targetPost = targetPost;
		this._uploadParameterName = uploadParameterName;
		this._uploadValuePrefix = uploadValuePrefix;	
		this._createTemporaryForm();	
	},
		
		
		_doUpload : function (uploadLifeCycle, uploadRequest) {					

				this._prepareForm(uploadRequest);
					
					  var params = {
							url: this._targetPost,
							method: "post",
							timeout: this._timeout,
							handleAs: "text",
							form: this._temporaryUploadForm,
							load: dojo.hitch(this, function(response) {
									dojox.data.dom.removeChildren(this._temporaryUploadForm); 
								    uploadLifeCycle._onUploadComplete(response,  this._uploadValuePrefix);
							}),	
							error: dojo.hitch(this, function(response) {
								dojox.data.dom.removeChildren(this._temporaryUploadForm); 
								uploadLifeCycle._onUploadError(response);
							})	
                        };
			
				dojo.io.iframe.send(params);
				uploadLifeCycle._onAfterUploadStart();
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