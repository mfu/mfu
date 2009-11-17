/*
	Copyright (c) 2004-2009, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["multiplefileuploader.widget.UploadUnit"]){dojo._hasResource["multiplefileuploader.widget.UploadUnit"]=true;dojo.provide("multiplefileuploader.widget.UploadUnit");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.CheckBox");dojo.require("multiplefileuploader.widget.ErrorCategorizer");dojo.require("multiplefileuploader.widget.UploadInputPane");dojo.require("multiplefileuploader.widget.UploadProgressPane");dojo.require("multiplefileuploader.widget.UploadResultPane");dojo.require("multiplefileuploader.widget.UploadErrorPane");dojo.declare("multiplefileuploader.widget.UploadUnit",null,{constructor:function(_1,_2){dojo.mixin(this,_1);this._currentID=null;this._uploadInputPane=null;this._uploadProgressPane=null;this._uploadResultPane=null;this._uploadErrorPane=null;this._paneContainer=document.createElement("div");dojo.place(this._paneContainer,_2);this._uploadPaneFactory=new multiplefileuploader.widget._UploadPaneFactory(this,this._paneContainer,_2,this.uploadManager,this.config_UI,this.config_status);this._errorCategorizer=new multiplefileuploader.widget.ErrorCategorizer();this.createInputPane();},createInputPane:function(){this._uploadInputPane=this._uploadPaneFactory.inputPane();},createProgressPane:function(){this._hideAllPanes();this._uploadProgressPane=this._uploadPaneFactory.progressPane();},createResultPane:function(_3,_4){this._hideAllPanes();this._uploadResultPane=this._uploadPaneFactory.resultPane(_3,_4);},createErrorPane:function(_5,_6){this._hideAllPanes();this._uploadErrorPane=this._uploadPaneFactory.errorPane(_5,_6);},getSelectedFilename:function(){return this._uploadInputPane.getSelectedFilename();},getFileInput:function(){return this._uploadInputPane.getFileInput();},getFilename:function(){return this.getFileInput().value;},requestDeletion:function(){this.onUploadUnitDeletion(this);},updateProgressBar:function(_7){this._uploadProgressPane.updateProgressBar(_7);},setAssociatedID:function(_8){this._currentID=_8;},getAssociatedID:function(){return this._currentID;},notifyLastFileInputChanged:function(_9){this._uploadInputPane.notifyLastFileInputChanged(_9);},hideDeleteLink:function(){return this._uploadInputPane._hideDeleteLink();},showDeleteLink:function(){return this._uploadInputPane._showDeleteLink();},notifyRecoverableFailure:function(_a,_b){this.createErrorPane(_a,_b);if(this._errorCategorizer.getErrorType(_b)==multiplefileuploader.widget.errorType.ERROR_TYPE_RECOVERABLE){this.onUnitFailureRecoverable();}},_hideAllPanes:function(){dojo.forEach([this._uploadInputPane,this._uploadProgressPane,this._uploadResultPane,this._uploadErrorPane],function(_c){if(_c!=null){_c.hide();}});this._destroyAllExceptInputPane();},_destroyAllExceptInputPane:function(){dojo.forEach([this._uploadProgressPane,this._uploadResultPane,this._uploadErrorPane],function(_d){if(_d!=null){_d.destroy();}});},destroy:function(){dojo.forEach([this._uploadInputPane,this._uploadProgressPane,this._uploadResultPane,this._uploadErrorPane],function(_e){if(_e!=null){_e.destroy();}});}});dojo.declare("multiplefileuploader.widget._UploadPaneFactory",null,{constructor:function(_f,_10,_11,_12,_13,_14){this._config_status=_14;this._config_UI=_13;this._unit=_f;this._attachLinkContainer=_11;this._paneContainer=_10;this._uploadManager=_12;},inputPane:function(){var _15=document.createElement("div");dojo.place(_15,this._paneContainer);var _16={config_UI:this._config_UI,unit:this._unit,uploadManager:this._uploadManager,uploadPaneFactory:this};return new multiplefileuploader.widget.UploadInputPane(_16,_15);},progressPane:function(){var _17=document.createElement("div");dojo.place(_17,this._paneContainer);var _18={config_status:this._config_status,config_UI:this._config_UI,unit:this._unit};return new multiplefileuploader.widget.UploadProgressPane(_18,_17);},resultPane:function(_19,_1a){var _1b=document.createElement("div");dojo.place(_1b,this._paneContainer);var _1c={config_UI:this._config_UI,unit:this._unit,uploadPaneFactory:this,uploadedImageInformation:_19,uploadValuePrefix:_1a};return new multiplefileuploader.widget.UploadResultPane(_1c,_1b);},errorPane:function(_1d,_1e){var _1f=document.createElement("div");dojo.place(_1f,this._paneContainer);var _20={config_UI:this._config_UI,response:_1d,errorCode:_1e,unit:this._unit};return new multiplefileuploader.widget.UploadErrorPane(_20,_1f);},createFileUploadRequest:function(_21){var _22={};dojo.mixin(_22,_21);dojo.mixin(_22,{uploadPaneFactory:this});return new multiplefileuploader.widget._FileUploadRequest(_22,this._unit);}});dojo.declare("multiplefileuploader.widget._FileUploadRequest",multiplefileuploader.widget.FileUploadRequestMixin,{constructor:function(_23,_24){this._unit=_24;dojo.mixin(this,_23);},_doOnBeforeUploadStart:function(){},_doOnAfterUploadStart:function(){},_doOnUploadSuccess:function(_25,_26){this._unit.createResultPane(_25,_26);},_doOnUploadFailure:function(_27,_28){this._unit.notifyRecoverableFailure(_27,_28);},_doOnRetry:function(){this._unit.createProgressPane();},_doOnUploadRequestEnqueued:function(){this._unit.createProgressPane();},_doGetUploadingFilename:function(){return this._unit.getFilename();},_doGetFileInput:function(){return this._unit.getFileInput();},_doSetAssociatedID:function(_29){return this._unit.setAssociatedID(_29);},_doGetAssociatedID:function(){return this._unit.getAssociatedID();},_doOnStatusSuccess:function(_2a){this._unit.updateProgressBar(_2a);},_doOnStatusError:function(_2b){this._unit.updateProgressBar();}});}