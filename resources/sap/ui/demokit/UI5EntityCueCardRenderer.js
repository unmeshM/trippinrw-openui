/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.demokit.UI5EntityCueCardRenderer");sap.ui.demokit.UI5EntityCueCardRenderer={};
sap.ui.demokit.UI5EntityCueCardRenderer.render=function(d,C){var N=C.getNavigable();var D=C.getStyle()==sap.ui.demokit.UI5EntityCueCardStyle.Demokit;function e(t){while(t.slice(-2)=="[]"){t=t.slice(0,-2)}if(t.indexOf("sap.ui.core.")!=0)return false;t=t.slice("sap.ui.core.".length);return"boolean int float number function object string void any ".indexOf(t)>=0}d.write("<div");d.writeControlData(C);d.writeAttribute("class","sapDkCueCd");d.write(">");var f=0;if(!C.getCollapsible()||C.getExpanded()){var g=C._getDoc();function h(o){var r=[];for(var s in o){r.push(s)}r.sort(function(a,b){var k=o[a].deprecation?1:0;var p=o[b].deprecation?1:0;var c=k-p;if(c===0&&a!==b){c=a<b?-1:1}return c});return r};function l(i){return" class='"+((i%2)?"sapDkCueCdOdd":"sapDkCueCdEven")+"'"};function m(k){if(k===0){return"Property of type "}else if(k===1||k===2){return"Aggregation of type "}else if(k===3||k===4){return"Association of type "}else if(k===6){return"Event parameter of type "}else if(k===7){return"Return value of type "}else if(k===6){return"Method parameter of type "}else{return""}};function q(p,t,c){if(t){if(c==="0..n"){return q(p,t)+"[]"}var b=e(t);var s=jQuery.sap.encodeHTML(t.split(".").slice(-1)[0]);var a=jQuery.sap.encodeHTML(m(p.kind)+t);if(N&&(!D||!b)){return"<a class='sapDkLnk' id='"+C.getId()+"-l-"+(f++)+"' data-sap-ui-entity='"+t+"' title='"+a+"'>"+s+"</a>"}else{return"<span title='"+t+"'>"+s+"</span>"}}return''};function u(o){return o.deprecation?" sapDkCueCdDeprct":""};function v(o){return o.deprecation?"<br><i><b>Deprecated</b>: "+o.deprecation+"</i>":""};function w(I){return I?" sapDkCueCdDfltAggr":""};function x(I){return I?"<br><b>Note</b>: This is the default aggregation.":""};if(g){d.write("<table>");if(!D){d.write("<tr><td colspan='3' class='sapDkCueCdHd0",u(g),"'>",C.getEntityName(),"</td></tr>");d.write("<tr><td colspan='3' class='sapDkCueCdDoc'>",g.doc||'',v(g),"</td></tr>")}if(g.metatype===".control"){var y=jQuery.extend({},g.properties,g.aggregations,g.associations);var n=h(y);if(n.length>0){d.write("<tr><td colspan='3' class='sapDkCueCdHd'>","Properties, Aggregations, Associations","</td></tr>");for(var i=0;i<n.length;i++){var P=y[n[i]];d.write("<tr",l(i),"><td class='sapDkCueCdName",u(P),w(n[i]===g.defaultAggregation),"'>",n[i],"</td>","<td class='sapDkCueCdType'>",q(P,P.type,P.cardinality),"</td>","<td class='sapDkCueCdDoc'>",P.doc,v(P),x(n[i]===g.defaultAggregation),"</td></tr>")}}var n=h(g.events);if(n.length>0){d.write("<tr><td colspan='3' class='sapDkCueCdHd'>","Events","</td></tr>");for(var i=0;i<n.length;i++){var E=g.events[n[i]];d.write("<tr",l(i),"><td class='sapDkCueCdName",u(E),"'>",n[i],"</td>","<td class='sapDkCueCdType'>","&nbsp","</td>","<td class='sapDkCueCdDoc'>",E.doc,v(E),"</td></tr>");var z=h(E.parameters);for(var j=0;j<z.length;j++){var A=z[j];var B=E.parameters[A];d.write("<tr",l(i),"><td class='sapDkCueCdSubName",u(B),"'>",A,"</td>","<td class='sapDkCueCdType'>",q(B,B.type),"</td>","<td class='sapDkCueCdDoc'>",B.doc,v(B),"</td></tr>")}}}var n=h(g.methods);if(n.length>0){d.write("<tr><td colspan='3' class='sapDkCueCdHd'>","Methods","</td></tr>");for(var i=0;i<n.length;i++){var M=g.methods[n[i]];var F=n[i]+"(";for(var j=0;j<M.parameters.length;j++){if(j>0){F+=","}F+=M.parameters[j].name}F+=")";d.write("<tr",l(i),"><td class='sapDkCueCdName",u(M),"' colspan='2'>",F,"</td>","<td class='sapDkCueCdDoc'>",M.doc,v(M),"</td></tr>");for(var j=0;j<M.parameters.length;j++){var B=M.parameters[j];d.write("<tr",l(i),"><td class='sapDkCueCdSubName",u(B),"'>",B.name,"</td>","<td class='sapDkCueCdType'>",q(B,B.type),"</td>","<td class='sapDkCueCdDoc'>",B.doc,v(B),"</td></tr>")}if(M.type!=="sap.ui.core/void"){d.write("<tr",l(i),"><td class='sapDkCueCdSubName'>","<i>returns</i>","</td>","<td class='sapDkCueCdType'>",q(M,M.type),"</td>","<td class='sapDkCueCdDoc'>","&nbsp;","</td></tr>")}}}}if(g.metatype===".type"){var n=h(g.values);if(n.length>0){d.write("<tr><td colspan='3' class='sapDkCueCdHd",u(g),"'>","Values","</td></tr>");for(var i=0;i<n.length;i++){var V=g.values[n[i]];d.write("<tr",l(i),"><td class='sapDkCueCdName",u(V),"'>",n[i],"</td>","<td class='sapDkCueCdType'>","&nbsp;","</td>","<td class='sapDkCueCdDoc'>",V.doc,v(V),"</td></tr>")}}if(g.pattern){d.write("<tr><td colspan='3' class='sapDkCueCdHd'>","Constraints","</td></tr>");d.write("<tr",l(i),"><td class='sapDkCueCdName'>","pattern","</td>","<td>","&nbsp;","</td>","<td class='sapDkCueCdDoc'>",g.pattern,"</td></tr>")}}d.write("</table>")}}if(C.getCollapsible()){d.renderControl(C._oShowCueCardLink)}d.write("</div>")};
