sap.ui.define([
	"./BaseObject",
	"../config/namespace"
], function (BaseObject, namespace) {
	"use strict";
	return BaseObject.extend("com.flexso.htf2022.model.IoTObject", {
		constructor: function (data) {
			BaseObject.call(this, {});
			this.namespace = namespace;
			this.mapProperties(data); //, this.getClassName().toLowerCase());
		},
		getClassName: function () {
			var aClassName = this.getMetadata().getName().split(".");
			return aClassName[aClassName.length - 1];
		},
		mapProperties: function (data) { //, sPropertySet) {
			for (var key in data) { //[this.namespace.project + sPropertySet]) {
				var split = key.split(".");
				split.shift();
				if (split && split.length === 1) {
					this[split[0]] = data[key]; //[this.namespace.project + sPropertySet]
				}
			}
		}
	});
});