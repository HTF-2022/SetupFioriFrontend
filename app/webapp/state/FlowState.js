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
				this.getService().getFlowHint(sFlowState).then((oResult)=>{
                    this.updateFlow({oHint: oResult});
                    resolve(oResult);
                }).catch((oError)=>{
                    reject(oError);
                });
			});
        },
        getFlowQuote: function(bIsGood){
            return new Promise((resolve, reject) => {
				this.getService().getFlowQuote(bIsGood).then((oResult)=>{
                    this.updateFlow({oQuote: oResult});
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
        // _getUniqueItemsByProperties: function (items, propNames) {
        //     return items.filter((item, index, array) =>
        //         index === array.findIndex(foundItem => this._isPropValuesEqual(foundItem, item, propNames))
        //     );
        // },
        // _isPropValuesEqual: function (subject, target, propNames) {
        //     return propNames.every(propName => subject[propName] === target[propName]);
        // }
    });
    return FlowState;
});