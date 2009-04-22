dojo.provide("multiplefileuploader.tests.Queue");
dojo.require("multiplefileuploader.tests.DoNothingFakeUploadManager");
dojo.require("multiplefileuploader.widget.UploadManager");
dojo.require("multiplefileuploader.tests.FakeUploadRequest");

	tests.register("multiplefileuploader.tests.Queue", [
	        
		
			function shouldEnqueueElementAtBeginning(t) {                      
					
					var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
					var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
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
			function shouldReturnNumberOfUploadRequestsWithEmptyQueue(t) {

					var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
					var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);				
					t.assertEqual(null, uploadQueue.getNextUploadRequest());	
			},		
			function shouldReturnNumberOfUploadRequests(t) {
				var uploadRequestNbr = 5; 			
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);			
				for(i =0; i<uploadRequestNbr; i++) {
					uploadQueue.onImageUploadRequest(new multiplefileuploader.tests.FakeUploadRequest({currentFilename: i}));
				}
				t.assertEqual(uploadRequestNbr, uploadQueue.getTotalNumberOfUploadRequests());	
			},			
			function shouldReturnNumberOfUploadsFinished(t) {
				var uploadRequestNbr = 5;
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				for(i =0; i<uploadRequestNbr; i++) {
					uploadQueue.onImageUploadRequest( new multiplefileuploader.tests.FakeUploadRequest({currentFilename: i}) );
					uploadQueue.onUploadSuccess();
				}				
				t.assertEqual(uploadRequestNbr, uploadQueue.getNumberOfFinishedUploads());	
				
			},
			function thereShouldBeNoFinishedUploads(t) {
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});					
				uploadQueue.onImageUploadRequest(f1);
				t.assertEqual(0, uploadQueue.getNumberOfFinishedUploads());				
			},
			
			function shouldBeUploadingAfterOnBeforeUploadStartEvent(t) { 
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});				
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onBeforeUploadStart();
				t.assertTrue(true, uploadQueue.isUploading());	
			},
			function shouldNotBeUploadingAfterOnUploadSuccessEvent(t) { 
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onUploadSuccess();
				t.assertFalse(uploadQueue.isUploading());	
			},		
			function shouldBeConsideredAsNonUploadingOnUploadFailure(t) { 
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});				
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onUploadFailure();
				t.assertFalse(uploadQueue.isUploading());	
			},	
			function shouldReturnNumberUploadsInProgress(t) { 
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				var f2 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f2"});
				var f3 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f3"});
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onImageUploadRequest(f2);
				uploadQueue.onImageUploadRequest(f3);
				t.assertEqual(3, uploadQueue.getNumberUploadsInProgress());	
			},								
			function oneElementShouldBePending(t) { 
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				uploadQueue.onImageUploadRequest(f1);
				t.assertEqual(1, uploadQueue.getPendingElements().length);	
				t.assertEqual(f1.getUploadingFilename(), uploadQueue.getPendingElements()[0].getUploadingFilename() );	
			},
			function shouldReturnEmptyWhenNoElementInPending(t) { 
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				t.assertEqual(0, uploadQueue.getPendingElements().length);	
				t.assertEqual([], uploadQueue.getPendingElements());	
			},			
			function shouldReturnNumberUploadInProgress(t) {
			
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				var f2 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f2"});
				var f3 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f3"});
				uploadQueue.onImageUploadRequest(f1);
				uploadQueue.onImageUploadRequest(f2);
				uploadQueue.onImageUploadRequest(f3);
				uploadQueue.onUploadSuccess();
				t.assertEqual(2, uploadQueue.getNumberUploadsInProgress());						
			},
			
			function noMoreUploadInProgress(t) {
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
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
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				uploadQueue.onImageUploadRequest(f1);
				t.assertEqual("f1", uploadQueue.getNextUploadRequest().getUploadingFilename());		
			}, 			
			function shouldDequeueElementOnBeforeUploadStart(t) {
				var fakeUM = new multiplefileuploader.tests.DoNothingFakeUploadManager();
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(fakeUM);
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				uploadQueue.onImageUploadRequest(f1);
				t.assertEqual(1, uploadQueue.getPendingElements().length);	
				uploadQueue.onBeforeUploadStart();
				t.assertEqual(0, uploadQueue.getPendingElements().length);					
				t.assertEqual(null, uploadQueue.getPendingElements());								
			},
			
			function onUploadSuccessShouldTriggerProcessNextUpload(t) {
				var myMock = {
					 _processNextUpload: function() {
						 this._processUploadWasCalled = true;
    				},
					verify : function() {
						t.assertTrue(this._processUploadWasCalled);
					}
				};
				var uploadQueue =  new multiplefileuploader.widget._UploadQueue(myMock);				
				var f1 = new multiplefileuploader.tests.FakeUploadRequest({currentFilename: "f1"});
				uploadQueue.onImageUploadRequest(f1);								
				uploadQueue.onUploadSuccess()
				myMock.verify();	
			}	
	]
	);