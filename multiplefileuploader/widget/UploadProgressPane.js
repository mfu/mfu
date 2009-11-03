dojo.provide("multiplefileuploader.widget.UploadProgressPane");
dojo.require("dijit._Templated");
dojo.declare("multiplefileuploader.widget.UploadProgressPane", [dijit._Widget,dijit._Templated], {

    templatePath: dojo.moduleUrl("multiplefileuploader.widget","UploadProgressPane.html"),
			
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
	
	_populateProgressBarTmp : function() {
		this._progressBar = new dijit.ProgressBar({
				indeterminate: false,
				style: "width:15%; float: left; height:15px"
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
			this._progressBar.update({"maximum": statusInformation.getTotalSize(), "progress":  statusInformation.getUploadedSize()  });
	}
 
});