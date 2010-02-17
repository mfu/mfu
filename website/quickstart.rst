Quickstart
=====================================

.. contents:: 


Multiple File Uploader with progress bar
==========================================

**Pre-requisites**

* A browser with javascript enabled
* dojotoolkit >= 1.4


Content of the distribution
-------------------------------------------------------------------------------

we provide you one package including different mfu version :

**mfu-dojo-embedded :** 
This package is used when you dont have dojo framework in your webapp. dojo/dijit/dojox and mfu are included in one js file.

**mfu-including-dijit-dojox-dependencies :**
This package provides two js file. dojo.js, which is a common dojo.js , and mfu.js in layer folder which includes dijit, dojox, and mfu dependencies in one file.

**mfu-src :**
This package includes mfu sources and units tests. We strongly recommend you to build mfu using `dojo build system <http://docs.dojocampus.org/build/index?action=show&redirect=build>`_  ( in order to include mfu in your dojo.js ) for performance. As a matter of fact, you will only have one GET for all widgets dependencies.

a PHP sample is included for server-side implementation.
For more information, take a look to  :doc:`devguide` 

Install and Configure the PHP server-side code
-------------------------------------------------------------------------------


- Extract all files from the archive 
- Choose one of the version you need
- Run the html with your favorite browser


our PHP sample provides the ability to upload  image to a remote pymager instance
If you dont want to forward file to pymager, leave upload_to = "local_directory"

Check out upload.conf in php folder::

  [general]
  ;upload_to = "pymager"
  upload_to = "local_directory"

  [local]
  upload_parameter_name = "upload"
  upload_folder_name = "uploadedFiles"

  [remote]
  host = "127.0.0.1"
  port =  "8000"
  pymager_upload_parameter_name = "file"
  user = "test"
  password = "test"
  proxy_url = ""
  proxy_port = ""

When the 'upload_to' item contains 'pymager', the PHP code will contact a pymager (add link to github code) instance whose address and credentials are described in the 'remote' section"


**server side**

A sample PHP implementation is provided at your convenience. Feel free to contribute patches and other server-side implementations.
Have a look to :ref:`devZone<configuration-when-using-progress-bar-indicator>` for more information


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

Configure the client-side code
-------------------------------------------------------------------------------

You have nothing to configure except URLs ( Status and Upload ) 

	.. code-block:: javascript
	
		var params = { 
			ajaxUploadUrl: "php/upload.php", 
			uploadStatusURL : "php/status.php" 
		};
		var upload = new multiplefileuploader.widget.MultipleFileUploader( params , dojo.byId("uploadContainer") ); 	


