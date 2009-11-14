dojo.provide("multiplefileuploader.tests.UploadManager");
dojo.require("multiplefileuploader.widget.UploadManager");
dojo.require("multiplefileuploader.tests.FakeUploadRequest");
dojo.require("multiplefileuploader.tests.FakeUploadQueue");
dojo.require("multiplefileuploader.tests.FakeUploadStrategy");
dojo.require("multiplefileuploader.tests.FakeUploadStatusStrategy");


	tests.register("multiplefileuploader.tests.UploadManager", [
	        
		
	function onUploadRequestEnqueuedShouldBeTriggeredWhenWeAddToUploadQueue(t) {
			
	
	    var fakeQueue = new multiplefileuploader.tests.FakeUploadQueue();	
		var uploadRequestMock = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
		dojo.mixin(uploadRequestMock, {
			onUploadRequestEnqueued: function(){
					 this.onUploadRequestEnqueuedWasCalled = true;
				},
				verify : function() {
					t.assertTrue(this.onUploadRequestEnqueuedWasCalled);
				}	
		});

			var uploadManager = new multiplefileuploader.widget.UploadManager({_uploadQueue  : fakeQueue}, "config_server", "config_status");	
			dojo.mixin(uploadManager, {
				_processNextUpload : function() {}
			});

			uploadManager.addToUploadQueue(uploadRequestMock);
			uploadRequestMock.verify();
		},
		
		
		function onImageUploadRequestShouldBeTriggeredWhenWeAddToUploadQueue(t) {
			
			var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
			dojo.mixin(fakeUploadRequest, { onUploadRequestEnqueued: function(){			}});			
			var fakeQueue = new multiplefileuploader.tests.FakeUploadQueue();		
			dojo.mixin(fakeQueue, {
				onImageUploadRequest: function(uploadRequest){
						 t.assertTrue(uploadRequest == fakeUploadRequest);
						 this._onImageUploadRequestTriggered = true;
					},
					verify : function() {
						t.assertTrue(this._onImageUploadRequestTriggered);
					}	
			});

			var uploadManager = new multiplefileuploader.widget.UploadManager({_uploadQueue  : fakeQueue}, "config_server", "config_status");	
			dojo.mixin(uploadManager, {
				_processNextUpload : function() {}
			});
			uploadManager.addToUploadQueue(fakeUploadRequest);
			fakeQueue.verify();			
		},
		
		
		function addToUploadQueueShouldNotProcessNextUploadWhenUploading(t) {
			var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
			var fakeQueue = new multiplefileuploader.tests.FakeUploadQueue();	

			dojo.mixin(fakeQueue, {
					isUploading: function() {
						  this._isUploadingWasCalled = true;
						  return true;
					},				
					getNextUploadRequest : function() {
						return fakeUploadRequest;
					},
					verify : function() {
						t.assertTrue(this._isUploadingWasCalled); 
					}	
			});

			var uploadManager = new multiplefileuploader.widget.UploadManager({_uploadQueue  : fakeQueue}, "config_server", "config_status");		
			dojo.mixin(uploadManager, {
					_upload : function(uploadRequest) {
						 t.assertTrue(uploadRequest == fakeUploadRequest);						
						 this._processNextUploadTriggered = true;				
					},
					verify : function() {
						t.assertFalse(this._processNextUploadTriggered);
					}			
			});
			uploadManager.addToUploadQueue(fakeUploadRequest);		
			uploadManager.verify();	
			fakeQueue.verify();			
			
		},
		
		function processNextUploadShouldCallOnFinishedUploadsWhenQueueIsEmpty(t) {
			

		var uploadManager = new multiplefileuploader.widget.UploadManager({},  "config_server", "config_status");	
		
		dojo.mixin(uploadManager, {
				onFinishedUploads : function() {
					 this._onFinishedUploads = true;				
				},
				verify : function() {
					t.assertTrue(this._onFinishedUploads);
				}	
						
		});		
		uploadManager._processNextUpload();
		uploadManager.verify();					
			
		},
		
		
		
		
		/*
		
		function retryAllUploadsShouldUploadTheNextRequestInQueue(t) {
			
			var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );		
			dojo.mixin(fakeUploadRequest, { onRetry: function(){			}});				
			var fakeQueue = new multiplefileuploader.tests.FakeUploadQueue();	

			dojo.mixin(fakeQueue, {		
					getNextUploadRequest : function() {
						  this._getNextUploadRequest = true;						
						  return fakeUploadRequest;
					},
					verify : function() {
						t.assertTrue(this._getNextUploadRequest); 
					}	
			});			
		
			var uploadManager = new multiplefileuploader.widget.UploadManager({_uploadQueue  : fakeQueue}, "config_server", "config_status");			
			dojo.mixin(uploadManager, {
					_upload : function(uploadRequest) {
						 t.assertTrue(uploadRequest == fakeUploadRequest);						
						 this._processNextUploadTriggered = true;				
					},
					verify : function() {
						t.assertTrue(this._processNextUploadTriggered);
					}			
			});
			uploadManager.retryAllUploads();		
			uploadManager.verify();	
			fakeQueue.verify();		
			
		},
		
		function onBeforeUploadStartShouldBeTriggeredWhenProcessNextUploadIsCalled(t) {
	      
		    var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );		
			var fakeQueue = new multiplefileuploader.tests.FakeUploadQueue();	

				dojo.mixin(fakeQueue, {		
						getNextUploadRequest : function() {					
							  return fakeUploadRequest;
						},
					onBeforeUploadStart: function(uploadRequest){
							 t.assertTrue(uploadRequest == fakeUploadRequest);
							 this._onBeforeUploadStartTriggered = true;
						},
					verify : function() {
						t.assertTrue(this._onBeforeUploadStartTriggered);
					}					
				});
	
				dojo.mixin(fakeUploadRequest, {		
					onBeforeUploadStart: function(){
							 this._onBeforeUploadStartTriggered = true;
						},
					verify : function() {
						t.assertTrue(this._onBeforeUploadStartTriggered);
					}					
				});
				
	
				var mockOnProgress = function(queueStatus) { };
				
				var mockOnAfterUploadStart = function(uploadRequest) {};
	
				var fakeLifeCycle = {
				   _onAfterUploadStart: function() { },
				   _onUploadComplete : function() { }				   
				};

				var fakeLifeCycleFactory =  {
					createLifeCycle : function() {
						return fakeLifeCycle;
					}
				};

				var fakeUploadStrategy = new multiplefileuploader.tests.FakeUploadStrategy('{ "id" : "34787", "name" : ".xsession-errors", "status" : "OK", "mimetype" : "application/octet-stream", "size" : "7627" , "errorcode" : ""}');
				
				var uploadManager = new multiplefileuploader.widget.UploadManager({
					_uploadQueue: fakeQueue, 
					onProgress :  mockOnProgress,
					onAfterUploadStart : mockOnAfterUploadStart,
					_lifeCycleFactory : fakeLifeCycleFactory,
					_uploadStrategy : fakeUploadStrategy
					}, "config_server", "config_status");	
					
				uploadManager._processNextUpload();
				fakeUploadRequest.verify();
				fakeQueue.verify();				
		},
		
	 function fireProgressShouldBeTriggeredWhenProcessNextUploadIsCalled(t) {
			
			var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );		
			var fakeQueue = new multiplefileuploader.tests.FakeUploadQueue();	
	
				dojo.mixin(fakeQueue, {		
						getNextUploadRequest : function() {					
							  return fakeUploadRequest;
						}		
				});
	
				dojo.mixin(fakeUploadRequest, {		
					onBeforeUploadStart: function(){ }			
				});

				var fakeLifeCycle = {
				   _onAfterUploadStart: function() { },
				   _onUploadComplete : function() { }				   
				};

				var fakeLifeCycleFactory =  {
					createLifeCycle : function() {
						return fakeLifeCycle;
					}
				};
			
		    	var fakeUploadStrategy = new multiplefileuploader.tests.FakeUploadStrategy('{ "id" : "34787", "name" : ".xsession-errors", "status" : "OK", "mimetype" : "application/octet-stream", "size" : "7627" , "errorcode" : ""}');
				var mockOnAfterUploadStart = function(uploadRequest) {};
				
				var uploadManager = new multiplefileuploader.widget.UploadManager({
					_uploadQueue: fakeQueue, 
					_uploadStrategy : fakeUploadStrategy,
					onAfterUploadStart : mockOnAfterUploadStart,
					_lifeCycleFactory : fakeLifeCycleFactory
					}, "config_server", "config_status");	
				
				dojo.mixin(uploadManager, {		
					fireProgress : function() {					
						this._fireProgress= true;
					},
					verify : function() {
						t.assertTrue(this._fireProgress);
					}			
				});	
								
				uploadManager._processNextUpload();
				uploadManager.verify();	
		},
		*/
	 function uploadShouldBeTriggeredWhenProcessNextUploadIsCalled(t) {
			
			var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );		
			var fakeQueue = new multiplefileuploader.tests.FakeUploadQueue();	
	
				dojo.mixin(fakeQueue, {		
						getNextUploadRequest : function() {					
							  return fakeUploadRequest;
						}		
				});
	
				dojo.mixin(fakeUploadRequest, {		
					onBeforeUploadStart: function(){ }			
				});

				var mockOnProgress = function(queueStatus) { };
				
				var mockOnAfterUploadStart = function(uploadRequest) {};
				
				var fakeLifeCycle = {
				   _onAfterUploadStart: function() { },
				   _onUploadComplete : function() { }				   
				};
				
				var fakeLifeCycleFactory =  {
					createLifeCycle : function() {
						return fakeLifeCycle;
					}
				};
				
				var callbacks = {
					onSuccess : function(response, uploadValuePrefix) { },
					onError : function(response) { }
				}; 				
				
		    	var fakeUploadStrategy = new multiplefileuploader.tests.FakeUploadStrategy('{ "id" : "34787", "name" : ".xsession-errors", "status" : "OK", "mimetype" : "application/octet-stream", "size" : "7627" , "errorcode" : ""}');
				
				var uploadManager = new multiplefileuploader.widget.UploadManager({
					_uploadQueue: fakeQueue,
					onProgress:  mockOnProgress,
					onAfterUploadStart : mockOnAfterUploadStart,
					_uploadStrategy : fakeUploadStrategy,					
					_lifeCycleFactory : fakeLifeCycleFactory
					}, "config_server", "config_status");	
				
				dojo.mixin(uploadManager, {		
					upload :  function(uploadRequest) {					
						t.assertTrue(uploadRequest == fakeUploadRequest);
						this.upload= true;
					},
					verify : function() {
						t.assertTrue(this.upload);
					}			
				});	
								
				uploadManager._processNextUpload();
				uploadManager.verify();	
		}		
		
		
	]
	);
	
