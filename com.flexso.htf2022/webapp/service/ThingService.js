sap.ui.define([
	"./CoreService",
	"sap/ui/model/odata/ODataUtils",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (CoreService, ODataUtils, Filter, FilterOperator) {
	"use strict";

	var OverviewService = CoreService.extend("com.flexso.htf2022.service.ThingService", {
		constructor: function (model) {
			CoreService.call(this, model);
		},
		getThingDetail: function (sThingId, sThingType) {
			//get latest details from thing
			// /IOTAS-DETAILS-THING-ODATA/CompositeThings/ThingType/v1/iotae.flexso.be.miko.piloot:MM_GERHARDT/Things('1F3C2F1CC4FE4DFDAE86943AE134D0DD')?
			// $expand=
			// DYN_ENT_iotae_flexso_be_miko_piloot__MM_TestCounter,
			// DYN_ENT_iotae_flexso_be_miko_piloot__MM_KeyCounter,
			// DYN_ENT_iotae_flexso_be_miko_piloot__MM_NormalCounter,
			// DYN_ENT_iotae_flexso_be_miko_piloot__MM_TokenCounter,
			// DYN_ENT_iotae_flexso_be_miko_piloot__MM_General,
			// DYN_ENT_iotae_flexso_be_miko_piloot__MM_TotalCounter,
			// DYN_ENT_iotae_flexso_be_miko_piloot__MM_HappyCounter
			// &$format=json
			//get last two weeks
			//"/Things('1F3C2F1CC4FE4DFDAE86943AE134D0DD')/iotae.flexso.be.miko.piloot:MM_GERHARDT/MM_KeyCounter?timerange=2W"
			// if (this.ThingDetailsResult) {
			// 	return Promise.resolve(this.ThingDetailsResult);
			// }
			// return this.odata(sThingType, "/Things('" + sThingId + "')")
			// 	.get({
			// 		urlParameters: {
			// 			"$expand": "DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_BASIC,DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_KeyCounter,DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_NormalCounter,DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_TestCounter,DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_TotalCounter,DYN_ENT_iotae_flexso_be_miko_piloot__DefaultImagePropertySet,DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_Error,DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_Button_Names,DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_Masterdata,DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_Version,DYN_ENT_iotae_flexso_be_miko_piloot__MM_PSET_Total"
			// 		}
			// 	}).then(function (result) {
			// 		this.ThingDetailsResult = result;
			// 		return result;
			// 	}.bind(this));
		},
		getThingData: function (sThingId) {
			// var date2w = new Date();
			// date2w.setDate(date2w.getDate() - 14);
			// var filters = [
			// 	new Filter({
			// 		filters: [new Filter({
			// 				path: "id",
			// 				operator: FilterOperator.EQ,
			// 				value1: sThingId
			// 			}),
			// 			new Filter({
			// 				path: "time",
			// 				operator: FilterOperator.GE,
			// 				value1: date2w
			// 			}), new Filter({
			// 				path: "time",
			// 				operator: FilterOperator.LT,
			// 				value1: new Date()
			// 			})
			// 		],
			// 		and: true
			// 	})
			// ];
			// return Promise.all([this.odata("MM_PSET_NormalCounter", "/measurements").get({
			// 	filters: filters
			// }), this.odata("MM_PSET_KeyCounter", "/measurements").get({
			// 	filters: filters
			// }), this.odata("MM_PSET_TestCounter", "/measurements").get({
			// 	filters: filters
			// }), this.odata("MM_PSET_TotalCounter", "/measurements").get({
			// 	filters: filters
			// })]).then(function (response) {
			// 	return {
			// 		NormalCounter: response[0].data.results,
			// 		KeyCounter: response[1].data.results,
			// 		TestCounter: response[2].data.results,
			// 		TotalCounter: response[3].data.results
			// 	};
			// });
		}
	});
	return OverviewService;
});