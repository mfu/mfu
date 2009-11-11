dojo.provide("multiplefileuploader.widget.StatusUploadStrategy");
dojo.require("dojo.io.iframe");		
		
dojo.declare("multiplefileuploader.widget.StatusUploadStrategy", null , {

	constructor: function(config_status){	
		this._config_status = config_status;
		this._temporaryUploadForm = null;
		this._createTemporaryForm();		
	},
	getStatus : function (callbacks, uploadRequest) {					

			dojo.xhrGet( {
			    	//is dojoAddParam exist ?
					url: this._config_status.uploadStatusURL+"?"+this._config_status.statusParameterName+"="+uploadRequest.getAssociatedID(),
			 		timeout: this._config_status.statusTimeout,
					handleAs: "text",
					handle:  dojo.hitch(this, function(response){ 
						dojox.data.dom.removeChildren(this._temporaryUploadForm); 
						callbacks.onStatusSuccess(response );				
					 }),
					 error:  dojo.hitch(this, function(response){
						console.debug('response error!! !! in getStatus()')
						dojox.data.dom.removeChildren(this._temporaryUploadForm); 
						callbacks.onStatusError(response);
					})
				});					
	},
	 
		
	getID : function(callbacks) {
		dojo.io.iframe.send( {
					url:  this._config_status.uploadStatusURL,
					form: this._temporaryUploadForm,			
					handleAs: "text",
					load:  dojo.hitch(this, function(response){ 
						console.debug("on getID response success")
						dojox.data.dom.removeChildren(this._temporaryUploadForm); 
						callbacks.onIDSuccess(response);
					 }),
					 error:  dojo.hitch(this, function(response){
						dojox.data.dom.removeChildren(this._temporaryUploadForm); 
						callbacks.onIDError(response);
					})
				});		
	},
	
	_createTemporaryForm : function () {
			if(dojo.isIE){
				this._temporaryUploadForm = document.createElement('<form style="display:none" method="post">');
    		}else{
	        	this._temporaryUploadForm = document.createElement('form');
				dojo.style(this._temporaryUploadForm,{ display: "none"});
				} 
			 dojo.body().appendChild(this._temporaryUploadForm);
	}			
		
});
