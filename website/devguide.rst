MFU developers's guide
==========================

Welcome to MFU developer's guide! 


.. contents:: 



Client-Server RESTful protocol :
===============================================

Here is a flow diagram showing the interaction between the
client-side (MFU) and the server-side (e.g. the PHP implementation
provided as an example), when the 'progressBarMode' option is
activated. In this mode, MFU will accurately report the download
status by using a progress bar.

.. image:: _static/upload.png


Configuration when progress bar indicator is disabled
========================================================

 **Server side**
 
For this part, you dont need any server side configuration.You just need a folder with write right to indicate php or other where to upload files.

 **client side**
 
* Download the zip and extract files into your webapp folder.
* Switch the 'progressBarMode' parameter to false
* Remove the 'uploadStatusURL' parameter

.. code-block:: javascript

	/* upload setup */			
			ajaxUploadUrl : "",
			uploadParameterName : "upload",
			uploadValuePrefix : "uploadedFile_",
			uploadTimeout : "50000",

	/* progressBar setup */	
			progressBarMode : false,
	
	/* UI setup */
			inputWidth : 40,
			progressBarWidth : "15%",
			progressBarHeight : "15px",


.. code-block:: javascript
	
		var params = { 
			ajaxUploadUrl: "php/upload.php"
		};
		var upload = new multiplefileuploader.widget.MultipleFileUploader( params , dojo.byId("uploadContainer") ); 	
		



Configuration when progress bar indicator is enabled
===========================================================

This configuration is the one described in the :doc:`quickstart`



Instantiating MFU
===============================================


As a standard `Dijit <http://www.dojotoolkit.org/reference-guide/dijit.html#dijit>`_ widget, MFU can be
instantiated both programmatically and declaratively
To instantiate MFU  programmatically,  the following code snippet can be used :

	.. code-block:: javascript
	
		var params = { 
			ajaxUploadUrl: "php/upload.php", 
			uploadStatusURL : "php/status.php" 
		};
		var upload = new multiplefileuploader.widget.MultipleFileUploader( params , dojo.byId("uploadContainer") ); 	

To instantiate MFU declaratively, the following code snippet can be used :

 	.. code-block:: html
 	
		<div dojoType="multiplefileuploader.widget.MultipleFileUploader"  
				ajaxUploadUrl="php/upload.php"  
				uploadStatusURL="php/status.php">		
		</div>
	
Please note that when using the declarative instantiation, the
following dojo code should also be executed :

	.. code-block:: javascript
	
		dojo.require("dojo.parser");
		dojo.addOnLoad(function() {
		    dojo.parser.parse();
		});		


More information can be found in `dojo user manual. <http://www.dojotoolkit.org/reference-guide/>`_  

 
.. _ref-protocol:

Protocol
===============================================


Widget Reference
===============================================
 
 
Widget Parameter Reference
-------------------------------------------------------------------

the following parameters are all overridable when instanciate MultipleFileUploader.

	.. code-block:: javascript
	
		/* upload setup */			
				ajaxUploadUrl : "",
				uploadParameterName : "upload",
				uploadValuePrefix : "uploadedFile_",
				uploadTimeout : "50000",
				
			
		/* progressBar setup */	
				progressBarMode : true,
					uploadStatusURL : "",
					statusParameterName : "statusID",
					statusTimeout : "",
					getStatusInterval : "2000", 
					apc_php_enabled : true,
		
		/* UI setup */
				inputWidth : 40,
				progressBarWidth : "15%",
				progressBarHeight : "15px",
		
For instance, we want to override progressBarWidth as well as uploadTimeout :

	.. code-block:: javascript
	
		var params = { 
			progressBarWidth: "20%", 
			uploadTimeout : "3000" 
		};
		var upload = new multiplefileuploader.widget.MultipleFileUploader( params , dojo.byId("uploadContainer") ); 	

		
Widget Event Reference
----------------------------------------------------------

Your application can connect to MFU events using the standard dojo
event mechanism.


	.. code-block:: javascript
	
		/* triggered when a NETWORK error occured */
		 onError : function() {
		 }, 	 
		/* triggered when all the files in queue are uploaded */		 
		 onFinishedUploads : function() {
		 },	 
		/* triggered when a file is uploaded */
		 onFinishedUpload : function(uploadedFileInformation) { 	
		 },	
		/* triggered when a file is being uploaded */ 
		 onAfterUploadStart : function(uploadRequest) {
		 }
	 
For instance, it is possible to catch the onFinishedUpload event, by using the following code snippet

	.. code-block:: javascript
	
		dojo.connect(upload, 'onFinishedUpload', function(uploadedFileInformation) {
			//Here your code when a file is uploaded
		});
 
