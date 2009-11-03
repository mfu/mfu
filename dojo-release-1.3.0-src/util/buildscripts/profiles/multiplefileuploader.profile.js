dependencies ={
    layers:  [


		{
			name: "../dijit/dijit.js",
			dependencies: [
				"dijit.dijit"
			]
		},
		{
			name: "../dijit/dijit-all.js",
			layerDependencies: [
				"../dijit/dijit.js"
			],
			dependencies: [
				"dijit.dijit-all"
			]
		},
		{
			name: "../dojox/dojox-all.js",
			layerDependencies: [
				"../dojox/dojox.js"
			],
			dependencies: [
				"dojox.dojox-all"
			]
		},

		{
        name: "../../multiplefileuploader/release/multiplefileuploader_only.js",
        dependencies: [
            "multiplefileuploader.widget.ErrorCategorizer",
            "multiplefileuploader.widget.IframeUploadStrategy",
		    "multiplefileuploader.widget.MultipleFileUploader",
            "multiplefileuploader.widget.UploadActions",
            "multiplefileuploader.widget.UploadErrorPane",
            "multiplefileuploader.widget.UploadInputPane",			
            "multiplefileuploader.widget.UploadManager",
            "multiplefileuploader.widget.UploadProgressPane",
            "multiplefileuploader.widget.UploadResultPane",			
            "multiplefileuploader.widget.UploadUnit",
            "multiplefileuploader.widget.UploadUnitContainer",

								
        ],
			layerDependencies: ['../dijit/dijit.js', '../dijit/dijit-all.js', '../dojox/dojox-all.js'],

        }
    ],
    prefixes: [
	  		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],

	    [ "multiplefileuploader", "../../multiplefileuploader" ]
    ]
};