dojo.provide("multiplefileuploader.widget.AbstractUploadManager");
dojo.require("dojox.collections.Queue");
dojo.require("dojox.collections.ArrayList");

dojo.declare("multiplefileuploader.widget.AbstractUploadManager", null, {
	constructor: function(params){
		this._offline = false;
		this._uploadQueue = new multiplefileuploader.widget._UploadQueue(this);
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
		var uploadLifeCycle = new multiplefileuploader.widget._UploadLifeCycle(this, uploadRequest);		
		this._OnUploadQueueReadyToProcessNextUpload = false;
		this._uploadQueue.onBeforeUploadStart(uploadRequest);
		uploadRequest.onBeforeUploadStart();		
		this.fireProgress();	
		this._doUpload(uploadLifeCycle, uploadRequest);		
	}, 
	
	/* protected */ _stopProcessingUploads : function(uploadRequest) {
		this._offline = true;
		this._uploadQueue.onUploadFailure(uploadRequest);	
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


dojo.declare("multiplefileuploader.widget._UploadLifeCycle", null, {
	 constructor: function(uploadManager, uploadRequest) {	
		this._uploadManager = uploadManager;
		this._uploadRequest = uploadRequest;	
	}, 
	_onUploadComplete : function(response, uploadValuePrefix) {
		var uploadedFileInformation = new multiplefileuploader.widget._UploadedImageInformation(dojo.fromJson(response));
		if(uploadedFileInformation.getStatus() == "KO") {
			this.onUploadFailure(response,  uploadedFileInformation);
		}
		else {
			this._uploadRequest.onUploadSuccess(uploadedFileInformation, uploadValuePrefix);
		}
		this._uploadManager._continueProcessingUploads();		
	},
	_onUploadError : function(response) {
		this._uploadRequest.onUploadFailure(response, 'NETWORK_ERROR');
		this._uploadManager._stopProcessingUploads(this._uploadRequest);			
	},
	onUploadFailure : function(response, uploadedFileInformation) {
		this._uploadRequest.onUploadFailure(response, uploadedFileInformation.getErrorCode());
	},	
	_onAfterUploadStart : function() {
		this._uploadRequest.onAfterUploadStart();	
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
		console.debug("onUploadRequestEnqueued in FileUploadRequestMixin");
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
	
	onUploadFailure  : function(uploadRequest) {
		this._uploading = false;
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
