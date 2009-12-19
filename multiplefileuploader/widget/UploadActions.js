dojo.provide("multiplefileuploader.widget.UploadActions");
dojo.require("dijit._Templated");
dojo.requireLocalization("multiplefileuploader", "messages");
dojo.declare("multiplefileuploader.widget.UploadActions", [dijit._Widget,dijit._Templated] , {
    
	templatePath: dojo.moduleUrl("multiplefileuploader.widget","UploadActions.html"),
	 
    postMixInProperties: function(){
		this.i18n = dojo.i18n.getLocalization("multiplefileuploader","messages"); 
		this.inherited(arguments);
    },	    
	postCreate: function(params){ 	
	    this._eventHandles = new Array([]);	
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
				
				
		this._eventHandles.push(attachAnotherFileLinkHandle);			
	    this._eventHandles.push(retryFailedUploads);	
	
	},
    _onClickJoinAnotherFile : function(e) {         
	    this.uploadUnitContainer.createUploadUnit();
    }, 	
	
	_onClickSwitchToOnlineMode: function(e) {
		this.hideRetryUploadsLink();
		this.uploadManager.retryAllUploads();
	},
	_unregisterEvents : function() {
	    dojo.forEach(this._eventHandles, function (handle) {
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