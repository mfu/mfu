dojo.provide("multiplefileuploader.widget.UploadActions");
dojo.require("dijit._Templated");
dojo.requireLocalization("multiplefileuploader", "messages");
multiplefileuploader.widget._uploadContainerMessages = dojo.i18n.getLocalization("multiplefileuploader","messages");
dojo.declare("multiplefileuploader.widget.UploadActions", [dijit._Widget,dijit._Templated] , {
    
	templatePath: dojo.moduleUrl("multiplefileuploader.widget","UploadActions.html"),
    attachAnotherFileLink: multiplefileuploader.widget._uploadContainerMessages.attachAnotherFile,
	retryFailedUploadsLink : multiplefileuploader.widget._uploadContainerMessages.retryFailedUploads,
	 
	    
	postCreate: function(params){ 	
	    this._handles = new Array([]);	
		this._registerEvents();
	},
	
	_registerEvents : function() {
		var attachAnotherFileLinkHandle = dojo.connect(this.attachAnotherFileLink, 'onclick', dojo.hitch(this, function (e) {
			 dojo.stopEvent(e);
			 this._onClickJoinAnotherFile(e);
		}));
        
		var retryFailedUploads = dojo.connect(this.retryFailedUploadsLink, 'onclick', dojo.hitch(this, function (e) {
			 dojo.stopEvent(e);
			 this._onClickSwitchToOnlineMode(e);
		}));
				
				
		this._handles.push(attachAnotherFileLinkHandle);			
	    this._handles.push(retryFailedUploads);	
	
	},
    _onClickJoinAnotherFile : function(e) {         
	    this.uploadUnitContainer.createUploadUnit();
    }, 	
	
	_onClickSwitchToOnlineMode: function(e) {
		this.hideRetryUploadsLink();
		this.uploadManager.retryAllUploads();
	},
	_unregisterEvents : function() {
	    dojo.forEach(this._handles, function (handle) {
	        dojo.disconnect(handle);
	    });		
	},
	
	hideRetryUploadsLink : function() {
		dojo.style(this.retryFailedUploadsLink, { display: "none"});	
	},	
	showRetryUploadsLink : function() {
		dojo.style(this.retryFailedUploadsLink, { display: "inline"});	
	},
	destroy : function() {
		this._unregisterEvents();
		this.inherited(arguments);	      
	}	
});  