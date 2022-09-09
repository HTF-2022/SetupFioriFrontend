sap.ui.define([
	"./BaseController",
	"com/flexso/htf2022/util/formatter",
	"sap/ui/core/BusyIndicator"
], function (Controller, formatter, BusyIndicator) {
	"use strict";

	return Controller.extend("com.flexso.htf2022.controller.ThingPage", {
		formatter: formatter,
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "thingPageModel");

			this.DashboardState = this.getOwnerComponent().getState(this.getOwnerComponent().DASHBOARD);
			this.setModel(this.DashboardState.getModel(), "db");

			this.UserState = this.getOwnerComponent().getState(this.getOwnerComponent().USER);
			this.setModel(this.UserState.getModel(), "user");

			oRouter.getRoute("thingpage").attachMatched(this._onRouteMatched, this);
		},
		/** Retreive the ThingId and ThingType and do a call to the backend with the expand paramaters to bind it to the header and basic data section **/
		_onRouteMatched: function (oEvent) {
			var arg = oEvent.getParameter("arguments");
			this.sThingId = arg.thingId;
			this.sThingType = arg.thingType;
			this.DashboardState.getThingDetails(this.sThingId, this.sThingType).then(function (thing) {
				BusyIndicator.hide();
			});
			if (!this.UserState.user) {
				var me = this;
				return new Promise(function (resolve, reject) {
					var userapi = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
					userapi.attachRequestCompleted(function () {
						resolve(userapi.getData());
						me.UserState.getUserDetails(userapi.getData().name).then(function (thing) {
							BusyIndicator.hide();
						});

					});
				});
			}
		},
		handleNavBackPress: function () {
			window.history.back();
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			}
		},
		onButtonAnalysis: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("btnanalysispage", {
				thingId: this.sThingId,
				thingType: this.sThingType,
				button: oEvent.getSource().getBindingContext("db").getProperty("Key").split(".")[1]
			});
		},
		onMeasuredValueSelect: function (oEvent) {
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			} else {
				sap.ui.getCore().byId("idBusy").open();
			}
			var oModel = this.getView().getModel("thingPageModel");
			var oMpContext = oEvent.getParameter("context");
			oModel.setProperty("/mpData", oMpContext);
			var oProperty = oMpContext.getObject(oMpContext.getPath()).measuredValue;
			this.getOwnerComponent().getRouter().navTo("analysispage", {
				thingId: this.sThingId,
				navFrom: "measuredValues",
				headerTitle: " ",
				subHeaderTitle: " ",
				mpPath: oProperty
			});
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			var ownerComponent = this.getOwnerComponent();
			return ownerComponent ? ownerComponent.getModel("i18n").getResourceBundle() : {
				getText: function (key) {
					return "No resource bundle available";
				}
			};
		},

		changeTileChart: function (oEvent) {
			var oButtonContext = oEvent.getSource().getBindingContext("db");
			this.openFragment("com.flexso.htf2022.view.dialog.DashboardTileOptions", false, false, false, {
				buttoncontext: oButtonContext
			}, oEvent.getSource());
		}

	});
});