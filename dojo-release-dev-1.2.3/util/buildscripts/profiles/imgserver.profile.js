dependencies ={
    layers:  [
        {
        name: "imgserver_all.js",
        dependencies: [
            "multiplefileuploader.widget.MultipleFileUploader",
            "multiplefileuploader.widget.UploadUnit",
            "multiplefileuploader.widget.UploadInputPane",
            "multiplefileuploader.widget.UploadActions",
            "multiplefileuploader.widget.UploadErrorPane",
            "multiplefileuploader.widget.UploadProgressPane",
            "multiplefileuploader.widget.UploadUnitContainer"
														
        ]
        }
    ],
    prefixes: [
        [ "dijit", "../dijit" ],
        [ "dojox", "../dojox" ],
        [ "multiplefileuploader", "../../modules/multiplefileuploader" ]
    ]
};