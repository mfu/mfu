dojo.provide("multiplefileuploader.widget.UploadInputPane");
dojo.require("dijit._Templated");
dojo.requireLocalization("multiplefileuploader", "messages");
dojo.declare("multiplefileuploader.widget.UploadInputPane", [dijit._Widget,dijit._Templated], {

   templateString: dojo.cache("multiplefileuploader.widget","UploadInputPane.html"),
			
    postMixInProperties: function(){
		this.i18n = dojo.i18n.getLocalization("multiplefileuploader","messages"); 
		this.inherited(arguments);
    },
    postCreate: function(params){
	    this._eventHandles = new Array([]);		
        this._registerEvents();
		this._setupUI();					
  	},	
	hide : function() {
		dojo.style(this.unitInput, { display: "none"});			
	},	
	_hideDeleteLink : function() {
		dojo.style(this.deleteLink, { display: "none"});			
	},
	_showDeleteLink : function() {
		dojo.style(this.deleteLink, { display: "inline"});			
	},	
   _registerEvents : function() {     
	     this._registerFileInput();
		 this._registerDeleteLink();		   
    },	
	_registerFileInput : function() {
		
		var fileInputHandle = dojo.connect(this.inputFile, 'onchange', dojo.hitch(this, function (e) {
					dojo.stopEvent(e);
					this._onFileInputChange(); 
				}));
		this._eventHandles.push(fileInputHandle);						
			
	},
	_registerDeleteLink : function() {

		var addDeleteLinkHandle = dojo.connect(this.deleteLink, 'onclick', dojo.hitch(this, function (e) {
					dojo.stopEvent(e);  
					this._onClickDeleteLink();
				}));
		this._eventHandles.push(addDeleteLinkHandle);						
			
	},	 
    _unregisterEvents : function(){  
        dojo.forEach(this._eventHandles, function (handle) {
            dojo.disconnect(handle);
        });
		this._eventHandles = new Array([]);
    },	    
    _onClickDeleteLink : function() {        	
		this.unit.requestDeletion();
    },
    _onFileInputChange : function() {   			
		var uploadRequest = this.uploadPaneFactory.createFileUploadRequest({unit: this.unit});
		this.notifyLastFileInputChanged(uploadRequest);
	},
	notifyLastFileInputChanged : function(uploadRequest) {
		this._addToUploadQueue(uploadRequest);
	},
    _addToUploadQueue : function(uploadRequest) {
		dojo.hitch(uploadRequest, (uploadRequest.setUnit || function() {}))(this.unit);  //hack, we should have a filename strategy here
		this.uploadManager.addToUploadQueue(uploadRequest);
	},	
	getSelectedFilename : function(){
		return this.inputFile.value;	
	},	
	getFileInput : function() {
		return this.inputFile;
	},	
	
	_setupUI : function() {
		dojo.attr(this.inputFile, "style", {width:  this.config_UI.inputWidth+this.config_UI.inputAdditionalWidth + this.config_UI.inputWidthUnit });	
		dojo.attr(this.fakeInputFile, "style", {width: this.config_UI.inputWidth + this.config_UI.inputWidthUnit });
	},
	destroy : function() {
	    this._unregisterEvents();
	    this.inherited("destroy",arguments);
	}	 
  
});
