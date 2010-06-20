Quickstart
=====================================

.. contents:: 


Multiple File Uploader with progress bar
==========================================

**Pre-requisites**

* A javascript-compatible web browser
* dojotoolkit >= 1.4


Content of the distribution
-------------------------------------------------------------------------------

MFU is available in several packages :

**mfu-dojo-embedded :** 
You should use this package when you do not explicitly use the dojo framework within your web application.   It contains a combination of dojo, dijit, dojox and mfu packed in a single stripped-down, minified, optimized file that you can directly include in your web pages." This is the easiest way to use MFU.

**mfu-including-dijit-dojox-dependencies :**
This package provides two javascript files : dojo.js that contains the core dojo system, and mfu.js that provides MFU with all its dojo,dijit and dojox dependencies. You should use this package when you use dojo in your application but do not yet have a complex build that optimizes your javascript code. It is not the most efficient way, but it is surely a good compromise between optimization and ease of use

**mfu-src :**
This package includes the complete set of MFU source files and the unit tests that we use for non-regression. You should use this package when you use dojo within your web application and already have a complex dojo build to optimize everything according to your needs. This is the recommended and most efficient way to use MFU as you can completly customize everything.


a PHP sample is included for server-side implementation.
For more information, take a look at  :doc:`documentation` 

Install and Configure the PHP server-side code
-------------------------------------------------------------------------------


- Extract all files from the archive 
- Choose the package that is suited to your needs
- Run the html with your favorite browser


The sample PHP implementation provides the ability to either :

* Upload the image to a remote  `Pymager <http://github.com/samokk/pymager>`_  instance
* Upload the image to a local directory.

If you do not want to integrate with  `Pymager <http://github.com/samokk/pymager>`_ , leave the upload_to configuration item to "local_directory"

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
 path = "/pymager"
 user = "test"
 password = "test"
 proxy_url = ""
 proxy_port = ""

When the ‘upload_to’ item contains ‘pymager’, the PHP code will contact a `Pymager <http://github.com/samokk/pymager>`_  instance whose address and credentials are described in the ‘remote’ section

Feel free to contribute patches or completly different server-side implementations. Fore more information on the RESTful/JSON-based protocol that is used between the server and the client, please take a look at the developer's guide, :ref:`ref-protocol` section.

  
*for Linux* :

enable the php_apc extension in php.ini as PHP does not support monitoring uploads by default::

  extension=apc.so

*for Windows* ::

  extension=php_apc.dll

Its not quite easy to find a ready to use php_apc.dll for your php version. You might take a look at `http://www.sitebuddy.com/PHP/Accelerators/Alternative/Cache/APC <http://www.sitebuddy.com/PHP/Accelerators/Alternative/Cache/APC>`_

If you dont find the module for your php version, you should google it. 

Once installed, turn on  APC feature in php.ini, which tells the apc extension to monitor file uploads::

  apc.rfc1867 = On

By default, apache restrict maximum file size to 2Mo.
Change the following parameters according to your needs ::

  upload_max_filesize = 50M
  post_max_size = 50M


Do not forget to restart your web server and you can use the following PHP script to check that the APC extension is active :

	.. code-block:: php
	
	 <?
		phpinfo();
	  ?> 

Configure the client-side code
-------------------------------------------------------------------------------

You have nothing to configure except URLs ( Upload and Status ) 

	.. code-block:: javascript
	
		var params = { 
			ajaxUploadUrl: "php/upload.php", 
			uploadStatusURL : "php/status.php" 
		};
		var upload = new multiplefileuploader.widget.MultipleFileUploader( params , dojo.byId("uploadContainer") ); 	


