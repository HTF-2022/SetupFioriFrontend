sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/odata/v2/ODataModel"
], function (BaseController, JSONModel, formatter, ODataModel) {
	"use strict";

	return BaseController.extend("com.flexso.htf2022.controller.Main", {

		formatter: formatter,

		onInit: function () {
			this.oModel = this.getOwnerComponent().getModel();
			this.FlowState = this.getOwnerComponent().FlowState;
            this.getView().setModel(this.FlowState.getModel(), "reg");
			
            this.FlowState.getFlowStreams();

			const oFlowModel = new ODataModel("v2/service/htf2022/");
			const oChart = this.getView().byId("idLineChart");
			oChart.setModel(oFlowModel);
			const oChart2 = this.getView().byId("idLineChart2");
			oChart2.setModel(oFlowModel);
		}

	});
});