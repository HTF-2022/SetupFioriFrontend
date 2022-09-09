sap.ui.define([
	"./BaseObject",
	"./Measure"
], function (BaseObject, Measure) {
	"use strict";
	return BaseObject.extend("com.flexso.htf2022.model.Button", {
		constructor: function (data) {
			BaseObject.call(this, data);
			this.Measures = [];
		},
		setVisual: function (sVisual) {
			this.Visual = sVisual;
		},
		addMeasure: function (oMeasure, value) {
			this.Measures || (this.Measures = []);
			var t = this.Measures.find(function (obtn) {
				return obtn.date === oMeasure.MeasureDateS;
			});
			if (t) {
				t[oMeasure.path] = value;
			} else {
				var newCountMeasure = new Measure({
					timestamp: oMeasure.MeasureDateT,
					date: oMeasure.MeasureDateS
				});
				newCountMeasure[oMeasure.path] = value;
				this.Measures.push(newCountMeasure);
			}
		},
		getJSON: function () {
			return {};
		}
	});
});