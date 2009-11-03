<?php
    require_once('FileUploader.php');
    $fu = FileUploader::getInstance();
    $fu->upload('upload', 'uploadedFiles/');
?>