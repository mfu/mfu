dojo.provide("multiplefileuploader.widget.UploadResultPane");
dojo.require("dijit._Templated");
multiplefileuploader.widget.REMOVE_UNIT_DURATION = 5000;
multiplefileuploader.widget.FADE_OUT_DURATION = 500;  
dojo.declare("multiplefileuploader.widget.UploadResultPane", [dijit._Widget,dijit._Templated], {
     
	templatePath: dojo.moduleUrl("multiplefileuploader.widget","UploadResultPane.html"),
	
	postCreate: function(params){
	    this._handles = new Array([]);		
		this._displayCancelCheckbox();
		this._displayUploadedFilename();
		this._displayMimetype();
		this._displaySize();
		this._displayUploadedFileID();	
	}, 	
  hide: function() {
		dojo.style(this.uploadedImageInformationContainer, { display: "none"});			
  },
	_displayCancelCheckbox : function() {		
		var cb = new dijit.form.CheckBox({
				checked: true, 
				disabled: false
			}, this.cancelUploadCheckbox);		
		dojo.connect(cb, 'onClick', dojo.hitch(this, function() {this._deleteFilenameIfNeeded(cb); }) );
		this._handles.push(cb);	
	},	
	_displayUploadedFilename : function() {	
			dojo.place(document.createTextNode(this.uploadedImageInformation.getName()), this.uploadedFilename); 			
	},	
	_displayMimetype : function() {
			dojo.place(document.createTextNode(this.uploadedImageInformation.getMimeType()), this.mimetype); 	
	},
	_displaySize : function() {
			dojo.place(document.createTextNode(this.uploadedImageInformation.getSize()), this.size); 
	},
	_displayUploadedFileID : function() {
			dojo.attr(this.uploadedFileID, "id",this.uploadValuePrefix+this.uploadedImageInformation.getID()); 		
	},
	_deleteFilenameIfNeeded : function(cb) {
	
			if (cb.checked)
					this.uploadedFileID.removeAttribute("disabled");
				else
					dojo.attr(this.uploadedFileID, "disabled", "");
									
				setTimeout(
					dojo.hitch(this, function () {
						if(!cb.checked) {					
							dojo.fadeOut({ node:this.uploadedImageInformationContainer, 
											duration:multiplefileuploader.widget.FADE_OUT_DURATION,
											onEnd: dojo.hitch(this, function(){
												this.unit.requestDeletion()							
											})
										 }).play();					
						}
					}),multiplefileuploader.widget.REMOVE_UNIT_DURATION
				); 	
	},
			
	destroy : function() {
		dojo.forEach(this._handles, function (handle) {
		        dojo.disconnect(handle);
		    });				
		this.inherited(arguments);
 	}
});