sap.ui.define([
	"../model/BaseObject",
	"../model/User"
], function (BaseObject, User) {
	"use strict";
	var UserState = BaseObject.extend("com.flexso.htf2022.state.UserState", {
		constructor: function (oService) {
			BaseObject.call(this, {
				isState: true
			});
			this.IoTService = oService;
		},
		
		getUserDetails: function (email) {
			return this.IoTService.getUserDetails(email).then(function (result) {
				var value = JSON.parse(result);
				this.User = new User(value.value[0]);
				this.updateModel();
				return this.User;
			}.bind(this));
		}
	});
	return UserState;
});