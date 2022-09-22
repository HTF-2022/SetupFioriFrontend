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
                    //this.addNewFlows(oResult);
                    const aFlows = this.saveFlows(oResult);
                    resolve(aFlows);
                }).catch((oError)=>{
                    reject(oError);
                });
			});
        },
        saveFlows: function(aFlows){
            if(aFlows){
                aFlows = this.parseFlows(aFlows);
                this.updateFlow({FlowStreams: aFlows});
            }
            return aFlows;
        },
        addNewFlows: function(aNewFlows){
            let aFlows = this.getProperty("flow").FlowStreams;
            if(aNewFlows){
                aNewFlows = this.parseFlows(aNewFlows);
            }
            if(aFlows){
                const aAllFlows = aFlows.concat(aNewFlows);
                this.updateFlow({FlowStreams: aAllFlows});
            } else {
                this.updateFlow({FlowStreams: aNewFlows}); // initial fill
            }
        },
        parseFlows: function(aFlows){
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