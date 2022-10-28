/* global axios: true */
sap.ui.define([
    "sap/ui/base/Object",
    "../libs/axios.min"
], function (Object, axiosjs) {
    "use strict";

    var FlowService = Object.extend("com.waterleau.hu.optimizinghuprocess.state.FlowService", {
        constructor: function (model) {
            Object.call(this);
            this.model = model;
            this.serviceUrl = this.model.sServiceUrl;

            axios.defaults.headers.common['Content-Type'] = "application/json";
            axios.defaults.headers.common['Accept'] = "application/json";
            // if (this.model) {
            //     for (var header in this.model.getHttpHeaders()) {
            //         axios.defaults.headers.common[header] = this.model.getHttpHeaders()[header];
            //     }
            // }
        },
        getFlowStreams: function () {
            return axios.get(`${this.serviceUrl}\/FlowStream`).then((oResult) => {
                return oResult.data.d.results;
            });
        },
        getFlowHint: function (sFlowState) {
            return axios.get(`${this.serviceUrl}\/FlowHint`).then((oResult) => {
                let aQuotes = oResult.data.d.results;
                let aFiltered = aQuotes.filter((oQuote) => oQuote.state === sFlowState);
                return aFiltered[Math.floor(Math.random() * aFiltered.length)];
            });
        },
        getFlowQuote: function (bIsGood) {
            return axios.get(`${this.serviceUrl}\/GandalfQuote`).then((oResult) => {
                let aQuotes = oResult.data.d.results;
                let bFilterVal = bIsGood ? "GOOD" : "BAD";
                let aFiltered = aQuotes.filter((oQuote) => oQuote.type === bFilterVal);
                return aFiltered[Math.floor(Math.random() * aFiltered.length)];
            });

        }
    });
    return FlowService;
});