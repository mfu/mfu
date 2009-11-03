<?php
	require_once( 'http.inc' );

if(empty($_SESSION)) {
	session_start();
}

if(array_key_exists('statusID', $_POST)) {
 	$ID = $_POST['statusID'];
 	


 } 	






	$uploadParameterName = "upload"; //input name of your html form
	$uploadParameterNameToRemoteServer = "files"; // 

	$filename = basename($_FILES[$uploadParameterName]['name']);
	$_SESSION['filename'] = $filename;
	
	$mimetype = $_FILES[$uploadParameterName]['type'];
	$size = $_FILES[$uploadParameterName]['size'];
	$_SESSION['totalsize'] = $size;
	
	$status = "OK";
	$errorcode ="";
	//we could put ID in session 
	$_SESSION['file'] = $_FILES[$uploadParameterName]['tmp_name'];


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
  		


	$fields =	array( 	'' => '',
						'' => ''
				);
	
	$files = array();
	
	
	$files[] = 	array(	'name' => 'file',
					'content-type' => 'text/plain',
					'filename' => $filename,
					'data' => file_get_contents($_FILES[$uploadParameterName]['tmp_name'])
		);	
	

//	$http_client->use_proxy( 'ns.crs.org.ni', 3128 );

	$http_client = new http( HTTP_V11, false , Array('test','test'));
	$http_client->host = '127.0.0.1';
	$http_client->port = '8000';	
	$http_client->multipart_post( '/original/'.$ID, $fields, $files , false);


	switch($http_client->_response->get_status()) {
		
		case "400" :  
		$errorcode = "UNSUPPORTED_FORMAT";
		$status = "KO";
		break;
		
	}
	
	if( !empty($http_client->errstr) ) {
		$errorcode = "NETWORK_ERROR";
		$status = "KO";
	}
	
	if($http_client->_response->get_status() > 400)
	{
	    $errorcode = "SERVER_ERROR";
		$status = "KO";	
	}

 	$jsonReturn = "<textarea> { \"id\" : \"$ID\", \"name\" : \"$filename\",  \"status\" : \"$status\", \"mimetype\" : \"$mimetype\", \"size\" : \"$size\" , \"errorcode\" : \"$errorcode\"}</textarea>";    
	echo  $jsonReturn; //return JSON result in a textarea for UI rendering	
	unset( $http_client );
	

 
?> 