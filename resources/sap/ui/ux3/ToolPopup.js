/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.ux3.ToolPopup");jQuery.sap.require("sap.ui.ux3.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.ux3.ToolPopup",{metadata:{interfaces:["sap.ui.core.PopupInterface"],publicMethods:["isOpen","open","close","setPosition","getEnabled","addFocusableArea","removeFocusableArea"],library:"sap.ui.ux3",properties:{"title":{type:"string",group:"Misc",defaultValue:null},"icon":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"iconHover":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"iconSelected":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"modal":{type:"boolean",group:"Behavior",defaultValue:false},"inverted":{type:"boolean",group:"Misc",defaultValue:true},"autoClose":{type:"boolean",group:"Misc",defaultValue:false},"maxHeight":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},"maxWidth":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},"openDuration":{type:"int",group:"Misc",defaultValue:400},"closeDuration":{type:"int",group:"Misc",defaultValue:400}},defaultAggregation:"content",aggregations:{"buttons":{type:"sap.ui.core.Control",multiple:true,singularName:"button"},"content":{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},associations:{"initialFocus":{type:"sap.ui.core.Control",multiple:false},"opener":{type:"sap.ui.core.Control",multiple:false},"defaultButton":{type:"sap.ui.core.Control",multiple:false}},events:{"open":{},"close":{allowPreventDefault:true},"enter":{},"iconChanged":{},"closed":{},"opened":{}}}});sap.ui.ux3.ToolPopup.M_EVENTS={'open':'open','close':'close','enter':'enter','iconChanged':'iconChanged','closed':'closed','opened':'opened'};jQuery.sap.require("sap.ui.core.Popup");jQuery.sap.require("sap.ui.core.theming.Parameters");jQuery.sap.require("sap.ui.core.IconPool");sap.ui.ux3.ToolPopup.ARROW_LEFT=new RegExp(/my:(left|begin)([-+]\d*\%?)?\|[a-z]+([-+]\d*\%?)? at:(right|end)\|[a-z]+/);sap.ui.ux3.ToolPopup.ARROW_RIGHT=new RegExp(/my:(right|end)([-+]\d*\%?)?\|[a-z]+([-+]\d*\%?)? at:(left|begin)\|[a-z]+/);sap.ui.ux3.ToolPopup.ARROW_UP=new RegExp(/my:[a-z]+([-+]\d*\%?)?\|top([-+]\d*\%?)? at:[a-z]+\|bottom/);sap.ui.ux3.ToolPopup.ARROW_DOWN=new RegExp(/my:[a-z]+([-+]\d*\%?)?\|bottom([-+]\d*\%?)? at:[a-z]+\|top/);(function(){sap.ui.ux3.ToolPopup.prototype.init=function(){this.oPopup=null;this._bPositionSet=false;this._bFocusSet=false;this._proxyOpened=jQuery.proxy(p,this);this._proxyClosed=jQuery.proxy(o,this);this._proxyFixSize=jQuery.proxy(f,this);S(this)};sap.ui.ux3.ToolPopup.prototype.exit=function(){if(this.oPopup){this.oPopup.detachOpened(this._proxyOpened);this.oPopup.detachClosed(this._proxyClosed);this.oPopup.destroy();delete this.oPopup}delete this._bPositionSet;delete this._bFocusSet;delete this._bPreventRestoreFocus;delete this._proxyOpened;delete this._proxyClosed;if(this._bBoundOnResize){jQuery(window).unbind("resize",this._proxyFixSize)}delete this._bRTL;delete this._sArrowDir;delete this._oArrowIcon;delete this._bThemeInverted;delete this._sInitialFocusId;delete this._sFirstFocusableId;delete this._sLastFocusableId};var s=function(t){var I=t.getId();var T="";var F=I+"-firstFocusable";var l=I+"-lastFocusable";var e=jQuery.sap.byId(F).get(0);var b=jQuery(":sapFocusable",t.$()).get();if(!t._bFocusSet){if(b.length>0){for(var i=0;i<b.length;i++){T=b[i].id;if(T!==F&&T!==l){e=b[i];break}}}var d=jQuery(e).control();if(d[0]){var h=d[0].getFocusDomRef();e=h?h:e}jQuery.sap.focus(e);t._sInitialFocusId=e.id}else{t._sInitialFocusId=t.oPopup._sInitialFocusId}if(!t._sLastFocusableId||!t._sFirstFocusableId){t._sLastFocusableId=F;t._sFirstFocusableId=l;if(b.length>2){t._sFirstFocusableId=b[1].id;t._sLastFocusableId=b[b.length-2].id}}};sap.ui.ux3.ToolPopup.prototype.onfocusin=function(e){var n=jQuery();var i=this.getId();var F=i+"-firstFocusable";var l=i+"-lastFocusable";if(e.target.id===F&&e.target.id!==this._sLastFocusableId){n=jQuery.sap.byId(this._sLastFocusableId)}else if(e.target.id===l&&e.target.id!==this._sFirstFocusableId){n=jQuery.sap.byId(this._sFirstFocusableId)}if(n.length){n.focus()}};var f=function(){var t=this.$();var v=0;var m=this.getMaxHeight();var M=m?parseInt(m):0;var P=t.css("padding-top");var i=parseInt(P,10);var b=t.css("padding-bottom");var d=parseInt(b,10);var B=t.css("border-top-width");var e=parseInt(B,10);var h=t.css("border-bottom-width");var j=parseInt(h,10);var k=i+d+e+j;var l=jQuery(document).scrollTop();var T=t.rect();var n=T.top-l+t.outerHeight(true);var w=jQuery(window).height();var q=(n>w)&&(M===0);if(q){var O=jQuery.sap.byId(this.getOpener());var x=O.rect();var y=x.top-l+O.outerHeight(true);var z=this.oPopup._getPositionOffset();if(n>y&&z.length>0){var Y=Math.abs(parseInt(z[1],10));if(n-Y>w){q=false;var A="Offset of "+Y+" pushes ToolPopup out of the window";jQuery.sap.log.warning(A,"","sap.ui.ux3.ToolPopup")}}}if(!this._bInitialFix||this._bInitialFix&&q){delete this._bInitialFix;t.toggleClass("sapUiUx3TPLargeContent",true)}if(q){M=t.outerHeight(true);t.toggleClass("sapUiUx3TPLargeContent",false)}if(M>0){t.css("max-height",M+"px");var $=this.$("title");var C=this.$("title-separator");var D=this.$("buttons");var E=this.$("buttons-separator");M-=k;M-=$.outerHeight(true);M-=C.outerHeight(true);M-=E.outerHeight(true);M-=D.length>0?D.outerHeight(true):0;v=M}if(q||(M>0)){v=parseInt(v,10);var F=this.$("content");F.css("max-height",v+"px");F.toggleClass("sapUiUx3TPLargeContent",true)}var G=this.getMaxWidth();if(G){var H=parseInt(G,10);var I=t.css("border-left-width");var J=parseInt(I);var K=t.css("border-right-width");var L=parseInt(K);var N=t.css("padding-left");var Q=parseInt(N);var U=t.css("padding-right");var V=parseInt(U);H-=J+Q+V+L;t.css("max-width",H+"px")}else{t.css("max-width","")}a(this)};var p=function(){s(this);this._bInitialFix=true;this._proxyFixSize();this.fireOpened()};sap.ui.ux3.ToolPopup.prototype.isOpen=function(){if(this.oPopup&&this.oPopup.isOpen()){return true}return false};sap.ui.ux3.ToolPopup.prototype.willBeClosed=function(){var e=this.oPopup&&this.oPopup.getOpenState();return e!==sap.ui.core.OpenState.OPENING&&e!==sap.ui.core.OpenState.OPEN};sap.ui.ux3.ToolPopup.prototype.open=function(m,b){this._my=m;this._at=b;this._sArrowDir=g(this);var O=null;this.sOffset="";u(this);if(!this._bPositionSet){var i=0;var d=0;if(!this._my){this._my=sap.ui.core.Popup.Dock.BeginTop}if(!this._at){this._at=sap.ui.core.Popup.Dock.EndTop}O=jQuery.sap.domById(this.getOpener());if(O){switch(this._sArrowDir){case"Up":i=0;d=this.iArrowWidth;break;case"Down":i=0;d=-this.iArrowWidth;break;case"Right":i=-this.iArrowWidth;break;default:case"Left":i=this.iArrowWidth;break}i=parseInt(i,10);d=parseInt(d,10);this.sOffset=""+i+" "+d;this.setPosition(this._my,this._at,O,this.sOffset,"none")}else{this.setPosition(sap.ui.core.Popup.Dock.BeginTop,sap.ui.core.Popup.Dock.BeginTop,window,"0 0","fit");jQuery.sap.log.warning("No opener set. Using a default position for Popup","","sap.ui.ux3.ToolPopup")}this._bPositionSet=false}this._ensurePopup();var A=this.getAutoClose();var M=this.getModal();if(A&&M){jQuery.sap.log.warning("A modal & autoclose ToolPopup will not work properly. Therefore 'autoclose' will be deactived!");A=false}this.oPopup.setAutoClose(A);this.oPopup.setModal(M);this._oPreviousFocus=sap.ui.core.Popup.getCurrentFocusInfo();this.fireOpen();c(this);this.oPopup.open(this.getOpenDuration(),this._my,this._at,O,this.sOffset,"",true);a(this);return this};var c=function(t){if(!t.getOpener()){var i="";if(t.oPopup){if(t.oPopup._oPosition.of instanceof sap.ui.core.Element){i=t.oPopup._oPosition.of.getId()}else{if(t.oPopup._oPosition.of.length>0){i=t.oPopup._oPosition.of[0].id}else{i=t.oPopup._oPosition.of.id}}}if(i!==""){t.setAssociation("opener",i,true)}else{jQuery.sap.log.error("Neither an opener was set properly nor a corresponding one can be distinguished","","sap.ui.ux3.ToolPopup")}}};var S=function(t){var P="sapUiUx3ToolPopupArrowWidth";t.sArrowWidth=sap.ui.core.theming.Parameters.get(P);t.iArrowWidth=parseInt(t.sArrowWidth,10);P="sapUiUx3ToolPopupArrowHeight";t.sArrowHeight=sap.ui.core.theming.Parameters.get(P);t.iArrowHeight=parseInt(t.sArrowHeight,10);P="sapUiUx3ToolPopupArrowRightMarginCorrection";t.sArrowPadding=sap.ui.core.theming.Parameters.get(P);t.iArrowPadding=parseInt(t.sArrowPadding,10);P="sapUiUx3ToolPopupArrowRightMarginCorrectionInverted";t.sArrowPaddingInverted=sap.ui.core.theming.Parameters.get(P);t.iArrowPaddingInverted=parseInt(t.sArrowPaddingInverted,10)};var g=function(t){var d="Left";var m=t._my;var b=t._at;if(!m&&t.oPopup){m=t.oPopup._oPosition.my}if(!b&&t.oPopup){b=t.oPopup._oPosition.at}t._bHorizontalArrow=false;if(m&&b){var M=m.split(" ");var A=b.split(" ");var e="my:"+M[0]+"|"+M[1];e+=" at:"+A[0]+"|"+A[1];if(sap.ui.ux3.ToolPopup.ARROW_LEFT.exec(e)){t._bHorizontalArrow=true;d="Left"}else if(sap.ui.ux3.ToolPopup.ARROW_RIGHT.exec(e)){t._bHorizontalArrow=true;d="Right"}else if(sap.ui.ux3.ToolPopup.ARROW_UP.exec(e)){d="Up"}else if(sap.ui.ux3.ToolPopup.ARROW_DOWN.exec(e)){d="Down"}if(t.getDomRef()&&t.isOpen()){var T=t.$();var P=T.rect();var O=jQuery.sap.byId(t.getOpener());var h=O.rect();if(h){if(t._bHorizontalArrow){var i=P.left+T.outerWidth(true)+t.iArrowWidth;var j=h.left+O.outerWidth(true);if(i<=j){d="Right"}else{d="Left"}}else{var k=P.top+T.outerHeight(true)+t.iArrowWidth;var l=h.top+O.outerHeight(true);if(k<=l){d="Down"}else{d="Up"}}}}}return d};var a=function(t){if(!t.getDomRef()){return}var k="";var v=0;var z=0;var h=t.iArrowHeight/2;t._sArrowDir=g(t);var A=t._sArrowDir;if(t._bRTL){if(t._sArrowDir==="Right"){A="Left"}else if(t._sArrowDir==="Left"){A="Right"}}var P=t.$().rect();var O=jQuery.sap.byId(t.getOpener()).rect();if(!O){jQuery.sap.log.warning("Opener wasn't set properly. Therefore arrow will be at a default position","","sap.ui.ux3.ToolPopup")}var $=t.$("arrow");if(!t._my&&t.oPopup){t._my=t.oPopup._oPosition.my}if(t._bHorizontalArrow){k="top";if(O){z=O.top-P.top;v=Math.round(z+O.height/2);v=v+h>P.height?v-t.iArrowHeight:v}}else{k="left";if(O){z=O.left-P.left;v=Math.round(z+O.width/2);v=v+h>P.width?v-t.iArrowHeight:v}}if(O){v-=h}else{v=t.iArrowHeight}var C="";if($.hasClass("sapUiUx3TPNewArrow")){C="sapUiUx3TPNewArrow sapUiUx3TPNewArrow"}else{C=t.isInverted()?"sapUiUx3TPArrow sapUiTPInverted sapUiUx3TPArrow":"sapUiUx3TPArrow sapUiUx3TPArrow"}$.attr("class",C+A);if(A==="Right"){var w=P.width;if(t.isInverted()){w+=t.iArrowPaddingInverted}else{w+=t.iArrowPadding}t._bRTL=sap.ui.getCore().getConfiguration().getRTL();if(t._bRTL){$.css("right",w+"px")}else{$.css("left",w+"px")}}else{$.css({"left":"","right":""})}v=parseInt(v,10);v=v<0?0:v;if(v>0){v-=2;$.css(k,v+"px")}};sap.ui.ux3.ToolPopup.prototype.onsapescape=function(){if(this.fireClose()){this.close()}};var o=function(e){if(!this._bPreventRestoreFocus){sap.ui.core.Popup.applyFocusInfo(this._oPreviousFocus)}this.fireClosed()};sap.ui.ux3.ToolPopup.prototype.close=function(P){if(this.oPopup&&this.oPopup.isOpen()){if(this._bBoundOnResize){jQuery(window).unbind("resize",this._proxyFixSize);delete this._bBoundOnResize}this.oPopup.close(this.getCloseDuration());this._bPreventRestoreFocus=P}return this};sap.ui.ux3.ToolPopup.prototype.getEnabled=function(){var e=this.oPopup?this.oPopup.getOpenState():sap.ui.core.OpenState.CLOSED;return e===sap.ui.core.OpenState.OPENING||e===sap.ui.core.OpenState.OPEN};sap.ui.ux3.ToolPopup.prototype.onsapenter=function(e){var i=this.getDefaultButton();var F=sap.ui.getCore().byId(i);if(i&&F&&jQuery.contains(this.getDomRef(),F.getDomRef())){if(F instanceof sap.ui.commons.Button){var $=F.$();$.click();$.focus()}}e.preventDefault();e.stopPropagation()};sap.ui.ux3.ToolPopup.prototype.onBeforeRendering=function(){var i=this.getInitialFocus();var d=this.getDefaultButton();this._bFocusSet=true;if(i){this.oPopup.setInitialFocusId(i)}else if(d){this.oPopup.setInitialFocusId(d)}else{this._bFocusSet=false}this._bRTL=sap.ui.getCore().getConfiguration().getRTL()};sap.ui.ux3.ToolPopup.prototype._ensurePopup=function(){if(!this.oPopup){this.oPopup=new sap.ui.core.Popup(this,false,true,false);this.oPopup.attachOpened(this._proxyOpened);this.oPopup.attachClosed(this._proxyClosed);var t=this;this.oPopup._applyPosition=function(){sap.ui.core.Popup.prototype._applyPosition.apply(t.oPopup,arguments);var b=t.oPopup._oLastPosition.of;if(!b){t.oPopup.close()}else{var $=jQuery.sap.byId(b.id);if(t._bPositionSet){if(!$.hasClass("sapUiUx3ShellTool")){t._my=t.oPopup._oLastPosition.my;t._at=t.oPopup._oLastPosition.at}}a(t)}}}return this.oPopup};sap.ui.ux3.ToolPopup.prototype.setPosition=function(){this._ensurePopup();this.oPopup.setPosition.apply(this.oPopup,arguments);this._bPositionSet=true;c(this);return this};var r=function(t){var C=t.getDomRef("content");C.innerHTML="";var b=t.getContent();var d=sap.ui.getCore().createRenderManager();for(var i=0;i<b.length;i++){d.renderControl(b[i])}d.flush(C,true);d.destroy();t._proxyFixSize()};var R=function(t){var b=t.getDomRef("buttons");var d=t.getDomRef("buttons-separator");var B=t.getButtons();if(B.length===0){jQuery(b).addClass("sapUiUx3TPButtonRowHidden");jQuery(d).addClass("sapUiUx3TPButtonRowHidden")}else{jQuery(b).removeClass("sapUiUx3TPButtonRowHidden");jQuery(d).removeClass("sapUiUx3TPButtonRowHidden");b.innerHTML="";var e=sap.ui.getCore().createRenderManager();for(var i=0;i<B.length;i++){e.renderControl(B[i])}e.flush(b,true);e.destroy();t._proxyFixSize()}};sap.ui.ux3.ToolPopup.prototype.addContent=function(C){this.addAggregation("content",C,true);if(this.isOpen()){r(this);a(this)}return this};sap.ui.ux3.ToolPopup.prototype.insertContent=function(C,i){this.insertAggregation("content",C,i,true);if(this.isOpen()){r(this);a(this)}return this};sap.ui.ux3.ToolPopup.prototype.removeContent=function(C){this.removeAggregation("content",C,true);if(this.isOpen()){r(this);a(this)}return this};sap.ui.ux3.ToolPopup.prototype.addButton=function(b){this.addAggregation("buttons",b,true);if(this.isOpen()){R(this);a(this)}return this};sap.ui.ux3.ToolPopup.prototype.insertButton=function(b,i){this.insertAggregation("buttons",b,i,true);if(this.isOpen()){R(this);a(this)}return this};sap.ui.ux3.ToolPopup.prototype.removeButton=function(b){this.removeAggregation("button",b,true);if(this.isOpen()){R(this);a(this)}return this};var u=function(t){var P="sapUiUx3ToolPopupInverted";P=sap.ui.core.theming.Parameters.get(P);t._bThemeInverted=P==="true"};sap.ui.ux3.ToolPopup.prototype.onThemeChanged=function(){u(this)};sap.ui.ux3.ToolPopup.prototype.isInverted=function(){u(this);return this.getInverted()&&this._bThemeInverted};sap.ui.ux3.ToolPopup.prototype.setAutoCloseAreas=function(A){this._ensurePopup();return this.oPopup.setAutoCloseAreas(A)};sap.ui.ux3.ToolPopup.prototype.addFocusableArea=function(i){this._ensurePopup();if(typeof(i)==="string"){this.oPopup._addFocusableArea("channelId","eventId",{id:i});return this}else{jQuery.sap.log.error("Wrong type of focusable area ID - string expected","","sap.ui.ux3.ToolPopup")}};sap.ui.ux3.ToolPopup.prototype.removeFocusableArea=function(i){this._ensurePopup();if(typeof(i)==="string"){this.oPopup._removeFocusableArea("channelId","eventId",{id:i});return this}else{jQuery.sap.log.error("Wrong type of focusable area ID - string expected","","sap.ui.ux3.ToolPopup")}}}());
sap.ui.ux3.ToolPopup.prototype.setIcon=function(i){this.setProperty("icon",i,true);this.fireIconChanged();return this};
sap.ui.ux3.ToolPopup.prototype.setIconHover=function(i){this.setProperty("iconHover",i,true);this.fireIconChanged();return this};
sap.ui.ux3.ToolPopup.prototype.setIconSelected=function(i){this.setProperty("iconSelected",i,true);this.fireIconChanged();return this};
sap.ui.ux3.ToolPopup.prototype.getIconSelected=function(){return this.getProperty("iconSelected")||this.getProperty("iconHover")};
sap.ui.ux3.ToolPopup.prototype.setMaxWidth=function(m){var p=/[0-9]+px/;if(p.test(m)){this.setProperty("maxWidth",m)}else{jQuery.sap.log.error("Only values in pixels are possible","","sap.ui.ux3.ToolPopup")}};
