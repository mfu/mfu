dojo.provide("multiplefileuploader.widget.UploadErrorPane");
dojo.require("dijit._Templated");
dojo.requireLocalization("multiplefileuploader", "messages");
dojo.declare("multiplefileuploader.widget.UploadErrorPane", [dijit._Widget,dijit._Templated], {
     
	templatePath: dojo.moduleUrl("multiplefileuploader.widget","UploadErrorPane.html"),
	
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
		this.inherited(arguments);
 	}
});
