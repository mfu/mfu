dojo.provide("multiplefileuploader.tests.UploadManager");
dojo.require("multiplefileuploader.tests.FakeUploadRequest");
dojo.require("multiplefileuploader.tests.FakeUploadQueue");
dojo.require("multiplefileuploader.widget.UploadManager");
dojo.require("multiplefileuploader.tests.LoggingUploadManager");

	tests.register("multiplefileuploader.tests.UploadManager", [
	        
		
	function onUploadRequestEnqueuedShouldBeTriggeredWhenWeAddToUploadQueue(t) {
			
		var uploadRequestMock = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
		dojo.mixin(uploadRequestMock, {
			onUploadRequestEnqueued: function(){
					 this.onUploadRequestEnqueued = true;
				},
				verify : function() {
					t.assertTrue(this.onUploadRequestEnqueued);
				}	
		});
	
			var uploadManager = new multiplefileuploader.tests.LoggingUploadManager();
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

			var uploadManager = new multiplefileuploader.tests.LoggingUploadManager({_uploadQueue: fakeQueue });		
			uploadManager.addToUploadQueue(fakeUploadRequest);
			fakeQueue.verify();			
		},
		
		function shouldProcessNextUploadWhenNothingIsUploading(t) {
			
			var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
			var fakeQueue = new multiplefileuploader.tests.FakeUploadQueue();	

			dojo.mixin(fakeQueue, {
					isUploading: function() {
						 this._isUploadingWasCalled = true;
						  return false;
					},				
					getNextUploadRequest : function() {
						return fakeUploadRequest;
					},
					verify : function() {
						t.assertTrue(this._isUploadingWasCalled); 
					}	
			});

			var uploadManager = new multiplefileuploader.tests.LoggingUploadManager({_uploadQueue: fakeQueue });		
			dojo.mixin(uploadManager, {
					_upload : function(uploadRequest) {

						 t.assertTrue(uploadRequest == fakeUploadRequest);						
						this._processNextUploadTriggered = true;				
					},
					verify : function() {
						t.assertTrue(this._processNextUploadTriggered);
					}			
			});
			uploadManager.addToUploadQueue(fakeUploadRequest);		
			uploadManager.verify();	
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

			var uploadManager = new multiplefileuploader.tests.LoggingUploadManager({_uploadQueue: fakeQueue });		
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
		
		function addToUploadQueueShouldCallOnFinishedUploadsWhenQueueIsEmpty(t) {
			
			//Smell : We should add a new abstraction : UploadStrategy
			
		},
		
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
		
			var uploadManager = new multiplefileuploader.tests.LoggingUploadManager({_uploadQueue: fakeQueue });		
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
				var mockDoUpload = function(uploadLifeCycle, uploadRequest){ };
				var mockPrepareForm = function(uploadRequest) { };
				
				var fakeLifeCycle = {
				   _onAfterUploadStart: function() {
					 this._onAfterUploadStartTriggered = true;
				   },
					verify : function() {
						t.assertTrue(this._onAfterUploadStartTriggered);
					}					   
				};

				var fakeLifeCycleFactory =  {
					createLifeCycle : function() {
						return fakeLifeCycle;
					}
				};
				
				var uploadManager = new multiplefileuploader.widget.UploadManager({
					_uploadQueue: fakeQueue, 
					onProgress :  mockOnProgress,
					upload : mockDoUpload,
					_prepareForm : mockPrepareForm,
					_lifeCycleFactory : fakeLifeCycleFactory
					});	
					
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
				
				var mockDoUpload = function(uploadLifeCycle, uploadRequest){ };
				var mockPrepareForm = function(uploadRequest) { };
				
				var fakeLifeCycle = {
				   _onAfterUploadStart: function() {
					 this._onAfterUploadStartTriggered = true;
				   },
					verify : function() {
						t.assertTrue(this._onAfterUploadStartTriggered);
					}					   
				};

				var fakeLifeCycleFactory =  {
					createLifeCycle : function() {
						return fakeLifeCycle;
					}
				};
				
				var uploadManager = new multiplefileuploader.widget.UploadManager({
					_uploadQueue: fakeQueue, 
					upload : mockDoUpload,
					_prepareForm : mockPrepareForm,
					_lifeCycleFactory : fakeLifeCycleFactory
					});	
				
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
		
	 function UploadShouldBeTriggeredWhenProcessNextUploadIsCalled(t) {
			
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
				var mockPrepareForm = function(uploadRequest) { };
				
				var fakeLifeCycle = {
				   _onAfterUploadStart: function() {
					 this._onAfterUploadStartTriggered = true;
				   },
					verify : function() {
						t.assertTrue(this._onAfterUploadStartTriggered);
					}					   
				};
				var fakeLifeCycleFactory =  {
					createLifeCycle : function() {
						return fakeLifeCycle;
					}
				};
				var uploadManager = new multiplefileuploader.widget.UploadManager({
					_uploadQueue: fakeQueue,
					onProgress:  mockOnProgress,
					_prepareForm : mockPrepareForm,
					_lifeCycleFactory : fakeLifeCycleFactory
					});	
				
				dojo.mixin(uploadManager, {		
					upload :  function(uploadLifeCycle, uploadRequest) {					
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
	
