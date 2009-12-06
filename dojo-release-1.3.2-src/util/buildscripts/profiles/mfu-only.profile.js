
dependencies = {
    layers: [{
        name: "../dijit/dijit.js",
        dependencies: ["dijit.dijit"]
    }, {
        name: "../dijit/dijit-all.js",
        layerDependencies: ["../dijit/dijit.js"],
        dependencies: ["dijit.dijit-all"]
    }, {
        name: "../dojox/dojox-all.js",
        layerDependencies: ["../dojox/dojox.js"],
        dependencies: ["dojox.dojox-all"]
    }, {
        name: "mfu-only.js",
        dependencies: ["multiplefileuploader.widget.MultipleFileUploader", ],
        layerDependencies: ['../dijit/dijit.js', '../dijit/dijit-all.js', '../dojox/dojox-all.js'],
    
    }],
    prefixes: [["dijit", "../dijit"], ["dojox", "../dojox"], ["multiplefileuploader", "../../multiplefileuploader"]]
}
