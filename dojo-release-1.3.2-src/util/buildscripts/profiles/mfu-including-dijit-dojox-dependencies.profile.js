dependencies ={
    layers:  [
		{
        name: "../layers/mfu.js",
		resourceName: "layers.mfu",
        dependencies: [
		    "multiplefileuploader.widget.MultipleFileUploader"					
        ],
        }
    ],
    prefixes: [
	  	[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
	    [ "multiplefileuploader", "../../multiplefileuploader" ],
		[ "layers", "../layers"]
    ]
};