dojo.provide("multiplefileuploader.tests.LifeCycle");
dojo.require("multiplefileuploader.widget.UploadManager");
dojo.require("multiplefileuploader.tests.FakeUploadRequest");
dojo.require("multiplefileuploader.tests.FakeErrorCategorizer");

tests.register("multiplefileuploader.tests.LifeCycle", [


function malFormedJSONShouldCallNonRecoverableError(t) {
	
	/* extra comma is intentionnally added*/
	var badJsonResponse = '{ "id" : "34787", "name" : ".xsession-errors",,  "status" : "KO", "mimetype" : "application/octet-stream", "size" : "7627" , "errorcode" : "NETWORK_ERROR"}';
	
	var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
	var uploadManager = new multiplefileuploader.widget.UploadManager();	
	var lifeCycle = new multiplefileuploader.widget._LifeCycle({},uploadManager, fakeUploadRequest );
	
	
	var lifeCycleMock = dojo.mixin(lifeCycle, {
			_onNonRecoverableError: function(){
					 this._onNonRecoverableErrorWasCalled = true;
				},
				verify : function() {
					t.assertTrue(this._onNonRecoverableErrorWasCalled);
				}		
	});
	lifeCycle._onUploadComplete(badJsonResponse, "upload_");
	lifeCycleMock.verify();

},
/* doesnt work in real condition, the server cannot be reached */
function nullJsonResponseShouldCallNonRecoverableError(t) {

	var nullJsonResponse = null;
	
	var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
	var uploadManager = new multiplefileuploader.widget.UploadManager();	
	var lifeCycle = new multiplefileuploader.widget._LifeCycle({},uploadManager, fakeUploadRequest );
	
	
	var lifeCycleMock = dojo.mixin(lifeCycle, {
			_onNonRecoverableError: function(){
					 this._onNonRecoverableErrorWasCalled = true;
				},
				verify : function() {
					t.assertTrue(this._onNonRecoverableErrorWasCalled);
				}		
	});
	lifeCycle._onUploadComplete(nullJsonResponse, "upload_");
	lifeCycleMock.verify();
	
},



function unrecoverableErrorsShouldContinueProcessingUploads(t) {

		var JsonResponse = '{ "id" : "34787", "name" : ".xsession-errors", "status" : "KO", "mimetype" : "application/octet-stream", "size" : "0" , "errorcode" : "SIZE_UPLOAD_ERR_NO_FILE"}';
		var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
		var uploadManager = new multiplefileuploader.widget.UploadManager();	
	    var fakeErrorCategorizer =  new multiplefileuploader.tests.FakeErrorCategorizer("ERROR_TYPE_NON_RECOVERABLE");	
		var lifeCycle = new multiplefileuploader.widget._LifeCycle({_errorCategorizer : fakeErrorCategorizer}, uploadManager, fakeUploadRequest );
		

		var onUploadFailureMock =
			dojo.mixin(fakeUploadRequest, {
				onUploadFailure: function(response, errorCode){
				this._onUploadFailureWasCalled = true;
				},
				verify : function() {
					t.assertTrue(this._onUploadFailureWasCalled);
				}	
			});
	
		var continueProcessingUploadsMock  =
			dojo.mixin(uploadManager, {
				_continueProcessingUploads: function(){
					 this._continueProcessingUploadsWasCalled = true;
				},
					verify : function() {
						t.assertTrue(this._continueProcessingUploadsWasCalled);
					}		
			});
		

		lifeCycle._onUploadComplete(JsonResponse, "upload_");
		continueProcessingUploadsMock.verify();
		onUploadFailureMock.verify();
			
	

},

function recoverableErrorsShouldstopProcessingUploads(t) {

		var JsonResponse = '{ "id" : "34787", "name" : ".xsession-errors", "status" : "KO", "mimetype" : "application/octet-stream", "size" : "0" , "errorcode" : "NETWORK_ERROR"}';
		var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
		var uploadManager = new multiplefileuploader.widget.UploadManager();	
	    var fakeErrorCategorizer =  new multiplefileuploader.tests.FakeErrorCategorizer("ERROR_TYPE_RECOVERABLE");	
		var lifeCycle = new multiplefileuploader.widget._LifeCycle({_errorCategorizer : fakeErrorCategorizer}, uploadManager, fakeUploadRequest );
		

		var onUploadFailureMock =
			dojo.mixin(fakeUploadRequest, {
				onUploadFailure: function(response, errorCode){
				this._onUploadFailureWasCalled = true;
				},
				verify : function() {
					t.assertTrue(this._onUploadFailureWasCalled);
				}	
			});
	
		var continueProcessingUploadsMock  =
			dojo.mixin(uploadManager, {
				_stopProcessingUploads: function(){
					 this._stopProcessingUploadsWasCalled = true;
				},
					verify : function() {
						t.assertTrue(this._stopProcessingUploadsWasCalled);
					}		
			});
		

		lifeCycle._onUploadComplete(JsonResponse, "upload_");
		continueProcessingUploadsMock.verify();
		onUploadFailureMock.verify();
			
	
	
},

function statusOKShouldCallOnUploadSuccess(t) {
		var JsonResponse = '{ "id" : "34787", "name" : ".xsession-errors", "status" : "OK", "mimetype" : "application/octet-stream", "size" : "7627" , "errorcode" : ""}';
		var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
		var uploadManager = new multiplefileuploader.widget.UploadManager();	

		var onUploadSuccessMock = dojo.mixin(fakeUploadRequest, {
			  onUploadSuccess: function(uploadedFileInformation, uploadValuePrefix){
					 this._onUploadSuccessWasCalled = true;
				},
				verify : function() {
					t.assertTrue(this._onUploadSuccessWasCalled);
				}		
		});

		dojo.mixin(uploadManager, {
			onFinishedUpload: function(uploadedFileInformation){
			}
		});
	
		dojo.mixin(uploadManager, {
			_continueProcessingUploads: function(){
			}
		});

		var lifeCycle = new multiplefileuploader.widget._LifeCycle({},uploadManager, fakeUploadRequest );

		lifeCycle._onUploadComplete(JsonResponse, "upload_");
		onUploadSuccessMock.verify();			
	
},

function statusOKShouldCallOnFinishedUpload(t) {
		var JsonResponse = '{ "id" : "34787", "name" : ".xsession-errors", "status" : "OK", "mimetype" : "application/octet-stream", "size" : "7627" , "errorcode" : ""}';
		var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
		var uploadManager = new multiplefileuploader.widget.UploadManager();	

		var onFinishedUploadMock = dojo.mixin(uploadManager, {
			  onFinishedUpload: function(uploadedFileInformation){
					 this._onFinishedUploadWasCalled = true;
				},
				verify : function() {
					t.assertTrue(this._onFinishedUploadWasCalled);
				}		
		});

		dojo.mixin(fakeUploadRequest, {
			onUploadSuccess: function(uploadedFileInformation, uploadValuePrefix){
			}
		});
	
		dojo.mixin(uploadManager, {
			_continueProcessingUploads: function(){
			}
		});

		var lifeCycle = new multiplefileuploader.widget._LifeCycle({},uploadManager, fakeUploadRequest );

		lifeCycle._onUploadComplete(JsonResponse, "upload_");
		onFinishedUploadMock.verify();			
	
},


function statusOKShouldCallContinueProcessingUploads(t) {
		var JsonResponse = '{ "id" : "34787", "name" : ".xsession-errors", "status" : "OK", "mimetype" : "application/octet-stream", "size" : "7627" , "errorcode" : ""}';
		var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
		var uploadManager = new multiplefileuploader.widget.UploadManager();	

		var continueProcessingUploadsMock = dojo.mixin(uploadManager, {
			  _continueProcessingUploads: function(){
					 this._continueProcessingUploadsWasCalled = true;
				},
				verify : function() {
					t.assertTrue(this._continueProcessingUploadsWasCalled);
				}		
		});

		dojo.mixin(fakeUploadRequest, {
			onUploadSuccess: function(uploadedFileInformation, uploadValuePrefix){
			}
		});
	
		dojo.mixin(uploadManager, {
			onFinishedUpload: function(uploadedFileInformation){
			}
		});

		var lifeCycle = new multiplefileuploader.widget._LifeCycle({},uploadManager, fakeUploadRequest );

		lifeCycle._onUploadComplete(JsonResponse, "upload_");
		continueProcessingUploadsMock.verify();			
	
},

function onUploadFailureShouldBeCalledWhenOnRecoverableErrorIsTriggered(t) {
	
	var JsonResponse = '{ "id" : "34787", "name" : ".xsession-errors", "status" : "KO", "mimetype" : "application/octet-stream", "size" : "7627" , "errorcode" : "NETWORK_ERROR"}';
	var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
	var uploadManager = new multiplefileuploader.widget.UploadManager();	
	
		var onUploadFailureMock = dojo.mixin(fakeUploadRequest, {
			  onUploadFailure: function(response, errorCode){
			  		 t.assertEqual(response, JsonResponse );	
					 this._onUploadFailureWasCalled = true;
				},
				verify : function() {
					t.assertTrue(this._onUploadFailureWasCalled);
				}		
		});
		dojo.mixin(uploadManager, {
			_stopProcessingUploads: function(){
			}
		});	


		var lifeCycle = new multiplefileuploader.widget._LifeCycle({},uploadManager, fakeUploadRequest );
		lifeCycle._onRecoverableError(JsonResponse, "upload_");
		onUploadFailureMock.verify();
	
	
},


function stopProcessingUploadsShouldBeCalledWhenOnRecoverableErrorIsTriggered(t) {
	
	var JsonResponse = '{ "id" : "34787", "name" : ".xsession-errors", "status" : "KO", "mimetype" : "application/octet-stream", "size" : "7627" , "errorcode" : "NETWORK_ERROR"}';
	var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );
	var uploadManager = new multiplefileuploader.widget.UploadManager();	
	
		var stopProcessingUploadsMock = dojo.mixin(uploadManager, {
			  _stopProcessingUploads: function(uploadRequest, errorType){
					t.assertEqual(fakeUploadRequest, uploadRequest )
					 this._stopProcessingUploadsWasCalled = true;
				},
				verify : function() {
					t.assertTrue(this._stopProcessingUploadsWasCalled);
				}		
		});
		dojo.mixin(fakeUploadRequest, {
			onUploadFailure: function(){
			}
		});	

		var lifeCycle = new multiplefileuploader.widget._LifeCycle({},uploadManager, fakeUploadRequest );
		lifeCycle._onRecoverableError(JsonResponse, "upload_");
		stopProcessingUploadsMock.verify();
	
},


function onAfterUploadStartShouldBeCalledWhenProcessNextUploadIsFired(t) {
	

				
		    var fakeUploadRequest = new multiplefileuploader.tests.FakeUploadRequest( {currentFilename: "f1"} );		
			var fakeQueue = new multiplefileuploader.tests.FakeUploadQueue();	

				dojo.mixin(fakeQueue, {		
						getNextUploadRequest : function() {					
							  return fakeUploadRequest;
						},
					onBeforeUploadStart: function(uploadRequest){
							 t.assertTrue(uploadRequest == fakeUploadRequest);
							 this._onBeforeUploadStartTriggered = true;
						}
				});
				
				dojo.mixin(fakeUploadRequest, {		
					onBeforeUploadStart: function(){
							 this._onBeforeUploadStartWasCalled = true;
						},
					verify : function() {
						t.assertTrue(this._onBeforeUploadStartWasCalled);
					}					
				});
				
	
				var mockOnProgress = function(queueStatus) { };
				var mockOnAfterUploadStart = function(uploadRequest) {};
				
				var fakeLifeCycle = {
				  _onUploadComplete : function() { },
				   _onAfterUploadStart: function() { 
				  	 this.onAfterUploadStartWasCalled = true;
				   },
				   verify : function() {
						t.assertTrue(this.onAfterUploadStartWasCalled);
				   }				   	   
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
					});	
					
				uploadManager._processNextUpload();
				fakeLifeCycle.verify();

	
}




]
);