dojo.provide("multiplefileuploader.tests.UploadManager");
dojo.require("multiplefileuploader.tests.FakeUploadRequest");
dojo.require("multiplefileuploader.tests.FakeUploadQueue");
dojo.require("multiplefileuploader.widget.AbstractUploadManager");
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
						 this.onImageUploadRequestTriggered = true;
					},
					verify : function() {
						t.assertTrue(this.onImageUploadRequestTriggered);
					}	
			});

			var uploadManager = new multiplefileuploader.tests.LoggingUploadManager({_uploadQueue: fakeQueue });		
			uploadManager.addToUploadQueue(fakeUploadRequest);
			fakeQueue.verify();			
		}
	]
	);
	
