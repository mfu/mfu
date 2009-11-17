/*
	Copyright (c) 2004-2009, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["multiplefileuploader.widget.UploadErrorPane"]){dojo._hasResource["multiplefileuploader.widget.UploadErrorPane"]=true;dojo.provide("multiplefileuploader.widget.UploadErrorPane");dojo.require("dijit._Templated");dojo.requireLocalization("multiplefileuploader","messages",null,"ROOT,en,fr");multiplefileuploader.widget._uploadContainerMessages=dojo.i18n.getLocalization("multiplefileuploader","messages");dojo.declare("multiplefileuploader.widget.UploadErrorPane",[dijit._Widget,dijit._Templated],{templateString:"<div dojoAttachPoint=\"errorPaneContainer\">\n\t<span style=\"color: red; font-weight: bold;\" dojoAttachPoint=\"errorText\"></span>\n</div>\t\n",postCreate:function(_1){this._displayError();},hide:function(){dojo.style(this.errorPaneContainer,{display:"none"});},_displayError:function(){dojo.place(document.createTextNode(dojo.eval("multiplefileuploader.widget._uploadContainerMessages."+this.errorCode)),this.errorText);},destroy:function(){this.inherited(arguments);}});}