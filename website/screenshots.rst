
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

	<object id="flowplayer" width="500" height="324" data="http://releases.flowplayer.org/swf/flowplayer-3.2.0.swf" type="application/x-shockwave-flash">
	 <param name="movie" value="http://releases.flowplayer.org/swf/flowplayer-3.2.0.swf" /> 
	 <param name="allowfullscreen" value="true" /> 
	 <param name="flashvars" value='config={"clip":{"provider":"pseudostreaming","url":"../mfu-media/demo-mfu.flv"},"screen":{"height":"100pct","top":0},"plugins":{"pseudostreaming":{"url":"flowplayer.pseudostreaming-3.2.0.swf"},"controls":{"borderRadius":"0px","timeColor":"#ffffff","bufferGradient":"none","slowForward":true,"backgroundColor":"rgba(0, 0, 0, 0)","volumeSliderGradient":"none","slowBackward":false,"timeBorderRadius":20,"time":true,"progressGradient":"none","height":26,"volumeColor":"#4599ff","tooltips":{"marginBottom":5,"scrubber":true,"volume":true,"buttons":false},"opacity":1,"fastBackward":false,"timeFontSize":12,"volumeSliderColor":"#ffffff","border":"0px","bufferColor":"#a3a3a3","buttonColor":"#ffffff","mute":true,"autoHide":{"enabled":true,"hideDelay":500,"hideStyle":"fade","mouseOutDelay":500,"hideDuration":400,"fullscreenOnly":true},"backgroundGradient":"none","width":"100pct","display":"block","sliderBorder":"1px solid rgba(128, 128, 128, 0.7)","buttonOverColor":"#ffffff","fullscreen":true,"timeBgColor":"rgb(0, 0, 0, 0)","scrubberBarHeightRatio":0.2,"bottom":0,"stop":false,"zIndex":1,"sliderColor":"#000000","scrubberHeightRatio":0.6,"tooltipTextColor":"#ffffff","sliderGradient":"none","timeBgHeightRatio":0.8,"volumeSliderHeightRatio":0.6,"timeSeparator":" ","name":"controls","volumeBarHeightRatio":0.2,"left":"50pct","tooltipColor":"rgba(0, 0, 0, 0)","playlist":false,"durationColor":"#b8d9ff","play":true,"fastForward":true,"progressColor":"#4599ff","timeBorder":"0px solid rgba(0, 0, 0, 0.3)","volume":true,"scrubber":true,"builtIn":false,"volumeBorder":"1px solid rgba(128, 128, 128, 0.7)"}}}' /> 
	</object>
	
	