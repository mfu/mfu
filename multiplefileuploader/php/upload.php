<?php
    require_once('FileUploader.php');
    $fu = FileUploader::getInstance();
	$conf = parse_ini_file("upload.conf", true);	
	$fu->upload($conf);													
?>