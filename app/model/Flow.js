sap.ui.define([
	"./BaseObject"
], function (BaseObject) {
	"use strict";
	return BaseObject.extend("com.flexso.htf2022.model.Flow", {
		constructor: function (data) {
			BaseObject.call(this, data);
			this.resourceModel = data.resourceModel;
			this.flowId = '';
		},
		saveToHistory: function () {
			this.history = this.getJSONForHistory();
		},
		recoverHistory: function () {
			if (this.history) {
				this.copyFieldsToThis(this.history, ["type", "exists"]);
				this.options = JSON.parse(JSON.stringify(this.history.options));
				this.typeOptions = JSON.parse(JSON.stringify(this.history.typeOptions));
			}
		},
		getNameByKey: function (listname, key) {
			return this[listname] && this[listname].find(item => item.key === key);
		},
		// getJSON: function () {
		// 	return {};
		// },
		updateFlow: function(oFlow){
			for(const entry of Object.entries(oFlow)){
				this[entry[0]] = entry[1]
			}
		}
	});
});