sap.ui.define([
    "./BaseState",
    "../model/Flow",
], function (BaseState, Flow) {
    "use strict";
    var FlowState = BaseState.extend("com.flexso.htf2022.state.FlowState", {
        constructor: function (opt) {
            this.resourceModel = opt.resourceModel;
            this.service = opt.service;
            this.data = {
                flow: new Flow({ resourceModel: this.resourceModel })
            };
            BaseState.call(this);
        },
        getFlowStreams: function(){
            return new Promise((resolve, reject) => {
				this.getService().getFlowStreams().then((oResult)=>{
                    const aFlows = this._saveFlows(oResult);
                    resolve(aFlows);
                }).catch((oError)=>{
                    reject(oError);
                });
			});
        },
        getFlowHint: function(sFlowState){
            return new Promise((resolve, reject) => {
				this.getService().getFlowHints().then((oResult)=>{
                    let aFiltered = oResult.filter((oQuote) => oQuote.state === sFlowState);
                    let oHint = aFiltered[Math.floor(Math.random() * aFiltered.length)];
                    this.updateFlow({oHint: oHint});
                    resolve(oResult);
                }).catch((oError)=>{
                    reject(oError);
                });
			});
        },
        getFlowQuote: function(bIsGood){
            return new Promise((resolve, reject) => {
				this.getService().getFlowQuotes().then((oResult)=>{
                    let bFilterVal = bIsGood ? "GOOD" : "BAD";
                    let aFiltered = oResult.filter((oQuote) => oQuote.type === bFilterVal);
                    let oQuote = aFiltered[Math.floor(Math.random() * aFiltered.length)];
                    this.updateFlow({oQuote: oQuote});
                    resolve(oResult);
                }).catch((oError)=>{
                    reject(oError);
                });
			});
        },
        _saveFlows: function(aFlows){
            let aParsedFlows;
            if(aFlows){
                aParsedFlows = this._parseFlows(aFlows);
                this.updateFlow({FlowStreams: aParsedFlows});
            }
            return aParsedFlows;
        },
        _parseFlows: function(aFlows){
            aFlows.forEach((oFlow) => {
                oFlow.flow = parseFloat(oFlow.flow);
                oFlow.datetime = new Date(oFlow.datetime);
            });
            return aFlows;
        },
        updateFlow: function (oFlow) {
            this.getProperty("flow").updateFlow(oFlow);
            this.updateModel();
        },
        getFlowJSON: function(){
            return this.getProperty("flow").getJSON();
        },
        getService: function () {
            return this.service;
        }
    });
    return FlowState;
});