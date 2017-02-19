var i18nModel;

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"SMSApp/model/models",
	"sap/ui/model/resource/ResourceModel"
], function(UIComponent, Device, models, ResourceModel) {
	"use strict";

	return UIComponent.extend("SMSApp.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {

			// set i18n model
			i18nModel = new ResourceModel({
				bundleName: "SMSApp.i18n.i18n"
			});
			this.setModel(i18nModel, "i18n");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});