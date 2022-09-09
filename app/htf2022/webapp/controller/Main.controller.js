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

			// var oModel = new ODataModel("com.flexso.htf2022/target", true);
			// var oChart = this.getView().byId("idLineChart");
			// var oChartTitle = this.getView().byId("chartTitle");
			// oChart.setChartTitle(oChartTitle);
			// oChart.setModel(oModel);
			// let oHTML = this.getView().byId("html");
			// const html5 =
			// 	"<iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40068.76006199005!2d4.4064498639960235!3d51.12142022070056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f07c587f5217%3A0xdf189cb20dd47c9a!2s2550%20Kontich!5e0!3m2!1snl!2sbe!4v1659910246682!5m2!1snl!2sbe' width='100%' height='300' style='border:0;' loading='lazy' referrerpolicy='no-referrer-when-downgrade'></iframe>";
			// oHTML.setContent(html5);
		},

		setMap: function (oEvent) {
			// let student = oEvent.getSource().getBindingContext().getObject();
			// let oHTML = this.getView().byId("html");
			// const html5 =
			// 	`<iframe src='${student.map}' width='100%' height='300' style='border:0;' loading='lazy' referrerpolicy='no-referrer-when-downgrade'></iframe>`;
			// oHTML.setContent(html5);
		}

	});
});