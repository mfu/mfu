<?php
    require_once('FileUploader.php');
 

   if(isset($_GET['statusID'])) {
   	    $id =$_GET['statusID'];
	    $fu = FileUploader::getInstance();
	    $status = $fu->getUploadStatus($id);
		echo  json_encode($status); 	
   }
   else
   {
		$generatedID = rand()%5000;	  
		echo  "<textarea> { \"id\" : \"$generatedID\"}  </textarea>";  	
   }


?>
