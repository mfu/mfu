<?php
    require_once('FileUploader.php');
 
   if(isset($_GET['statusID'])) {
   	    $id = $_GET['statusID'];
	    $fu = FileUploader::getInstance();
	    $status = $fu->getUploadStatus($id);
		echo json_encode($status); 	
   }
   else
   {
		$idinfo = array( 'id' => md5 (uniqid ()) );
		echo "<textarea>".json_encode($idinfo)."</textarea>";  	
   }

?>
