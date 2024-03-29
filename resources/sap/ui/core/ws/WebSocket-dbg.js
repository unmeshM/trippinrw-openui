/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.ws.WebSocket for standard WebSocket support
sap.ui.define(['jquery.sap.global', 'sap/ui/Device', 'sap/ui/base/EventProvider', './ReadyState'],
	function(jQuery, Device, EventProvider, ReadyState) {
	"use strict";

	/**
	 * Creates a new WebSocket connection.
	 *
	 * @param {string} sUrl relative or absolute URL for WebSocket connection.
	 * @param {array} [aProtocols] array of protocols as strings, a single protocol as a string
	 * @public
	 *
	 * @class Basic WebSocket class
	 * @extends sap.ui.base.EventProvider
	 * @author SAP SE
	 * @version 1.24.2
	 * @name sap.ui.core.ws.WebSocket
	 */
	var WebSocket = EventProvider.extend("sap.ui.core.ws.WebSocket", /** @lends sap.ui.core.ws.WebSocket.prototype */ {

		constructor: function(sUrl, aProtocols) {
			EventProvider.apply(this);

			// Check WebSocket support
			if (!Device.support.websocket) {
				throw new Error("Browser does not support WebSockets.");
			}

			// Check url
			if (typeof(sUrl) !== "string") {
				throw new Error("sUrl must be a string.");
			}

			// Check protocols
			if (typeof(aProtocols) !== 'undefined' && !jQuery.isArray(aProtocols) && typeof(aProtocols) !== 'string') {
				throw new Error("aProtocols must be a string, array of strings or undefined.");
			}

			this._openConnection(sUrl, aProtocols);
		},

		metadata: {
			publicMethods : [ "send", "close", "getReadyState", "getProtocol" ]
		}

	});

	/**
	 * Creates a new subclass of class sap.ui.core.ws.WebSocket with name <code>sClassName</code>
	 * and enriches it with the information contained in <code>oClassInfo</code>.
	 *
	 * For a detailed description of <code>oClassInfo</code> or <code>FNMetaImpl</code>
	 * see {@link sap.ui.base.Object.extend Object.extend}.
	 *
	 * @param {string} sClassName name of the class to be created
	 * @param {object} [oClassInfo] object literal with informations about the class
	 * @param {function} [FNMetaImpl] alternative constructor for a metadata object
	 * @return {function} the created class / constructor function
	 * @public
	 * @static
	 * @name sap.ui.core.ws.WebSocket.extend
	 * @function
	 */

	/**
	 * @see sap.ui.base.Object#getInterface
	 * @public
	 * @name sap.ui.core.ws.WebSocket#getInterface
	 * @function
	 */
	WebSocket.prototype.getInterface = function() {
		return this;
	};

	/**
	 * Map of event names, that are provided by the WebSocket.
	 * @name sap.ui.core.ws.WebSocket.M_EVENTS
	 */
	WebSocket.M_EVENTS = {

		/**
		 * Fired when the connection was successfully opened.
		 */
		Open : "open",

		/**
		 * Fired when the connection was closed.
		 */
		Close : "close",

		/**
		 * Fired when an error occurred.
		 * Contains Parameters: error
		 */
		Error : "error",

		/**
		 * Fired when a message was received
		 * Contains Parameters: data
		 */
		Message : "message"
	};

	/**
	 * The 'open' event is fired, when the connection was successfully opened.
	 *
	 * @name sap.ui.core.ws.WebSocket#open
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @public
	 */

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'open' event of this <code>sap.ui.core.ws.WebSocket</code>.<br>
	 *
	 * @param {object}
	 *            [oData] The object, that should be passed along with the event-object when firing the event.
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function. If empty, this WebSocket is used.
	 *
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.ws.WebSocket#attachOpen
	 * @function
	 */
	WebSocket.prototype.attachOpen = function(oData, fnFunction, oListener) {
		this.attachEvent("open", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'open' event of this <code>sap.ui.core.ws.WebSocket</code>.<br>
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.ws.WebSocket#detachOpen
	 * @function
	 */
	WebSocket.prototype.detachOpen = function(fnFunction, oListener) {
		this.detachEvent("open", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event 'open' to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @protected
	 * @name sap.ui.core.ws.WebSocket#fireOpen
	 * @function
	 */
	WebSocket.prototype.fireOpen = function(mArguments) {
		this.fireEvent("open", mArguments);
		return this;
	};


	/**
	 * The 'close' event is fired, when the connection was closed.
	 *
	 * @name sap.ui.core.ws.WebSocket#close
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @param {string} oControlEvent.getParameters.code Close code provided by the server.
	 * @param {string} oControlEvent.getParameters.reason Reason from server for closing the connection.
	 * @param {string} oControlEvent.getParameters.wasClean Indicates whether the connection was cleanly closed or not.
	 * @public
	 */

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'close' event of this <code>sap.ui.core.ws.WebSocket</code>.<br>
	 *
	 * @param {object}
	 *            [oData] The object, that should be passed along with the event-object when firing the event.
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function. If empty, this WebSocket is used.
	 *
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.ws.WebSocket#attachClose
	 * @function
	 */
	WebSocket.prototype.attachClose = function(oData, fnFunction, oListener) {
		this.attachEvent("close", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'close' event of this <code>sap.ui.core.ws.WebSocket</code>.<br>
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.ws.WebSocket#detachClose
	 * @function
	 */
	WebSocket.prototype.detachClose = function(fnFunction, oListener) {
		this.detachEvent("close", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event 'close' to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @param {string} [mArguments.code] Close code provided by the server.
	 * @param {string} [mArguments.reason] Reason from server for closing the connection.
	 * @param {string} [mArguments.wasClean] Indicates whether the connection was cleanly closed or not.
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @protected
	 * @name sap.ui.core.ws.WebSocket#fireClose
	 * @function
	 */
	WebSocket.prototype.fireClose = function(mArguments) {
		this.fireEvent("close", mArguments);
		return this;
	};


	/**
	 * The 'error' event is fired, when an error occurred.
	 *
	 * @name sap.ui.core.ws.WebSocket#error
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @public
	 */

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'error' event of this <code>sap.ui.core.ws.WebSocket</code>.<br>
	 *
	 * @param {object}
	 *            [oData] The object, that should be passed along with the event-object when firing the event.
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function. If empty, this WebSocket is used.
	 *
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.ws.WebSocket#attachError
	 * @function
	 */
	WebSocket.prototype.attachError = function(oData, fnFunction, oListener) {
		this.attachEvent("error", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'error' event of this <code>sap.ui.core.ws.WebSocket</code>.<br>
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.ws.WebSocket#detachError
	 * @function
	 */
	WebSocket.prototype.detachError = function(fnFunction, oListener) {
		this.detachEvent("error", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event 'error' to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @protected
	 * @name sap.ui.core.ws.WebSocket#fireError
	 * @function
	 */
	WebSocket.prototype.fireError = function(mArguments) {
		this.fireEvent("error", mArguments);
		return this;
	};

	/**
	 * The 'message' event is fired, when a message was received.
	 *
	 * @name sap.ui.core.ws.WebSocket#message
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @param {string} oControlEvent.getParameters.data Received data from the server.
	 * @public
	 */

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'message' event of this <code>sap.ui.core.ws.WebSocket</code>.<br>
	 *
	 * @param {object}
	 *            [oData] The object, that should be passed along with the event-object when firing the event.
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function. If empty, this WebSocket is used.
	 *
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.ws.WebSocket#attachMessage
	 * @function
	 */
	WebSocket.prototype.attachMessage = function(oData, fnFunction, oListener) {
		this.attachEvent("message", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'message' event of this <code>sap.ui.core.ws.WebSocket</code>.<br>
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.ws.WebSocket#detachMessage
	 * @function
	 */
	WebSocket.prototype.detachMessage = function(fnFunction, oListener) {
		this.detachEvent("message", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event 'message' to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @param {string} [mArguments.data] Received data from the server.
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @protected
	 * @name sap.ui.core.ws.WebSocket#fireMessage
	 * @function
	 */
	WebSocket.prototype.fireMessage = function(mArguments) {
		this.fireEvent("message", mArguments);
		return this;
	};

	// Private Methods
	/**
	 * Resolves a the full WebSocket-Url from an absolute or relative url.
	 *
	 * @param {string} sUrl input url
	 * @return {string} sFullUrl full url which can be used for the ws-connection
	 * @private
	 * @name sap.ui.core.ws.WebSocket#_resolveFullUrl
	 * @function
	 */
	WebSocket.prototype._resolveFullUrl = function(sUrl) {
		var sFullUrl = '';

		// check if no protocol (ws:// or wss://) is provided
		if (!/^wss?:\/\//.test(sUrl)) {

			var loc = document.location;

			sFullUrl = ((loc.protocol === 'https:')
							? 'wss://'
							: 'ws://') +
							loc.host;

			if (sUrl.substr(0, 1) === '/') {
				// absolute url, e.g. /foo/bar
				sFullUrl += sUrl;
			} else {
				// relative url, eg. foo/../../bar
				sFullUrl += loc.pathname.substring(0, loc.pathname.lastIndexOf('/')) + '/' + sUrl;
			}

		} else {
			sFullUrl = sUrl;
		}

		return sFullUrl;
	};

	/**
	 * Opens the connection and binds the event-handlers.
	 *
	 * @param {string} sUrl	url for WebSocket
	 * @param {array} [aProtocols] array of protocols as strings, a single protocol as a string
	 * @private
	 * @name sap.ui.core.ws.WebSocket#_openConnection
	 * @function
	 */
	WebSocket.prototype._openConnection = function(sUrl, aProtocols) {
		var sUrl = this._resolveFullUrl(sUrl);
		this._oWs = (typeof(aProtocols) === 'undefined')
			? new window.WebSocket(sUrl)
			: new window.WebSocket(sUrl, aProtocols);
		this._oWs.onopen = jQuery.proxy(this._onopen, this);
		this._oWs.onclose = jQuery.proxy(this._onclose, this);
		this._oWs.onmessage = jQuery.proxy(this._onmessage, this);
		this._oWs.onerror = jQuery.proxy(this._onerror, this);
	};

	// Event-Handlers
	/**
	 * Internal handler for open-event.
	 *
	 * @private
	 * @name sap.ui.core.ws.WebSocket#_onopen
	 * @function
	 */
	WebSocket.prototype._onopen = function() {
		this.fireOpen();
	};

	/**
	 * Internal handler for close-event.
	 *
	 * @private
	 * @name sap.ui.core.ws.WebSocket#_onclose
	 * @function
	 */
	WebSocket.prototype._onclose = function(oCloseEvent) {
		this.fireClose({
			code: oCloseEvent.code,
			reason: oCloseEvent.reason,
			wasClean: oCloseEvent.wasClean
		});
	};

	/**
	 * Internal handler for error-event.
	 *
	 * @private
	 * @name sap.ui.core.ws.WebSocket#_onerror
	 * @function
	 */
	WebSocket.prototype._onerror = function(oEvent) {
		this.fireError();
	};

	/**
	 * Internal handler for message-event.
	 *
	 * @private
	 * @name sap.ui.core.ws.WebSocket#_onmessage
	 * @function
	 */
	WebSocket.prototype._onmessage = function(oMessageEvent) {
		this.fireMessage({
			data: oMessageEvent.data
		});
	};

	// Public Methods
	/**
	 * Sends a message.<br>
	 * <br>
	 * If the connection is not yet opened, the message will be queued and sent
	 * when the connection is established.
	 *
	 * @param {string} sMessage Message to send
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.ws.WebSocket#send
	 * @function
	 */
	WebSocket.prototype.send = function(sMessage) {
		if (this.getReadyState() === ReadyState.OPEN) {
			this._oWs.send(sMessage);
		} else if (this.getReadyState() === ReadyState.CONNECTING) {
			// queue the message until the connection is opened
			this.attachEventOnce("open", function(oEvent) {
				this._oWs.send(sMessage);
			});
		} else {
			jQuery.sap.log.warning("Unable to send WebSocket message. " +
				"Connection is already closed or closing. message: " + sMessage);
		}
		return this;
	};

	/**
	 * Closes the connection.
	 *
	 * @param {int} [iCode] Status code that explains why the connection is closed. Must be either 1000, or between 3000 and 4999 (default 1000)
	 * @param {string} [sReason] Closing reason as a string
	 * @return {sap.ui.core.ws.WebSocket} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.ws.WebSocket#close
	 * @function
	 */
	WebSocket.prototype.close = function(iCode, sReason) {

		// Check if only sReason is given
		if (typeof(iCode) === 'string') {
			sReason = iCode;
			iCode = undefined;
		}

		iCode = (typeof(iCode) === 'undefined') ? 1000 : iCode;
		sReason = (typeof(sReason) === 'undefined') ? "" : sReason;

		if (this.getReadyState() === ReadyState.OPEN) {
			this._oWs.close(iCode, sReason);
		} else if (this.getReadyState() === ReadyState.CONNECTING) {
			// queue closing until the connection is opened
			this.attachEventOnce("open", function(oEvent) {
				this._oWs.close(iCode, sReason);
			});
		} else {
			var sText = '';

			switch (this.getReadyState()) {
			case ReadyState.CLOSED:
				sText = "Connection is already closed.";
				break;
			case ReadyState.CLOSING:
				sText = "Connection is already closing.";
				break;
			}

			jQuery.sap.log.warning("Unable to close WebSocket connection. " + sText);
		}

		return this;
	};

	/**
	 * Getter for WebSocket readyState.
	 *
	 * @returns {sap.ui.core.ws.ReadyState} readyState
	 * @public
	 * @name sap.ui.core.ws.WebSocket#getReadyState
	 * @function
	 */
	WebSocket.prototype.getReadyState = function() {
		return this._oWs.readyState;
	};

	/**
	 * Getter for the protocol selected by the server once the connection is open.
	 * 
	 * @returns {string} protocol
	 * @public
	 * @name sap.ui.core.ws.WebSocket#getProtocol
	 * @function
	 */
	WebSocket.prototype.getProtocol = function() {
		return this._oWs.protocol;
	};

	return WebSocket;

}, /* bExport= */ true);
