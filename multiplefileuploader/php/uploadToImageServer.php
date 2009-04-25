<?php
	require_once( 'http.inc' );
	
	$uploadParameterName = "upload"; //input name of your html form
	$uploadParameterNameToRemoteServer = "file"; // 

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
  		

	/*
	 * If authentification required
	 */
	$fields =	array( 	'user' => '',
						'password' => '',
						'lang' => ''
				);
	
	$files = array();
	
	
	$files[] = 	array(	'name' => $uploadParameterNameToRemoteServer,
					'content-type' => 'text/plain',
					'filename' => $filename,
					'data' => file_get_contents($_FILES[$uploadParameterName]['tmp_name'])
		);	
	
	/*
	 * If you want to connect through proxy
	 */
//	$http_client->use_proxy( 'ns.crs.org.ni', 3128 );
	
	$http_client = new http( HTTP_V11, false );
	$http_client->host = '127.0.0.1';
	$http_client->port = '8000';	
	$http_client->multipart_post( '/original/'.$randomID, $fields, $files , false);


	switch($http_client->_response->get_status()) {
		
		case "500" :  
		$errorcode = "UNSUPPORTED_FORMAT";
		$status = "KO";
		break;
		
	}
	
	if( !empty($http_client->errstr) ) {
		$status = "KO";
		$errorcode = "NETWORK_ERROR";
	}

 	$jsonReturn = "<textarea> { \"id\" : \"$randomID\", \"name\" : \"$filename\",  \"status\" : \"$status\", \"mimetype\" : \"$mimetype\", \"size\" : \"$size\" , \"errorcode\" : \"$errorcode\"}</textarea>";    
	echo  $jsonReturn; //return JSON result in a textarea for UI rendering	
	unset( $http_client );
	
?> 