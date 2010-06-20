
Frequently asked questions
==========================


**1) I just installed MFU on my local environnement. However, when i try to upload a file, MFU return Malformed JSON response, why ?**


**Malformed JSON response** occurs when the response is different than the one expected.

The response has to be in a  <textarea>{ ... jsonResponse ... } </textarea>

In order to debug, take a look at:

- 'network' tab with Firebug ( https://addons.mozilla.org/fr/firefox/addon/1843/ )
- find 'POST upload.php' line
- Check 'reponse' tab

The most common mistake is to forget to set correct rights to your uploaded files folder. In that case, Upload.php will return :
 
.. code-block:: php

	<b>Warning</b>:  move_uploaded_file(uploadedFiles/Cover.jpg) [<a href='function.move-uploaded-file'>function.move-uploaded-file</a>]: failed to open stream: Permission denied in <b>C:\wamp\www\florentvaldelievre-multiplefileuploader-e3a95f6\target\mfu-demo\samples\php\FileUploader.php</b> on line <b>164</b><br />
	<br />
	<b>Warning</b>:  move_uploaded_file() [<a href='function.move-uploaded-file'>function.move-uploaded-file</a>]: Unable to move 'C:\wamp\tmp\php80C8.tmp' to 'uploadedFiles/Cover.jpg' in <b>C:\wamp\www\florentvaldelievre-multiplefileuploader-e3a95f6\target\mfu-demo\samples\php\FileUploader.php</b> on line <b>164</b><br />

As this response does not meet the expected format, Malformed JSON response is returned.



