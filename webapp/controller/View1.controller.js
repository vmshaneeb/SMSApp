sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/ui/model/Filter"
], function(Controller, JSONModel, Fragment, Filter, MessageToast) {
	"use strict";
	// var jModel = new sap.ui.model.json.JSONModel();
	var jModel = new JSONModel();
	return Controller.extend("SMSApp.controller.View1", {
		onInit: function() {
			var result = {},
				Pernr = "",
				Mid = "",
				midSelect = "",
				i18nModel = i18nModel; // this.getView().setModel(oModel);
		},
		onPressAdd: function(oEvent) {
			// var me = this;
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("SMSApp.utils.User", this);
				this._oDialog.setModel(jModel);
				this.getView().addDependent(this._oDialog);
			}
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);
			// clear the old search filter
			this._oDialog.getBinding("items").filter([]);
			// toggle compact style
			// jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open(); // addIcon.setBusy(false);
		},
		onExit: function() {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},
		handleTableSelectDialogPress: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.m.sample.TableSelectDialog.Dialog", this);
			}
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);
			this.getView().addDependent(this._oDialog);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			// var oFilter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
			// var oBinding = oEvent.getSource().getBinding("items");
			// oBinding.filter([oFilter]);
			var oFilter = new sap.ui.model.Filter("Mid", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter1 = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter2 = new sap.ui.model.Filter("Ename", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter3 = new sap.ui.model.Filter("Orgeh", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter4 = new sap.ui.model.Filter("Orgtx", sap.ui.model.FilterOperator.Contains, sValue);
			var allfilter = new sap.ui.model.Filter([
				oFilter,
				oFilter1,
				oFilter2,
				oFilter3,
				oFilter4
			], false);
			oEvent.getSource().getBinding("items").filter(allfilter);
		},
		handleClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
					return oContext.getObject().Name;
				}).join(", "));
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		/**
		 *@memberOf SMSApp.controller.View1
		 */
		onTextChange: function(oEvent) {
			//This code was generated by the layout editor.
			if (oEvent.getSource().getValue().length > 100) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error); // if the field is empty after change, it will go red
			} else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None); // if the field is not empty after change, the value state (if any) is removed
			}
		}
	});
});