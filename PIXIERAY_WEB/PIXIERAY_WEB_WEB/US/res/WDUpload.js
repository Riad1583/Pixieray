/*! 28.0.2.0 */
/*! VersionVI: 01F280051n   */
var WDUploadBase=function(){"use strict";function n(n,t,i,r,u){if(arguments.length){WDChamp.prototype.constructor.apply(this,arguments);var f=u[0],e=u[1];this.m_sFiltre=f;this.m_sAliasChampDragDrop=e;this.m_tabFiles=[];this.m_oStatusUpload=null;this.m_oStatusAvancement=null}}var i=function(){function n(n,t){arguments.length&&(WDDnDNatif.prototype.constructor.apply(this,[!1,!0,t,this.ms_nOperationLien+this.ms_nOperationCopie]),this.m_piDnDFichierCallback=n)}return n.prototype=new WDDnDNatif,n.prototype.constructor=n,n.prototype._oGetEventDataFiles=function(){return this._oGetEventData().files},n.prototype._vnGetOperationSurDrop=function(n){var t,i;if(bSfr&&(t=new RegExp("Version/\\s*(\\d+)\\.*(\\d+)").exec(navigator.userAgent),t&&t[1]&&parseInt(t[1],10)<6)||bIEQuirks||document.documentMode<10||this.m_piDnDFichierCallback.vbGrise())return this.ms_nOperationSans;if(n===this.ms_nDnDLacher){if(i=this._oGetEventDataFiles(),i&&(1===i.length||1<i.length&&this.m_piDnDFichierCallback.vbGetMultiFichiers()))return WDDnDNatif.prototype._vnGetOperationSurDrop.apply(this,arguments)}else if(this._bVerifieEventDataType("Files"))return WDDnDNatif.prototype._vnGetOperationSurDrop.apply(this,arguments);return this.ms_nOperationSans},n.prototype._vOnDrop=function(){WDDnDNatif.prototype._vOnDrop.apply(this,arguments);this.m_piDnDFichierCallback.vOnDropFichiers(this._oGetEventDataFiles())},n}(),t=function(){var n=function(){function n(n,t,i,r){if(arguments.length){this.m_piUploadFileCallback=n;this.m_oFichier=t;this.m_sURL=i;this.m_sURLMorceau=r;var u=this;this.m_fOnProgress=function(n){u.__OnProgress(n)};this.m_fOnReadyStateChange=function(n){u.__OnReadyStateChange(n)};this.m_nTailleEnvoyeePrecedentsMorceaux=0;this.m_nTailleEnvoyee=0;this.m_nTailleFichier=this.m_oFichier.size;this.m_nTailleMorceau=this.m_nTailleFichier}}return n.prototype._sGetUrl=function(){return this.vContinueEnvoiParMorceau&&this.m_nTailleEnvoyeePrecedentsMorceaux+t.TAILLE_MAX_MORCEAU<this.m_nTailleFichier?this.m_sURLMorceau:this.m_sURL},n.prototype._Upload=function(n,t){var i=new XMLHttpRequest;i.open("POST",this._sGetUrl(),!0);clWDUtil.bForEach(t,function(n){return i.setRequestHeader(n.sNom,n.sValeur),!0});i.onreadystatechange=this.m_fOnReadyStateChange;i.upload&&clWDUtil.AttacheDetacheEvent(!0,i.upload,"progress",this.m_fOnProgress);i.send(n)},n.prototype.__OnProgress=function(n){n.lengthComputable&&(this.m_nTailleEnvoyee=Math.min(n.loaded,this.m_nTailleFichier),this.m_piUploadFileCallback.vUploadFileAvancement(n,this.m_nTailleEnvoyeePrecedentsMorceaux+this.m_nTailleEnvoyee,this.m_nTailleFichier))},n.prototype.__OnReadyStateChange=function(n){var t,i,r;if(this.m_piUploadFileCallback.vUploadFileAvancement(n,this.m_nTailleEnvoyeePrecedentsMorceaux+this.m_nTailleEnvoyee,this.m_nTailleFichier),t=n.target,t.readyState===XMLHttpRequest.DONE){if(t.upload&&clWDUtil.AttacheDetacheEvent(!1,t.upload,"progress",this.m_fOnProgress),t.onreadystatechange=clWDUtil.m_pfVide,i=t.status,r=t.responseText,200===i){if(!clWDAJAXMain.bValideEtTraiteErreur(null,r,undefined))return}else{if(400<=i&&i<600){this.m_piUploadFileCallback.vUploadFileErreur(r,i,t.statusText);return}r=undefined}this.m_nTailleEnvoyeePrecedentsMorceaux+=this.m_nTailleMorceau;!this.vContinueEnvoiParMorceau||this.m_nTailleEnvoyeePrecedentsMorceaux>=this.m_nTailleFichier?this.m_piUploadFileCallback.vUploadFileFin(r,this.m_nTailleFichier):this.vContinueEnvoiParMorceau()}},n}();return window.FormData?function(){function i(){arguments.length&&(n.prototype.constructor.apply(this,arguments),this.vContinueEnvoiParMorceau())}return i.prototype=new n,i.prototype.constructor=i,i.prototype.vContinueEnvoiParMorceau=function(){var n=new FormData,r=t.TAILLE_MAX_MORCEAU,i=this.m_nTailleEnvoyeePrecedentsMorceaux+r,u=this.m_oFichier.size<=i;u&&(i=this.m_oFichier.size,r=i-this.m_nTailleEnvoyeePrecedentsMorceaux);this.m_nTailleMorceau=r;n.append("Filename",this.m_oFichier.name);n.append("FilePartBegin",this.m_nTailleEnvoyeePrecedentsMorceaux===0?"1":"0");n.append("FilePartEnd",u?"1":"0");n.append("Filedata",this.m_oFichier.size<t.TAILLE_MAX_MORCEAU?this.m_oFichier:this.m_oFichier.slice(this.m_nTailleEnvoyeePrecedentsMorceaux,i),this.m_oFichier.name);n.append("Upload","Submit Query");this._Upload(n,[])},i}():function(){function t(){var i,t;arguments.length&&(n.prototype.constructor.apply(this,arguments),i=this,this.m_fOnLoadFile=function(n){i.__OnLoadFile(n)},t=new FileReader,t.onload=this.m_fOnLoadFile,t.readAsArrayBuffer(this.m_oFichier))}return t.prototype=new n,t.prototype.constructor=t,t.prototype.ms_sBoundary="WDUpload",t.prototype.__OnLoadFile=function(n){var i=this.ms_sBoundary+(new Date).getTime(),u=function(n,t){var i=[];return i.push("--"),i.push(n),i.push("\r\n"),i.push('Content-Disposition: form-data; name="Filename"'),i.push("\r\n\r\n"),i.push(unescape(encodeURIComponent(t.name))),i.push("\r\n"),i.push("--"),i.push(n),i.push("\r\n"),i.push('Content-Disposition: form-data; name="Filedata"; filename="'),i.push(unescape(encodeURIComponent(t.name))),i.push('"'),i.push("\r\n"),i.push("Content-Type: application/octet-stream"),i.push("\r\n\r\n"),i.join("")}(i,this.m_oFichier),f=function(n){var t=[];return t.push("\r\n"),t.push("--"),t.push(n),t.push("\r\n"),t.push('Content-Disposition: form-data; name="Upload"'),t.push("\r\n\r\n"),t.push("Submit Query"),t.push("\r\n"),t.push("--"),t.push(n),t.push("--"),t.join("")}(i),e=new Uint8Array(n.target.result),o=u.length,s=o+e.length,h=s+f.length,t=new Uint8Array(h),r;this.__AjouteChaineDansUint8Array(t,0,u);this.__AjouteUint8Array(t,o,e);this.__AjouteChaineDansUint8Array(t,s,f);r=[{sNom:"Content-Type",sValeur:"multipart/form-data, boundary="+i}];bCrm||r.push({sNom:"Content-Length",sValeur:h});this._Upload(t.buffer,r)},t.prototype.__AjouteChaineDansUint8Array=function(n,t,i){this.__AjouteUint8Array(n,t,new Uint8Array(Array.prototype.map.call(i,function(n){return n.charCodeAt(0)&255})))},t.prototype.__AjouteUint8Array=function(n,t,i){n.set(i,t)},t}()}();return t.TAILLE_MAX_MORCEAU=5242880,n.prototype=new WDChamp,n.prototype.constructor=n,n.prototype.Init=function(){WDChamp.prototype.Init.apply(this,arguments);this.m_sAliasChampDragDrop&&(this.m_oDnDFichiers=new i(this,_JGE(this.m_sAliasChampDragDrop,document,!0,!1)))},n.prototype.vOnDropFichiers=function(n){this.vbGetMultiFichiers()||this.SupprimeTout();for(var i=n.length,t=0;t<i;t++)this.m_tabFiles.push(n[t]);this.OnChange()},n.prototype.vUploadFileAvancement=function(n,t,i){var r=this.m_oStatusUpload,u=r.m_nEnvoyeeFiles+t;this.__OnAvancement(u,r.m_nTailleFiles+r.m_nTailleFlash,t,i,r.m_nFichier)},n.prototype.vUploadFileFin=function(n,t){n&&(this.m_oStatusUpload.m_nEnvoyeeFiles+=t,this.m_oStatusUpload.m_nFichier++,this.__UploadFiles(n))},n.prototype.vUploadFileErreur=function(n,t,i){alert(STD_ERREUR_MESSAGE_UPLOAD+"\n"+(n||t+" "+i));this.OnFin("")},n.prototype.GetValeur=function(n,t,i){return WDChamp.prototype.GetValeur.apply(this,[n,this._vsGetFichiers(!1,!0,!0),i])},n.prototype.GetProp=function(n,t,i){switch(n){case this.XML_CHAMP_PROP_NUM_SOUSELEMENT:return this.__tabGetFichier(i-1)[0];case this.XML_CHAMP_PROP_NUM_OCCURRENCE:return this._vnGetOccurrence();default:return WDChamp.prototype.GetProp.apply(this,arguments)}},n.prototype.OnSubmit=function(){WDChamp.prototype.OnSubmit.apply(this,arguments)},n.prototype.Lance=function(){this.__Lance(clWDUtil.sConstuitProcedureParams(0,arguments))},n.prototype.__Lance=function(n){var t;if(0!==this._vnGetOccurrence()&&!this.__bGetUploadEnCours()){t=clWDUtil.sGetPageAction(null,!1,!0,!0);t=t+(t.indexOf("?")!==-1?"&":"?");var i="",r="&WD_BUTTON_CLICK_="+this.m_sAliasChamp,u=t+"WD_ACTION_=UPLOADFICHIER"+i+r,f;f=n!==undefined?t+"WD_ACTION_=UPLOADFICHIERFIN"+i+r+n:u;this.m_nReveilDernier=(new Date).getTime();this.m_sReveilURL=t+"WD_ACTION_=UPLOADREVEIL"+i+r;this.m_oStatusUpload={m_sURL:u,m_sURLFinale:f,m_nFichier:0,m_nTailleFiles:this.__nGetTailleTotale(this._vsGetFichiers(!0,!0,!1)),m_nTailleFlash:this.__nGetTailleTotale(this._vsGetFichiers(!0,!1,!0)),m_nEnvoyeeFiles:0};this.__UploadFiles()}},n.prototype.__UploadFiles=function(n){var t=this._vbUploadFiles();t||this.OnFin(n)},n.prototype._vbUploadFiles=function(){var n=this.m_oStatusUpload,i=this.m_oStatusUpload.m_nFichier,r=this.m_tabFiles,f,u;return i<r.length?(u=r.length,f=i===u-1&&u===this._vnGetOccurrence()?n.m_sURLFinale:n.m_sURL,new t(this,r[i],f,n.m_sURL),!0):!1},n.prototype.__nGetTailleTotale=function(n){var r=0,i,t,u,f;if(0<n.length)for(i=n.split("\r\n"),u=i.length,t=0;t<u;t++)f=i[t].split("\t"),r+=parseInt(f[1],10);return r},n.prototype.__tabGetFichier=function(n){var r=this._vsGetFichiers(!0,!0,!0),i=r.split("\r\n"),t;return n>=0&&n<i.length?(t=i[n].split("\t"),t[1]=parseInt(t[1],10),t):["",0]},n.prototype._vsGetFichiers=function(n,t){if(t){var i=[];return clWDUtil.bForEach(this.m_tabFiles,function(t){return i.push(t.name+(n?"\t"+t.size:"")),!0}),i.join("\r\n")}return""},n.prototype._vnGetOccurrence=function(){return this.m_tabFiles.length},n.prototype.__bGetUploadEnCours=function(){return!!this.m_oStatusUpload},n.prototype.nGetProgressData=function(n){var t=this.m_oStatusAvancement;if(t)switch(n){case 0:return t.m_nEnvoyee;case 1:return t.m_nTailleTotale;case 2:return t.m_nTailleFichierEnvoyee;case 3:return t.m_nFichierTaille;case 4:return t.m_nFichier}return 0},n.prototype.Supprime=function(n){this._vnSupprimeFichier(n)},n.prototype._vnSupprimeFichier=function(n){var t=this.m_tabFiles,i=n-1;return i<t.length?(t[i]=null,t.splice(i,1),this.OnChange(),-1):n-t.length},n.prototype.SupprimeTout=function(){this._vbSupprimeTousFichiers()&&this.OnChange()},n.prototype._vbSupprimeTousFichiers=function(){for(var i=!1,t=this.m_tabFiles,r=t.length,n=0;n<r;n++)t[n]=null,i=!0;return t.length=0,i},n.prototype.nGetUploadTailleFichier=function(n){return n||(n=1),this.__tabGetFichier(n-1)[1]},n.prototype.__OnAvancement=function(n,t,i,r,u){var f=(new Date).getTime(),o,e;this.m_nReveilDernier&&f-this.m_nReveilDernier>18e4&&(clWDUtil.PrechargeImage(this.m_sReveilURL+"&RAND="+Math.random()),this.m_nReveilDernier=f);o=this.m_oStatusUpload;e={m_nEnvoyee:n,m_nTailleTotale:t,m_nTailleFichierEnvoyee:i,m_nFichierTaille:r,m_nFichier:u+1};this.m_oStatusAvancement=e;this.RecuperePCode(this.ms_nEventNavUploadAvancement)();this.m_oStatusAvancement=null},n.prototype.OnChange=function(){this.RecuperePCode(this.ms_nEventNavUploadSelection)()},n.prototype.OnFin=function(n){this.SupprimeTout();this.m_oStatusUpload=null;clWDAJAXMain.eReponseGeneriqueDepuisTexte(n,_PAGE_,[]);this.RecuperePCode(this.ms_nEventNavUploadFin)()},n}(),WDUploadFlash=function(){"use strict";function n(){arguments.length&&(WDUploadBase.prototype.constructor.apply(this,arguments),this.m_oFlash=null)}return n.prototype=new WDUploadBase,n.prototype.constructor=n,n.prototype.Init=function(){WDUploadBase.prototype.Init.apply(this,arguments);this._InitFlash()},n.prototype._vLiaisonHTML=function(){WDUploadBase.prototype._vLiaisonHTML.apply(this,arguments);this.m_oFlash=this.oGetObjectEmbed(this.m_sAliasChamp,bIE)},n.prototype.OnDisplay=function(n,t){WDUploadBase.prototype.OnDisplay.apply(this,arguments);t&&this.m_oFlash&&clWDUtil.bEstFils(this.m_oFlash,n)&&(this._vLiaisonHTML(),bFF?this.m_oFlash.data=this.m_oFlash.data:bIEAvec11&&(undefined!==this.m_oFlash.src?this.m_oFlash.src=this.m_oFlash.src:(this.m_oFlash.outerHTML=this.m_oFlash.outerHTML,this.m_oFlash=this.oGetObjectEmbed(this.m_sAliasChamp,bIE))),this._InitFlash())},n.prototype._vsGetFichiers=function(n,t,i){var r=WDUploadBase.prototype._vsGetFichiers.apply(this,arguments),u;return i&&this.m_oFlash&&clWDUtil.bEstDisplay(this.m_oFlash,document,!0)&&(u=this.m_oFlash.sGetFichiers(n),0<u.length&&(0<r.length&&(r+="\r\n"),r+=u)),r},n.prototype._vnGetOccurrence=function(){return WDUploadBase.prototype._vnGetOccurrence.apply(this,arguments)+this.__nGetOccurrenceFlash()},n.prototype._vbUploadFiles=function(){var t=WDUploadBase.prototype._vbUploadFiles.apply(this,arguments),n;if(t)return!0;try{if(0<this.__nGetOccurrenceFlash())return n=this.m_oStatusUpload,this.m_oFlash.SetURLs(n.m_sURL,n.m_sURLFinale),this.m_oFlash.ActionUpload(),!0}catch(i){}return!1},n.prototype._vnSupprimeFichier=function(n){n=WDUploadBase.prototype._vnSupprimeFichier.apply(this,arguments);-1!==n&&this.m_oFlash&&this.m_oFlash.ActionSupprime(n+"")},n.prototype._vbSupprimeTousFichiers=function(){var n=WDUploadBase.prototype._vbSupprimeTousFichiers.apply(this,arguments);return this.m_oFlash&&(this.m_oFlash.ActionSupprimeTout(),n=!1),n},n.prototype.vbGetMultiFichiers=function(){return this.m_oFlash&&clWDUtil.bEstDisplay(this.m_oFlash,document,!0)?!!this.m_oFlash.bGetMultiFichiers():!1},n.prototype.vbGrise=function(){return!1},n.prototype._InitFlash=function(){this.nSetTimeout(this.__InitFlash,500);bWK&&(_PAGE_[this.m_sAliasChamp]=this.m_oFlash)},n.prototype.__InitFlash=function(){if(this.m_oFlash&&clWDUtil.bEstDisplay(this.m_oFlash,document,!0))try{this.m_oFlash.SetAlias(this.m_sAliasChamp);this.m_oFlash.SetFiltre(this.m_sFiltre)}catch(n){this.nSetTimeout(this.__InitFlash,500)}},n.prototype.__nGetOccurrenceFlash=function(){return this.m_oFlash&&clWDUtil.bEstDisplay(this.m_oFlash,document,!0)?parseInt(this.m_oFlash.nGetOccurrence(),10):0},n.prototype.OnAvancement=function(n,t,i,r,u){isNaN(n)&&(alert(STD_ERREUR_MESSAGE_UPLOAD),n=1);var f=this.m_oStatusUpload;f.m_nFichier=this.m_tabFiles.length+u;n+=f.m_nTailleFiles;this.nSetTimeoutUnique("__OnAvancement",clWDUtil.ms_oTimeoutImmediat,n,f.m_nTailleFiles+f.m_nTailleFlash,i,r,f.m_nFichier)},n}(),WDUpload=WDUploadFlash,WDUploadHTML5=function(){"use strict";function n(){if(arguments.length){WDUploadBase.prototype.constructor.apply(this,arguments);this.m_oButton=null;this.m_oInput=null;var n=this;this.m_pfOnChange=function(t){return n.__OnChange(t||event)}}}return n.prototype=new WDUploadBase,n.prototype.constructor=n,n.prototype._vLiaisonHTML=function(){var n,t;WDUploadBase.prototype._vLiaisonHTML.apply(this,arguments);this.m_oButton=this.oGetElementById(document,"");this.m_oInput=this.m_oButton.nextElementSibling;this.m_oInput&&(clWDUtil.AttacheDetacheEvent(!1,this.m_oInput,"change",this.m_pfOnChange,!1),clWDUtil.AttacheDetacheEvent(!0,this.m_oInput,"change",this.m_pfOnChange,!1),this.m_sFiltre&&(-1<this.m_sFiltre.indexOf("/")?n=this.m_sFiltre:(t=[],clWDUtil.bForEach(this.m_sFiltre.split("\r\n"),function(n){if(n){var i=n.split("\t")[1];i&&clWDUtil.bForEach(i.split(";"),function(n){return n&&(n=clWDUtil.sSupprimeEspacesDebutFin(n),"*"==n.charAt(0)&&(n=n.substr(1)),t.push(n)),!0})}return!0}),n=t.join(",")),n&&(this.m_oInput.accept=n)))},n.prototype.vbGetMultiFichiers=function(){return this.m_oInput?this.m_oInput.multiple:!1},n.prototype.vbGrise=function(){return this._bEstGrise(this.m_oButton)},n.prototype.OnClick=function(){this.m_oInput&&this.m_oInput.click()},n.prototype.__OnChange=function(n){var t=this.m_oInput;this.vOnDropFichiers(t.files);var u=this.m_oInput.nextElementSibling,r=this.m_oInput.parentNode,i=document.body.appendChild(document.createElement("form"));return t=i.appendChild(r.removeChild(t)),i.reset(),this.m_oInput=r.insertBefore(t,u),i.parentNode.removeChild(i),clWDUtil.bStopPropagationCond(n,!0)},n}()