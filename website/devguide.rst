MFU developers's guide
==================

Welcome to MFU developer's guide! 


.. contents:: 



Client-Server RESTful protocol :
===============================================

Here is a standard flow showing how does it works using progressBar indicator. If you are not using a determinated progress Bar, GET /Status wont be used

.. image:: _static/upload.png


Configuration when NOT using progress bar indicator
========================================================

 **Server side**
 
For this part, you dont need any server side configuration.You just need a folder with write right to indicate php or other where to upload files.

 **client side**
 
* Download the zip and extract files into your webapp folder.
* Switch progressBarMode parameter to false from MultipleFileUploader.js
* Remove uploadStatusURL parameter when instanciate mfu

	.. code-block:: javascript
	
		var params = { 
			ajaxUploadUrl: "php/upload.php"
		};
		var upload = new multiplefileuploader.widget.MultipleFileUploader( params , dojo.byId("uploadContainer") ); 	
		



Configuration when using progress bar indicator
===========================================================

**server side**

A sample PHP implementation is provided at your convenience. Feel free to contribute patches and other server-side implementations.

*for Linux* :

Enable/add php_apc extension in php.ini as php doesnt have built-in method to monitor upload::

  extension=apc.so

*for Windows* ::

  extension=php_apc.dll

Next, APC feature which monitors file uploads has to be enable. To do so, the apc.rfc1867 setting must be switched to On in php.ini::

  apc.rfc1867 = On

Dont forget to restart your webserver and make sure your changes have been successfully saved by checking with :

	.. code-block:: php
	
	 <?
		phpinfo();
	  ?> 

**client side**

In MultipleFileUploader.js::
 progressBarMode : true
 apc_php_enabled : true

When you instanciate mfu widget, you have to send uploadAjaxURL as well as uploadStatusURL :

	.. code-block:: javascript
	
		var params = { 
			ajaxUploadUrl: "php/upload.php", 
			uploadStatusURL : "php/status.php" 
		};
		var upload = new multiplefileuploader.widget.MultipleFileUploader( params , dojo.byId("uploadContainer") ); 	


MultipleFileUploader.js parameters
===============================================

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
		
		
how to connect MFU events to your application
===============================================

You probably want to connect your application to the different upload steps. MFU has several events which can be connected

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
	 
Example :
	.. code-block:: javascript
	
		dojo.connect(upload, 'onFinishedUpload', function(uploadedFileInformation) {
			//Here your code when a file is uploaded
		});



Different way to instanciate MFU
===============================================


MultipleFileUploader can be instanciated in two differents way :
The first one is the one above using javascript code

	.. code-block:: javascript
	
		var params = { 
			ajaxUploadUrl: "php/upload.php", 
			uploadStatusURL : "php/status.php" 
		};
		var upload = new multiplefileuploader.widget.MultipleFileUploader( params , dojo.byId("uploadContainer") ); 	

MultipleFileUploader can also be instanciated using html. When parsing DOM, dojo will automatically recognize the widget in dojoType declaration.

 	.. code-block:: html
 	
		<div dojoType="multiplefileuploader.widget.MultipleFileUploader"  
				ajaxUploadUrl="php/upload.php"  
				uploadStatusURL="php/status.php">		
		</div>
	
In that case, dont forget to add the following lines in a script tag, so that, dojo can parse DOM and instanciate MFU.

	.. code-block:: javascript
	
		dojo.require("dojo.parser");
		dojo.addOnLoad(function() {
		    dojo.parser.parse();
		});		
 
 
 

 
 
