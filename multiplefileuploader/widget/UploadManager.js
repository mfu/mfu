dojo.provide("multiplefileuploader.widget.UploadManager");
dojo.require("multiplefileuploader.widget.IframeUploadStrategy");
dojo.require("dojox.collections.Queue");
dojo.require("dojox.collections.ArrayList");

dojo.declare("multiplefileuploader.widget.UploadManager", null, {
	constructor: function(params, targetPost, timeout,  uploadParameterName, uploadValuePrefix){
		this._offline = false;
		this._uploadQueue = new multiplefileuploader.widget._UploadQueue(this);	
		this._lifeCycleFactory = new multiplefileuploader.widget._LifeCycleFactory();
		this._uploadStrategy = new multiplefileuploader.widget.IframeUploadStrategy(targetPost, timeout, uploadParameterName ,uploadValuePrefix);		
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
	

	/* protected */	_processNextUpload: function() {		
			var uploadRequest = this._uploadQueue.getNextUploadRequest();		
			if(uploadRequest !== null && this._offline == false) {						
				this._upload(uploadRequest);	
			}
			if(uploadRequest == null) {
				this.onFinishedUploads();
			}
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
				lifeCycle._onUploadError(response);	
			}
		}; 
			
		this._uploadStrategy.upload(uploadRequest, callbacks);	
		lifeCycle._onAfterUploadStart();	
	}, 


	
	/* protected */ _stopProcessingUploads : function(uploadRequest, errorType) {
		if(errorType == "ERROR_TYPE_RECOVERABLE")
			this._offline = true;
		this._uploadQueue.onUploadFailure(uploadRequest, errorType);	
	},	
	
	/* protected */ _continueProcessingUploads : function() {
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
	 constructor: function(uploadManager, uploadRequest) {	
		this._uploadManager = uploadManager;
		this._uploadRequest =  uploadRequest;
	}, 	
	_onUploadComplete : function(response, uploadValuePrefix) {	
		try {
			var jsonResponse = dojo.fromJson(response);
			var uploadedFileInformation = new multiplefileuploader.widget._UploadedImageInformation(jsonResponse);
			if(uploadedFileInformation.getStatus() == "KO") {
				this.onUploadFailure(response,  uploadedFileInformation);
			}
			else {
				this._uploadRequest.onUploadSuccess(uploadedFileInformation, uploadValuePrefix);
				this._uploadManager.onFinishedUpload(uploadedFileInformation);
			}
			this._uploadManager._continueProcessingUploads();			
		}
		catch (ex){ // add switch and throw to only throw MALFORMED JSON
			this._onResponseError(response);
		}	
	},
	_onUploadError : function(response) {
		console.debug("on upload error");
		this._uploadRequest.onUploadFailure(response, 'NETWORK_ERROR');
		this._uploadManager._stopProcessingUploads(this._uploadRequest, "ERROR_TYPE_RECOVERABLE");		
	},
	_onResponseError : function(response) {
		console.debug("on _onResponseError");
		this._uploadRequest.onUploadFailure(response, 'MALFORMED_JSON_EXCEPTION');	
		this._uploadManager._stopProcessingUploads(this._uploadRequest, "ERROR_TYPE_NON_RECOVERABLE");	
	},
	onUploadFailure : function(response, uploadedFileInformation) {					
		this._uploadRequest.onUploadFailure(response, uploadedFileInformation.getErrorCode());
	},	
	_onAfterUploadStart : function() {
		this._uploadRequest.onAfterUploadStart();	
	}
});	


	
dojo.declare("multiplefileuploader.widget._LifeCycleFactory", null, {
	 constructor: function() {	
	}, 
	
	createLifeCycle : function(uploadManager, uploadRequest) {	
		return new multiplefileuploader.widget._LifeCycle(uploadManager, uploadRequest );
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
	onUploadFailure : function(error, reason) {
		this._doOnUploadFailure(error, reason);		
	},
	onRetry : function() {
		this._doOnRetry();	
	},
	onUploadRequestEnqueued : function() {
		this._doOnUploadRequestEnqueued();		
	},
	getFileInput : function () {
		return this._doGetFileInput();			
	}	
});	

dojo.declare("multiplefileuploader.widget._UploadedImageInformation", null, {
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
	
	onUploadFailure  : function(uploadRequest, errorType) {
		this._uploading = false;
		if(errorType == "ERROR_TYPE_RECOVERABLE")
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
		if(!this._uploading && this._filesInQueue.count > 0)
			return this._filesInQueue.peek();
		else
			return null;
	},	
	getCurrentlyUploadingFilename : function() {		
		return this._currentUploadRequest.unit.getFilename();
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
