sap.ui.define([
	"./BaseObject"
], function (BaseObject) {
	"use strict";
	return BaseObject.extend("com.flexso.htf2022.model.Measure", {
		constructor: function (data) {
			BaseObject.call(this, data);
		},
		getJSON: function () {
			return {};
		}
	});
});