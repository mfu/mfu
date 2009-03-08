dojo.provide("multiplefileuploader.widget.UploadUnit");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.CheckBox");

dojo.require("multiplefileuploader.widget.UploadInputPane");
dojo.require("multiplefileuploader.widget.UploadProgressPane");
dojo.require("multiplefileuploader.widget.UploadResultPane");
dojo.require("multiplefileuploader.widget.UploadErrorPane");

dojo.declare("multiplefileuploader.widget.UploadUnit", null, {
   
    constructor: function(params, srcNodeRef){

	    dojo.mixin(this,params);
		this._uploadInputPane = null;
		this._uploadProgressPane = null;		
		this._uploadResultPane = null;
		this._uploadErrorPane = null;		
		this._paneContainer = document.createElement("div");
        dojo.place(this._paneContainer, srcNodeRef); 	
		this._uploadPaneFactory = new multiplefileuploader.widget._UploadPaneFactory(this, this._paneContainer, srcNodeRef, this.uploadManager);
		this.createInputPane();	      		
    },
   
    createInputPane : function () {
		this._uploadInputPane =  this._uploadPaneFactory.inputPane();
    },
    createProgressPane : function () {
		this._hideAllPanes();	
		this._uploadProgressPane = this._uploadPaneFactory.progressPane();
    },		
    createResultPane : function (uploadedInformation, uploadValuePrefix) {
		this._hideAllPanes();		
		this._uploadResultPane = this._uploadPaneFactory.resultPane(uploadedInformation, uploadValuePrefix);
    },
    createErrorPane : function (error, reason) {
		this._hideAllPanes();		
		this._uploadErrorPane =  this._uploadPaneFactory.errorPane(error, reason);
    },		
	getSelectedFilename : function() {
		return this._uploadInputPane.getSelectedFilename();
	},
	getFileInput : function() {
		return this._uploadInputPane.getFileInput();		
	},
	getFilename : function() {
		return this.getFileInput().value;
	},
	requestDeletion : function(){
		this.onUploadUnitDeletion(this);
	},
	hideDeleteLink : function() {
		return this._uploadInputPane._hideDeleteLink();	
	},
	showDeleteLink : function() {
		return this._uploadInputPane._showDeleteLink();				
	},	
	notifyRecoverableFailure : function(error, reason) {
		this.createErrorPane(error, reason);
		if(reason == 'NETWORK_ERROR')
			this.onUnitFailureRecoverable();
	},
	_hideAllPanes : function() {	
		dojo.forEach([this._uploadInputPane, this._uploadProgressPane, this._uploadResultPane, this._uploadErrorPane], function(widget) {
			if (widget != null) {
				widget.hide();
			}
		});
		this._destroyAllExceptInputPane();		
	},
	_destroyAllExceptInputPane : function() {
		dojo.forEach([this._uploadProgressPane, this._uploadResultPane, this._uploadErrorPane], function(widget) {
			if (widget != null) {			
				widget.destroy();
			}
		}); 				
	},
	destroy : function() {
		dojo.forEach([this._uploadInputPane, this._uploadProgressPane, this._uploadResultPane, this._uploadErrorPane], function(widget) {
			if (widget != null) {
				widget.destroy();
			}
		}); 		
	}		
});


dojo.declare("multiplefileuploader.widget._UploadPaneFactory", null, {
   
    constructor: function(unit, paneContainer, attachLinkContainer, uploadManager){
		this._unit=unit; 
        this._attachLinkContainer = attachLinkContainer;
		this._paneContainer = paneContainer;
		this._uploadManager = uploadManager		
	},

	inputPane : function() {
			var srcNodeRef = document.createElement("div");
			dojo.place(srcNodeRef, this._paneContainer);
			var params = {
				unit: this._unit,
				uploadManager: this._uploadManager,
				uploadPaneFactory: this
			}; 
			return new multiplefileuploader.widget.UploadInputPane(params, srcNodeRef);
	},
	
	progressPane: function(){
			var srcNodeRef = document.createElement("div");
			dojo.place(srcNodeRef, this._paneContainer);
			return new multiplefileuploader.widget.UploadProgressPane({unit: this._unit}, srcNodeRef);
	},
	
	resultPane : function(uploadedImageInformation, uploadValuePrefix) {
			var srcNodeRef = document.createElement("div");
			dojo.place(srcNodeRef, this._paneContainer);
			var params = {
				unit: this._unit,
				uploadPaneFactory: this,
				uploadedImageInformation: uploadedImageInformation,
				uploadValuePrefix: uploadValuePrefix
			}; 
			return new multiplefileuploader.widget.UploadResultPane(params, srcNodeRef);				
	}, 

	errorPane : function(error, reason) {
			var srcNodeRef = document.createElement("div");
			dojo.place(srcNodeRef, this._paneContainer);
			var params = {
				error: error,
				reason: reason,
				unit: this._unit
			}; 
			return new multiplefileuploader.widget.UploadErrorPane(params, srcNodeRef);	
	}, 	
	
	createFileUploadRequest : function(params) {
		var paramsToUse = {};
		dojo.mixin(paramsToUse, params);
		dojo.mixin(paramsToUse, {uploadPaneFactory: this});		
		return new multiplefileuploader.widget._FileUploadRequest(paramsToUse,this._unit);			
	}	
});


dojo.declare("multiplefileuploader.widget._FileUploadRequest", multiplefileuploader.widget.FileUploadRequestMixin, {
	 constructor: function(params, unit) {	
		dojo.mixin(this,params);
		this._unit = unit;
	}, 
	_doOnBeforeUploadStart : function() {
	
	},	
	_doOnAfterUploadStart : function() {
		
	},	
	_doOnUploadSuccess : function(uploadedImageInformation, uploadValuePrefix) {				
		this._unit.createResultPane(uploadedImageInformation, uploadValuePrefix);	
	},
	_doOnUploadFailure : function(error, reason) {
		this._unit.notifyRecoverableFailure(error, reason);
	},
	_doOnRetry : function() {
		this._unit.createProgressPane();	
	},
	_doOnUploadRequestEnqueued : function() {
		this._unit.createProgressPane();
	},
	_doGetFileInput : function () {	
		return this._unit.getFileInput();						
	}	
});
