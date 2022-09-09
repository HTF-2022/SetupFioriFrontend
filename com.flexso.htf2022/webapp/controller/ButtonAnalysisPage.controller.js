sap.ui.define([
	"./BaseController",
	"sap/ui/iot/elements/IoTEventsOnChartElement",
	"sap/ui/core/BusyIndicator"
], function (Controller, IoTEventsOnChart, BusyIndicator) {
	"use strict";
	return Controller.extend("com.flexso.htf2022.controller.ButtonAnalysisPage", {

		onInit: function () {
			this.bRenderChart = true;
			this.bNavMp = false;
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("btnanalysispage").attachMatched(this._onRouteMatched, this);

			this.DashboardState = this.getOwnerComponent().getState(this.getOwnerComponent().DASHBOARD);
			this.setModel(this.DashboardState.getModel(), "db");
		},

		_onRouteMatched: function (oEvent) {
			//Close the Busy Indicator and retrieve the arguments passed while routing
			BusyIndicator.hide();
			this.sThingId = oEvent.getParameter("arguments").thingId;
			this.button = oEvent.getParameter("arguments").button;
			var sThingType = oEvent.getParameter("arguments").thingType;
			this.DashboardState.getThingGraphData(this.sThingId, sThingType);
		},
		handleNavBackPress: function () {
			window.history.back();
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			}
		}
	});
});