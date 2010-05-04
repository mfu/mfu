
Screenshots
==================


Upload with progress bar indicator
====================================

.. note::
	:abbr:`MFU (Multiple File Uploader)` maintains a queue of pending upload requests. Only one file is uploaded at a given time, and other pending requests stay at 0% until they are processed

.. image:: _static/sample.png


Connection error
===========================
 
.. note::
	:abbr:`MFU (Multiple File Uploader)` detects network errors and allows the user to restart the failed items

.. image:: _static/sample2.png
	

possible errors
===========================

.. note::
	:abbr:`MFU (Multiple File Uploader)` interacts with the server using a REST/JSON-based protocol. In case the server does not respect the protocol correctly, it displays adequate errors that can be customized. Take a look at  :ref:`ref-internationalization` section.

.. image:: _static/sample3.png


Have a look at this small screencast below which demonstrates some MFU functionalities

.. raw:: html

	<video id="video" src="../mfu-media/mfu-demo.ogv" controls="controls" width="850">
  	 	Your browser is not compliant with <code>video</code> tag. You should migrate to firefox > 3.5
	</video>
