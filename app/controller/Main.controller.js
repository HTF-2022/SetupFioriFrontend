sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, ODataModel, MessageToast) {
	"use strict";

	return BaseController.extend("com.flexso.htf2022.controller.Main", {

		formatter: formatter,

		onInit: function () {
			Date.prototype.addDays = function(days) {
				var date = new Date(this.valueOf());
				date.setDate(date.getDate() + days);
				return date;
			},

			this.oModel = this.getOwnerComponent().getModel();
			this.FlowState = this.getOwnerComponent().FlowState;
            this.getView().setModel(this.FlowState.getModel(), "reg");
			
            this.FlowState.getFlowStreams().then((flows)=>{
				this.createInteractiveBarChart(flows);
				const dToday = new Date();
				const iDay = dToday.getDate();
				this._handleLineGraph(iDay);

				this._handleAverageConsumptions();
			});

			// const oFlowModel = new ODataModel("v2/service/htf2022/");
			// const oChart = this.getView().byId("idLineChart");
			// oChart.setModel(oFlowModel);
			// const oChart2 = this.getView().byId("idLineChart2");
			// oChart2.setModel(oFlowModel);
		},

		

		interactiveBarChartSelectionChanged: function(oEvent){
			const oBar = oEvent.getParameter("bar");
			this._handleBarSelectedState(oBar);
			const iDay = parseInt(oBar.getLabel().split("/")[0]);
			this._handleLineGraph(oBar);
		},

		_handleBarSelectedState: function(oBar){
			const flowBars = this.FlowState.getProperty('flow').flowBars;
			let flowBarSelected = false; // default
			flowBars.map((flowBar)=>{
				if(this.dateFormatter(flowBar.date) === oBar.getLabel()){
					flowBarSelected = true;
					flowBar.selected = true;
					this.FlowState.updateFlow({selectedFlowBar: flowBar});
				} else {
					flowBar.selected = false;
				}
			});
			this.FlowState.updateFlow({flowBarSelected: flowBarSelected});
		},

		_handleLineGraph: function(iDay){
			const flowStreams = this.FlowState.getProperty("flow").FlowStreams;
			const selectedFlowStreams = flowStreams.filter((oStream) => {
				return parseInt(this.dateFormatter(oStream.datetime).split("/")[0]) === iDay;
			});
			this.FlowState.updateFlow({flowPoints: selectedFlowStreams});
		},

		_handleAverageConsumptions: function(){
			this._handleAverageMonth();
			this._handleAverageWeek();
			this._handleAverageToday();
		},

		_handleAverageMonth: function(){
			const total = this._handleTotalMonth();
			const average = total / 31;
			this.FlowState.updateFlow({averageConsumptionMonth: average});
		},

		_handleTotalMonth: function(){
			const monthFlows = this.FlowState.getProperty("flow").flowPoints;
			let total = 0;
			monthFlows.map((flow) => {
				total += flow.flow
			});
			this.FlowState.updateFlow({totalConsumptionMonth: total});
			return total;
		},

		_handleAverageWeek: function(){
			// const total = this._handleTotalMonth();
			// const average = total / 31;
			// this.FlowState.updateFlow({averageConsumptionMonth: average});
		},

		_handleTotalWeek: function(){
			// const total = this._handleTotalMonth();
			// const average = total / 31;
			// this.FlowState.updateFlow({averageConsumptionMonth: average});
		},

		_handleAverageDay: function(){
			// const total = this._handleTotalMonth();
			// const average = total / 31;
			// this.FlowState.updateFlow({averageConsumptionMonth: average});
		},

		_handleTotalDay: function(){
			// const total = this._handleTotalMonth();
			// const average = total / 31;
			// this.FlowState.updateFlow({averageConsumptionMonth: average});
		},

		createInteractiveBarChart: function(flows){
			//const flows = this.FlowState.getProperty('FlowStreams');
			let flowBars = [];
			let dates = [];
			const today = new Date();
			let filterFlows = flows.filter((flow)=>{
				let flowDate = parseInt(this.dateFormatter(flow.datetime).split(':')[0]);
				return flowDate > today.getDate() - 7 && flowDate <= today.getDate();
			})
			filterFlows.map(flow => {
				if(!dates.includes(this.dateFormatter(flow.datetime))){ // If new date entry = new bar
					dates.push(this.dateFormatter(flow.datetime));
					flowBars.push({ // Set new bar
						date: flow.datetime,
						flow: flow.flow,
						selected: false
					});
				} else { // Bar already exists
					flowBars.map((flowBar) => {
						if(this.dateFormatter(flowBar.date) === this.dateFormatter(flow.datetime)){ // Only update corresponding bar with same date
							flowBar.flow += flow.flow; // add flow amount
						}
					});
				}
			});
			this.FlowState.updateFlow({flowBars: flowBars})
		},

		timeFormatter: function (date) {
			if (date === null) return null;
			date = new Date(parseInt(date.substring(6, date.length).substring(0, date.length-2-6)));
			const dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "HH:mm"
			});
			return dateFormat.format(date)
		},
		dateFormatter: function (date) {
			if (date === null) return null;
			date = new Date(parseInt(date.substring(6, date.length).substring(0, date.length-2-6)));
			const dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd/MM"
			});
			return dateFormat.format(date)
		}
	});
});