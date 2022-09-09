sap.ui.define(["../BaseController"], function (BaseController, ) {
	"use strict";
	return BaseController.extend("com.flexso.htf2022.view.dialog.DashboardTileOptions", {
		onBeforeShow: function (parent, fragment, callback, data) {
			this.parent = parent;
			this.fragment = fragment;
			this.callback = callback;
			this.oButtonContext = data.buttoncontext;
		},
		actionSelected: function (sAction) {
			var oItem = this.oButtonContext.getObject();
			oItem.setVisual(sAction);
			this.parent.DashboardState.updateModel();
		},
		onClose: function () {
			this.fragment.close();
		}
	});
});