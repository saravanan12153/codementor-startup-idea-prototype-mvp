(function(){function getUrlVars(){var vars={};var parts=window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(m,key,value){vars[key]=value});return vars}var urlVars=getUrlVars();window.isDebugEnabled=urlVars.debug?urlVars.debug==="true":false;var userAgent=navigator.userAgent.toLowerCase();var XWM={cacheBust:0,lastHash:0,intervalId:0,rmCallback:null,defaultDelay:500,hasPostMessage:window["postMessage"]!==undefined,_serializeMessageValue:function(value){if(typeof value==="object"){value=JSON.stringify(value)}return encodeURIComponent(value)},send:function(message,targetUrl,target){l("XWM Send: Sending Message.");l("  targetUrl: "+targetUrl);var self=XWM;if(!targetUrl){return}if(typeof message!="string"){var parts=[];for(var k in message){parts.push(k+"="+this._serializeMessageValue(message[k]))}message=parts.join("&")}l("  message: "+message);if(self.hasPostMessage){target=target||parent;target["postMessage"](message,targetUrl.replace(/([^:]+:\/\/[^\/]+).*/,"$1"))}else if(targetUrl){var t=(new Date).getTime();var c=++self.cacheBust;var targetFrame=document.getElementById(target);if(targetFrame){targetFrame.setAttribute("src",targetUrl.replace(/#.*$/,"")+"#"+t+c+"&"+message)}else{parent.location=targetUrl.replace(/#.*$/,"")+"#"+t+c+"&"+message}}l("XWM Send: Message sent.")},receive:function(callback,sourceOrigin,delay){if(typeof callback!=="function"){error("callback must be a function")}if(typeof sourceOrigin!=="string"){error("sourceOrigin must be a string")}l("XWM Receive: Initialize receiver.");l("  callback: "+(callback.name?callback.name:"Anonymous function"));l("  sourceOrigin: "+sourceOrigin);var self=XWM;if(self.hasPostMessage){if(callback){if(self.rmCallback){if(window["addEventListener"]){window["removeEventListener"]("message",self.rmCallback,false)}else{window["detachEvent"]("onmessage",self.rmCallback)}}self.rmCallback=function(evt){if(evt.origin!==sourceOrigin){var subdomainTest=new RegExp("[/|.]"+sourceOrigin+"$","i");if(!subdomainTest.test(evt.origin)){return false}}l("XWM Receive: Message received!");l("  data: "+evt.data);l("  sourceOrigin: "+sourceOrigin);callback(evt)}}if(window["addEventListener"]){window["addEventListener"]("message",self.rmCallback,false)}else{window["attachEvent"]("onmessage",self.rmCallback)}}else{l("XWM Receive: Starting poll...");if(self.intervalId){clearInterval(self.intervalId);self.intervalId=null}if(typeof delay==="undefined"){delay=self.defaultDelay}if(callback){delay=delay!==undefined?delay:200;self.intervalId=setInterval(function(){var hash=document.location.hash;var re=/^#?\d+&/;if(hash!==self.lastHash&&re.test(hash)){self.lastHash=hash;var data=hash.replace(re,"");l("XWM Receive: Message received!");l("  data: "+data);l("  sourceOrigin: "+sourceOrigin);callback({data:data})}},delay)}}}};var HelloSign={DEFAULT_UX_VERSION:1,IFRAME_WIDTH_RATIO:.8,DEFAULT_WIDTH:900,DEFAULT_HEIGHT:900,MIN_HEIGHT:480,wrapper:null,iframe:null,overlay:null,cancelButton:null,clientId:null,isOldIE:/msie (8|7|6|5)/gi.test(userAgent),isFF:/firefox/gi.test(userAgent),isOpera:/opera/gi.test(userAgent),isMobile:/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),baseUrl:"https://www.hellosign.com",cdnBaseUrl:"https://s3.amazonaws.com/cdn.hellofax.com",XWM:XWM,CULTURES:{EN_US:"en_US",FR_FR:"fr_FR",DE_DE:"de_DE",SV_SE:"sv_SE",init:function(){this.supportedCultures=[this.EN_US,this.FR_FR,this.DE_DE,this.SV_SE];return this}}.init(),isDebugEnabled:window.isDebugEnabled,EVENT_SIGNED:"signature_request_signed",EVENT_CANCELED:"signature_request_canceled",EVENT_SENT:"signature_request_sent",EVENT_TEMPLATE_CREATED:"template_created",EVENT_ERROR:"error",init:function(appClientId){this.clientId=appClientId},open:function(params){var self=this;var redirectUrl=this.safeUrl(params["redirectUrl"]);var messageListener=params["messageListener"];var frameUrl=this.safeUrl(params["url"]);this.uxVersion=params["uxVersion"]||this.DEFAULT_UX_VERSION;if(this.uxVersion){frameUrl+=(frameUrl.indexOf("?")>0?"&":"?")+"ux_version="+this.uxVersion}if(typeof params["debug"]!=="undefined"){this.isDebugEnabled=params["debug"]===true||params["debug"]=="true"}if(typeof params["skipDomainVerification"]!=="undefined"){this.skipDomainVerification=params["skipDomainVerification"]===true||params["skipDomainVerification"]=="true"}if(typeof params["hideHeader"]!=="undefined"){this.hideHeader=params["hideHeader"]===true||params["hideHeader"]=="true"}this.isInPage=params["container"]!==undefined;this.container=params["container"]||document.body;if(this.isInPage&&params["height"]!==undefined&&(isNaN(parseInt(params["height"],10))||params["height"]<=0)){throw new Error("Invalid iFrame height ("+params["height"]+") it must be a valid positive number")}l("Opening HelloSign embedded iFrame with the following params:");l(params);if(!frameUrl){throw new Error("No url specified")}var userCulture=typeof params["userCulture"]==="undefined"?this.CULTURES.EN_US:params["userCulture"];if(this.inArray(userCulture,this.CULTURES.supportedCultures)===-1){throw new Error("Invalid userCulture specified: "+userCulture)}frameUrl+=frameUrl.indexOf("?")>0?"&":"?";if(redirectUrl){frameUrl+="redirect_url="+encodeURIComponent(redirectUrl)+"&"}frameUrl+="parent_url="+encodeURIComponent(document.location.href.replace(/\#.*/,""))+"&";frameUrl+=this.skipDomainVerification===true?"skip_domain_verification=1&":"";frameUrl+="client_id="+this.clientId+"&";frameUrl+="requester="+encodeURIComponent(params["requester"])+"&";frameUrl+="user_culture="+userCulture;if(this.isDebugEnabled){frameUrl+="&debug=true"}if(this.hideHeader){frameUrl+="&hideHeader=true"}var winDims=this.getWindowDimensions();var height=this.isInPage&&params["height"]?params["height"]:Math.max(this.MIN_HEIGHT,winDims.height-60);var origin=frameUrl.replace(/([^:]+:\/\/[^\/]+).*/,"$1");var top=Math.max(0,winDims.scrollY+parseInt((winDims.height-height)/2,10));var left=Math.max(0,parseInt((winDims.width-this.DEFAULT_WIDTH)/2,10));var styles={overlay:{position:"fixed",top:"0px",left:"0px",bottom:"0px",right:"0px","z-index":9997,display:"block","background-color":"#222",opacity:.4,"-khtml-opacity":.4,"-moz-opacity":.4,filter:"alpha(opacity=40)","-ms-filter":"progid:DXImageTransform.Microsoft.Alpha(Opacity=40)"},wrapper:this.isInPage?{}:{position:"absolute",top:top+"px",left:left+"px","z-index":9998},iframe:this.isInPage?{}:{border:"1px solid #505050","box-shadow":"0px 2px 18px 2px #666","background-color":"#FFF","z-index":9998},cancelButton:{position:"absolute",top:"-13px",right:"-13px",width:"30px",height:"30px","background-image":"url("+this.cdnBaseUrl+"/css/fancybox/fancybox.png)","background-position":"-40px 0px",cursor:"pointer","z-index":9999}};var resizeIFrame=function _resizeIFrame(){if(self.iframe){var winDims=self.getWindowDimensions();var height=Math.max(self.MIN_HEIGHT,winDims.height-60);var width=self.uxVersion>1&&!self.isMobile?Math.min(self.DEFAULT_WIDTH,winDims.width*self.IFRAME_WIDTH_RATIO):self.DEFAULT_WIDTH;var top=Math.max(0,winDims.scrollY+parseInt((winDims.height-height)/2,10));var left=Math.max(0,parseInt((winDims.width-width)/2,10));self.wrapper.style["top"]=top+"px";self.wrapper.style["left"]=left+"px";self.iframe.style["height"]=height+"px";self.iframe.style["width"]=width+"px"}};if(this.uxVersion>1){if(this.isInPage){styles["wrapper"]["width"]="100%";styles["wrapper"]["height"]=height+"px";styles["iframe"]["width"]="100%";styles["iframe"]["height"]=height+"px";styles["iframe"]["border"]="none";styles["iframe"]["box-shadow"]="none";styles["cancelButton"]["display"]="none"}else if(this.isMobile){styles["wrapper"]["position"]="fixed";styles["wrapper"]["top"]="0";styles["wrapper"]["left"]="0";styles["wrapper"]["width"]=winDims.width+"px";styles["wrapper"]["height"]=winDims.height+"px";styles["iframe"]["position"]="fixed";styles["iframe"]["top"]=0;styles["iframe"]["left"]=0;styles["iframe"]["width"]=winDims.width+"px";styles["iframe"]["height"]=winDims.height+"px";styles["iframe"]["border"]="none";styles["iframe"]["box-shadow"]="none";styles["cancelButton"]["display"]="none"}}if(!this.isInPage){if(!this.overlay){this.overlay=document.createElement("div");this.overlay.setAttribute("id","hsEmbeddedOverlay");document.body.appendChild(this.overlay)}this.overlay.setAttribute("style","display: block;")}if(!this.wrapper){this.wrapper=document.createElement("div");this.wrapper.setAttribute("id","hsEmbeddedWrapper");this.container.appendChild(this.wrapper)}if(!this.isInPage){if(this.isMobile){if(this.uxVersion===this.DEFAULT_UX_VERSION){var zoomScale=document.body.clientWidth/window.innerWidth;var detectZoom=function _detectZoom(){var newZoomScale=document.body.clientWidth/window.innerWidth;if(zoomScale!==newZoomScale){zoomScale=newZoomScale;resizeIFrame()}};window.onscroll=detectZoom}else{}}else{window.onresize=resizeIFrame}}if(!this.iframe){this.iframe=document.createElement("iframe");this.iframe.setAttribute("id","hsEmbeddedFrame");this.wrapper.appendChild(this.iframe)}this.iframe.setAttribute("src",frameUrl);this.iframe.setAttribute("scrolling","no");this.iframe.setAttribute("frameborder","0");if(this.uxVersion===this.DEFAULT_UX_VERSION){this.iframe.setAttribute("width",this.DEFAULT_WIDTH)}this.iframe.setAttribute("height",height);if(!this.isInPage&&(params["allowCancel"]===true||params["allowCancel"]===undefined)&&!this.cancelButton){this.cancelButton=document.createElement("a");this.cancelButton.setAttribute("id","hsEmbeddedCancel");this.cancelButton.setAttribute("href","javascript:;");this.cancelButton.onclick=function(){HelloSign.close();if(messageListener){l("Reporting cancelation");messageListener({event:HelloSign.EVENT_CANCELED})}};this.wrapper.appendChild(this.cancelButton)}else if(!params["allowCancel"]&&this.cancelButton){this.wrapper.removeChild(this.cancelButton)}for(var k in styles){var el=this[k];if(el){for(var i in styles[k]){try{el.style[i]=styles[k][i]}catch(e){l(e)}}}}if(this.cancelButton&&(this.isFF||this.isOpera)){var s=this.cancelButton.getAttribute("style");s+=s?"; ":"";s+="background-image: "+styles.cancelButton["background-image"]+"; ";s+="background-position: "+styles.cancelButton["background-position"]+";";this.cancelButton.setAttribute("style",s)}if(!this.isInPage&&(!this.isMobile||this.uxVersion===this.DEFAULT_UX_VERSION)){resizeIFrame()}XWM.receive(function _parentWindowCallback(evt){if(evt.data=="close"){HelloSign.close()}else if(evt.data.indexOf("hello:")===0){var parts=evt.data.split(":");var token=parts[1];XWM.send("helloback:"+token,frameUrl,evt.source||"hsEmbeddedFrame")}else if(messageListener&&evt.data){var eventData={};var p,pairs=evt.data.split("&");var deserializeEventData=function(str){var obj=str;try{obj=JSON.parse(str);if(typeof obj==="object"){for(var key in obj){obj[key]=parseJson(obj[key])}}}catch(e){}return obj};for(var i=0;i<pairs.length;i++){p=pairs[i].split("=");if(p.length===2){eventData[p[0]]=deserializeEventData(decodeURIComponent(p[1]))}}messageListener(eventData)}},origin)},close:function(){l("Closing HelloSign embedded iFrame");if(this.iframe){var self=this;if(this.cancelButton){this.wrapper.removeChild(this.cancelButton);this.cancelButton=null}this._fadeOutIFrame()}},_fadeOutIFrame:function _fadeOutIFrame(currentOpacity){var self=this;if(self.iframe){if(!currentOpacity){currentOpacity=1}else{currentOpacity-=.1}self.iframe.style.opacity=currentOpacity;self.iframe.style.filter="alpha(opacity="+parseInt(currentOpacity*100,10)+")";if(currentOpacity<=0){self.iframe.style.opacity=0;self.iframe.style.filter="alpha(opacity=0)";self.iframe.style.display="none";clearTimeout(animationTimer);if(self.overlay){self.container.removeChild(self.overlay)}self.container.removeChild(self.wrapper);self.wrapper.removeChild(self.iframe);self.overlay=null;self.iframe=null;self.wrapper=null;return false}var animationTimer=setTimeout(function(currentOpacity){return function(){self._fadeOutIFrame(currentOpacity)}}(currentOpacity),10)}},reportError:function(errorMessage,parentUrl){XWM.send({event:HelloSign.EVENT_ERROR,description:errorMessage},parentUrl)},ensureParentDomain:function(domainName,parentUrl,token,skipDomainVerification,callback){if(window.top==window){callback(true);return}if(typeof token!=="string"){error("Token not supplied by HelloSign. Please contact support.");return}if(typeof callback!=="function"){error("Callback not supplied by HelloSign. Please contact support.");return}if(skipDomainVerification===true){var warningMsg="Domain verification has been skipped. Before requesting approval for your app, please be sure to test domain verification by setting skipDomainVerification to false.";l(warningMsg);alert(warningMsg);callback(true)}else{XWM.receive(function _ensureParentDomainCallback(evt){if(evt.data.indexOf("helloback:")===0){var parts=evt.data.split(":");var valid=parts[1]==token;callback(valid)}},domainName)}XWM.send("hello:"+token,parentUrl)},getWindowDimensions:function(){var supportPageOffset=window.pageXOffset!==undefined;var isCSS1Compat=(document.compatMode||"")==="CSS1Compat";var scrollX=supportPageOffset?window.pageXOffset:isCSS1Compat?document.documentElement.scrollLeft:document.body.scrollLeft;var scrollY=supportPageOffset?window.pageYOffset:isCSS1Compat?document.documentElement.scrollTop:document.body.scrollTop;var dims;if(this.isOldIE){dims={width:document.body.clientWidth,height:document.body.clientHeight,scrollX:scrollX,scrollY:scrollY}}else{dims={width:window.innerWidth,height:window.innerHeight,scrollX:scrollX,scrollY:scrollY}}return dims},inArray:function(v,array){if(this.hasJQuery){return $.inArray(v,array)}else if(array){for(var i=0;i<array.length;i++){if(array[i]==v){return i}}}return-1},safeUrl:function(url){if(url){try{var el=document.createElement("div");el.innerHTML=url;var decodedUrl=el.innerText;if(!decodedUrl){url=url.replace(/\&amp\;/g,"&")}else{url=decodedUrl}}catch(e){l("Could not decode url: "+e)}}return url}};function error(message){if(typeof message!=="undefined"){if(window.console&&console.log){console.log(message)}else{alert(message)}}}function l(messageObj){if(HelloSign.isDebugEnabled&&typeof messageObj!=="undefined"&&window.console&&console.log){console.log(messageObj)}}window.HelloSign=HelloSign})();