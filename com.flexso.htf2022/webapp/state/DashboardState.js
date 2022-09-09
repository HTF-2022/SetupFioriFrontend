sap.ui.define([
	"../model/BaseObject",
	"../model/Thing"
], function (BaseObject, Thing) {
	"use strict";
	var DashboardState = BaseObject.extend("com.flexso.htf2022.state.DashboardState", {
		constructor: function (oService) {
			BaseObject.call(this, {
				isState: true
			});
			this.IoTService = oService;
			this.Thing = {};
		},
		getThingDetails: function (thingId, sThingType) {
			// return this.IoTService.getThingDetail(thingId, sThingType).then(function (result) {
			// 	this.Thing = new Thing(result.data);
			// 	this.updateModel();
			// 	return this.Thing;
			// }.bind(this));
		},
		getThingGraphData: function (thingId, sThingType) {
			//return Promise.all([this.getThingDetails(thingId, sThingType), this.IoTService.getThingData(thingId)]).then(function (response) {
				// response[1].data.results.forEach(function (oResult) {
				// 	this.Thing.addMeasure(oResult);
				// }.bind(this));
				// response[1].TestCounter.data.results.forEach(function (counter) {
				// 	for (var btn in counter) {
				// 		if (btn.indexOf("Button") > -1) {
				// 			this.Thing[btn] && (this.Thing[btn].measures || (this.Thing[btn].measures = []));
				// 			var t = this.Thing[btn].measures.find(function (obtn) {
				// 				return obtn.date === counter.MeasureDateS;
				// 			});
				// 			if (t) {
				// 				t[counter.path] = counter[btn];
				// 			} else {
				// 				var newCount = {
				// 					timestamp: counter.MeasureDateT,
				// 					date: counter.MeasureDateS
				// 				};
				// 				newCount[counter.path] = counter[btn];
				// 				this.Thing[btn].measures.push(newCount);
				// 			}
				// 		}
				// 	}
				// }.bind(this));
				// this.Thing.addCounter(response[1].NormalCounter);
				// this.Thing.addCounter(response[1].TestCounter);
				// this.Thing.addCounter(response[1].KeyCounter);
				// this.Thing.addCounter(response[1].TotalCounter);
				// this.updateModel();
				// return this.Thing;
			//}.bind(this));
		}
	});
	return DashboardState;
});