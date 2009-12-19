<?php
    require_once('lib/http.inc');
	
	class FileUploader
    {
        const SESSION_STATUS_KEY = '__upload_status';
        const SESSION_ERROR_KEY = '__upload_error';
		const ID_KEY      = 'APC_UPLOAD_PROGRESS';
		const PYMAGER_UPLOAD_PATH= '/original/';
 		private static $_instance = null;

 		
        public function __construct()
        {
            session_start();	
            if (!array_key_exists(self::SESSION_STATUS_KEY, $_SESSION)) {
                $_SESSION[self::SESSION_STATUS_KEY] = array();
            }
        }
      
 	   	public static function getInstance() {
		     if (!self::$_instance instanceof self) {
	           self::$_instance = new FileUploader();
	        }
	        return self::$_instance;
    	}
    
        public static function isAPCEnabled()
        {
            if (!extension_loaded('apc'))
                return false;

            if (!function_exists('apc_fetch'))
                return false;

            return ini_get('apc.enabled') && ini_get('apc.rfc1867');
        }

		
		public static function setDefaultStatus($id)
        {
		      $_SESSION[self::SESSION_ERROR_KEY][$id] = array( 'errorcode' => "", 'status' => 'OK' );	
        }			
		
        public static function setFileErrorCode($file, $id)
        {
		      $_SESSION[self::SESSION_ERROR_KEY][$id] = array( 'errorcode' => "", 'status' => 'OK' );	
			  if ($file['error']) {
				switch ($file['error']){
						 case 1:
							// UPLOAD_ERR_INI_SIZE
							$_SESSION[self::SESSION_ERROR_KEY][$id] = array( 'errorcode' => "SIZE_EXCEEDED", 'status' => 'KO' );									 
						 break;
						 case 4: 
							//UPLOAD_ERR_NO_FILE
							$_SESSION[self::SESSION_ERROR_KEY][$id] = array( 'errorcode' => "UPLOAD_ERR_NO_FILE", 'status' => 'KO' );
						 break;
				}	  	 
		      } else if(empty($_FILES)) {
		 	 		//POST_MAX_SIZE
					$_SESSION[self::SESSION_ERROR_KEY][$id] = array( 'errorcode' => "SIZE_EXCEEDED", 'status' => 'KO' );
		  	}	
        }		
				
		
		//return array( $status , $errorCode );
        public static function setHTTPErrorCode($http_client, $id)
        {
			switch($http_client->_response->get_status()) {				
				case "400" :  
				$_SESSION[self::SESSION_ERROR_KEY][$id] = array( 'errorcode' => "UNSUPPORTED_FORMAT", 'status' => 'KO' );
				break;					
			}
			
			if( !empty($http_client->errstr) ) {
				$_SESSION[self::SESSION_ERROR_KEY][$id] = array( 'errorcode' => "NETWORK_ERROR", 'status' => 'KO' );
			}
			if($http_client->_response->get_status() > 400) {
				$_SESSION[self::SESSION_ERROR_KEY][$id] = array( 'errorcode' => "SERVER_ERROR", 'status' => 'KO' );
			}
        }		
		
        public function getUploadStatus($id)
        {
            // sanitize the ID value
            $id = preg_replace('/[^a-z0-9]/i', '', $id);
            if (strlen($id) == 0)
                return;

            // ensure the uploaded status data exists in the session
            if (!array_key_exists($id, $_SESSION[self::SESSION_STATUS_KEY])) {
                $_SESSION[self::SESSION_STATUS_KEY][$id] = array(
                    'id'       => $id,
                    'finished' => false,
                    'percent'  => 0,
                    'total'    => 0,
                    'complete' => 0
                );
            }

            // retrieve the data from the session so it can be updated and returned
            $ret = $_SESSION[self::SESSION_STATUS_KEY][$id];

            // if we can't retrieve the status or the upload has finished just return
            if (!self::isAPCEnabled() || $ret['finished'])
                return $ret;

            // retrieve the upload data from APC
            $status = apc_fetch('upload_' . $id);

            // false is returned if the data isn't found
            if ($status) {
                $ret['finished'] = (bool) $status['done'];
                $ret['total']    = $status['total'];
                $ret['complete'] = $status['current'];

                // calculate the completed percentage
                if ($ret['total'] > 0)
                    $ret['percent'] = $ret['complete'] / $ret['total'] * 100;

                // write the changed data back to the session
                $_SESSION[self::SESSION_STATUS_KEY][$id] = $ret;
            }

            return $ret;
        }

        public function upload($conf = array() )
        {		

			$r = $conf['remote'];
			$l = $conf['local'];
			$file = $_FILES[$l['upload_parameter_name']];
            $id   = $_POST[self::ID_KEY];
            // ensure the given file has been uploaded
           if (!isset($file) || !is_array($file))
                return false;
 
            // only proceed if no errors have occurred
            if ($file['error'] != UPLOAD_ERR_OK)
                return false;

			self::setDefaultStatus($id);
			self::setFileErrorCode($file,$id);
   
			if($conf['general']['upload_to'] == 'pymager') {
				$files[] = 	array('name' => $r['pymager_upload_parameter_name'],
							'content-type' => 'text/plain',
							'filename' => basename($file['name']),
							'data' => file_get_contents($file['tmp_name'])
				);					
				$http_client = new http( HTTP_V11, false , Array($r['user'],$r['password']));
				$http_client->host =  $r['host'];
				$http_client->port =  $r['port'];
				if(!empty($r['proxy_url'])) {
					$http_client->use_proxy( $r['proxy_url'], $r['proxy_port'] );
				}
				$http_client->multipart_post( self::PYMAGER_UPLOAD_PATH.$id, $fields = array() , $files , false);
				self::setHTTPErrorCode($http_client,$id); 
			 }
			 else if($conf['general']['upload_to'] == 'local_directory') {
				$fullpath = sprintf('%s/%s', $l['upload_folder_name'], basename($file['name']));
				if (!move_uploaded_file($file['tmp_name'], $fullpath))
	                return false;					
			 }
			 else
			 {
				throw ('upload_to in upload.conf should be pymager or local_directory');
			 }

            $_SESSION[self::SESSION_STATUS_KEY][$id] = array(
                'id'       => $id,
                'finished' => true,
                'percent'  => 100,
                'total'    => $file['size'],
                'complete' => $file['size']
            );
             
			 $fileInfo =   array(
	            'id' => $id,
	            'name' => basename($file['name']),
	            'mimetype' => $file['type'],
	            'size' => $file['size'],
	            );
			        
      	 	echo "<textarea>".json_encode(array_merge($_SESSION[self::SESSION_ERROR_KEY][$id],$fileInfo))."</textarea>";    

        }
    }
?>