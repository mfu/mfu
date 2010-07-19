/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["multiplefileuploader.widget.UploadErrorPane"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.widget.UploadErrorPane"] = true;
dojo.provide("multiplefileuploader.widget.UploadErrorPane");
dojo.require("dijit._Templated");
dojo.requireLocalization("multiplefileuploader", "messages", null, "ROOT,en,en-us,fr");
dojo.declare("multiplefileuploader.widget.UploadErrorPane", [dijit._Widget,dijit._Templated], {
     
	templateString: dojo.cache("multiplefileuploader.widget", "UploadErrorPane.html", "<div dojoAttachPoint=\"errorPaneContainer\">\n\t<span style=\"color: red; font-weight: bold;\" dojoAttachPoint=\"errorText\"></span>\n</div>\t\n"),
	
    postMixInProperties: function(){
		this.i18n = dojo.i18n.getLocalization("multiplefileuploader","messages"); 
		this.inherited(arguments);
    },	 
	postCreate: function(params){
		this._displayError(); 	
	}, 
	hide : function() {
		dojo.style(this.errorPaneContainer, { display: "none"});			
	},
	_displayError : function() {	

			dojo.place(document.createTextNode(dojo.getObject(this.errorCode, false, this.i18n)), this.errorText); 		
	},	
	destroy : function() {			
		this.inherited("destroy",arguments);
 	}
});

}
