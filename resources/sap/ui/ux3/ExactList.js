/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.ux3.ExactList");jQuery.sap.require("sap.ui.ux3.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.ux3.ExactList",{metadata:{library:"sap.ui.ux3",properties:{"showClose":{type:"boolean",group:"Misc",defaultValue:false},"topTitle":{type:"string",group:"Misc",defaultValue:null},"topHeight":{type:"int",group:"Appearance",defaultValue:290}},aggregations:{"subLists":{type:"sap.ui.ux3.ExactList",multiple:true,singularName:"subList"},"controls":{type:"sap.ui.commons.ListBox",multiple:true,singularName:"control",visibility:"hidden"}},associations:{"data":{type:"sap.ui.ux3.ExactAttribute",multiple:false}},events:{"attributeSelected":{}}}});sap.ui.ux3.ExactList.M_EVENTS={'attributeSelected':'attributeSelected'};(function(){jQuery.sap.require("sap.ui.commons.ListBox");jQuery.sap.require("sap.ui.core.Popup");jQuery.sap.require("jquery.sap.dom");jQuery.sap.require("sap.ui.core.theming.Parameters");sap.ui.commons.ListBox.extend("sap.ui.ux3.ExactList.LB",{init:function(){sap.ui.commons.ListBox.prototype.init.apply(this,arguments);this.setAllowMultiSelect(true);this.setDisplayIcons(true);this.addStyleClass("sapUiUx3ExactLstLb")},invalidate:function(){sap.ui.commons.ListBox.prototype.invalidate.apply(this,arguments);if(!this.bInvalidated&&this.getParent()){this.getParent().invalidate()}this.bInvalidated=true},_handleUserActivation:function(E){E.metaKey=true;sap.ui.commons.ListBox.prototype._handleUserActivation.apply(this,[E])},onclick:function(E){sap.ui.commons.ListBox.prototype.onclick.apply(this,arguments);this.getParent().onclick(E)},onAfterRendering:function(){sap.ui.commons.ListBox.prototype.onAfterRendering.apply(this,arguments);this.bInvalidated=false;var P=this.getParent();var s=this.getItems();var I=P._isTop();var H=false;for(var i=0;i<s.length;i++){var A=s[i];var E=sap.ui.getCore().byId(A.getKey());var B=A.$();H=false;if(I||(!E||!E.getShowSubAttributesIndicator_Computed())){B.addClass("sapUiUx3ExactLstNoIco");H=I}else{H=true}if(H&&!I){B.attr("aria-label",P._rb.getText(B.hasClass("sapUiLbxISel")?"EXACT_LST_LIST_ITEM_SEL_ARIA_LABEL":"EXACT_LST_LIST_ITEM_ARIA_LABEL",[A.getText()]))}}var C=P._bRTL?"left":"right";jQuery(".sapUiLbxITxt",this.getDomRef()).css("margin-"+C,20+jQuery.sap.scrollbarSize().width+"px");jQuery(".sapUiLbxIIco",this.getDomRef()).css(C,5+jQuery.sap.scrollbarSize().width+"px");jQuery(this.getDomRef()).attr("tabindex","-1");var L;if(I){L=P.getTopTitle()}else{L=P._rb.getText("EXACT_LST_LIST_ARIA_LABEL",[P._iLevel,P._getAtt().getText()])}jQuery(this.getFocusDomRef()).attr("aria-label",L).attr("aria-expanded","true");this.oItemNavigation.iActiveTabIndex=-1;this.oItemNavigation.setSelectedIndex(-1);this.oItemNavigation.onsapnext=function(D){if(D.keyCode!=jQuery.sap.KeyCodes.ARROW_DOWN){return}sap.ui.core.delegate.ItemNavigation.prototype.onsapnext.apply(this,arguments)};this.oItemNavigation.onsapprevious=function(D){if(D.keyCode!=jQuery.sap.KeyCodes.ARROW_UP){return}sap.ui.core.delegate.ItemNavigation.prototype.onsapprevious.apply(this,arguments)}},renderer:"sap.ui.commons.ListBoxRenderer"});sap.ui.ux3.ExactList.prototype.init=function(){var i=this;this._iLevel=0;this._bCollapsed=false;this._bIsFirstRendering=true;this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");this._lb=new sap.ui.ux3.ExactList.LB(this.getId()+"-lb",{select:function(E){l(i);var K=E.getParameter("selectedItem").getKey();var A=sap.ui.getCore().byId(K);var s=E.getParameter("selectedIndex");if(i._lb.isIndexSelected(s)){A.setProperty("selected",true,true);var S=v(i,A);if(S){var B=d(i,A);if(B<0){i.addSubList(S)}else{i.insertSubList(S,B)}}}else{w(i,A,s)}y(i)._selectionChanged(A)}});this.addAggregation("controls",this._lb);this._closeHandle=jQuery.proxy(this.onForceVerticalClose,this)};sap.ui.ux3.ExactList.prototype.exit=function(){if(this.bIsDestroyed){return}x(this);this._lb.removeAllItems();this._lb=null;this._closeHandle=null;this._scrollCheckHandle=null;this._rb=null;this._oTopList=null;if(this._dirtyListsCleanupTimer){jQuery.sap.clearDelayedCall(this._dirtyListsCleanupTimer);this._dirtyListsCleanupTimer=null;this._dirtyLists=null}};sap.ui.ux3.ExactList.prototype.getFocusDomRef=function(){if(this._isTop()&&this.$().hasClass("sapUiUx3ExactLstTopHidden")){return this.getDomRef("foc")}return this._bCollapsed?this.getDomRef("head"):this._lb.getFocusDomRef()};sap.ui.ux3.ExactList.prototype.onBeforeRendering=function(){this._oTopList=null;if(!this._bIsFirstRendering){return}this._bRTL=sap.ui.getCore().getConfiguration().getRTL();if(!this._isTop()){this._bCollapsed=true;this._oCollapseStyles={"cntnt":"margin-"+(this._bRTL?"right":"left")+":"+sap.ui.core.theming.Parameters.get("sapUiUx3ExactLstCollapseWidth")+";border-top-width:0px;","lst":"width:0px;"}}else{this._bIsFirstRendering=false}};sap.ui.ux3.ExactList.prototype.onAfterRendering=function(){var i=this;var I=this._isTop();if(!this._iCurrentWidth){this._iCurrentWidth=this._getAtt().getWidth()}if(I){this._iScrollWidthDiff=-1;this.onCheckScrollbar();this.$("lst").css("bottom",jQuery.sap.scrollbarSize().height+"px");this.$("cntnt").bind("scroll",function(E){if(E.target.id===i.getId()+"-cntnt"&&E.target.scrollTop!=0){E.target.scrollTop=0}})}if(!this._bCollapsed){k(this,this._iCurrentWidth)}l(this);if(this._bIsFirstRendering){this._bIsFirstRendering=false;p(this,false,null,true)}else{r(this);q(this)}if(this._bRefreshList){this._bRefreshList=false;setTimeout(function(){i._lb.invalidate()},0)}};sap.ui.ux3.ExactList.prototype.onfocusin=function(E){if(E.target===this.getDomRef()){this.getFocusDomRef().focus()}var $=this.$("head");if(this._isTop()){$.attr("tabindex","-1");this.$("foc").attr("tabindex","-1");if(!b(this)&&E.target===$[0]){this.getFocusDomRef().focus()}if(this.$().hasClass("sapUiUx3ExactLstTopHidden")&&E.target===this.getDomRef("foc")){var L=this.getSubLists();if(L.length>0){L[0].getFocusDomRef().focus()}}}if(!E.__exactHandled){$.addClass("sapUiUx3ExactLstHeadFocus");E.__exactHandled=true}};sap.ui.ux3.ExactList.prototype.onfocusout=function(E){var $=this.$("head");if(this._isTop()){$.attr("tabindex","0");this.$("foc").attr("tabindex","0")}$.removeClass("sapUiUx3ExactLstHeadFocus")};sap.ui.ux3.ExactList.prototype.onclick=function(E){var s=this._lb.getScrollTop();if(jQuery(E.target).attr("id")==this.getId()+"-exp"){t(this);this.focus();E.stopPropagation()}else if(jQuery(E.target).attr("id")==this.getId()+"-close"){u(this)}else if(jQuery(E.target).attr("id")==this.getId()+"-hide"){p(this,!this._bCollapsed,E)}else if(this._isTop()&&b(this)&&jQuery.sap.containsOrEquals(this.$("head")[0],E.target)){f(this,E,false);return}else if(!jQuery.sap.containsOrEquals(this.$("cntnt")[0],E.target)){this.focus()}this._lb.setScrollTop(s)};sap.ui.ux3.ExactList.prototype.onkeydown=function(E){function _(E,T){if(jQuery(T).hasClass("sapUiUx3ExactLstFoc")){return}if(T){T.focus()}E.preventDefault();E.stopPropagation()}switch(E.keyCode){case jQuery.sap.KeyCodes.ENTER:case jQuery.sap.KeyCodes.SPACE:if(this._isTop()&&b(this)&&jQuery.sap.containsOrEquals(this.$("head")[0],E.target)){f(this,E,true)}break;case jQuery.sap.KeyCodes.DELETE:if(!this._isTop()&&this.getShowClose()){u(this);_(E,this.getParent().getFocusDomRef())}break;case jQuery.sap.KeyCodes.NUMPAD_MINUS:if(!!(E.metaKey||E.ctrlKey)){}else if(E.shiftKey){if(!this._bCollapsed){k(this,this._iCurrentWidth-10);_(E)}}else if(!this._bCollapsed){p(this,true,E)}break;case jQuery.sap.KeyCodes.NUMPAD_PLUS:if(!!(E.metaKey||E.ctrlKey)){}else if(E.shiftKey){if(!this._bCollapsed){k(this,this._iCurrentWidth+10);_(E)}}else if(this._bCollapsed){p(this,false,E)}break;case jQuery.sap.KeyCodes.TAB:if(this._iLevel==0){var H=b(this);if(!E.shiftKey&&H&&jQuery.sap.containsOrEquals(this.$("head")[0],E.target)){_(E,this.getFocusDomRef())}else if(jQuery.sap.containsOrEquals(this.getFocusDomRef(),E.target)){if(E.shiftKey&&H){_(E,this.$("head")[0])}else if(!E.shiftKey){var s=a(this);if(s){_(E,s.getFocusDomRef())}}}return}if(this._iLevel==1){var s=null;if(E.shiftKey){if(jQuery.sap.containsOrEquals(this.$("cntnt")[0],E.target)){s=this}else{s=g(this)}}else{s=a(this)}if(s){_(E,s.getFocusDomRef())}E.stopPropagation()}break;case jQuery.sap.KeyCodes.ARROW_LEFT:case jQuery.sap.KeyCodes.ARROW_RIGHT:var s=null;if(this._iLevel>=1){if((this._bRTL&&E.keyCode===jQuery.sap.KeyCodes.ARROW_LEFT)||(!this._bRTL&&E.keyCode===jQuery.sap.KeyCodes.ARROW_RIGHT)){s=a(this,true)}else{s=g(this,true)}if(s){_(E,s.getFocusDomRef())}E.stopPropagation()}break}};sap.ui.ux3.ExactList.prototype.onmousedown=function(E){if(E.target.id===this.getId()+"-rsz"){jQuery(document.body).append("<div id=\""+this.getId()+"-ghost\" class=\"sapUiUx3ExactLstRSzGhost\" style =\" z-index:"+sap.ui.core.Popup.getNextZIndex()+"\" ></div>");jQuery(document.body).bind("selectstart."+this.getId(),o);var H=!!sap.ui.Device.browser.internet_explorer?jQuery(document.body):this.$("ghost");H.bind("mouseup."+this.getId(),jQuery.proxy(j,this)).bind("mousemove."+this.getId(),jQuery.proxy(h,this));this._iStartDragX=E.pageX;this._iStartWidth=this.$("lst").width();this.$("rsz").addClass("sapUiUx3ExactLstRSzDrag")}};sap.ui.ux3.ExactList.prototype.onForceVerticalClose=function(E){if(E.type=="mousedown"||E.type=="click"||E.type=="dblclick"||E.type=="focusin"||E.type=="focusout"||E.type=="keydown"||E.type=="keypress"||E.type=="keyup"||E.type=="mousedown"||E.type=="mouseup"){var R=this.$("lst");if(!jQuery.sap.containsOrEquals(R[0],E.target)||E.target.tagName=="BODY"){if(R.hasClass("sapUiUx3ExactLstExpanded")){this._oPopup.close(true)}}}};sap.ui.ux3.ExactList.prototype.onCheckScrollbar=function(E){this._scrollCheckTimer=null;var C=this.$("cntnt");var i=C[0];if(i){var N=i.scrollWidth-i.clientWidth;if(this._iScrollWidthDiff!=N){this._iScrollWidthDiff=N;if(N<=0){C.css({"overflow-x":"hidden","bottom":jQuery.sap.scrollbarSize().height+"px"})}else{C.css({"overflow-x":"scroll","bottom":"0px"})}}this._scrollCheckTimer=jQuery.sap.delayedCall(300,this,this.onCheckScrollbar)}};sap.ui.ux3.ExactList.prototype.insertSubList=function(s,i){this.insertAggregation("subLists",s,i);if(s){m(s,this._iLevel+1)}return this};sap.ui.ux3.ExactList.prototype.addSubList=function(s){this.addAggregation("subLists",s);if(s){m(s,this._iLevel+1)}return this};sap.ui.ux3.ExactList.prototype.setData=function(D){if(D!=null&&typeof(D)!="string"){D=D.getId()}if(D){this.setAssociation("data",D);D=this._getAtt();this._lb.removeAllItems();if(!D){return this}var A=D.getAttributesInternal(true);var s=[];var L=[];for(var i=0;i<A.length;i++){var I=z(A[i]);this._lb.addItem(I);if(A[i].getSelected()){var B=v(this,A[i]);if(B){L.push(B)}s.push(I.getKey())}}this._lb.setSelectedKeys(s);var O=this.getSubLists();for(var i=0;i<O.length;i++){var C=jQuery.inArray(O[i],L);if(C>=0){if(D.getListOrder()!=sap.ui.ux3.ExactOrder.Fixed){L.splice(C,1)}}else{O[i]._lb.removeAllItems();O[i].destroy()}}if(D.getListOrder()===sap.ui.ux3.ExactOrder.Fixed){this.removeAllSubLists()}for(var i=0;i<L.length;i++){this.addSubList(L[i])}var E=this;D.setChangeListener({id:E.getId(),_notifyOnChange:function(T,F){if(T==="width"){if(E._getAtt()===F&&E.getDomRef()){k(E,F.getWidth())}return}var G=y(E);if(!G._dirtyLists){G._dirtyLists={}}if(!G._dirtyLists[E.getId()]){G._dirtyLists[E.getId()]=E}if(!G._dirtyListsCleanupTimer){G._dirtyListsCleanupTimer=jQuery.sap.delayedCall(0,G,function(){this._dirtyListsCleanupTimer=null;jQuery.each(this._dirtyLists,function(i,B){if(B._lb&&B.getParent()){if(!B._isTop()){B.getParent().setData(B.getParent().getData())}else{B.setData(B.getData())}}});this._dirtyLists=null},[])}}})}return this};sap.ui.ux3.ExactList.prototype.setShowClose=function(s){if(this._isTop()){this.setProperty("showClose",s)}return this};sap.ui.ux3.ExactList.prototype.getShowClose=function(){return y(this).getProperty("showClose")};sap.ui.ux3.ExactList.prototype.getTopTitle=function(){var T=this.getProperty("topTitle");return T?T:this._rb.getText("EXACT_BRWSR_LST_TITLE")};sap.ui.ux3.ExactList.prototype._getAtt=function(){return sap.ui.getCore().byId(this.getData())};sap.ui.ux3.ExactList.prototype._isTop=function(){return!(this.getParent()instanceof sap.ui.ux3.ExactList)};sap.ui.ux3.ExactList.prototype._selectionChanged=function(A){if(!this._isTop()){return}A=sap.ui.getCore().byId(A.getId());var _=function(B,R){if(!B.getSelected()){return}R.push(B);var V=B.getAttributesInternal();for(var i=0;i<V.length;i++){_(V[i],R)}};var s=[];var T=this._getAtt().getAttributesInternal();for(var i=0;i<T.length;i++){_(T[i],s)}this.fireAttributeSelected({attribute:A,allAttributes:s})};sap.ui.ux3.ExactList.prototype._closeAll=function(){if(!this._isTop()){return}var s=this;var C=function(){s._getAtt()._clearSelection();s._lb.clearSelection();s.fireAttributeSelected({attribute:undefined,allAttributes:[]})};var L=this.getSubLists();if(L.length>0){for(var i=0;i<L.length;i++){u(L[i],true,i==L.length-1?C:null)}}else{C()}};var g=function(L,A){function i(C){var B=C.getParent();var D=B.getSubLists();var E=B.indexOfSubList(C)-1;if(E>=0){return D[E]}return null}function s(C){var S=C.getSubLists();if(S.length>0){return s(S[S.length-1])}return C}if(L._iLevel==0){return null}else if(L._iLevel==1){if(A){return null}var P=i(L);if(P){return P}return L.getParent()}else if(L._iLevel>1){var P=i(L);if(P){return s(P)}var B=L.getParent();if(B._iLevel>=1){return B}}return null};var a=function(L,A){function i(C){var P=C.getParent();var D=P.getSubLists();var E=P.indexOfSubList(C)+1;if(E<D.length){return D[E]}return null}function s(C){var S=C.getSubLists();if(S.length>0){return S[0]}return null}function B(C){var N=i(C);if(N){return N}var P=C.getParent();if(P._iLevel>(A?1:0)){return B(P)}else{return null}}if(L._iLevel==0){return s(L)}else if(L._iLevel==1){return A?s(L):i(L)}else if(L._iLevel>1){var N=s(L);if(N){return N}return B(L)}return null};var f=function(L,E,K){L.fireEvent("_headerPress",{kexboard:K,domRef:L.$("head")});E.stopPropagation()};var b=function(L){return!c(L)&&L.$().hasClass("sapUiUx3ExactLstTopActive")};var c=function(L){return L.$().hasClass("sapUiUx3ExactLstTopHidden")};var d=function(L,A){if(L._getAtt().getListOrder()!=sap.ui.ux3.ExactOrder.Fixed){return-1}var s=L._getAtt().getAttributes();var B=0;for(var i=0;i<s.length;i++){if(s[i]===A){break}if(s[i].getChangeListener()){B++}}return B};var r=function(L){if(n(L)){L.$("lst").addClass("sapUiUx3ExactLstLstExp");if(!L._oPopup){var P=function(E){L._handleEvent(E)};L._oPopup=new sap.ui.core.Popup();if(!!!sap.ui.Device.browser.firefox){L._oPopup._fixPositioning=function(i,R){sap.ui.core.Popup.prototype._fixPositioning.apply(this,arguments);if(R){var $=this._$();var O=jQuery(i.of);var s=0;if(i.offset){s=parseInt(i.offset.split(" ")[0])}$.css("right",(jQuery(window).width()-O.outerWidth()-O.offset().left+s)+"px")}}}L._oPopup.open=function(){var i=L.$("lst");e(i,false,-1,function(R){i.addClass("sapUiUx3ExactLstExpanded");L.$("exp").html(sap.ui.ux3.ExactListRenderer.getExpanderSymbol(true,false));L.__sOldHeight=i.css("height");i.css("height",L.__sOldHeight);var s=L.$("head");var A=jQuery(L._lb.getDomRef());var B=A[0].scrollHeight+L.$("exp").height()+A.outerHeight()-A.height()+1;var M=jQuery(window).height()-parseInt(A.offset().top,10)+jQuery(window).scrollTop()-s.outerHeight();var T=Math.min(B,M);L._oPopup.setContent(i[0]);var O=sap.ui.core.theming.Parameters.get()["sapUiUx3ExactLst"+(L._isTop()?"Root":"")+"ExpandOffset"]||"0 0";sap.ui.core.Popup.prototype.open.apply(L._oPopup,[0,sap.ui.core.Popup.Dock.BeginTop,sap.ui.core.Popup.Dock.BeginBottom,s[0],O,"none none"]);L._bPopupOpened=true;return T},function(R){i.addClass("sapUiUx3ExactLstExpandedBL");L._oPopup._updateBlindLayer();n(L);L.getFocusDomRef().focus();jQuery.sap.bindAnyEvent(L._closeHandle);R.bind(jQuery.sap.ControlEvents.join(" "),P)})};L._oPopup.close=function(s){var i=L.$("lst");i.removeClass("sapUiUx3ExactLstExpandedBL");e(i,false,L.__sOldHeight,function(R){jQuery.sap.unbindAnyEvent(L._closeHandle);R.unbind(jQuery.sap.ControlEvents.join(" "),P);i.removeClass("sapUiUx3ExactLstExpanded");L.$("exp").html(sap.ui.ux3.ExactListRenderer.getExpanderSymbol(false,false))},function(R){R.detach();i.removeClass("sapUiShd");R.attr("style","width:"+L._iCurrentWidth+"px;");jQuery(L.getDomRef()).prepend(R);L._oPopup.setContent(null);L._bPopupOpened=undefined;L.__sOldHeight=null;if(L._isTop()){R.css("bottom",jQuery.sap.scrollbarSize().height+"px")}n(L);sap.ui.core.Popup.prototype.close.apply(L._oPopup,[0]);if(!s){L.getFocusDomRef().focus()}})}}}};var e=function(R,W,V,D,i){if(D){var s=D(R);if(s!=undefined){V=s}}var _=i?function(){i(R)}:function(){};if(jQuery.fx.off){if(W){R.width(V)}else{R.height(V)}_()}else{var P=W?{width:V}:{height:V};R.stop(true,true).animate(P,200,'linear',_)}};var o=function(E){E.preventDefault();E.stopPropagation();return false};var h=function(E){var C=E.pageX;var D=this._bRTL?(this._iStartDragX-C):(C-this._iStartDragX);k(this,this._iStartWidth+D)};var j=function(E){jQuery(document.body).unbind("selectstart."+this.getId()).unbind("mouseup."+this.getId()).unbind("mousemove."+this.getId());this.$("ghost").remove();this.$("rsz").removeClass("sapUiUx3ExactLstRSzDrag");this._iStartWidth=undefined;this._iStartDragX=undefined;this.focus()};var k=function(L,W){W=sap.ui.ux3.ExactAttribute._checkWidth(W);var P=L._bRTL?"right":"left";L._iCurrentWidth=W;L._getAtt()._setWidth(L._iCurrentWidth);L.$("lst").css("width",W+"px");L.$("rsz").css(P,(W-4)+"px");if(L._isTop()){if(!c(L)){L.$("head").css("width",W+"px");L.$("cntnt").css(P,(W+8)+"px");L.$("scroll").css(P,(W+8)+"px")}}else{if(!L.$().hasClass("sapUiUx3ExactLstCollapsed")){L.$("cntnt").css("margin-"+P,W+"px")}}};var l=function(L){var A=L._getAtt();if(A&&!L._isTop()){L.$("head-txt").html(jQuery.sap.encodeHTML(A.getText())+"<span class=\"sapUiUx3ExactLstHeadInfo\">&nbsp;("+L._lb.getSelectedIndices().length+"/"+L._lb.getItems().length+")</span>")}};var m=function(L,s){L._iLevel=s;var A=L.getSubLists();for(var i=0;i<A.length;i++){m(A[i],s+1)}};var n=function(L){if(L._lb){var i=jQuery(L._lb.getDomRef());L.$("lst").removeClass("sapUiUx3ExactLstScroll");if(i.length>0&&i.outerHeight()<i[0].scrollHeight){L.$("lst").addClass("sapUiUx3ExactLstScroll");return true}}return false};var p=function(L,C,E,s){if(E){E.preventDefault();E.stopPropagation()}if(L._isTop()){return}if(L._bCollapsed!=C){var F=!!E;var i={};i["margin-"+(L._bRTL?"right":"left")]=(L._bCollapsed?(L._iCurrentWidth+"px"):sap.ui.core.theming.Parameters.get("sapUiUx3ExactLstCollapseWidth"));i["border-top-width"]=(L._bCollapsed?sap.ui.core.theming.Parameters.get("sapUiUx3ExactLstContentTop"):"0px");var $=L.$("cntnt");if(jQuery.fx.off){for(var A in i){$.css(A,i[A])}}else{$.stop(true,true).animate(i,200,'linear')}if(L._bCollapsed){e(L.$("lst"),true,L._iCurrentWidth+"px",function(){jQuery(L.getDomRef()).removeClass("sapUiUx3ExactLstCollapsed");L.$("head").css("overflow","hidden")},function(R){L.$("hide").html(sap.ui.ux3.ExactListRenderer.getExpanderSymbol(true,true)).attr("title",L._rb.getText("EXACT_LST_LIST_COLLAPSE"));if(F){L.focus()}var B=L.$("head");L.$("head-txt").removeAttr("style");B.removeAttr("style");R.removeAttr("style");r(L);k(L,L._iCurrentWidth);q(L);B.removeAttr("role");B.removeAttr("aria-label");B.removeAttr("aria-expanded");var D=L._getAtt();if(D&&D._scrollToAttributeId){D.scrollTo(sap.ui.getCore().byId(D._scrollToAttributeId))}});L._oCollapseStyles=undefined}else{L._oCollapseStyles={};e(L.$("lst"),true,0,null,function(){jQuery(L.getDomRef()).addClass("sapUiUx3ExactLstCollapsed");L.$("hide").html(sap.ui.ux3.ExactListRenderer.getExpanderSymbol(false,true)).attr("title",L._rb.getText("EXACT_LST_LIST_EXPAND"));if(F){L.focus()}q(L);var B=L.$("head");B.attr("role","region");B.attr("aria-label",L._rb.getText("EXACT_LST_LIST_COLL_ARIA_LABEL",[L._iLevel,L._getAtt().getText()]));B.attr("aria-expanded","false")});var S=[];for(var A in i){S.push(A,":",i[A],";")}L._oCollapseStyles["cntnt"]=S.join("");L._oCollapseStyles["lst"]="width:0px;"}L._bCollapsed=!L._bCollapsed}if(s){return}var P=L.getParent();if(!L._isTop()&&P&&P._isTop&&!P._isTop()){p(P,C)}};var q=function(L){if(L._bCollapsed){var W=L.$("cntnt").height()-50;var $=L.$("head-txt");$.css("width",W+"px");if(jQuery("html").attr("data-sap-ui-browser")=="ie8"){var B=75-(90-W);$.css("bottom",B+"px")}}var s=L.getSubLists();for(var i=0;i<s.length;i++){q(s[i])}};var t=function(L){var i=L.$("lst");if(i.hasClass("sapUiUx3ExactLstExpanded")){L._oPopup.close()}else{L._oPopup.open()}};var u=function(L,s,C){var F=function(R){if(!s){var A=L._getAtt();var S=A.getParent().indexOfAttribute(A);w(L.getParent(),A,S,true);l(L.getParent());y(L)._selectionChanged(A)}L.destroy();if(C){C()}};var i=L.getDomRef();if(i){e(jQuery(i),true,0,function(R){R.css("overflow","hidden")},F)}else{F()}};var v=function(L,A){if(A.getSelected()){var i=A.getAttributesInternal(true);if(i.length>0){var s;if(A.getChangeListener()){s=sap.ui.getCore().byId(A.getChangeListener().id)}else{s=new sap.ui.ux3.ExactList()}s.setData(A);return s}}return null};var w=function(L,A,s,S){L._lb.removeSelectedIndex(s);A._clearSelection();if(!S){var B=L.getSubLists();for(var i=0;i<B.length;i++){if(B[i].getData()===A.getId()){u(B[i],true)}}}};var x=function(L){var A=L._getAtt();if(A&&A.getChangeListener()&&A.getChangeListener().id===L.getId()){A.setChangeListener(null)}};var y=function(L){if(L._isTop()){return L}if(!L._oTopList){L._oTopList=y(L.getParent())}return L._oTopList};var z=function(A){var i;if(A.__oItem){i=A.__oItem;if(i.getText()!=A.getText()){i.setText(A.getText())}if(i.getKey()!=A.getId()){i.setKey(A.getId())}}else{i=new sap.ui.core.ListItem({text:A.getText(),key:A.getId()});A.exit=function(){if(sap.ui.ux3.ExactAttribute.prototype.exit){sap.ui.ux3.ExactAttribute.prototype.exit.apply(A,[])}this.__oItem.destroy();this.__oItem=null};A.__oItem=i}return i}}());
