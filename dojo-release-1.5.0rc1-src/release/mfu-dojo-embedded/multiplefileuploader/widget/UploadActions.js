/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["multiplefileuploader.widget.UploadActions"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.widget.UploadActions"] = true;
dojo.provide("multiplefileuploader.widget.UploadActions");
dojo.require("dijit._Templated");
dojo.requireLocalization("multiplefileuploader", "messages", null, "ROOT,en,en-us,fr");
dojo.declare("multiplefileuploader.widget.UploadActions", [dijit._Widget,dijit._Templated] , {
    
	templateString: dojo.cache("multiplefileuploader.widget", "UploadActions.html", "<div dojoAttachPoint=\"attachAnotherFileLink\">\t\n\t<a href=\"#\">${i18n.attachAnotherFile}</a><a style=\"display:none; margin: 5px; size: 12px; color:red; font-style: italic;\" dojoAttachPoint=\"retryFailedUploadsLink\" href=\"#\">${i18n.retryFailedUploads}</a> \n</div>\n"),
	 
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
		this.inherited("destroy",arguments);      
	}	
});  

}
