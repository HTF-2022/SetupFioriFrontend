sap.ui.define([
	"./IoTObject"
], function (BaseObject, Filter, FilterOperator) {
	"use strict";
	return BaseObject.extend("com.flexso.htf2022.model.General", {
		constructor: function (data) {
			BaseObject.call(this, data);
		},
		getJSON: function () {
			return {};
		}
	});
});