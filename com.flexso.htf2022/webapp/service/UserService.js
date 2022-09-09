sap.ui.define([
	"./CoreService",
	"sap/ui/model/odata/ODataUtils",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (CoreService, ODataUtils, Filter, FilterOperator) {
	"use strict";

	var UserService = CoreService.extend("com.flexso.htf2022.service.UserService", {
		constructor: function (model) {
			CoreService.call(this, model);
		},
		
		getUserDetails: function (email) {
			return this.http("/business-partner/Persons?$filter=emailAddress eq '" + email + "'").get();
		}
	});
	return UserService;
});