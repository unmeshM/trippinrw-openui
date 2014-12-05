jQuery.sap.declare("sap.conn.CORS.CORSConnectivity");

sap.ui.core.app.UIComponent.extend("CORSConnectivity",{


	sendCORSRequest:function(url,method,fnLoad,fnError){
		
	var xhr = createCORSRequest(url,method);
	xxhr.onload=fnLoad;
	xhr.onerror = fnError;

	if(!xhr){
		throw new Error("xhr not supported by browser");
	}
	xhr.send();
	
	},
	
	createCORSRequest:function(url,method){
		var xhr=new XMLHttpRequest();
		
		if("withCredentals" in xhr)
		{
			xhr.open(method,url,true);
		}
		else
		{
			if(typeof XDomainRequest != undefined)
			{
					xhr=new XDomainRequest(method,url);
					xhr.open(method,url);
			}
			else{
				xhr=null;
			}
			
		}
		return xhr;
	}
});

/*CORSConnectivity={};
CORSConnectivity.prototype.SendCORSRequest=function(sPath,mParam,fnCallback){
	
}
CORSConnectivity.prototype.CreateCORSRequest(params,type,headers){
	
}*/