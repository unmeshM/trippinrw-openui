/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global QUnit, equal, strictEqual, notStrictEqual, deepEqual, ok, start, stop, qutils:true */// declare unusual global vars for JSLint/SAPUI5 validation

/**
 * SAPUI5 test utilities
 *
 * @namespace
 * @name sap.ui.test
 * @public
 */

/**
 * The <code>sap.ui.test.qunit</code> namespace contains helper functionality for
 * QUnit tests.
 *
 * @version 1.24.2
 * @namespace
 * @name sap.ui.test.qunit
 * @public
 */

sap.ui.define('sap/ui/qunit/QUnitUtils', ['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	jQuery.sap.getObject("sap.ui.test.qunit", 0);
	
	
	(function() {
		if (typeof QUnit !== "undefined") {
	
			// extract the URL parameters
			var mParams = jQuery.sap.getUriParameters();
			
			// TODO: Remove deprecated code once all projects adapted
			QUnit.equals = QUnit.assert.equal;
			window.equals = QUnit.assert.equal;
	
			// Set global timeout for all tests
			var sTimeout = mParams.get("sap-ui-qunittimeout");
			if (!sTimeout || isNaN(sTimeout)) {
				sTimeout = "30000"; // 30s: default timeout of an individual QUnit test!
			}
			QUnit.config.testTimeout = parseInt(sTimeout, 10);
			
			// Do not reorder tests, as most of the tests depend on each other
			QUnit.config.reorder = false;
		}
	}());
	
	//TODO: Get rid of the old namespace and adapt the existing tests accordingly
	window.qutils = sap.ui.test.qunit;
	
	/**
	 * Delays the start of the test until everything is rendered or - if given - for the specified milliseconds.
	 * This function must be called before the first test function.
	 *
	 * @param {int} [iDelay] optional delay in milliseconds
	 * 
	 * @public
	 */
	sap.ui.test.qunit.delayTestStart = function(iDelay){
		QUnit.config.autostart = false;
		if (iDelay) {
			window.setTimeout(function() {
				QUnit.start();
			}, iDelay);
		} else {
			jQuery(function() {
				QUnit.start();
			});
		}
	};
	
	/**
	 * Programmtically triggers an event specified by its name on a specified target with some optional parameters.
	 * @see http://api.jquery.com/trigger/
	 *
	 * @param {string} sEventName The name of the browser event (like "click")
	 * @param {string | DOMElement} oTarget The ID of a DOM element or a DOM element which serves as target of the event
	 * @param {object} [oParams] The parameters which should be attached to the event in JSON notation (depending on the event type).
	 * @public
	 */
	sap.ui.test.qunit.triggerEvent = function(sEventName, oTarget, oParams) {
		var tmpEvent = jQuery.Event(sEventName);
		if(oParams){
			for(var x in oParams){
				tmpEvent[x] = oParams[x];
			}
		}
	
		if (typeof(oTarget) == "string") {
			oTarget = jQuery.sap.domById(oTarget);
		}
		jQuery(oTarget).trigger(tmpEvent);
	};
	
	
	/**
	 * Programmatically triggers a touch event specified by its name.
	 * The onEVENTNAME functions are called directly on the "nearest" control / element of the given target.
	 *
	 * @param {string} sEventName The name of the touch event (touchstart, touchmove, touchend)
	 * @param {string | DOMElement} oTarget The ID of a DOM element or a DOM element which serves as target of the event
	 * @param {object} [oParams] The parameters which should be attached to the event in JSON notation (depending on the event type).
	 * @public
	 */
	sap.ui.test.qunit.triggerTouchEvent = function(sEventName, oTarget, oParams) {
		if (typeof(oTarget) == "string") {
			oTarget = jQuery.sap.domById(oTarget);
		}
		var $Target = jQuery(oTarget);
	
		var oEvent = jQuery.Event(sEventName);
		oEvent.originalEvent = {};
		oEvent.target = oTarget;
		if(oParams){
			for(var x in oParams){
				oEvent[x] = oParams[x];
				oEvent.originalEvent[x] = oParams[x];
			}
		}
	
		var oElement = $Target.control(0);
		if(oElement && oElement["on"+sEventName]){
			oElement["on"+sEventName].apply(oElement, [oEvent]);
		}
	};
	
	
	/**
	 * Programmtically triggers a keyboard event specified by its name on a specified target.
	 * @see sap.ui.test.qunit.triggerEvent
	 *
	 * @param {string} sEventType The name of the browser keyboard event (like "keydown")
	 * @param {string | DOMElement} oTarget The ID of a DOM element or a DOM element which serves as target of the event
	 * @param {string | int} sKey The keys name as defined in <code>jQuery.sap.KeyCodes</code> or its key code
	 * @param {boolean} bShiftKey Indicates whether the shift key is down in addition
	 * @param {boolean} bAltKey Indicates whether the alt key is down in addition
	 * @param {boolean} bCtrlKey Indicates whether the ctrl key is down in addition
	 * @public
	 */
	sap.ui.test.qunit.triggerKeyEvent = function(sEventType, oTarget, sKey, bShiftKey, bAltKey, bCtrlKey) {
		var oParams = {};
		oParams.keyCode = isNaN(sKey) ? jQuery.sap.KeyCodes[sKey] : sKey;
		oParams.which = oParams.keyCode;
		oParams.shiftKey = bShiftKey;
		oParams.altKey = bAltKey;
		oParams.metaKey = bCtrlKey;
		oParams.ctrlKey = bCtrlKey;
		sap.ui.test.qunit.triggerEvent(sEventType, oTarget, oParams);
	};
	
	
	/**
	 * Programmtically triggers a keydown event on a specified target.
	 * @see sap.ui.test.qunit.triggerKeyEvent
	 *
	 * @param {string | DOMElement} oTarget The ID of a DOM element or a DOM element which serves as target of the event
	 * @param {string | int} sKey The keys name as defined in <code>jQuery.sap.KeyCodes</code> or its key code
	 * @param {boolean} bShiftKey Indicates whether the shift key is down in addition
	 * @param {boolean} bAltKey Indicates whether the alt key is down in addition
	 * @param {boolean} bCtrlKey Indicates whether the ctrl key is down in addition
	 * @public
	 */
	sap.ui.test.qunit.triggerKeydown = function(oTarget, sKey, bShiftKey, bAltKey, bCtrlKey) {
		sap.ui.test.qunit.triggerKeyEvent("keydown", oTarget, sKey, bShiftKey, bAltKey, bCtrlKey);
	};
	
	
	/**
	 * Programmtically triggers a keydup event on a specified target.
	 * @see sap.ui.test.qunit.triggerKeyEvent
	 *
	 * @param {string | DOMElement} oTarget The ID of a DOM element or a DOM element which serves as target of the event
	 * @param {string | int} sKey The keys name as defined in <code>jQuery.sap.KeyCodes</code> or its key code
	 * @param {boolean} bShiftKey Indicates whether the shift key is down in addition
	 * @param {boolean} bAltKey Indicates whether the alt key is down in addition
	 * @param {boolean} bCtrlKey Indicates whether the ctrl key is down in addition
	 * @public
	 */
	sap.ui.test.qunit.triggerKeyup = function(oTarget, sKey, bShiftKey, bAltKey, bCtrlKey) {
		sap.ui.test.qunit.triggerKeyEvent("keyup", oTarget, sKey, bShiftKey, bAltKey, bCtrlKey);
	};
	
	
	/**
	 * @param {object} oTarget
	 * @param {string} sKey
	 * @param {boolean} bShiftKey
	 * @param {boolean} bAltKey
	 * @param {boolean} bCtrlKey
	 * @deprecated Use <code>sap.ui.test.qunit.triggerKeydown</code> instead.
	 * @see sap.ui.test.qunit.triggerKeydown
	 * @public
	 */
	sap.ui.test.qunit.triggerKeyboardEvent = function(oTarget, sKey, bShiftKey, bAltKey, bCtrlKey) {
		sap.ui.test.qunit.triggerKeydown(oTarget, sKey, bShiftKey, bAltKey, bCtrlKey);
	};
	
	
	/**
	 * Programmtically triggers a keypress event on a specified target.
	 * @see sap.ui.test.qunit.triggerEvent
	 *
	 * @param {string | DOMElement} oTarget The ID of a DOM element or a DOM element which serves as target of the event
	 * @param {string} sChar Only the first char of the string will be passed via keypress event
	 * @param {boolean} bShiftKey Indicates whether the shift key is down in addition
	 * @param {boolean} bAltKey Indicates whether the alt key is down in addition
	 * @param {boolean} bCtrlKey Indicates whether the ctrl key is down in addition
	 * @public
	 */
	sap.ui.test.qunit.triggerKeypress = function(oTarget, sChar, bShiftKey, bAltKey, bCtrlKey) {
		var _sChar = sChar && sChar.toUpperCase();
		if(jQuery.sap.KeyCodes[_sChar] === null) {
			ok(false, "Invalid character for triggerKeypress: '" + sChar + "'");
		}
		var _iCharCode = sChar.charCodeAt(0);
	
		var oParams = {};
		oParams.charCode = _iCharCode;
		oParams.which = _iCharCode;
		oParams.shiftKey = !!bShiftKey;
		oParams.altKey = !!bAltKey;
		oParams.metaKey = !!bCtrlKey;
		oParams.ctrlKey = !!bCtrlKey;
		sap.ui.test.qunit.triggerEvent("keypress", oTarget, oParams);
	};
	
	
	/**
	 * Programmtically triggers a keypress event on a specified input field target and appends the character to the value
	 * of this input field.
	 * @see sap.ui.test.qunit.triggerKeypress
	 *
	 * @param {string | DOMElement} oInput The ID of a DOM input field or a DOM input field which serves as target
	 * @param {string} sChar Only the first char of the string will be passed via keypress event
	 * @public
	 */
	sap.ui.test.qunit.triggerCharacterInput = function(oInput, sChar) {
		sap.ui.test.qunit.triggerKeypress(oInput, sChar);
	
		if (typeof(oInput) == "string") {
			oInput = jQuery.sap.domById(oInput);
		}
		var $Input = jQuery(oInput);
		$Input.val($Input.val() + sChar);
	};
	
	
	/**
	 * Programmatically triggers a mouse event specified by its name on a specified target.
	 * @see sap.ui.test.qunit.triggerEvent
	 *
	 * @param {string | DOMElement} oTarget The ID of a DOM element or a DOM element which serves as target of the event
	 * @param {string} sEventType The name of the browser mouse event (like "click")
	 * @param {int} iOffsetX The offset X position of the mouse pointer during the event
	 * @param {int} iOffsetY The offset Y position of the mouse pointer during the event
	 * @param {int} iPageX The page X position of the mouse pointer during the event
	 * @param {int} iPageY The page Y position of the mouse pointer during the event
	 * @param {int} iButton The button of the mouse during the event (e.g. 0: LEFT, 1: MIDDLE, 2: RIGHT)
	 * @public
	 */
	sap.ui.test.qunit.triggerMouseEvent = function(oTarget, sEventType, iOffsetX, iOffsetY, iPageX, iPageY, iButton) {
		var oParams = {};
		oParams.offsetX = iOffsetX;
		oParams.offsetY = iOffsetY;
		oParams.pageX = iPageX;
		oParams.pageY = iPageY;
		if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8) {
			switch (iButton) {
				case 0:
					oParams.button = 1;
					break;
				case 1:
					oParams.button = 0;
					break;
				default:
					oParams.button = iButton;
			}
		} else {
			oParams.button = iButton;
		}
		sap.ui.test.qunit.triggerEvent(sEventType, oTarget, oParams);
	};
	
	(function() {
	
		var FONT_WEIGHTS = {
			'normal': 400,
			'bold': 700
		};
		
		jQuery.fn.extend({
		
			/**
			 * jQuery plugin (function) to retrieve the internal event data even for jQuery >= 1.9
			 *
			 * This is only a HACK and not guaranteed to work with future versions of jQuery. 
			 * It is only intended to be used in test cases.
			 * 
			 * @see http://jquery.com/upgrade-guide/1.9/#data-events-
			 *  
			 * @public
			 * @name jQuery#_sapTest_dataEvents
			 * @deprecated Tests that rely on this function should try to substitute it with other tests
			 */
			_sapTest_dataEvents : function() {
				var elem = this[0];
				return elem ? jQuery._data(elem, "events") : null;
			},
		
			/**
			 * jQuery plugin (function) that normalizes textual font-weight values to numerical ones.
			 *
			 * Webkit browsers preserve string values and even convert well known numerical values to
			 * string values (e.g. 700 -> bold, 400 -> normal).
			 * 
			 * Starting with jQuery 1.10, jQuery normalizes some of these values to a numerical value.
			 * 
			 * This method hides all these differences (browser, jQuery version) and returns a numerical value
			 *  
			 * @public
			 * @name jQuery#_sapTest_cssFontWeight
			 * @deprecated Tests that rely on this function should try to substitute it with other tests
			 */
			_sapTest_cssFontWeight : function() {
				var v = this.css("font-weight");
				return v ? FONT_WEIGHTS[v] || v : v;
			} 
		});
	
	}());
	
	//************************************
	//TODO: Check JS Doc starting here -> describe and check visibility for stuff in namespace sap.ui.test.qunit
	
	
	(function() {
	
		/*
		 * wrapper around window.console
		 */
		function info(msg) {
			if ( window.console ) {
				console.info(msg);
			}
		}
	
		var M_DEFAULT_TEST_VALUES = {
			"boolean" : [false, true],
			"int" : [0, 1, 5, 10, 100],
			"float" : [NaN, 0.0, 0.01, 3.14, 97.7],
			"string" : ["", "some", "very long otherwise not normal and so on whatever", "<" + "script>alert('XSS attack!');</" + "script>"]
		};
	
		var mDefaultTestValues = jQuery.sap.newObject(M_DEFAULT_TEST_VALUES);
	
		function ensureArray(o) {
			return o && !(o instanceof Array) ? [o] : o;
		}
	
		/**
		 * @TODO DESCRIBE AND CHECK VISIBILITY!
		 * @private
		 */
		sap.ui.test.qunit.resetDefaultTestValues = function(sType) {
			if ( typeof sType === "string" ) {
				delete mDefaultTestValues[sType];
			} else {
				mDefaultTestValues = jQuery.sap.newObject(M_DEFAULT_TEST_VALUES);
			}
		};
	
		/**
		 * @TODO DESCRIBE AND CHECK VISIBILITY!
		 * @private
		 */
		sap.ui.test.qunit.setDefaultTestValues = function(sType, aValues) {
			if ( typeof sType === "string" ) {
				mDefaultTestValues[sType] = ensureArray(aValues);
			} else if ( typeof sType === "object" ) {
				jQuery.extend(mDefaultTestValues, sType);
			}
		};
	
		/**
		 * @TODO DESCRIBE AND CHECK VISIBILITY!
		 * @private
		 */
		sap.ui.test.qunit.createSettingsDomain = function(oClass, oPredefinedValues) {
	
			function createValues(sType) {
				if ( mDefaultTestValues[sType] ) {
					return mDefaultTestValues[sType];
				}
	
				try {
					jQuery.sap.require(sType);
				} catch(e) {
				}
				var oType = jQuery.sap.getObject(sType);
				if ( oType instanceof sap.ui.base.DataType ) {
					; // ???
				} else {
					var r=[];
					for(var n in oType) {
						r.push(oType[n]);
					}
					mDefaultTestValues[sType] = r;
					return r;
				}
				return [];
	
			}
	
			var oClass = new oClass().getMetadata().getClass(); // resolves proxy
			var oPredefinedValues = oPredefinedValues || {};
			var result = {};
			var oProps = oClass.getMetadata().getAllProperties();
			for (var name in oProps) {
				result[name] = ensureArray(oPredefinedValues[name]) || createValues(oProps[name].type);
			}
			/*
			var oAggr = oClass.getMetadata().getAllAggregations();
			for (var name in oAggr) {
				if ( oAggr[name].altTypes && oAggr[name].altTypes[0] === 'string' ) {
					result[name] = ensureArray(oPredefinedValues[name]) || createValues(oAggr[name].altTypes[0].type);
				}
			}
			*/
			return result;
		};
	
		/**
		 * @TODO DESCRIBE AND CHECK VISIBILITY!
		 * @private
		 */
		sap.ui.test.qunit.genericTest = function(oClass, sUIArea, oTestConfig) {
	
			if ( oTestConfig && oTestConfig.skip === true ) {
				return;
			}
	
			var oClass = new oClass().getMetadata().getClass(); // resolves proxy
			var oTestConfig = oTestConfig || {};
			var iTestCount  = oTestConfig.testCount || 100;
			var oTestValues = sap.ui.test.qunit.createSettingsDomain(oClass, oTestConfig.allPairTestValues || {});
	
			info("domain");
			for (var name in oTestValues) {
				var l=oTestValues[name].length;
				var s=[];
				s.push("  ", name, ":", "[");
				for(var i=0; i<l; i++) {
					s.push(oTestValues[name][i], ",");
				}
				s.push("]");
				info(s.join(""));
			}
	
			function method(sPrefix, sName) {
				return sPrefix + sName.substring(0,1).toUpperCase() + sName.substring(1);
			}
	
			function getActualSettings(oControl, oSettings) {
				var oActualSettings = {};
				for (var name in oSettings) {
					if ( oControl[method("get", name)] ) {
					  oActualSettings[name] = oControl[method("get", name)]();
					}
				}
				return oActualSettings;
			}
	
			var oControl;
			var oSettings;
	
			// generate "AllPairs" test cases
			var apg = new sap.ui.test.qunit.AllPairsGenerator(oTestValues);
			var aTestCases=[];
			while( apg.hasNext() ) {
				aTestCases.push(apg.next());
			}
	
			var index=0;
			function testNextCombination() {
				info("testNextCombination(" + index + ")");
				if ( index >= aTestCases.length ) {
					// continue with other tests
					info("last combination -> done");
					start();
					return;
				}
	
				var oSettings = aTestCases[index];
	
				// constructor test
				oControl = new oClass(oSettings);
				var oActualSettings = getActualSettings(oControl, oSettings);
				deepEqual(oActualSettings, oSettings, "settings");
	
				/*
				// individual setters
				oControl = new oClass();
				for(var name in oSettings) {
					var r = oControl[method("set", name)](oSettings[name]);
					equal(oControl[method("get", name)](), oSettings[name], "setter for property '" + name + "'");
					ok(r == oControl, "setter for property '" + name + "' supports chaining");
				}
				*/
	
				// rendering test
				oControl.placeAt(sUIArea);
				info("before explicit rerender");
				oControl.getUIArea().rerender();
				info("after explicit rerender");
	
				info("info");
				setTimeout(continueAfterRendering, 0);
	
			}
	
			stop(15000);
			testNextCombination();
	
			function continueAfterRendering() {
				info("continueAfterRendering(" + index + ")");
				var oSettings = aTestCases[aTestCases.length-index-1];
				for(var name in oSettings) {
					var r = oControl[method("set", name)](oSettings[name]);
					equal(oControl[method("get", name)](), oSettings[name], "setter for property '" + name + "'");
					ok(r == oControl, "setter for property '" + name + "' supports chaining (after rendering)");
				}
				index = index+1;
				setTimeout(testNextCombination, 0);
			}
	
		};
	
		var lastErrorHandler = undefined;
	
		/**
		 * @TODO DESCRIBE AND CHECK VISIBILITY!
		 * @private
		 */
		sap.ui.test.qunit.suppressErrors = function(bSuppress) {
			if ( bSuppress !== false ) {
				info("suppress global errors");
				lastErrorHandler = window.onerror;
	//			window.onerror = function(msg) {
	//				info("global error handler: " + msg);
	//				return true;
	//			};
			} else {
				info("reenable global errors");
	//			window.onerror = lastErrorHandler;
				lastErrorHandler = undefined;
			}
		};
	
		/**
		 * @TODO DESCRIBE AND CHECK VISIBILITY!
		 * @private
		 */
		sap.ui.test.qunit.RandomPairsGenerator = function(oDomain) {
	
			var iCombinations = 0;
			for (var name in oDomain) {
				if ( oDomain[name] && !(oDomain[name] instanceof Array) ) {
					oDomain[name] = [ oDomain[name] ];
				}
				if ( oDomain[name] && oDomain[name].length > 0 ) {
					if ( iCombinations == 0 ) {
						iCombinations = oDomain[name].length;
					} else {
						iCombinations = iCombinations * oDomain[name].length;
					}
				}
			}
	
			function createSettings(iCombination) {
				var oSettings = {};
				for (var name in oDomain) {
					var l=oDomain[name] && oDomain[name].length;
					if ( l == 1 ) {
						oSettings[name] = oDomain[name][0];
						//info("  " + name + ":" + "0");
					} else if ( l > 1 ) {
						var c = iCombination % l;
						oSettings[name] = oDomain[name][c];
						iCombination = (iCombination - c) / l;
					}
				}
				return oSettings;
			}
	
			this.hasNext = function() {
				return true;
			};
	
			this.next = function() {
				return createSettings(Math.floor(100 * iCombinations * Math.random()));
			};
	
		};
	
		/**
		 * @TODO DESCRIBE AND CHECK VISIBILITY!
		 * @private
		 */
		sap.ui.test.qunit.AllPairsGenerator = function (oDomain) {
	
			// more suitable access to the params
			var params=[];
			for(var name in oDomain) {
				params.push({
					name : name,
					n : oDomain[name].length,
					values : oDomain[name]
				});
			}
			var N = params.length;
	
			/**
			 * Number of occurrences for each possible property value pair.
			 * A value of 0 indicates that there is no test case yet, so the pair must
			 * be incorporated in another test case. A value of 1 is the optimum,
			 * values greater than 1 indicate that the pair has been used (too) often.
			 *
			 * The algorithm of this generator guarantees to create values > 0 for all
			 * pairs but still tries to minimize the values.  It does not guarantee
			 * to find the most optimal solution.
			 *
			 * Let a and b be two different properties from oDomain (e.g. a='text' and b='visible'),
			 * with (WOLG) params.indexOf(a) < params.indexOf(b). Let further a have
			 * n values (== oDomain[a].length) and b have m values (== oDomain[b].length).
			 *
			 * Then the occurrences counters for the n*m possible value combinations
			 * (pairs) of a and b are stored in a contiguous segment of the occurs[] array.
			 *
			 * The segments for all combinations of a and b themselves are ordered
			 * first by a, then by b (same params.indexOf() ordering applies).
			 *
			 * The position of the segment for a given combination (a,b) could be calculated
			 * as the sum of the size of all preceding segments, but this would be too
			 * expensive (access to the occurs[] is used very often and therefore must be efficient).
			 * Therefore, during initialization, the offset for each segment is stored in
			 * an additional array abOffset[]. To further simplify access, that array uses N*N
			 * space, but only the entries params.indexOf(a) * N + params.indexOf(b) (with
			 * params.indexOf(a) < params.indexOf(b)) are filled.
			 */
			var occurs=[];
	
			/**
			 * Offset for a given combination of properties (a,b) into the occurs[]
			 * array. For a details description see the occurs[] array.
			 */
			var abOffset=[];
	
			/**
			 * Number of pairs for which occurs[(a,b)] == 0.
			 *
			 * Note: during initialization, this variable also represents the number
			 * of created entries in the occurs[] array. As all entries are created with
			 * a value of 0, the definiton above still holds.
			 */
			var nPairs=0;
	
			/*
			 * Initialization. Loops over all a,b combinations with (a<b)
			 * and creates the initial occurs[] and abOccurs[] values.
			 */
			for(var a=0; a<N-1; a++) {
				var pa = params[a];
				for(var b=a+1; b<N; b++) {
					var pb = params[b];
					// remember offset into occurs array
					abOffset[a * N + b] = nPairs;
					// set occurrences for all n*m values to 0
					for(var i=pa.n*pb.n; i>0; i--) {
						occurs[nPairs++] = 0;
					}
				}
			}
	
			/**
			 * Helper that calculates the offset into the occurs array
			 * for a given combination of a,b and the values of a and b.
			 */
			function offset(a,b,va,vb) {
				return abOffset[a*N+b]+va*params[b].n+vb;
			}
	
			function findTestCase() {
	
				var value_index = [];
	
				/**
				 * Calculates a cost function for the case where for
				 * property 'a' the value 'va' is taken.
				 *
				 * The calculated cost consists of two informations:
				 * - pairs : number of newly addressed unique pairs
				 * - redundant : number of redundantly added pairs
				 *
				 * @param a
				 * @param va
				 * @return
				 */
				function calcCost(a, va) {
					var score={ va: va, pairs:0, redundant:0 };
					for(var b=0; b<N; b++) {
						var count;
						if ( b < a ) {
							count = occurs[offset(b,a,value_index[b],va)];
						} else if ( b > a ) {
							var i=offset(a,b,va,0),
								end=i+params[b].n;
							for (count = occurs[i]; count > 0 && i<end; i++ ) {
								if ( occurs[i] < count ) {
									count = occurs[i];
								}
							}
						}
						score.redundant = score.redundant + count;
						if ( count == 0 ) {
							score.pairs++;
						}
					}
					return score;
				}
	
				// loop over all properties and find the "best" value
				for(var a=0; a<N; a++) {
					var pa=params[a];
					// measure the quality of the first possible value
					var bestCost = calcCost(a, 0);
					for(var va=1; va<pa.n; va++) {
						// measure the quality of the new combination
						var cost = calcCost(a, va);
						// a new combination is preferred if it either incorporates more unique pairs or if
						// it incorporates the same number of pairs but with less redundant combinations
						if ( cost.pairs > bestCost.pairs || (cost.pairs == bestCost.pairs && cost.redundant < bestCost.redundant) ) {
							bestCost = cost;
						}
					}
	
					value_index[a] = bestCost.va;
				}
	
				return value_index;
			}
	
			/**
			 * Iff there are still unused pairs, then there will be another test case.
			 * @return whether another test cases is needed.
			 * @private
			 */
			this.hasNext = function() {
				return nPairs>0;
			};
	
			var lastTest = undefined;
			var lastPairs = -1;
	
			/**
			 *
			 * @return
			 * @private
			 */
			this.next = function() {
				lastTest = findTestCase();
				lastPairs=0;
	
				var test={};
				for(var a=0; a<N; a++) {
					for(var b=a+1; b<N; b++) {
						var i=offset(a,b,lastTest[a],lastTest[b]);
						if ( occurs[i] == 0 ) {
							nPairs--;
							lastPairs++;
						}
						occurs[i]++;
					}
					test[params[a].name] = params[a].values[lastTest[a]];
				}
	
				return test;
			};
	
			this.lastPairs = function() { return lastPairs; };
		};
		
	}());

	return sap.ui.test.qunit;

}, /* bExport= */ true);
