/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["multiplefileuploader.widget.UploadProgressPane"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["multiplefileuploader.widget.UploadProgressPane"] = true;
dojo.provide("multiplefileuploader.widget.UploadProgressPane");
dojo.require("dijit._Templated");
dojo.declare("multiplefileuploader.widget.UploadProgressPane", [dijit._Widget,dijit._Templated], {

    templateString: dojo.cache("multiplefileuploader.widget", "UploadProgressPane.html", "<div dojoAttachPoint=\"progressBarContainer\">\n\t<div dojoAttachPoint=\"progressBarTmp\"></div>\n\t<span dojoAttachPoint=\"checkboxTmp\"></span>\n\t<span dojoAttachPoint=\"filenameTmp\"></span>\n\t<div style=\"clear:both\"></div>\n</div>\n"),
			
    postCreate: function(params){
		this._populateUploadStatusContainer();
		this._makeUploadStatusContainerVisible();
  },

  hide: function() {
		dojo.style(this.progressBarContainer, { display: "none"});			
  },
	_populateUploadStatusContainer : function() {	
		this._populateProgressBarTmp();
		this._populateCheckboxTmp();
		this._populateFilenameTmp();	
	},
	
	_isIndeterminate : function() {
		return (this.config_status.progressBarMode) ? false : true;
	},
	_populateProgressBarTmp : function() {
		this._progressBarTmp = new dijit.ProgressBar({ 
			indeterminate: this._isIndeterminate(), 
			style: "width: "+this.config_UI.progressBarWidth+";"+"height: "+this.config_UI.progressBarHeight+";"+"float: left;"
		}, this.progressBarTmp);			
	},
	_populateCheckboxTmp : function() {
		new dijit.form.CheckBox({
			checked: true, 
			disabled: true
		}, this.checkboxTmp);
	},
	_populateFilenameTmp : function() {
		dojo.place(document.createTextNode(this._getCurrentFilename()), this.filenameTmp); 
	},
	_makeUploadStatusContainerVisible : function() {	
		dojo.style(this.progressBarContainer, { display: "block"});		
	},
	_getCurrentFilename : function() {
		return this.unit.getSelectedFilename();
	},
	updateProgressBar : function(statusInformation) {
		this._progressBarTmp.update({"maximum": statusInformation.getTotalSize(), "progress":  statusInformation.getUploadedSize()  });
	},
	destroy : function() {
	   this.inherited("destroy",arguments);
	}	 	
 
});

}
