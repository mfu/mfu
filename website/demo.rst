Live demo
==========================

.. raw:: html
		
		<p>
			Dijit comes bundled with three themes.
			MFU is compliant with dijit/dojo's themes
		</p>
		
		<h2>Soria theme</h2>
		<div class="soria">
			<div id="uploadContainer"></div>
		</div>
		<h2>Claro theme</h1>
		<div class="claro">
			<div id="uploadContainer1"></div>
		</div>
		<h2>Tundra theme</h1>		
		<div class="tundra">
			<div id="uploadContainer2"></div>
		</div>		
		<h2>Nihilo theme</h1>		
		<div class="nihilo">
			<div id="uploadContainer3"></div>
		</div>	
				
		<div id="headmsg"></div>
		<div id="result"></div>	
	
	<br />
	<p>
		This sample application uses the <a href="http://github.com/samokk/pymager">pymager </a> backend to store the uploaded images and provide you with thumbnails. This means you have to input image files (JPEG, ..)<br />
		However, MFU does not itself depend on pymager. This means you can use it with any system, and choose to accept whatever file formats you want to.	
	</p>

	<script type="text/javascript">
		dojo.registerModulePath("multiplefileuploader","../../src/multiplefileuploader");
		dojo.registerModulePath("samples","../../samples");
		
		dojo.addOnLoad( function(){
	       		dojo.require("multiplefileuploader.widget.MultipleFileUploader");
				dojo.require("samples.mfudemo.pymagerConf");
				dojo.addOnLoad( function(){			 					
					var params = { 
								ajaxUploadUrl: "../@MFUDEMO_NAME@/samples/php/upload.php", 
								 uploadStatusURL : "../@MFUDEMO_NAME@/samples/php/status.php" 
					};			
					var upload = new multiplefileuploader.widget.MultipleFileUploader( params, dojo.byId("uploadContainer") ); 	
						dojo.connect(upload, 'onFinishedUpload', function(uploadedFileInformation) {  						
							samples.mfudemo.pymagerConf.addHeadMsg();
							samples.mfudemo.pymagerConf.generateLinks(uploadedFileInformation);
					});
					var upload1 = new multiplefileuploader.widget.MultipleFileUploader( params, dojo.byId("uploadContainer1") ); 	
						dojo.connect(upload1, 'onFinishedUpload', function(uploadedFileInformation) {  						
							samples.mfudemo.pymagerConf.addHeadMsg();
							samples.mfudemo.pymagerConf.generateLinks(uploadedFileInformation);
					});
					var upload2 = new multiplefileuploader.widget.MultipleFileUploader( params, dojo.byId("uploadContainer2") ); 	
						dojo.connect(upload2, 'onFinishedUpload', function(uploadedFileInformation) {  						
							samples.mfudemo.pymagerConf.addHeadMsg();
							samples.mfudemo.pymagerConf.generateLinks(uploadedFileInformation);
					});
					var upload3 = new multiplefileuploader.widget.MultipleFileUploader( params, dojo.byId("uploadContainer3") ); 	
						dojo.connect(upload3, 'onFinishedUpload', function(uploadedFileInformation) {  						
							samples.mfudemo.pymagerConf.addHeadMsg();
							samples.mfudemo.pymagerConf.generateLinks(uploadedFileInformation);
					});

					
				});
	    });
		
		
	</script>