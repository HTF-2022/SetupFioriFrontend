sap.ui.define([
	"./BaseController",
	"sap/ui/core/BusyIndicator",
	'sap/ui/model/Filter',
	"com/flexso/htf2022/util/formatter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (Controller, BusyIndicator, Filter, formatter, FilterOperator, JSONModel) {
	"use strict";

	return Controller.extend("com.flexso.htf2022.controller.LandingPage", {

		formatter: formatter,

		onInit: function () {
			var oModel = new JSONModel();
		//	this.byId("idChart").setModel(oModel, "chartModel");

			this.UserState = this.getOwnerComponent().getState(this.getOwnerComponent().USER);
			this.setModel(this.UserState.getModel(), "user");
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("landingpage").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			var me = this;
		/*	if (!this.UserState.user) {
				return new Promise(function (resolve, reject) {
					var userapi = new JSONModel("/services/userapi/currentUser");
					userapi.attachRequestCompleted(function () {
						resolve(userapi.getData());
						me.UserState.getUserDetails(userapi.getData().name).then(function (thing) {
							BusyIndicator.hide();
						});

					});
				});
			}*/
		},

		switchMapChart: function (oEvent) {
			var key = oEvent.getSource().getKey();
			switch (key) {
			case "map":
				this.byId("idMap").setVisible(true);
				this.byId("idChart").setVisible(false);
				break;
			case "chart":
				this.byId("idMap").setVisible(false);
				this.byId("idChart").setVisible(true);
				break;
			default:
				break;
			}
		},

		zoomToMap: function (oEvent) {
			var latitude = oEvent.getParameter("listItem").getBindingContext().getProperty("Latitude");
			var longitude = oEvent.getParameter("listItem").getBindingContext().getProperty("Longitude");
			this.byId("idMap").setZoomlevel(8);
			this.byId("idMap").setCenterPosition(longitude + ";" + latitude);

			var thindId = oEvent.getParameter("listItem").getBindingContext().getProperty("ThingId");

			this.setTotalChartData(thindId);
		},

		setTotalChartData: function (thingId) {
			var oChart = this.byId("idChart");
			oChart.addDefaultPST("MM_PSET_Total", "Total");
			oChart.bChartInit = true;
			oChart.bReload = false;
			oChart.bNavFromMeasuredValue = true;
			oChart.bNavFromEventList = false;
			oChart.setEventsVisible(false);
			oChart.setAssetId(thingId);
		},

		oMultiRowSelect: function (oEvent) {
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			} else {
				BusyIndicator.show(0);
			}
			var oThingObject = oEvent.getParameter("context").getParameters("thing").thingData;
			this.getOwnerComponent().getRouter().navTo("thingpage", {
				thingId: oThingObject.ThingId,
				thingType: oThingObject.ThingType,
				highSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.High || 0,
				mediumSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.Medium || 0,
				lowSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.Low || 0
			});
		},

		oSingleHeaderSelect: function (oEvent) {
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			} else {
				BusyIndicator.show(0);
			}
			var oThingObject = oEvent.getParameter("context").getParameters("thing").thingData;
			this.getOwnerComponent().getRouter().navTo("thingpage", {
				thingId: oThingObject.ThingId,
				thingType: oThingObject.ThingType,
				highSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.High || 0,
				mediumSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.Medium || 0,
				lowSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.Low || 0
			});
		},

		onAfterRendering: function () {
			BusyIndicator.hide();
		},

		onThingSearch: function (oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				//var filter = new Filter("AlternateId", sap.ui.model.FilterOperator.Contains, sQuery);

				var filter = new Filter({
					filters: [
						new Filter("AlternateId", FilterOperator.Contains, sQuery),
						new Filter("ThingDescription", FilterOperator.Contains, sQuery),
						new Filter("DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_Masterdata/MM_PSET_Masterdata.LocationAtCustomer", FilterOperator.Contains,
							sQuery)
					],
					and: false
				});
				aFilters.push(filter);
			}
			// update list binding
			var list = this.byId("thingList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
	});
});