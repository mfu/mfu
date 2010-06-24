Live demo
==========================

.. raw:: html
		
		<p>
			Dijit comes bundled with some themes.
		</p>
		<p>
			Choose your theme : <select id="themeSelector" onChange="dojo.removeClass(dojo.body());dojo.addClass(dojo.body(), this.options[this.selectedIndex].value);">
												<option value="tundra" selected="selected">tundra</option>
												<option value="claro">claro</option>
												<option value="nihilo">nihilo</option>
												<option value="soria">soria</option>
											</select>
		</p> 


			<div id="uploadContainer"></div>


				
		<div id="headmsg"></div>
		<div id="result"></div>	
	
	<br />
	<p>
		This sample application uses the <a href="http://github.com/samokk/pymager">pymager </a> backend to store the uploaded images and provide you with thumbnails. This means you have to input image files (JPEG, ..)<br />
		However, MFU does not itself depend on pymager. This means you can use it with any system, and choose to accept whatever file formats you want to.	
	</p>

	<script type="text/javascript">

		dojo.addClass(dojo.body(), "tundra");
        dojo.registerModulePath("samples","../../");
		
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
				
				});
	    });
		
		
	</script>