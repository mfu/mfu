dojo.provide("multiplefileuploader.tests.Queue");
dojo.require("multiplefileuploader.widget.UploadManager");
dojo.require("multiplefileuploader.tests.FakeUploadRequest");
dojo.require("multiplefileuploader.widget.ErrorCategorizer");

	tests.register("multiplefileuploader.tests.Queue", [
	        
		
			function shouldEnqueueElementAtBeginning(t) {                      
					
					var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
					var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
					var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"})
					var f2 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f2"})
					var f3 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f3"})
					var filesQueue=new dojox.collections.Queue([f1, f2, f3]);
					dojo.forEach(filesQueue.toArray(), function(elt) {
						uploadQueue.onImageUploadRequest(elt);
					});
					uploadQueue._enqueueAtBegining(new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f4"}));
					t.assertEqual("f4", uploadQueue.getNextUploadRequest().getUploadingFilename()); 
	        },
			
			function enqueueAtTheBeginingShouldOnlyBeTriggeredWhenErrorTypeIsRecoverable(t) {
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");			
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"})
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				dojo.mixin(uploadQueue, {
					 _enqueueAtBegining: function(uploadRequest) {
						 this._enqueueAtBeginingWasCalled = true;
    				},
					verify : function() {
						
						t.assertTrue(this._enqueueAtBeginingWasCalled);
					}		
				});			
				uploadQueue.onUploadFailure(f1, "NETWORK_ERROR");
				uploadQueue.verify();
			},
			function shouldReturnNumberOfUploadRequestsWithEmptyQueue(t) {

					var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
					var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);				
					t.assertEqual(null, uploadQueue.getNextUploadRequest());	
			},		
			function shouldReturnNumberOfUploadRequests(t) {
				var uploadRequestNbr = 5; 			
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);			
				for(i =0; i<uploadRequestNbr; i++) {
					uploadQueue.onImageUploadRequest(new multiplefileuploader.tests.FakeUploadRequest({currentFilename: i}));
				}
				t.assertEqual(uploadRequestNbr, uploadQueue.getTotalNumberOfUploadRequests());	
			},			
			function shouldReturnNumberOfUploadsFinished(t) {
				var uploadRequestNbr = 5;
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				for(i =0; i<uploadRequestNbr; i++) {
					uploadQueue.onImageUploadRequest( new multiplefileuploader.tests.FakeUploadRequest({currentFilename: i}) );
					uploadQueue.onUploadSuccess();
				}				
				t.assertEqual(uploadRequestNbr, uploadQueue.getNumberOfFinishedUploads());	
				
			},
			function thereShouldBeNoFinishedUploads(t) {
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});					
				uploadQueue.onImageUploadRequest(f1);
				t.assertEqual(0, uploadQueue.getNumberOfFinishedUploads());				
			},
			
			function shouldBeUploadingAfterOnBeforeUploadStartEvent(t) { 
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});				
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onBeforeUploadStart();
				t.assertTrue(true, uploadQueue.isUploading());	
			},
			function shouldNotBeUploadingAfterOnUploadSuccessEvent(t) { 
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onUploadSuccess();
				t.assertFalse(uploadQueue.isUploading());	
			},		
			function shouldBeConsideredAsNonUploadingOnUploadFailure(t) { 
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});				
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onUploadFailure(f1, "NULL_JSON_EXCEPTION");
				t.assertFalse(uploadQueue.isUploading());	
			},	
			function shouldReturnNumberUploadsInProgress(t) { 
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				var f2 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f2"});
				var f3 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f3"});
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onImageUploadRequest(f2);
				uploadQueue.onImageUploadRequest(f3);
				t.assertEqual(3, uploadQueue.getNumberUploadsInProgress());	
			},								
			function oneElementShouldBePending(t) { 
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				uploadQueue.onImageUploadRequest(f1);
				t.assertEqual(1, uploadQueue.getPendingElements().length);	
				t.assertEqual(f1.getUploadingFilename(), uploadQueue.getPendingElements()[0].getUploadingFilename() );	
			},
			function shouldReturnEmptyWhenNoElementInPending(t) { 
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				t.assertEqual(0, uploadQueue.getPendingElements().length);	
				t.assertEqual([], uploadQueue.getPendingElements());	
			},			
			function shouldReturnNumberUploadInProgress(t) {
			
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				var f2 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f2"});
				var f3 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f3"});
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onImageUploadRequest(f2);
				uploadQueue.onImageUploadRequest(f3);
				uploadQueue.onUploadSuccess();
				t.assertEqual(2, uploadQueue.getNumberUploadsInProgress());						
			},
			
			function thereShouldHaveNoMoreUploadInProgressWhenAllUploadsAreProcessed(t) {
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				var f2 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f2"});
				var f3 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f3"});
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onImageUploadRequest(f2);
				uploadQueue.onImageUploadRequest(f3);
				uploadQueue.onUploadSuccess();
				uploadQueue.onUploadSuccess();
				uploadQueue.onUploadSuccess();				
				t.assertEqual(0, uploadQueue.getNumberUploadsInProgress());					
				
			},
			
			function shouldEnqueueElementOnUploadRequest(t) {
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				uploadQueue.onImageUploadRequest(f1);
				t.assertEqual("f1", uploadQueue.getNextUploadRequest().getUploadingFilename());		
			}, 			
			function shouldDequeueElementOnBeforeUploadStart(t) {
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				uploadQueue.onImageUploadRequest(f1);
				t.assertEqual(1, uploadQueue.getPendingElements().length);	
				uploadQueue.onBeforeUploadStart();
				t.assertEqual(0, uploadQueue.getPendingElements().length);													
			},
			
			function onUploadSuccessShouldTriggerProcessNextUpload(t) {
				var uploadManager = new multiplefileuploader.widget.UploadManager({}, "config_server", "config_status","config_UI");			
				dojo.mixin(uploadManager, {
					_processNextUpload: function(){
							 this._processNextUpload = true;
						},
						verify : function() {
							t.assertTrue(this._processNextUpload);
						}	
				});				
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(uploadManager);	

				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				uploadQueue.onImageUploadRequest(f1);								
				uploadQueue.onUploadSuccess()
				uploadManager.verify();	
			}	
			

	]
	);