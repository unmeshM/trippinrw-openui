/*
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides base class sap.ui.core.Component for all components
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', './ComponentMetadata', './Core'],
	function(jQuery, ManagedObject, ComponentMetadata, Core) {
	"use strict";

//jQuery.sap.require("sap.ui.model.json.JSONModel");
	
	/**
	 * Creates and initializes a new component with the given <code>sId</code> and
	 * settings.
	 * 
	 * The set of allowed entries in the <code>mSettings</code> object depends on
	 * the concrete subclass and is described there. See {@link sap.ui.core.Component}
	 * for a general description of this argument.
	 * 
	 * @param {string}
	 *            [sId] optional id for the new control; generated automatically if
	 *            no non-empty id is given Note: this can be omitted, no matter
	 *            whether <code>mSettings</code> will be given or not!
	 * @param {object}
	 *            [mSettings] optional map/JSON-object with initial settings for the
	 *            new component instance
	 * @public
	 * 
	 * @class Base Class for Component.
	 * @extends sap.ui.base.ManagedObject
	 * @abstract
	 * @author SAP SE
	 * @version 1.24.2
	 * @name sap.ui.core.Component
	 * @since 1.9.2
	 */
	var Component = ManagedObject.extend("sap.ui.core.Component", /** @lends sap.ui.core.Component.prototype */
	
	{
		constructor : function(sId, mSettings) {
	
			ManagedObject.apply(this, arguments);
	
		},
	
		metadata : {
			stereotype : "component",
			"abstract": true,
			version : "0.0",
			includes : [],    // css, javascript files that should be used in the component
			dependencies : {  // external dependencies
				libs : [],
				components : [],
				ui5version : ""
			},
			config: {}, // static configuration
			customizing: { // component/view customizing
				
				/* Example:
				"sap.ui.viewReplacements": {
					"sap.xx.org.Main": {
						viewName: "sap.xx.new.Main",
						type: "XML"
					}
				},
				"sap.ui.controllerReplacements": {
					"sap.xx.org.Main": "sap.xx.new.Main"
				},
				"sap.ui.viewExtensions": {
					"sap.xx.new.Main": {
						"extensionX": {
							name: "sap.xx.new.Fragment1",
							type: "sap.ui.core.XMLFragment"
						},
						"extensionY": {
							...
						}
					}
				},
				"sap.ui.viewModification": {
					"sap.xx.new.Main": {
						"myControlId": {
							text: "{i18n_custom>mytext}"
						}
					}
				}
				*/
			},
			/*
			properties: {
				config : "any"
			},
			*/
			library: "sap.ui.core"
		}
	
	}, /* Metadata constructor */ ComponentMetadata);
	
	
	/**
	 * Activates the customizing configuration for the given component.
	 * @param {string} sComponentName the name of the component to activate
	 * @private
	 * @name sap.ui.core.Component.activateCustomizing
	 * @function
	 * @deprecated Since 1.21.0 as it is handled by component instantiation
	 */
	Component.activateCustomizing = function(sComponentName) {
		// noop since it will be handled by component instantiation
	};
	
	/**
	 * Deactivates the customizing configuration for the given component.
	 * @param {string} sComponentName the name of the component to activate
	 * @private
	 * @name sap.ui.core.Component.deactivateCustomizing
	 * @function
	 * @deprecated Since 1.21.0 as it is handled by component termination
	 */
	Component.deactivateCustomizing = function(sComponentName) {
		// noop since it will be handled by component termination
	};
	
	/**
	 * Returns the ID of the owner UI Component in which the given Component or View has been created using 
	 * <pre>
	 *   UIComponent.prototype.createContent();
	 * </pre>
	 *  
	 * @param {sap.ui.core.Component|sap.ui.core.mvc.View} oObject Object to retrieve the owner for
	 * @return {string} the owner component ID
	 * @static
	 * @public
	 * @since 1.15.1 
	 * @name sap.ui.core.Component.getOwnerIdFor
	 * @function
	 */
	Component.getOwnerIdFor = function(oObject) {
		// the owner id is only supported for Components and Views
		if (oObject && (oObject instanceof Component ||
				        oObject instanceof sap.ui.core.mvc.View)) {
			return ManagedObject.getOwnerIdFor(oObject);
		} 
	};
	
	/**
	 * @see sap.ui.base.Object#getInterface
	 * @public
	 * @name sap.ui.core.Component#getInterface
	 * @function
	 */
	Component.prototype.getInterface = function() {
		return this;
	};
	
	/*
	 * initialize the Component and keep the component data
	 * @name sap.ui.core.Component#_initCompositeSupport
	 * @function
	 */
	Component.prototype._initCompositeSupport = function(mSettings) {
	
		// registry of mock servers
		this._mMockServers = {};
		
		// register the component instance
		this.getMetadata().onInitComponent();
		
		// make user specific data available during component instantiation
		this.oComponentData = mSettings && mSettings.componentData;
	
		// static initialization
		this.getMetadata().init();
		
		// init the component models
		this.initComponentModels();
		
		// error handler (if exists)
		if (this.onWindowError) {
			this._fnWindowErrorHandler = jQuery.proxy(function(oEvent) {
				var oError = oEvent.originalEvent;
				this.onWindowError(oError.message, oError.filename, oError.lineno);
			}, this);
			jQuery(window).bind("error", this._fnWindowErrorHandler);
		}
	
		// before unload handler (if exists)
		if (this.onWindowBeforeUnload) {
			this._fnWindowBeforeUnloadHandler = jQuery.proxy(this.onWindowBeforeUnload, this);
			jQuery(window).bind("beforeunload", this._fnWindowBeforeUnloadHandler);
		}
	
		// unload handler (if exists)
		if (this.onWindowUnload) {
			this._fnWindowUnloadHandler = jQuery.proxy(this.onWindowUnload, this);
			jQuery(window).bind("unload", this._fnWindowUnloadHandler);
		}
		
	};
	
	/*
	 * clean up mock server and event handlers
	 * @name sap.ui.core.Component#destroy
	 * @function
	 */
	Component.prototype.destroy = function() {
		
		// kill the mock servers
		if (this._mMockServers) {
			jQuery.each(this._mMockServers, function(sName, oMockServer) {
				oMockServer.stop();
			});
			delete this._mMockServers;
		}
		
		// remove the event handlers
		if (this._fnWindowErrorHandler) {
			jQuery(window).unbind("error", this._fnWindowErrorHandler);
			delete this._fnWindowErrorHandler;
		}
		if (this._fnWindowBeforeUnloadHandler) {
			jQuery(window).unbind("beforeunload", this._fnWindowBeforeUnloadHandler);
			delete this._fnWindowBeforeUnloadHandler; 
		}
		if (this._fnWindowUnloadHandler) {
			jQuery(window).unbind("unload", this._fnWindowUnloadHandler);
			delete this._fnWindowUnloadHandler;
		}
		
		// destroy event bus
		if(this._oEventBus){
			this._oEventBus.destroy();
			delete this._oEventBus;
		}
		
		// destroy the object
		ManagedObject.prototype.destroy.apply(this, arguments);
		
		// unregister the component instance
		this.getMetadata().onExitComponent();
		
	};
	
	
	/**
	 * Returns user specific data object
	 *
	 * @return {object} componentData
	 * @public
	 * @since 1.15.0
	 * @name sap.ui.core.Component#getComponentData
	 * @function
	 */
	Component.prototype.getComponentData = function() {
		return this.oComponentData;
	};
	
	
	/**
	 * Returns the event bus of this component.
	 * @return {sap.ui.core.EventBus} the event bus
	 * @since 1.20.0
	 * @public
	 * @name sap.ui.core.Component#getEventBus
	 * @function
	 */
	Component.prototype.getEventBus = function() {
		if(!this._oEventBus){
			jQuery.sap.require("sap.ui.core.EventBus");
			this._oEventBus = new sap.ui.core.EventBus();
		}
		return this._oEventBus;
	};
	
	
	/**
	 * Initializes the component models and services.
	 * 
	 * @private
	 * @name sap.ui.core.Component#initComponentModels
	 * @function
	 */
	Component.prototype.initComponentModels = function(mModels, mServices) {
		
		var oMetadata = this.getMetadata();
		
		// get the application configuration
		var oModelsConfig = mModels || oMetadata.getModels(),
		    oServicesConfig = mServices || oMetadata.getServices();
	
		// iterate over the model configurations and create and register the 
		// models base on the configuration if available
		if (oModelsConfig) {
			
			// create and start the mock server
			var fnCreateMockServer = function(sName, sUri, sMetadataUrl, sMockdataBaseUrl) {
				
				// kill the existing mock server
				if (this._mMockServers[sName]) {
					this._mMockServers[sName].stop();
				}
				
				// start the mock server
				jQuery.sap.require("sap.ui.core.util.MockServer");
				this._mMockServers[sName] = new sap.ui.core.util.MockServer({
					rootUri: sUri
				});
				
				this._mMockServers[sName].simulate(sMetadataUrl, sMockdataBaseUrl);
				this._mMockServers[sName].start();
					
			};
			
			// helper to create a model depending on the type
			// TODO: models could have generic instantiation to pass the JSON object 
			//       of the configuration directly instead of individual handling 
			var fnCreateModel = function(sName, oConfig) {
				
				// extract uri and type
				var sUri = oConfig.uri, sType = oConfig.type;
				
				// require the model and instantiate it
				jQuery.sap.require(sType);
				var oClass = jQuery.sap.getObject(sType);
				jQuery.sap.assert(oClass !== undefined, "The specified model type \"" + sType + "\" could not be found!");
				
				// create the model and apply the configuration
				var oModel;
				if (sType === "sap.ui.model.resource.ResourceModel") {
					oModel = new oClass({bundleUrl: sUri});
				} else if (sType === "sap.ui.model.odata.ODataModel") {
					// check for a mock server configuration and start the mock server
					if (oConfig.mockserver) {
						fnCreateMockServer.call(this, sName, sUri, oConfig.mockserver.model, oConfig.mockserver.data);
					}
					// create the model
					oModel = new oClass(sUri, oConfig.settings);
				} else if (sType === "sap.ui.model.json.JSONModel" || sType === "sap.ui.model.xml.XMLModel") {
					oModel = new oClass();
					if (sUri) {
						oModel.loadData(sUri);
					}
				} /* else {
					TODO: what about custom models / analog to ODataModel & setting? 
				} */
	
				// check the model to be an instance of sap.ui.model.Model
				jQuery.sap.assert(oModel instanceof sap.ui.model.Model, "The specified model type \"" + sType + "\" must be an instance of sap.ui.model.Model!");
				return oModel;
	
			};
			
			// create the models
			var that = this;
			jQuery.each(oModelsConfig, function(sKey, oModelConfig) {
				
				// if the model refer to a service configuration we use the service configuration 
				var sService = oModelConfig.service, 
				    oModel;
				if (sService) {
					var oServiceConfig = oServicesConfig[sService]; 
					jQuery.sap.assert(oServiceConfig, "The service configuration for service \"" + sService + "\" is not available!");
					oModel = fnCreateModel.call(that, sKey, oServiceConfig);
				} else if (oModelConfig.type) {
					oModel = fnCreateModel.call(that, sKey, oModelConfig);
				}
				
				// we apply the model to the root component if created
				if (oModel) {
					that.setModel(oModel, sKey || undefined);
				}
				
			});
			
		}
		
	};
	
	
	/**
	 * Initializes the Component instance after creation.
	 *
	 * Applications must not call this hook method directly, it is called by the
	 * framework while the constructor of an Component is executed.
	 *
	 * Subclasses of Component should override this hook to implement any necessary
	 * initialization.
	 *
	 * @function
	 * @name sap.ui.core.Component.prototype.init
	 * @protected
	 */
	//sap.ui.core.Component.prototype.init = function() {};
	
	/**
	 * Cleans up the component instance before destruction.
	 *
	 * Applications must not call this hook method directly, it is called by the
	 * framework when the element is {@link #destroy destroyed}.
	 * 
	 * Subclasses of Component should override this hook to implement any necessary
	 * cleanup.
	 *
	 * @function
	 * @name sap.ui.core.Component.prototype.exit
	 * @protected
	 */
	//sap.ui.core.Component.prototype.exit = function() {};
	
	
	/**
	 * The window before unload hook. Override this method in your Component class 
	 * implementation, to handle cleanup before the real unload or to prompt a question 
	 * to the user, if the component should be exited.
	 * 
	 * @return {string} return a string if a prompt should be displayed to the user 
	 *                  confirming closing the component (e.g. when the component is not yet saved).
	 * @public
	 * @since 1.15.1
	 * @name sap.ui.core.Component.prototype.onWindowBeforeUnload
	 * @function
	 */
	//onWindowBeforeUnload : function() {},
	
	
	/**
	 * The window unload hook. Override this method in your Component class 
	 * implementation, to handle cleanup of the component once the window
	 * will be unloaded (e.g. closed).
	 * 
	 * @public
	 * @since 1.15.1
	 * @name sap.ui.core.Component.prototype.onWindowUnload
	 * @function
	 */
	//onWindowUnload : function() {},
	
	
	/**
	 * The window error hook. Override this method in your Component class implementation 
	 * to listen to unhandled errors.
	 * 
	 * @param {string} sMessage The error message.
	 * @param {string} sFile The file where the error occurred
	 * @param {number} iLine The line number of the error
	 * @public
	 * @since 1.15.1
	 * @name sap.ui.core.Component.prototype.onError
	 * @function
	 */
	//onWindowError : null, // function(sMessage, sFile, iLine) - function not added directly as it might result in bad stack traces in older browsers
	
	
	/**
	 * The hook which gets called when the static configuration of the component 
	 * has been changed by some configuration extension.
	 * 
	 * @param {string} sConfigKey The error message.
	 * @public
	 * @since 1.15.1
	 * @name sap.ui.core.Component.prototype.onConfigChange
	 * @function
	 */
	//onConfigChange : null, // function(sConfigKey)
	
	
	/**
	 * Creates a new instance of a <code>Component</code> or returns the instance
	 * of an existing <code>Component</code>.
	 * 
	 * If you want to lookup all an existing <code>Component</code> you can call
	 * this function with a component ID as parameter:
	 * <pre> 
	 *   var oComponent = sap.ui.component(sComponentId);
	 * </pre>
	 * 
	 * To create a new instance of a component you pass a component configuration
	 * object into this function:
	 * <pre>
	 *   var oComponent = sap.ui.component({
	 *     name: "my.Component",
	 *     url: "my/component/location",
	 *     id: "myCompId1"
	 *   });
	 * </pre>
	 * 
	 * @param {string|object} oComponent the id of an existing Component or the configuration object to create the Component
	 * @param {string} oComponent.name the name of the Component to load
	 * @param {string} [oComponent.url] an alternate location from where to load the Component
	 * @param {object} [oComponent.componentData] initial data of the Component (@see sap.ui.core.Component#getComponentData)
	 * @param {string} [oComponent.id] the sId of the new Component
	 * @param {object} [oComponent.settings] the mSettings of the new Component 
	 * @return {sap.ui.core.Component} the Component instance 
	 * 
	 * @public
	 * @static
	 * @since 1.15.0
	 */
	sap.ui.component = function(oComponent) {
		
		// a parameter must be given!
		if (!oComponent) {
			throw new Error("sap.ui.component cannot be called without parameter!");
		}
		
		// when only a string is given then this function behaves like a 
		// getter and returns an existing component instance
		if (typeof oComponent === "string") {
			
			// lookup and return the component
			return sap.ui.getCore().getComponent(oComponent);
			
		} else {
			
			// retrieve the required properties
			var sName = oComponent.name,
			    sId = oComponent.id,
			    oComponentData = oComponent.componentData,
			    sController = sName + ".Component",
			    mSettings = oComponent.settings;
			
			// load the component class 
			var oClass = sap.ui.component.load(oComponent, true);
			
			// create an instance
			var oInstance = new oClass(jQuery.extend({}, mSettings, {
				id: sId,
				componentData: oComponentData
			}));
			jQuery.sap.assert(oInstance instanceof Component, "The specified component \"" + sController + "\" must be an instance of sap.ui.core.Component!");
			jQuery.sap.log.info("Component instance Id = " + oInstance.getId());
			
			return oInstance;
		}
	};
	
	/**
	 * Load a component without instantiating it.
	 * @param {object} oComponent the Component's setting. See {@link sap.ui.component} for more Information.
	 * 
	 * @since 1.16.3
	 * @static
	 * @public
	 */
	sap.ui.component.load = function(oComponent, bFailOnError) {
	
		var sName = oComponent.name,
			sUrl = oComponent.url,
			sController = sName + ".Component",
			sPreloadModule = sController + "-preload",
			sPreloadMode = sap.ui.getCore().getConfiguration().getComponentPreload();
			
		// check for an existing name
		if (!sName) {
			throw new Error("The name of the component is undefined.");
		}
		
		// check the type of the name
		jQuery.sap.assert(typeof sName === "string", "sName must be a string");
	
		// if a URL is given we register this URL for the name of the component:
		// the name is the package in which the component is located (dot separated)
		if (sUrl) {
			jQuery.sap.registerModulePath(sName, sUrl);
		}
	
		if ( sPreloadMode === "sync" || sPreloadMode === "async" ) {
			try {
				// only load the Component-preload file if the Component module is not yet available
				if ( !jQuery.sap.isDeclared(sController, /* bIncludePreloaded=*/ true) ) {
					jQuery.sap.require(sPreloadModule);
				}
			} catch(e) {
				jQuery.sap.log.warning("couldn't preload component from " + sPreloadModule + ": " + ((e && e.message) || e));
			}
	  }
		
		// require the component controller
		jQuery.sap.require(sController);
		var oClass = jQuery.sap.getObject(sController);
	
		if (!oClass) {
			if (bFailOnError) {
				throw new Error("The specified component controller\"" + sController + "\" could not be found!");	
			} else {
				jQuery.sap.log.warning("The specified component controller \"" + sController + "\" could not be found!");
			}
		}

		return oClass;
	}
	
	return Component;

}, /* bExport= */ true);
