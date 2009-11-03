<?php
    class FileUploader
    {
        const SESSION_KEY = '__upload_status';
        const ID_KEY      = 'APC_UPLOAD_PROGRESS';
 		private static $_instance = null;
 

 		
        public function __construct()
        {
            session_start();
		
            if (!array_key_exists(self::SESSION_KEY, $_SESSION)) {
                $_SESSION[self::SESSION_KEY] = array();
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

        public function getUploadStatus($id)
        {
            // sanitize the ID value
            $id = preg_replace('/[^a-z0-9]/i', '', $id);
            if (strlen($id) == 0)
                return;

            // ensure the uploaded status data exists in the session
            if (!array_key_exists($id, $_SESSION[self::SESSION_KEY])) {
                $_SESSION[self::SESSION_KEY][$id] = array(
                    'id'       => $id,
                    'finished' => false,
                    'percent'  => 0,
                    'total'    => 0,
                    'complete' => 0
                );
            }

            // retrieve the data from the session so it can be updated and returned
            $ret = $_SESSION[self::SESSION_KEY][$id];

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
                $_SESSION[self::SESSION_KEY][$id] = $ret;
            }

            return $ret;
        }

        public function upload($key, $path)
        {
     

            // ensure the given file has been uploaded
            if (!isset($_FILES[$key]) || !is_array($_FILES[$key]))
                return false;

            $file = $_FILES[$key];
            $id   = $_POST[self::ID_KEY];

            // only proceed if no errors have occurred
            if ($file['error'] != UPLOAD_ERR_OK)
                return false;

            // write the uploaded file to the filesystem
            $fullpath = sprintf('%s/%s', $path, basename($file['name']));
            if (!move_uploaded_file($file['tmp_name'], $fullpath))
                return false;

            // update the session data to indicate the upload has completed
            $size = filesize($fullpath);

            $_SESSION[self::SESSION_KEY][$id] = array(
                'id'       => $id,
                'finished' => true,
                'percent'  => 100,
                'total'    => $size,
                'complete' => $size
            );
            
	         $fileInfo =   array(
	            'id' => $id,
	            'name' => basename($_FILES[$key]['name']),
	            'status' => "OK",
	            'mimetype' => $_FILES[$key]['type'],
	            'size' => $_FILES[$key]['size'],
	            'errorcode' => null
	            
	            );
            
      	 	echo "<textarea>".json_encode($fileInfo)."</textarea>";    

        }
    }
?>