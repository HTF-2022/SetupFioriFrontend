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
			
            this.FlowState.getFlowStreams().then((aFlows)=>{
				this.createInteractiveBarChart(aFlows);
				const dToday = new Date();
				const iDay = dToday.getDate();
				this._handleLineGraph(iDay);

				this._handleTotalConsumptions();
				this._handleAverageConsumptions();
			});
		},

		tileValueformatter: function(sValue){
			const iValue = parseFloat(sValue);
			if(iValue > 1000000){
				return iValue / 1000000;
			} else if(iValue > 1000){
				return iValue / 1000;
			} else {
				return iValue;
			}
		},

		tileScaleformatter: function(sValue){
			const iValue = parseFloat(sValue);
			if(iValue > 1000000){
				return "M";
			} else if(iValue > 1000){
				return "K";
			} else {
				return "";
			}
		},

		interactiveBarChartSelectionChanged: function(oEvent){
			const oBar = oEvent.getParameter("bar");
			this._handleBarSelectedState(oBar);
			const iDay = parseInt(oBar.getLabel().split("/")[0]);
			this._handleLineGraph(iDay);
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
			const aFlowStreams = this.FlowState.getProperty("flow").FlowStreams;
			const aSelectedFlowStreams = aFlowStreams.filter((oStream) => {
				return (oStream.datetime.getDate() === iDay);
			});
			this.FlowState.updateFlow({flowPoints: aSelectedFlowStreams});
		},

		_handleAverageConsumptions: function(){
			this._handleAverageMonth();
			this._handleAverageWeek();
			this._handleAverageToday();
		},

		_handleTotalConsumptions: function(){
			this._handleTotalMonth();
			this._handleTotalWeek();
			this._handleTotalToday();
		},

		_handleAverageMonth: function(){
			const iTotal = this.FlowState.getProperty("flow").totalConsumptionMonth;
			const iAverage = iTotal / 31;
			this.FlowState.updateFlow({averageConsumptionMonth: iAverage});
			this._handleAverageMonthProgression(iAverage);
			return iAverage;
		},

		_handleAverageMonthProgression: function(iAverage){
			const iTotalPast = this.FlowState.getProperty("flow").totalConsumptionMonthPast;
			const iAveragePast = iTotalPast / 31;
			const oResult = this._compareConsumption(iAveragePast, iAverage);
			this.FlowState.updateFlow({averageConsumptionMonthPast: iAveragePast, averageConsumptionMonthValueState: oResult.sValueState, averageConsumptionMonthIndicator: oResult.sIndicator});
			return iAveragePast;
		},

		_handleTotalMonth: function(){
			const iTotal = this._countConsumption(new Date(), 31);
			this.FlowState.updateFlow({totalConsumptionMonth: iTotal});
			this._handleTotalMonthProgression(iTotal);
			return iTotal;
		},

		_handleTotalMonthProgression: function(iTotal){
			const dToday = new Date()
			const dPastDate = dToday.addDays(-31)
			const iTotalPast = this._countConsumption(dPastDate, 31);
			const oResult = this._compareConsumption(iTotalPast, iTotal);
			this.FlowState.updateFlow({totalConsumptionMonthPast: iTotalPast, totalConsumptionMonthValueState: oResult.sValueState, totalConsumptionMonthIndicator: oResult.sIndicator});
			return iTotalPast;
		},

		_handleAverageWeek: function(){
			const iTotal = this.FlowState.getProperty("flow").totalConsumptionWeek;
			const iAverage = iTotal / 7;
			this.FlowState.updateFlow({averageConsumptionWeek: iAverage});
			this._handleAverageWeekProgression(iAverage);
			return iAverage;
		},

		
		_handleAverageWeekProgression: function(iAverage){
			const iTotalPast = this.FlowState.getProperty("flow").totalConsumptionWeekPast;
			const iAveragePast = iTotalPast / 7;
			const oResult = this._compareConsumption(iAveragePast, iAverage);
			this.FlowState.updateFlow({averageConsumptionWeekPast: iAveragePast, averageConsumptionWeekValueState: oResult.sValueState, averageConsumptionWeekIndicator: oResult.sIndicator});
			return iAveragePast;
		},

		_handleTotalWeek: function(){
			const iTotal = this._countConsumption(new Date(), 7);
			this.FlowState.updateFlow({totalConsumptionWeek: iTotal});
			this._handleTotalWeekProgression(iTotal);
			return iTotal;
		},

		_handleTotalWeekProgression: function(iTotal){
			const dToday = new Date()
			const dPastDate = dToday.addDays(-7)
			const iTotalPast = this._countConsumption(dPastDate, 7);
			const oResult = this._compareConsumption(iTotalPast, iTotal);
			this.FlowState.updateFlow({totalConsumptionWeekPast: iTotalPast, totalConsumptionWeekValueState: oResult.sValueState, totalConsumptionWeekIndicator: oResult.sIndicator});
			return iTotalPast;
		},

		_handleAverageToday: function(){
			const iTotal = this.FlowState.getProperty("flow").totalConsumptionToday;
			const iAverage = iTotal / 24; // 24 hours
			this.FlowState.updateFlow({averageConsumptionToday: iAverage});
			this._handleAverageTodayProgression(iAverage);
			return iAverage;
		},

		_handleAverageTodayProgression: function(iAverage){
			const iTotalPast = this.FlowState.getProperty("flow").totalConsumptionTodayPast;
			const iAveragePast = iTotalPast / 24; // 24 hours
			const oResult = this._compareConsumption(iAveragePast, iAverage);
			this.FlowState.updateFlow({averageConsumptionTodayPast: iAveragePast, averageConsumptionTodayValueState: oResult.sValueState, averageConsumptionTodayIndicator: oResult.sIndicator});
			return iAveragePast;
		},

		_handleTotalToday: function(){
			const iTotal = this._countConsumption(new Date(), 1);
			this.FlowState.updateFlow({totalConsumptionToday: iTotal});
			this._handleTotalTodayProgression(iTotal);
			return iTotal;
		},

		_handleTotalTodayProgression: function(iTotal){
			const dToday = new Date()
			const dPastDate = dToday.addDays(-1)
			const iTotalPast = this._countConsumption(dPastDate, 1);
			const oResult = this._compareConsumption(iTotalPast, iTotal);
			this.FlowState.updateFlow({totalConsumptionTodayPast: iTotalPast, totalConsumptionTodayValueState: oResult.sValueState, totalConsumptionTodayIndicator: oResult.sIndicator});
			return iTotalPast;
		},

		_countConsumption: function(dStartDate, iDuration){
			const dXDaysAgo = dStartDate.addDays(-iDuration);
			const aFlowStreams = this.FlowState.getProperty("flow").FlowStreams;
			
			let aFlows = aFlowStreams.filter((oFlow)=>{
				// let iFlowDate = this.formatDate(oFlow.datetime);
				// return iFlowDate > this.formatDate(dXDaysAgo) && iFlowDate <= this.formatDate(dStartDate); // Past 7 days including today
				let iFlowDate = oFlow.datetime;
				return iFlowDate > dXDaysAgo && iFlowDate <= dStartDate; // Past 7 days including today
			})
			let iTotal = 0;
			aFlows.map((oFlow) => {
				iTotal += oFlow.flow
			});
			return iTotal;
		},

		_compareConsumption: function(iTotalPast, iTotal){
			let sValueState;
			if(iTotalPast < iTotal * 1.5){ // consumption has risen by a lot
				sValueState = "Error";
			} else if(iTotalPast < iTotal){ // consumption has risen a bit
				sValueState = "Critical";
			} else if (iTotalPast === iTotal){ // consumption is same
				sValueState = "Neutral";
			} else {
				sValueState = "Good";
			}
			let sIndicator;
			switch(sValueState){
				case "Critical":
				case "Error":
					sIndicator = "Up";
					break;
				case "Good":
					sIndicator = "Down";
					break;
				default: 
					sIndicator = 'None';
					break;
			}
			return {
				sValueState: sValueState,
				sIndicator: sIndicator
			}
		},

		pressTotalConsumptionMonth: function(){
			const oFlowModel = this.FlowState.getProperty('flow');
			const dToday = new Date();
			const dPastDate = dToday.addDays(-31);
			const sTimeSpan = `${this.formatDate(dPastDate)} - ${this.formatDate(dToday)}`;
			const sLastMonth = `${this.tileValueformatter(oFlowModel.totalConsumptionMonthPast)} ${this.tileScaleformatter(oFlowModel.totalConsumptionMonthPast)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitMonth")})`;
			const iDifference = (oFlowModel.totalConsumptionMonth - oFlowModel.totalConsumptionMonthPast);
			const bState = iDifference > 0;
			const sDifference = `${this.tileValueformatter(iDifference)} ${this.tileScaleformatter(iDifference)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitMonth")})`;
			this.FlowState.updateFlow({
				dialogTileHeader: this.getView().getModel("i18n").getResourceBundle().getText("totalConsumption"),
				dialogTileSubheader: this.getView().getModel("i18n").getResourceBundle().getText("thisMonth"),
				dialogTileUnit: this.getView().getModel("i18n").getResourceBundle().getText("unitMonth"),
				dialogTileValue: oFlowModel.totalConsumptionMonth, 
				dialogTileValueColor: oFlowModel.totalConsumptionMonthValueState,
				dialogTileIndicator: oFlowModel.totalConsumptionMonthIndicator,
				dialogPrevSessionLabel: this.getView().getModel("i18n").getResourceBundle().getText("lastMonth"),
				dialogTileTimeSpan: sTimeSpan,
				dialogTileLastMonth: sLastMonth,
				dialogTileDifference: sDifference,
				dialogTileDifferenceState: bState
			});
			this.onOpenGenericTileDialog();
		},

		pressTotalConsumptionWeek: function(){
			const oFlowModel = this.FlowState.getProperty('flow');
			const dToday = new Date();
			const dPastDate = dToday.addDays(-7);
			const sTimeSpan = `${this.formatDate(dPastDate)} - ${this.formatDate(dToday)}`;
			const sLastMonth = `${this.tileValueformatter(oFlowModel.totalConsumptionWeekPast)} ${this.tileScaleformatter(oFlowModel.totalConsumptionWeekPast)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitWeek")})`;
			const iDifference = (oFlowModel.totalConsumptionWeek - oFlowModel.totalConsumptionWeekPast);
			const bState = iDifference > 0;
			const sDifference = `${this.tileValueformatter(iDifference)} ${this.tileScaleformatter(iDifference)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitWeek")})`;
			this.FlowState.updateFlow({
				dialogTileHeader: this.getView().getModel("i18n").getResourceBundle().getText("totalConsumption"),
				dialogTileSubheader: this.getView().getModel("i18n").getResourceBundle().getText("thisWeek"),
				dialogTileUnit: this.getView().getModel("i18n").getResourceBundle().getText("unitWeek"),
				dialogTileValue: oFlowModel.totalConsumptionWeek, 
				dialogTileValueColor: oFlowModel.totalConsumptionWeekValueState,
				dialogTileIndicator: oFlowModel.totalConsumptionWeekIndicator,
				dialogPrevSessionLabel: this.getView().getModel("i18n").getResourceBundle().getText("lastWeek"),
				dialogTileTimeSpan: sTimeSpan,
				dialogTileLastMonth: sLastMonth,
				dialogTileDifference: sDifference,
				dialogTileDifferenceState: bState
			});
			this.onOpenGenericTileDialog();
		},

		pressTotalConsumptionToday: function(){
			const oFlowModel = this.FlowState.getProperty('flow');
			const dToday = new Date();
			const dPastDate = dToday.addDays(-1);
			const sTimeSpan = `${this.formatDate(dPastDate)} - ${this.formatDate(dToday)}`;
			const sLastMonth = `${this.tileValueformatter(oFlowModel.totalConsumptionTodayPast)} ${this.tileScaleformatter(oFlowModel.totalConsumptionTodayPast)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitDay")})`;
			const iDifference = (oFlowModel.totalConsumptionToday - oFlowModel.totalConsumptionTodayPast);
			const bState = iDifference > 0;
			const sDifference = `${this.tileValueformatter(iDifference)} ${this.tileScaleformatter(iDifference)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitDay")})`;
			this.FlowState.updateFlow({
				dialogTileHeader: this.getView().getModel("i18n").getResourceBundle().getText("totalConsumption"),
				dialogTileSubheader: this.getView().getModel("i18n").getResourceBundle().getText("today"),
				dialogTileUnit: this.getView().getModel("i18n").getResourceBundle().getText("unitDay"),
				dialogTileValue: oFlowModel.totalConsumptionToday, 
				dialogTileValueColor: oFlowModel.totalConsumptionTodayValueState,
				dialogTileIndicator: oFlowModel.totalConsumptionTodayIndicator,
				dialogPrevSessionLabel: this.getView().getModel("i18n").getResourceBundle().getText("yesterday"),
				dialogTileTimeSpan: sTimeSpan,
				dialogTileLastMonth: sLastMonth,
				dialogTileDifference: sDifference,
				dialogTileDifferenceState: bState
			});
			this.onOpenGenericTileDialog();
		},

		pressAverageConsumptionMonth: function(){
			const oFlowModel = this.FlowState.getProperty('flow');
			const dToday = new Date();
			const dPastDate = dToday.addDays(-31);
			const sTimeSpan = `${this.formatDate(dPastDate)} - ${this.formatDate(dToday)}`;
			const sLastMonth = `${this.tileValueformatter(oFlowModel.averageConsumptionMonthPast).toFixed(2)} ${this.tileScaleformatter(oFlowModel.averageConsumptionMonthPast)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitDay")})`;
			const iDifference = (oFlowModel.averageConsumptionMonth - oFlowModel.averageConsumptionMonthPast);
			const bState = iDifference > 0;
			const sDifference = `${this.tileValueformatter(iDifference).toFixed(2)} ${this.tileScaleformatter(iDifference)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitDay")})`;
			this.FlowState.updateFlow({
				dialogTileHeader: this.getView().getModel("i18n").getResourceBundle().getText("averageConsumption"),
				dialogTileSubheader: this.getView().getModel("i18n").getResourceBundle().getText("thisMonth"),
				dialogTileUnit: this.getView().getModel("i18n").getResourceBundle().getText("unitDay"),
				dialogTileValue: oFlowModel.averageConsumptionMonth, 
				dialogTileValueColor: oFlowModel.averageConsumptionMonthValueState,
				dialogTileIndicator: oFlowModel.averageConsumptionMonthIndicator,
				dialogPrevSessionLabel: this.getView().getModel("i18n").getResourceBundle().getText("lastMonth"),
				dialogTileTimeSpan: sTimeSpan,
				dialogTileLastMonth: sLastMonth,
				dialogTileDifference: sDifference,
				dialogTileDifferenceState: bState
			});
			this.onOpenGenericTileDialog();
		},

		pressAverageConsumptionWeek: function(){
			const oFlowModel = this.FlowState.getProperty('flow');
			const dToday = new Date();
			const dPastDate = dToday.addDays(-7);
			const sTimeSpan = `${this.formatDate(dPastDate)} - ${this.formatDate(dToday)}`;
			const sLastMonth = `${this.tileValueformatter(oFlowModel.averageConsumptionWeekPast).toFixed(2)} ${this.tileScaleformatter(oFlowModel.averageConsumptionWeekPast)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitDay")})`;
			const iDifference = (oFlowModel.averageConsumptionWeek - oFlowModel.averageConsumptionWeekPast);
			const bState = iDifference > 0;
			const sDifference = `${this.tileValueformatter(iDifference).toFixed(2)} ${this.tileScaleformatter(iDifference)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitDay")})`;
			this.FlowState.updateFlow({
				dialogTileHeader: this.getView().getModel("i18n").getResourceBundle().getText("averageConsumption"),
				dialogTileSubheader: this.getView().getModel("i18n").getResourceBundle().getText("thisWeek"),
				dialogTileUnit: this.getView().getModel("i18n").getResourceBundle().getText("unitDay"),
				dialogTileValue: oFlowModel.averageConsumptionWeek, 
				dialogTileValueColor: oFlowModel.averageConsumptionWeekValueState,
				dialogTileIndicator: oFlowModel.averageConsumptionWeekIndicator,
				dialogPrevSessionLabel: this.getView().getModel("i18n").getResourceBundle().getText("lastWeek"),
				dialogTileTimeSpan: sTimeSpan,
				dialogTileLastMonth: sLastMonth,
				dialogTileDifference: sDifference,
				dialogTileDifferenceState: bState
			});
			this.onOpenGenericTileDialog();
		},

		pressAverageConsumptionToday: function(){
			const oFlowModel = this.FlowState.getProperty('flow');
			const dToday = new Date();
			const dPastDate = dToday.addDays(-1);
			const sTimeSpan = `${this.formatDate(dPastDate)} - ${this.formatDate(dToday)}`;
			const sLastMonth = `${this.tileValueformatter(oFlowModel.averageConsumptionTodayPast).toFixed(2)} ${this.tileScaleformatter(oFlowModel.averageConsumptionTodayPast)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitHours")})`;
			const iDifference = (oFlowModel.averageConsumptionToday - oFlowModel.averageConsumptionTodayPast);
			const bState = iDifference > 0;
			const sDifference = `${this.tileValueformatter(iDifference).toFixed(2)} ${this.tileScaleformatter(iDifference)} (${this.getView().getModel("i18n").getResourceBundle().getText("unitHours")})`;
			this.FlowState.updateFlow({
				dialogTileHeader: this.getView().getModel("i18n").getResourceBundle().getText("averageConsumption"),
				dialogTileSubheader: this.getView().getModel("i18n").getResourceBundle().getText("today"),
				dialogTileUnit: this.getView().getModel("i18n").getResourceBundle().getText("unitHours"),
				dialogTileValue: oFlowModel.averageConsumptionToday, 
				dialogTileValueColor: oFlowModel.averageConsumptionTodayValueState,
				dialogTileIndicator: oFlowModel.averageConsumptionTodayIndicator,
				dialogPrevSessionLabel: this.getView().getModel("i18n").getResourceBundle().getText("yesterday"),
				dialogTileTimeSpan: sTimeSpan,
				dialogTileLastMonth: sLastMonth,
				dialogTileDifference: sDifference,
				dialogTileDifferenceState: bState
			});
			this.onOpenGenericTileDialog();
		},

		onOpenGenericTileDialog: function () {
            // create dialog lazily
            if (!this.oGenericTileDialog) {
                this.oGenericTileDialog = this.loadFragment({
                    name: "com.flexso.htf2022.view.dialogs.GenericTileDialog"
                });
            }
            this.oGenericTileDialog.then((oDialog) => {
                oDialog.open();
            });
        },

		onCloseGenericTileDialog: function(){
			this.oGenericTileDialog.then((oDialog) => {
				oDialog.close();
			});
		},

		createInteractiveBarChart: function(aFlows){
			let aFlowBars = [];
			let aDates = [];
			const dToday = new Date();
			const d7DaysAgo = dToday.addDays(-7);
			let aFilterFlows = aFlows.filter((oFlow)=>{
				let iFlowDate = this.formatDate(oFlow.datetime);
				return iFlowDate > this.formatDate(d7DaysAgo) && iFlowDate <= this.formatDate(dToday); // Past 7 days including today
			})
			aFilterFlows.map(oFlow => {
				if(!aDates.includes(this.formatDate(oFlow.datetime))){ // If new date entry = new bar
					aDates.push(this.formatDate(oFlow.datetime));
					aFlowBars.push({ // Set new bar
						date: oFlow.datetime,
						flow: oFlow.flow,
						selected: false // default unselected
					});
				} else { // Bar already exists
					aFlowBars.map((flowBar) => {
						if(this.formatDate(flowBar.date) === this.formatDate(oFlow.datetime)){ // Only update corresponding bar with same date
							flowBar.flow += oFlow.flow; // add flow amount
						}
					});
				}
			});
			this.FlowState.updateFlow({flowBars: aFlowBars})
		},

		formatDate: function(dDate){
			return [
			  	this.padTo2Digits(dDate.getDate()),
			  	this.padTo2Digits(dDate.getMonth() + 1),
				dDate.getFullYear()
			].join('/');
		},

		padTo2Digits: function(iNum){
			return iNum.toString().padStart(2, '0');
		},

		timeFormatter: function (date) {
			if (date === null) return null;
			const dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "HH:mm"
			});
			return dateFormat.format(date)
		},

		dateFormatter: function (date) {
			if (date === null) return null;
			const dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd/MM"
			});
			return dateFormat.format(date)
		}
	});
});