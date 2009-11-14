dojo.provide("multiplefileuploader.widget.UploadUnitContainer");
dojo.require("multiplefileuploader.widget.UploadActions");
dojo.declare("multiplefileuploader.widget.UploadUnitContainer", null ,{

    constructor : function(params, fileUploadContainer, uploadActionsContainer) {  
	    dojo.mixin(this, params);
		this._uploadUnits  = new dojox.collections.ArrayList();
        this._containerDiv = fileUploadContainer;
		this._uploadActionsContainer = uploadActionsContainer;
		this.createUploadUnit();
		this._uploadActions = this._createUploadActions();
		this._lastUploadUnit = null;
    },
    _notifyUploadUnitDeleted : function(unit) {
		this._uploadUnits.remove(unit);
		unit.destroy();
		this._makeSureOneUploadUnitIsVisible();
		this._makeSureDeleteLinkIsHiddenForTheFirstInput();
    }, 	
	_notifyUnitFailureRecoverable : function() {
			this._uploadActions.showRetryUploadsLink();
	},
	
	notifyLastFileInputChanged : function(uploadRequest) {
		this._getLastElement(this._uploadUnits).notifyLastFileInputChanged(uploadRequest);
	},	
	_makeSureOneUploadUnitIsVisible : function() {	
		if (this._noFileInputVisible())					
			this.createUploadUnit();
	},
	_makeSureDeleteLinkIsHiddenForTheFirstInput : function() {
		if (this._oneFileInputVisible()) {
			this._getFirstUnit().hideDeleteLink();
		}
		else {
			dojo.forEach(this._uploadUnits.toArray(), function(u){
				u.showDeleteLink();
			});
		}	
	},
	createUploadUnit : function () {

			var uploadUnitsParams = {
				config_status : this.config_status,
				config_UI : this.config_UI,
				uploadManager : this.uploadManager,
				onUploadUnitDeletion: dojo.hitch(this, function(unit){
					this._notifyUploadUnitDeleted(unit);
				}),
				onUnitFailureRecoverable: dojo.hitch(this, function() {
					this._notifyUnitFailureRecoverable();
				})
			};	
        	
		var srcNodeRef = document.createElement("div");
        dojo.place(srcNodeRef, this._containerDiv); 				
		var uploadUnit = new multiplefileuploader.widget.UploadUnit(uploadUnitsParams, srcNodeRef);
		this._uploadUnits.add(uploadUnit);
		
		this._makeSureDeleteLinkIsHiddenForTheFirstInput();	
	},
	
	_createUploadActions : function() {	
			return new multiplefileuploader.widget.UploadActions({
							uploadUnitContainer: this, 
							uploadManager: this.uploadManager
			}, this._uploadActionsContainer);
	},
	
    _noFileInputVisible : function() {
        return (this._uploadUnits.count == 0) ? true : false;   
    }, 
	
	_oneFileInputVisible : function() {
		return (this._uploadUnits.count == 1) ? true : false; 
	} , 
	_getFirstUnit : function() {
		return this._getFirstElement(this._uploadUnits);
	},
	_getFirstElement : function(arr) {
		var itr=arr.getIterator();
		itr.get();
		return itr.element; 
	},
	_getLastElement : function(arr) {
		var itr=arr.getIterator();
        while(!itr.atEnd()){
           itr.get();
        };
		return itr.element;    
    }   
   
});
