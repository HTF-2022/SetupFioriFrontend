jQuery.sap.registerModulePath("sap.ui.iot", "/resources/sap/ui/iot/");
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/m/MessageBox",
	"com/flexso/htf2022/model/model",
	"./state/DashboardState",
	"./service/ThingService",
	"sap/ui/core/BusyIndicator",
	"./state/UserState",
	"./service/UserService"
], function (UIComponent, Device, MessageBox, models, DashboardState, ThingService, BusyIndicator, UserState, UserService) {
	"use strict";

	return UIComponent.extend("com.flexso.htf2022.Component", {

		metadata: {
			manifest: "json"
		},
		DASHBOARD: "Dashboard",
		THING: "Thing",
		USER: "User",

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this._oThingService = new ThingService([this.getModel("thingModel1"), this.getModel("thingModel2"), this.getModel(
				"analyticsNormalModel"), this.getModel("analyticsKeyModel"), this.getModel("analyticsTestModel"), this.getModel(
				"analyticsTotalModel")]);
			this._oDashboardState = new DashboardState(this._oThingService);
			this._oUserService = new UserService([this.getModel("userModel")]);
			this._oUserState = new UserState(this._oUserService);
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.getRouter().initialize();
			BusyIndicator.show(0);
			
			//Calling the rendering function of the bot
		//	this.renderRecastChatbot();

			//Timeout dialog
			this.isTimedOut = false;
			this.rBundle = this.getModel("i18n").getResourceBundle();
			this.solutionText = this.rBundle.getText("solutionText");
			this.suggestionText = this.rBundle.getText("suggestionText");
			this.timeoutDialogTitle = this.rBundle.getText("timeoutDialogTitle");
			this.reloadButtonText = this.rBundle.getText("reloadButtonText");
			var that = this;
			this.getModel().attachRequestFailed(function (oEvent) {
				//for handling timeout for main model
				var oParams = oEvent.getParameters();
				var that = this;
				if (oParams.response.statusCode === 503) {
					this.isTimedOut = true;
					this.showTimeoutMessage();
				}
			}, that);
			if (this.getModel("events") !== undefined) {
				//for handling timeout for event model
				this.getModel("events").attachRequestFailed(function (oEvent) {
					var oParams = oEvent.getParameters();
					var that = this;
					if (oParams.response.statusCode === 503) {
						this.isTimedOut = true;
						this.showTimeoutMessage();
					}
				}, that);
			}
			window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
				//for handling timeout while fetching ui controls
				var cause = new Object();
				var errObj = errorObj;
				while (errObj.hasOwnProperty("cause")) {
					errObj = errObj.cause;
				}
				cause = errObj;
				if (cause.status === undefined) {
					cause.status = errorObj.status;
				}
				if (cause.status === 503 || cause.statusCode === 503) {
					this.isTimedOut = true;
					this.showTimeoutMessage();
				}
			}.bind(that);
			$(document).ajaxError(function (event, xhr, options, exc) {
				//for handling timeout for AJAX calls
				if (xhr.status === 503) {
					this.isTimedOut = true;
					this.showTimeoutMessage();
				}
			}.bind(that));
			//for handling timeout of dynamically created thing models
			if (this.getModel("thingModel1") !== undefined) {
				this.getModel("thingModel1").attachRequestFailed(function (oEvent) {
					var oParams = oEvent.getParameters();
					if (oParams.response.statusCode === 503) {
						this.isTimedOut = true;
						this.showTimeoutMessage();
					}
				}, this);
			}
		},
		showTimeoutMessage: function () {
			//for showing the timeout dialog
			var that = this;
			MessageBox.error(
				that.solutionText, {
					id: "serviceErrorMessageBox",
					icon: MessageBox.Icon.WARNING,
					details: that.suggestionText,
					title: that.timeoutDialogTitle,
					actions: [that.reloadButtonText, MessageBox.Action.CLOSE],
					initialFocus: that.reloadButtonText,
					onClose: function (sAction) {
						if (sAction === this.reloadButtonText) {
							window.location.reload();
						} else {
							sap.ui.getCore().byId("idBusy").close();
						}
					}.bind(that)
				}
			);
		},
		getService: function (sService) {
			return this["_o" + sService + "Service"];
		},
		getState: function (sState) {
			return this["_o" + sState + "State"];
		},
		destroy: function () {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
			sap.ui.getCore().byId("idBusy").destroy();
			var applicationContainer = document.getElementsByClassName("sapUShellApplicationContainer")[3].getAttribute("id");
			if (sap.ui.getCore().byId(applicationContainer + "-component---thingpage--idEventList--idEventTable-PersoDialog-Dialog")) {
				sap.ui.getCore().byId(applicationContainer + "-component---thingpage--idEventList--idEventTable-PersoDialog-Dialog").destroy();
				sap.ui.getCore().byId(applicationContainer + "-component---thingpage--idEventList--idEventTable-PersoDialog-cb").getParent()
					.destroy();
			}
			document.getElementById("cai-webchat").remove();
			document.getElementById("cai-webchat-div").remove();

		},
		/*<script src="https://cdn.cai.tools.sap/webchat/webchat.js"
			channelId="b10dd419-79a5-4985-af53-14e41a7ddfc0"
			token="89c47401745766d445d3170c97cd810b"
			id="cai-webchat"
			></script>*/
		/*renderRecastChatbot: function() {
			if (!document.getElementById("cai-webchat")) {
				var s = document.createElement("script");
				s.setAttribute("id", "cai-webchat");
				s.setAttribute("src", "https://cdn.cai.tools.sap/webchat/webchat.js");
				document.body.appendChild(s);
				s.setAttribute("channelId", "b10dd419-79a5-4985-af53-14e41a7ddfc0");
				s.setAttribute("token", "89c47401745766d445d3170c97cd810b");
			}*/
		//}
	});

});