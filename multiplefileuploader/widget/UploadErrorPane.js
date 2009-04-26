
dojo.provide("multiplefileuploader.widget.UploadErrorPane");
dojo.require("dijit._Templated");
dojo.requireLocalization("multiplefileuploader", "messages");
multiplefileuploader.widget._uploadContainerMessages = dojo.i18n.getLocalization("multiplefileuploader","messages");
dojo.declare("multiplefileuploader.widget.UploadErrorPane", [dijit._Widget,dijit._Templated], {
     
	templatePath: dojo.moduleUrl("multiplefileuploader.widget","UploadErrorPane.html"),
	postCreate: function(params){
		this._displayError(); 	
	}, 
	hide : function() {
		dojo.style(this.errorPaneContainer, { display: "none"});			
	},
	_displayError : function() {	
			dojo.place(document.createTextNode(dojo.eval("multiplefileuploader.widget._uploadContainerMessages."+this.errorCode)), this.errorText); 		
	},	
	
	destroy : function() {			
		this.inherited(arguments);
 	}
});
