sap.ui.define([], function () {
	"use strict";

	return {
		
		coffeeType: function (coffeeCode) {
			return (this.getResourceBundle() && this.getResourceBundle().getText(coffeeCode));
		},

		deviceStatus: function (status) {
			return (this.getResourceBundle() && this.getResourceBundle().getText(status));
		},
		
		deviceStatusColor: function (sStateValue) {
			switch (sStateValue) {
				case true:
					return 8;
				case false:
					return 3;
				default:
					return 9;
			}
		}
	
	};
});