<?php
$targetFolder = 'uploadedFiles/';
$uploadParameterName = "upload"; //input name of your form
$filename = basename($_FILES[$uploadParameterName]['name']);
$mimetype = $_FILES[$uploadParameterName]['type'];
$size = $_FILES[$uploadParameterName]['size'];
$status = "OK";
$errorcode ="";
$randomID = rand()%50000;  

      if ($_FILES[$filename]['error']) {
  
                switch ($_FILES[$filename]['error']){
                         case 1:
                         	$errorcode = "SIZE_EXCEEDED"; // UPLOAD_ERR_INI_SIZE
                         break;
                         case 4: 
 							$errorcode = "UPLOAD_ERR_NO_FILE";
                         break;
                }
  	 $status = "KO";
      } else if(empty($_FILES)) {
 	 		$errorcode = "SIZE_EXCEEDED"; //POST_MAX_SIZE
   			$status = "KO";
  	}	
  	 
 $jsonReturn = "<textarea> { \"id\" : \"$randomID\", \"name\" : \"$filename\", \"status\" : \"$status\", \"mimetype\" : \"$mimetype\", \"size\" : \"$size\" , \"errorcode\" : \"$errorcode\"} </textarea>";    
 if(move_uploaded_file($_FILES[$uploadParameterName]['tmp_name'], $targetFolder . $filename))
 	echo  $jsonReturn; //dojo needs a JSON result in a textarea
 else {
 	$status = "KO";
 	echo  $jsonReturn;
 }
?>

