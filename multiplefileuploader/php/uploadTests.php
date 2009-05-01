<?php	
	
	$uploadParameterName = "upload"; //input name of your html form
	$uploadParameterNameToRemoteServer = "files"; // 

	$filename = basename($_FILES[$uploadParameterName]['name']);
	$mimetype = $_FILES[$uploadParameterName]['type'];
	$size = $_FILES[$uploadParameterName]['size'];
	$status = "OK";
	$errorcode ="";
	$randomID = rand()%50000;
	
	
 	$jsonReturn = "<textarea> { \"id\" : \"$randomID\", \"name\" : \"$filename\",  \"status\" : \"$status\", \"mimetype\" : \"$mimetype\", \"size\" : \"$size\" , \"errorcode\" : \"$errorcode\"}</textarea>";    
	echo  $jsonReturn; //return JSON result in a textarea for UI rendering	
	
	
	?>