dojo.provide("multiplefileuploader.widget.UploadManager");
dojo.require("multiplefileuploader.widget.IframeUploadStrategy");
dojo.require("multiplefileuploader.widget.StatusUploadStrategy");
dojo.require("multiplefileuploader.widget.ErrorCategorizer");
dojo.require("dojox.collections.Queue");
dojo.require("dojox.collections.ArrayList");


dojo.declare("multiplefileuploader.widget.UploadManager", null, {
	constructor: function(params, widget_server, widget_status){
		this._offline = false;
		this._checkInterval = widget_status.checkInterval;
		this._statusLifeCycle = null;
	    this._interval = null;
		this._progressbarMode =  widget_status.progressBarMode;
	    this._statusUploadStrategy = new multiplefileuploader.widget.StatusUploadStrategy(widget_status);
		this._uploadQueue = new multiplefileuploader.widget._UploadQueue(this);	
		this._lifeCycleFactory = new multiplefileuploader.widget._LifeCycleFactory();
		this._statusLifeCycleFactory = new multiplefileuploader.widget._StatusLifeCycleFactory();
		this._uploadStrategy = new multiplefileuploader.widget.IframeUploadStrategy(widget_server, widget_status );		
		this._errorCategorizer = new multiplefileuploader.widget.ErrorCategorizer();
		dojo.mixin(this,params);

	},

	addToUploadQueue : function(uploadRequest) {	
		this._uploadQueue.onImageUploadRequest(uploadRequest);
		uploadRequest.onUploadRequestEnqueued();
		if(!this._uploadQueue.isUploading()) {
			this._processNextUpload();
		}			
	},
	retryAllUploads : function() {
		this._offline = false;
		var uploadRequest = this._uploadQueue.getNextUploadRequest();		
		uploadRequest.onRetry();
		this._processNextUpload();
	},	
	
	/* protected */	
	_processNextUpload: function() {		
			var uploadRequest = this._uploadQueue.getNextUploadRequest();		
			if(uploadRequest !== null && this._offline == false) {									
				this._getNewID(this, uploadRequest);
			}
			if(uploadRequest == null) {
				this.onFinishedUploads();
			}
	},
	
	_getNewID : function(uploadManager, uploadRequest) {
		// try to get rid of UploadManager ( because of interval )
			    this._statusLifeCycle =  this._statusLifeCycleFactory.createStatusLifeCycle(uploadManager, uploadRequest);		
				var callbacks = {
						onIDSuccess : dojo.hitch(this,  function(response) {
							console.debug('on id success')
							 this._statusLifeCycle._onGetIDComplete(response);
							 this._upload(uploadRequest);
						}),
						onIDError : dojo.hitch(this,  function(response) {
							 this._statusLifeCycle._onGetIDError(response);
						})
				}; 						
				this._statusUploadStrategy.getID(callbacks);
	},

	_getStatus : function(uploadRequest) {
	
		 	this._interval = setInterval(dojo.hitch(this, function () {
							if(this._progressbarMode) {
										var callbacks = {
											onStatusSuccess: dojo.hitch(this, function(response){
												this._statusLifeCycle._onStatusSuccess(response);
											}),
											onStatusError: dojo.hitch(this, function(response){
												this._statusLifeCycle._onStatusError(response);
											})
										};
										this._statusUploadStrategy.getStatus(callbacks, uploadRequest);
							}		
						}), this._checkInterval );
		
	},
		
	_upload : function(uploadRequest) {
		var lifeCycle = this._lifeCycleFactory.createLifeCycle(this, uploadRequest);		
		this._uploadQueue.onBeforeUploadStart(uploadRequest);
		uploadRequest.onBeforeUploadStart();	
		this.fireProgress();	
		var callbacks = {
			onSuccess : function(response, uploadValuePrefix) {
				lifeCycle._onUploadComplete(response,  uploadValuePrefix);	
			},
			onError : function(response) {
				lifeCycle._onRecoverableError (response, "NETWORK_ERROR");
			}
		}; 
	
		this._uploadStrategy.upload(callbacks, uploadRequest);	
		lifeCycle._onAfterUploadStart();	
		this.onAfterUploadStart(uploadRequest);
		this._getStatus(uploadRequest);

		
	}, 


	/* protected */ 
	_stopProcessingUploads : function(uploadRequest, errorCode) {
		if (this._errorCategorizer.getErrorType(errorCode) == multiplefileuploader.widget.errorType.ERROR_TYPE_RECOVERABLE) {
			this._offline = true;
		}
		this._uploadQueue.onUploadFailure(uploadRequest, errorCode);	
	},	
	
	/* protected */ 
	_continueProcessingUploads : function() {
		this._uploadQueue.onUploadSuccess();
	},
	fireProgress : function() {
		
		var queueStatus = { 
				    numberUploadsInProgress : this._uploadQueue.getNumberUploadsInProgress(),
					pendingElements : this._uploadQueue.getPendingElements(),
					totalNumberOfUploadRequests : this._uploadQueue.getTotalNumberOfUploadRequests(),
					numberUploadFinished : this._uploadQueue.getNumberOfFinishedUploads(),
					filename : this._uploadQueue.getCurrentlyUploadingFilename()

			};	
		this.onProgress(queueStatus);		
	},
	
	//if Nothing
	onFinishedUploads : function() {
		
	}
	

	
});



dojo.declare("multiplefileuploader.widget._LifeCycle", null, {
	 constructor: function(params, uploadManager, uploadRequest) {	
		this._uploadManager = uploadManager;
		this._uploadRequest =  uploadRequest;
		this._errorCategorizer = new multiplefileuploader.widget.ErrorCategorizer();
		dojo.mixin(this, params);
	}, 	
	_onUploadComplete : function(response, uploadValuePrefix) {	
		clearInterval(this._uploadManager._interval);
		var jsonResponse= null;
		try {
			if(response == null){
				this._onNonRecoverableError(response, "NULL_JSON_EXCEPTION");
				return;
			}
			var jsonResponse = dojo.fromJson(response);
		}
		catch(e) {
			this._onNonRecoverableError(response, "MALFORMED_JSON_EXCEPTION");
			return;
		}
		
		  var uploadedFileInformation = new multiplefileuploader.widget._UploadedFileInformation(jsonResponse);
		  
		  if(uploadedFileInformation.getStatus() == "KO") {
	 		this._dispatchError(response, uploadedFileInformation);
			}
			else {
				this._uploadRequest.onUploadSuccess(uploadedFileInformation, uploadValuePrefix);
				this._uploadManager.onFinishedUpload(uploadedFileInformation);
				this._uploadManager._continueProcessingUploads();			
			}
	},
	_onRecoverableError : function(response, errorCode) {
		//Supposed to stopInterval Handler here; but dirty hack to access to private var here
	    clearInterval(this._uploadManager._interval);
		this._uploadRequest.onUploadFailure(response, errorCode);
		this._uploadManager._stopProcessingUploads(this._uploadRequest, errorCode);		
	},
	_onNonRecoverableError : function(response, errorCode) {
		this._uploadRequest.onUploadFailure(response, errorCode);	
		this._uploadManager._continueProcessingUploads();
	},
	_onAfterUploadStart : function() {
		this._uploadRequest.onAfterUploadStart();	
	},
	
	_dispatchError : function(response, uploadedFileInformation) {

		switch(this._errorCategorizer.getErrorType(uploadedFileInformation.getErrorCode())) {
				case multiplefileuploader.widget.errorType.ERROR_TYPE_RECOVERABLE :
				this._onRecoverableError(response, uploadedFileInformation.getErrorCode());
				break;
				
				case multiplefileuploader.widget.errorType.ERROR_TYPE_NON_RECOVERABLE :
				this._onNonRecoverableError(response, uploadedFileInformation.getErrorCode());
				break;
		
				default: 
				throw "UNKNOWN EXCEPTION";
				break;
		}
	}
});	


	
dojo.declare("multiplefileuploader.widget._LifeCycleFactory", null, {
	 constructor: function() {	
	}, 
	createLifeCycle : function(uploadManager, uploadRequest) {	
		return new multiplefileuploader.widget._LifeCycle({}, uploadManager, uploadRequest );
	}
		
});		
	

dojo.declare("multiplefileuploader.widget._StatusLifeCycleFactory", null, {
	 constructor: function() {	
	}, 
	createStatusLifeCycle : function(uploadManager, uploadRequest) {	
		return new multiplefileuploader.widget._StatusLifeCycle({},uploadManager, uploadRequest);
	}
		
});		
	

dojo.declare("multiplefileuploader.widget._StatusLifeCycle", null, {
	 constructor: function(params, uploadManager, uploadRequest) {	 // UM maybe usefull for interval handler
   		this._uploadRequest = uploadRequest;
	    this._uploadManager = uploadManager;
		this._currentIDInformation = null;
		dojo.mixin(this, params);
	}, 	

	_onGetIDComplete : function(response) {
		this._currentIDInformation = new multiplefileuploader.widget._IDInformation(dojo.fromJson(response));
		this._uploadRequest.setAssociatedID(this._currentIDInformation.getID());
		
	},
	
	_onGetIDError : function(response) {		
		this._currentIDInformation = new multiplefileuploader.widget._IDInformation(dojo.fromJson(response));
		
	},
	
	_onStatusSuccess : function(response) {
		var statusInformation = new multiplefileuploader.widget._StatusInformation(dojo.fromJson(response));	
		this._uploadRequest.onStatusSuccess(statusInformation);
	},
	
	_onStatusError: function(response) {	
		clearInterval(this._uploadManager._interval);
		var statusInformation = new multiplefileuploader.widget._StatusInformation(dojo.fromJson(response));
		this._uploadRequest.onStatusError(statusInformation);	
	},
	
	getCurrentIDInformation : function() {
		return this._currentIDInformation;
	}

});	


dojo.declare("multiplefileuploader.widget._IDInformation", null, {
	constructor: function(data) {
		console.debug('in ID')
		this._data = data;	
		console.debug(this._data);
	}, 
	getID : function() {
		return this._data.id;
	}

}); 


dojo.declare("multiplefileuploader.widget._StatusInformation", null, {
	constructor: function(data) {
		this._data = data;	
		console.debug(this._data)
	}, 
	getID : function() {
		return this._data.id;
	},
	getUploadedSize : function() {
		return this._data.complete;
	},
	getTotalSize : function() {
		return this._data.total;
	}		

}); 
	
	
	/*
	 * Interface between UploadManager and UploadUnit
	 */
	
dojo.declare("multiplefileuploader.widget.FileUploadRequestMixin", null, {
	 constructor: function() {	
	}, 
	onBeforeUploadStart : function() {
		this._doOnBeforeUploadStart();	
	},	
	onAfterUploadStart : function() {	
		this._doOnAfterUploadStart();			
	},
	onUploadSuccess : function(uploadedFileInformation, uploadValuePrefix) {		
		this._doOnUploadSuccess(uploadedFileInformation, uploadValuePrefix);	
	},
	onUploadFailure : function(response, errorCode) {
		this._doOnUploadFailure(response, errorCode);		
	},
	onRetry : function() {
		this._doOnRetry();	
	},
	onUploadRequestEnqueued : function() {
		this._doOnUploadRequestEnqueued();		
	},
	getUploadingFilename : function () {
		return this._doGetUploadingFilename();	
	},	
	getFileInput : function () {
		return this._doGetFileInput();			
	},	
	setAssociatedID : function(currentID) {
		console.debug("in setAssociatedID "+ currentID)
		this._doSetAssociatedID(currentID);
	},
	getAssociatedID : function() {
	console.debug("in getAssociatedID, before _doGetAssociatedID ")
		return this._doGetAssociatedID();
	},
	
	
	/**** Status Information ****/

	onStatusSuccess : function(statusInformation) {
		this._doOnStatusSuccess(statusInformation);			
	},
	onStatusError : function(statusInformation) {
		this._doOnStatusError(statusInformation);		
	}
	
});	

dojo.declare("multiplefileuploader.widget._UploadedFileInformation", null, {
	constructor: function(data) {
		this._data = data;	
	}, 
	getName : function() {
		return this._data.name;
	},
	getMimeType : function() {
		return this._data.mimetype;
	},		
	getSize : function() {
		return this._data.size;
	},		
	getStatus : function() {
		return this._data.status;
	},
	getErrorCode : function() {
		return this._data.errorcode;
	},
	getID : function() {
		return this._data.id;
	}

}); 

 
dojo.declare("multiplefileuploader.widget._UploadQueue", null, {
	 constructor: function(uploadManager) {						
		this.uploadManager = uploadManager;		
		this._filesInQueue = new dojox.collections.Queue([]);
		this._currentUploadRequest = null;
		this._uploadFinished = 0;
		this._uploading = false;
		this._totalNumberOfUploadRequests = 0;	
		this._errorCategorizer = new multiplefileuploader.widget.ErrorCategorizer();	
	}, 
	onImageUploadRequest : function(uploadRequest) {
		this._filesInQueue.enqueue(uploadRequest);
		this._totalNumberOfUploadRequests++;	
	},	
	onBeforeUploadStart : function(uploadRequest) {
	    this._currentUploadRequest = uploadRequest;
	    this._filesInQueue.dequeue(uploadRequest);
		this._uploading = true;			
	},	
	onUploadSuccess : function() {
		this._uploading = false;
		this._uploadFinished++;		
		this.uploadManager._processNextUpload();				
	},
	
	onUploadFailure  : function(uploadRequest, errorCode) {
		this._uploading = false;
		if(this._errorCategorizer.getErrorType(errorCode) == multiplefileuploader.widget.errorType.ERROR_TYPE_RECOVERABLE)
			this._enqueueAtBegining(uploadRequest);
	},
	getTotalNumberOfUploadRequests : function () {
		return this._totalNumberOfUploadRequests;
	},	
	getNumberOfFinishedUploads : function () {
		return this._uploadFinished;
	},
	getNumberUploadsInProgress : function () {
		return this.getTotalNumberOfUploadRequests()-this.getNumberOfFinishedUploads();
	},	
	getPendingElements : function () {
		return this._filesInQueue.toArray();
	},	
	isUploading : function () {
		return this._uploading;
	},	
	getNextUploadRequest : function() {	
		if(!this.isUploading() && this._filesInQueue.count > 0)
			return this._filesInQueue.peek();
		else
			return null;
	},	
	getCurrentlyUploadingFilename : function() {		
		return this._currentUploadRequest.getUploadingFilename();
	},
	_enqueueAtBegining : function(uploadRequest) {
           var q = new dojox.collections.Queue([]);
           q.enqueue(uploadRequest);
           dojo.forEach(this._filesInQueue.toArray(), function(elt) {
              q.enqueue(elt);
           })
           this._filesInQueue = q;
	}
});
