sap.ui.define([
	"./BaseObject",
	"./Button",
	"./General",
	"./Error",
	"./MasterData",
	"../config/namespace"
], function (BaseObject, Button, General, Error, MasterData, namespace, Measure) {
	"use strict";
	return BaseObject.extend("com.flexso.htf2022.model.Thing", {
		constructor: function (data) {
			BaseObject.call(this, data);
			this.namespace = namespace;
			// this.Buttons = [];
			// this.generateButtons(data[this.namespace.project + this.namespace.buttons]);
			// this.General = new General(data[this.namespace.project + this.namespace.general]);
			// this.Error = new Error(data[this.namespace.project + this.namespace.error]);
			// this.MasterData = new MasterData(data[this.namespace.project + this.namespace.masterdata]);
		},
		generateButtons: function (oButtons) {
			// for (var key in oButtons) {
			// 	var split = key.split(".");
			// 	split.shift();
			// 	if (split && split.length > 0 && split[(split.length - 1)].indexOf("Button") > -1) {
			// 		var oButton = {
			// 			Key: key,
			// 			Name: oButtons[key],
			// 			MeasureDate: (oButtons[this.namespace.buttons + ".MeasureDateT"] && new Date(this.getDateFromAspNetFormat(oButtons[this.namespace
			// 				.buttons + ".MeasureDateT"])) || ""),
			// 			Visual: "DEF"
			// 		};
			// 		this.namespace.counters.forEach(function (sCounter) {
			// 			oButton[sCounter] = this[this.namespace.project + sCounter][sCounter + "." + split[(split.length - 1)]];
			// 		}.bind(this));
			// 		this.addButton(oButton);
			// 	}
			// }
		},
		addCounter: function (oCounter) {
			// oCounter.forEach(function (counter) {
			// 	for (var btn in counter) {
			// 		if (btn.indexOf("Button") > -1) {
			// 			this[btn] || (this[btn] = new Button());
			// 			this[btn].addMeasure(counter, counter[btn]);
			// 		}
			// 	}
			// }.bind(this));
		},
		addButton: function (data) {
			//this.Buttons.push(new Button(data));
		},
		getJSON: function () {
			return {};
		}
	});
});