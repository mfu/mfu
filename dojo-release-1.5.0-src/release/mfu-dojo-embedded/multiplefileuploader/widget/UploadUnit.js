/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["multiplefileuploader.widget.UploadUnit"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.widget.UploadUnit"] = true;
dojo.provide("multiplefileuploader.widget.UploadUnit");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.CheckBox");

dojo.require("multiplefileuploader.widget.ErrorCategorizer");
dojo.require("multiplefileuploader.widget.UploadInputPane");
dojo.require("multiplefileuploader.widget.UploadProgressPane");
dojo.require("multiplefileuploader.widget.UploadResultPane");
dojo.require("multiplefileuploader.widget.UploadErrorPane");

dojo.declare("multiplefileuploader.widget.UploadUnit", null, {
   
    constructor: function(params, srcNodeRef){
	    dojo.mixin(this,params);
		this._currentID = null;
		this._uploadInputPane = null;
		this._uploadProgressPane = null;		
		this._uploadResultPane = null;
		this._uploadErrorPane = null;		
		this._paneContainer = document.createElement("div");
        dojo.place(this._paneContainer, srcNodeRef); 	
		this._uploadPaneFactory = new multiplefileuploader.widget._UploadPaneFactory(this, this._paneContainer, srcNodeRef, this.uploadManager,  this.config_UI, this.config_status);
		this._errorCategorizer = new multiplefileuploader.widget.ErrorCategorizer();
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
    createErrorPane : function (response, errorCode) {
		this._hideAllPanes();		
		this._uploadErrorPane =  this._uploadPaneFactory.errorPane(response, errorCode);
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
	updateProgressBar : function(statusInformation) {
		this._uploadProgressPane.updateProgressBar(statusInformation);
	 },
	setAssociatedID : function(currentID) {
		this._currentID = currentID;
	},
	getAssociatedID : function() {
		return this._currentID;
	},
	notifyLastFileInputChanged : function(uploadRequest) {
		this._uploadInputPane.notifyLastFileInputChanged(uploadRequest);
	},
	hideDeleteLink : function() {
		return this._uploadInputPane._hideDeleteLink();	
	},
	showDeleteLink : function() {
		return this._uploadInputPane._showDeleteLink();				
	},	
	notifyRecoverableFailure : function(response, errorCode) {
		this.createErrorPane(response, errorCode);
		if(this._errorCategorizer.getErrorType(errorCode) == multiplefileuploader.widget.errorType.ERROR_TYPE_RECOVERABLE)
			this.onUnitFailureRecoverable();
	},
	_hideAllPanes : function() {				
		dojo.forEach([this._uploadInputPane, this._uploadProgressPane, this._uploadResultPane, this._uploadErrorPane], function(widget) {
			if (widget != null) {
				widget.hide();
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
   
    constructor: function(unit, paneContainer, attachLinkContainer, uploadManager,  config_UI, config_status){
		this._config_status = config_status;
		this._config_UI = config_UI;
		this._unit=unit; 
        this._attachLinkContainer = attachLinkContainer;
		this._paneContainer = paneContainer;
		this._uploadManager = uploadManager;	

	},

	inputPane : function() {
			var srcNodeRef = document.createElement("div");
			dojo.place(srcNodeRef, this._paneContainer);
			var params = {
				config_UI : this._config_UI,
				unit: this._unit,
				uploadManager: this._uploadManager,
				uploadPaneFactory: this
			}; 
			return new multiplefileuploader.widget.UploadInputPane(params, srcNodeRef);		
	},
	progressPane: function(){
			var srcNodeRef = document.createElement("div");
			dojo.place(srcNodeRef, this._paneContainer);
			var params =  {
				config_status : this._config_status,
				config_UI : this._config_UI,
				unit: this._unit
			};
			return new multiplefileuploader.widget.UploadProgressPane(params, srcNodeRef);
	},
	resultPane : function(uploadedImageInformation, uploadValuePrefix) {
			var srcNodeRef = document.createElement("div");
			dojo.place(srcNodeRef, this._paneContainer);
			var params = {
				config_UI : this._config_UI,
				unit: this._unit,
				uploadPaneFactory: this,
				uploadedImageInformation: uploadedImageInformation,
				uploadValuePrefix: uploadValuePrefix
			}; 
			return new multiplefileuploader.widget.UploadResultPane(params, srcNodeRef);				
	}, 
	errorPane : function(response, errorCode) {
			var srcNodeRef = document.createElement("div");
			dojo.place(srcNodeRef, this._paneContainer);
			var params = {
				config_UI : this._config_UI,
				response: response,
				errorCode: errorCode,
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
		this._unit = unit;
		dojo.mixin(this,params);
	}, 
	_doOnBeforeUploadStart : function() {
	},	
	_doOnAfterUploadStart : function() {	
	},	
	_doOnUploadSuccess : function(uploadedImageInformation, uploadValuePrefix) {				
		this._unit.createResultPane(uploadedImageInformation, uploadValuePrefix);	
	},
	_doOnUploadFailure : function(response, errorCode) {
		this._unit.notifyRecoverableFailure(response,errorCode);
	},
	_doOnRetry : function() {
		this._unit.createProgressPane();	
	},
	_doOnUploadRequestEnqueued : function() {
		this._unit.createProgressPane();
	},
	_doGetUploadingFilename : function () {
		return this._unit.getFilename();
	},	
	_doGetFileInput : function () {	
		return this._unit.getFileInput();						
	},
	_doSetAssociatedID : function(currentID) {
		return this._unit.setAssociatedID(currentID);
	},
	_doGetAssociatedID : function() {
		return this._unit.getAssociatedID();
	},
	/****Status Information ****/
	_doOnStatusSuccess : function(statusInformation) {
		this._unit.updateProgressBar(statusInformation);		
	},
	_doOnStatusError : function(statusInformation) {
		this._unit.updateProgressBar();			
	}		
});

}
