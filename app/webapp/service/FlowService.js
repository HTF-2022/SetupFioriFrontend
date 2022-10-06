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
            return axios.get(`${this.serviceUrl}\/FlowHint?$filter=state eq '${sFlowState}'`).then((oResult) => {
                return oResult.data.d.results[0];
            });
        }
    });
    return FlowService;
});