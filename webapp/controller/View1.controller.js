sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/core/routing/History"
], function(Controller, JSONModel, ODataModel, ODataModelV2, Fragment, MessageToast, MessageBox, Filter, History) {
	"use strict";
	// var jModel = new sap.ui.model.json.JSONModel();
	var jModel = new JSONModel();
	var url = "/sap/opu/odata/sap/ZHCM_SMS_SRV";
	var oModel = new ODataModel(url, true);
	var oModelv2 = new ODataModelV2(url);
	// , {
	// 	useBatch: false
	// });
	var me, result = {},
		Pernr = "",
		Mid = "",
		midSelect = "",
		i18nModel = i18nModel;
	return Controller.extend("SMSApp.controller.View1", {
		onInit: function() {
			this.getView().setModel(oModel);
			oModelv2.read("/Employee_f4Set", {
				success: function(oData, oResponse) {
					result.Employee_f4Set = oData.results;
					jModel.setData(result);
				},
				error: function(oError) {
					MessageToast.show(i18nModel.getProperty("Oderr"));
				}
			});
			me = this;
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
			this._oDialog.open();
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
			me = this;
			var oSelectedItems = oEvent.getParameter("selectedContexts"),
				stmt = "",
				uri = "";
			if (oSelectedItems && oSelectedItems.length) {
				for (var i = 0; i < oSelectedItems.length; i++) {
					var item = oSelectedItems[i];
					var OTemp = $(result.Employee_dataSet).filter(function(i, n) {
						return n.Pernr === item.getObject().Pernr;
					});
					if (OTemp.length === 0) {
						if (i === 0) {
							stmt = item.getObject().Pernr;
						} else {
							stmt += "@" + item.getObject().Pernr;
						}
					}
				}
			}
			if (stmt.length) {
				uri = "/Employee_dataSet?$filter=Pernr eq '" + stmt + "'";
				oModel.read(uri, {
					success: function(oData, oResponse) {
						if (result.Employee_dataSet === undefined) {
							result.Employee_dataSet = [];
						}
						if (result.Employee_dataSet.length === 0) {
							result.Employee_dataSet = oData.results;
						} else {
							for (var j = 0; j < oData.results.length; j++) {
								result.Employee_dataSet.push(oData.results[j]);
							}
						}
						jModel.setData(result);
						me.getView().setModel(jModel);
					},
					error: function(oError) {
						MessageToast.show(i18nModel.getProperty("Oderr"));
					}
				});
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		/**
		 *@memberOf SMSApp.controller.View1
		 */
		onTextChange: function(oEvent) {
			//This code was generated by the layout editor.
			if (oEvent.getSource().getValue().length > 255) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error); // if the field is empty after change, it will go red
			} else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None); // if the field is not empty after change, the value state (if any) is removed
			}
		},
		/**
		 *@memberOf SMSApp.controller.View1
		 */
		onDeleteRow: function(oEvent) {
			//This code was generated by the layout editor.
			var tbl = oEvent.getSource().getParent().getParent();
			var path = oEvent.getParameter("listItem").getBindingContext().getPath();
			var index = parseInt(path.substring(path.lastIndexOf("/") + 1), 10);
			//any other value than hex and oct, the radix is 10 (decimal)
			var model = tbl.getModel();
			var data = model.getProperty("/Employee_dataSet");
			data.splice(index, 1);
			model.setProperty("/Employee_dataSet", data);
		},
		/**
		 *@memberOf SMSApp.controller.View1
		 */
		onPressRemAll: function(oEventoEvent) {
			//This code was generated by the layout editor.
			if (result.Employee_dataSet && result.Employee_dataSet.length) {
				result.Employee_dataSet = [];
				jModel.setData(result);
				this.getView().setModel(jModel);
			}
		},
		/**
		 *@memberOf SMSApp.controller.View1
		 */
		onNavBack: function() {
			//This code was generated by the layout editor.
			window.history.go(-1);

		},
		/**
		 *@memberOf SMSApp.controller.View1
		 */
		onPressSend: function(oEvent) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			var msg = this.getView().getModel("i18n").getResourceBundle().getText("sendsms");
			MessageBox.confirm(msg, {
				onClose: function(oAction) {
					if (oAction === "OK") {}
				},
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			});
		},
		/**
		 *@memberOf SMSApp.controller.View1
		 */
		onPressCancel: function(oEvent) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			var msg = this.getView().getModel("i18n").getResourceBundle().getText("cancelsms");
			MessageBox.confirm(msg, {
				onClose: function(oAction) {
					if (oAction === "OK") {
						window.history.go(-1);
					}
				},
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			});
		}
	});
});