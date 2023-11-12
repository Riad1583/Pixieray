// WDUtil.js
/*! 26.0.4.0 */
/*! VersionVI: yyyyyyyyyyyy */

// Attention a ne pas mettre d'accent dans le code, chaines incluses

///#DEBUG=clWDUtil.WDDebug

// Définition des globales définies dans :
// - La page
///#GLOBALS _AWPID_A_ _AWPID_P_ _bTable16_ _COL _GFI_A_ _GFI_T_ _WD_
// - StdAction.js
///#GLOBALS _JGE _JGEN
// - WDAJAX.js
///#GLOBALS clWDAJAXMain
// - WDChamp.js
///#GLOBALS WDChamp
// - WWConstanteX.js
///#GLOBALS STD_TITRE_TRACE STD_INFO_TRACE
///#GLOBALS STD_LUNDI STD_MARDI STD_MERCREDI STD_JEUDI STD_VENDREDI STD_SAMEDI STD_DIMANCHE
///#GLOBALS STD_JANVIER STD_FEVRIER STD_MARS STD_AVRIL STD_MAI STD_JUIN STD_JUILLET STD_AOUT STD_SEPTEMBRE STD_OCTOBRE STD_NOVEMBRE STD_DECEMBRE
///#GLOBALS STD_ERREUR_CHAMP_OBLIGATOIRE1 STD_ERREUR_CHAMP_OBLIGATOIRE2
///#GLOBALS tabWDErrors
// - Autres
///#GLOBALS SVGGraphicsElement

// Utilisation d'un objet comme espace de nommage
var clWDUtil = {};

//est une fonction
//la solution la plus performante
//source : http://jsperf.com/alternative-isfunction-implementations
clWDUtil.isFunction = function isFunction(object) {
	return !!(object && object.constructor && object.call && object.apply);
};

//est un objet
clWDUtil.isObject = function(obj)
{
	return obj instanceof Object && !clWDUtil.isArray(obj);
};

//est un array
clWDUtil.isArray = function(obj)
{
	return Object.prototype.toString.call(obj) === '[object Array]';
};

//parse en entier base 10
function parseInt10(x)
{
	return parseInt(x,10);
}

Math.log10 = function(x)
{
	return Math.log(x) / Math.LN10;
};

clWDUtil.bTestNav = function bTestNav(sTest)
{
	return -1 !== navigator.userAgent.toLowerCase().indexOf(sTest);
};

// Detection du navigateur

var bOpr = clWDUtil.bTestNav("opera");
// Cas particulier de Opera qui s'annonce par defaut comme IE
// !!!!!!!!!! On ne détecte pas IE11 comme IE en mode HTML5 !!!!!!!!!!
var bIE = (!bOpr) && (-1 != navigator.appName.indexOf("Microsoft"));
var nIE = 0;
var bIEQuirks = false;
var bIEQuirks9Max = false;
var bCompatMode = (document.compatMode == "BackCompat");
// !!!!!!!!!! On ne détecte pas IE11 comme IE en mode HTML5 !!!!!!!!!!
// On fait un cas particulier pour IE7
if (bIE)
{
	(function ()
	{
		"use strict";

		// GP 21/11/2012 : QW223239 : Mauvaise détection de la version de IE
		// Il faut (\\d+) pour matcher tous les caractères de la version et pas (\\d)+ matche chaque caractère et ne mémorise que le dernier (= les unités)
		var oRes = (new RegExp("MSIE (\\d+)[\\.\\d]*")).exec(navigator.userAgent);
		if (oRes && oRes[1])
		{
			nIE = parseInt(oRes[1], 10);
		}
	})();
	// Detecte le "quirks mode"
	bIEQuirks = bCompatMode;
	// Détecte le "quirks mode" en excluant IE10
	// GP 22/11/2012 : QW226462 : IE10 a deux modes quirks :
	// - Quirks : Fait les calculs en mode quirks mais se comporte comme une navigateur W3C autrement
	// - Quirks 5.5 : Fait comme les précédents navigateur
	// Donc il faut exclure IE10 sauf s'il est en mode Quirks5.5. Auquel cas document.documentMode est a 5 (au lieu de 10)
	bIEQuirks9Max = bIEQuirks && ((nIE < 10) || (document.documentMode < 6));
}
// GP 14/11/2013 : QW238935 : Détecte spécifiquement IE11 en HTML5
// => On garde bIE a FAUX (et nIE a 0) dans le cas IE11 en HTML5
var bIEAvec11 = bIE || (-1 != navigator.userAgent.indexOf("Trident/"));
// Détecte IE11 (en mode HTML5)
// GP 25/08/2015 : TB94028 : @@@ Ajouter MS Edge dans bIE11Plus ???
var bIE11Plus = bIEAvec11 && !bIE;
// GP 25/08/2015 : TB94028 : Détection de MS Edge
var bEdge = clWDUtil.bTestNav("edge/");

var bFF = clWDUtil.bTestNav("firefox/");
// Il faut chercher "chrome/" car sinon on trougve des faux positif (par exemple "chromeframe/")
// GP 07/04/2016 : TB97509 : Attention !!! Edge est détecté comme Chrome aussi !!!
var bCrm = clWDUtil.bTestNav("chrome/");
var bSfr = (!bCrm) && clWDUtil.bTestNav("safari");
var bMac = clWDUtil.bTestNav("mac");
var bWK = bCrm || bSfr;
// GP 26/03/2015 : QW256568 : Ajout de || window.navigator.msMaxTouchPoints || ('ontouchstart' in document.documentElement)
// => Mais uniquement avec IE pour ne pas avoir de faux positifs
var bTouchDesktop = bIEAvec11 && (!!window.navigator.msMaxTouchPoints || ('ontouchstart' in document.documentElement));
var bTouchMobile = clWDUtil.bTestNav("ipad") || clWDUtil.bTestNav("iphone") || clWDUtil.bTestNav("android");
var bTouch = bTouchDesktop || bTouchMobile;
// Si on a le doctype pour le HTML5
// GP 16/12/2015 : TB92050 : publicId est "" dans IE10
//clWDUtil.bHTML5 = (null != window.document.doctype) && (window.document.doctype.publicId == (bIE ? null : ""));
clWDUtil.bHTML5 = (null != window.document.doctype) && (window.document.doctype.publicId == ((bIE && (nIE < 10)) ? null : ""));

// Si on est dans une page statique
clWDUtil.bPageStatique = false;

clWDUtil.m_pfVide = function() { return true; };
clWDUtil.m_pfVideFalse = function() { return false; };
clWDUtil.m_pfIdentite = function() { return arguments[0]; };

// Code déplacé depuis WDxxxHTML. On veux exécuter ce code dans toutes les pages. Autant le mettre dans le .js qui est toujours inclus et pas dans chaque page.
// Blocage des événements pour le grisage.
!document.body/*pas de body si inclus dans le<head> pour CEF*/ || !document.body.addEventListener/*fonction et capture phase non disponibles en IE<9*/ || document.body.addEventListener("click", function (oEvent)
{
	for (var domParent = oEvent && oEvent.target; domParent && domParent !== document.body; domParent = domParent.parentNode)
	{
		// ignore tout ce qui est dans un champ grisé
		if ((' ' + domParent.className + ' ').indexOf(' wbgrise ') > -1)
		{
			oEvent.stopPropagation();
			oEvent.preventDefault();
			return;
		}
	}
	// Phase de capture (et pas bubbling)
}, true);

// Manipulation des Cookies : utilisation d'un objet comme espace de nommage
clWDUtil.m_oCookie = (function ()
{
	"use strict";

	var ms_sSeparateurCookie = ";";
	var ms_sSeparateurValeur = "=";

	// Ecrit un cookie, version interne
	function __SetCookie(sNom, sValeur, sExpiration, sChemin, sDomaine, bHTTPOnly, bSecure, bSameSiteStrict)
	{
		var tabCookie = [sNom + ms_sSeparateurValeur + encodeURIComponent(sValeur), "expires=" + sExpiration];
		if (undefined === sChemin)
		{
			sChemin = "/";
		}
		tabCookie.push("path=" + sChemin);
		// GP 16/10/2014 : QW247474 : Pour IE un domaine vide est mal interprété
		if ((undefined !== sDomaine) && ("" != sDomaine))
		{
			tabCookie.push("domain=" + sDomaine);
		}
		if (bHTTPOnly)
		{
			// Normalement impossible en JS
			tabCookie.push("httponly");
		}
		if (bSecure)
		{
			// Normalement impossible en JS
			tabCookie.push("secure");
		}
		if (bSameSiteStrict)
		{
			// Normalement impossible en JS
			tabCookie.push("samesite=Strict");
		}
		document.cookie = tabCookie.join("; ");
	}

	// Recupere le cookie
	return {
		GetCookie: function GetCookie(sNom, tabSuffixe)
		{
			sNom = clWDUtil.sSupprimeEspacesDebutFin(sNom);
			var sResultat = "";
			clWDUtil.bForEachThis(document.cookie.split(ms_sSeparateurCookie), this, function (sCookie)
			{
				// tabCookie = [ Nom, Valeur ]
				var tabCookie = sCookie.split(ms_sSeparateurValeur);
				tabCookie[0] = clWDUtil.sSupprimeEspacesDebutFin(tabCookie[0]);
				var sNomCookieSansSuffixe = tabCookie[0];
				if (tabSuffixe)
				{
					sNomCookieSansSuffixe = sNomCookieSansSuffixe.substr(0, sNom.length);
				}
				if (tabCookie[1] && (sNomCookieSansSuffixe == sNom))
				{
					if (tabSuffixe)
					{
						tabSuffixe[0] = tabCookie[0].substr(sNom.length);
					}
					sResultat = decodeURIComponent(tabCookie[1]);
					// Fin de la recherche
					return false;
				}
				// Continue la recherche
				return true;
			});
			return sResultat;
		},

		// Ecrit un cookie
		SetCookie: function SetCookie(sNom, sValeur, nExpiration, sChemin, sDomaine, nOptions)
		{
			__SetCookie(sNom, sValeur, clWDUtil.oDecaleDateJour(new Date(), (undefined !== nExpiration) ? nExpiration : 30).toGMTString(), sChemin, sDomaine, !!(nOptions & 0x1), !!(nOptions & 0x2), !!(nOptions & 0x4));
		},

		// Supprime un cookie
		ClearCookie: function ClearCookie(sNom, sChemin)
		{
			__SetCookie(sNom, "", "Fri, 02 Jan 1970 00:00:00 UTC", sChemin);
		}
	};
})();

// GP 31/05/2013 : QW231717 : Patch tous les liens de la page
clWDUtil.PatchURLDansLien = function PatchURLDansLien()
{
	var sURL = encodeURIComponent(window.location.href);
	var sURLD = encodeURIComponent(window.location.protocol + "//" + window.location.host + "/");
	this.bForEach(document.getElementsByTagName("a"), function(oLienA)
	{
		// GP 07/04/2015 : TB88144 : Ne rien faire si le href n'existe pas.
		// On teste le cas vide (si l'attribut href n'existe pas, on reçoit une chaîne vide comme valeur)
		// Si la valeur est vide il n'y a rien a patcher (car la valeur vide ne matche aucune des deux expressions rationnelles
		var sHRef = oLienA.href;
		if (sHRef.length)
		{
			// GP 04/06/2013 : QW232824 : Ajout de URLD()
			sHRef = sHRef.replace(/URL\(\)/, sURL);
			// GP 04/06/2013 : QW232824 : Ajout de URLD()
			oLienA.href = sHRef.replace(/URLD\(\)/, sURLD);
		}
		return true;
	});
};

// Gestion des timeouts
clWDUtil.ms_oTimeoutImmediat = {};
clWDUtil.ms_nTimeoutImmediatForceAncien = (bWK ? 200 : 1);
clWDUtil.ms_nTimeoutNonImmediat20 = (bWK ? 300 : (bFF ? 100 : 20));
clWDUtil.ms_nTimeoutNonImmediat100 = (bWK ? 300 : 100);
clWDUtil.nSetTimeout = function nSetTimeout(fFonction, oDelai)
{
	if (this.ms_oTimeoutImmediat === oDelai)
	{
		// setTimeout de 1 fonctionne partout sauf avec webkit
		if (bWK && window.MessageChannel)
		{
			var oCanal = new MessageChannel();
			oCanal.port1.onmessage = fFonction;
			oCanal.port2.postMessage(null);
			return oCanal;
		}
		else
		{
			oDelai = 1;
		}
	}
	return setTimeout(fFonction, oDelai);
};
clWDUtil.ClearTimeout = function ClearTimeout(oTimeout)
{
	// Si on est passé par un objet, on le recoit dans nTimeout
	if (typeof oTimeout == "number")
	{
		clearTimeout(oTimeout);
	}
	else
	{
		// Annule la fonction de réception (nTimeout est en fait un MessageChannel)
		oTimeout.port1.onmessage = null;
	}
};

// Clone un objet pour pouvoir le surcharger (utilisé avec les events)
clWDUtil.oCloneObjet = function oCloneObjet(oObjetSource, oSurcharge)
{
	function fClone(oSurcharge)
	{
		for (var sMembre in oSurcharge)
		{
			this[sMembre] = oSurcharge[sMembre];
		}
	};

	// Il faut faire la surcharge avant car avec les objets système ensuite c'est impossible (on n'arrive pas a écrire dans la copie pour les propriétés natives)
	var oClone = new fClone(oSurcharge);
	fClone.prototype = oObjetSource;

	return oClone;
};

// Pour le champ galerie d'images : le cache des IDs.
// oGetImageInformations complete le contenu et le retourne. Trois utilisations sont donc possibles :
// <IDs connus> = clWDUtil.oGetImageInformations()
// clWDUtil.oGetImageInformations(<Nouveaux IDs>)
// <IDs connus et nouveaux> = clWDUtil.oGetImageInformations(<Nouveaux IDs>)
clWDUtil.oGetImageInformations = (function ()
{
	"use strict";

	var oGaleriesIDs = {};

	// Complète le cache des IDs du champ galerie d'images
	return function(oGaleriesIDsSupplementairesOuUndefined)
	{
		// Pas besoin de filtrer la valididté de oGaleriesIDsSupplementairesOuUndefined, for (var x in y) gère les cas undefined/null/{}/....
		this.bForEachIn(oGaleriesIDsSupplementairesOuUndefined, function(sCle, oValeur)
		{
			oGaleriesIDs[sCle] = oValeur;
			return true;
		});

		return oGaleriesIDs;
	};
})();

// Numero du bouton gauche de la souris
clWDUtil.nBoutonGauche = ((bIEQuirks9Max || (bIE && (document.documentMode < 9))) ? 1 : 0);
clWDUtil.bValideBouton = function bValideBouton(oEvent)
{
	// GP 25/04/2013 : TB82167 : Firefox n'envoie pas le onmouseup dans certains cas.
	// On perd donc le fait que le bouton a été relaché.
	// Avec event.button on ne distingue pas le cas "sans boutons", du cas "bouton gauche" (les deux à zéro)
	// Ajout d'un test sur .buttons (dispo depuis FF15)
	// GP 26/08/2013 : TB82167 : Sauf que which ne fonctionne pas bein (retourne toujours 1 même sans boutons enfoncé)
	// => Filtre le cas .buttons avec bFF pour ne gérer le cas que dans le cas de Firefox.
	// GP 27/08/2013 : TB83686 : Ne teste .buttons que dans le cas de FF non touch.
	// GP 27/06/2014 : Buttons fonctionne avec IE11+
//	// GP 13/05/2013 : Sauf que cela ne fonctionne pas avec IE >= 9 en mode IE9
//	// On utilise which (non standard) si disponible
//	if (undefined !== oEvent.which)
//	{
//		return 1 == oEvent.which;
//	}
//	else if (undefined !== oEvent.buttons)
	if (this.bEventEstTouch(oEvent))
	{
		return oEvent.touches.length <= 1;
	}
	else if ((bFF || bIE11Plus) && (undefined !== oEvent.buttons))
	{
		return 0 !== (oEvent.buttons & 1);
	}
	else
	{
		return oEvent.button === clWDUtil.nBoutonGauche;
	}
};

// Indique si un événement est un événement tactile ou de la souris
// => OPTIM : Jamais si on n'a pas TouchEvent
clWDUtil.bEventEstTouch = ("undefined" == typeof TouchEvent) ? clWDUtil.m_pfVideFalse : function (oEvent)
	{
		return oEvent instanceof TouchEvent;
	};

(function ()
{
	// GP 24/09/2018 : QW303532 : Pas de "use strict" car on utilise "arguments.callee".
//	"use strict";

	// Factorisation de code entre nSourisPosX et nSourisPosY
	function __nSourisPosXY(oEvent, nOption, sWidthHeight, sLeftTop, sXY)
	{
		// GP 27/01/2015 : TB90988 : regarde si le premier paramètre de notre parent n'est pas un evenement (car de SourisPosX/SourisPosY dans un traite par JSEvenement)
		if (!oEvent)
		{
			var oArgumentsParent = arguments.callee.caller.caller.arguments;
			if (oArgumentsParent && oArgumentsParent.length)
			{
				var oPremierParametre = oArgumentsParent[0];
				// GP 19/05/2015 : QW257929 : x instanceof Event ne fonctionne pas en HTML4 avec IE (Event n'est pas défini)
				// => Teste la validité de oPremierParametre puis par instanceof si possible sinon teste la présence de srcElement
				// Si le test avec instanceof est possible on ne fait pas le test avec srcElement en cas d'échec
				if (oPremierParametre && ((window["Event"] && (oPremierParametre instanceof Event)) || ((!window["Event"]) && oPremierParametre.scrElement)))
				{
					oEvent = oPremierParametre;
				}
			}
		}
		if (oEvent)
		{
			// Selon les coordonnees demandes
			switch (nOption)
			{
			case 0:
				// Dans le repere de la page
				// Calcul de scrollLeft/scrollTop selon le navigateur et le mode de compatibilite
				// GP 12/06/2014 : nGetBordurePage n'inclus pas ce test : (window.parent == window). L'inclure ?
				return (bIE ? ((document.documentElement["client" + sWidthHeight] ? document.documentElement : document.body)["scroll" + sLeftTop]) : window["page" + sXY + "Offset"]) - clWDUtil.nGetBordurePage(false) + oEvent["client" + sXY];

			case 1:
				// Dans le repere de l'ecran
				return oEvent["screen" + sXY];

			case 2:
				// Dans le repere du champ qui a lance l'evenement
				// Code inspiré de WDDragBase.prototype.oGetOffsetElementSiAutre
				// GP 27/02/2018 : TB92881 : offsetX et offsetY fonctionnent toujours en HTML5 et donnent la bonne coordonnée (= par rapport au champ qui a l'evénement enregistré).
				var bUtiliseOffsetXY = clWDUtil.bHTML5 || bIE;
				// GP 20/03/2019 : TB112590 : Les valeurs lues sont fausses dans Edge si on est dans un SVG et que l'élément cliqué est un élément de SVG.
				// - SVGGraphicsElement n'existe pas dans IE
				if (((bEdge && oEvent.target instanceof SVGGraphicsElement) || (bIEAvec11 && oEvent.target.ownerSVGElement)) && (oEvent.target !== oEvent.currentTarget))
				{
					bUtiliseOffsetXY = false;
				}
				if (bUtiliseOffsetXY)
				{
					var nOffsetXY = oEvent["offset" + sXY];
					if (undefined !== nOffsetXY)
					{
						return nOffsetXY;
					}
				}
				// GP 14/10/2014 : QW249726 : Sauf que l'on a alors des régressions dans le DnD : je fait une fonction spéciale pour SourisPosX/SourisPosY
				// GP 01/04/2019 : L'utilisation du scroll sur le body ne correspond qu'a certains cas (body en quirks). Utilisation de clWDUtil.nGetBoundingClientRectLeft et de
				// clWDUtil.nGetBoundingClientRectTop qui gèrent le cas.
//				return clWDUtil["nGetBodyScroll" + sLeftTop]() + oEvent["client" + sXY] - clWDUtil.oGetOriginalTarget2(oEvent).getBoundingClientRect()[sLeftTop.toLowerCase()];
				return oEvent["client" + sXY] - clWDUtil["nGetBoundingClientRect" + sLeftTop](clWDUtil.oGetOriginalTarget2(oEvent), false, true);
			}
		}

		// Pas d'evenement ou option invalide => Renvoie zero
		return 0;
	}
	// Ex OBJ_SourisPosX
	clWDUtil.nSourisPosX = function nSourisPosX(oEvent, nOption)
	{
		return __nSourisPosXY(oEvent, nOption, "Width", "Left", "X");
	};
	// Ex OBJ_SourisPosY
	clWDUtil.nSourisPosY = function nSourisPosY(oEvent, nOption)
	{
		return __nSourisPosXY(oEvent, nOption, "Height", "Top", "Y");
	};
})();

// Gestion de la touche entrée
clWDUtil.bOnKeyPressPage = (function ()
{
	"use strict";

	function __pfTrouveBouton(oEvent, oSource, tabBoutons)
	{
		// Précalcul : gestion dans les ZRs : si le nom est au format des attributs de ZR
		var tabRes = [];
		var bEstAttributZR = clWDUtil.bEstAliasAttributZR(oSource, tabRes);
		var pfFonction;
		clWDUtil.bForEach(tabBoutons, function (oBouton)
		{
			// Si le bouton correspond
			if ((!clWDUtil.bForEach(oBouton.tabValidation, function (oValidation)
			{
				if (oSource.name == oValidation.sAlias)
				{
					// Trouvé : fin de la recherche
					return false;
				}
				// sAliasZR est maintenant un alias de table ou de ZR. On ne renomme pas car c'est un argument transmis.
				if (bEstAttributZR && oValidation.sAliasZR && (tabRes[1] == oValidation.sAlias))
				{
					// Fixe le numéro de ligne de la ZR
					// Il fautdrait gérer le cas des ZRs AJAX (+ navigateur) et les notifier avec la bonne méthode ?
					if (window._PAGE_[oValidation.sAliasZR])
					{
						window._PAGE_[oValidation.sAliasZR].value = tabRes[0];
					}
					// Trouvé : fin de la recherche
					return false;
				}
				// GP 21/07/2015 : QW260092 : Il manquait le "return true;" ici
				return true;
			})) || oBouton.bEntree)
			{
				// Trouvé : fin de la recherche
				pfFonction = oBouton.pfFonction;
				return false;
			}
			return true;
		});
		return pfFonction;
	}

	return function (tabParentArguments, oParentThis, tabBoutonsPages, oBoutonsPopups)
	{
		var oEvent = tabParentArguments[0];
		var oSource = this.oGetOriginalTarget(oEvent);
		// Si on est bien sur la page
		if (((oSource.form == undefined) || (oSource.form == window._PAGE_)) && !this.bBaliseEstTag(oSource, "textarea") && (13 == oEvent.keyCode))
		{
			var pfFonction;
			// Trouve si on est dans une popup
			if (this.bForEachIn(oBoutonsPopups, function (sAliasPopup, oBouton)
			{
				// Qui est visible
				if (clWDUtil.m_oDialogues[sAliasPopup])
				{
					pfFonction = __pfTrouveBouton(oEvent, oSource, oBouton);
					if (pfFonction)
					{
						// Trouvé : fin de la recherche
						return false;
					}
				}
				return true;
			}))
			{
				// Si la boucle se termine, c'est que l'on n'a pas trouvé : recherche dans la page
				pfFonction = __pfTrouveBouton(oEvent, oSource, tabBoutonsPages);
			}
			if (pfFonction)
			{
				pfFonction.apply(oParentThis, tabParentArguments);
				return clWDUtil.bStopPropagation(oEvent);
			}
		}
	};
})();

// Teste si un champ est sur un attribut de ZR et reoturne le numéro de ligne (tabRes[0]) est le nom de l'attribut (tabRes[1])
clWDUtil.bEstAliasAttributZR = (function ()
{
	"use strict";

	var ms_oRegExpAlias = new RegExp("zrl_(\\d+)_([A-Za-z0-9-_\\:\\.]+)", "");

	return function (oElement, tabRes)
	{
		// Si on est dans un champ formulaire, le nom de l'element est de la forme "zrl_LIGNE_ATTRIBUT"
		var sElementNom = oElement.name;
		var oRes;
		if (sElementNom && sElementNom.length && (oRes = ms_oRegExpAlias.exec(sElementNom)) && oRes[1] && oRes[2])
		{
			tabRes[0] = parseInt(oRes[1], 10);
			tabRes[1] = oRes[2];
			return true;
		}
		else
		{
			return false;
		}
	};
})();

// Manipule les tag en forme normalise (normalement inutile sur les navigateurs recents)
clWDUtil.sGetTagName = function sGetTagName(oBalise)
{
	// GP 19/03/2014 : Ajout de "oBalise && "
	if (oBalise && oBalise.tagName)
	{
		return oBalise.tagName.toLowerCase();
	}
	else
	{
		return "";
	}
};
// Indique si la balise est du bon type
clWDUtil.bBaliseEstTag = function bBaliseEstTag(oBalise, sTag)
{
	return this.sGetTagName(oBalise) === sTag;
};

// Retourne une propriete de la balise body
clWDUtil.__nGetBodyPropriete = function __nGetBodyPropriete(oDocument, sPropriete)
{
	// Calcule si on favorise oDocument.documentElement ou oDocument.body

	// GP 06/03/2014 : QW243144 : Bug en migration de l'algo précédent
	// Algo (initial) (dans l'ordre de priorité) :
	// bIE && (oDocument.documentMode >= 7)		=> document.documentElement
	//		(Pour IE9 en mode IE7)
	// bIEQuirks9Max							=> document.body
	// bCompatMode								=> document.body
	//		(GP 28/03/2013 : TB81810/TB81799/TB81112 : En mode BackCompat, il faut bien inverser)
	// Autres									=> document.documentElement
	//		(GP 23/11/2012 : Inversion pour le HTML5 ou oDocument.documentElement[sPropriete] est plus fiable)

	// GP 17/02/2014 : Simplification : Pour avoir bIEQuirks/bIEQuirks9Max, on doit avoir bCompatMode, donc il suffit de faire un seul cas.
	// Algo (dans l'ordre de priorité) :
	// bIE && (oDocument.documentMode >= 7)		=> document.documentElement
	// bCompatMode								=> document.body
	// Autres									=> document.documentElement

	// GP 17/02/2014 : QW242656 : Dans certains cas (ascenseur vertical forcé sur la page), IE se comporte comme en quirks...
	// bIE11Plus && ("scroll" == clWDUtil.oGetCurrentStyle(oDocument.body).overflowY) => document.body
	// bIE && (oDocument.documentMode >= 7)		=> document.documentElement
	// bCompatMode								=> document.body
	// Autres									=> document.documentElement

	// GP 19/05/2015 : QW257598 : Très bizarre, le code pour QW242656 n'a plus aucun effet sur QW242656 mais donne un résultat erroné pour QW257598
	// => Supprime ce code
//	if (	(bIE11Plus && ("scroll" == clWDUtil.oGetCurrentStyle(oDocument.body).overflowY))
//		||	(!(bIE && (oDocument.documentMode >= 7)) && bCompatMode))
	if (!(bIE && (oDocument.documentMode >= 7)) && bCompatMode)
	{
		return oDocument.body[sPropriete] || oDocument.documentElement[sPropriete];
	}
	else
	{
		return oDocument.documentElement[sPropriete] || oDocument.body[sPropriete];
	}
};
// Calcule une dimension
// !!! Utilisé par le code du GFI de PageAfficheDialogue
// GP 17/07/2015 : QW258341 : Nouvel algo dans le redimensionnement, on n'a plus besoin de ses valeurs
//clWDUtil.__sGetBodyScrollOffsetPx = function __sGetBodyScrollOffsetPx(oDocument, sDimension, nValInit)
clWDUtil.__sGetBodyScrollOffsetPx = function __sGetBodyScrollOffsetPx(oDocument, sDimension)
{
	var nDimension = this.__nGetBodyPropriete(oDocument, "scroll" + sDimension);
	// GP 17/07/2015 : QW258341 : Nouvel algo dans le redimensionnement, on n'a plus besoin de ses valeurs
//	if (undefined !== nValInit)
//	{
//		nDimension = Math.min(nDimension, nValInit);
//	}
	return Math.max(nDimension, this.__nGetBodyPropriete(oDocument, "client" + sDimension)) + "px";
};

(function ()
{
	"use strict";

	// GP 26/11/2012 : Ici il faudrait changer l'algo
	//Pour avoir le pageXOffset sous IE selon les cas (code de https://developer.mozilla.org/en/DOM/window.scrollX)
	//var x = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
	//var y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	// Sauf que peut-être cela change le résultat pour les appelant qui compensent déjà donc a bien tester
	function __nGetBodyScroll(bLeft)
	{
		// GP 17/02/2014 : QW242656 : Dans certains cas (ascenseur vertical forcé sur la page), IE se comporte comme en quirks...
		if ((bIE && (nIE < 9)) || bIEQuirks || (bIE11Plus && ("scroll" == clWDUtil.oGetCurrentStyle(document.body).overflowY)))
		{
			return bLeft ? document.body.scrollLeft : document.body.scrollTop;
		}
		else
		{
			return bLeft ? window.pageXOffset : window.pageYOffset;
		}
	};
	// Retourne le scrollLeft du document
	clWDUtil.nGetBodyScrollLeft = function nGetBodyScrollLeft()
	{
		return __nGetBodyScroll(true);
	};
	clWDUtil.nGetBodyScrollTop = function nGetBodyScrollTop()
	{
		return __nGetBodyScroll(false);
	};
})();

// GP 22/11/2013 : QW239688 : Récupère la bordure de la page pour les calculs UNIQUEMENT en :
// - IE quirks
// - Mode de compat 16 (= sans zoning)
// GP 09/11/2012 : Pas besoin de lire document.body.clientLeft/document.body.clientTop. http://msdn.microsoft.com/en-us/library/ms536433(v=vs.85).aspx indique que le décalage est toujours de 2px
clWDUtil.nGetBordurePage = (bIEQuirks && _bTable16_) ? function nGetBordurePage(bSansBordure)
	{
		// GP 12/06/2014 : nGetBordurePage n'inclus pas ce test : (window.parent == window). L'inclure ?
		return !bSansBordure ? 2 : 0;
	} : function nGetBordurePage(/*bSansBordure*/)
	{
		return 0;
	};

(function ()
{
	function __nCorrigeAvecScroll(oElement, bAvecScroll)
	{
		// On ne prend pas le scroll si on demande le document le parent car le calcul en tient DEJA compte en mode standard
		if (oElement && (oElement == oElement.ownerDocument.body))
		{
			// GP 17/02/2014 : QW242656 : Dans certains cas (ascenseur vertical forcé sur la page), IE se comporte comme en quirks...
			if (bIEQuirks || (bIE11Plus && ("scroll" == clWDUtil.oGetCurrentStyle(oElement.ownerDocument.body).overflowY)))
			{
				// Quirks, sur le body la valeur reçue ne tient pas compte du scroll
				//	- Pas de scroll : oElement.getBoundingClientRect().Xxx => 0, clWDUtil.nGetBodyScrollXxx() => 0
				//	- Scroll : oElement.getBoundingClientRect().Xxx => 0, clWDUtil.nGetBodyScrollXxx() => x
				return bAvecScroll ? -1 : 0;
			}
			else
			{
				// Non Quirks, sur le body la valeur reçue tient compte du scroll
				//	- Pas de scroll : oElement.getBoundingClientRect().Xxx => 0, clWDUtil.nGetBodyScrollXxx() => 0
				//	- Scroll : oElement.getBoundingClientRect().Xxx => -x, clWDUtil.nGetBodyScrollXxx() => x
				return bAvecScroll ? 0 : 1;
			}
		}
		else
		{
			return bAvecScroll ? 1 : 0;
		}
	}

	// Retourne les dimensions d'un éléments dans la page en tenant compte de la bordure dans IE en mode quirks
	clWDUtil.nGetBoundingClientRectLeft = function nGetBoundingClientRectLeft(oElement, bAvecScroll, bSansBordure)
	{
		if (oElement)
		{
			return oElement.getBoundingClientRect().left - this.nGetBordurePage(bSansBordure) + __nCorrigeAvecScroll(oElement, bAvecScroll) * this.nGetBodyScrollLeft();
		}
		else
		{
			return 0;
		}
	};
	clWDUtil.nGetBoundingClientRectTop = function nGetBoundingClientRectTop(oElement, bAvecScroll, bSansBordure)
	{
		if (oElement)
		{
			return oElement.getBoundingClientRect().top - this.nGetBordurePage(bSansBordure) + __nCorrigeAvecScroll(oElement, bAvecScroll) * this.nGetBodyScrollTop();
		}
		else
		{
			return 0;
		}
	};
})();

// Précharge une image
clWDUtil.PrechargeImage = function PrechargeImage(oCheminOuTableauChemin)
{
	// Tableau ?
	switch (typeof oCheminOuTableauChemin)
	{
	case "object":
		// GP 29/06/2012 : Il ne faudrait pas utiliser Array.isArray ? A tester
//		if (Array.isArray(oTableau))
		this.bForEachIn(oCheminOuTableauChemin, function (sChemin, oChemin)
		{
			// Appel récursif
			clWDUtil.PrechargeImage(oChemin);
			return true;
		});
		break;
	case "string":
		(new Image()).src = oCheminOuTableauChemin;

		// Rien dans les autres cas
	}
};
// Trouve le chemin d'une image ou d'une image par defaut du repertoire res
// L'appel implique la generation de _WD_
// Précharge systématiquement l'image
clWDUtil.sCheminImageRes = function sCheminImageRes(sImage, sImageDefaut, bSansPrecharge)
{
	var sCheminImage;
	// Si on a une image
	if (sImage)
	{
		sCheminImage = sImage;
	}
	else
	{
		// Sinon prend l'image par defaut
		// GP 27/03/2013 : QW231480 : Si on a _WDR_, c'est que l'on est dans une page statique/AWP/PHP : l'utilise
		sCheminImage = (window["_WDR_"] ? _WDR_ : _WD_) + "res/" + sImageDefaut;
	}

	// Préchargement si demandé
	if (!bSansPrecharge)
	{
		this.PrechargeImage(sCheminImage);
	}
	return sCheminImage;
};
// Trouve le chemin d'une image
clWDUtil.sGetCheminImage = function sGetCheminImage(sImage, sImageDefaut, bPourCSS)
{
	// Tient compte de la valeur par défaut
	sImage = String(sImage) || sImageDefaut;
	// Si on a une image
	if (sImage)
	{
		// Si c'est une data URI : retourne la valeur à l'identique
		if ("data:" == sImage.substr(0, 5))
		{
			return sImage;
		}
		// Si on est pour du CSS ignore toutes les valeur qui ne sont pas une image
		if (bPourCSS && (sImage.match(/^\s*[a-z\-]+\(/)))
		{
			return sImage;
		}

		// On chercher a savoir s'il faut localiser l'image dans le répertoire _WEB. Par défaut oui sauf si :
		// - Le chemin commence par data: (data URI) (déjà testé ci dessus)
		// - Le chemin commence par xxx:// (URL complète)
		// - Le chemin commence par // (URL sans le protocole)
		// - Le chemin commence par / (chemin absolue dans le serveur courant)
		// - _WDR_ est présent :

		// GP 11/02/2014 : QW242506 : _WD_ est probablement faux en PHP/statique (par rapport à AWP)
		// Pour corriger simplement on détecte la pésence de _WDR_
		// Le test de // est fusionné avec le test de /
		// OPTIM : inverse l'ordre des test : place les tests les plus rapide en premier
		if (("/" != sImage.charAt(0)) && (!window["_WDR_"]) && (!sImage.match(/^[a-z]+\:\/\//)) /*&& (!bCommencePar(sImage, "//"))*/)
		{
			sImage = _WD_ + sImage;
		}
	}

	// Ajoute le url() si demandé
	if (bPourCSS)
	{
		// sGetURICSS tient compte du chemin vide
		return this.sGetURICSS(sImage);
	}
	else
	{
		return sImage;
	}
};

// Descend vers les fils si le champ est constitué d'un conteneur (avec l'id) et d'un champ image interne => c'est le cas des modes homothétiques navigateur
// GP 18/09/2018 : QW301668 : Si l'image est invalide (= ne se charge pas), le code de onload du champ image ne se déclenche pas. Ce qui fait que l'ID n'est pas déplacé, donc le ..firstChild est faux
// dans ce cas. On est donc obligé de passer par une fonction utilitaire qui distingue les deux cas.
clWDUtil.oGetImageDeuxNiveaux = function oGetImageDeuxNiveaux(oBaliseImage)
{
	if ("img" == this.sGetTagName(oBaliseImage))
	{
		return oBaliseImage;
	}
	else
	{
		// GP 30/09/2020 : QW329642 : A cause de la mise en forme du HTML, la première balise fille est parfoirs du texte (les tabulations)
		// => Il faut les ignorer et prend la "vraie" première balise : utilise firstElementChild et pas firstChild.
		// Sauf que firstElementChild n'est pas disponible, avec IE8- : utilise children[0].
		return oBaliseImage.children[0];
	}

};

// Sens de lecture
clWDUtil.bRTL = ((bIE ? document : document.documentElement).dir == "rtl");
if (clWDUtil.bRTL)
{
	clWDUtil.GetStyleLeft = function GetStyleLeft(oStyle) { return oStyle.right; };
	clWDUtil.SetStyleLeft = function SetStyleLeft(oStyle, nVal, nOffset) { oStyle.right = (nVal - nOffset) + "px"; };
}
else
{
	clWDUtil.GetStyleLeft = function GetStyleLeft(oStyle) { return oStyle.left; };
	clWDUtil.SetStyleLeft = function SetStyleLeft(oStyle, nVal, nOffset) { oStyle.left = (nVal + nOffset) + "px"; };
}

// Fonction
clWDUtil.oGetTarget = function oGetTarget(oEvent)
{
	// Retourne target en priorité :
	// - IE en mode HTML 5
	// - les autres navigateurs (HTML 5 ou pas HTML 5)
	// Sinon retourne srcElement (IE ne mode pas HTML5)
	return oEvent.target || oEvent.srcElement;
};
clWDUtil.oGetOriginalTarget = (bFF && !bWK) ? function (oEvent)
	{
		return oEvent.explicitOriginalTarget;
	} : clWDUtil.oGetTarget;

// GP 14/10/2014 : QW248891 : Ajout de oEvent.currentTarget
// GP 14/10/2014 : QW249726 : Sauf que l'on a alors des régressions dans le DnD : je fait une fonction spéciale pour SourisPosX/SourisPosY
// GP 13/09/2017 : TB105129 : Ajout de oEvent.currentTarget aussi dans le cas Firefox dans la fonction spéciale pour SourisPosX/SourisPosY
clWDUtil.oGetOriginalTarget2 = function(oEvent) { return oEvent.currentTarget || clWDUtil.oGetOriginalTarget(oEvent); };

if (bIE && ((nIE < 8) || bIEQuirks))
{
	clWDUtil.sGetDisplayBlock = function sGetDisplayBlock(/*oBalise*/)
	{
		return "block";
	};
}
else
{
	clWDUtil.sGetDisplayBlock = function sGetDisplayBlock(oBalise)
	{
		switch (this.sGetTagName(oBalise))
		{
		case "table": return "table";
		case "tr": return "table-row";
		case "td": return "table-cell";
		default: return "block";
		}
	};
}

clWDUtil.sGetDisplayPourAffiche = function sGetDisplayPourAffiche(oBalise, bAffiche, bVideSiAffiche)
{
	if (bAffiche)
	{
		if (bVideSiAffiche)
		{
			return "";
		}
		else
		{
			return this.sGetDisplayBlock(oBalise);
		}
	}
	else
	{
		return "none";
	}
};

clWDUtil.SetDisplay = function SetDisplay(oBalise, bAffiche, bVideSiAffiche)
{
	if (oBalise && oBalise.style)
	{
		oBalise.style.display = this.sGetDisplayPourAffiche(oBalise, bAffiche, bVideSiAffiche);
	}
};

clWDUtil.bEstDisplay = function bEstDisplay(oElement, oDocument, bTestHidden)
{
	function VerificationDisplay(oCurrentStyle)
	{
		return "none" === oCurrentStyle.display;
	}
	function VerificationVisibility(oCurrentStyle)
	{
		return "hidden" === oCurrentStyle.visibility;
	}
	function VerificationDisplayEtVisibility(oCurrentStyle)
	{
		return ("none" === oCurrentStyle.display) || ("hidden" === oCurrentStyle.visibility);
	}

	// GP 02/05/2017 : QW286851 : Blindage du cas null : retourne true (c'est le comportement antérieur <= même si cela semble une mauvaise idée)
	if (oElement)
	{
		var pfFonctionVerification = null;
		// GP 27/04/2017 : OPTIM : pas besoin de faire l'itération. Si l'élément ou un de ses parents est display:none, oElement.offsetParent retourne null
		var oElementOffsetParent = oElement.offsetParent;
		if (null === oElementOffsetParent)
		{
			// oElement.offsetParent retourne null : l'élément ou un de ses parents est display:none
			return false;
		}
		// GP 09/04/2018 : TB108089 : IE10- (même en mode HTML5) : retourne le body comme offsetParent même si l'élément est invisible. On doit donc faire l'ancien code.
		// Note : bIE n'inclus pas IE11.
		else if (bIE || (undefined === oElementOffsetParent))
		{
			// GP 04/05/2017 : Vu par GF : offsetParent n'est pas disponible sur les éléments SVG. En fait il n'est disponible que sur les "HTMLElement".
			// Element sans offsetParent : exécute l'ancien algo.
			pfFonctionVerification = bTestHidden ? VerificationDisplayEtVisibility : VerificationDisplay;
		}
		else if (bTestHidden)
		{
			pfFonctionVerification = VerificationVisibility;
		}

		if (pfFonctionVerification)
		{
			// On doit en revanche faire la boucle dans le cas bTestHidden
			var oBody = oDocument.body;
			while (oElement && (oElement != oBody))
			{
				var oCurrentStyle = this.oGetCurrentStyle(oElement);
				if (pfFonctionVerification(oCurrentStyle))
				{
					return false;
				}
				oElement = oElement.parentNode;
			}
		}
	}
	// Visible
	return true;
};

// Trouve la valeur pour écrire dans la propriété ..Visible du WL : conversion d'une valeur depuis le WL vers une valeur compatible avec la propriété DOM
// générée pour ..Visible en LValue
clWDUtil.sGetVisibility = function sGetVisibility(oValeur, eDisplay)
{
	var bValeur;

	// Cas des chaines
	if(typeof oValeur == "string")
	{
		// Test les valeurs natives : on teste toutes les valeurs possibles (pour le cas ou l'on affecte entre display et visibility)
		switch (oValeur.toLowerCase())
		{
		// Les cas visibility que l'on considère comme visible en WL
		case "inherit":
		case "visible":
		// Les cas display que l'on considère comme affichée (il y en a d'autres)
		case "table":
		case "table-row":
		case "table-cell":
		// Valeur bool en texte
		case "1":
		case "true":
		// Autres cas => visible
		default:
			bValeur = true;
			break;
		case "hidden":
		case "none":
		case "0":
		case "false":
		// Test de la chaine vide => Faux
		case "":
			bValeur = false;
			break;
		}
	}
	else
	{
		bValeur = !!oValeur;
	}

	switch (eDisplay)
	{
	case 0:
		// CConversionN1::CTypeValueSimple::STYLE_VISIBLE_VISIBILITY
		return bValeur ? "inherit" : "hidden";
	case 1:
		// CConversionN1::CTypeValueSimple::STYLE_VISIBLE_DISPLAY
		// GP 15/03/2016 : Plus aucun oElement n'était généré lors de l'appel depuis plusieurs version (!!!)
//		// Fonctionne même si oElement n'est pas valide (prend alors "block")
//		return this.sGetDisplayPourAffiche(oElement, bValeur, false);
		return this.sGetDisplayPourAffiche(undefined, bValeur, false);
	case 2:
		// CConversionN1::CTypeValueSimple::STYLE_VISIBLE_DISPLAY_VIDE
		return this.sGetDisplayPourAffiche(undefined, bValeur, true);
	}
};

// Indique si un élément est dans un plan
clWDUtil.bDansPlan = function bDansPlan(oElement)
{
	var oBody = document.body;
	while (oElement && (oElement != oBody))
	{
		if (this.bAvecClasse(oElement, "wbPlanConteneur"))
		{
			return true;
		}
		oElement = oElement.parentNode;
	}
	return false;
};

// Indique si un element est dans un plan masqué
clWDUtil.bDansPlanMasque = function bDansPlanMasque(oElement)
{
	var oBody = document.body;
	while (oElement && (oElement != oBody))
	{
		// GP 06/04/2017 : Ce code est probablement faux. Un champ multiplan n'est pas dans un plan. Et n'a donc pas de parent wbPlan.
		// Il faudra dans ce cas améliorer le code car la déctection des éléments multiplan ne semble pas simple
		if (this.bAvecClasse(oElement, "wbPlan") && !this.bAvecClasse(oElement, "wbActif"))
		{
			return true;
		}
		oElement = oElement.parentNode;
	}
	return false;
};

clWDUtil.GetDimensionPxPourStyle = function GetDimensionPxPourStyle(nDimension)
{
	return (0 < nDimension) ? (nDimension + "px") : "0";
};
clWDUtil.SetDimensionPxStyle = function SetDimensionPxStyle(nDimension, oElement, sPropriete)
{
	oElement.style[sPropriete] = this.GetDimensionPxPourStyle(nDimension);
};
clWDUtil.SetDimensionPxPourTable = (function ()
{
	"use strict";

	if (clWDUtil.bHTML5)
	{
		return clWDUtil.SetDimensionPxStyle;
	}
	else
	{
		return function SetDimensionPxPourTable(nDimension, oElement, sPropriete)
		{
			oElement[sPropriete] = nDimension;
		};
	}
})();
// Ex JS_ConvPropHauteurLargeur
// Affecte la valeur dans les champs intermédiaires
clWDUtil.sGetLargeurHauteurPourSet = function sGetLargeurHauteurPourSet(nDimension, oElement, bHauteur)
{
	var sPropriete = bHauteur ? "height" : "width";

	// Remonte les parents jusqu'au DIV et affecte la taille au DIV et TABLE
	var oParent = oElement.parentNode;
	while (oParent && (oParent != document.body))
	{
		switch (this.sGetTagName(oParent))
		{
			case "table":
				this.SetDimensionPxPourTable(nDimension, oParent, sPropriete);
				// Pas de break
			default:
				oParent = oParent.parentNode;
				break;
			case "div":
				this.SetDimensionPxStyle(nDimension, oParent, sPropriete);
				// Si l'ID commence par un dz on continue a remonter
				if (oParent.id.substring(0, 2) != "dz")
				{
					oParent = null;
				}
				else
				{
					oParent = oParent.parentNode;
				}
				break;
		}
	}

	// Affecte la taille au fils
	// GP 06/05/2016 : TB86687 : Le fils n'existe pas toujours en HTML5
	// GP 17/05/2016 : QW273048 : En HTML5, on ne fixe rien (utilisation de style height sur la table)
	var tabFils = oElement.getElementsByTagName("TD");
	var oTDFils = tabFils[0];
	// GP 17/05/2016 : QW273048 : En HTML5, si c'est la seule cellule et que le parent est la table, on ne fixe rien.
	// GP 24/05/2016 : QW273048 : La détection avec la taille du tableau est erronée, on trouve aussi les fils dans le fils
	// => Ajout d'un test sur le fait que oTDFils est le seul fils.
	// Note : ce n'est peut-être pas encore un test parfait puisque si l'on peux peut-être trouver d'autres fils ?
	if (oTDFils && !(clWDUtil.bHTML5 && ((1 === tabFils.length) || ((null === oTDFils.previousElementSibling) && (null === oTDFils.nextElementSibling)))))
	{
		this.SetDimensionPxPourTable(nDimension, oTDFils, sPropriete);
	}
	return this.GetDimensionPxPourStyle(nDimension);
};

// GP 11/07/2017 : Plus utilisé car on n'a plus besoin de préfixer les divers styles CSS utilisés (disponible sans préfixe depuis 2011/2012)
//clWDUtil.m_sPrefixeCSS = (bFF ? "-moz-" : (bWK ? "-webkit-" : ""));

if (!bIE)
{
	// GP 02/11/2013 : TB84367 : Ce code est inutile dans les nouvelles versions de opéra
	if (bOpr && (function ()
	{
		"use strict";

		// GP 21/11/2012 : QW223239 : Mauvaise détection de la version de IE
		// Il faut (\\d+) pour matcher tous les caractères de la version et pas (\\d)+ matche chaque caractère et ne mémorise que le dernier (= les unités)
		var oRes = (new RegExp("Version/\\s*(\\d+)\\.*(\\d+)")).exec(navigator.userAgent);
		return oRes && oRes[1] && (parseInt(oRes[1], 10) < 12);
	})())
	{
		// Contournement pour createContextualFragment avec opera (perd les attributs de la racine dans certains cas)
		// Ne marche que s'il n'y a qu'un fils
		clWDUtil.oCreateContextualFragment = function oCreateContextualFragment(oRange, sHTML)
		{
			var sNode = "div";
			// GP 01/02/2013 : Si on donne un tr ou un td rien ne marche, il faut le bon parent
			if (sHTML.substr(0, 3) == "<tr")
			{
				sNode = "tbody";
			}
			if (sHTML.substr(0, 3) == "<td")
			{
				sNode = "tr";
			}

			var oDiv = document.createElement(sNode);
			oDiv.innerHTML = sHTML;
			return oDiv.children[0];
		};
	}
	else
	{
		clWDUtil.oCreateContextualFragment = function oCreateContextualFragment(oRange, sHTML) { return oRange.createContextualFragment(sHTML); };
	}
	clWDUtil.oCreateContextualFragmentSelonElement = function oCreateContextualFragmentSelonElement(oElement, sHTML)
	{
		// Pour les autres navigateur
		var oRange = document.createRange(); // Pas disponible pour IE donc pas d'unification possible
		oRange.setStartBefore(oElement);
		return this.oCreateContextualFragment(oRange, sHTML);
	};
}

// Evaluation de JSON
// Quadn JSON.parse n'est pas disponible (IE 7- et et IE en mode quirks), on utilise eval, il faut que le JS soit d'une source sure
clWDUtil.oEvalJSON = function oEvalJSON(sJSON, oValeurSiVide)
{
	if (0 < sJSON.length)
	{
		// GP 12/11/2013 : Impossible pour le moment, on ne génère pas du JSON valide
//		if (JSON && JSON.parse)
//		{
//			return JSON.parse(sJSON);
//		}
//		else
//		{
			return eval("(" + sJSON + ")");
//		}
	}
	else
	{
		return oValeurSiVide;
	}
};

// Conversion d'une valeur en booléen, et gère les booléens dans une chaine
clWDUtil.bCastToBoolAvecChaine = function bCastToBoolAvecChaine(oValeur)
{
	return (false != oValeur) && ("false" != oValeur);
};

// Indique si la valeur est une chaine non vide
// Rejete TOUTES les valeurs non chaines et les chaines vides
clWDUtil.bEstChaineNonVide = function bEstChaineNonVide(oValeur)
{
	return ("string" === typeof oValeur) && !!oValeur;
};

// Calcule le message d'erreur de champ obligatoire
clWDUtil.sGetErreurChampObligatoire = function sGetErreurChampObligatoire(sLibelleEdition, sAlias)
{
	// Retourne le libellé (non HTML) d'un champ : ne fonctionne que dans des cas particuliers.
	function __sGetLibelle(sLibelleEdition, sAlias)
	{
		// Tente de trouver le champ et son libellé.
		var oLibelle = document.getElementById("lz" + sAlias);
		return (oLibelle && clWDUtil.sGetInnerText(oLibelle)) || sLibelleEdition;
	}

	var sLibelle = __sGetLibelle(sLibelleEdition, sAlias);

	// Nouveau WDConstanteXxx.js
	var sMessage = tabWDErrors[617];
	if (sMessage)
	{
		return sMessage.replace("%1", sLibelle);
	}
	else
	{
		return STD_ERREUR_CHAMP_OBLIGATOIRE1 + sLibelle + STD_ERREUR_CHAMP_OBLIGATOIRE2;
	}
};

// Retourne le .innerText d'un élément
clWDUtil.sGetInnerText = function sGetInnerText(oBalise)
{
	// GP 20/11/2019 : QW320138 : Dans le cas d'un attribut de table/zone répétée navigateur, ici on reçoit directement la valeur.
	if ("string" === typeof oBalise)
	{
		return oBalise;
	}

	if (bIE)
	{
		// IE ne quirks transforme les balises semantiques inconnue en deux balises
		// On détecte les balises DispHTMLUnknownElement par la propriété canHaveChildren
		// (et en plus, lire le contenu d'une balise qui ne peut pas avoir de fils n'est pas très logique)
		if (oBalise.canHaveChildren === false)
		{
			oBalise = oBalise.parentNode;
		}
		// IE => innerText
		return oBalise.innerText;
	}
	else
	{
		// Autres => il faut parcourir les noeuds
		// Récursivement car maintenant avec les balises sémantiques, on peut avoir plusieurs niveaux : <td id="A1"><time>13/12/2017</time></td>
		return (function __sGetContenu(oRacine)
		{
			var oFils = oRacine.firstChild;
			var sContenu = "";
			while (oFils)
			{
				if (oFils.nodeName === "#text")
				{
					// GP 15/09/2020 : QW328901 : Avec la mise en forme des balises, il faut supprimer les espaces en début et en fin.
					// Et injecter un espacement en cas de concaténation ???
					sContenu += clWDUtil.sSupprimeEspacesDebutFin(oFils.textContent);
				}
				else if (clWDUtil.bBaliseEstTag(oFils, "br"))
				{
					sContenu += "\r\n";
				}
				else
				{
					sContenu += __sGetContenu(oFils);
				}
				oFils = oFils.nextSibling;
			}
			return sContenu;
		})(oBalise);
	}
};

// Recupere le HTML dans un commentaire HTML
clWDUtil.sGetHTMLDansCommentaire = (function ()
{
	"use strict";

	// GP 16/11/2012 : QW226140 : on doit gérer les autres cas pour les ZRs navigateur
	var ms_tabRemplaceCommentaires = [
		[/\[%COMMENT%\]/g, "<!-- -->"],
		[/\[%COMMENT\_DEBUT(\_SANS\_FIN)?%\]/g, "<!--"],
		[/\[%COMMENT\_FIN(\_SANS\_DEBUT)?%\]/g, "-->"],
		[/\[%\_COMMENT\_IF\_IE\_DEBUT\_%\]/g, "<!--[if "],
		[/\[%\_COMMENT\_IF\_IE\_FIN\_%\]/g, "]>"],
		[/\[%\_COMMENT\_ENDIF\_IE\_%\]/g, "<![endif]-->"]
	];

	return function (oConteneur)
	{
		var tabHTML = [];

		// Et lit la valeur de la balise commentaire
		var i;
		var nLimiteI = oConteneur.childNodes.length;
		var oTBody;
		for (i = 0; i < nLimiteI; i++)
		{
			var oFils = oConteneur.childNodes[i];
			// Si c'est la balise commentaire
			if (oFils.nodeName == "#comment")
			{
				tabHTML.push(oFils.nodeValue);
			}
			else if (oFils.nodeName == "!")
			{
				// Cas special pour IE5.5
				var sValeur = String(oFils.text);
				// Supprime le <!-- initial et le --> final
				tabHTML.push(sValeur.substr(4, sValeur.length - 7));
			}
			else if (this.bBaliseEstTag(oFils, "tbody"))
			{
				oTBody = oFils;
			}
		}

		// Si on est dans une balise table, pour etre W3C, il y a un <tr><td></td></tr> + commentaire
		// Certains navigateur ajoutent le tbody et place le commentaires dans le tbody
		if ((tabHTML.length == 0) && oTBody)
		{
			return this.sGetHTMLDansCommentaire(oTBody);
		}
		else
		{
			// Remplace maintenant les commentaires
			var sHTML = tabHTML.join("");
			clWDUtil.bForEach(ms_tabRemplaceCommentaires, function (tabRemplaceUnCommentaire)
			{
				sHTML = sHTML.replace(tabRemplaceUnCommentaire[0], tabRemplaceUnCommentaire[1]);
				return true;
			});
			return sHTML;
		}
	};
})();

// Récupère la droite d'une chaine
clWDUtil.sDroite = function sDroite(sChaine, nLongueur)
{
	return sChaine.substr(sChaine.length - nLongueur);
};

// Supprime les espaces d'une chaine
clWDUtil.sSupprimeEspaces = (function ()
{
	"use strict";

	var ms_oRegExpEspaces = new RegExp("\\s", "g");

	return function (sValeur, sRemplace)
	{
		return sValeur.replace(ms_oRegExpEspaces, sRemplace || "");
	};
})();
// Supprime les espaces en debut et en fin
clWDUtil.sSupprimeEspacesDebutFin = (function ()
{
	"use strict";

	// GP 02/10/2014 : \s inclus déjà \r et \n (mais pas \b). Sauf que \b est backspace pas la tabulation (\t) et que \t est inclus dans \s
//	var ms_oRegExpEspacesDebutFin = new RegExp("[\\s\\r\\n\\b]*([^\\s\\r\\n\\b]*([\\s\\r\\n\\b]*[^\\s\\r\\n\\b]+)*)[\\s\\r\\n\\b]*", "");
	var ms_oRegExpEspacesDebutFin = new RegExp("\\s*([^\\s]*(\\s*[^\\s]+)*)\\s*", "");
	var ms_oRegExpEspacesDebut = new RegExp("^\\s*", "");
	var ms_oRegExpEspacesFin = new RegExp("\\s*$", "");

	return function (sValeur, bConserveEspacesDebut, bConserveEspacesFin)
	{
		sValeur = String(sValeur);
		if (!bConserveEspacesDebut && !bConserveEspacesFin)
		{
			return sValeur.replace(ms_oRegExpEspacesDebutFin, "$1");
		}
		else if (bConserveEspacesFin)
		{
			return sValeur.replace(ms_oRegExpEspacesDebut, "");
		}
		else if (bConserveEspacesDebut)
		{
			return sValeur.replace(ms_oRegExpEspacesFin, "");
		}
		else
		{
			return sValeur;
		}
	};
})();
// Supprime les espaces au milieu mais pas en début ni en fin

clWDUtil.sSupprimeEspacesInterieur = (function ()
{
	"use strict";

	var ms_oRegExpExtractionEspacesDebut = new RegExp("^(\\s*)[^\\s].*", "");
	var ms_oRegExpExtractionEspacesFin = new RegExp(".*[^\\s](\\s*)$", "");
	var ms_oRegExpExtractionEspacesMilieu = new RegExp("\\s", "g");

	return function (sValeur)
	{
		// On en sait pas le faire avec une seule expression régulière
		return sValeur.replace(ms_oRegExpExtractionEspacesDebut, "$1") + sValeur.replace(ms_oRegExpExtractionEspacesMilieu, "") + sValeur.replace(ms_oRegExpExtractionEspacesFin, "$1");
	};
})();


(function ()
{
	"use strict";

	var ms_oRegExpNonDigit = new RegExp("[^0-9]", "g");

	function __sCompleteEntierChaine(sValeur, nTailleMin)
	{
		for (var i = nTailleMin - sValeur.length; 0 < i; i--)
		{
			sValeur = "0" + sValeur;
		}
		return sValeur;
	}

	// Complete un entier par des zéro au debut
	clWDUtil.sCompleteEntier = function (nValeur, nTailleMin)
	{
		// GP 25/04/2014 : QW244935 : Retour au code précédent. Si on recoit un entier sous forme de chaine, isNaN retourne vrai et donc on perd la valeur de l'entier.
//		var sValeur = isNaN(nValeur) ? "0" : String(nValeur);
		return __sCompleteEntierChaine(String(nValeur), nTailleMin);
	};
	clWDUtil.sCompleteEntierChaine = function (sValeur, nTailleMin)
	{
		// Remplaces les caractères non alpha numériques par des 0
		sValeur = sValeur.replace(ms_oRegExpNonDigit, "0");
		return __sCompleteEntierChaine(sValeur, nTailleMin);
	};
})();

// Complete une chaine
clWDUtil.sCompleteChaine = function sCompleteChaine(sValeur, nTailleMin, sCaractere)
{
	sValeur = String(sValeur);
	while (sValeur.length < nTailleMin)
	{
		sValeur += sCaractere;
	}
	return sValeur;
};
// Complete une chaine comme le WL (= donne une chaine de exactement nTailleCible caracteres)
clWDUtil.sCompleteWL = function sCompleteWL(sValeur, nTailleCible, sCaractere)
{
	return this.sCompleteChaine(sValeur, nTailleCible, sCaractere).substring(0, nTailleCible);
};

// Ajoute au debut d'une URI
// sPrefixe est generalement le repertoire _WEB
clWDUtil.sCompleteURI = function sCompleteURI(sPrefixe, sURI)
{
	// GP 02/05/2017 : Accepte aussi "data:"
	if ((sURI.substr(0, 5) == "http:") || (sURI.substr(0, 6) == "https:") || (sURI.substr(0, 5) == "data:") || (sURI.substr(0, sPrefixe.length) == sPrefixe))
	{
		return sURI;
	}
	else
	{
		return sPrefixe + sURI;
	}
};

// GP 14/03/2018 : Déplacement de JSI_NumericToWL et JSI_WLToNumeric depuis le wwjs_script.fic.
// Conversion d'une valeur (numérique) en chaîne pour le WL avec le bon séparateur décimal.
clWDUtil.sNumeriqueVersWL = function sNumeriqueVersWL(oValeur, sSeparateur)
{
	var dValeur = parseFloat(oValeur);
	if (isNaN(dValeur))
	{
		return "";
	}
	return String(dValeur).replace(/\./g, sSeparateur);
};
// Conversion d'une valeur (numérique) du WL avec le bon séparateur décimal vers un numérique.
clWDUtil.sWLVersNumerique = function sWLVersNumerique(oValeur, sSeparateur)
{
	if ("number" == typeof oValeur)
	{
		return oValeur;
	}
	else
	{
		// Conversion en chaine, filtre les caractères invalides et conversion finale en nombre
		var sValeur = String(oValeur).replace(/./g, function (sCaractere)
		{
			if (sCaractere == sSeparateur)
			{
				return ".";
			}
			else if ((('0' <= sCaractere) && (sCaractere <= '9')) || ('+' == sCaractere) || ('-' == sCaractere))
			{
				return sCaractere;
			}
			else
			{
				return "";
			}
		});
		if (sValeur.length)
		{
			return parseFloat(sValeur);
		}
		else
		{
			return 0;
		}
	}
};

// oChaineVersNumerique
// ------------------------------------------------------------------------------------------------
// Entrees :
//		sValeur		: Chaine a transforemr en nombre
// Sortie :
// 	Un nombre (nombre natif JS ou Numérique si besoin)
clWDUtil.oChaineVersNumerique = function oChaineVersNumerique(oValeur)
{
	// GP 01/10/2016 : TB99726 : Le comportement du WL est :
	// - Ignore tout les espaces au début (et ici à la final mais cela n'a pas d'importance pour le parsing)
	// - D'arreter l'analyse au premier espace qui reste (forcément au milieu) : on a le même résultat en remplacant les espaces par "_" pour bloquer le parsing
	oValeur = this.sSupprimeEspaces(this.sSupprimeEspacesDebutFin(String(oValeur)), "_");

	// Tente une conversion par parseFloat
	var dValeur = parseFloat(oValeur);
	if (isNaN(dValeur))
	{
		// La valeur n'est pas un nombre : aucune conversion ne fonctionnera
		return 0;
	}
	var sValeur = String(oValeur);
	// Normalement la génération a inclus WDLangage.js sur l'appel de la fonction WL "Val"
	if (window.clWLangage && (sValeur != String(dValeur)))
	{
		// GP 19/05/2016 : TB97513 : Utilisation des numériques dans Val pour ne pas perdre de précision inutilement
		// Deux possibilités :
		// - La valeur a été convertie mais AVEC perte de précision
		// - La valeur contient un nombre suivi de caractères invalides pour un nombre
		// => On ne distingue par les deux cas et on passe par un numérique
		// Normalement la génération a inclus
		// GP 20/05/2016 : Vu par le test auto des fonctions navigateur ("Test Code navigateur") : Val n'accepte pas "," comme séparateur alors que la conversion des numériques l'accepte.
		// => Remplace les "," par un "|" pour être sur de ne pas le parser
		// Le remplacement par un espace ne fonctionne pas car l'analyse dans WDNumerique supprime les espaces.
		return new clWLangage.WDNumerique(sValeur.replace(/,/g, "|"), 0, 0)
	}
	else
	{
		// Deux possibilités :
		// - La valeur a été convertie en nombre sans perte de précision (vérifier par un retour en chaine)
		// - clWLangage.WDNumerique n'est pas disponible (c'est un bug)
		return dValeur
	}
};

// NumeriqueVersChaine
// ------------------------------------------------------------------------------------------------
// Entrees :
//		oValeur		: valeur numerique a formater
//		sFormat		: chaine decrivant le format a employer
// Sortie :
// 	Une chaine de caracteres contenant le nombre formate
clWDUtil.sNumeriqueVersChaine = function sNumeriqueVersChaine(oValeur, sFormat)
{
	// Déclare les fonctions
	// GP 03/09/2015 : TB94226 : Ajout de bValeurNegative : si on formate un nombre dans ]-1, 0[, la partie entière est 0 qui si le signe n'est pas forcé est affiché comme 0 et pas -0
	function _NVC(bCadrageGauche, bSigne, bZero, nTaille, nPrecision, bMillier, bMajuscule, oValeur, bValeurNegative, nBase)
	{
		// On commence par prendre la valeur entiere positive du nombre
		var sResultat = clWDUtil.oAbsolue(clWDUtil.oArrondi(oValeur)).toString(nBase);

		// On va ajouter les separateurs de millier
		if (bMillier)
		{
			var tabRes = [];
			for (var i = 0; i < Math.ceil(sResultat.length / 3); i++)
			{
				tabRes.unshift(sResultat.substring(sResultat.length - (3 * (i + 1)), sResultat.length - (3 * i)));
			}
			sResultat = tabRes.join(" ");
		}

		// La taille cible est de un de moins si on ajoute le signe
		if (bSigne || bValeurNegative)
		{
			nTaille--;
		}

		// On va maintenant ajouter les zéros si on n'a pas atteint la taille requise
		if ((!bCadrageGauche) && bZero)
		{
			while (sResultat.length < nTaille)
			{
				// Si on a demande le cadrage a droite, on ajoute soit des zeros...
				// On continue de respecter la regle des separateurs de milliers
				if (bMillier && ((sResultat.length % 4) == 3))
				{
					// Si c'est le dernier caractere, on ne l'ajoute pas. Le cadrage final le rajoutera (et cela evite de devoir en tenir compte pour le signe, dans _NVC_e et dans _NVC_f
					if (sResultat.length == (nTaille - 1))
					{
						break;
					}
					sResultat = " " + sResultat;
				}
				else
				{
					sResultat = "0" + sResultat;
				}
			}
		}

		// On ajoute ensuite le signe
		if (bSigne || bValeurNegative)
		{
			// On insere le signe
			sResultat = (bValeurNegative ? "-" : "+") + sResultat;
		}

		return sResultat;
	};
	function _NVC_e(bCadrageGauche, bSigne, bZero, nTaille, nPrecision, bMillier, bMajuscule, oValeur, bValeurNegative/*, nBase*/)
	{
		// On calcule l'exposant
		var nExp = clWDUtil.nLog10Arrondi(clWDUtil.oAbsolue(oValeur));

		// On prépare l'exposant pour connaitre sa taille et la déduire de nTaille
		// On ajoute un zéro si nExp est dans ] 10, 10 [
		var sExposant = ["e", (0 <= nExp) ? "+" : "-", (Math.abs(nExp) < 10) ? "0" : "", Math.abs(nExp)].join("");

		// On formate le numerique compris dans [0..1[
		var sResultat = _NVC_f(bCadrageGauche, bSigne, bZero, Math.max(0, nTaille - sExposant.length), nPrecision, bMillier, bMajuscule, clWDUtil.oDivision(oValeur, Math.pow(10, nExp)), bValeurNegative);

		// Pas besoin de supprimer les espaces à droite, il n'y en a pas (ils n'ont pas encore été ajoutés)

		// On ajoute l'exposant
		sResultat += sExposant;

		return sResultat;
	}

	function _NVC_f(bCadrageGauche, bSigne, bZero, nTaille, nPrecision, bMillier, bMajuscule, oValeur, bValeurNegative/*, nBase*/)
	{
		// On applique le numerique vers chaine des entiers sur la partie entiere
		var sResultat = _NVC(bCadrageGauche, bSigne, bZero, nTaille - (nPrecision + 1), nPrecision, bMillier, bMajuscule, clWDUtil.nArrondiVersZero(oValeur), bValeurNegative, 10);

		// Pas besoin de supprimer les espaces à droite ou à gauche, il n'y en a pas (ils n'ont pas encore été ajoutés)

		// On colle la partie decimale
		if (0 < nPrecision)
		{
			// On arrondi la partie décimale à la précision demandée
			var oAbsValeur = clWDUtil.oAbsolue(oValeur);
			var sPartieDecimale = String(clWDUtil.oArrondi(clWDUtil.oSoustraction(oAbsValeur, clWDUtil.nArrondiVersZero(oAbsValeur)), nPrecision));
			// On retire "0."
			sPartieDecimale = sPartieDecimale.substring(2, sPartieDecimale.length);

			// On complete la partie decimale par des zeros jusqu'a la precision voulue et tronque si on a trop de caractère (normalement non car on calculé la précision)
			sResultat += "." + clWDUtil.sCompleteWL(sPartieDecimale, nPrecision, "0");
		}

		return sResultat;
	}

	// Gere le cas des numériques spécifiquement (évite de couteuse et multiples conversions en chaines)
	switch (this.oGetTypeEntendu(oValeur))
	{
	case 5: // WLT_UI8
	case 9: // WLT_I8
	case 13: // WLT_DECIMAL
	// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//	case 14: // WLT_UIX
		break;
	default:
		// Si la valeur passee n'est pas un nombre, on la retourne telle quelle
		if (isNaN(oValeur))
		{
			return oValeur;
		}
		break;
	}
	var bValeurNegative = this.bEstNegatif(oValeur);

	// Premiere partie : on analyse la chaine de format
	var nParsingDebut = 0;
	var nParsingFin = sFormat.length - 1;

	// On recherche le flag de cadrage
	var bCadrageGauche = (sFormat.charAt(nParsingDebut) == "-");
	if (bCadrageGauche)
	{
		nParsingDebut++;
	}

	// On recherche le flag de signe
	var bSigne = (sFormat.charAt(nParsingDebut) == "+");
	if (bSigne)
	{
		nParsingDebut++;
	}

	// On recherche le flag de zero
	var bZero = (sFormat.charAt(nParsingDebut) == "0");
	if (bZero)
	{
		nParsingDebut++;
	}

	// On recherche le flag de milliers (accepte s et S)
	var bMillier = (sFormat.charAt(nParsingFin).toLowerCase() == "s");
	if (bMillier)
	{
		nParsingFin--;
	}

	// On extrait le type
	var pfFonction;
	var nBase; // Peut rester "undefined"
	var sType = sFormat.charAt(nParsingFin);
	var sTypeMinuscule = sType.toLowerCase();
	var nPrecisionForce; // Peut rester "undefined"
	switch (sTypeMinuscule)
	{
	case "d":
		pfFonction = _NVC;
		nBase = 10;
		break;
	case "e":
		pfFonction = _NVC_e;
		// GP 15/05/2016 : TB98167 : Les format "e" et "f" impliquent une précision de 6 chiffres par défaut
		nPrecisionForce = 6;
		break;
	case "f":
		pfFonction = _NVC_f;
		// GP 15/05/2016 : TB98167 : Les format "e" et "f" impliquent une précision de 6 chiffres par défaut
		nPrecisionForce = 6;
		break;
	case "o":
		pfFonction = _NVC;
		nBase = 8;
		break;
	case "x":
		pfFonction = _NVC;
		nBase = 16;
		break;
	default:
		// Si le type n'existe pas, on sort de la fonction
		return "";
	}
	nParsingFin--;
	var bMajuscule = (sType != sTypeMinuscule);

	// Supprime toutes les marques déjà traités (+ 1 car nParsingFin est sur le dernier caractère non traité)
	var sFormatInterne = sFormat.substring(nParsingDebut, nParsingFin + 1);
	// On extrait la taille
	var nTaille = parseInt(sFormatInterne, 10);
	// On extrait la precision
	var nPrecision = 0;
	// La documentation précise que l'on accepte "." ou "," comme séparateur
	var nPositionPoint = sFormatInterne.indexOf(".");
	// GP 23/09/2015 : C'est documenté comme n'acceptant pas la virgule en code navigateur.
	// C'est aussi documenté comme utilisant ' ' comme séparateur de millier en code navigateur.
//	if (-1 == nPositionPoint)
//	{
//		nPositionPoint = sFormatInterne.indexOf(",");
//	}
	if (-1 != nPositionPoint)
	{
		nPrecision = parseInt(sFormatInterne.substr(nPositionPoint + 1));
	}
	else if (undefined != nPrecisionForce)
	{
		nPrecision = nPrecisionForce;
	}
	else
	{
		// Si on n'a pas donne de precision, on prend tous les chiffres apres la virgule mais en respectant la taille demandée
		var sValeur = String(oValeur);
		var nPosPt = sValeur.indexOf(".");
		if (-1 != nPosPt)
		{
			nPrecision = nTaille - nPosPt - 1;
		}
	}
	// Deuxieme partie : on formatte le nombre selon les specifs -------------------------------------------------
	// On va laisser ce soin a des fonctionS annexes
	var sResultat = pfFonction(bCadrageGauche, bSigne, bZero, nTaille, nPrecision, bMillier, bMajuscule, oValeur, bValeurNegative, nBase);

	// On va maintenant ajouter les zeros ou les blancs si on n'a pas atteint la taille requise
	while (sResultat.length < nTaille)
	{
		if (bCadrageGauche)
		{
			// Si on a demande le cadrage a gauche, on ajoute des espaces a droite
			sResultat += " ";
		}
		else
		{
			// ...soit des espaces a gauche
			sResultat = " " + sResultat;
		}
	}

	// En code serveur la mise en majuscule s'applique au format complet (ce qui inclus le "e" du format en notation scientifique)
	if (bMajuscule)
	{
		sResultat = sResultat.toUpperCase();
	}

	return sResultat;
};

// Implémentation de hasard : avec trois syntaxes :
// - Hasard() => Réel dans [0 et 1] (]0, 1[ ???)
// - Hasard(<Borne maximale>) => Entier dans [1 et <Borne maximale>]
// - Hasard(<Borne maximale>) => Entier dans [<Borne minimale> et <Borne maximale>]
clWDUtil.dHasard = function dHasard(dParametre1, dParametre2)
{
	function __dHasard(dResultat, dParametre1, dParametre2)
	{
		// Deux problème :
		// - Math.random retourne une valeur dans [0, 1[
		// - Math.round défavorise les valeurs extrèmes
		// On fait donc Math.floor et dParametre2 - dParametre1 + 1
		return Math.floor(dResultat * (Math.abs(dParametre2 - dParametre1) + 1) + Math.min(dParametre1, dParametre2));
	};

	var dResultat = Math.random();
	switch (arguments.length)
	{
	case 0:
		return dResultat;
	case 1:
		return __dHasard(dResultat, 1, dParametre1);
	case 2:
		return __dHasard(dResultat, dParametre1, dParametre2);
	}
};

// Recupere tous les elements formulaire d'une cellule
clWDUtil.tabGetElements = function tabGetElements(oCellule, bAvecLien, bAvecLabel)
{
	var tabElements = [];

	if (oCellule)
	{
		// Ajoute dans le tableau les 4 types de champ formulaire
		// La valeur retournee par getElementsByTagName n'est pas un tableau donc :
		// tabElements = tabElements.concat(oCellule.getElementsByTagName("xxx")); ne fonctionne pas

		tabElements = this._tabGetUnTypeElement(oCellule, "button", tabElements);
		tabElements = this._tabGetUnTypeElement(oCellule, "input", tabElements);
		tabElements = this._tabGetUnTypeElement(oCellule, "select", tabElements);
		tabElements = this._tabGetUnTypeElement(oCellule, "textarea", tabElements);
		if (bAvecLien)
		{
			tabElements = this._tabGetUnTypeElement(oCellule, "a", tabElements);
		}
		// GP 18/12/2012 : TB79988 : Depuis la 17, la génération inclus des label autour des sélecteurs/intérrupteurs
		// Ces label transforme un clic sur lui-même en clic sur l'élément formulaire associé
		if (bAvecLabel)
		{
			tabElements = this._tabGetUnTypeElement(oCellule, "label", tabElements);
		}
	}

	return tabElements;
};

// Fusionne le retour de getElementsByTagName avec un tableau
clWDUtil._tabGetUnTypeElement = function _tabGetUnTypeElement(oCellule, sTag, tabElements)
{
	// Trouve les elements
	var tabElementsByTagName = oCellule.getElementsByTagName(sTag);
	// Fusionne les tableaux
	var i;
	var nLimiteI = tabElementsByTagName.length;
	for (i = 0; i < nLimiteI; i++)
	{
		tabElements.push(tabElementsByTagName[i]);
	}
	// Et retourne le tableau resultat
	return tabElements;
};

// Indique si on a clique sur le fond d'un element (= ignore les champs formulaires)
clWDUtil.bClickDansFond = function bClickDansFond(oEvent, oFond)
{
	// Recupere la liste des elements exclus et test pour chacun si l'élement cliqué est inclus.
	var oElement = this.oGetOriginalTarget(oEvent);
	return this.bForEach(this.tabGetElements(oFond, true, true), function(oElementExclus)
	{
		// Si l'element est fils d'un des éléments de la liste : on ne clique pas sur le fond
		return !clWDUtil.bEstFils(oElement, oElementExclus);
	});
};

// Indique si un element est dans un tableau
clWDUtil.nElementInconnu = -1;
clWDUtil.bDansTableau = function bDansTableau(tabTableau, oElement, bStricte)
{
	return this.nElementInconnu !== this.nDansTableau(tabTableau, oElement, bStricte);
};
clWDUtil.bDansTableauFct = function bDansTableauFct(tabTableau, fComparaison, oParametre)
{
	return this.nElementInconnu !== this.nDansTableauFct(tabTableau, fComparaison, oParametre);
};
// Indique la position d'un element dans un tableau
clWDUtil.bEgalite = function bEgalite(oElement1, oElement2)
{
	return oElement1 == oElement2;
};
clWDUtil.bEgaliteStricte = function bEgaliteStricte(oElement1, oElement2)
{
	return oElement1 === oElement2;
};
clWDUtil.pfGetEgalite = function pfGetEgalite(bStricte)
{
	return bStricte ? this.bEgaliteStricte : this.bEgalite;
};
clWDUtil.nDansTableau = function nDansTableau(tabTableau, oElement, bStricte)
{
	return this.nDansTableauFct(tabTableau, this.pfGetEgalite(bStricte), oElement);
};
clWDUtil.nDansTableauFct = function nDansTableauFct(tabTableau, fComparaison, oParametre, nDebutRecherche)
{
	var nElement;
	var nLimiteElement = tabTableau.length;
	for (nElement = ((undefined !== nDebutRecherche) ? nDebutRecherche : 0); nElement < nLimiteElement; nElement++)
	{
		if (fComparaison(tabTableau[nElement], oParametre))
		{
			return nElement;
		}
	}
	return this.nElementInconnu;
};
clWDUtil.oDansTableau = function oDansTableau(tabTableau, oElement, bStricte, oDefaut)
{
	return this.oDansTableauFct(tabTableau, this.pfGetEgalite(bStricte), oElement, oDefaut);
};
clWDUtil.oDansTableauFct = function oDansTableauFct(tabTableau, fComparaison, oParametre, oDefaut)
{
	var nElement = this.nDansTableauFct(tabTableau, fComparaison, oParametre);
	return (this.nElementInconnu !== nElement) ? tabTableau[nElement] : oDefaut;
};

// Supprime un element dans le tableai
clWDUtil.SupprimeDansTableau = function SupprimeDansTableau(tabTableau, oElement, bStricte)
{
	return this.SupprimeDansTableauFct(tabTableau, this.pfGetEgalite(bStricte), oElement);
};
clWDUtil.SupprimeDansTableauFct = function SupprimeDansTableauFct(tabTableau, fComparaison, oParametre)
{
	var nElement = this.nDansTableauFct(tabTableau, fComparaison, oParametre);
	if (this.nElementInconnu !== nElement)
	{
		tabTableau[nElement] = null;
		tabTableau.splice(nElement, 1);
	}
};

// Duplique un tableau
clWDUtil.tabDupliqueTableau = function tabDupliqueTableau(tabTableau)
{
	var tabTableauNew = [];

	// Creation ou modification des nouveaux styles
	this.bForEachIn(tabTableau, function(sMembre, oElement)
	{
		tabTableauNew[sMembre] = oElement;
		return true;
	});

	return tabTableauNew;
};
clWDUtil.tabDupliqueTableauDepuis = function tabDupliqueTableauDepuis(tabTableau, nDepuis)
{
	// Sélectionne les élements dans une copie (pour ne pas modifier tabTableau)
	var tabTableauNew = this.tabDupliqueTableau(tabTableau);
	return tabTableauNew.slice(nDepuis);
};

// Vide un tableau
clWDUtil.VideTableau = function VideTableau(tabTableau)
{
	while (tabTableau.length)
	{
		tabTableau.pop();
	}
};

// Accès au indices/propriétés des objets natifs depuis le WL : on doit décider dynamiquement si c'est une chaine ou un indice (il faut alors faire -1)
clWDUtil.oGetIndiceObjetJS = function oGetIndiceObjetJS(oIndiceWL)
{
	switch (typeof oIndiceWL)
	{
	case "object":
		// Spécial WL : conversion en entier pour les objets
		// Framework V1 : toNumber
		if (oIndiceWL.toNumber)
		{
			return oIndiceWL.toNumber() - 1;
		}
		// Framework V2 : vnToNumber
		if (oIndiceWL.vnToNumber)
		{
			return oIndiceWL.vnToNumber() - 1;
		}
		// Pas de break;
	default:
		return oIndiceWL;
	case "number":
		return oIndiceWL - 1;
	}
};

// Appel une méthode sur chaque élément du tableau (appel par indice)
clWDUtil.bForEach = function bForEach(tabTableau, pfForEach)
{
	var nLimiteI = tabTableau.length;
	for (var i = 0; i < nLimiteI; i++)
	{
		if (!pfForEach(tabTableau[i], i))
		{
			// "break;"
			return false;
		}
	}
	return true;
};
clWDUtil.bForEachInverse = function bForEachInverse(tabTableau, pfForEach)
{
	for (var nIndice = tabTableau.length - 1; 0 <= nIndice; nIndice--)
	{
		if (!pfForEach(tabTableau[nIndice], nIndice))
		{
			// "break;"
			return false;
		}
	}
	return true;
};
clWDUtil.bForEachThis = function bForEachThis(tabTableau, oThis, pfForEach)
{
	return this.bForEach(tabTableau, function() { return pfForEach.apply(oThis, arguments); });
};
// Appel une méthode sur chaque élément du tableau (appel selon les noms)
clWDUtil.bForEachIn = function bForEachIn(oObjet, pfForEach)
{
	for (var sPropriete in oObjet)
	{
		if (oObjet.hasOwnProperty(sPropriete))
		{
			if (!pfForEach(sPropriete, oObjet[sPropriete]))
			{
				// "break;"
				return false;
			}
		}
	}
	return true;
};

// Stop la propagation des evenements
// Gere le cas de l'event sous IE
clWDUtil.bStopPropagation = function bStopPropagation(oEvent)
{
	return clWDUtil.bStopPropagationCond(oEvent, true);
};

// Stoppe conditionnelement la propagation
// Gere le cas de l'event sous IE
// GP 13/12/2016 : Prevent default n'arrete pas la propagation (= il ne bloque pas l'appel des handlers suivants) il ne fait que désactiver l'action naturelle du navigateur.
// Pour ne pas faire de régression : ajout d'un nouveau booléen : bStopPropagation
// Logiquement, dans la plupart des cas, on veux bStopPropagation si on a bPreventDefault. Avoir dans les codes appelant
clWDUtil.bStopPropagationCond = function bStopPropagationCond(oEvent, bPreventDefault, bStopPropagation)
{
	oEvent = oEvent || event;
	if (bStopPropagation)
	{
		// GP 13/12/2016 : test simple des membres de compatibilité IE
		if (bIE && (undefined !== oEvent.cancelBubble))
		{
			oEvent.cancelBubble = true;
		}
		if (oEvent.stopPropagation)
		{
			oEvent.stopPropagation();
		}
	}
	if (bPreventDefault)
	{
		// GP 13/12/2016 : test simple des membres de compatibilité IE
		if (bIEQuirks && (undefined !== oEvent.returnValue))
		{
			oEvent.returnValue = false;
		}
		if (oEvent.preventDefault)
		{
			oEvent.preventDefault();
		}
		return false;
	}
	else
	{
		return true;
	}
};

clWDUtil.AttacheDetacheEvent = function AttacheDetacheEvent(bAttache, oCible, sEvent, fFonction, oCapture)
{
	(bAttache ? HookOnXXX : UnhookOnXXX)(oCible, "on" + sEvent, sEvent, fFonction, oCapture);
};

(function ()
{
	"use strict";

	var ms_tabOnScrollResize = [];

	clWDUtil.AttacheOnScrollResize = function AttacheOnScrollResize(pfCallback)
	{
		// Si c'est le premier : attache le hook
		if (0 === ms_tabOnScrollResize.length)
		{
			// Ne garde par le pointeur car on ne détache jamais l'évenement
			this.AttacheDetacheEvent(true, window, "scroll", function (oEvent) { clWDUtil.__OnScrollResize(oEvent || event, true); });
			this.AttacheDetacheEvent(true, window, "resize", function (oEvent) { clWDUtil.__OnScrollResize(oEvent || event, false); });
		}

		// Ajoute l'appelant à la liste des callbacks si la callback n'existe pas déjà
		if (!this.bDansTableau(ms_tabOnScrollResize, pfCallback, true))
		{
			ms_tabOnScrollResize.push(pfCallback);
		}
	};
	// Callback sur onscroll et onresize
	clWDUtil.__OnScrollResize = function __OnScrollResize(oEvent, bOnScroll)
	{
		// GP 31/01/2014 : 242171 : Le code de 100% pour IE HTML5 fait un appel systématyique de cette méthode, même sans ms_tabOnScrollResize
		if (ms_tabOnScrollResize)
		{
			this.bForEach(ms_tabOnScrollResize, function (pfScrollResize)
			{
				pfScrollResize(oEvent, bOnScroll);
				return true;
			});
		}
	};
})();

// Attache une fonction a un evenement
function HookOnXXX (oCible, sEventIE, sEventFF, fFonction, oCapture)
{
	if (oCible.addEventListener)
	{
		oCible.addEventListener(sEventFF, fFonction, (oCapture instanceof Object) ? oCapture : !!oCapture);
	}
	else if (oCible.attachEvent)
	{
		oCible.attachEvent(sEventIE, fFonction);
	}
	else
	{
		// Cas d'un objet sorti du DOM dans opera : ne fait rien
	}
}

// Detache une fonction d'un evenement
function UnhookOnXXX(oCible, sEventIE, sEventFF, fFonction, oCapture)
{
	if (oCible.removeEventListener)
	{
		oCible.removeEventListener(sEventFF, fFonction, (oCapture instanceof Object) ? oCapture : !!oCapture);
	}
	else if (oCible.detachEvent)
	{
		oCible.detachEvent(sEventIE, fFonction);
	}
	else
	{
		// Cas d'un objet sorti du DOM dans opera : ne fait rien
	}
}

// Fixe directement le onxxx de l'element
clWDUtil.SetOnXxx = function SetOnXxx(oElement, sOnXxx, oThis, fFonction, tabParametres, bAppelAvantAutre)
{
	var fAutre = oElement[sOnXxx];
	// On ne se rehook pas
	if (fAutre && (fAutre.toString().match(/^function\s+SetOnCB/) != null))
	{
		return;
	}
	// Il est possible de recevoir null ici comme evenement (appel manuel de la fonction)
	var fAutreAvant = !bAppelAvantAutre ? fAutre : null;
	var fAutreApres = bAppelAvantAutre ? fAutre : null;
	(oElement[sOnXxx] = function SetOnCB(oEvent)
	{
		var bRes;
		oEvent = oEvent || (bIE ? event : null);
		if (fAutreAvant)
		{
			bRes = fAutreAvant.apply(oElement, [oEvent]);
		}
		fFonction.apply(oThis, [oEvent, tabParametres]);
		if (fAutreApres)
		{
			bRes = fAutreApres.apply(oElement, [oEvent]);
		}

		return bRes;
	});
};

// Indique si un element est fils d'un autre
clWDUtil.bEstFils = function bEstFils(oElement, oParent)
{
	// GP 27/04/2017 : OPTIM : Utilisation de Node.contains qui est plus rapide :
	// - Avec ajout du cas de l'égalité car le code historique retournait true si oElement était oParent (c'est limite car non "fils" mais on ne touche pas pour ne pas faire de régression)
	// - Sauf si les deux était le body mais cela ressemble plus aune limite de l'implémentation donc on ne garde plus ce cas particulier
	// Note : si oElement est null contains retourne false;
	if (oParent)
	{
		// Converse le cas particulier
		if (oElement == oParent)
		{
			return true;
		}
		// GP 15/05/2017 : QW287220 : element.compareDocumentPosition n'est pas disponible en mode quirks. Mais contains l'est parfois.
		if (oParent.contains)
		{
			return oParent.contains(oElement);
		}
		// GP 09/05/2017 : QW287009 : document.contains n'est pas disponible en IE. Utilise compareDocumentPosition qui est disponible.
		// => En fait ici on ne recevait jamais "document" car la recherche avec l'algo historique s'arretait à document.body. Mais cela permet de rendre l'algo plus générique
		if (oParent.compareDocumentPosition)
		{
			return !!(oParent.compareDocumentPosition(oElement) & Node.DOCUMENT_POSITION_CONTAINED_BY);
		}
		// Si rien n'est disponible : ancien algo
		var oBody = document.body;
		while (oElement && (oElement != oBody))
		{
			if (oElement == oParent)
			{
				return true;
			}
			oElement = oElement.parentNode;
		}
	}

	// Pas de parent
	return false;
};
// Indique si un élément est dans le document
clWDUtil.bEstDansDocument = function bEstDansDocument(oElement)
{
	// GP 15/05/2017 : QW287220 : element.compareDocumentPosition n'est pas disponible en mode quirks. Mais contains l'est parfois.
	if (document.contains)
	{
		return document.contains(oElement);
	}
	// GP 09/05/2017 : QW287009 : document.contains n'est pas disponible en IE. Utilise compareDocumentPosition qui est disponible.
	// => En fait ici on ne recevait jamais "document" car la recherche avec l'algo historique s'arretait à document.body. Mais cela permet de rendre l'algo plus générique
	if (document.compareDocumentPosition)
	{
		return !!(document.compareDocumentPosition(oElement) & Node.DOCUMENT_POSITION_CONTAINED_BY);
	}
	// Cas moins précis (ne teste pas le head)
	// => Dans les cas ou l'on n'a ni document.contains ni document.compareDocumentPosition, document.body.contains existait
	return document.body.contains(oElement);
};

// Supprime un fils de son parent
clWDUtil.oSupprimeElement = function oSupprimeElement(oElement)
{
	// Si l'element existe et est dans le document
	if (oElement && (oElement.parentNode))
	{
		return oElement.parentNode.removeChild(oElement);
	}
	else
	{
		return oElement;
	}
};

// Supprime tous les fils d'un elements et detache les fonctions JS de focus/modification
clWDUtil.SupprimeFilsEtOnFocus = function SupprimeFilsEtOnFocus(oParent, bAvecLien)
{
	// Supprime les elements JavaScript pour les reference circulaires entre le DOM et le JS
	var tabElements = this.tabGetElements(oParent, bAvecLien);
	var i;
	var nLimiteI = tabElements.length;
	for (i = 0; i < nLimiteI; i++)
	{
		// Gestion des anciennes fonctions : non on supprime l'element
		var oElement = tabElements[i];
		oElement.onchange = null;
		oElement.onblur = null;
		oElement.onfocus = null;
	}
	this.SupprimeFils(oParent);
};

// Supprime tous les fils d'un elements
clWDUtil.SupprimeFils = function SupprimeFils(oParent)
{
	var tabChildNodes = oParent.childNodes;
	// GP 26/11/2014 : TB89889 : Quelque chose se passe mal. Blindage ici. La liste est non vide mais Chrome fait une erreur qui indique que l'élément n'est déjà plus fils.
	// Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?
	var nNbIgnores = 0;
	while (nNbIgnores < tabChildNodes.length)
	{
		var oFils = tabChildNodes[nNbIgnores];
		// => try+catch car un test de tabChildNodes[0].parentNode == oParent ne fonctionne pas.
//		if (oFils.parentNode == oParent)
		try
		{
			oParent.removeChild(oFils);
		}
//		else
		catch (oErreur)
		{
			nNbIgnores++;
		}
	}
};

// Donne le focus a un champ (fonctionne avec tous les navigateurs)
clWDUtil.DonneFocus = (function ()
{
	"use strict";

	// GP 03/09/2018 : TB109930 : Gestion d'un système de priorité. Un appel de DonneFocus en WL sera toujours prioritaire.
	// - Aucun appel de DonneFocus en attente
	var ms_nEtatAucun = 0;
	// - Appel en attente avec une priorite base : généralement une demande depuis le framework.
	var ms_nEtatPrioriteBasse = 1;
	// - Appel en attente avec une priorite normale : généralement une demande depuis le WL.
	var ms_nEtatPrioriteNormale = 2;
	// - Après l'exécution du .focus(). Simule le fait que le code précédent restaurait l'état de clWDUtil.DonneFocus en asynchrone.
	// => Je ne sais pas/plus pourquoi c'est ainsi. A voir si c'est à conserver.
	var ms_nEtatApresFocus = 3;

	// Champ a qui on va donner le focus
	var ms_eEtat = ms_nEtatAucun;
	var ms_oChamp = null;
	var ms_oChampSecondeTentative = undefined;

	clWDUtil.eGetEtatFocus = function ()
	{
		return ms_eEtat;
	};

	return function (oChamp, bPrioriteBasse)
	{
		// Decide si on va donner le focus.
		switch (ms_eEtat)
		{
		case ms_nEtatAucun:
			// - Aucun appel de DonneFocus en attente
			// => Continue
			break;
		case ms_nEtatPrioriteBasse:
			// - Appel en attente avec une priorite base : généralement une demande depuis le framework.
			// => Un second appel avec la même priorité ne masque pas le premier.
			if (!bPrioriteBasse)
			{
				// MAJ de l'état et du champ.
				ms_eEtat = ms_nEtatPrioriteNormale;
				ms_oChamp = oChamp;
				// Ne relance pas de timer, réutilise le précédent
			}
			return;
		case ms_nEtatPrioriteNormale:
			// - Appel en attente avec une priorite normale : généralement une demande depuis le WL.
			// => Un second appel (quel que soit sa priorité) ne masque pas le premier.
			return;
		case ms_nEtatApresFocus:
			// - Après l'exécution du .focus(). Simule le fait que le code précédent restaurait l'état de clWDUtil.DonneFocus en asynchrone.
			// => Je ne sais pas/plus pourquoi c'est ainsi. A voir si c'est à conserver.
			return;
		default:
			clWDUtil.WDDebug.assert(false, "clWDUtil.DonneFocus : état inconnu");
			break;
		}

		// Mémorise l'état et le champ.
		ms_eEtat = bPrioriteBasse ? ms_nEtatPrioriteBasse : ms_nEtatPrioriteNormale;
		ms_oChamp = oChamp;

		// Et lance le timer
		clWDUtil.nSetTimeout(__Focus, clWDUtil.ms_oTimeoutImmediat);
	};

	function __Focus()
	{
		clWDUtil.WDDebug.assert((ms_nEtatPrioriteBasse === ms_eEtat) || (ms_nEtatPrioriteNormale === ms_eEtat), "clWDUtil.DonneFocus/__Focus : etat invalide");
		// GP 18/05/2017 : Effectué avant de .focus(). Ainsi si l'objet est invalide, le traitement s'arrete mais le prochain appel de DonneFocus fonctionne car DonneFocus a été restauré
		var oTimeout = clWDUtil.nSetTimeout(__FinFocus, clWDUtil.ms_oTimeoutImmediat);
		ms_eEtat = ms_nEtatApresFocus;

		var oChampEffectif = ms_oChamp;
		ms_oChamp = null;

		var oActiveElementAvant = __oGetActiveElement(oChampEffectif);
		var bSansWrapperFocus = __bFocusAvecGestionCasSpecifique(oChampEffectif);
		var oActiveElementApres = __oGetActiveElement(oChampEffectif);

		// GP 04/01/2019 : TB111575 : Vérifie si le champ a vraiment pris le focus. Et si ce n'est pas le cas, fait une seconde tentative.
		if (bSansWrapperFocus && (oActiveElementAvant === oActiveElementApres) && (oActiveElementApres !== oChampEffectif))
		{
			// Si le focus n'a pas été donné, le mémorise pour une seconde tentative mais plus tard.
			ms_oChampSecondeTentative = oChampEffectif;
			clWDUtil.ClearTimeout(oTimeout);
			clWDUtil.nSetTimeout(__FinFocus, clWDUtil.ms_nTimeoutNonImmediat20);
		}
	}
	function __FinFocus()
	{
		clWDUtil.WDDebug.assert(ms_nEtatApresFocus === ms_eEtat, "clWDUtil.DonneFocus/__FinFocus : etat invalide");

		if (ms_oChampSecondeTentative)
		{
			__bFocusAvecGestionCasSpecifique(ms_oChampSecondeTentative);
			ms_oChampSecondeTentative = undefined;
		}

		ms_eEtat = ms_nEtatAucun;
	}

	function __bFocusAvecGestionCasSpecifique(oElement)
	{
		// GP 19/03/2019 : TB112753 : Si l'élément a un implémentation spécifique de .focus() (champ de saisie à jetons).
		if (oElement.wbWrappeFocus)
		{
			oElement.wbWrappeFocus();
			return false;
		}
		else
		{
			oElement.focus();
			return true;
		}
	}

	function __oGetActiveElement(oElementSource)
	{
		return oElementSource && oElementSource.ownerDocument && oElementSource.ownerDocument.oActiveElement;
	}
})();

// Supprime une variable du HTML si elle existe
// Retourne si la variable existait
clWDUtil.bHTMLVideDepuisVariable = function bHTMLVideDepuisVariable(oObjet, sNomMembre)
{
	if (oObjet[sNomMembre])
	{
		// Si la variable existe, la supprime du HTML et de l'objet
		this.oSupprimeElement(oObjet[sNomMembre]);
		oObjet[sNomMembre] = null;
		delete oObjet[sNomMembre];
		return true;
	}
	else
	{
		// Supprime par securite (variable existante mais vide)
		delete oObjet[sNomMembre];
		return false;
	}
};

// Decale la date d'un nombre de jours
// Modifie oDate (passé par référence) et la retourne aussi
clWDUtil.oDecaleDateJour = function oDecaleDateJour(oDate, nDecalageJour, bRAZHeures)
{
	oDate.setTime(oDate.getTime() + nDecalageJour * 86400000);
	if (bRAZHeures)
	{
		oDate.setUTCHours(0, 0, 0, 0);
	}
	return oDate;
};
// Recupere la partie heure (dans la journee) dans une date
// DD/MM/AAAA HH:MM:SS:MMM => HH:MM:SS:MMM (en ms depuis 00:00)
clWDUtil.nGetHeureJour = function nGetHeureJour(nDate)
{
	return nDate - (new Date(nDate).setUTCHours(0, 0, 0, 0));
};

(function ()
{
	"use strict";

	// Tableau des fonctions pour la conversion
	var m_tabFonctionsDate = [
		Date.prototype.getFullYear,
		Date.prototype.getMonth,
		Date.prototype.getDate,
		Date.prototype.getHours,
		Date.prototype.getMinutes,
		Date.prototype.getSeconds,
		Date.prototype.getMilliseconds,
		Date.prototype.setFullYear,
		Date.prototype.setHours
	];
	var m_tabFonctionsDateUTC = [
		Date.prototype.getUTCFullYear,
		Date.prototype.getUTCMonth,
		Date.prototype.getUTCDate,
		Date.prototype.getUTCHours,
		Date.prototype.getUTCMinutes,
		Date.prototype.getUTCSeconds,
		Date.prototype.getUTCMilliseconds,
		Date.prototype.setUTCFullYear,
		Date.prototype.setUTCHours
	];

	// Conversion d'une date/heure en date/heure au format WL
	clWDUtil.sGetDateHeureWL = function sGetDateHeureWL(oDate, bUTC, bDate, bHeure)
	{
		var tabFonctions = bUTC ? m_tabFonctionsDateUTC : m_tabFonctionsDate;

		var sResultat = "";
		if (bDate)
		{
			// L'annee est >= 1970
			sResultat += this.sCompleteEntier(tabFonctions[0].call(oDate), 4);
			// Le mois est entre 0 et 11
			sResultat += this.sCompleteEntier(tabFonctions[1].call(oDate) + 1, 2);
			// Le jour est entre 1 et 31
			sResultat += this.sCompleteEntier(tabFonctions[2].call(oDate), 2);
		}
		if (bHeure)
		{
			// Les heures (entre 0 et 23)
			sResultat += this.sCompleteEntier(tabFonctions[3].call(oDate), 2);
			sResultat += this.sCompleteEntier(tabFonctions[4].call(oDate), 2);
			sResultat += this.sCompleteEntier(tabFonctions[5].call(oDate), 2);
			sResultat += this.sCompleteEntier(tabFonctions[6].call(oDate), 3);
		}
		return sResultat;
	};
	// Conversion d'une date/heure au format WL en date/heure au format "date"
	// oDate : OUT
	clWDUtil.bSetDateHeureFromWL = function bSetDateHeureFromWL(oDate, sDateWL, bUTC, bDate, bHeure, nLongueurMinHeure)
	{
		// Interprétée selon le type :
		// - Date : "AAAAMMJJ"
		// - Heure : "HHMM", "HHMMSS", "HHMMSSCC" et "HHMMSSLLL"
		// - DateHeure : "AAAAMMJJ", "AAAAMMJJHH", "AAAAMMJJHHMM", "AAAAMMJJHHMMSS", "AAAAMMJJHHMMSSCC" et "AAAAMMJJHHMMSSLLL"

		// La valeur doit être composée de chiffres
		sDateWL = String(sDateWL);
		if (parseInt(sDateWL, 10) != sDateWL)
		{
			return false;
		}

		var tabFonctions = bUTC ? m_tabFonctionsDateUTC : m_tabFonctionsDate;

		// GP 16/10/2014 : QW249934 : Quand on crée une date, il faut mettre la partie heure a zéro. Sinon en cas de différence de deux date crée dans deux millisecondes différentes
		// on a un reste et un résultat érroné
		var sPartieDate;
		var sPartieHeure;
		if (bDate)
		{
			// La date est au début
			sPartieDate = sDateWL.substr(0, 8);
			// On a forcément 8 caractères
			// GP 16/10/2014 : QW249956 : On autorise 8 caractères ou plus
			if (8 !== sPartieDate.length)
			{
				return false;
			}

			// Si on est un dateheure, l'heure est après la date (sans minimum de longueur)
			if (bHeure)
			{
				sPartieHeure = clWDUtil.sCompleteChaine(sDateWL.substr(8), 9, "0");
			}
			else
			{
				sPartieHeure = "000000000";
			}
		}
		else if (bHeure)
		{
			// Heure sans date
			sPartieDate = "19700101";
			sPartieHeure = clWDUtil.sCompleteChaine(sDateWL.substr(0, 9), 9, "0");
			// Le déformatage des heures demande un minimum de "HHMM"
			if (sDateWL.length < nLongueurMinHeure)
			{
				return false;
			}
		}

		tabFonctions[7].call(oDate, parseInt(sPartieDate.substr(0, 4), 10), parseInt(sPartieDate.substr(4, 2), 10) - 1, parseInt(sPartieDate.substr(6, 2), 10));
		tabFonctions[8].call(oDate, parseInt(sPartieHeure.substr(0, 2), 10), parseInt(sPartieHeure.substr(2, 2), 10), parseInt(sPartieHeure.substr(4, 2), 10), parseInt(sPartieHeure.substr(6, 3), 10));

		return true;
	};
})();
clWDUtil.oGetDateHeureFromWL = function oGetDateHeureFromWL(sDateWL, bUTC, bDate, bHeure)
{
	var oDate = new Date();
	if (this.bSetDateHeureFromWL(oDate, sDateWL, bUTC, bDate, bHeure, 4))
	{
		return oDate;
	}
	else
	{
		return undefined;
	}
};

// Construit les parametres d'une fonction serveur appelee
// nNbParamIgnore contient le nombre de parametres a ignorer dans tabParamOriginaux
clWDUtil.sConstuitProcedureParams = function sConstuitProcedureParams(nNbParamIgnore, tabParamsOriginaux)
{
	var i;
	var nLimiteI = tabParamsOriginaux.length;
	// + Car on laisse le premier indice vide donc comme ca on a automatiquement le "&" initial
	var tabParams = new Array(nLimiteI - nNbParamIgnore + 1);
	tabParams[0] = "";
	for (i = nNbParamIgnore; i < nLimiteI; i++)
	{
		var nIndiceReel = i - nNbParamIgnore + 1;
		// Si l'arguement est un booleen alors on envoi 0/1 pour faux/vrai
		// Car le cast en chaine du false/true du JS donne "false"/"true", ce que le serveur ne sait pas bien convertir en boolen
		var oParam = tabParamsOriginaux[i];
		var sNomParam;
		var sValeurParam;
		if (oParam instanceof WDTypeAvance && (undefined !== oParam.ms_sNomPourParam))
		{
			sNomParam = "PO";
			sValeurParam = oParam.ms_sNomPourParam + "|" + encodeURIComponent(JSON.stringify(oParam));
		}
		else
		{
			sNomParam = "PA";
			// GP 17/11/2020 : QW329762 : Lors de l'envoi vers le serveur le DINO Couleur doit être converti en entier (c'est son format "natif" en code serveur).
			if (oParam instanceof this.WDDinoCouleur)
			{
				sValeurParam = oParam.toNumber();
			}
			else if ("boolean" === typeof oParam)
			{
				sValeurParam = oParam ? "1" : "0";
			}
			else
			{
				sValeurParam = encodeURIComponent(String(oParam));
			}
		}
		tabParams[nIndiceReel] = sNomParam + nIndiceReel + "=" + sValeurParam;
	}
	return tabParams.join("&");
};

// Recupere l'action depuis le location
clWDUtil._sGetPageActionDepuisLocation = function _sGetPageActionDepuisLocation(sAction)
{
	// GP 10/02/2016 : TB96504 : Suite à QW262788 (qui lui suis TB94605) on se retrouve avec deux fois le querystring dans les URLs avec IE.
	// La source du problème : si l'attribut action est vide (ce qui est invalide en HTML5), les navigateurs retournent des valeurs différentes (et parfois invalide) quand on intérroge form.action.
	// => Donc on passe dans du code de compatibilité et en particulier ici.
	// Sauf que maintenant on retourne un action valide (Suite à QW262788 (qui lui suis TB94605)) donc ce qu'il faut faire et de supprimer le code de compatibilité
	// => !!! A faire un jour !!! (En 22 ???) En tentant de valider tous les cas et tous les chemins.
	// En attendant : si l'action est la fin de location.href : ne pas faire la concaténation
	if ((location.href.length < sAction.length) || (location.href.substr(location.href.length - sAction.length) != sAction))
	{
		// On prend l'URL si on n'a pas d'action
		sAction = location.href + sAction;
	}
	else
	{
		sAction = location.href;
	}
	// On vire l'ancre
	var nAncreTaille = location.hash.length;
	if (nAncreTaille > 0)
	{
		var nAncrePos = sAction.indexOf(location.hash);
		sAction = sAction.substr(0, nAncrePos) + sAction.substr(nAncrePos + nAncreTaille);
	}
	return sAction;
};

clWDUtil.__sGetAction = function __sGetAction(oFormulaire)
{
	if (oFormulaire)
	{
		// GP 22/09/2016 : Le contenu de action n'est plus JAMAIS vide. Les navigateurs retournent donc une valeur valide lors de la lecture de Form.action.
		return oFormulaire.action;
	}
	if (window.NSPCS)
	{
		var oDataPageAWPSansUI = NSPCS.NSUtil.ms_oDataPageAWPSansUI;
		if (oDataPageAWPSansUI)
		{
			return oDataPageAWPSansUI.m_sURL;
		}
	}

	return "";
};

// Recupere l'action d'une page
// oPage : formulaire a utiliser (null possible)
// bParamSuppr : indique s'il faut supprimer les parametres de l'URL
// bIDSession : Indique s'il faut ajouter l'ID de session
// bPourRepRes : Indique que la reference est avec le repertoire res et qu'il faut eviter les chemin relatifs
clWDUtil.sGetPageAction = function sGetPageAction(oPage, bParamSuppr, bIDSession, bPourRepRes)
{
	// GP 22/09/2016 : Le contenu de action n'est plus JAMAIS vide. Les navigateurs retournent donc une valeur valide lors de la lecture de Form.action.
	// Trouve la page si besoin
	var sAction = this.__sGetAction(oPage || window._PAGE_);

	// GP 21/11/2012 : Maintenant l'action vide contient "#" par compatibilité HTML5
	// GP 30/11/2012 : QW227129 : Certains navigateur (Chrome) si ACTION contient uniquement "#", retourne l'URL de la page + "#"
	if ("#" === sAction.charAt(sAction.length - 1))
	{
		sAction = sAction.substr(0, sAction.length - 1);
	}
	if ((sAction.length === 0) || (sAction.charAt(0) === "?"))
	{
		// Si l'action se retourve deja dans l'URL de la page, on ne la double pas
		if (-1 !== location.href.indexOf(sAction))
		{
			sAction = this._sGetPageActionDepuisLocation("");
		}
		else
		{
			sAction = this._sGetPageActionDepuisLocation(sAction);
		}
	}
	// GP 22/09/2016 : Le contenu de action n'est plus JAMAIS vide. Les navigateurs retournent donc une valeur valide lors de la lecture de Form.action.
//	// Implicitement on a sAction > 0 (teste dans le premier if)
//	// GP 04/12/2012 : Vu avec le site de ventre en ligne : il faut passer dans le test en IE10 mode quirks nouveau
//	// GP 14/11/2013 : QW238935 : Ajoute le cas pour IE11
//	// GP 25/08/2015 : TB94028 : Ajout de MS Edge qui a le même comportement que IE11 en HTML5
//	else if (((bIEAvec11 || (nIE >= 8)) && !bIEQuirks9Max) || bEdge)
//	{
//		// En mode non quirks, IE retourne une addresse absolue pour FORM.action
//		// Sauf que dans une page AWP l'action est vide. IE complete quand meme et retourne donc le chemin de la page
//		// Evidement ce n'est pas une action valide au final
//		var sActionAttribut = window._PAGE_.getAttributeNode("action").value;
//		if ((0 == sActionAttribut.length) || ("?" == sActionAttribut.charAt(0)))
//		{
//			sAction = this._sGetPageActionDepuisLocation(sActionAttribut);
//		}
//	}

	// Implicitement (sAction.length > 0) exclus le cas AWP. Il faut aussi exclure le cas .php
	if (bPourRepRes && (sAction.indexOf("/") === -1) && (sAction.length > 0) && (sAction.toLowerCase().indexOf(".php") === -1))
	{
		sAction = "../" + sAction;
	}

	// Vire les parametres
	if (bParamSuppr && (sAction.indexOf("?") !== -1))
	{
		sAction = sAction.substr(0, sAction.indexOf("?"));
	}

	// Ajoute l'ID de session si besoin
	if (bIDSession)
	{
		if ((sAction.indexOf("AWPID=") === -1) && ("undefined" !== typeof _AWPID_A_))
		{
			// Ajoute le separateur et la session
			var sID = (sAction.indexOf("?") !== -1) ? _AWPID_A_ : _AWPID_P_;
			// Et s'il est vide prend le cookie de session s'il existe :
			// Firefox et chrome qui en donnent pas leurs cookies au plugins (= Flash)
			if ((bFF || bWK) && (sID.length === 0))
			{
				var tabSuffixe = [];
				sID = clWDUtil.m_oCookie.GetCookie("AWP_CSESSION", tabSuffixe);
				if (sID.length > 0)
				{
					sID = ((sAction.indexOf("?") !== -1) ? "&" : "?") + "AWPID" + tabSuffixe[0] + "=" + sID;
				}
			}
			sAction += sID;
		}
		else if ("undefined" !== typeof _PHPID_)
		{
			var tabPHPID = _PHPID_.split("=");
			if ((tabPHPID.length > 0) && (sAction.indexOf(tabPHPID[0] + "=") === -1))
			{
				// Ajoute le separateur et la session
				sAction += ((sAction.indexOf("?") !== -1) ? "&" : "?") + _PHPID_;
			}
		}
	}
	// Renvoie la valeur
	return sAction;
};

// GP 31/05/2013 : QW232516 : Correction sans prendre de risques.
// Ce qu'il faut faire :
// - Faire le point sur TOUS les appels de window._PAGE_.action (y compris dans le code généré par la JS)
// - Faire passer ces codes par sGetPageAction
//	- Gestion de l'ID de session par sGetPageAction
//	- Gestion des paramètres par sGetPageAction (enplus de ceux existant de l'URL)
// - Supprimer sGetPageActionIE10
clWDUtil.sGetPageActionIE10 = function sGetPageActionIE10()
{
	// GP 22/09/2016 : Le contenu de action n'est plus JAMAIS vide. Les navigateurs retournent donc une valeur valide lors de la lecture de Form.action.
	var sAction = this.__sGetAction(window._PAGE_);

	// GP 25/08/2015 : TB94028 : Ajout de MS Edge qui a le même comportement que IE11 en HTML5
	// GP 14/12/2017 : QW294663 : Maintenant le contenu de ACTION écrit sur le serveur est valide (paramètre ou nom valide de page), le contenu du action (au moins avec edge) est valide.
	// (Corrigé dans WDxxxSession.exe le 21/10/2015 pour QW262788)
//	if (((nIE >= 8) && !bIEQuirks9Max) || bEdge)
	if ((nIE >= 8) && !bIEQuirks9Max)
	{
		// En mode non quirks, IE retourne une addresse absolue pour FORM.action
		// Sauf que dans une page AWP l'action est vide. IE complete quand meme et retourne donc le chemin de la page
		// Evidement ce n'est pas une action valide au final
		var sActionAttribut = window._PAGE_.getAttributeNode("action").value;
		if ((0 == sActionAttribut.length) || ("?" == sActionAttribut.charAt(0)))
		{
			sAction = this._sGetPageActionDepuisLocation(sActionAttribut);
			// Vire les parametres
			if (sAction.indexOf("?") != -1)
			{
				sAction = sAction.substr(0, sAction.indexOf("?"));
			}
		}
	}
	return sAction;
};

// Retourne un type étendu : type JS ou type WL
clWDUtil.oGetTypeEntendu = function oGetTypeEntendu(oValeur)
{
	var oType = typeof oValeur;
	if (oType == "object")
	{
		// Par sécurité, force la conversion des valeurs du framework V2 vers le type natif
		var iValeurBase;
		if (window.NSPCS && (iValeurBase = NSPCS.iGetAsBase(oValeur)))
		{
			if (iValeurBase.veGetTypeWL)
			{
				return iValeurBase.veGetTypeWL();
			}
			// Pour garder le code simple : appel récursif
			return oGetTypeEntendu(oValeur.valueOf());
		}

		if (window.clWLangage)
		{
			if (oValeur instanceof clWLangage.WDDateHeure)
			{
				if (oValeur.m_bDate && oValeur.m_bHeure)
				{
					// WLT_DATETIME
					return 26;
				}
				else if (oValeur.m_bDate)
				{
					// WLT_DATEW
					return 24;
				}
				else if (oValeur.m_bHeure)
				{
					// WLT_TIMEW
					return 25;
				}
			}
			else if (oValeur instanceof clWLangage.WDDuree)
			{
				// WLT_DUREE
				return 27;
			}
			else if (oValeur instanceof clWLangage.WDUI8)
			{
				// WLT_UI8
				return 5;
			}
			else if (oValeur instanceof clWLangage.WDI8)
			{
				// WLT_I8
				return 9;
			}
			else if (oValeur instanceof clWLangage.WDNumerique)
			{
				// WLT_DECIMAL
				return 13;
			}
			// Pas de test pour le UIX car ils sont strictement équivalent aux entiers signés sur 8.
		}
	}

	return oType;
};

clWDUtil.oConversionType = (function ()
{
	"use strict";

	function __toNumberI(oValeur)
	{
		// GP 17/04/2015 : QW257397 : (undefined).toString() ne fonctionne pas (ni (null).toString())
		if ((undefined !== oValeur) && (null !== oValeur) && (oValeur.toNumber))
		{
			oValeur = oValeur.toNumber();
		}
		return parseInt(oValeur, 10);
	}
	function __toNumberF(oValeur)
	{
		// GP 17/04/2015 : QW257397 : (undefined).toString() ne fonctionne pas (ni (null).toString())
		if ((undefined !== oValeur) && (null !== oValeur) && (oValeur.toNumber))
		{
			oValeur = oValeur.toNumber();
		}
		return parseFloat(oValeur);
	}

	// Conversion de type simple pour le WL
	// Normalement le type droit est différent du type gauche (sinon on n'appel pas la fonction)
	return function oConversionType(oValeur, nTypeGauche, oTypeGaucheEtendu, nTypeDroit, oTypeDroitEtendu)
	{
		// GP 18/11/2013 : QW234496 : Si le type droit est un "multitype"
		// 140 = WLT_MULTI_TYPE
		if (140 == nTypeDroit)
		{
			return oValeur.oGetValeur(nTypeGauche, oTypeGaucheEtendu);
		}

		// On ne gère que les types simples pour le moment
		switch (nTypeGauche)
		{
		case 1: // WLT_BOOL
			// Ce code est probablement buggé :
			// false != 0				=> false	=> OK
			// false != undefined		=> true		=> Pas OK
			// false != null			=> true		=> Pas OK
			// false != ""				=> false	=> OK
			// false != []				=> false	=> OK (??)
			// false != {}				=> true		=> Pas OK (??)
			// Note : faire "!!x" n'est probablement pas mieux :
			// !!0						=> false	=> OK
			// !!undefined				=> false	=> OK
			// !!null					=> false	=> OK
			// !!""						=> false	=> OK
			// !![]						=> true		=> Pas OK (??)
			// !!{}						=> true		=> Pas OK (??)
			return (typeof oValeur == "boolean") ? oValeur : (false != oValeur);
		case 2: // WLT_UI1
		case 3: // WLT_UI2
		case 4: // WLT_UI4
		case 6: // WLT_I1
		case 7: // WLT_I2
		case 8: // WLT_I4
			switch (this.oGetTypeEntendu(oValeur))
			{
			case "number":
				return oValeur;
			case "boolean":
				return oValeur ? 1 : 0;
			case 5: // WLT_UI8
			case 9: // WLT_I8
			case 13: // WLT_DECIMAL
			// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
				return oValeur.toNumber();
			case 24:
			case 25:
			case 26:
				// WLT_DATEW (et WLT_DATEA que l'on ne manipule pas en JS), WLT_TIMEW (et WLT_TIMEA que l'on ne manipule pas en JS) et WLT_DATETIME
				return oValeur.toNumber();
			case 27:
				// WLT_DUREE
				return oValeur.m_nValeur;
			default:
				oValeur = __toNumberI(oValeur);
				return isNaN(oValeur) ? 0 : oValeur;
			}
		case 11: // WLT_R4
		case 12: // WLT_R8
			switch (this.oGetTypeEntendu(oValeur))
			{
			case "number":
				return oValeur;
			case 5: // WLT_UI8
			case 9: // WLT_I8
			case 13: // WLT_DECIMAL
			// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//			case 14: // WLT_UIX
				return oValeur.toNumber();
			case "boolean":
				return oValeur ? 1 : 0;
			default:
				oValeur = __toNumberF(oValeur);
				return isNaN(oValeur) ? 0 : oValeur;
			}
		case 10: // WLT_CY
			// GP 05/10/2015 : On peux recevoir WLT_CY dans les chemins qui n'utilisent pas encore __rclGetTypeCommunPourExecution
			clWDUtil.WDDebug.assert(false, "WLT_CY non filtré");
			// Pas de break;
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		case 14: // WLT_UIX
			// Ici techniquement, dans le cas d'un numérique, il manque la description de la précision de la déclaration du type
			return this.__oConversionTypeNumerique(oValeur, nTypeGauche, oTypeGaucheEtendu, nTypeDroit, oTypeDroitEtendu);
//		case 15: // WLT_HWND
		case 16: // WLT_DSTRW
//		case 17: // WLT_CARA	On ne recoit plus cette valeur (filtrée par __rclGetTypeCommunPourExecution)
		case 18: // WLT_PSTRA
		case 19: // WLT_DSTRA
//		case 20: // WLT_SQLQUERYW
//		case 21: // WLT_PASCAL	On ne recoit plus cette valeur (filtrée par __rclGetTypeCommunPourExecution)
//		case 22: // WLT_FIXE	On ne recoit plus cette valeur (filtrée par __rclGetTypeCommunPourExecution)
//		case 23: // WLT_ASCIIZ	On ne recoit plus cette valeur (filtrée par __rclGetTypeCommunPourExecution)
//		case 81: // WLT_CARW	On ne recoit plus cette valeur (filtrée par __rclGetTypeCommunPourExecution)
		case 110: // WLT_PSTRW !!!
			switch (typeof oValeur)
			{
			case "string":
				return oValeur;
			case "boolean":
				return oValeur ? "1" : "0";
			default:
				// GP 06/01/2017 : Appel simple de "String(xxx)". Remplace les corrections de :
				// - QW256479 : xxx + "" interdit : les exceptions ne traversent pas l'appel implicite de toString() en quirks + HTML4
				// - QW257397 : (xxx).toString() interdit : ne fonctionne pas undefined
				// String(xxx) transmet les exceptions et fonctionne avec undefined
				return String(oValeur);
			}
		case 24: // WLT_DATEW
		case 128: // WLT_DATEA
			return this.__oConversionTypeDateHeure(true, false, oValeur, nTypeDroit, oTypeDroitEtendu);
		case 25: // WLT_TIMEW
		case 129: // WLT_TIMEA
			return this.__oConversionTypeDateHeure(false, true, oValeur, nTypeDroit, oTypeDroitEtendu);
		case 26: // WLT_DATETIME
			return this.__oConversionTypeDateHeure(true, true, oValeur, nTypeDroit, oTypeDroitEtendu);
		case 27: // WLT_DUREE
			// Si on n'a pas de type Date en WL, on a un risque de ne pas avoir clWLangage. Dans ce cas on fait comme avant on retourne la valeur inchangée (sous forme d'une chaine)
			if (window.clWLangage)
			{
				return new clWLangage.WDDuree(oValeur);
			}
			else
			{
				oValeur;
			}
//		case 28: // WLT_BIN
//		case 29: // WLT_BUFFER
//		case 30: // WLT_MEMOIMG
//		case 31: // WLT_ANY
//		case 32: // WLT_AUT
//		case 33: // WLT_OLE
//		case 34: // WLT_ARR
//			return clWDUtil.__oConversionTypeTableau(oValeur, nTypeGauche, oTypeGaucheEtendu, nTypeDroit, oTypeDroitEtendu)
//		case 35: // WLT_COMPOSE
//		case 36: // WLT_STRUCT
//		case 37: // WLT_OBJ
//			// On ne sait pas convertir (et si ce n'est pas un DINO on a eu une erreur en WL)
//			return oValeur;
//		case 38: // WLT_ELEM
//		case 39: // WLT_WINNAME
//		case 40: // WLT_REPORT
//		case 41: // WLT_WIN
//		case 42: // WLT_IWIN
//		case 43: // WLT_WINCTRL
//		case 44: // WLT_IWINCTRL
//		case 45: // WLT_CTRL
//		case 46: // WLT_ICTRL
//		case 47: // WLT_HFFILE
//		case 48: // WLT_QUERY
//		case 49: // WLT_HFFIELD
//		case 50: // WLT_PARAM
//			// On ne sait pas convertir (et si ce n'est pas un DINO on a eu une erreur en WL)
//			return oValeur;
//		case 51: // WLT_INTERNE_1
//		case 52: // WLT_INTERNE_2
//		case 53: // WLT_DESCFILE
//		case 54: // WLT_DESCITEM
//		case 55: // WLT_DESCLINK
//		case 56: // WLT_HFLINK
//		case 57: // WLT_IOBJACODE
//		case 58: // WLT_DSTRX_ARR
//		case 59: // WLT_PROCSTOCK
//		case 60: // WLT_TYPE_DESC
//		case 61: // WLT_OBJET_PROC
//		case 62: // WLT_ASSOC
//			// On ne sait pas convertir (et si ce n'est pas un DINO on a eu une erreur en WL)
//			return oValeur;
//		case 63: // WLT_REPNAME
//		case 64: // WLT_INT_ARR
//		case 65: // WLT_POLICE
//		case 66: // WLT_HDC
//		case 67: // WLT_PROCNAME
//		case 68: // WLT_WINPROCNAME
//		case 69: // WLT_CONNEXION
//		case 70: // WLT_DESCCONNEXION
//		case 71: // WLT_VARIANTOLE
//		case 72: // WLT_OBJET_NET
//		case 73: // WLT_ANY_OBJET
//			// On ne sait pas convertir (et si ce n'est pas un DINO on a eu une erreur en WL)
//			return oValeur;
//		case 74: // WLT_NIVEAU_PILE
//		case 75: // WLT_UDSTR
//		case 76: // WLT_STRBIN
//		case 77: // WLT_AUB_STR
//		case 78: // WLT_AB_STR
//		case 79: // WLT_UB_STR
//		case 80: // WLT_AU_STR
//		case 82: // WLT_ANY_ARR
//		case 83: // WLT_TABANY
//		case 84: // WLT_CS_ELEM
//		case 85: // WLT_NOM_COMPOSANT
//		case 86: // WLT_AU_STR_ID
//		case 87: // WLT_ETENDU
//		case 88: // WLT_VARIABLE
//		case 89: // WLT_VAR_XSTR
//		case 90: // WLT_HORS_CONFIG
//		case 91: // WLT_IWINNAME
//		case 92: // WLT_QUESTION
//		case 93: // WLT_TYPESTRUCT
//		case 94: // WLT_TYPEBUFFER
//		case 95: // WLT_PROCNAME_ANY
//		case 96: // WLT_VARIABLE_VM
//		case 97: // WLT_ELEM_PILE
//		case 98: // WLT_PROCAJAX
//		case 99: // WLT_AUB_STR_ID
//		case 100: // WLT_VARTAB
//		case 101: // WLT_TESTNAME
//		case 102: // WLT_PAGENAME
//		case 103: // WLT_ARR_ASSOC
//		case 104: // WLT_UIX_SOUPLE
//		case 105: // WLT_TRIGGER_HF
//		case 106: // WLT_GROUPE_HF
//		case 107: // WLT_OBJET_JS
//			// On ne sait pas convertir (et si ce n'est pas un DINO on a eu une erreur en WL)
//			return oValeur;
//		case 108: // WLT_OBJET_BASE
//		case 109: // WLT_ACCES_DINO
		case 111: // WLT_DINO
			// Si on a un type : effectue une instanciation : oTypeGaucheEtendu est un pointeur sur le constructeur
			if (oTypeGaucheEtendu)
			{
				return new oTypeGaucheEtendu(oValeur);
			}
			// Sinon on ne sait pas convertir
			return oValeur;
//		case 112: // WLT_TABLEAU
//		case 113: // WLT_CONTENEUR
//		case 114: // WLT_PLANACTIONNAME
//		case 115: // WLT_SUBREPNAME
//		case 116: // WLT_SOURCENAME
//		case 117: // WLT_COLLSTOCK
//		case 118: // WLT_REQSTOCK
//		case 119: // WLT_GENOBJ
//		case 120: // WLT_ACTIONNAME
//		case 121: // WLT_DSTRW_LATIN
//		case 122: // WLT_PSTRW_LATIN
//		case 123: // WLT_IJAUGE
//		case 124: // WLT_INTERFACE
//		case 125: // WLT_AUB_STR_ARR
//		case 126: // WLT_DSTRW_ACP
//		case 127: // WLT_PSTRW_ACP
//		case 130: // WLT_DSTRW_CUR
//		case 131: // WLT_PSTRW_CUR
//		case 132: // WLT_ENTONNOIR
//		case 133: // WLT_IDINO
//		case 134: // WLT_SQLQUERYA
//		case 135: // WLT_ENUMERATION
//		case 136: // WLT_COMBINAISON
//		case 137: // WLT_OBJET_WINRT
//		case 138: // WLT_TYPE_CHAMP
//		case 139: // WLT_MULTI_VALEUR
//		case 140: // WLT_MULTI_TYPE
//		case 141: // WLT_APPEL_PROC
//		case 142: // WLT_TABLEAU_ANY
//		case 143: // WLT_OBJET_ANY

		default:
			// @@@ Erreur WL : Type non géré
			return oValeur;
		}
	};
})();
clWDUtil.__oConversionTypeDateHeure = function __oConversionTypeDateHeure(bDate, bHeure, oValeur, nTypeDroit/*, oTypeDroitEtendu*/)
{
	// Si on n'a pas de type Date en WL, on a un risque de ne pas avoir clWLangage. Dans ce cas on fait comme avant on retourne la valeur inchangée (sous forme d'une chaine)
	if (window.clWLangage)
	{
		// GP 16/03/2015 : TB91216/TB91683 : Accepte pas les date/heure/dateheure invalides : uniquement si on viens d'une autre date/heure (pour les date/heure invalide venu du serveur)
		var bAccepteInvalide;
		switch (nTypeDroit)
		{
		case 24: // WLT_DATEW
		case 128: // WLT_DATEA
		case 25: // WLT_TIMEW
		case 129: // WLT_TIMEA
		case 26: // WLT_DATETIME
			bAccepteInvalide = true;
			break;
		default:
			bAccepteInvalide = false;
			break;
		}
		return new clWLangage.WDDateHeure(bDate, bHeure, oValeur, undefined, bAccepteInvalide);
	}
	else
	{
		// GP 26/03/2015 : QW256551 : Bien sur il faut un return ici
		return oValeur;
	}
};
clWDUtil.__oConversionTypeNumerique = function __oConversionTypeNumerique(oValeur, nTypeGauche, oTypeGaucheEtendu, nTypeDroit, oTypeDroitEtendu)
{
	// Si on n'a pas de type Numérique en WL, on a un risque de ne pas avoir clWLangage. Dans ce cas on fait comme avant on retourne la valeur inchangée
	if (window.clWLangage)
	{
		switch (nTypeGauche)
		{
		case 5: // WLT_UI8
			return new clWLangage.WDUI8(oValeur);
		case 9: // WLT_I8
			return new clWLangage.WDI8(oValeur);
		case 13: // WLT_DECIMAL
			// GP 05/10/2015 : QW262677 : Pour le cas ou l'on ne recoit pas le paramètre (par exemple par WDTableColonne.prototype._voGetValeurDefaut) <= a corriger un jour
			clWDUtil.WDDebug.assert(undefined !== oTypeGaucheEtendu, "oTypeGaucheEtendu non renseigné");
			oTypeGaucheEtendu = oTypeGaucheEtendu || [0, 0];
			return new clWLangage.WDNumerique(oValeur, oTypeGaucheEtendu[0], oTypeGaucheEtendu[1]);
		case 14: // WLT_UIX
			return new clWLangage.WDI8(oValeur);
		default:
			clWDUtil.WDDebug.assert(false, "Type invalide");
			break;
		}
	}
	// GP 20/01/2016 : TB96142 : Pour faire comme avant il faut retourner un "nombre"
	switch (nTypeGauche)
	{
	case 5: // WLT_UI8
		// 4 = WLT_UI4
		return this.oConversionType(oValeur, 4, undefined, nTypeDroit, oTypeDroitEtendu);
	case 9: // WLT_I8
	case 14: // WLT_UIX
		// 8 = WLT_I4
		return this.oConversionType(oValeur, 8, undefined, nTypeDroit, oTypeDroitEtendu);
	default:
		clWDUtil.WDDebug.assert(false, "Type invalide");
		// Pas de break;
	case 13: // WLT_DECIMAL
		// 12 = WLT_R8
		return this.oConversionType(oValeur, 12, undefined, nTypeDroit, oTypeDroitEtendu);
	}
};

//// Conversion d'un tableau
//clWDUtil.__oConversionTypeTableau = function __oConversionTypeTableau(oTableau/*, nTypeGauche*//*, oTypeGaucheEtendu*//*, nTypeDroit*//*, oTypeDroitEtendu*/)
//{
//	// GP 15/01/2013 : Ne fait rien sur les tableaux car :
//	// - On fait trop de copies (y compris sur des opérateurs)
//	// - On détecte mal les tableaux d'objets (il ne faut pas faire la conversion des objets) mais il faut faire la conversion des sous tableaux
//	return oTableau;
////	// Seulement si l'élément est un tableau (sinon on a une erreur WL en WL)
////	// On n'utilise pas clWDTableau.__bEstTableau pour ne pas avoir de dépendance
////	if ("object" == typeof oTableau)
////	{
////		var i;
////		var nLimiteI = oTableau.length;
////		var oTableauConv = [];
////		for (i = 0; i < nLimiteI; i++)
////		{
////			// Pour fonctionner sur un tableau a plusieurs dimensions
////			var oValeur = oTableau[i];
////			if ("object" == typeof oValeur)
////			{
////				// On teste le fait que le sous tableau a une longeur pour détecter les objets et les tableaux
////				if (oValeur.length)
////				{
////					// Conversion d'un sous tableau
////					oTableauConv[i] = this.oConversionType(oValeur, nTypeGauche, oTypeGaucheEtendu, nTypeDroit, oTypeDroitEtendu);
////				}
////				else
////				{
////					oTableauConv[i] = oValeur;
////				}
////			}
////			else
////			{
////				// Conversion d'un élément
////				oTableauConv[i] = this.oConversionType(oTableau[i], oTypeGaucheEtendu, undefined, oTypeDroitEtendu, undefined);
////			}
////		}
////	}
////	else
////	{
////		// @@@ Erreur WL : La source n'est pas un tableau
////		return oTableau;
////	}
//};

//////////////////////////////////////////////////////////////////////////
// Opérations mathématiques

// Addition
clWDUtil.oAddition = function oAddition(oValeur1, oValeur2)
{
	// Les cas autorisés sont les suivants :
	// Date + Durée => Date
	// Heure + Durée => Heure
	// DateHeure + Durée => DateHeure
	// Durée + Date => Date
	// Durée + Heure => Heure
	// Durée + Dateheure => DateHeure
	// Durée + Durée => Durée
	// Durée + Entier => Durée
	// Entier + Durée => Durée

	// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique

	var oTypeValeur1 = this.oGetTypeEntendu(oValeur1);
	var oTypeValeur2 = this.oGetTypeEntendu(oValeur2);
	switch (oTypeValeur1)
	{
	case 24:
	case 25:
	case 26:
		// WLT_DATEW (et WLT_DATEA que l'on ne manipule pas en JS), WLT_TIMEW (et WLT_TIMEA que l'on ne manipule pas en JS) et WLT_DATETIME
		// On ne filtre pas si le type correspond exactement déjà fait en WL (et sinon tant pis)
		switch (oTypeValeur2)
		{
		case 27:
			return oValeur1.oAdditionDuree(oValeur2);
		}
		// Autre cas : addition sous forme de chaine
		// GP 27/03/2015 : Les exceptions ne traversent pas l'appel implicite de toString() en quirks + HTML4
		// => La première valeur est un WDDateHeure et la seconde valeur peut être un WDDateHeure
		oValeur1 = oValeur1.toString();
		oValeur2 = String(oValeur2);
		break;
	case 27:
		// WLT_DUREE
		switch (oTypeValeur2)
		{
		case 24:
		case 25:
		case 26:
			// WLT_DATEW (et WLT_DATEA que l'on ne manipule pas en JS), WLT_TIMEW (et WLT_TIMEA que l'on ne manipule pas en JS) et WLT_DATETIME
			// Inverse les opérandes (l'addition est commutative)
			return oValeur2.oAdditionDuree(oValeur1);
		case 27:
			// WLT_DUREE
			return oValeur1.oAdditionDuree(oValeur2);
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			if (oValeur2.bEstEntier())
			{
				return oValeur1.oAdditionEntier(oValeur2.toNumber());
			}
			break;
		case "number":
			if (oValeur2 === (oValeur2 | 0))
			{
				return oValeur1.oAdditionEntier(oValeur2);
			}
			break;
		}
		// Autre cas : addition sous forme de chaine
		// GP 27/03/2015 : Les exceptions ne traversent pas l'appel implicite de toString() en quirks + HTML4
		// => Inutile : aucune des deux valeur n'est un WDDateHeure
		break;
	case 5: // WLT_UI8
	case 9: // WLT_I8
	case 13: // WLT_DECIMAL
	// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//	case 14: // WLT_UIX
		switch (oTypeValeur2)
		{
		case 27:
			// WLT_DUREE
			// Inverse les opérandes (l'addition est commutative)
			if (oValeur1.bEstEntier())
			{
				return oValeur2.oAdditionEntier(oValeur1.toNumber());
			}
			break;
		case "number":
			// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique
			// GP 28/09/2015 : QW262321 : [0, 0] : Précision automatique
			oValeur2 = clWDUtil.__oConversionTypeNumerique(oValeur2, oTypeValeur1, [0, 0]);
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			return oValeur1.oAdditionNumerique(oValeur2);
		default:
			oValeur1 = oValeur1.toString();
			oValeur2 = String(oValeur2);
			break;
		}
		// Autre cas : simple addition avec le comportement par défaut.
		break;
	case "number":
		switch (oTypeValeur2)
		{
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique
			// GP 28/09/2015 : QW262321 : [0, 0] : Précision automatique
			return clWDUtil.__oConversionTypeNumerique(oValeur1, oTypeValeur2, [0, 0]).oAdditionNumerique(oValeur2);
		case 27:
			// WLT_DUREE
			// Inverse les opérandes (l'addition est commutative)
			if (oValeur1 === (oValeur1 | 0))
			{
				return oValeur2.oAdditionEntier(oValeur1);
			}
			break;
		}
		// Autre cas : simple addition avec le comportement par défaut.
		// GP 31/03/2015 : QW256806 : On ne force pas la conversion en chaine car sinon la somme de deux entiers devient une concaténation
		// Et aussi : entier + date/dateheure/heure est interdit en WL
		break;
	}

	// GP 27/03/2015 :
	return oValeur1 + oValeur2;
};

// Soustraction
clWDUtil.oSoustraction = function oSoustraction(oValeur1, oValeur2)
{
	// Les cas autorisés sont les suivants :
	// Date - Date => Durée
	// Date - Durée => Date
	// Heure - Heure => Durée
	// Heure - Durée => Heure
	// DateHeure - DateHeure => Durée
	// DateHeure - Durée => DateHeure
	// Durée - Durée => Durée

	// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique

	var oTypeValeur1 = this.oGetTypeEntendu(oValeur1);
	var oTypeValeur2 = this.oGetTypeEntendu(oValeur2);
	switch (oTypeValeur1)
	{
	case 24:
	case 25:
	case 26:
		// WLT_DATEW (et WLT_DATEA que l'on ne manipule pas en JS), WLT_TIMEW (et WLT_TIMEA que l'on ne manipule pas en JS) et WLT_DATETIME
		// On ne filtre pas si le type correspond exactement déjà fait en WL (et sinon tant pis)
		switch (oTypeValeur2)
		{
		case 24:
		case 25:
		case 26:
			// WLT_DATEW (et WLT_DATEA que l'on ne manipule pas en JS), WLT_TIMEW (et WLT_TIMEA que l'on ne manipule pas en JS) et WLT_DATETIME
			return oValeur1.oSoustractionDate(oValeur2);
		case 27:
			// WLT_DUREE
			return oValeur1.oSoustractionDuree(oValeur2);
		}
		// Autre cas : erreur en WL serveur
		oValeur1 = oValeur1.toString();
		oValeur2 = String(oValeur2);
		break;
	case 27:
		// WLT_DUREE
		// Les cas autorisés sont les suivants :
		switch (oTypeValeur2)
		{
		case 27:
			// WLT_DUREE => DateHeure - Durée => DateHeure
			return oValeur1.oSoustractionDuree(oValeur2);
		}
		// Autre cas : erreur en WL serveur
		oValeur1 = oValeur1.toString();
		oValeur2 = String(oValeur2);
		break;

	case 5: // WLT_UI8
	case 9: // WLT_I8
	case 13: // WLT_DECIMAL
	// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//	case 14: // WLT_UIX
		switch (oTypeValeur2)
		{
		case "number":
			// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique
			// GP 28/09/2015 : QW262321 : [0, 0] : Précision automatique
			oValeur2 = clWDUtil.__oConversionTypeNumerique(oValeur2, oTypeValeur1, [0, 0]);
			// Pas de break;
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			return oValeur1.oSoustractionNumerique(oValeur2);
		default:
			oValeur1 = oValeur1.toString();
			oValeur2 = String(oValeur2);
			break;
		}
		// Autre cas : simple soustraction avec le comportement par défaut.
		break;
	case "number":
		switch (oTypeValeur2)
		{
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique
			// GP 28/09/2015 : QW262321 : [0, 0] : Précision automatique
			return clWDUtil.__oConversionTypeNumerique(oValeur1, oTypeValeur2, [0, 0]).oSoustractionNumerique(oValeur2);
		}
		// Autre cas : simple soustraction avec le comportement par défaut.
		break;
	}

	return oValeur1 - oValeur2;
};

// Multiplication
clWDUtil.oMultiplication = function oMultiplication(oValeur1, oValeur2)
{
	// Les cas autorisés sont les suivants :
	// Durée * Nombre(Entier/Réel) => Durée
	// Nombre(Entier/Réel) * Durée => Durée

	var oTypeValeur1 = this.oGetTypeEntendu(oValeur1);
	var oTypeValeur2 = this.oGetTypeEntendu(oValeur2);
	switch (oTypeValeur1)
	{
	case 27:
		// WLT_DUREE
		switch (oTypeValeur2)
		{
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			return oValeur1.oMultiplicationNombre(oValeur2.toNumber());
		case "number":
			return oValeur1.oMultiplicationNombre(oValeur2);
		}
		// Autre cas : multiplication sous forme de chaine
		break;
	case 5: // WLT_UI8
	case 9: // WLT_I8
	case 13: // WLT_DECIMAL
	// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//	case 14: // WLT_UIX
		switch (oTypeValeur2)
		{
		case 27:
			// WLT_DUREE
			// Inverse les opérandes (la multiplication est commutative)
			return oValeur2.oMultiplicationNombre(oValeur1.toNumber());
		case "number":
			// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique
			// GP 28/09/2015 : QW262321 : [0, 0] : Précision automatique
			oValeur2 = clWDUtil.__oConversionTypeNumerique(oValeur2, oTypeValeur1, [0, 0]);
			// Pas de break;
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			return oValeur1.oMultiplicationNumerique(oValeur2);
		default:
			oValeur1 = oValeur1.toString();
			oValeur2 = String(oValeur2);
			break;
		}
		// Autre cas : multiplication sous forme de chaine
		break;
	case "number":
		switch (oTypeValeur2)
		{
		case 27:
			// WLT_DUREE
			// Inverse les opérandes (la multiplication est commutative)
			return oValeur2.oMultiplicationNombre(oValeur1);
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique
			// GP 28/09/2015 : QW262321 : [0, 0] : Précision automatique
			return clWDUtil.__oConversionTypeNumerique(oValeur1, oTypeValeur2, [0, 0]).oMultiplicationNumerique(oValeur2);
		}
		// Autre cas : multiplication sous forme de chaine
		break;
	}

	return oValeur1 * oValeur2;
};

// Division
clWDUtil.oDivision = function oDivision(oValeur1, oValeur2)
{
	// Les cas autorisés sont les suivants :
	// Durée / Durée => Réel
	// Durée / Nombre(Entier/Réel) => Durée

	var oTypeValeur1 = this.oGetTypeEntendu(oValeur1);
	var oTypeValeur2 = this.oGetTypeEntendu(oValeur2);
	switch (oTypeValeur1)
	{
	case 27:
		// WLT_DUREE
		switch (oTypeValeur2)
		{
		case 27:
			// WLT_DUREE
			return oValeur1.fDivisionDuree(oValeur2);
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			return oValeur1.oDivisionNombre(oValeur2.toNumber());
		case "number":
			return oValeur1.oDivisionNombre(oValeur2);
		}
		// Autre cas : division sous forme de chaine
		break;
	case 5: // WLT_UI8
	case 9: // WLT_I8
	case 13: // WLT_DECIMAL
	// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//	case 14: // WLT_UIX
		switch (oTypeValeur2)
		{
		case "number":
			// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique
			// GP 28/09/2015 : QW262321 : [0, 0] : Précision automatique
			oValeur2 = clWDUtil.__oConversionTypeNumerique(oValeur2, oTypeValeur1, [0, 0]);
			// Pas de break;
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			return oValeur1.xoDivisionNumerique(oValeur2);
		default:
			oValeur1 = oValeur1.toString();
			oValeur2 = String(oValeur2);
			break;
		}
		// Autre cas : division sous forme de chaine
		break;
	case "number":
		switch (oTypeValeur2)
		{
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique
			// GP 28/09/2015 : QW262321 : [0, 0] : Précision automatique
			return clWDUtil.__oConversionTypeNumerique(oValeur1, oTypeValeur2, [0, 0]).xoDivisionNumerique(oValeur2);
		}
		// Autre cas : multiplication sous forme de chaine
		break;
	}

	return oValeur1 / oValeur2;
};

// Modulo
clWDUtil.oModulo = function oModulo(oValeur1, oValeur2)
{
	var oTypeValeur1 = this.oGetTypeEntendu(oValeur1);
	var oTypeValeur2 = this.oGetTypeEntendu(oValeur2);
	switch (oTypeValeur1)
	{
	case 5: // WLT_UI8
	case 9: // WLT_I8
	case 13: // WLT_DECIMAL
	// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//	case 14: // WLT_UIX
		switch (oTypeValeur2)
		{
		case "number":
			// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique
			// GP 28/09/2015 : QW262321 : [0, 0] : Précision automatique
			oValeur2 = clWDUtil.__oConversionTypeNumerique(oValeur2, oTypeValeur1, [0, 0]);
			// Pas de break;
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			return oValeur1.xoModuloNumerique(oValeur2);
		default:
			oValeur1 = oValeur1.toString();
			oValeur2 = String(oValeur2);
			break;
		}
		// Autre cas : division sous forme de chaine
		break;
	case "number":
		switch (oTypeValeur2)
		{
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
		// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			// Dans une opération qui implique un numérique et un nombre, le format de l'opération est en numerique
			// GP 28/09/2015 : QW262321 : [0, 0] : Précision automatique
			return clWDUtil.__oConversionTypeNumerique(oValeur1, oTypeValeur2, [0, 0]).xoModuloNumerique(oValeur2);
		}
		// Autre cas : multiplication sous forme de chaine
		break;
	}

	return oValeur1 % oValeur2;
};

//////////////////////////////////////////////////////////////////////////
// Opérations diverses (par ordre alphabétiques)

(function ()
{
	"use strict";

	// Objets avec les fonctions selon que la valeur est un numérique ou autre chose
	var ms_oOperations =
	{
		oAbsolue: function oAbsolue(oValeur) { return Math.abs(oValeur); },
		oArrondi: function oArrondi(oValeur, nPrecision)
		{
			// Math.round fait l'arrondi de -1.5 en -1 alors que l'arrondi du WL serveur fait :
			// -1.9 => -2, -1.5 => -2, -1.1 => -1, 1.1 => 1, 1.5 => 2, 1.9 => 2
			var nFacteur = (oValeur < 0) ? -1 : 1;

			// On deplace dans la partie entiere les decimales a conserver
			// On coupe la partie decimale restante
			// On redecale les decimales stockees auparavant
			var nDecalage = Math.pow(10, nPrecision) * nFacteur;
			return Math.round(oValeur * nDecalage) / nDecalage;
		},
		// Si la valeur est négative, Math.floor va vers le bas au lieu de vers le haut
		nArrondiVersZero: function nArrondiVersZero(oValeur) { return ((0 <= oValeur) ? Math.floor : Math.ceil)(oValeur); },
		bEstNegatif: function bEstNegatif(oValeur) { return oValeur < 0; },
//		bEstPair: function bEstPair(oValeur) { return 0 == (oValeur % 2); },
		bEstPair: function bEstPair(oValeur) { return 0 == (oValeur & 0x1); },
		nLog10Arrondi: function nLog10Arrondi(oValeur) { return Math.floor(Math.log(oValeur) / Math.LN10); },
		oPartieEntiere: function oPartieEntiere(oValeur) { return Math.floor(oValeur); },
		oArrondiInferieur : function oArrondiInferieur(oValeur, nPrecision)
		{
			var nDecalage = nPrecision === undefined ? 1 : Math.pow(10, nPrecision);
			return Math.floor(oValeur * nDecalage) / nDecalage;
		},
		oArrondiSuperieur : function oArrondiSuperieur(oValeur,nPrecision)
		{
			var nDecalage = nPrecision === undefined ? 1 : Math.pow(10, nPrecision);
			return Math.ceil(oValeur * nDecalage)/ nDecalage;
		}
	};
	var ms_oOperationsNumeriques =
	{
		oAbsolue: function oAbsolue(oValeur) { return oValeur.oAbsolue(); },
		oArrondi: function oArrondi(oValeur, nPrecision) { return oValeur.oArrondi(nPrecision); },
		nArrondiVersZero: function nArrondiVersZero(oValeur) { return oValeur.nArrondiVersZero(); },
		bEstNegatif: function bEstNegatif(oValeur) { return oValeur.bEstNegatif(); },
		bEstPair: function bEstPair(oValeur) { return oValeur.bEstPair(); },
		nLog10Arrondi: function nLog10Arrondi(oValeur) { return oValeur.nLog10Arrondi(); },
		oPartieEntiere: function oPartieEntiere(oValeur) { return oValeur.oPartieEntiere(); }
	};

	function __oGetOperations(oValeur)
	{
		// GP 22/09/2015 : Gestion des numériques
		switch (clWDUtil.oGetTypeEntendu(oValeur))
		{
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
			// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			return ms_oOperationsNumeriques;
		default:
			return ms_oOperations;
		}
	}

	// Valeur absolue
	clWDUtil.oAbsolue = function oAbsolue(oValeur)
	{
		return __oGetOperations(oValeur).oAbsolue(oValeur);
	};

	// Arrondi du WL
	clWDUtil.oArrondi = function oArrondi(oValeur, nPrecision)
	{
		// Ce n'est plus WDJS qui ajoute le paramètre optionnel
		if (undefined === nPrecision)
		{
			nPrecision = 0;
		}

		return __oGetOperations(oValeur).oArrondi(oValeur, nPrecision);
	};
	clWDUtil.oArrondiInferieur = function oArrondiInferieur(oValeur, nPrecision)
	{
		// Ce n'est plus WDJS qui ajoute le paramètre optionnel
		if (undefined === nPrecision)
		{
			nPrecision = 0;
		}

		return __oGetOperations(oValeur).oArrondiInferieur(oValeur, nPrecision);
	};
	clWDUtil.oArrondiSuperieur = function oArrondiSuperieur(oValeur, nPrecision)
	{
		// Ce n'est plus WDJS qui ajoute le paramètre optionnel
		if (undefined === nPrecision)
		{
			nPrecision = 0;
		}

		return __oGetOperations(oValeur).oArrondiSuperieur(oValeur, nPrecision);
	};

	// Arrondi vers 0 : si la valeur est négative, Math.floor va vers le bas au lieu de vers le haut
	clWDUtil.nArrondiVersZero = function nArrondiVersZero(oValeur)
	{
		return __oGetOperations(oValeur).nArrondiVersZero(oValeur);
	};

	// Si le nombre est négatif (pas d'appel depuis le WL)
	clWDUtil.bEstNegatif = function bEstNegatif(oValeur)
	{
		return __oGetOperations(oValeur).bEstNegatif(oValeur);
	};

	// Indique si un nombre est pair ou impair
	clWDUtil.bEstPair = function bEstPair(oValeur)
	{
		return __oGetOperations(oValeur).bEstPair(oValeur);
	};
	clWDUtil.bEstImpair = function bEstImpair(oValeur)
	{
		return !this.bEstPair(oValeur);
	};

	// Log10
	clWDUtil.nLog10Arrondi = function nLog10Arrondi(oValeur)
	{
		return __oGetOperations(oValeur).nLog10Arrondi(oValeur);
	};

	// Calcul le maximum d'une série de nombres
	function __oMinMax(tabArguments, bMin)
	{
		// On a forcément plusieurs arguments (vérifié en WL)
		var oChoix;
		clWDUtil.bForEach(tabArguments, function (oArgument)
		{
			// On modifie le choix si :
			// - On est sur le premier argument
			// - La comparaison réussie.
			// bComparaison vérifie oChoix < oArgument, donc pour :
			// Min : on veux oArgument < oChoix donc bNot a true
			// Max : on veux oChoix < oArgument donc bNot a false
			if ((undefined === oChoix) || clWDUtil.bComparaison(oChoix, oArgument, false, bMin, false, false))
			{
				oChoix = oArgument;
			}
			return true;
		});
		return oChoix;
	}
	clWDUtil.oMax = function oMax()
	{
		return __oMinMax(arguments, false);
	};
	clWDUtil.oMin = function oMin()
	{
		return __oMinMax(arguments, true);
	};

	// Partie entière et partie décimale
	clWDUtil.oPartieEntiere = function oPartieEntiere(oValeur)
	{
		// Comportement sur les nombres négatifs : la partie entière de -3.5 est -4
		return __oGetOperations(oValeur).oPartieEntiere(oValeur);
	};
	clWDUtil.oPartieDecimale = function oPartieDecimale(oValeur)
	{
		// Calcule Abs(x)- PartieEntière(Abs(X))
		var oValeurAbsolue = this.oAbsolue(oValeur);
		return this.oSoustraction(oValeurAbsolue, this.oPartieEntiere(oValeurAbsolue));
	};
})();

//////////////////////////////////////////////////////////////////////////
// Comparaison

(function ()
{
	"use strict";

	function __oPreparePourComparaison(oValeur, bSouple, bForceChaine)
	{
		return __oPreparePourComparaisonAvecType(oValeur, bSouple, bForceChaine, clWDUtil.oGetTypeEntendu(oValeur), undefined)
	}

	function __oPreparePourComparaisonAvecType(oValeur, bSouple, bForceChaine, oTypeValeur, oTypeValeurAutre)
	{
		// Par sécurité, force la conversion des valeurs du framework V2 vers le type natif
		var iValeurBase;
		if (window.NSPCS && (iValeurBase = NSPCS.iGetAsBase(oValeur)))
		{
			oValeur = iValeurBase.valueOf();
		}

		var oValeurPourNumerique = oValeur;
		switch (oTypeValeur)
		{
		case 1: // WLT_BOOL
			oValeurPourNumerique = oValeur ? "1" : "0";
		// Pas de break
		case 2: // WLT_UI1
		case 3: // WLT_UI2
		case 4: // WLT_UI4
		case 6: // WLT_I1
		case 7: // WLT_I2
		case 8: // WLT_I4
		case 11: // WLT_R4
		case 12: // WLT_R8
//		case 15: // WLT_HWND
			// Si l'autre valeur est un numérique, on fait la conversion du nombre en numérique
			switch (oTypeValeurAutre)
			{
			case 5: // WLT_UI8
			case 9: // WLT_I8
			case 13: // WLT_DECIMAL
			// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
			case 14: // WLT_UIX
				return __oPreparePourComparaisonNumerique(oValeurPourNumerique);
			}
			break;
		case 5: // WLT_UI8
		case 9: // WLT_I8
		case 13: // WLT_DECIMAL
			// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
//		case 14: // WLT_UIX
			// Vu avec YB : La comparaison impliquant des numériques est la suivante :
			// - Comparaison avec un type "chaine" => Conversion du numérique en chaine et comparaison lexicographique
			// - Comparaison avec un type "numérique" (= dans le sens type avec nombre dedans (ce qui inclus les booléesn) => Conversion en numérique et comparaison numérique
			switch (oTypeValeurAutre)
			{
			case 1: // WLT_BOOL
				oValeurPourNumerique = oValeur ? "1" : "0";
			case 2: // WLT_UI1
			case 3: // WLT_UI2
			case 4: // WLT_UI4
			case 5: // WLT_UI8
			case 6: // WLT_I1
			case 7: // WLT_I2
			case 8: // WLT_I4
			case 9: // WLT_I8
			case 11: // WLT_R4
			case 12: // WLT_R8
			case 13: // WLT_DECIMAL
//			case 14: // WLT_UIX
//			case 15: // WLT_HWND
				// oGetTypeEntendu retourne WLT_I8 pour WLT_UIX
				return __oPreparePourComparaisonNumerique(oValeurPourNumerique);
			default:
				return oValeur.toString();
			}
		case 24:
		case 25:
		case 26:
			// WLT_DATEW (et WLT_DATEA que l'on ne manipule pas en JS), WLT_TIMEW (et WLT_TIMEA que l'on ne manipule pas en JS) et WLT_DATETIME
			return oValeur.toStringAvecInvalide();
		case 27:
			// WLT_DUREE
			// GP 23/10/2014 : QW250417 : Cast en chaine si l'autre opérateur est une chaine
			if (oTypeValeurAutre == "string")
			{
				return oValeur.toString();
			}
			else
			{
				return oValeur.m_nValeur;
			}
		}

		if (bSouple)
		{
			// GP 17/11/2013 : QW238613 : On doit gérer le cas ou la valeur n'est pas une chaine
			return clWDUtil.sSupprimeEspacesDebutFin(oValeur).toUpperCase();
		}
		else if (bForceChaine && ("string" != typeof oValeur))
		{
			return String(oValeur);
		}
		else
		{
			return oValeur;
		}
	}

	function __oPreparePourComparaisonNumerique(oValeur)
	{
		// La comparaison numérique formate le nombre sous la forme d'une chaine :
		// - Signe (toujours)
		// - Partie entière avec des 0 sur le nombre maximal de la precision.
		// - "."
		// - Partie décimale avec des 0 sur le nombre maximal de la precision.
		// 77 : 38 * 2 + 1
		var sValeur = clWDUtil.sNumeriqueVersChaine(oValeur, "+077.38f");

		// L'ordre lexico graphique nous pose ensuite un problème pour les nombres négatifs :
		// - Le signe : "+" < "-". Donc on remplace "+" par "B" et "-" par "A" pour avoir "A" < "B".
		// - Les chiffres doivent aussi être tranformées car -2 < -1 mais "1" < "2". On remplace donc 0 par 9, 1 par 8, ... 8 par 1 et 9 par 0.
		// (il n'y a pas de problème si on compare un nombre négatif avec un nombre positif car le signe au début fait la différence).
		sValeur = sValeur.replace(/[\-]/g, "A").replace(/[\+]/g, "B");

		// oValeur n'est pas forcément un numérique
		if (clWDUtil.bEstNegatif(oValeur))
		{
			// Pour avoir le code du nouveau caractère il faut : <Code de 9> - <Code de caractère> + <Code de 0>
			// Ce qui est équivalent : <Code de 9> + <Code de 0> - <Code de caractère>
			var nBase = "9".charCodeAt(0) + "0".charCodeAt(0);
			sValeur = sValeur.replace(/\d/g, function (sCaractere) { return String.fromCharCode(nBase - sCaractere.charCodeAt(0)); });
		}

		return sValeur;
	}

	// Comparaison de deux valeurs.
	// Permet la comparaison des types Date, Heure, DateHeure et Durée
	// Parametres selon les opérateurs
	//			Equivalent	bEgal	bNot	bSouple	bInverse
	// x = y				true	false	false	false
	// x ~= y				true	false	true	false
	// x <> y	!(x = y)	true	true	false	false
	// x < y				false	false	false	false
	// x <= y	!(y < x)	false	true	false	true
	// x > y	y < x		false	false	false	true
	// x >= y	!(x < y)	false	true	false	false
	clWDUtil.bComparaison = function bComparaison(oValeur1, oValeur2, bEgal, bNot, bSouple, bInverse)
	{
		// Préparation des parametres
		var oTypeValeur1 = clWDUtil.oGetTypeEntendu(oValeur1);
		var oTypeValeur2 = clWDUtil.oGetTypeEntendu(oValeur2);
		oValeur1 = __oPreparePourComparaisonAvecType(oValeur1, bSouple, false, oTypeValeur1, oTypeValeur2);
		oValeur2 = __oPreparePourComparaisonAvecType(oValeur2, bSouple, false, oTypeValeur2, oTypeValeur1);

		if (bInverse)
		{
			var oTmp = oValeur1;
			oValeur1 = oValeur2;
			oValeur2 = oTmp;
		}

		// Effectue la comparaison
		var bRes = bEgal ? (oValeur1 == oValeur2) : (oValeur1 < oValeur2);
		return bNot ? !bRes : bRes;
	};

	// Vérification des intervalles
	clWDUtil.bIntervalle = function bIntervalle(oValeur1, bAvecEgal1, oValeur2, bAvecEgal2, oValeur3)
	{
		function bCompare(oValeurA, bAvecEgal, oValeurB)
		{
			return bAvecEgal ? oValeurA <= oValeurB : oValeurA < oValeurB;
		}
		return bCompare(oValeur1, bAvecEgal1, oValeur2) && bCompare(oValeur2, bAvecEgal2, oValeur3);
	};

	// Récupère la méthode de comparaison
	clWDUtil.nRechercheDefaut = -1;
	clWDUtil.nRechercheCommencePar = 0;
	clWDUtil.nRechercheIdentique = 1;
	clWDUtil.nRechercheContient = 2;
	clWDUtil.fGetCompare = function fGetCompare(nTypeRecherche)
	{
		// @@@ : Selon le type de la colonne et ses options
		switch (nTypeRecherche)
		{
		case this.nRechercheCommencePar:
			return __nCompareChaineCommencePar;
		case this.nRechercheIdentique:
			return __nCompare;
		case this.nRechercheContient:
			// Attention ne peut pas être utilisé pour la comparaison d'un tri
			return function (sValeur1, sValeur2) { return __bChaineContient(sValeur1, sValeur2) ? 0 : -1; };
		}
	};

	// Comparaison simple de chaines
	function __nCompare(sValeur1, sValeur2)
	{
		if (sValeur1 < sValeur2)
		{
			return -1;
		}
		else if (sValeur1 > sValeur2)
		{
			return 1;
		}
		else
		{
			return 0;
		}
	};

	// Comparaison simple de n'importe quoi (place undefined plus grand que tout le monde (placé à la fin en cas de tri))
	function __nCompareDivers(oValeur1, oValeur2)
	{
		if (undefined !== oValeur1)
		{
			if (undefined !== oValeur2)
			{
				// Comparaison classique
				return __nCompare(oValeur1, oValeur2);
			}
			else
			{
				// On a oValeur1 valide et oValeur2 undefined : oValeur2 est donc plus grand que oValeur1 selon la règle de undefined plus grand que tout
				return -1;
			}
		}
		else
		{
			if (undefined !== oValeur2)
			{
				// On a oValeur1 undefined et oValeur2 valide : oValeur1 est donc plus grand que oValeur2 selon la règle de undefined plus grand que tout
				return 1;
			}
			else
			{
				// On a oValeur1 undefined et oValeur2 undefined : égalité
				return 0;
			}
		}
	}
	clWDUtil.__s_nCompareDivers = __nCompareDivers;
	function __nCompareDiversInverse(oValeur1, oValeur2)
	{
		return __nCompareDivers(oValeur2, oValeur1);
	}
	clWDUtil.__s_nCompareDiversInverse = __nCompareDiversInverse;

	// Comparaison "commence par"
	// GP 18/10/2014 : Ajout de bSouple
	function __nCompareChaineCommencePar(sValeur1, sValeur2, bSouple)
	{
		sValeur1 = __oPreparePourComparaison(sValeur1, bSouple, true);
		sValeur2 = __oPreparePourComparaison(sValeur2, bSouple, true);
		var nLongueur2 = sValeur2.length;
		if (sValeur1.length <= nLongueur2)
		{
			// nLongueur1 < nLongueur2
			// => sValeur1 ne peut pas commencer par sValeur2 : fait la comparaison directe des chaines pour avoir l'ordre
			// nLongueur1 == nLongueur2
			// => sValeur1 a la même longueur que sValeur2 : fait la comparaison directe des chaines pour avoir l'ordre
			return __nCompare(sValeur1, sValeur2);
		}
		else
		{
			return __nCompare(sValeur1.substr(0, nLongueur2), sValeur2);
		}
	}

	// Comparaison "fini par"
	// GP 18/10/2014 : Ajout de bSouple
	function __nCompareChaineFiniPar(sValeur1, sValeur2, bSouple)
	{
		sValeur1 = __oPreparePourComparaison(sValeur1, bSouple, true);
		sValeur2 = __oPreparePourComparaison(sValeur2, bSouple, true);
		var nLongueur1 = sValeur1.length;
		var nLongueur2 = sValeur2.length;
		if (nLongueur1 <= nLongueur2)
		{
			// nLongueur1 < nLongueur2
			// => sValeur1 ne peut pas finir par sValeur2 : fait la comparaison directe des chaines pour avoir l'ordre
			// nLongueur1 == nLongueur2
			// => sValeur1 a la même longueur que sValeur2 : fait la comparaison directe des chaines pour avoir l'ordre
			return __nCompare(sValeur1, sValeur2);
		}
		else
		{
			return __nCompare(sValeur1.substring(nLongueur1 - nLongueur2), sValeur2);
		}
	}

	// Comparaison "contient"
	// Ne retourne que 0 ou -1 (pas 1)
	function __bChaineContient(sValeur1, sValeur2)
	{
		return -1 !== __oPreparePourComparaison(sValeur1, false, true).indexOf(sValeur2);
	};

	// Opérateur pour le filtre
	clWDUtil.s_bEgal = function s_bEgal(sValeur1, sValeur2)
	{
		return 0 === __nCompare(sValeur1, sValeur2);
	};
	// GP 18/10/2014 : Ajout de bSouple
	clWDUtil.s_bCommencePar = function s_bCommencePar(sValeur1, sValeur2, bSouple)
	{
		return 0 === __nCompareChaineCommencePar(sValeur1, sValeur2, bSouple);
	};
	// GP 18/10/2014 : Ajout de bSouple
	clWDUtil.s_bContient = function s_bContient(sValeur1, sValeur2, bSouple)
	{
		return -1 !== __oPreparePourComparaison(sValeur1, bSouple, true).indexOf(__oPreparePourComparaison(sValeur2, bSouple, false));
	};
	// GP 18/10/2014 : Ajout de bSouple
	clWDUtil.s_bTerminePar = function s_bTerminePar(sValeur1, sValeur2, bSouple)
	{
		return 0 === __nCompareChaineFiniPar(sValeur1, sValeur2, bSouple);
	};
	clWDUtil.s_bDifferent = function s_bDifferent(sValeur1, sValeur2)
	{
		return 0 !== __nCompare(sValeur1, sValeur2);
	};
	clWDUtil.s_bNeCommencePasPar = function s_bNeCommencePasPar(sValeur1, sValeur2)
	{
		return 0 !== __nCompareChaineCommencePar(sValeur1, sValeur2);
	};
	clWDUtil.s_bNeContientPas = function s_bNeContientPas(sValeur1, sValeur2)
	{
		return !clWDUtil.s_bContient(sValeur1, sValeur2);
	};
	clWDUtil.s_bNeTerminePasPar = function s_bNeTerminePasPar(sValeur1, sValeur2)
	{
		return 0 !== __nCompareChaineFiniPar(sValeur1, sValeur2);
	};
	clWDUtil.s_bSuperieur = function s_bSuperieur(sValeur1, sValeur2)
	{
		return 0 < __nCompare(sValeur1, sValeur2);
	};
	clWDUtil.s_bSuperieurOuEgal = function s_bSuperieurOuEgal(sValeur1, sValeur2)
	{
		return 0 <= __nCompare(sValeur1, sValeur2);
	};
	clWDUtil.s_bInferieur = function s_bInferieur(sValeur1, sValeur2)
	{
		return __nCompare(sValeur1, sValeur2) < 0;
	};
	clWDUtil.s_bInferieurOuEgal = function s_bInferieurOuEgal(sValeur1, sValeur2)
	{
		return __nCompare(sValeur1, sValeur2) <= 0;
	};
})();

// Conversion d'une valeur "durée" du WL en valeur en valeur interne :
// - Accepte le type durée comme une valeur en millièmes de secondes.
// - Accepte les données du WL comme une valeur en centièmes ou millième de secondes.
// - Sort un entier en centièmes (pour une fonction du framework) ou millièmes (pour une fonction native)
clWDUtil.nGetDuree = function nGetDuree(oValeurWL, bEntreeMs, bSortieMs)
{
	var nDuree = 0;
	if (window.clWLangage && (oValeurWL instanceof clWLangage.WDDuree))
	{
		// C'est une durée du framework V1 : lecture de la valeur interne.
		nDuree = oValeurWL.m_nValeur;
		// La valeur interne est en millisecondes. Consièdre que la valeur d'entrée est en ms.
		bEntreeMs = true;
	}
	else if (window.NSPCS && NSPCS.NSTypes.bIsDuree(oValeurWL))
	{
		// C'est une durée du framework V2 : lecture de la valeur interne.
		nDuree = oValeurWL.vnToNumber();
		// La valeur interne est en millisecondes. Consièdre que la valeur d'entrée est en ms.
		bEntreeMs = true;
	}
	else
	{
		// C'est autre chose venu du WL : conversion en entier.
		nDuree = oValeurWL * 1;
	}

	// Adapte la valeur reçu à la valeur attendu.
	if (bEntreeMs == bSortieMs)
	{
		return nDuree;
	}
	else if (bSortieMs)
	{
		// bEntreeMs est forcément faux
		return nDuree * 10;
	}
	else
	{
		// bEntreeMs est forcément vrai
		// Normalement n'arrive pas avec une valeur normale mais peut arriver avec une durée
		return Math.round(nDuree / 10);
	}
};

(function ()
{
	"use strict";

	// Conversion d'une couleur TSL en RVB
	// Version interne avec arrondi optionnel et qui complete un tableau
	function __TSL2RVB(dTeinte, dSaturation, dLuminosite, pfArrondi, tabRVBA_OUT)
	{
		if (0 == dSaturation)
		{
			// Blanc, gris, noir ?
			tabRVBA_OUT[0] = tabRVBA_OUT[1] = tabRVBA_OUT[2] = pfArrondi(dLuminosite * 255);
		}
		else
		{
			var d2;
			if (dLuminosite < 0.5)
			{
				d2 = dLuminosite * (1 + dSaturation)
			}
			else
			{
				d2 = dLuminosite * (1 - dSaturation) + dSaturation
			}
			var d1 = 2 * dLuminosite - d2;
			tabRVBA_OUT[0] = __nCalculeComposanteTSL2RVB(d1, d2, dTeinte + 120, pfArrondi);
			tabRVBA_OUT[1] = __nCalculeComposanteTSL2RVB(d1, d2, dTeinte, pfArrondi);
			tabRVBA_OUT[2] = __nCalculeComposanteTSL2RVB(d1, d2, dTeinte - 120, pfArrondi);
		}
	}
	function __nCalculeComposanteTSL2RVB(d1, d2, dTRel, pfArrondi)
	{
		// Assure que l'angle relatif à la compostante (R, V ou B) est entre 0 et 360°
		dTRel -= Math.floor(dTRel / 360) * 360;

		var dComposante;
		if (dTRel < 60)
		{
			dComposante = d1 + (d2 - d1) * dTRel / 60;
		}
		else if (dTRel < 180)
		{
			dComposante = d2;
		}
		else if (dTRel < 240)
		{
			dComposante = d1 + (d2 - d1) * (240 - dTRel) / 60;
		}
		else
		{
			dComposante = d1;
		}
		return pfArrondi(dComposante * 255);
	}

	// Conversion d'une couleur RVB en TSL dans un tableau [Teinten, Saturation, Luminosite] respectivement chacune sur [0, 360[, [0, 1] et [0, 1]
	clWDUtil.tabRVBA2TSLA = function tabRVBA2TSLA(tabRVBA)
	{
		var tabTSLA = [0, 0, 0, tabRVBA[3]];
		// Min et max sur [0, 255]
		var dMin255 = Math.min(tabRVBA[0], tabRVBA[1], tabRVBA[2]);
		var dMax255 = Math.max(tabRVBA[0], tabRVBA[1], tabRVBA[2]);
		var dDiff255 = dMax255 - dMin255;
		// Précalcul de nMax + nMin et nMax - nMin
		var dDiff = dDiff255 / 255;
		var dSomme = (dMax255 + dMin255) / 255;

		// Luminosite
		// L = (M + m) / 2
		tabTSLA[2] = dSomme / 2;
		if (dMax255 == dMin255)
		{
			// Gris (la saturation est de 0). Cette valeur n'a aucune importance
			tabTSLA[1] = 0;
			tabTSLA[0] = 0;
		}
		else
		{
			// Saturation
			// S = (M - m) / (M + m) ou S = (M - m) / (2 - M - m)
			tabTSLA[1] = dDiff / ((dSomme < 1) ? dSomme : (2 - dSomme));
			// Teinte
			// T = 60 + (V - B) / (M - m) si M = R
			// T = 120 + (B - R) / (M - m) si M = V
			// T = 240 + (V - B) / (M - m) si M = B
			// R, V et B sont sur [0, 255], mais cela n'a pas d'importance car on divise par dMax255 - dMin255 qui est sur [0, 255] aussi
			if (dMax255 == tabRVBA[0])
			{
				tabTSLA[0] = 6 + (tabRVBA[1] - tabRVBA[2]) / dDiff255;
			}
			else if (dMax255 == tabRVBA[1])
			{
				tabTSLA[0] = 2 + (tabRVBA[2] - tabRVBA[0]) / dDiff255;
			}
			else
			{
				tabTSLA[0] = 4 + (tabRVBA[0] - tabRVBA[1]) / dDiff255;
			}
			tabTSLA[0] *= 60;
			tabTSLA[0] -= Math.floor(tabTSLA[0] / 360) * 360;
		}
		return tabTSLA;
	};

	clWDUtil.TSLA2RVBA = function TSLA2RVBA(tabTSLA, tabRVBA_OUT)
	{
		tabRVBA_OUT[3] = tabTSLA[3];
		__TSL2RVB(tabTSLA[0], tabTSLA[1], tabTSLA[2], this.m_pfIdentite, tabRVBA_OUT);
	};

	// Conversion d'une couleur HTML en couleur RVBA dans un tableau [Rouge, Vert, Bleu, Opacité] :
	// - Les couleurs sont des réels dans [0, 255]
	// - L'opacité est un réel dans [0, 1]
	// Accepte les formats suivants :
	// - #RVB
	// - #RRVVBB
	// - rgb(R, V, B)
	// - rgba(R, V, B, A)
	// - hsl(T, S, L)
	// - hsla(T, S, L, A)
	// En CSS 3 :
	// - R, V et B sont des nombres dans [0, 255] ou un pourcentage dans [0%, 100%]
	// - A est un nombre dans [0, 1]
	// - T est un nombre dans [0, 360[
	// - S et L sont des pourcentage dans [0%, 100%]
	var ms_oRegExpRGB = new RegExp("rgb\\(\\s*(.*)\\s*,\\s*(.*)\\s*,\\s*(.*)\\s*\\)", "");
	var ms_oRegExpRGBA = new RegExp("rgba\\(\\s*(.*)\\s*,\\s*(.*)\\s*,\\s*(.*)\\s*,\\s*(.*)\\s*\\)", "");
	var ms_oRegExpTSL = new RegExp("hsl\\(\\s*(.*)\\s*,\\s*(.*)\\s*,\\s*(.*)\\s*\\)", "");
	var ms_oRegExpTSLA = new RegExp("hsla\\(\\s*(.*)\\s*,\\s*(.*)\\s*,\\s*(.*)\\s*,\\s*(.*)\\s*\\)", "");
//	var ms_oCouleurHTML2RVBA =
//	{
//		// Spécial
//		"transparent" : [0, 0, 0, 0],
//		// CSS 1
//		"silver" : [192, 192, 192, 0],
//		"gray" : [128, 128, 128, 0],
//		"white" : [255, 255, 255, 0],
//		"maroon" : [128, 0, 0, 0],
//		"red" : [255, 0, 0, 0],
//		"purple" : [128, 0, 128, 0],
//		"fuchsia" : [255, 0, 255, 0],
//		"green" : [0, 128, 0, 0],
//		"lime" : [0, 255, 0, 0],
//		"olive" : [128, 128, 0, 0],
//		"yellow" : [255, 255, 0, 0],
//		"navy" : [0, 0, 128, 0],
//		"blue" : [0, 0, 255, 0],
//		"teal" : [0, 128, 128, 0],
//		"aqua" : [0, 255, 255, 0],
//		// CSS 2
//		"orange" : [255, 165, 0, 0]
////		// CCS 3
////		"aliceblue" : [240, 0xf8, 255, 0],
////		"antiquewhite" : [0xfa, 0xeb, 0xd7, 0],
////		"aquamarine" : [0x7f, 255, 0xd4, 0],
////		"azure" : [240, 255, 255, 0],
////		"beige" : [0xf5, 0xf5, 0xdc, 0],
////		"bisque" : [255, 0xe4, 0xc4, 0],
////		"blanchedalmond" : [255, 0xe4, 0xc4, 0],
////		"blueviolet" : [0x8a, 0x2b, 0xe2, 0],
////		"brown" : [165, 0x2a, 0x2a, 0],
////		"burlywood" : [0xde, 0xb8, 0x87, 0],
////		"cadetblue" : [0x5f, 0x9e, 0xa0, 0],
////		"chartreuse" : [0x7f, 255, 0, 0],
////		"chocolate" : [0xd2, 0x69, 0x1e, 0],
////		"coral" : [255, 0x7f, 0x50, 0],
////		"cornflowerblue" : [0x64, 0x95, 0xed, 0],
////		"cornsilk" : [255, 0xf8, 0xdc, 0],
////		"crimson" : [0xdc, 0x14, 0x3c, 0],
////		"darkblue" : [0, 0, 0x8b, 0],
////		"darkcyan" : [0, 0x8b, 0x8b, 0],
////		"darkgoldenrod" : [0xb8, 0x86, 0x0b, 0],
////		"darkgray" : [0xa9, 0xa9, 0xa9, 0],
////		"darkgreen" : [0, 0x64, 0, 0],
////		"darkgrey" : [0xa9, 0xa9, 0xa9, 0],
////		"darkkhaki" : [0xbd, 0xb7, 0x6b, 0],
////		"darkmagenta" : [0x8b, 0, 0x8b, 0],
////		"darkolivegreen" : [0x55, 0x6b, 47, 0],
////		"darkorange" : [255, 0x8c, 0, 0],
////		"darkorchid" : [0x99, 0x32, 0xcc, 0],
////		"darkred" : [0x8b, 0, 0, 0],
////		"darksalmon" : [0xe9, 0x96, 0x7a, 0],
////		"darkseagreen" : [0x8f, 0xbc, 0x8f, 0],
////		"darkslateblue" : [0x48, 0x3d, 0x8b, 0],
////		"darkslategray" : [47, 0x4f, 0x4f, 0],
////		"darkslategrey" : [47, 0x4f, 0x4f, 0],
////		"darkturquoise" : [0, 0xce, 0xd1, 0],
////		"darkviolet" : [0x94, 0, 0xd3, 0],
////		"deeppink" : [255, 0x14, 0x93, 0],
////		"deepskyblue" : [0, 0xbf, 255, 0],
////		"dimgray" : [0x69, 0x69, 0x69, 0],
////		"dimgrey" : [0x69, 0x69, 0x69, 0],
////		"dodgerblue" : [0x1e, 0x90, 255, 0],
////		"firebrick" : [0xb2, 0x22, 0x22, 0],
////		"floralwhite" : [255, 0xfa, 240, 0],
////		"forestgreen" : [0x22, 0x8b, 0x22, 0],
////		"gainsboro" : [0xdc, 0xdc, 0xdc, 0],
////		"ghostwhite" : [0xf8, 0xf8, 255, 0],
////		"gold" : [255, 0xd7, 0, 0],
////		"goldenrod" : [0xda, 165, 32, 0],
////		"greenyellow" : [173, 255, 47, 0],
////		"grey" : [128, 128, 128, 0],
////		"honeydew" : [0xf0, 255, 240, 0],
////		"hotpink" : [255, 0x69, 0xb4, 0],
////		"indianred" : [0xcd, 0x5c, 0x5c, 0],
////		"indigo" : [0x4b, 0, 0x82, 0],
////		"ivory" : [255, 255, 240, 0],
////		"khaki" : [240, 230, 0x8c, 0],
////		"lavender" : [230, 230, 0xfa, 0],
////		"lavenderblush" : [255, 240, 0xf5, 0],
////		"lawngreen" : [0x7c, 0xfc, 0, 0],
////		"lemonchiffon" : [255, 0xfa, 0xcd, 0],
////		"lightblue" : [173, 216, 230, 0],
////		"lightcoral" : [240, 128, 128, 0],
////		"lightcyan" : [0xe0, 255, 255, 0],
////		"lightgoldenrodyellow" : [0xfa, 0xfa, 0xd2, 0],
////		"lightgray" : [0xd3, 0xd3, 0xd3, 0],
////		"lightgreen" : [0x90, 0xee, 0x90, 0],
////		"lightgrey" : [0xd3, 0xd3, 0xd3, 0],
////		"lightpink" : [255, 0xb6, 0xc1, 0],
////		"lightsalmon" : [255, 0xa0, 0x7a, 0],
////		"lightseagreen" : [32, 0xb2, 0xaa, 0],
////		"lightskyblue" : [0x87, 0xce, 0xfa, 0],
////		"lightslategray" : [0x77, 0x88, 0x99, 0],
////		"lightslategrey" : [0x77, 0x88, 0x99, 0],
////		"lightsteelblue" : [0xb0, 0xc4, 0xde, 0],
////		"lightyellow" : [255, 255, 0xe0, 0],
////		"limegreen" : [0x32, 0xcd, 0x32, 0],
////		"linen" : [0xfa, 240, 230, 0],
////		"mediumaquamarine" : [0x66, 0xcd, 0xaa, 0],
////		"mediumblue" : [0, 0, 0xcd, 0],
////		"mediumorchid" : [0xba, 0x55, 0xd3, 0],
////		"mediumpurple" : [0x93, 0x70, 0xdb, 0],
////		"mediumseagreen" : [0x3c, 0xb3, 0x71, 0],
////		"mediumslateblue" : [0x7b, 0x68, 0xee, 0],
////		"mediumspringgreen" : [0, 0xfa, 0x9a, 0],
////		"mediumturquoise" : [0x48, 0xd1, 0xcc, 0],
////		"mediumvioletred" : [0xc7, 0x15, 0x85, 0],
////		"midnightblue" : [0x19, 0x19, 0x70, 0],
////		"mintcream" : [0xf5, 255, 0xfa, 0],
////		"mistyrose" : [255, 0xe4, 0xe1, 0],
////		"moccasin" : [255, 0xe4, 0xb5, 0],
////		"navajowhite" : [255, 0xde, 173, 0],
////		"oldlace" : [0xfd, 0xf5, 230, 0],
////		"olivedrab" : [0x6b, 0x8e, 0x23, 0],
////		"orangered" : [255, 0x45, 0, 0],
////		"orchid" : [0xda, 0x70, 0xd6, 0],
////		"palegoldenrod" : [0xee, 0xe8, 0xaa, 0],
////		"palegreen" : [0x98, 0xfb, 0x98, 0],
////		"paleturquoise" : [0xaf, 0xee, 0xee, 0],
////		"palevioletred" : [0xdb, 0x70, 0x93, 0],
////		"papayawhip" : [255, 0xef, 0xd5, 0],
////		"peachpuff" : [255, 0xda, 0xb9, 0],
////		"peru" : [0xcd, 0x85, 0x3f, 0],
////		"pink" : [255, 0xc0, 0xcb, 0],
////		"plum" : [0xdd, 0xa0, 0xdd, 0],
////		"powderblue" : [0xb0, 0xe0, 230, 0],
////		"rosybrown" : [0xbc, 0x8f, 0x8f, 0],
////		"royalblue" : [0x41, 0x69, 0xe1, 0],
////		"saddlebrown" : [0x8b, 0x45, 0x13, 0],
////		"salmon" : [0xfa, 128, 0x72, 0],
////		"sandybrown" : [0xf4, 0xa4, 0x60, 0],
////		"seagreen" : [0x2e, 0x8b, 0x57, 0],
////		"seashell" : [255, 0xf5, 0xee, 0],
////		"sienna" : [0xa0, 0x52, 0x2d, 0],
////		"skyblue" : [0x87, 0xce, 0xeb, 0],
////		"slateblue" : [0x6a, 0x5a, 0xcd, 0],
////		"slategray" : [0x70, 128, 0x90, 0],
////		"slategrey" : [0x70, 128, 0x90, 0],
////		"snow" : [255, 0xfa, 0xfa, 0],
////		"springgreen" : [0, 255, 0x7f, 0],
////		"steelblue" : [0x46, 0x82, 0xb4, 0],
////		"tan" : [0xd2, 0xb4, 0x8c, 0],
////		"thistle" : [216, 0xbf, 216, 0],
////		"tomato" : [255, 0x63, 0x47, 0],
////		"turquoise" : [0x40, 0xe0, 0xd0, 0],
////		"violet" : [0xee, 0x82, 0xee, 0],
////		"wheat" : [0xf5, 0xde, 0xb3, 0],
////		"whitesmoke" : [0xf5, 0xf5, 0xf5, 0],
////		"yellowgreen" : [0x9a, 0xcd, 0x32, 0],
////		// CSS4
////		"rebeccapurple" : [0x66, 0x33, 0x99, 0]
//	}
	clWDUtil.bHTML2RVBA = function bHTML2RVBA(sCouleurHTML, pfArrondi, tabRVBA_OUT)
	{
		// Retourne du noir opaque par défaut
		var oRes;
		if (((oRes = ms_oRegExpRGB.exec(sCouleurHTML)) || (oRes = ms_oRegExpRGBA.exec(sCouleurHTML))) && oRes[1])
		{
			tabRVBA_OUT[0] = __dParseCouleur(oRes[1], pfArrondi);
			tabRVBA_OUT[1] = __dParseCouleur(oRes[2], pfArrondi);
			tabRVBA_OUT[2] = __dParseCouleur(oRes[3], pfArrondi);
			if (oRes[4])
			{
				tabRVBA_OUT[3] = __dParseOpacite(oRes[4]);
			}
		}
		else if (((oRes = ms_oRegExpTSL.exec(sCouleurHTML)) || (oRes = ms_oRegExpTSLA.exec(sCouleurHTML))) && oRes[1])
		{
			__TSL2RVB(__dParseTeinte(oRes[1]), __dParseSaturationLuminosite(oRes[2]), __dParseSaturationLuminosite(oRes[3]), pfArrondi, tabRVBA_OUT);
			if (oRes[4])
			{
				tabRVBA_OUT[3] = __dParseOpacite(oRes[4]);
			}
		}
		else if (sCouleurHTML.charAt(0) == "#")
		{
			switch (sCouleurHTML.length)
			{
				case 4:
					// 4 : "#" + "RVB"
					// * 17 : pour passer de "x" (en hexa) a "xx" (en hexa)
					tabRVBA_OUT[0] = parseInt(sCouleurHTML.substring(1, 2), 16) * 17;
					tabRVBA_OUT[1] = parseInt(sCouleurHTML.substring(2, 3), 16) * 17;
					tabRVBA_OUT[2] = parseInt(sCouleurHTML.substring(3), 16) * 17;
					break;
				case 7:
					// 7 : "#" + "RRVVBB"
					tabRVBA_OUT[0] = parseInt(sCouleurHTML.substring(1, 3), 16);
					tabRVBA_OUT[1] = parseInt(sCouleurHTML.substring(3, 5), 16);
					tabRVBA_OUT[2] = parseInt(sCouleurHTML.substring(5), 16);
					break;
			}
		}
		else if ("transparent" == sCouleurHTML)
		{
			tabRVBA_OUT[0] = tabRVBA_OUT[1] = tabRVBA_OUT[2] = tabRVBA_OUT[3] = 0;
		}
		else
		{
			return false;
		}
		return true;
	};
	function __dParseCouleur(sCouleur, pfArrondi)
	{
		var dCouleur = parseFloat(sCouleur);
		if ("%" == sCouleur.charAt(sCouleur.length - 1))
		{
			dCouleur *= 2.55;
		}
		return Math.max(Math.min(pfArrondi(dCouleur), 255), 0);
	}
	function __dParseOpacite(sOpacite)
	{
		var dOpacite = parseFloat(sOpacite);
		return Math.max(Math.min(dOpacite, 1), 0);
	};
	function __dParseTeinte(sTeinte)
	{
		var dTeinte = parseFloat(sTeinte);
		return dTeinte - Math.floor(dTeinte / 360) * 360;
	}
	clWDUtil.__dParseTeinte = __dParseTeinte;
	function __dParseSaturationLuminosite(sSaturationLuminosite)
	{
		var dSaturationLuminosite = parseFloat(sSaturationLuminosite);
		return Math.max(Math.min(dSaturationLuminosite / 100, 1), 0);
	}
	clWDUtil.__dParseSaturationLuminosite = __dParseSaturationLuminosite;

	// Conversion d'une couleur HTML en couleur RVB dans un tableau [Rouge, Vert, Bleu] chacun sur [0, 255]
	clWDUtil.tabHTML2RVBA = function tabHTML2RVBA(sCouleurHTML)
	{
		// Version sans arrondi
		var tabRVBA_OUT = [0, 0, 0, 1];
		this.bHTML2RVBA(sCouleurHTML, this.m_pfIdentite, tabRVBA_OUT);
		return tabRVBA_OUT;
	};

	// Conversion d'une couleur RVB en HTML
	// GP 04/03/2016 : TB96928 : Séparation en deux fonctions pour toujours avoir la possibilité de faire du #RRVVBB
	clWDUtil.sRVB2HTML = function sRVB2HTML(tabRVB)
	{
		return "#" + __sCouleur2Hexa(tabRVB[0]) + __sCouleur2Hexa(tabRVB[1]) + __sCouleur2Hexa(tabRVB[2]);
	};
	// Conversion d'une couleur en hexa
	function __sCouleur2Hexa(nCouleur)
	{
		return clWDUtil.sCompleteEntier(Math.round(nCouleur).toString(16), 2);
	}

	// Conversion d'une couleur RVB en HTML
	clWDUtil.sRVBA2HTML = function sRVBA2HTML(tabRVBA)
	{
		if (1 == tabRVBA[3])
		{
			// GP 28/01/2016 : On reproduit le comportement précédent de ..Couleur/..CouleurFond : on retourne #RRVVBB en IE et rgb(x, y, z) dans les autres navigateurs
			// Notes :
			// - Le rgb inclus un espace après les ','
			// - Edge se comporte comme les autres navigateurs
			if (bIEAvec11)
			{
				return this.sRVB2HTML(tabRVBA);
			}
			else
			{
				// je pense que l'on n'a pas le droit aux couleurs décimales dans rgb
				return "rgb(" + Math.round(tabRVBA[0]) + ", " + Math.round(tabRVBA[1]) + ", " + Math.round(tabRVBA[2]) + ")";
			}
		}
		else if ((0 == tabRVBA[3]) && (0 == tabRVBA[0]) && (0 == tabRVBA[1]) && (0 == tabRVBA[2]))
		{
			return "transparent";
		}
		else
		{
			// je pense que l'on n'a pas le droit aux couleurs décimales dans rgba
//			return "rgba(" + tabRVBA.join(",") + ")";
			return "rgba(" + Math.round(tabRVBA[0]) + "," + Math.round(tabRVBA[1]) + "," + Math.round(tabRVBA[2]) + "," + tabRVBA[3] + ")";
		}
	};

	// Conversion d'une couleur en entier
	clWDUtil.nRVBA2Int = function nRVBA2Int(tabRVBA)
	{
		return Math.round(tabRVBA[0]) + (Math.round(tabRVBA[1]) << 8) + (Math.round(tabRVBA[2]) << 16);
	};

	// Conversion d'une couleur HTML en TSL
	clWDUtil.tabHTML2TSLA = function tabHTML2TSLA(sCouleurHTML)
	{
		return this.tabRVBA2TSLA(this.tabHTML2RVBA(sCouleurHTML));
	};
	// Conversion d'une couleur TSL en HTML
	clWDUtil.sTSLA2HTML = function sTSLA2HTML(tabTSLA)
	{
		// GP 12/06/2017 : QW288014 : IE8- ne gèrent pas hsla
		if (nIE < 9)
		{
			var tabRVBA = [0, 0, 0, 0];
			this.TSLA2RVBA(tabTSLA, tabRVBA);
			return this.sRVBA2HTML(tabRVBA);
		}
		return "hsla(" + tabTSLA[0] + "," + (tabTSLA[1] * 100) + "%," + (tabTSLA[2] * 100) + "%," + tabTSLA[3] + ")";
	};

	// GP 15/11/2012 : QW225998 : Utilise le même algo que PAD dans la OBJ
	// SI CouleurLuminosité(CouleurFond) > 50 ALORS
	//	// Foncé
	//	CouleurFond est entier = TSL(CouleurTeinte(CouleurFond), CouleurSaturation(CouleurFond), CouleurLuminosité(CouleurFond) * 0.3)
	// SINON
	//	// Clair
	//	CouleurFond est entier = TSL(CouleurTeinte(CouleurFond), CouleurSaturation(CouleurFond), 95)
	// FIN
	clWDUtil.sGetCouleurHTMLAssocie = function sGetCouleurHTMLAssocie(sCouleur)
	{
		if (sCouleur === undefined)
		{
			// Cas transparent
			return;
		}

		// GP 13/04/2016 : QW272174 : La couleur reçue peut être n'importe quoi comme couleur :
		// - Une chaine (cas "couleur HTML")
		// - Un entier (dans quel cas ?)
		// - Un DINO couleur (cas de la valeur de retour d'une fonction WL de couleur)
		// => On passe par un DINO couleur pour accepter toutes les conversions
		var tabTSLA = (new this.WDDinoCouleur(sCouleur)).tabGetTSLA();

		// Transforme en couleur de fond en ajustant la luminosité
		tabTSLA[2] = ((tabTSLA[2] > 0.5) ? tabTSLA[2] * 0.3 : 0.95);
		return this.sTSLA2HTML(tabTSLA);
	};

	/**
	 * Rend plus brillante la couleur spécifiée ene paramètre.
	 * @param nCodeRGB code RGB Couleur à rendre plus brillante.
	 * @return couleur
	 */
	clWDUtil.sCouleurHTMLPlusBrillante = function sCouleurHTMLPlusBrillante(sCouleur, dCoeff)
	{
		if (sCouleur === undefined)
		{
			// Cas transparent
			return;
		}
		// Convertion en RGB
		var tabRGBA = this.tabHTML2RVBA(sCouleur);
		var nOffset = dCoeff ? Math.round(255 * dCoeff) : 64;
		tabRGBA[0] = Math.max(0, Math.min(255, tabRGBA[0] + nOffset));
		tabRGBA[1] = Math.max(0, Math.min(255, tabRGBA[1] + nOffset));
		tabRGBA[2] = Math.max(0, Math.min(255, tabRGBA[2] + nOffset));

		//Contruit le code RGB de la couleur eclaircie
		return this.sRVBA2HTML(tabRGBA);
	};

	// Fonction WL RVBVersHTML
	clWDUtil.sRVBVersHTML = function sRVBVersHTML(oCouleur)
	{
		return String(new this.WDDinoCouleur(oCouleur));
	};
})();

// Selon le navigateur
// GP 12/11/2012 : Transformé en bIEQuirks
// GP 16/11/2012 : QW?????? : Dans l'ActiveX IE, on est en mode compat IE7 et pas IE9 et dans ce mode on n'a pas l'opacité
// GP 21/11/2012 : QW226469 : Dans IE10 il faut faire le comportement non quirks
// GP 11/02/2013 : TB80979 : Il faut le faire toujours dans IE8-
(function ()
{
	"use strict";

	function __nGetOpaciteCommun(oElement)
	{
		var oStyle = clWDUtil.oGetCurrentStyle(oElement);
		if (oStyle)
		{
			return parseInt(oStyle.opacity * 100);
		}
		else
		{
			return undefined;
		}
	}

	var __SetOpacite;
	var __nGetOpacite;
	if (bIEQuirks9Max || (bIE && ((document.documentMode < 8) || (nIE < 9))))
	{
		__SetOpacite = function (nValeur, oElement)
		{
//		// GP 22/04/2014 : TB79381 : Ne fonctionne pas sur plusieurs appels sans simplification

//			try
//			{
//				// Manipule les filtres
//				var oFilters = oElement.filters;
//				try
//				{
//					oFilters.item("alpha").opacity = nValeur;
//				}
//				catch (oErreur)
//				{
//					oFilters.item("DXImageTransform.Microsoft.Alpha").opacity = nValeur;
//				}
//			}
//			catch (oErreur)
			{
				oElement.style.filter = "alpha(opacity=" + nValeur + ")";
			}
		};
		__nGetOpacite = function (oElement)
		{
			var nOpacite;
			try
			{
				// Manipule les filtres
				var oFilters = oElement.filters;
				try
				{
					nOpacite = oFilters.item("alpha").opacity;
				}
				catch (oErreur)
				{
					nOpacite = oFilters.item("DXImageTransform.Microsoft.Alpha").opacity;
				}
			}
			catch (oErreur)
			{
			}
			return (undefined !== nOpacite) ? nOpacite : __nGetOpaciteCommun(oElement);
		};
	}
	else
	{
		// Autre : manipule opacity sous forme de double
		__SetOpacite = function (nValeur, oElement)
		{
			// On n'a parfois pas l'élément (en particulier en affectation dans un champ de ZR pour qui on passe l'élément non indicé).
			// Dans 99% cette affectation est probablement completement inutile (fait dans le code généré en utilisant le résultat de cette fonction).
			if (oElement && oElement.style)
			{
				// Autre : manipule opacity sous forme de double
				oElement.style.opacity = (nValeur / 100);
			}
		};
		__nGetOpacite = __nGetOpaciteCommun;
	}

	// Modifie l'opacité d'un champ (déplacé ici car dépendance de ToastAffiche)
	// Retourne la valeur de la propriété pour .style.opacity
	clWDUtil.nSetOpacite = function nSetOpacite(nValeur, oElement)
	{
		if (isNaN(nValeur))
		{
			nValeur = 100;
		}
		else if (nValeur < 0)
		{
			nValeur = Math.max(Math.min(nValeur, 100), 0);
		}

		__SetOpacite(nValeur, oElement);

		// GP 08/01/2013 : TB80413
		return nValeur / 100;
	};

	// Lit l'opacité d'un champ (déplacé ici car dépendance de ToastAffiche)
	clWDUtil.nGetOpacite = function nGetOpacite(nValeur, oElement)
	{
		// Si la valeur fournie est valide (Cas general)
		if (nValeur !== undefined)
		{
			// GP 22/04/2014 : TB79381 : parseInt(parseFloat(0.57) * 100) donne 56 car 0.57 est en fait 0.56999999...
			// Utilisation de Math.round pour avoir un arrondi et pas un tronquature
//			nValeur = parseInt(parseFloat(nValeur) * 100);
			nValeur = Math.round(parseFloat(nValeur) * 100);
			if ((nValeur >= 0) && (nValeur <= 100))
			{
				return nValeur;
			}
		}

		// Selon le navigateur
		nValeur = __nGetOpacite(oElement);
		return ((nValeur !== undefined) && !isNaN(nValeur)) ? nValeur : 100;
	};
})();

// GP 04/12/2015 : Fonctions de conversions pour les polices
clWDUtil.sVersPoliceXxx = function sVersPoliceXxx(sValeur, sNormal, sActif, sActif2)
{
	// Cas des chaines
	if (typeof sValeur == "string")
	{
		// Test les valeurs natives, booléenes et de la chaine vide
		// Autres cas => rebon sur faux
		switch (sValeur.toLowerCase())
		{
		case sActif:
		case sActif2:
		case "1":
			return sActif;
		// GP 04/12/2015 : OPTIM du source : commente ces cas car "default" suffit.
//		case sNormal:
//		case "0":
//		case "":
		default:
			return sNormal;
		}
	}
	// Fait une simple evaluation
	return sValeur ? sActif : sNormal;

};
clWDUtil.sVersPoliceGras = function sVersPoliceGras(sValeur)
{
	return this.sVersPoliceXxx(sValeur, "normal", "bold", "bolder");
};
clWDUtil.bDePoliceGras = function bDePoliceGras(sValeur)
{
	return (700 <= sValeur) || ("bold" == sValeur) || ("bolder" == sValeur);
};
clWDUtil.sVersPoliceItalique = function sVersPoliceItalique(sValeur)
{
	// Considère "oblique" comme "italic" même si ce n'est pas strictement équivalent
	return this.sVersPoliceXxx(sValeur, "normal", "italic", "oblique");
};
clWDUtil.bDePoliceItalique = function bDePoliceItalique(sValeur)
{
	// Considère "oblique" comme "italic" même si ce n'est pas strictement équivalent
	return ("italic" == sValeur) || ("oblique" == sValeur);
};
clWDUtil.sVersPoliceSouslignee = function sVersPoliceSouslignee(sValeur)
{
	// On n'a pas de seconde valeur donc utilise une valeur completement invalide pour ne pas placer 'undefined'
	return this.sVersPoliceXxx(sValeur, "none", "underline", "__underline__");
};
clWDUtil.bDePoliceSouslignee = function bDePoliceSouslignee(sValeur)
{
	return -1 != String(sValeur).toLowerCase().indexOf("underline");
};
clWDUtil.sVersPoliceTaille = function sVersPoliceTaille(sValeur)
{
	// Cas des chaines qui ne sont pas des entier/réel seul
	if ((typeof sValeur == "string") && (parseInt(sValeur, 10) != sValeur) && (String(parseFloat(sValeur)) != sValeur))
	{
		// Retourne direct la valeur
		return sValeur;
	}
	else
	{
		// Sinon ajoute l'unité
		return sValeur + "pt";
	}
};
clWDUtil.bDePoliceTaille = function bDePoliceTaille(sValeur)
{
	// Si la valeur est en points : supprime l'unite
	var sValeurParseXxx = parseInt(sValeur, 10);
	if ((sValeurParseXxx + "pt") == sValeur)
	{
		return sValeurParseXxx;
	}
	sValeurParseXxx = parseFloat(sValeur);
	if ((sValeurParseXxx + "pt") == sValeur)
	{
		return sValeurParseXxx;
	}
	return sValeur;
};

// Trouve le current style d'un champ
clWDUtil.oGetCurrentStyle = function oGetCurrentStyle(oElement)
{
	// Recupere l'element en demandant l'element externe
	// Code pour IE en mode quirks
	if (oElement.currentStyle)
	{
		return oElement.currentStyle;
	}
	// FF/Opera/Safari/IE11
	// GP 10/12/2013 : Il faut tester d'abord oElement.defaultView car si oElement est un document, oElement.ownerDocument est NULL.
	// Et si en plus on est dans le cas de l'IFrame du champ de saisie riche, le window courant n'est pas celui de l'élément
	// GP 31/10/2017 : TB105849 : transforme (oElement.ownerDocument || document).defaultView en oElement.ownerDocument.defaultView || document.defaultView
	// En effet dans le cas d'une iframe invisible (cas du champ de saisie riche dans une popup), Chrome se comporte différement et ne donne pas de vue.
	// => On utilise alors la vue de la page parente (par document.defaultView).
	var oFenetre = oElement.defaultView || oElement.ownerDocument.defaultView || document.defaultView;
	// Applique la methode depuis la fenetre du document
	// GP 10/12/2013 : Sauf qu'il faut la fenêtre de l'élément
	if (oFenetre.getComputedStyle)
	{
		// SI le noeud est un neoud texte
		if (oElement.nodeName == "#text")
		{
			oElement = oElement.parentNode;
		}
		return oFenetre.getComputedStyle(oElement, null);
	}
	// Si on n'a pas de résultat on retourne un truc valide pour ne pas avoir d'erreur JS
	return {};
};

// Trouve le current style d'un champ avec son nom
clWDUtil.oGetCurrentStyleIdName = function oGetCurrentStyleIdName(sAlias, oDocument, bLV, bExterieur, bAvecPrefixeUniquement, sProprieteSousElement, nSousElement)
{
	// Recupere l'element en demandant l'element externe
	var oElement = _JGEN(sAlias, oDocument, bExterieur, bAvecPrefixeUniquement, sProprieteSousElement, nSousElement);
	if (bLV)
	{
		// LValue => style
		return oElement.style
	}
	else
	{
		// RValue => currentStyle
		return this.oGetCurrentStyle(oElement);
	}
};

// Ajoute une regle CSS
clWDUtil.CreeStyle = function CreeStyle(oFeuilleStyle, sNomStyle, sTexteStyle)
{
	// Ne cree pas un style vide
	if (sTexteStyle.length)
	{
		// Ajoute un style dans la feuille de style donnee
		// GP 26/11/2013 : Commence par la méthode standardisée
		// GP 27/11/2013 : QW239940 : Utilise this.m_bStyleNorme
//		if (oFeuilleStyle.insertRule)
		if (this.m_bStyleNorme)
		{
			oFeuilleStyle.insertRule(sNomStyle + " {" + sTexteStyle + "}", oFeuilleStyle.cssRules.length);
		}
		else
		{
			oFeuilleStyle.addRule(sNomStyle, sTexteStyle);
		}
	}
};

// Creation d'une feuille de style
clWDUtil.oCreeFeuilleStyle = function oCreeFeuilleStyle()
{
	// Creation de la feuille de style
	var oBaliseStyle = document.createElement("style");
	oBaliseStyle.type = "text/css";
	// GP 26/11/2013 : document.head ne fonctionne pas en IE quirks
//	oBaliseStyle = document.head.appendChild(oBaliseStyle);
	oBaliseStyle = document.getElementsByTagName("head")[0].appendChild(oBaliseStyle);
	if (bWK)
	{
		oBaliseStyle.appendChild(document.createTextNode(""));
	}
	return this.oGetFeuilleStyle(oBaliseStyle);
};

// Recupere le CSS d'une regle de style (recherche globale)
clWDUtil.sGetCSSTexte = function sGetCSSTexte(sSelecteur)
{
	return this.sGetCSSTexteElement(this.oStyleTrouve(sSelecteur));
};

// Recupere le style sous forme de texte avec un ; terminal si le style est non vide
clWDUtil.sGetCSSTexteElement = function sGetCSSTexteElement(oElement)
{
	// Uniquement si le style existe
	if (oElement && oElement.style)
	{
		var sCSSTexte = oElement.style.cssText;
		if (sCSSTexte)
		{
			// Ajoute le ";" si besoin
			if ((sCSSTexte.length > 0) && (sCSSTexte.substring(sCSSTexte.length - 1) != ";"))
			{
				sCSSTexte += ";";
			}
			return sCSSTexte;
		}
	}
	return "";
};

// Recupere une regle de style (recherche globale)
clWDUtil.oStyleTrouve = function oStyleTrouve(sSelecteur)
{
	return this.oStyleTrouveDocument(document, sSelecteur);
};
clWDUtil.oStyleTrouveDocument = function oStyleTrouveDocument(oDocument, sSelecteur)
{
	// On recherche le style a la racine
	var oRule;
	// Arret de la recherche quand on trouve une règle
	if (!this.bForEach(oDocument.getElementsByTagName("style"), function(oStyle)
	{
		oRule = clWDUtil.oStyleTrouveDansBalise(oStyle, sSelecteur);
		// Arret de la recherche quand on trouve une règle
		return null === oRule;
	}))
	{
		return oRule;
	}

	// Arret de la recherche quand on trouve une règle
	if (!this.bForEach(oDocument.getElementsByTagName("link"), function(oStyle)
	{
		// Unique les feuilles de style
		if (oStyle.rel.toLowerCase() == "stylesheet")
		{
			oRule = clWDUtil.oStyleTrouveDansBalise(oStyle, sSelecteur);
			// Arret de la recherche quand on trouve une règle
			return null === oRule;
		}
		return true;
	}))
	{
		return oRule;
	}

	return null;
};

// GP 21/11/2012 : QW223239 : Le comportement de IEdevient comme le comportement des autres navigateur avec les changement de versions :
//	Version IE	Quirks	HTML5
//	8			Compat	Compat
//	9			Compat	Norme
//	10			Norme	Norme
clWDUtil.m_bStyleNorme = !(bIEQuirks9Max || (bIE && (nIE < 9)));

// Récupère la feuille de style
clWDUtil.oGetFeuilleStyle = function oGetFeuilleStyle(oBaliseStyle)
{
	return this.m_bStyleNorme ? oBaliseStyle.sheet : oBaliseStyle.styleSheet;
};
clWDUtil.tabGetStyleRegles = function tabGetStyleRegles(oFeuilleStyle)
{
	try
	{
		// GP 28/01/2014 : TB85858 : Correction pour ne pas planter dans une page avec trop de balises style/link dans un ie ancien.
		return this.m_bStyleNorme ? oFeuilleStyle.cssRules : (oFeuilleStyle.rules || []);
	}
	catch (oErreur)
	{
		// GP 13/05/2015 : TB92491 : Firefox refuse (maintenant ?) l'accès au feuilles de style d'un autre domaine
		return [];
	}
};
// GP 23/08/2016 : TB99364 : Gestion des @import : retourne un tableau construit
// Le résultat n'est alors pas la feuile de style et l'insertion/supprime dans le tableau ne reporte pas la modification
clWDUtil.tabGetStyleReglesAvecImportConst = function tabGetStyleReglesAvecImportConst(oFeuilleStyle)
{
	// GP 21/10/2016 : QW278838 : tabGetStyleRegles retourne rules qui n'est pas un tableau en IE8 et Array.prototype.concat n'accepte pas cette valeur dans IE8
	// Dans tout les cas le code est pour le responsive donc on peut juste l'ignorer dans IE8
	if (nIE <= 8)
	{
		return this.tabGetStyleRegles(oFeuilleStyle);
	}
	var tabStyleRegles = Array.prototype.concat.apply([], this.tabGetStyleRegles(oFeuilleStyle));
	this.bForEachInverse(tabStyleRegles, function(oRegle, nIndice)
	{
		if (3 == oRegle.type)
		{
			var tabStyleReglesImport = clWDUtil.tabGetStyleReglesAvecImportConst(oRegle.styleSheet);
			// Prépare les paramètres de splice
			tabStyleReglesImport.unshift(1);
			tabStyleReglesImport.unshift(nIndice);
			Array.prototype.splice.apply(tabStyleRegles, tabStyleReglesImport);
		}
		return true;
	});

	return tabStyleRegles;
};

// Recherche un style dans la feuille de style
clWDUtil.oStyleTrouveDansBalise = function oStyleTrouveDansBalise(oBaliseStyle, sSelecteur)
{
	// Selon les navigateur et la recherche est toujours complexe
	return this.oStyleTrouveDansFeuille(this.oGetFeuilleStyle(oBaliseStyle), sSelecteur, false);
};
clWDUtil.oStyleTrouveDansFeuille = function oStyleTrouveDansFeuille(oFeuilleStyle, sSelecteur, bSimple)
{
	return this.oStyleTrouveDansRules(this.tabGetStyleReglesAvecImportConst(oFeuilleStyle), sSelecteur, bSimple);
};
clWDUtil.oStyleTrouveDansRules = function oStyleTrouveDansRules(tabRules, sSelecteur, bSimple)
{
	var nIndice = this.nStyleTrouveDansRules(tabRules, sSelecteur, bSimple);
	return (this.nElementInconnu !== nIndice) ? tabRules[nIndice] : null;
};

// Recherche l'indice d'un style dans la feuille de style
clWDUtil.nStyleTrouveDansRules = (function ()
{
	"use strict";

	// Normalise un sélecteur
	function __sNormaliseSelecteur(sSelecteur)
	{
		// Normalise en avance le nom : supprime les espaces de formatage (ajoute entre les ',')
		// et passe en minuscule pour chrome
		// (Normalement ce n'est pas valide car certains éléments son sensible à la casse mais on doit le faire pour la partie balise qui ne l'est pas)
		return clWDUtil.sSupprimeEspaces(sSelecteur).toLowerCase();
	}

	// Compare un sélecteur et un sélecteur déjà normalisé
	function __bCompareSelecteur(sSelecteurANormalise, sSelecteurDejaNormalise)
	{
		return __sNormaliseSelecteur(sSelecteurANormalise) == sSelecteurDejaNormalise;
	}

	function __nStyleTrouveDansRulesSimple(tabRules, sSelecteur)
	{
		// Normalise en avance le nom : supprime les espaces de formatage (ajoute entre les ',')
		// et passe en minuscule pour chrome
		sSelecteur = __sNormaliseSelecteur(sSelecteur);
		return clWDUtil.nDansTableauFct(tabRules, function (oRule, sSelecteur) { return __bCompareSelecteur(oRule.selectorText, sSelecteur); }, sSelecteur);
	}
	function __nStyleTrouveDansRulesComplexe(tabRules, sSelecteur)
	{
		// Normalise en avance le nom : supprime les espaces de formatage (ajoute entre les ',')
		// et passe en minuscule pour chrome
		sSelecteur = __sNormaliseSelecteur(sSelecteur);

		// GP 05/02/2014 : TB85862 : On peut avoir null pour les feuille de style externes ou avec des déclarations bizarres
		if (tabRules)
		{
			var i;
			var nLimiteI = tabRules.length;
			for (i = 0; i < nLimiteI; i++)
			{
				// On recupere la liste des styles pour voir si notre style y est
				// Comme les styles sont groupes par le moteur selon des styles qui doivent reste identique il sufit de trouver notre style une fois
				// Ici les styles sont groupe donc il faut faire un parsing
				// selectorText n'existe pas dans les CSSMediaRule
				var sSTexte = tabRules[i].selectorText;
				if (sSTexte)
				{
					var nIndice = clWDUtil.nDansTableauFct(sSTexte.split(","), function (sNom, sSelecteur) { return __bCompareSelecteur(sNom, sSelecteur); }, sSelecteur);
					if (clWDUtil.nElementInconnu != nIndice)
					{
						return i;
					}
				}
			}
		}

		// Non trouve
		return clWDUtil.nElementInconnu;
	}

	return function nStyleTrouveDansRules(tabRules, sSelecteur, bSimple)
	{
		return ((bSimple || !this.m_bStyleNorme) ? __nStyleTrouveDansRulesSimple : __nStyleTrouveDansRulesComplexe).apply(this, [tabRules, sSelecteur]);
	};
})();

clWDUtil.StyleSupprime = function StyleSupprime(oFeuilleStyle, nStyle)
{
	// GP 26/11/2013 : Commence par la méthode standardisée
	// GP 27/11/2013 : QW239940 : Utilise this.m_bStyleNorme
//	if (oFeuilleStyle.deleteRule)
	if (this.m_bStyleNorme)
	{
		oFeuilleStyle.deleteRule(nStyle);
	}
	else
	{
		oFeuilleStyle.removeRule(nStyle);
	}
};

// Retourne le nom d'un attribut
clWDUtil.sGetAttributNom = function sGetAttributNom(clAttribut)
{
	// GP 30/09/2014 : 'Attr.nodename' is deprecated. Please use 'name' instead. Mais on ne sais pas si value fonctionne sur les anciens IE.
	return bIEQuirks9Max ? clAttribut.nodeName : clAttribut.name;
};

// Retourne la valeur d'un attribut
clWDUtil.sGetAttributValeur = function sGetAttributValeur(clAttribut)
{
	// GP 30/09/2014 : 'Attr.nodeValue' is deprecated. Please use 'value' instead. Mais on ne sais pas si value fonctionne sur les anciens IE.
	return bIEQuirks9Max ? clAttribut.nodeValue : clAttribut.value;
};

// Détecte si un élément a un attribut
clWDUtil.bHasAttribute = bIEQuirks ? function bHasAttribute(clElement, sAttribut)
	{
		return null !== clElement.getAttribute(sAttribut);
	} : function bHasAttribute(clElement, sAttribut)
	{
		return clElement.hasAttribute(sAttribut);
	};

// Manipulation des classes
// Calcule la nouvelle valeur de .className d'un élément :
// - Lit la valeur actuelle (champ.className)
// - Ajoute les nouvelles classes
// - Mémorise les nouvelles classes dans data-webdev-class-usr
clWDUtil.sSetClasseHTML = function sSetClasseHTML(sClasseHTML, clElement)
{
	// - Lit la valeur actuelle (champ.className) et la transforme sous forme de tableau
	var tabClassName = this.tabSplitClasses(this.__sGetClassName(clElement));

	// - Supprime les classes déjà ajouté en WL (connu par l'attribut data-webdev-class-usr) et conserve les classes internes de WB
	if (clWDUtil.bHasAttribute(clElement, "data-webdev-class-usr"))
	{
		clWDUtil.bForEach(this.tabSplitClasses(clElement.getAttribute("data-webdev-class-usr")), function(sClasseDataWebDevClassUsr)
		{
			var nIndice = clWDUtil.nDansTableau(tabClassName, sClasseDataWebDevClassUsr);
			if (clWDUtil.nElementInconnu != nIndice)
			{
				tabClassName.splice(nIndice, 1);
			}
			return true;
		});
	}

	// - Ajoute les nouvelles classes
	tabClassName.push(sClasseHTML);
	// GP 03/12/2014 : On ne supprime pas les doublons, sinon cela permet de manipuler les classes WebDev indirectement.
	var sClassName = this.tabOptimiseSimpleClasses(tabClassName).join(" ");

	// - Mémorise les nouvelles classes dans data-webdev-class-usr
	clElement.setAttribute("data-webdev-class-usr", sClasseHTML);

	// Retourne la valeur pour affectation dans le WL
	return sClassName;
};
// Lit la valeur de .className d'un élément :
// - On recoit le contenu de .className. Mais en fait on retourne directement le contenu de data-webdev-class-usr qui contient la valeur affectée en WL
clWDUtil.sGetClasseHTML = function sGetClasseHTML(sClassName, clElement)
{
	if (clWDUtil.bHasAttribute(clElement, "data-webdev-class-usr"))
	{
		// GP 03/12/2014 : On ne supprime pas les doublons, sinon cela permet de manipuler les classes WebDev indirectement.
		return this.sOptimiseSimpleClasses(clElement.getAttribute("data-webdev-class-usr"));
	}
	else
	{
		return "";
	}
};

// Fonction HTMLClassexxx
clWDUtil.HTMLClasseModifie = function HTMLClasseModifie(clElement, sClasse, bAjouteSiInexistant, bSupprimeSiExistant)
{
	// Lit la valeur actuelle de ..ClasseHTML et la transforme sous forme de tableau
	var tabClasseHTMLChamp = this.tabSplitClasses(this.sGetClasseHTML("", clElement));
	// Transforme la valeur donnée en tableau
	var tabClasseHTMLAModifiee = this.tabSplitClasses(sClasse);

	var nLimiteClasseAModifiee = tabClasseHTMLAModifiee.length;
	for (var nClasseAModifiee = 0; nClasseAModifiee < nLimiteClasseAModifiee; nClasseAModifiee++)
	{
		var sClasseHTMLAModifiee = tabClasseHTMLAModifiee[nClasseAModifiee];
		var nIndice = clWDUtil.nDansTableau(tabClasseHTMLChamp, sClasseHTMLAModifiee);
		if (this.nElementInconnu == nIndice)
		{
			if (bAjouteSiInexistant)
			{
				tabClasseHTMLChamp.push(sClasseHTMLAModifiee);
			}
		}
		else
		{
			if (bSupprimeSiExistant)
			{
				tabClasseHTMLChamp.splice(nIndice, 1);
			}
		}
	}

	// Réaffecte la valeur (avec optimisation car sSetClasseHTML ne réoptimise pas la valeur utilisateur)
	clElement.className = this.sSetClasseHTML(this.tabOptimiseSimpleClasses(tabClasseHTMLChamp).join(" "), clElement);
};

// GP 06/11/2014 : Si on a la balise SVG (qui n'est pas un HTMLElement), on n'a un className mais qui n'est pas une chaine
clWDUtil.__sGetClassName = function __sGetClassName(clElement)
{
	// GP 06/11/2014 : Si on a la balise SVG (qui n'est pas un HTMLElement), on n'a un className mais qui n'est pas une chaine
	var oClassName = clElement.className;
	if (oClassName && (undefined !== oClassName.animVal))
	{
		return oClassName.animVal;
	}
	// Sinon retourne directement la valeur lue (inclus le undefined si la propriété n'existe pas)
	return oClassName;

};

// Indique si un élement a une classe donnée
clWDUtil.bAvecClasse = function bAvecClasse(clElement, sClasse)
{
	// GP 06/11/2014 : Si on a la balise SVG (qui n'est pas un HTMLElement), on n'a un className mais qui n'est pas une chaine
	var sClassName = this.__sGetClassName(clElement);
	if (sClassName)
	{
		// GP 10/11/2014 : QW251405 : Ajout du .split qui a sauté avec la correction du 06/11/2014
		// GP 03/12/2014 : Fait le split sur tous les caractères d'espacements
		return this.bDansTableau(sClassName.split(/\s/), sClasse);
	}
	else
	{
		return false;
	}
};

// Détection du responsive web design (il faut que bAvecClasse soit déclaré)
clWDUtil.bRWD = !document.body ? false : clWDUtil.bAvecClasse(document.body, "wbRwd");

// Ajoute ou supprime une classe selon l'activation de l'option
clWDUtil.ActiveDesactiveClassName = function ActiveDesactiveClassName(clElement, sClasse, bActive)
{
	if (bActive)
	{
		this.RemplaceClassName(clElement, undefined, sClasse);
	}
	else
	{
		this.RemplaceClassName(clElement, sClasse, undefined);
	}
};

// Remplace une classe existante dans les classes d'un élément
// Si la classe n'existe pas : ne fait rien
// Si la classe existe : la remplace
// Si la classe remplacante n'existe pas : la supprime (normalement n'arrive pas)
clWDUtil.RemplaceClassNameSiExiste = function RemplaceClassNameSiExiste(clElement, sClasseSupprime, sClasseAjoute)
{
	if (this.bAvecClasse(clElement, sClasseSupprime))
	{
		this.RemplaceClassName(clElement, sClasseSupprime, sClasseAjoute);
	}
};

// Remplace une classe dans les classes d'un élément
// Si la classe n'existe pas : l'ajoute
// Si la classe existe : la remplace
// Si la classe remplacante n'existe pas : la supprime
clWDUtil.RemplaceClassName = function RemplaceClassName(clElement, sClasseSupprime, sClasseAjoute)
{
	// GP 25/02/2015 : Pas d'utilisation de clWDUtil.__sGetClassName sinon on ne détecte plus les SVG
//	var sClassName = clWDUtil.__sGetClassName(clElement);
	var sClassName = clElement.className;
	// GP 06/11/2014 : Si on a la balise SVG (qui n'est pas un HTMLElement), on n'a un className mais qui n'est pas une chaine
	if (undefined !== sClassName)
	{
		var bPourSvg = (undefined !== sClassName.animVal);
		if (bPourSvg)
		{
			sClassName = sClassName.animVal;
		}

		var tabClasses;
		if (0 < sClassName.length)
		{
			// GP 03/12/2014 : Fait le split sur tous les caractères d'espacements
			tabClasses = sClassName.split(/\s/);
		}
		else
		{
			tabClasses = [];
		}

		// Recherche les deux classes
		var nIndiceSupprime;
		if (undefined !== sClasseSupprime)
		{
			nIndiceSupprime = this.nDansTableau(tabClasses, sClasseSupprime);
		}
		var nIndiceAjoute;
		if (undefined !== sClasseAjoute)
		{
			nIndiceAjoute = this.nDansTableau(tabClasses, sClasseAjoute);
		}

		// Gère tous les cas
		//					nIndiceSupprime
		//	nIndiceAjoute	undefined	nElementInconnu	Trouvé
		//	undefined		rien		rien			supprime
		//	nElementInconnu	ajout fin	ajout fin		remplace
		//	Trouvé			rien		rien			supprime si sClasseSupprime != sClasseAjoute
		var bModification;
		if (undefined === nIndiceAjoute)
		{
			// Cas nIndiceSupprime => Trouvé et nIndiceAjoute => undefined
			if ((undefined !== nIndiceSupprime) && (this.nElementInconnu !== nIndiceSupprime))
			{
				// => Supprime
				tabClasses.splice(nIndiceSupprime, 1);
				bModification = true;
			}
			// Rien dans les autres cas
		}
		else if (this.nElementInconnu == nIndiceAjoute)
		{
			// Cas nIndiceSupprime => Trouvé et nIndiceAjoute => nElementInconnu
			if ((undefined !== nIndiceSupprime) && (this.nElementInconnu !== nIndiceSupprime))
			{
				// => Remplace
				tabClasses[nIndiceSupprime] = sClasseAjoute;
			}
			// Cas nIndiceSupprime => undefined et nIndiceAjoute => nElementInconnu
			// Cas nIndiceSupprime => nElementInconnu et nIndiceAjoute => nElementInconnu
			else
			{
				// => Ajout fin
				tabClasses.push(sClasseAjoute);
			}
			// Modification dans tous les cas
			bModification = true;
		}
		else
		{
			// Cas nIndiceSupprime => Trouvé et nIndiceAjoute => Trouvé
			if ((undefined !== nIndiceSupprime) && (this.nElementInconnu !== nIndiceSupprime))
			{
				// Supprime si sClasseSupprime != sClasseAjoute
				if (sClasseSupprime != sClasseAjoute)
				{
					// => Supprime
					tabClasses.splice(nIndiceSupprime, 1);
					bModification = true;
				}
			}
			// Rien dans les autres cas
		}

		if (bModification)
		{
			var sClassName = tabClasses.join(" ");
			if (bPourSvg)
			{
				clElement.className.baseVal = sClassName;
			}
			else
			{
				clElement.className = sClassName;
			}
		}
	}
};

// Retourne le premier élément du type donné avec la classe donnée
clWDUtil.oGetElementByTagAndClass = function oGetElementByTagAndClass(oParent, sTag, sClasse)
{
	// GP 25/09/2012 : Uniquement en HTML5
//	return oParent.getElementsByClassName(sClasse)[0];

	// Recherche les divs
	var oDivExterne;
	this.bForEach(oParent.getElementsByTagName(sTag), function(oDiv)
	{
		if (clWDUtil.bAvecClasse(oDiv, sClasse))
		{
			oDivExterne = oDiv;
			return false;
		}
		return true;
	});

	return oDivExterne;
};
// Retourne le premier élément du type donné avec la classe donnée
clWDUtil.tabGetElementsByClass = function tabGetElementsByClass(oParent, sClasse)
{
	"use strict";

	function __bGetElementsByClassRecursif(oElement)
	{
		// GP 06/11/2014 : Ignore les balises SVG
		if (clWDUtil.bBaliseEstTag(oElement, "svg"))
		{
			return true;
		}
		if (clWDUtil.bAvecClasse(oElement, sClasse))
		{
			tabElements.push(oElement);
		}
		return clWDUtil.bForEach(oElement.children, __bGetElementsByClassRecursif);
	}
	if (oParent.getElementsByClassName)
	{
		// GP 25/09/2012 : Uniquement en HTML5
		return oParent.getElementsByClassName(sClasse);
	}
	else
	{
		var tabElements = [];
		__bGetElementsByClassRecursif(oParent);
		return tabElements;
	}
};

// Optimise une liste de classe (= supprime les doublons)
// On garde la dernière instance (pour garder le résultat final) de chaque classe
clWDUtil.sOptimiseClasses = function sOptimiseClasses(sClasses)
{
	// GP 03/12/2014 : Fait le split sur tous les caractères d'espacements
	var tabClasses = sClasses.split(/\s/);
	// On par de la fin
	var nClasseTrouve;
	var sClasse;
	// GP 03/12/2014 : Inutile de tester la première classe : changement du test de <= en <
	for (var nClasse = tabClasses.length - 1; 0 < nClasse; nClasse--)
	{
		sClasse = tabClasses[nClasse];
		// Un nom vide (double espace ou espace en début ou en fin ?)
		if (0 == sClasse.length)
		{
			tabClasses.splice(nClasse, 1);
			continue;
		}
		// Recherche la classe (on doit la trouver puis qu'elle est au moins une fois dans le tableau)
		while ((nClasseTrouve = this.nDansTableau(tabClasses, sClasse)) < nClasse)
		{
			// Supprime le doublon
			tabClasses.splice(nClasseTrouve, 1);
			// On a supprimer un élément avant la classe dans le tableau
			nClasse--;
		}
	}

	return tabClasses.join(" ");
};

// GP 04/03/2015 : Conversion des classes en tableai avec optimisation
clWDUtil.tabSplitClasses = function tabSplitClasses(sClasses)
{
	return this.tabOptimiseSimpleClasses(sClasses.split(/\s/));
};

// Optimise la liste de classe et ne supprime que les doublons
clWDUtil.tabOptimiseSimpleClasses = function tabOptimiseSimpleClasses(tabClasses)
{
	// GP 04/03/2015 : Si si on n'a aucune classe : "".split(/\s/) retourne [""] qu'il faut optimiser
//	// GP 03/12/2014 : Inutile de tester la première classe : changement du test de <= en <
//	for (var nClasse = tabClasses.length - 1; 0 < nClasse; nClasse--)
	for (var nClasse = tabClasses.length - 1; 0 <= nClasse; nClasse--)
	{
		// Un nom vide (double espace ou espace en début ou en fin ?)
		if (0 == tabClasses[nClasse].length)
		{
			tabClasses.splice(nClasse, 1);
		}
	}

	return tabClasses;
};

clWDUtil.sOptimiseSimpleClasses = function sOptimiseSimpleClasses(sClasses)
{
	// GP 03/12/2014 : Fait le split sur tous les caractères d'espacements
	return this.tabSplitClasses(sClasses).join(" ");
};

//////////////////////////////////////////////////////////////////////////
// Trace

(function ()
{
	"use strict";

	var ms_oTrace = null;

	function __oGetDefaultView()
	{
		// parentWindow pour IE en quirks
		var oDocument = ms_oTrace.ownerDocument;
		return oDocument.defaultView || oDocument.parentWindow;
	}
	function __bTraceExiste()
	{
		// Maintenant que ms_oTrace pointe sur un élément "pre". Son contenu n'est pas fiable si la fenêtre est fermée
		if (ms_oTrace)
		{
			try
			{
				return !__oGetDefaultView().closed;
			}
			catch (e)
			{
			}
		}
		return false;
	}

	// Ouvre la trace
	clWDUtil.oTraceDebut = function oTraceDebut()
	{
		if (!__bTraceExiste())
		{
			var sNomFenetreTrace = "_TW_";
			if (window.name === sNomFenetreTrace)
			{
				sNomFenetreTrace += "_";
			}
			var oTrace = window.open("", sNomFenetreTrace, "alwaysRaised=1,dependent=1,scrollbars=1,resizable=1,screenX=0,screenY=0,width=388,height=1");
			var oDocument = oTrace.document;
			var oBody = oDocument.body;
			// GP 12/02/2019 : QW309368 : Avec EDGE, sur une machine lente, il semble que oDocument.body peut retourner null/undefined.
			// Il n'y a pas de solution pour corriger car il n'y a pas moyen d'attendre en JS.
			clWDUtil.WDDebug.assert(!!oBody, "oDocument.body a retourné null/undefined");
			// GP 13/07/2012 : Encodage des balises (demande GF pour le W3C)
			// Sauf que pour faire plus simple maintenant on manipule directement le DOM
			// Ne replace pas le titre si on retrouve une fenêtre existante
			if (0 === oBody.childNodes.length)
			{
				oDocument.title = STD_TITRE_TRACE;
				oBody.style.backgroundColor = "#ffd264";
				oBody.appendChild(oDocument.createElement("pre")).appendChild(oDocument.createTextNode(STD_INFO_TRACE));
			}
			oTrace = oBody.appendChild(oDocument.createElement("pre"));
			oTrace.style.borderTop = "thin solid #808080";
			ms_oTrace = oTrace;
		}
		return ms_oTrace;
	};

	// Ecrit dans la trace
	clWDUtil.Trace = function Trace()
	{
		var oTrace = this.oTraceDebut();
		var oDocument = oTrace.ownerDocument;
		var oBody = oDocument.body;

		// GP 22/06/2017 : QW288302 : Array.prototype.map n'est pas disponible en HTML4
		var tabMessage = [];
		this.bForEach(arguments, function (oTexte)
		{
			switch (typeof oTexte)
			{
			case "boolean":
				// GP 31/05/2017 : QW287775 : Le WL trace les booléens en 0/1. Ici on arrive avec un booléen natif dans le cas d'une valeur immédiate.
				// => Fait le bon cast.
				tabMessage.push(oTexte ? "1" : "0");
				break;
			default:
				tabMessage.push(String(oTexte));
				break;
			}
			return true;
		});

		// GP 14/06/2017 : QW288102 : Conserve les espaces au début de la trace.
		// Note : utiliser \s semble risqué (perte de certains espacements spéciaux). On remplace uniquement " " dont on sait qu'il pose problème.
		oTrace.appendChild(oDocument.createTextNode(tabMessage.join(" ")));
		oTrace.appendChild(oDocument.createElement("br"));
		oBody.scrollTop = oBody.scrollHeight;
	};

	// Fin de trace
	// Ouvre la trace
	clWDUtil.TraceFin = function TraceFin()
	{
		if (__bTraceExiste())
		{
			__oGetDefaultView().close();
		}
		ms_oTrace = null;
	};
})();

// Construit un url('xxx')
// Retourne vide en cas de valeur vide
clWDUtil.sGetURICSS = function sGetURICSS(sURI)
{
	if (0 < sURI.length)
	{
		// Encode l'URI et retourne la chaine finale
		return "url('" + sURI.replace("\\", "\\\\").replace("\"", "\\\"").replace("\'", "\\\'").replace("(", "\\(").replace(")", "\\)") + "')";
	}
	else
	{
		return "";
	}
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fonctions NavigateurXxx
(function ()
{
	"use strict";

	function __bDetecteMot(sUserAgent, sMot)
	{
		return !!sUserAgent.match(new RegExp("(^|\\W)" + sMot + "(\\W|$)", ""));
	}
	function __eNavigateurDetecteMobile(sUserAgent, ePlateformeCompatibleSiPasMobile)
	{
		if (-1 != sUserAgent.indexOf("iPhone"))
		{
			// Si on trouve iPhone
			return 1;
		}
		else if ((-1 != sUserAgent.indexOf("iPad")) || (-1 != sUserAgent.indexOf("IPAD")))
		{
			// Ou si on trouve iPad
			return 2;
		}
		else if (-1 != sUserAgent.indexOf("BlackBerry"))
		{
			return 3;
		}
		// Les anciens Windows CE/Windows Mobile incluent "Windows CE"
		// Les récents incluent "Windows CE" et "IEMobile"
		// Les Windows Phone 7 incluent "IEMobile" et "Windows Phone"
		else if (-1 != sUserAgent.indexOf("Windows Phone"))
		{
			return 8;
		}
		else if ((-1 != sUserAgent.indexOf("Windows CE")) || (-1 != sUserAgent.indexOf("IEMobile")))
		{
			return 4;
		}
		else if ((-1 != sUserAgent.indexOf("Android")) || (-1 != sUserAgent.indexOf("android")))
		{
			return 5;
		}
		else if ((-1 != sUserAgent.indexOf("Nokia")) || (-1 != sUserAgent.indexOf("nokia")))
		{
			return 6;
		}
		else
		{
			return ePlateformeCompatibleSiPasMobile;
		}
	}
	function __oGetNavigateurGenerique(sUserAgent, nPosition, oNavigateur)
	{
		var oResultat = { m_ePlateformeCompatible: __eNavigateurDetecteMobile(sUserAgent, 0), m_eType: oNavigateur.m_eType };

		var nPositionAlternative;
		switch (oNavigateur.m_eRechercheVersion)
		{
		case 1:
			nPositionAlternative = sUserAgent.indexOf("Version/");
			if (-1 != nPositionAlternative)
			{
				nPosition = nPositionAlternative + "Version/".length;
			}
			break;
		case 2:
			nPositionAlternative = sUserAgent.indexOf("rv:");
			if (-1 != nPositionAlternative)
			{
				nPosition = nPositionAlternative + "rv:".length;
			}
			break;
		}

		oResultat.m_nVersionMajeure = parseInt(sUserAgent.substr(nPosition));

		// Les versions complete se finisent par :
		// - La fin de la chaine
		// - Un espace
		// - Un ; (IE mobile)
		var nPositionFin = -1;
		clWDUtil.bForEach([" ", ";", ")"], function (sSeparateur)
		{
			var nPositionFinSeparateur = sUserAgent.indexOf(sSeparateur, nPosition);
			if ((-1 != nPositionFinSeparateur) && ((nPositionFinSeparateur < nPositionFin) || (-1 == nPositionFin)))
			{
				nPositionFin = nPositionFinSeparateur;
			}
			return true;
		});
		if (-1 == nPositionFin)
		{
			oResultat.m_szVersionComplete = sUserAgent.substr(nPosition);
		}
		else
		{
			oResultat.m_szVersionComplete = sUserAgent.substring(nPosition, nPositionFin);
		}

		return oResultat;
	}
	function __oGetNavigateurOpera(sUserAgent, nPosition, oNavigateur)
	{
		// Utilise le code de la version générique
		var oResultat = __oGetNavigateurGenerique(sUserAgent, nPosition, oNavigateur);

		// ex : "Opera/9.23 (Windows NT 5.1; U; fr)"
		// Si on trouve Opera Mini ou Opera Mobi on est sur un smartphone
		if ((-1 != sUserAgent.indexOf("Opera Mini")) || (-1 != sUserAgent.indexOf("Opera Mobi")))
		{
			oResultat.m_ePlateformeCompatible = __eNavigateurDetecteMobile(6);
		}

		return oResultat;
	}
	function __oGetNavigateurRobot(sUserAgent, nPosition, oNavigateur)
	{
		// Utilise le code de la version générique
		var oResultat = __oGetNavigateurGenerique(sUserAgent, nPosition, oNavigateur);

		// Force la plateforme
		oResultat.m_ePlateformeCompatible = 7;

		return oResultat;
	}

	var ms_tabNavigateurs =
	[
		// GP 10/07/2015 : Ajout de EDGE
		{ m_pfTraitement: __oGetNavigateurGenerique, m_sID: "Edge/", m_eType: 9, m_eRechercheVersion: 0 },
		// Il faut mettre opéra avant IE car opéra peut se présenter comme IE (inclus MSIE) + on prend en priorité la valeur "Opera/" sur "Opera "
		{ m_pfTraitement: __oGetNavigateurOpera, m_sID: "Opera/", m_eType: 4, m_eRechercheVersion: 1 },
		{ m_pfTraitement: __oGetNavigateurOpera, m_sID: "Opera ", m_eType: 4, m_eRechercheVersion: 1 },
		{ m_pfTraitement: __oGetNavigateurGenerique, m_sID: "MSIE ", m_eType: 0, m_eRechercheVersion: 0 },
		// GP 28/10/2013 : QW237981 : Détecte IE11 avec trident/ et rv
		{ m_pfTraitement: __oGetNavigateurGenerique, m_sID: "Trident/", m_eType: 0, m_eRechercheVersion: 2 },
		// On prend en priorite "Firefox/" sur "Gecko/" : tous les navigateur avec le moteur Gecko incluent Gecko/ mais seul Firefox inclus Firefox/
		{ m_pfTraitement: __oGetNavigateurGenerique, m_sID: "Firefox/", m_eType: 1, m_eRechercheVersion: 0 },
		{ m_pfTraitement: __oGetNavigateurGenerique, m_sID: "Gecko/", m_eType: 6, m_eRechercheVersion: 0 },
		// On prend dans l'ordre Chrome, Safari et AppleWebKit car :
		// - Chrome inclus les 3 : "Chrome/", "Safari/", "AppleWebKit/"
		// - Safari en inclus 2 : "Safari/", "AppleWebKit/"
		// - Les autres 1 : "AppleWebKit/" ou "WebKit/"
		{ m_pfTraitement: __oGetNavigateurGenerique, m_sID: "Chrome/", m_eType: 2, m_eRechercheVersion: 0 },
		// GP 26/02/2016 : TB96773 : Chrome sous iOS utilise CriOS/ pour sa version
		{ m_pfTraitement: __oGetNavigateurGenerique, m_sID: "CriOS/", m_eType: 2, m_eRechercheVersion: 0 },
		{ m_pfTraitement: __oGetNavigateurGenerique, m_sID: "Safari/", m_eType: 3, m_eRechercheVersion: 1 },
		// GP 17/01/2011 : QW200999 : Certains navigateur ne contienent pas le "Apple"
//		{ m_pfTraitement : __oGetNavigateurGenerique,	m_sID : "AppleWebKit/",	m_eType : 5, m_eRechercheVersion : 0},
		{ m_pfTraitement: __oGetNavigateurGenerique, m_sID: "WebKit/", m_eType: 5, m_eRechercheVersion: 0 },
		// Robots en général (Googlebot/ etc) => Il se termines tous par bot/
		{ m_pfTraitement: __oGetNavigateurRobot, m_sID: "bot/", m_eType: 7, m_eRechercheVersion: 0 },
		{ m_pfTraitement: __oGetNavigateurRobot, m_sID: "Bot/", m_eType: 7, m_eRechercheVersion: 0 }
	];
	function __oGetNavigateur()
	{
		var sUserAgent = navigator.userAgent;

		// Détecte les navigateurs
		var oResultat;
		if (!clWDUtil.bForEach(ms_tabNavigateurs, function (oNavigateur)
		{
			var nPosition = sUserAgent.indexOf(oNavigateur.m_sID);
			if (-1 != nPosition)
			{
				oResultat = oNavigateur.m_pfTraitement(sUserAgent, nPosition + oNavigateur.m_sID.length, oNavigateur);
				return false;
			}
			return true;
		}))
		{
			return oResultat;
		}

		// Cas spécifique de WWTest
		if ((sUserAgent == "WWTest") || (sUserAgent.substr(0, 6).toUpperCase() == "ROBOT_"))
		{
			return { m_ePlateformeCompatible: 7, m_eType: 7, m_nVersionMajeure: 0, m_szVersionComplete: "" };
		}
		else
		{
			// Netscape ?
			// ex : "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.0.2) Gecko/20030208 Netscape/7.02"
			// GP 16/11/2010 : => dans autres maintnenant
			// Autres
			// GP 17/01/2011 : QW200994 : Les BlackBerry ne contienent aucun nom ci dessus donc on passe alors dans le cas ici pour détecter les mobiles
			return { m_ePlateformeCompatible: __eNavigateurDetecteMobile(sUserAgent, 0), m_eType: 8, m_nVersionMajeure: 0, m_szVersionComplete: "" };
		}
	}

	clWDUtil.bGetNavigateurMobile = function bGetNavigateurMobile()
	{
		var sUserAgent = navigator.userAgent;
		// GP 17/07/2015 : QW259804 : Les iPad ne sont pas des mobiles
		if (__bDetecteMot(sUserAgent, "iPad") || __bDetecteMot(sUserAgent, "IPAD"))
		{
			return false;
		}

		// Détecte Mobile (ajoute une détection sans majuscule par sécurité)
		if (__bDetecteMot(sUserAgent, "Mobile") || __bDetecteMot(sUserAgent, "mobile") || __bDetecteMot(sUserAgent, "IEMobile"))
		{
			return true;
		}

		// Il n'y a pas de manière fiable de détecter les tablettes
		return false;
	};
	clWDUtil.nGetNavigateurOS = function nGetNavigateurOS()
	{
		var sUserAgent = navigator.userAgent;
		// Windows Phone.
		// GP 17/07/2015 : QW259831 : S'annonce comme un Android : on doit donc détecter Windows Phone en premier
		if (__bDetecteMot(sUserAgent, "Windows Phone"))
		{
			return 5;
		}

		// Android (ajoute une détection sans majuscule par sécurité)
		// Android contient le mot Linux : on le détecte avant Linux
		if (__bDetecteMot(sUserAgent, "Android") || __bDetecteMot(sUserAgent, "android"))
		{
			return 4;
		}

		// iOS
		if (__bDetecteMot(sUserAgent, "iPhone") || __bDetecteMot(sUserAgent, "iPad") || __bDetecteMot(sUserAgent, "IPAD") || __bDetecteMot(sUserAgent, "iOS"))
		{
			return 3;
		}

		// Windows : détecte "Windows NT"
		// On pourrai détecter uniquement "Windows" car on est après la détection de "Windows Phone"
		if (__bDetecteMot(sUserAgent, "Windows NT"))
		{
			return 0;
		}

		// MacOS
		if (__bDetecteMot(sUserAgent, "Mac OS"))
		{
			return 1;
		}

		// Linux
		// Android contient le mot Linux : on l'a détecté avant
		if (__bDetecteMot(sUserAgent, "Linux"))
		{
			// GP 16/07/2015 : Ici il faut bien retourner Linux et pas MacOS
			return 2;
		}

		return 6;
	};
	clWDUtil.nGetNavigateurPlateforme = function nGetNavigateurPlateforme()
	{
		return __oGetNavigateur().m_ePlateformeCompatible;
	};
	clWDUtil.nGetNavigateurType = function nGetNavigateurType()
	{
		return __oGetNavigateur().m_eType;
	};
	clWDUtil.nGetNavigateurVersion = function nGetNavigateurVersion(nInformation)
	{
		var oNavigateur = __oGetNavigateur();
		switch (nInformation)
		{
		default:
		case 0:
			return oNavigateur.m_nVersionMajeure;
		case 1:
			return oNavigateur.m_szVersionComplete;
		}
	};
})();

//////////////////////////////////////////////////////////////////////////
// Gestion de CelluleAfficheDialogue et des fonctions associées

(function ()
{
	"use strict";

	// Tableau des popups/cellules ouvertes en dialogue
	clWDUtil.m_oDialogues = {};
	var ms_tabChampSansFocus = [];
	clWDUtil.m_oPopupAnimations = {};
	var ms_sAnimationEnd = (bWK && "webkitAnimationEnd") || ((!bIE || ((10 <= nIE) && !bIEQuirks9Max)) && "animationend");

	// Affichage de la cellule/popup
	clWDUtil.CelluleAfficheDialogue = function CelluleAfficheDialogue(sAliasCellule, oDocument, ePosition, bGFI, nGFITaux, nX, nY, bFixed, oJSMenu, bAnnulable)
	{
		var oCellule = _JGE(sAliasCellule, oDocument, true);
		// Vérifie que l'on trouve la cellule
		if (!oCellule)
		{
			return false;
		}
		var bDoubleAffichageMenu = false;
		// Si la cellule est déjà affiché
		var oCelluleAffichee = this.m_oDialogues[sAliasCellule];
		if (undefined !== oCelluleAffichee)
		{
			// Si on est pour un menu
			if (oJSMenu)
			{
				// On affiche la même popup pour le même menu
				if (oJSMenu === oCelluleAffichee.m_oJSMenu)
				{
					// Refus
					return false;
				}
				else
				{
					// On affiche pour un autre menu : continue
					this.CelluleFermeDialogue(sAliasCellule);
					bDoubleAffichageMenu = true;
				}
			}
			else
			{
				// Ne fait rien
				return false;
			}
		}
		// Si on a encore un timeout sur l'animation de fermeture de la popup : ferme la popup
		if (!oJSMenu)
		{
			// Appel la fonction
			__FinCelluleFermeDialogueDifferee(sAliasCellule);
		}

		// Pose (si pas déjà fait) de la Hook
		this.AttacheOnScrollResize(__OnScrollResizeDialogue);

		// GP 07/04/2016 : TB102857 : Déclenche ce qu'il faut pour le responsive (fait le plus tard possible mais une seul fois au premier appel)
		// => On le déclenche ici car on en a besoin
		if (window["$"])
		{
			$(window).trigger("trigger.wb.rwd.media.charge");
		}

		// Si on avait des éléments dans la liste, restaure la valeur initiale de tabindex
		// => On peut en effet avoir le champ dans la popup qui était avant dans la page !!!
		__DetacheFocusDialogue();

		// Creation de la structure de memorisation
		var oDialogue = {};
		this.m_oDialogues[sAliasCellule] = oDialogue;
		oDialogue.m_bDoubleAffichageMenu = bDoubleAffichageMenu;
		oDialogue.m_oJSMenu = oJSMenu;
		oDialogue.zIndex = oCellule.style.zIndex;
		oDialogue.left = oCellule.offsetLeft;
		oDialogue.top = oCellule.offsetTop;
		oDialogue.oParent = oCellule.parentNode;
		oDialogue.m_bFixed = bFixed;
		oCellule = this.oCelluleDeplace(window._PAGE_, oCellule);
		oDialogue.m_oCellule = oCellule;

		// Sauf si on demande aucun GFI
		if (undefined !== bGFI)
		{
			// Si on demande sans GFI : fait un GFI transparent
			if (!bGFI)
			{
				nGFITaux = 0;
			}

			// Creation du GFI
			var oCelluleGFI = oDocument.createElement('div');
			oCelluleGFI.style.position = 'absolute';
			oCelluleGFI.style.zIndex = 989;
			oCelluleGFI.style.backgroundColor = '#666666';
			this.nSetOpacite(nGFITaux, oCelluleGFI);
			// GP 17/07/2015 : QW258341 : Nouvel algo dans le redimensionnement, on n'a plus besoin de ses valeurs
//			// Taille initiale du document (pour le redimensionnement du GFI)
//			oDialogue.m_nWidthInit = clWDUtil.__nGetBodyPropriete(oDocument, "scrollWidth");
//			oDialogue.m_nHeightInit = clWDUtil.__nGetBodyPropriete(oDocument, "scrollHeight");
			// Premier dimensionnement du GFI
			__SetDimensionGFI(oCelluleGFI/*, oDialogue*/);

			if (bAnnulable)
			{
				this.AttacheDetacheEvent(true
					, oCelluleGFI
					, "click"
					, function ()
					{
						clWDUtil.CelluleFermeDialogue(sAliasCellule);
						// Conserve la propagation.
						return true;
					}
					, true);
			}

			// Ajoute la zone a la page
			oDialogue.m_oCelluleGFI = window._PAGE_.appendChild(oCelluleGFI);
		}

		if (bAnnulable)
		{
			oDialogue.m_pfAnnulable = function (oEvent)
			{
				// Filtre les touches autres que echap.
				switch (oEvent.key)
				{
				case "Escape":	// Autre navigateurs.
				case "Esc":		// Internet explorer.
					break;
				default:
					return true;
				}

				clWDUtil.CelluleFermeDialogue(sAliasCellule);
				// Conserve la propagation.
				return true;
			};
			this.AttacheDetacheEvent(true
				, document
				, "keydown"
				, oDialogue.m_pfAnnulable
				, true);
		}

		// Si le champ n'est pas dans le flux : le montre
		if ("none" === this.oGetCurrentStyle(oCellule).display)
		{
			oCellule.style.display = "block";
			// GP 05/09/2013 : QW234730 : Il faut refaire un display:none sur la popup pour corriger le problème.
			// Le problème c'est que cela risque de faire des problème (la popup/cellule n'a plus de taille ainsi que ses éléments)
			// => Si on a trop de régression, il faudra revenir en arrière sur cette correction qui est quand même pour un cas marginal (Google+ dans une popup).
			oDialogue.m_bDisplayNone = true;
		}

		// GP 01/04/2016 : QW271541 : Comme TB96252 il faut utiliser oDocument.body en RWD en remplacement de _PAGE_
		// GP 04/04/2016 : QW271555 : Mais il ne faut pas l'utiliser pour "top"
		// GP 10/07/2020 : QW327002 : Si on a un offsetParent, c'est ce qu'il faut utiliser. Puisque la cellule sera positionné par rapport à lui.
		var oCiblePourLeft = (clWDUtil.bRWD || (oCellule.offsetParent === oDocument.body)) ? oDocument.body : window._PAGE_;

		// GP 14/05/2013 : TB81840 : Sauf en positionnement selon la souris qui inclus déjà cette valeur
		// Deplacement du champ si besoin
		if (nX !== undefined)
		{
			// GP 14/05/2013 : TB81840 : Elle n'inclus pas cette valeur si la valeur est négative (page centrée), ce qui donne ici une valeur positive.
			var nOffsetX = this.nGetBoundingClientRectLeft(oCiblePourLeft, false);
			if ((ePosition !== this.ms_ePlaceSouris) || (0 < nOffsetX))
			{
				nX -= nOffsetX;
			}
		}
		// GP 14/05/2013 : TB81840 : Sauf en positionnement selon la souris qui inclus déjà cette valeur
		// On ne test la valeur que pour la position en Y : on ne peut pas avoir de position négative en Y
		if ((nY !== undefined) && (ePosition !== this.ms_ePlaceSouris))
		{
			nY -= this.nGetBoundingClientRectTop(window._PAGE_, false);
		}

		oDialogue.m_ePosition = ePosition;
		oDialogue.m_nX = nX;
		oDialogue.m_nY = nY;
		__SetPositionDialogue(oDialogue);

		// S'enregistre sur le redimensionnement du dialogue si on est en fixed
		if (bFixed)
		{
			oDialogue.m_pfOnResizeCellule = function () { __SetPositionDialogueFiltre(oDialogue, false); };
			oDialogue.m_oTaille = oCellule.getBoundingClientRect();
			// GP 12/12/2012 : Ne fonctionne pas dans chrome/firefox
			if (bIEQuirks9Max)
			{
				clWDUtil.AttacheDetacheEvent(true, oCellule, "resize", oDialogue.m_pfOnResizeCellule);
				// GP 12/12/2012 : Uniquement dans IE, dans les autres le timer va jouer son role
				// GP 27/11/2012 : QW226859 : Et fait un redimensionnement a postériori si besoin (on ne recoit pas tourjours le onresize si l'élement est déjà modifié
				// mais que le reflow n'a pas eu lieu
				this.nSetTimeout(function () { __SetPositionDialogueFiltre(oDialogue, true); }, this.ms_oTimeoutImmediat);
			}
			else
			{
				oDialogue.m_nTimer = setInterval(oDialogue.m_pfOnResizeCellule, 100);
			}
		}

		// Le zindex doit être recalculé s'il y a d'autres popups déjà affichées
		var tabPoppUpVisible = [].slice.call(document.getElementsByClassName("WDPopupVisible")).concat([].slice.call(document.getElementsByClassName("WDBarreOutils")));
		var nMaxZIndexPopup = 990;
		for (var iPopupVisible=0; iPopupVisible<tabPoppUpVisible.length; ++iPopupVisible)
		{
			var nZIndexPopup = parseInt(tabPoppUpVisible[iPopupVisible].style.zIndex);
			if (isNaN(nZIndexPopup))
			{
				continue;
			}
			nMaxZIndexPopup = Math.max(nMaxZIndexPopup,nZIndexPopup);
		}
		oCellule.style.zIndex = nMaxZIndexPopup;

		// Si on est pas dans un menu, ajoute la classe pour déclencher les animations
		if (!oJSMenu)
		{
			// On n'a pas "WDPopupInvisible" qui est supprimé en fin d'animation
			this.RemplaceClassName(oCellule, undefined, "WDPopupVisible");
		}

		// Affichage du champ
		oCellule.style.visibility = "visible";

		// GP 12/12/2013 : TB85071 : Pose la hook globale sur onfocus si on n'a pas déjà posé
		// (maintenant que l'on a déplacé la cellule)
		__AttacheFocusDialogue();

		// Force la MAJ des champs (saisie riche, upload)
		AppelMethode(WDChamp.prototype.ms_sOnDisplay, [oCellule, true]);
		if (window.$)
		{
			//la cellule elle même
			$(oCellule).trigger("trigger.wb.effet.apparition.affiche");
			//ses fils
			$(window).trigger("trigger.wb.postUpdateLayoutSuperposableEpingle.apparition", oCellule);
		}

		return true;
	};
	function __OnScrollResizeDialogue(/*oEvent*//*, bScroll*/)
	{
		// Pour tous les dialogues ouverts
		clWDUtil.bForEachIn(clWDUtil.m_oDialogues, function (sAliasCellule, oDialogue)
		{
			// GP 24/01/2013 : QW228945 : Si on n'a pas le GFI (par exemple dans une popup) il ne faut pas le redimensionner
			// GP 17/07/2015 : QW258341 : On redimensionne le GFI sur tous les scrolls. On ne peut pas détecter les redimensionnements du contenu (onresize ne détecte que pour le viewport)
			// => Sauf que s'il y a un changement de la taille du contenu, le document va scroller soit de lui même soit par l'utilisateur.
			// => Et de plus le GFI remplit l'écran donc pour voir du GFI mal affiché, il faut scroller.
			// Le seul cas problématique est le cas de la réduction de la hauteur du document et que le document est en bas. Mais alors on évite le document qui scrolle tout seul vers le haut
			// ce qui n'est pas idiot.
//			if (!bScroll && oDialogue.m_oCelluleGFI)
			if (oDialogue.m_oCelluleGFI)
			{
				// Redimensionne le GFI
				__SetDimensionGFI(oDialogue.m_oCelluleGFI/*, oDialogue*/);
			}
			if (oDialogue.m_bFixed)
			{
				// Repositionne l'élément si besoin
				__SetPositionDialogue(oDialogue);
			}
			return true;
		});
	}

	// Si on avait des éléments dans la liste, restaure la valeur initiale de tabindex
	// => On peut en effet avoir le champ dans la popup qui était avant dans la page !!!
	function __DetacheFocusDialogue()
	{
//		// TB83940 : Cas spécial Firefox 1.5 pour faire fonctionner CelluleAfficheDialogue (uniquement avec les options de la 14)
//		if (window._PAGE_.getBoundingClientRect)
//		{
		clWDUtil.bForEach(ms_tabChampSansFocus, function (oChampSansFocus)
		{
			if (undefined !== oChampSansFocus.m_sTabIndex)
			{
				oChampSansFocus.m_oElement.tabIndex = oChampSansFocus.m_sTabIndex;
			}
			else
			{
				oChampSansFocus.m_oElement.removeAttribute("tabindex");
			}
			return true;
		});
		ms_tabChampSansFocus = [];
//		}
	}
	// GP 12/12/2013 : TB85071 : Pose la hook globale sur onfocus si on n'a pas déjà posé
	function __AttacheFocusDialogueSiDialogue()
	{
//		// TB83940 : Cas spécial Firefox 1.5 pour faire fonctionner CelluleAfficheDialogue (uniquement avec les options de la 14)
//		if (window._PAGE_.getBoundingClientRect)
//		{
		var oDialogues = clWDUtil.m_oDialogues;
		for (var sAliasDialogue in oDialogues)
		{
			if (oDialogues.hasOwnProperty(sAliasDialogue))
			{
				// Un dialogue est ouvert
				__AttacheFocusDialogue();
				break;
			}
		}
//		}
	}
	function __AttacheFocusDialogue()
	{
//		// TB83940 : Cas spécial Firefox 1.5 pour faire fonctionner CelluleAfficheDialogue (uniquement avec les options de la 14)
//		if (window._PAGE_.getBoundingClientRect)
//		{
		// On hook/unhook le onblur de tous les champs de la selection
		clWDUtil.bForEach(clWDUtil.tabGetElements(window._PAGE_.children[1], true), function (oElement)
		{
			var oChampSansFocus = { m_oElement: oElement };
			if (oElement.tabIndex)
			{
				oChampSansFocus.m_sTabIndex = oElement.tabIndex;
			}
			oElement.tabIndex = "-1";
			ms_tabChampSansFocus.push(oChampSansFocus);
			return true;
		});
//		}
	}

	// Dimensionne/Redimensionne le GFI
	function __SetDimensionGFI(oCelluleGFI/*, oDialogue*/)
	{
		var oDocument = oCelluleGFI.ownerDocument;
//		// TB83940 : Cas spécial Firefox 1.5 pour faire fonctionner CelluleAfficheDialogue (uniquement avec les options de la 14)
//		if (!window._PAGE_.getBoundingClientRect)
//		{
//			oCelluleGFI.style.left = _JCCP(0, window._PAGE_, true, false) + "px";
//			oCelluleGFI.style.top = _JCCP(0, window._PAGE_, false, false) + "px";
//		}
//		else
//		{
		// GP 27/01/2016 : TB96252 : Historiquement le code ici utilise _PAGE_ comme référence.
		// Sauf que _PAGE_ est le formulaire qui est la partie "centrée" de la page.
		// Mais en responsive, le formulaire est centré et ne prend pas toute la taille
		// GP 04/04/2016 : QW271556 : Mais il ne faut pas l'utiliser pour "top"
		// En fait c'est le suite logique de QW271555 : La première correction est ici : TB96252. QW271541 est basé sur la correction de TB96252. Il est donc
		// logique de devoir corriger aussi la correction de
		var oCiblePourLeft = clWDUtil.bRWD ? oDocument.body : window._PAGE_;
		oCelluleGFI.style.left = (-clWDUtil.nGetBoundingClientRectLeft(oCiblePourLeft, true)) + "px";
		oCelluleGFI.style.top = (-clWDUtil.nGetBoundingClientRectTop(window._PAGE_, true)) + "px";
//		}
		// GP 17/07/2015 : QW258341 : Nouvel algo dans le redimensionnement : on réduit la taille du GFI pour avoir la taille correcte en réduction et on n'utilise plus oDialogue.m_nWidthInit et
		// oDialogue.m_nHeightInit : ils bloquent l'agrandissement.
//		oCelluleGFI.style.width = clWDUtil.__sGetBodyScrollOffsetPx(oDocument, "Width", oDialogue.m_nWidthInit);
//		oCelluleGFI.style.height = clWDUtil.__sGetBodyScrollOffsetPx(oDocument, "Height", oDialogue.m_nHeightInit);
		oCelluleGFI.style.width = "1px";
		oCelluleGFI.style.height = "1px";
		// Force un reflow
		oCelluleGFI.offsetHight;
		oCelluleGFI.style.width = clWDUtil.__sGetBodyScrollOffsetPx(oDocument, "Width");
		oCelluleGFI.style.height = clWDUtil.__sGetBodyScrollOffsetPx(oDocument, "Height");
	}
	function __SetPositionDialogueFiltre(oDialogue, bForce)
	{
		// Toujours dans IE
		if (!bIEQuirks9Max || bForce)
		{
			var oTaille = oDialogue.m_oCellule.getBoundingClientRect();
			var oTailleSav = oDialogue.m_oTaille;
			if ((oTaille.left == oTailleSav.left) && (oTaille.right == oTailleSav.right) && (oTaille.top == oTailleSav.top) && (oTaille.bottom == oTailleSav.bottom))
			{
				// Si rien n'a changé
				return;
			}
			// GP 12/12/2012 : Fait dans __SetPositionDialogue
//			// Memorise la nouvelle taille
//			oDialogue.m_oTaille = oTaille;
		}

		// On doit reposionner le dialogue
		__SetPositionDialogue(oDialogue);
	}
	// Repositionne un élément
	// On doit recevoir le document car oElement.document n'est pas valide avant un affichage
	function __SetPositionDialogue(oDialogue)
	{
		clWDUtil.DeplaceElement(oDialogue.m_oCellule, oDialogue.m_oCellule.ownerDocument, oDialogue.m_ePosition, oDialogue.m_nX, oDialogue.m_nY, oDialogue.m_bFixed, undefined, undefined, true);
		if (oDialogue.m_bFixed)
		{
			oDialogue.m_oTaille = oDialogue.m_oCellule.getBoundingClientRect();
		}

		// GP 27/05/2013 : QW232651 : Force le recalcul des ancrages
		clWDUtil.m_oNotificationsRedimensionnement.LanceNotifications(clWDUtil, oDialogue.m_oCellule);
	}

	// Ferme une cellule/popup affichée avec clWDUtil.CelluleAfficheDialogue
	clWDUtil.CelluleFermeDialogue = function CelluleFermeDialogue(sAliasCellule)
	{
		var oDialogues = clWDUtil.m_oDialogues;
		var oDialogue = oDialogues[sAliasCellule];
		if (!oDialogue)
		{
			return;
		}
		function fFermeDlg()
		{
			// Si on est dans la remière fermeture en affichage d'un menu : ne fait rien
			if (oDialogue.m_bDoubleAffichageMenu)
			{
				oDialogue.m_bDoubleAffichageMenu = false;
				return;
			}

			__DetacheFocusDialogue();

			// Détache le code de gestion de echap en cas de code annulable.
			if (oDialogue.m_pfAnnulable)
			{
				clWDUtil.AttacheDetacheEvent(false
					, document
					, "keydown"
					, oDialogue.m_pfAnnulable
					, true);
				oDialogue.m_pfAnnulable = undefined;
			}

			var oCellule = oDialogue.m_oCellule;

			// S'enregistre sur le redimensionnement du dialogue si on est en fixed
			// GP 19/11/2012 : QW226287 : oDialogue pas clWDUtil
			if (oDialogue.m_bFixed)
			{
				// GP 12/12/2012 : Ne fonctionne pas dans chrome/firefox
				if (bIEQuirks9Max)
				{
					clWDUtil.AttacheDetacheEvent(false, oCellule, "resize", oDialogue.m_pfOnResizeCellule);
				}
				else
				{
					clearInterval(oDialogue.m_nTimer);
				}

//				clWDUtil.AttacheDetacheEvent(false, oCellule, "resize", oDialogue.m_pfOnResizeCellule);
				oDialogue.m_pfOnResizeCellule = null;
				delete oDialogue.m_pfOnResizeCellule;
			}

			// Suppime la popup du tableau
			oDialogues[sAliasCellule] = null;
			delete oDialogues[sAliasCellule];

			// Masque le GFI si besoin
			if (oDialogue.m_oCelluleGFI)
			{
				oDialogue.m_oCelluleGFI.parentNode.removeChild(oDialogue.m_oCelluleGFI);
				oDialogue.m_oCelluleGFI = null;
				delete oDialogue.m_oCelluleGFI;
			}

			// GP 01/12/2012 : TB79889, TB79345 : Si on état sur un bouton replace le style de non survol
			clWDUtil.bForEach(oCellule.getElementsByTagName("a"), function (oLien)
			{
				if (oLien.onmouseout)
				{
					(oLien.onmouseout)();
				}
				return true;
			});

			// Si on est pas dans un menu, supprime la classe qui a déclencher les animations
			var bFermeDirectement = true;
			if (!oDialogue.m_oJSMenu)
			{
				// sClasseAjoute : laissé exprès a undefined
				var sClasseAjoute;
				// Filtre les navigateur avec onanimationend
				// GP 01/06/2015 : Le tableau m_oPopupAnimations n'a pas besoin de contenir les clones, le code dans clWDUtil en tient compte :
				// - On recoit l'alias effectif du champ.
				// - Sauf que clWDUtil.m_oPopupAnimations n'est déclaré que avec les champs avec des animations et que pour les champs présents en édition.
				// On doit donc vérifier que :
				// - Le champ popup source est avec animations
				// => Il y a une entrée dans le tableau pour l'alias original
				// - Le champ popup effectif n'est pas avec une animation
				if (ms_sAnimationEnd && (null === clWDUtil.m_oPopupAnimations[clWDUtil.sGetAliasDeEffectif(sAliasCellule)]) && !clWDUtil.m_oPopupAnimations[sAliasCellule])
				{
					// Si on déclenche une animation : reporte l'application de zIndex, left, top et visibility
					bFermeDirectement = false;
					sClasseAjoute = "WDPopupInvisible";
					oDialogue.m_fFonction = function () { __FinCelluleFermeDialogueDifferee(sAliasCellule); };
					clWDUtil.AttacheDetacheEvent(true, oCellule, ms_sAnimationEnd, oDialogue.m_fFonction);
					clWDUtil.m_oPopupAnimations[sAliasCellule] = oDialogue;
				}
				clWDUtil.RemplaceClassName(oCellule, "WDPopupVisible", sClasseAjoute);
			}
			else
			{
				oDialogue.m_oJSMenu = null;
				delete oDialogue.m_oJSMenu;
			}

			if (bFermeDirectement)
			{
				__FinCelluleFermeDialogue(oDialogue);
			}

			__AttacheFocusDialogueSiDialogue();

			// Supprime la structure
			oDialogue = null;

			// Force la MAJ des champs masques (pour le champ image avec defilement)
			AppelMethode(WDChamp.prototype.ms_sOnDisplay, [oCellule, false]);

			//Notiofication de fermeture de popup
			if (window.$ && oCellule)
			{
				$(oCellule).trigger("trigger.wb.combo.popup.ferme");
			}

			oCellule = null;
		};
		//applique l'effet de masquage ou ferme directement
		var bAppelSynchroneFermeDlg = true;
		if (window.$)
		{
			//masque les fils
			$(window).trigger("trigger.wb.postUpdateLayoutSuperposableEpingle.disparition", oDialogue.m_oCellule);
			//masque la cellle
			if ($(oDialogue.m_oCellule).trigger("trigger.wb.effet.apparition.masque", { fCallback: fFermeDlg }) === true)
			{
				bAppelSynchroneFermeDlg = false;
			}
		}
		if (bAppelSynchroneFermeDlg)
		{
			//appeler directement
			fFermeDlg();
		}
	};

	// Fermeture de la popup (factorisé entre CelluleFermeDialogue et __FinCelluleFermeDialogueDifferee)
	function __FinCelluleFermeDialogue(oDialogue)
	{
		var oCellule = oDialogue.m_oCellule;
		oDialogue.m_oCellule = null;
		delete oDialogue.m_oCellule;

		// Restaure le z-index et la position de l'element
		oCellule.style.zIndex = oDialogue.zIndex;
		// GP 20/03/2014 : TB86415 : Bien sur on doit placer l'unité si oon est différent de 0
		oCellule.style.left = oDialogue.left + ((0 != oDialogue.left) ? "px" : "");
		oCellule.style.top = oDialogue.top + ((0 != oDialogue.top) ? "px" : "");
		oCellule.style.visibility = "hidden";

		// GP 05/09/2013 : QW234730 : Il faut refaire un display:none sur la popup pour corriger le problème.
		// Le problème c'est que cela risque de faire des problème (la popup/cellule n'a plus de taille ainsi que ses éléments)
		// => Si on a trop de régression, il faudra revenir en arrière sur cette correction qui est quand même pour un cas marginal (Google+ dans une popup).
		if (oDialogue.m_bDisplayNone)
		{
			oCellule.style.display = "none";
		}

		var tabEtat = [];
		__CelluleDeplaceInterrupteur(oCellule, tabEtat, true);
		(oCellule = oCellule.parentNode.removeChild(oCellule));
		(oCellule = oDialogue.oParent.appendChild(oCellule));
		oDialogue.oParent = null;
		delete oDialogue.oParent;
		__CelluleDeplaceInterrupteur(oCellule, tabEtat, false);
	}

	// Fermeture en cas d'animation
	function __FinCelluleFermeDialogueDifferee(sAliasCellule)
	{
		var oDialogue = clWDUtil.m_oPopupAnimations[sAliasCellule];
		// undefined : pas d'animation en fermeture
		// null : pas d'animation en cours en fermeture
		// objet : animation en cours en fermeture
		if ((undefined !== oDialogue) && (null !== oDialogue))
		{
			clWDUtil.AttacheDetacheEvent(false, oDialogue.m_oCellule, ms_sAnimationEnd, oDialogue.m_fFonction);
			oDialogue.m_fFonction = null;
			delete oDialogue.m_fFonction;

			// Deplace la cellule (vide une partie des membres de oDialogue
			clWDUtil.RemplaceClassName(oDialogue.m_oCellule, "WDPopupInvisible", undefined);
			__FinCelluleFermeDialogue(oDialogue);

			// Supprime le membre de m_oPopupAnimations
			clWDUtil.m_oPopupAnimations[sAliasCellule] = null;
		}
	}

	// Affiche une des messages box navigateur manipulé par une fenêtre interne
	clWDUtil.MessageBoxAfficheDialogue = function MessageBoxAfficheDialogue(oObjet, nBoutonDefaut, sCodeBouton1, sCodeBouton2, sMessage)
	{
		// Affiche la cellule
		// GP 12/03/2020 : TB115983 : Débloque le client en forcant le cast ici. Mais c'est un contournement. La bonne correction est d'avoir le cast en valeur native lors de l'affectation dans oObjet.sAlias.
		this.CelluleAfficheDialogue(String(oObjet.sAlias), document, 5, _GFI_A_, _GFI_T_);

		// Defini les parametres
		oObjet.SetExec(sMessage, sCodeBouton1, sCodeBouton2, nBoutonDefaut);
	};

	// GP 31/01/2013 : TB80521 : Problème de reflow dans :
	// - IE8/9
	// - En mode HTML4
	// - Affiché dans un CelluleAfficheDialogue/PopupAffiche
	// (=> On ne test que le fait qu'une cellule soit affichée : clWDUtil.m_oDialogues vide)
	// (clWDUtil existe toujours maintenant)
	if (bIEQuirks9Max)
	{
		clWDUtil.s_ForceReflowDialogueParent = function s_ForceReflowDialogueParent(oChamp, oElement)
		{
			clWDUtil.bForEachIn(clWDUtil.m_oDialogues, function (sDialogue, oDialogue)
			{
				var oCellule = oDialogue.m_oCellule;
				if (clWDUtil.bEstFils(oElement, oCellule))
				{
					// Force le reflow par l'ajout d'une classe ou la suppression d'une classe
					clWDUtil.ActiveDesactiveClassName(oCellule, "wdForceReflow", !clWDUtil.bAvecClasse(oCellule, "wdForceReflow"));
					// Fin de la recherche
					return false;
				}
				else
				{
					return true;
				}
			});
		};
	}

	// Force le redimensionnement d'une cellule (pour WDVignette.prototype.__ChargementTermineRecentre)
	clWDUtil.RecentreDialogue = function RecentreDialogue(sAlias)
	{
		var oDialogue = this.m_oDialogues[sAlias];
		if (oDialogue)
		{
			__SetPositionDialogue(oDialogue);
		}
	};

	// Déplace un élément dans la page
	clWDUtil.ms_ePlaceFixe = 0;
	clWDUtil.ms_ePlaceHautGauche = 1;
	clWDUtil.ms_ePlaceHautDroite = 2;
	clWDUtil.ms_ePlaceBasGauche = 3;
	clWDUtil.ms_ePlaceBasDroite = 4;
	clWDUtil.ms_ePlaceCentre = 5;
	clWDUtil.ms_ePlaceSouris = 6;
	clWDUtil.ms_ePlaceHautCentre = 7;
	clWDUtil.ms_ePlaceCentreGauche = 8;
	clWDUtil.ms_ePlaceCentreDroite = 9;
	clWDUtil.ms_ePlaceBasCentre = 10;
	var ms_tabPlaceFacteurX = [0, 0, 1, 0, 1, 0.5, 0, 0.5, 0, 1, 0.5];
	var ms_tabPlaceFacteurY = [0, 0, 0, 1, 1, 0.5, 0, 0, 0.5, 0.5, 1];
	clWDUtil.DeplaceElement = function DeplaceElement(oElement, oDocument, ePosition, nX, nY, bFixed, b100X, b100Y, bForceScroll)
	{
		// Deplacement du champ si besoin
		switch (ePosition)
		{
		case this.ms_ePlaceFixe:
		// GP 14/05/2013 : TB81840 : Ne transforme plus ePlaceSouris en ePlaceFixe, donc il faut accepter les deux cas ici
		case this.ms_ePlaceSouris:
			break;
		default:
			var nFacteurX = ms_tabPlaceFacteurX[ePosition];
			var nFacteurY = ms_tabPlaceFacteurY[ePosition];
//			// TB83940 : Cas spécial Firefox 1.5 pour faire fonctionner CelluleAfficheDialogue (uniquement avec les options de la 14)
//			if (!window._PAGE_.getBoundingClientRect)
//			{
//				nX = _JCCP(clWDUtil.nGetBodyScrollLeft(), oElement, true, false) + (this.__nGetBodyPropriete(oDocument, "clientWidth") - oElement.clientWidth) * nFacteurX;
//				nY = _JCCP(clWDUtil.nGetBodyScrollTop(), oElement, false, false) + (this.__nGetBodyPropriete(oDocument, "clientHeight") - oElement.clientHeight) * nFacteurY;
//			}
//			else
//			{
			// Calcule le scrollLeft et scrollTop du navigateur selon le navigateur et le mode
			var oParent = oElement.offsetParent ? oElement.offsetParent : oDocument.body;
			// GP 22/11/2012 : QW226565 : Ajout de bForceScroll : je ne comprend pas comment cela fonctionnait avant
			// GP 28/03/2013 : TB81810 : Fonctionne sans le bForceScroll : il faut voir pour être plus précis
			// (sauf dans Firefox pour la hauteur du navigateur)
			var bForceScrollSiParentBody = (oParent == oDocument.body) && bForceScroll;
			nX = -this.nGetBoundingClientRectLeft(oParent, bFixed || bForceScrollSiParentBody, bFixed || b100X);
			nY = -this.nGetBoundingClientRectTop(oParent, bFixed || bForceScrollSiParentBody, bFixed || b100Y);

			var oStyle = clWDUtil.oGetCurrentStyle(oElement);

			// Horizontalement
			// Sauf si on est en 100% (calcul inutile car l'élément fait normalement la largeur)
			if (!b100X && (0 != nFacteurX))
			{
				// GP 23/05/2016 : TB97490 : Utilisation de clientWidth ne fonctionne pas. Ce que l'on veux est la largeur complete de l'élément avec bordure et marges.
//				nX += (this.__nGetBodyPropriete(oDocument, "clientWidth") - oElement.clientWidth) * nFacteurX;
				nX += (this.__nGetBodyPropriete(oDocument, "clientWidth") - (oElement.offsetWidth + __nGetMargin(oStyle, "Left") + __nGetMargin(oStyle, "Right"))) * nFacteurX;
			}
			// Verticalement
			if (!b100Y && (0 != nFacteurY))
			{
				// GP 23/05/2016 : TB97490 : Utilisation de clientHeight ne fonctionne pas. Ce que l'on veux est la hauteur complete de l'élément avec bordure et marges.
//				nY += (this.__nGetBodyPropriete(oDocument, "clientHeight") - oElement.clientHeight) * nFacteurY;
				nY += (this.__nGetBodyPropriete(oDocument, "clientHeight") - (oElement.offsetHeight + __nGetMargin(oStyle, "Top") + __nGetMargin(oStyle, "Bottom"))) * nFacteurY;
			}

			// GP 14/05/2018 : TB97444 : Tente de ne pas déborder en bas (pour ne pas avoir l'affichage de la popup qui déplace l'ascenseur)
			// Note 1 : Je ne suis pas sur des valeurs avec IE ou en HTML4, donc on n'active le code que en HTML5
			// Note 2 : Fait avant le cas pour le haut : on privilégie le fait d'afficher le haut.
			if ((!bIEAvec11) && this.bHTML5)
			{
				var nDepassement = nY + oElement.offsetHeight - document.body.scrollHeight;
				if (0 < nDepassement)
				{
					nY -= nDepassement;
				}
			}
			// GP 09/04/2018 : TB108188 : Si le parent est le body (= une vraie popup), que l'on demande une position pas en pixel, alors on force l'élément à une position "0".
			// En effet sinon une popup trop grande est masqué en haut mais fait un défilement en bas => On peut donc la mettre plus bas.
			// Ne le fait pas horizontalement car la position négative semble possible (dans le cas d'une page centrée ?).
			if (nY < 0)
			{
				nY = 0;
			}
//			}
			break;
		}
		if (nX !== undefined)
		{
			// GP 03/04/2017 : TB102271 : Si on est en RtL, le positionnement de la popup est a droite par défaut (right:0px)
			// Sauf que cela ne marche pas car le nX est calculé par le code ci dessus qui n'inverse pas.
			// Et dans le cas on nepeut pas utiliser SetStyleLeft car nX n'est pas inversé
//			clWDUtil.SetStyleLeft(oElement.style, nX, 0)
			// GP 25/05/2018 : QW299196 : Il ne faut pas utiliser SetDimensionPxStyle qui n'accepte pas les valeurs négatives.
//			clWDUtil.SetDimensionPxStyle(nX, oElement, "left");
			oElement.style.left = (0 != nX) ? (nX + "px") : "0";
			if (clWDUtil.bRTL)
			{
				oElement.style.right = "";
			}
		}
		if (nY !== undefined)
		{
			// GP 25/05/2018 : QW299196 : Il ne faut pas utiliser SetDimensionPxStyle qui n'accepte pas les valeurs négatives.
//			clWDUtil.SetDimensionPxStyle(nY, oElement, "top");
			oElement.style.top = (0 != nY) ? (nY + "px") : "0";
		}
	};
	function __nGetMargin(oStyle, sNomMargin)
	{
		// GP 24/05/2016 : QW273349 : On peut avoir auto comme margin (reproduit uniquement avec IE en mode quirks mais cela ne signifie pas que c'est le seul cas) ce qui déclenche un NaN
		var nMargin = parseInt(oStyle["margin" + sNomMargin], 10);
		return isNaN(nMargin) ? 0 : nMargin;
	}

	// Déplace une cellule
	clWDUtil.oCelluleDeplace = function oCelluleDeplace(oParentNouveau, oElement)
	{
		// L'idée est ne de pas déplacer si inutile.
		// GP 17/04/2015 : TB92262 : Il faut déplacer à la fin du parent pour que la derniere cellule ouverte soit en fin du conteneur parent (une balise racine de la page) pour être affichée dessus
		// => Donc on ne peut pas tester simplement la différence de conteneur parent.
		// GP 22/04/2019 : QW323090 : En revanche on peut tester si on n'est pas déjà le dernier fils du parent.
//		if (oParentNouveau != oElement.parentNode)
		if (oParentNouveau.lastElementChild !== oElement)
		{
			var tabEtat = [];
			__CelluleDeplaceInterrupteur(oElement, tabEtat, true);
			oElement = oParentNouveau.insertBefore(oElement, null);
			// Contournement de problemes avec IE9 (les champs superposables dans la cellule ne sont pas affiches au premier dessin
			// Sauf que en mode compat IE9 retourne IE7
			if (bIE && (7 <= nIE) && (undefined !== oElement.className))
			{
				oElement.className += "";
			}
			__CelluleDeplaceInterrupteur(oElement, tabEtat, false);
		}

		return oElement;
	};

	// Calcul pour le déplacement des interrupteurs dans une cellule (bug dans IE)
	var __CelluleDeplaceInterrupteur = clWDUtil.m_pfVide;
	if (bIE && (nIE < 8))
	{
		__CelluleDeplaceInterrupteur = function(oElement, tabEtat, bSauvegarde)
		{
			clWDUtil.bForEach(oElement.getElementsByTagName("input"), function (oInput)
			{
				if (oInput.type.toLowerCase() == "checkbox")
				{
					if (bSauvegarde)
					{
						tabEtat.push(oInput.checked);
					}
					else
					{
						oInput.checked = tabEtat.shift();
					}
				}
				return true;
			});
		};
	}
})();

// Fonction de reencodage en HTML
clWDUtil.sEncodeInnerHTML = function sEncodeInnerHTML(sValeur, bRemplaceBR, bPasEncodeBalise)
{
	// Force en chaine (replace ne fonctionne que sur les chaine)
	sValeur = String(sValeur);

	// Remplace le minimum de caracteres
	if (!bPasEncodeBalise)
	{
		sValeur = sValeur.replace(/&/g, "&amp;");
		sValeur = sValeur.replace(/</g, "&lt;");
		sValeur = sValeur.replace(/>/g, "&gt;");
//		sValeur = sValeur.replace(/\'/g, "&apos;");
//		sValeur = sValeur.replace(/\"/g, "&quot;");
	}

	if (bRemplaceBR)
	{
		// Met des balises BR pour les marques de lignes
		sValeur = sValeur.replace(/\r\n/g, "<br />");
		sValeur = sValeur.replace(/\n/g, "<br />");
	}

	// Renvoi de la valeur
	return sValeur;
};

//////////////////////////////////////////////////////////////////////////
// Gestion du fixed (position figée)
var WDFixed = (function ()
{
	"use strict";

	function __WDFixed(oElement, ePosition, nX, nY, b100X, b100Y)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			// Mémorise les parametres
			this.m_oElement = oElement;
			this.m_ePosition = ePosition;
			this.m_nX = nX;
			this.m_nY = nY;
			this.m_b100X = b100X;
			this.m_b100Y = b100Y;

			// Calcule si on est en positionnement fixed émulé ou en positionnement fixed normal
			this.m_bEmuleFixed = this.__bEmuleFixed();

			// Positionne l'élément (positionnement initial)
			this.__Positionne(true);

			// Ajoute la callback pour la cas ou l'on utilise l'émulation
			clWDUtil.AttacheOnScrollResize(__PositionneTous);
		}
	};

	// "Tableau" des éléments actuellement affichés
	var ms_oFixeds = [];

	// Declare un element
	__WDFixed.prototype.s_Declare = function s_Declare(sCle, oElement, ePosition, nX, nY, b100X, b100Y)
	{
		ms_oFixeds[sCle] = new __WDFixed(oElement, ePosition, nX, nY, b100X, b100Y);
	};
	// Supprime un élément du tableau
	__WDFixed.prototype.s_Supprime = function s_Supprime(sCle)
	{
		var oFixed = ms_oFixeds[sCle];
		if (oFixed)
		{
			ms_oFixeds[sCle] = null;
			delete ms_oFixeds[sCle];

			// Libère les membres interne
			oFixed.m_oElement = null;
		}
	};

	// Force le repositionnement d'un conteneur
	// oFixed : reçu dans le cas de l'appel depuis __PositionneTous
	function __bRepositionne(sCle/*, oFixed*/)
	{
		// Positionne l'élément (ce n'est pas le positionnement initial)
		ms_oFixeds[sCle].__Positionne(false);

		return true;
	}
	__WDFixed.prototype.s_bRepositionne = __bRepositionne;

	// Indique si on doit emuler le fixed
	__WDFixed.prototype.__bEmuleFixed = function __bEmuleFixed()
	{
		// Toujours en quirks
		if (bIEQuirks)
		{
			return true;
		}

		switch (this.m_ePosition)
		{
		case clWDUtil.ms_ePlaceFixe:
		case clWDUtil.ms_ePlaceHautGauche:
		case clWDUtil.ms_ePlaceHautDroite:
		case clWDUtil.ms_ePlaceBasGauche:
		case clWDUtil.ms_ePlaceBasDroite:
		// GP 14/05/2013 : TB81840 : Ne transforme plus ePlaceSouris en ePlaceFixe, donc il faut accepter les deux cas ici
		case clWDUtil.ms_ePlaceSouris:
			return false;
		case clWDUtil.ms_ePlaceCentre:
			// Toujours sauf si on a une extension en hauteur et en largeur
			return !(this.m_b100X && this.m_b100Y);
		case clWDUtil.ms_ePlaceHautCentre:
		case clWDUtil.ms_ePlaceBasCentre:
			// Toujours sauf si on a une extension en largeur
			return !this.m_b100X;
		case clWDUtil.ms_ePlaceCentreGauche:
		case clWDUtil.ms_ePlaceCentreDroite:
			// Toujours sauf si on a une extension en hauteur
			return !this.m_b100Y;
		}
	};

	// Positionne tous les éléments
	function __PositionneTous()
	{
		// Pour tous les éléments affiché : les positionnes
		// Positionne l'élément (ce n'est pas le positionnement initial)
		clWDUtil.bForEachIn(ms_oFixeds, __bRepositionne);
	};

	// Positionnement de l'élément
	// => Différent si on a besoin d'une emulation ou pas
	__WDFixed.prototype.__Positionne = function __Positionne(bInitial)
	{
		// Si le navigateur support le fixed
		if (!this.m_bEmuleFixed)
		{
			this.__PositionneFixed(bInitial);
		}
		else
		{
			this.__PositionneEmule(bInitial);
		}
	};
	// Positionnement de l'élément en vrai fixed
	__WDFixed.prototype.__PositionneFixed = function __PositionneFixed(bInitial)
	{
		// Uniquement sur l'appel initial. Après il n'y a plus rien a faire
		if (bInitial)
		{
			var oStyle = this.m_oElement.style;
			oStyle.position = "fixed";
			switch (this.m_ePosition)
			{
			case clWDUtil.ms_ePlaceFixe:
			// GP 14/05/2013 : TB81840 : Ne transforme plus ePlaceSouris en ePlaceFixe, donc il faut accepter les deux cas ici
			case clWDUtil.ms_ePlaceSouris:
				oStyle.top = this.m_nX + "px";
				oStyle.left = this.m_nY + "px";
				break;
			case clWDUtil.ms_ePlaceHautGauche:
				oStyle.top = "0px";
				oStyle.left = "0px";
				break;
			case clWDUtil.ms_ePlaceHautDroite:
				oStyle.top = "0px";
				oStyle.right = "0px";
				break;
			case clWDUtil.ms_ePlaceBasGauche:
				oStyle.bottom = "0px";
				oStyle.left = "0px";
				break;
			case clWDUtil.ms_ePlaceBasDroite:
				oStyle.bottom = "0px";
				oStyle.right = "0px";
				break;
			case clWDUtil.ms_ePlaceCentre:
				// On doit avoir un double ancrage en 100% traité au final
				break;
			case clWDUtil.ms_ePlaceHautCentre:
				oStyle.top = "0px";
				break;
			case clWDUtil.ms_ePlaceBasCentre:
				oStyle.bottom = "0px";
				break;
			case clWDUtil.ms_ePlaceCentreGauche:
				oStyle.left = "0px";
				break;
			case clWDUtil.ms_ePlaceCentreDroite:
				oStyle.right = "0px";
				break;
			}
			// Effectue l'extension
			if (this.m_b100X)
			{
				oStyle.left = "0px";
				oStyle.right = "0px";
			}
			// Effectue l'extension
			if (this.m_b100Y)
			{
				oStyle.top = "0px";
				oStyle.bottom = "0px";
			}
		}
	};
	// Positionnement de l'élément en emulation
	__WDFixed.prototype.__PositionneEmule = function __PositionneEmule(bInitial)
	{
		if (bInitial)
		{
			this.m_oElement.style.position = "absolute";
			if (this.m_b100X)
			{
				this.m_oElement.style.width = "100%";
			}
			if (this.m_b100Y)
			{
				this.m_oElement.style.height = "100%";
			}
		}
		clWDUtil.DeplaceElement(this.m_oElement, this.m_oElement.ownerDocument, this.m_ePosition, this.m_nX, this.m_nY, true, this.m_b100X, this.m_b100Y);
	};

	return __WDFixed;
})();

//////////////////////////////////////////////////////////////////////////
// Gestion des DINOs

// Classe de base des types avances
var WDTypeAvance = (function ()
{
	"use strict";

	function __WDTypeAvance(/*bConstructeur*/)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
		}
	}

	// Lire une propriete : a definir dans chaque type
	__WDTypeAvance.prototype.GetProp = function GetProp(/*nPropriete*/)
	{
		return null;
	};
	__WDTypeAvance.prototype.SetProp = function SetProp(/*nPropriete*//*, clValeur*/)
	{
	};
	__WDTypeAvance.prototype.SetPropCombine = function SetPropCombine(nPropriete, clValeur)
	{
		return this.SetProp(nPropriete, clValeur);
	};

	// Duplique deux instances d'un type avancé
	__WDTypeAvance.prototype.Clone = function Clone(clSource)
	{
		// Les deux instances doivent être du même objet
		if (clSource instanceof this.constructor)
		{
			__CloneObjet(this, clSource);
		}
		else
		{
			// Pas d'erreur comme en WL serveur
		}
	};
	// Duplique deux instances d'un type avancé
	__WDTypeAvance.prototype.CloneStructure = function CloneStructure(clSource)
	{
		// Les deux instances doivent être du même objet
		if (clSource instanceof this.constructor)
		{
			__CloneObjet(this, clSource);
		}
		else
		{
			// Erreur fatale WL (pas de copie homonymique entre structures) :
			// "On ne peut pas affecter à une structure autre chose qu'une structure de mêEAme définition."
			throw new WDErreur(600);
		}
	};

	function __CloneTableau(tabTableauDest, tabTableauSource)
	{
		var nLongueur = tabTableauSource.length;
		tabTableauDest.length = nLongueur;
		for (var nElement = 0; nElement < nLongueur; nElement++)
		{
			var clElement = tabTableauSource[nElement];
			// GP 27/11/2014 : On utilise clElement et pas clElement
			if (clElement instanceof __WDTypeAvance)
			{
				tabTableauDest[nElement] = new clElement.constructor();
				tabTableauDest[nElement].Clone(clElement);
			}
			else if (clElement instanceof Array)
			{
				tabTableauDest[nElement] = [];
				__CloneTableau(tabTableauDest[nElement], clElement);
			}
			else if (clElement instanceof Object)
			{
				tabTableauDest[nElement] = {};
				__CloneObjet(tabTableauDest[nElement], clElement);
			}
			else
			{
				tabTableauDest[nElement] = clElement;
			}
		}
	}
	__WDTypeAvance.prototype.__CloneTableau = __CloneTableau;
	function __CloneObjet(clObjetDest, clObjetSource)
	{
		for (var sPropriete in clObjetSource)
		{
			// Ne filtre pas sur this (permet de copier des membres non affecté)
			if (clObjetSource.hasOwnProperty(sPropriete))
			{
				var clValeur = clObjetSource[sPropriete];
				// Allocation du membre si besoin
				if (!clObjetDest.hasOwnProperty(sPropriete))
				{
					if (clValeur instanceof __WDTypeAvance)
					{
						clObjetDest[sPropriete] = new clValeur.constructor();
					}
					else if (clValeur instanceof Array)
					{
						clObjetDest[sPropriete] = [];
					}
					else if (clValeur instanceof Object)
					{
						clObjetDest[sPropriete] = {};
					}
				}
				if (clValeur instanceof __WDTypeAvance)
				{
					clObjetDest[sPropriete].Clone(clValeur);
				}
				else if (clValeur instanceof Array)
				{
					__CloneTableau(clObjetDest[sPropriete], clValeur);
				}
				else if (clValeur instanceof Date)
				{
					// GP 28/11/2014 : QW252632 : Code de copie spécifique pour l'objet date sinon on tombe dans le cas Object qui en fait rien (car Date n'a aucune "OwnProperty")
					// GP 16/10/2014 : QW249961 : new Date(Date()) perd les millisecondes !!!
					(clObjetDest[sPropriete] = new Date()).setTime(clValeur.getTime());

				}
				else if (clValeur instanceof Object)
				{
					__CloneObjet(clObjetDest[sPropriete], clValeur);
				}
				else
				{
					clObjetDest[sPropriete] = clValeur;
				}
			}
		}
	};

	return __WDTypeAvance;
})();

//////////////////////////////////////////////////////////////////////////
// Dino Couleur

clWDUtil.WDDinoCouleur = (function ()
{
	"use strict";

	// Manipulation d'une couleur
	function __WDDinoCouleur(oValeur)
	{
		// Appel le constructeur de la classe de base
		// Si un jour on derive de la classe, mettre un parametre pour proteger l'appel
		WDTypeAvance.prototype.constructor.apply(this, [true]);

		// On stocke le contenu en RVBA sous forme de réel.
		this.m_tabRVBA = [0, 0, 0, 1];
		this.__Initialisation(oValeur);
	}

	// Declare l'heritage
	__WDDinoCouleur.prototype = new WDTypeAvance();
	// Surcharge le constructeur qui a ete efface
	__WDDinoCouleur.prototype.constructor = __WDDinoCouleur;

	// Initialisation depuis une valeur
	__WDDinoCouleur.prototype.__Initialisation = function __Initialisation(oValeur)
	{
		// On stocke le contenu en RVBA sous forme de réel.
		// La valeur par défaut est noir (non transparent)
		// Pas d'affectation directe du tableau pour conserver les références sur le tableau
		this.m_tabRVBA[0] = 0;
		this.m_tabRVBA[1] = 0;
		this.m_tabRVBA[2] = 0;
		this.m_tabRVBA[3] = 1;

		// Affecte le contenu de la couleur reçue
		switch (typeof oValeur)
		{
		case "undefined":
			// Conserve les couleurs par défaut;
			break;
		case "number":
			// Conversion entier vers RVBA
			if (-1 == oValeur)
			{
				this.m_tabRVBA[3] = 0;
			}
			else
			{
				this.m_tabRVBA[0] = (oValeur & 0xff);
				this.m_tabRVBA[1] = (oValeur & 0xff00) >>> 8;
				this.m_tabRVBA[2] = (oValeur & 0xff0000) >>> 16;
			}
			break;
		case "object":
			if (oValeur instanceof __WDDinoCouleur)
			{
				this.__CloneTableau(this.m_tabRVBA, oValeur.m_tabRVBA);
				break;
			}
			// Pas de break;
		default:
		case "string":
			// Conversion chaine vers RVBA
			var sValeur = String(oValeur);
			if (!clWDUtil.bHTML2RVBA(sValeur, clWDUtil.m_pfIdentite, this.m_tabRVBA))
			{
				// GP 28/01/2016 : Vu avec le test FonctionsDessinNavigateur_Chrome. Qui a des couleurs numériques mais dans une chaîne.
				// => Si la conversion de la couleur HTML échoue, on regarde si la couleur n'est pas un nombre.
				// Pour le test on regarde si la conversion en nombre ne perd pas de données.
				var nValeur = parseInt(oValeur, 10);
				if ((!isNaN(nValeur)) && (String(nValeur) === sValeur))
				{
					// Appel récursif mais avec un number cette fois ci.
					this.__Initialisation(nValeur);
				}
			}
			break;
		}
	};

	// Cast pour le JS si besoin
	__WDDinoCouleur.prototype.toString = function toString()
	{
		return clWDUtil.sRVBA2HTML(this.m_tabRVBA);
	};
	__WDDinoCouleur.prototype.toNumber = function toNumber()
	{
		return clWDUtil.nRVBA2Int(this.m_tabRVBA);
	};
	// GP 09/11/2016 : Ajout de toJSON
	__WDDinoCouleur.prototype.toJSON = __WDDinoCouleur.prototype.toString;

	// Lire une propriete
	__WDDinoCouleur.prototype.GetProp = function GetProp(nPropriete)
	{
		var oValeur = this.__GetProp(nPropriete);
		// Emule le comportement serveur de ..Teinte, ..Saturation et ..Luminosité qui place les valeur dans [0, 255[
		switch (nPropriete)
		{
		case 4:
			// Teinte
			oValeur *= 255 / 360;
			break;
		case 5:
			// Saturation
			oValeur *= 255 / 100;
			break;
		case 6:
			// Luminosité
			oValeur *= 255 / 100;
			break;
		}
		return oValeur;
	};
	__WDDinoCouleur.prototype.__GetProp = function __GetProp(nPropriete)
	{
		// Toutes les valeurs sont des entiers mais on les retournes sans arrondir
		switch (nPropriete)
		{
		case 0:
			// Rouge : [0, 255]
			return this.m_tabRVBA[0];
		case 1:
			// Vert : [0, 255]
			return this.m_tabRVBA[1];
		case 2:
			// Bleu : [0, 255]
			return this.m_tabRVBA[2];
		case 3:
			// L'opacité dans le DINO couleur est dans [0, 255]
//			// Opacité : [0, 100]
//			return this.m_tabRVBA[3] * 100;
			return this.m_tabRVBA[3] * 255;
		case 4:
			// Teinte : [0, 360]
			return clWDUtil.tabRVBA2TSLA(this.m_tabRVBA)[0];
		case 5:
			// Saturation :  [0, 100]
			return clWDUtil.tabRVBA2TSLA(this.m_tabRVBA)[1] * 100;
		case 6:
			// Luminosité : [0, 100]
			return clWDUtil.tabRVBA2TSLA(this.m_tabRVBA)[2] * 100;
		case 7:
			// Couleur : RVBA au format HTML
			return clWDUtil.sRVBA2HTML(this.m_tabRVBA);
		default:
			return WDTypeAvance.prototype.GetProp.apply(this, arguments);
		}
	};

	// Ecrire une propriete
	__WDDinoCouleur.prototype.SetProp = function SetProp(nPropriete, oValeur)
	{
		// Emule le comportement serveur de ..Teinte, ..Saturation et ..Luminosité qui place les valeur dans [0, 255[
		switch (nPropriete)
		{
		case 4:
			// Teinte
			oValeur *= 360 / 255;
			break;
		case 5:
			// Saturation
			oValeur *= 100 / 255;
			break;
		case 6:
			// Luminosité
			oValeur *= 100 / 255;
			break;
		}
		this.__SetProp(nPropriete, oValeur);
	};
	__WDDinoCouleur.prototype.__SetProp = function __SetProp(nPropriete, oValeur)
	{
		var bTSL = false;
		var tabTSLA = clWDUtil.tabRVBA2TSLA(this.m_tabRVBA);

		switch (nPropriete)
		{
		case 0:
			// Rouge
			this.m_tabRVBA[0] = this.__dValideCouleur(oValeur);
			break;
		case 1:
			// Vert
			this.m_tabRVBA[1] = this.__dValideCouleur(oValeur);
			break;
		case 2:
			// Bleu
			this.m_tabRVBA[2] = this.__dValideCouleur(oValeur);
			break;
		case 3:
			// Opacité
			this.m_tabRVBA[3] = this.__dValideOpacite(oValeur);
			break;
		case 4:
			// Teinte
			tabTSLA[0] = this.__dValideTeinte(oValeur, tabTSLA[0]);
			bTSL = true;
			break;
		case 5:
			// Saturation
			tabTSLA[1] = this.__dValideSaturationLuminosite(oValeur, tabTSLA[1]);
			bTSL = true;
			break;
		case 6:
			// Luminosité
			tabTSLA[2] = this.__dValideSaturationLuminosite(oValeur, tabTSLA[2]);
			bTSL = true;
			break;
		case 7:
			// Couleur
			this.__Initialisation(oValeur);
			break;
		default:
			WDTypeAvance.prototype.SetProp.apply(this, arguments);
			break;
		}

		// Si on a une modification TSL : reporte la modification dans la valeur RVB
		if (bTSL)
		{
			this.SetTSLA(tabTSLA);
		}
	};
	__WDDinoCouleur.prototype.__dValideCouleur = function __dValideCouleur(oCouleur)
	{
		if (isNaN(oCouleur))
		{
			return 0;
		}
		else
		{
			return Math.max(Math.min(parseFloat(oCouleur), 255), 0);
		}
	};
	__WDDinoCouleur.prototype.__dValideOpacite = function __dValideOpacite(oOpacite)
	{
		if (isNaN(oOpacite))
		{
			return 1;
		}
		else
		{
			// L'opacité dans le DINO couleur est dans [0, 255]
//			return Math.max(Math.min(parseFloat(oOpacite) / 100, 1), 0);
			return Math.max(Math.min(parseFloat(oOpacite) / 255, 1), 0);
		}
	};
	__WDDinoCouleur.prototype.__dValideTeinte = function __dValideTeinte(oTeinte, dTeinteDefaut)
	{
		if (isNaN(oTeinte))
		{
			return dTeinteDefaut;
		}
		else
		{
			return clWDUtil.__dParseTeinte(oTeinte);
		}
	};
	__WDDinoCouleur.prototype.__dValideSaturationLuminosite = function __dValideSaturationLuminosite(oSaturationLuminosite, dSaturationLuminositeDefaut)
	{
		if (isNaN(oSaturationLuminosite))
		{
			return dSaturationLuminositeDefaut;
		}
		else
		{
			return clWDUtil.__dParseSaturationLuminosite(oSaturationLuminosite);
		}
	};

	// Construit une couleur depuis ses composantes RVB
	__WDDinoCouleur.s_oRVB = function s_oRVB(dRouge, dVert, dBleu)
	{
		// La validation des couleurs est faite lors de l'affectation
		var oCouleur = new __WDDinoCouleur();
		oCouleur.__SetProp(0, dRouge);
		oCouleur.__SetProp(1, dVert);
		oCouleur.__SetProp(2, dBleu);
		return oCouleur;
	};
	// Construit une couleur depuis ses composantes TSL
	__WDDinoCouleur.s_oTSL = function s_oTSL(dTeinte, dSaturation, dLuminosite)
	{
		// La validation des couleurs est faite lors de l'affectation
		var oCouleur = new __WDDinoCouleur();
		// GP 27/01/2016 : Il faut affecter la dLuminosite avant le reste sinon on perd les autres valeurs.
		oCouleur.__SetProp(6, dLuminosite);
		oCouleur.__SetProp(5, dSaturation);
		oCouleur.__SetProp(4, dTeinte);
		return oCouleur;
	};
	// Récupère un WDDinoCouleur depuis une valeur
	__WDDinoCouleur.s_oGetDinoCouleur = function s_oGetDinoCouleur(oCouleur)
	{
		if (oCouleur instanceof __WDDinoCouleur)
		{
			return oCouleur;
		}
		else
		{
			return new __WDDinoCouleur(oCouleur);
		}
	};

	// Recupere directement les composantes TSL : Attention dans [0, 360[, [0, 1] et [0, 1] et [0, 1]
	__WDDinoCouleur.prototype.tabGetTSLA = function tabGetTSLA()
	{
		return clWDUtil.tabRVBA2TSLA(this.m_tabRVBA);
	};
	// Affecte directement les composantes TSL : Attention dans [0, 360[, [0, 1] et [0, 1] et [0, 1]
	__WDDinoCouleur.prototype.SetTSLA = function SetTSLA(tabTSLA)
	{
		clWDUtil.TSLA2RVBA(tabTSLA, this.m_tabRVBA);
	};

	// Recupere directement les composantes TSL : Attention dans [0, 360[, [0, 100] et [0, 100] et [0, 1]
	// GP 13/04/2016 : Semble inutilisé + manque le "prototype."
	__WDDinoCouleur.tabGetTSLA100 = function tabGetTSLA100()
	{
		var tabTSLA = clWDUtil.tabRVBA2TSLA(this.m_tabRVBA);
		tabTSLA[1] *= 100;
		tabTSLA[2] *= 100;
		return tabTSLA;
	};

	// Récupère la composante rouge, verte et bleue d'une couleur
	__WDDinoCouleur._s_nGetPropriete = function _s_nGetPropriete(oCouleur, nPropriete)
	{
		return Math.round(__WDDinoCouleur.s_oGetDinoCouleur(oCouleur).__GetProp(nPropriete));
	};
	__WDDinoCouleur.s_oRVBRouge = function s_oRVBRouge(oCouleur)
	{
		return __WDDinoCouleur._s_nGetPropriete(oCouleur, 0);
	};
	__WDDinoCouleur.s_oRVBVert = function s_oRVBVert(oCouleur)
	{
		return __WDDinoCouleur._s_nGetPropriete(oCouleur, 1);
	};
	__WDDinoCouleur.s_oRVBBleu = function s_oRVBBleu(oCouleur)
	{
		return __WDDinoCouleur._s_nGetPropriete(oCouleur, 2);
	};
	__WDDinoCouleur.s_oTSLTeinte = function s_oTSLTeinte(oCouleur)
	{
		return __WDDinoCouleur._s_nGetPropriete(oCouleur, 4);
	};
	__WDDinoCouleur.s_oTSLSaturation = function s_oTSLSaturation(oCouleur)
	{
		return __WDDinoCouleur._s_nGetPropriete(oCouleur, 5);
	};
	__WDDinoCouleur.s_oTSLLuminosite = function s_oTSLLuminosite(oCouleur)
	{
		return __WDDinoCouleur._s_nGetPropriete(oCouleur, 6);
	};

	return __WDDinoCouleur;
})();

// Gestion des elements popup de la page
var WDPopupAutomatique = (function ()
{
	"use strict";

	function __WDPopupAutomatique(clObjetParent)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			// Memorise les parametres
			this.m_oObjetParent = clObjetParent;
			this.m_nTimeoutFocus = -1;

			var clThis = this;
			// Cree la methode de hook dans la classe
			this.m_fOnFocus = function (clEvent) { return clThis.OnFocus(clEvent || event); };
			this.m_fOnBlur = function (clEvent) { return clThis.OnBlur(clEvent || event); };

			// Cree une fonction qui appele la fonction de masquage
			this.m_fTimeout = function () { clThis.Masque(undefined, true); };
		}
	}

	__WDPopupAutomatique.prototype.Affiche = function Affiche(clEvent, clElement, clParam)
	{
		// Si on a 'deja' un element, masque l'element precedent
		if (this.m_oElement)
		{
			this.Masque(clEvent, true);
		}
		// Memorise que l'on a un element
		this.m_oElement = clElement;

		// Efface le timeout existant si besoin
		this.__ClearTimeout();

		// Hook les onfocus/onblur des elements
		this.__HookOnFocusBlurRecursif(clElement);

		var nDocumentElementScrollHeightAvantAffichage = clElement.ownerDocument.documentElement.scrollHeight;

		// Si on est pas en mode quirks, IE presente le offsetParent d'un element display:none sur le document
		// donc on montre la popup avant de la placer
		clWDUtil.SetDisplay(this.m_oElement, true);

		// Appel le champ hote
		this.m_oObjetParent.AfficheInterne(clEvent, clElement, clParam, nDocumentElementScrollHeightAvantAffichage);

		// Donne le focus au premier champ APRES l'affichage
		try
		{
			this.m_oElement.getElementsByTagName("a")[0].focus();
		}
		catch (oErreur)
		{
		}
	};

	// Notification de que champ doit etre masquer
	__WDPopupAutomatique.prototype.Masque = function Masque(clEvent, bLostFocus)
	{
		// Efface le timeout existant si besoin
		this.__ClearTimeout();

		// Seulement si l'element existe (il peut ne pas existe si la popup n'a pas ete affichee
		if (this.m_oElement)
		{
			this.__UnhookOnFocusBlurRecursif(this.m_oElement);

			// Masque le champ
			clWDUtil.SetDisplay(this.m_oElement, false);
		}

		// Appel le champ hote
		this.m_oObjetParent.MasqueInterne(clEvent, bLostFocus);

		// Supprime l'element
		this.m_oElement = null;
	};

	// Hook/Unhook les onfocus/onblur des liens
	function __s_HookUnhookOnFocusBlurRecursif(oElement, pfHookUnhook, pfOnFocus, pfOnBlur)
	{
		// Hook/Unhook l'element uniquement s'il peut recevoir le focus
		if (oElement.focus)
		{
			pfHookUnhook(oElement, "onfocus", "focus", pfOnFocus);
			pfHookUnhook(oElement, "onblur", "blur", pfOnBlur);
		}

		// Et ses fils qui ne sont pas du texte simple
		var oFils = oElement.firstElementChild;
		while (oFils)
		{
			__s_HookUnhookOnFocusBlurRecursif(oFils, pfHookUnhook, pfOnFocus, pfOnBlur);
			oFils = oFils.nextElementSibling;
		}
	}

	// Hook les onfocus/onblur des liens
	__WDPopupAutomatique.prototype.__HookOnFocusBlurRecursif = function __HookOnFocusBlurRecursif(oElement)
	{
		__s_HookUnhookOnFocusBlurRecursif(oElement, HookOnXXX, this.m_fOnFocus, this.m_fOnBlur);
	};

	// Supprime les hooks
	__WDPopupAutomatique.prototype.__UnhookOnFocusBlurRecursif = function __UnhookOnFocusBlurRecursif(oElement)
	{
		__s_HookUnhookOnFocusBlurRecursif(oElement, UnhookOnXXX, this.m_fOnFocus, this.m_fOnBlur);
	};

	// Evenement avant l'affectation en AJAX du contenu du calendrier
	__WDPopupAutomatique.prototype.PreAffecteHTML = function PreAffecteHTML(/*bDepuisAJAX*/)
	{
		// Si le champ est affiche : supprime les hooks
		if (this.m_oElement && (this.m_oElement.style.display == clWDUtil.sGetDisplayBlock(this.m_oElement)))
		{
			this.__UnhookOnFocusBlurRecursif(this.m_oElement);
		}
	};

	// Evenement apres l'affectation en AJAX du contenu du calendrier
	__WDPopupAutomatique.prototype.PostAffecteHTML = function PostAffecteHTML(/*bDepuisAJAX*/)
	{
		// Si le champ est affiche : restaure les hooks
		if (this.m_oElement && (this.m_oElement.style.display == clWDUtil.sGetDisplayBlock(this.m_oElement)))
		{
			this.__HookOnFocusBlurRecursif(this.m_oElement);
		}
		// Donne le focus au premier champ
		try
		{
			if (this.m_oElement)
			{
				this.m_oElement.getElementsByTagName("a")[0].focus();
			}
		}
		catch (oErreur)
		{
		}
	};

	// Notification qu'un lien a pris le focus.
	__WDPopupAutomatique.prototype.OnFocus = function OnFocus(/*clEvent*/)
	{
		// Efface le timeout existant si besoin
		this.__ClearTimeout();
	};

	// Notification que le champ a perdu le focus.
	// Il faut tester si le focus est parti dans un autre champ du calendrier ou a l'exterieur
	__WDPopupAutomatique.prototype.OnBlur = function OnBlur(/*clEvent*/)
	{
		// On veut detecter les pertes de focus du calendrier
		// Sauf que la perte de focus d'un lien peut donner le focus a un autre lien du calendrier
		// => On fait un timeout de 1ms qui sera annule par le onfocus de l'autre lien si besoin
		if (-1 === this.m_nTimeoutFocus)
		{
			// GP 08/03/2013 : QW230375 : Reforce l'ancienne méthode (avec la nouvelle on n'a jamais le clic...)
			// Il y a de nouveau la rémance mais au moins cela fonctionne
			// GP 02/11/2018 : TB110801 : On a aussi jamais le clic avec FireFox. Mais utilisation d'un timing un peutplus agressif.
			this.m_nTimeoutFocus = clWDUtil.nSetTimeout(this.m_fTimeout, bFF ? 100 : clWDUtil.ms_nTimeoutImmediatForceAncien);
		}
	};

	// Efface le timeout existant si besoin
	__WDPopupAutomatique.prototype.__ClearTimeout = function __ClearTimeout()
	{
		// Supprime le timeout actif
		if (-1 !== this.m_nTimeoutFocus)
		{
			// Invalide le timeout aupres du systeme
			clWDUtil.ClearTimeout(this.m_nTimeoutFocus);

			// Supprime le membre
			this.m_nTimeoutFocus = -1;
		}
	};

	return __WDPopupAutomatique;
})();

//////////////////////////////////////////////////////////////////////////
// WDPopupSaisie

// Gestion d'un champ de saisie temporaire
var WDPopupSaisie = (function ()
{
	"use strict";

	function __WDPopupSaisie(oChampParent, bValideSurBlur)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			// Memorise les parametres
			this.m_oChampParent = oChampParent;

			// Fonction de validation (attention on suppose que l'on a un formulaire)
			var oThis = this;
			this.m_fValide = function(oEvent)
			{
				oThis.Valide(oEvent || event);
				return clWDUtil.bStopPropagation(oEvent);
			};
			this.m_fAnnule = function(oEvent)
			{
				oThis.Annule();
				return clWDUtil.bStopPropagation(oEvent);
			};
			this.m_fOnBlur = bValideSurBlur ? this.m_fValide : this.m_fAnnule;
			this.m_fAnnuleSiEsc = function(oEvent)
			{
				if (27 == (oEvent || event).keyCode)
				{
					return oThis.m_fAnnule();
				}
			};
			this.m_fDonneFocusSaisie = function() { oThis.__DonneFocusSaisie(); };

			this.m_bDansAnnule = false;
			this.m_fOnBlurModeleMasque = null;
		}
	};

	// Indique si on est en saisie dans le champ
	__WDPopupSaisie.prototype.bSaisieEnCours = function bSaisieEnCours()
	{
		// !! => Force l'évaluation en booléen
		return !!this.m_oFormulaire;
	};

	// Debut de la saisie
	// nReductionLargeur : pour la saisie dans le champ table : on ne prend pas toute la largeur
	__WDPopupSaisie.prototype.Debut = function Debut(oEvent, oConteneurParent, oOffsetParent, nReductionLargeur, bValideSiActif, sValeurInitiale, oChampModeleMasque, sTaillePolice, tabParametresSpecifiques)
	{
		// Traite bValideSiActif
		if (bValideSiActif && this.bSaisieEnCours())
		{
			this.Valide(oEvent);
			return;
		}

		// Annulle l'ancienne saisie si besoin (arrive dans des combinaisons d'evenements bizarres)
		this.Annule();

		// Appel de la methode personnalisable
		this._vDebut.apply(this, [oConteneurParent, oOffsetParent, nReductionLargeur, sValeurInitiale, oChampModeleMasque, sTaillePolice, tabParametresSpecifiques]);

		// Et donne le focus au champ de saisie
		this.m_oSaisie.focus();
		clWDUtil.nSetTimeout(this.m_fDonneFocusSaisie, clWDUtil.ms_oTimeoutImmediat);
	};

	// Fixe le focus
	__WDPopupSaisie.prototype.__DonneFocusSaisie = function __DonneFocusSaisie()
	{
		// Si le champ de saisie est directement supprime de la page, .focus ne fonctionne pas
		// Dans ce cas selon le navigateur, oSaisie.parentNode est null ou est le document, en tous cas ce n'est pas le formulaire
		if (this.bSaisieEnCours())
		{
			var oParent = this.m_oSaisie.parentNode;
			if (oParent && clWDUtil.bBaliseEstTag(oParent, "form"))
			{
				this.m_oSaisie.focus();
			}
		}
	};

	// Debut de la saisie
	// nReductionLargeur : pour la saisie dans le champ table : on ne prend pas toute la largeur
	__WDPopupSaisie.prototype._vDebut = function _vDebut(oConteneurParent, oOffsetParent, nReductionLargeur, sValeurInitiale, oChampModeleMasque, sTaillePolice/*, tabParametresSpecifiques*/)
	{
		// GP 28/03/2018 : QW297778 : Si le conteneur n'est pas le "offsetParent", il faut tenir compte de la position du conteneur.
		var nOffsetLeftSupplementaire = 0;
		var nOffsetTopSupplementaire = 0;
		if (oConteneurParent != oOffsetParent)
		{
			nOffsetLeftSupplementaire = oConteneurParent.offsetLeft;
			nOffsetTopSupplementaire = oConteneurParent.offsetTop;
		}

		// Cree dynamiquement la zone de recherche
		var oFormulaire = document.createElement("form");
		// Avec son action
		oFormulaire.method = "post";
		oFormulaire.action = "javascript:return false;";
		// Puis on place le formulaire au bon endroit
		oFormulaire.style.position = "absolute";
		// GP 15/10/2013 : Demande de SYC : blanc tournant de 1px pour les colonnes de tables
		var nBlancTournant = (0 < nReductionLargeur) ? 1 : 0;
		oFormulaire.style.left = clWDUtil.GetDimensionPxPourStyle(nBlancTournant + nOffsetLeftSupplementaire);
		oFormulaire.style.top = clWDUtil.GetDimensionPxPourStyle(nBlancTournant + nOffsetTopSupplementaire);
		oFormulaire.style.width = (oConteneurParent.offsetWidth - nReductionLargeur - 1 - 2 * nBlancTournant) + "px";
		oFormulaire.style.height = (oConteneurParent.offsetHeight - 2 * nBlancTournant) + "px";

		// Ensuite on fait le champs de saisie
		var oSaisie = document.createElement("input");
		oSaisie.type = "text";
		// On l'attache a son parent
		oSaisie = oFormulaire.appendChild(oSaisie);
		// Et lui defini son style
		oSaisie.style.position = "absolute";
		oSaisie.style.top = "0px";
		oSaisie.style.left = "0px";
		oSaisie.style.width = "100%";
		oSaisie.style.height = "100%";
		oSaisie.style.borderWidth = "0";
		oSaisie.style.borderStyle = "solid";
		// GP 22/10/2015 : Demande de JH/SYC : ajout d'un blanc tourant dans la zone de saisie
		oSaisie.style.paddingLeft = "2px";
		oSaisie.style.paddingRight = "2px";
		// Si la hauteur du parent est faible : reduit la taille de la police
		if ((oConteneurParent.offsetHeight <= 18) && (oConteneurParent.offsetHeight > 0))
		{
			// Force la taille même si on a une taille en paramètre
			sTaillePolice = Math.max(oConteneurParent.offsetHeight - 4, 6) + "px";
		}
		if ((undefined !== sTaillePolice) && ("" != sTaillePolice))
		{
			oSaisie.style.fontSize = sTaillePolice;
		}

		// On met le tout dans la cellule de recherche
		(this.m_oFormulaire = oConteneurParent.appendChild(oFormulaire));
		(this.m_oSaisie = this.m_oFormulaire.elements[0]);

		if ("" != sValeurInitiale)
		{
			this.m_oSaisie.value = sValeurInitiale;
		}

		// Et la methode de validation qui renvoie toujours faux pour ne pas valider le formulaire
		clWDUtil.AttacheDetacheEvent(true, this.m_oFormulaire, "submit", this.m_fValide);
		// Gere la perte du focus et l'annulation
		clWDUtil.AttacheDetacheEvent(true, this.m_oSaisie, "blur", this.m_fOnBlur);
		clWDUtil.AttacheDetacheEvent(true, this.m_oSaisie, "keydown", this.m_fAnnuleSiEsc);

		// Si on a un champ modèle pour la gestion du masque de saisie, copie ses propriétées
		this.__SetMasqueModele(this.m_oSaisie, oChampModeleMasque);
	};

	// Valide la saisie
	__WDPopupSaisie.prototype.Valide = function Valide(oEvent)
	{
		// Si on est dans une annulation
		if (this.m_bDansAnnule)
		{
			return;
		}

		// Seulement si on a une saisie et que l'éventuelle validation valide le contenu
		// GP 27/04/2015 : TB92394 : Comme TB86472 : Certaines fonction de sortie de masque ne retourne rien. Donc on teste explicitement false et on accepte le reste (undefined par exemple)
		if (this.bSaisieEnCours() && (false !== this.__bValideMasqueModele(oEvent)))
		{
			// Appel de la methode personnalisable
			this._vValide.apply(this, [oEvent, this.m_oSaisie.value]);
		}

		// Supprime le HTML de la saisie
		this.Annule();
	};

	// Valide la saisie (ne fait rien par défaut)
	__WDPopupSaisie.prototype._vValide = clWDUtil.m_pfVide;

	// Annule la saisie
	__WDPopupSaisie.prototype.Annule = function Annule()
	{
		try
		{
			// Sur certains navigateur (tablettes) on recoit un onblur lors de la destruction du champ)
			var bDansAnnule = this.m_bDansAnnule;
			this.m_bDansAnnule = true;

			// Seulement si on a deja une saisie en cours
			if (this.bSaisieEnCours())
			{
				// Appel de la methode personnalisable
				this._vAnnule.apply(this, arguments);

				// Supprime les evenements
				clWDUtil.AttacheDetacheEvent(false, this.m_oSaisie, "keydown", this.m_fAnnuleSiEsc);
				clWDUtil.AttacheDetacheEvent(false, this.m_oSaisie, "blur", this.m_fOnBlur);
				clWDUtil.AttacheDetacheEvent(false, this.m_oFormulaire, "submit", this.m_fValide);

				this.__ClearMasqueModele();
			}

			clWDUtil.bHTMLVideDepuisVariable(this, "m_oSaisie");
			clWDUtil.bHTMLVideDepuisVariable(this, "m_oFormulaire");
		}
		finally
		{
			this.m_bDansAnnule = bDansAnnule;
		}
	};

	// Annule la saisie (ne fait rien par défaut)
	__WDPopupSaisie.prototype._vAnnule = clWDUtil.m_pfVide;

	// Si on a un champ modèle pour la gestion du masque de saisie, copie ses propriétées
	// Partage de code avec WDCelluleSaisie
	__WDPopupSaisie.prototype.__SetMasqueModele = function __SetMasqueModele(oSaisie, oChampModeleMasque)
	{
		// Si on a un champ modèle pour la gestion du masque de saisie, copie ses propriétées
		if (oChampModeleMasque)
		{
			var tabAttributs = oChampModeleMasque.attributes;
			var nAttribut;
			var nLimiteAttribut = tabAttributs.length;
			for (nAttribut = 0; nAttribut < nLimiteAttribut; nAttribut++)
			{
				var clAttribut = tabAttributs.item(nAttribut);
				// GP 30/09/2014 : 'Attr.nodename' is deprecated. Please use 'name' instead. Mais on ne sais pas si value fonctionne sur les anciens IE.
				var sNomAttribut = clWDUtil.sGetAttributNom(clAttribut);
				var sNomAttributMinuscule = sNomAttribut.toLowerCase();
				var sAttributValeur = clWDUtil.sGetAttributValeur(clAttribut);

				if (sNomAttributMinuscule.substr(0, 2) == "on")
				{
					if (sNomAttributMinuscule == "onblur")
					{
						this.m_fOnBlurModeleMasque = new Function("event", sAttributValeur);
					}
					else
					{
						oSaisie[sNomAttribut] = new Function(bIE ? "" : "event", sAttributValeur);
					}
				}
			}
		}
	};

	// Supprime les trace du modèle
	// Partage de code avec WDCelluleSaisie
	__WDPopupSaisie.prototype.__bValideMasqueModele = function __bValideMasqueModele(oEvent)
	{
		if (!this.m_fOnBlurModeleMasque)
		{
			return true;
		}
		else
		{
			var oSurcharge = {};
			var bSurcharge = false;
			// GP 28/10/2013 : QW237971 : Dans le onsubmit, le scrElement/target est le formulaire et pas le champ !!!
			// Le code interne devrait plutot utiliser this !!!
			if (oEvent.srcElement && oEvent.srcElement !== this.m_oSaisie)
			{
				oSurcharge.srcElement = this.m_oSaisie;
				bSurcharge = true;
			}
			if (oEvent.target && oEvent.target !== this.m_oSaisie)
			{
				oSurcharge.target = this.m_oSaisie;
				bSurcharge = true;
			}
			if (bSurcharge)
			{
				oEvent = clWDUtil.oCloneObjet(oEvent, oSurcharge);
			}
			return this.m_fOnBlurModeleMasque.apply(this.m_oSaisie, [oEvent]);
		}
	};

	// Fin d'utilisation du modèle
	// Partage de code avec WDCelluleSaisie
	__WDPopupSaisie.prototype.__ClearMasqueModele = function __ClearMasqueModele()
	{
		this.m_fOnBlurModeleMasque = null;
	};

	// Conversion en sortie du masque
	// Partage de code avec WDCelluleSaisie
	// GP 27/11/2013 : QW239976 : Il faut faire la conversion vers la valeur interne dans les cas suivants :
	// - Table navigateur dans les cellules
	// - Table navigateur en recherche
	// - Table AJAX en recherche
	// Et PAS dans le cas :
	// - Table AJAX dans les cellules
	__WDPopupSaisie.prototype.__ConversionMasqueModele = function __ConversionMasqueModele(oValeur, sAliasColonne, bAvecConversion)
	{
		// Si on a une fonction de conversion, c'est que la colonne a un masque.
		// Il faudrait que la fonction de conversion soit déclaré par la JS lors de la déclaration de la colonne (via l'indice dans stONLOAD_CHAMP::m_tabFonctions).
		// Le problème c'est que la colonne est déclarée par le serveur pour les tables AJAX
		// => A changer un jour.
		// En attendant on construit le nom : "_GET" + "_ALIAS" + "_1" (1 = VALEUR) + "_I" (Avec sous éléments) + "_C" (pour cast)
		if (bAvecConversion)
		{
			var pfConversion = window["_GET_" + sAliasColonne + "_1_I_C"];
			if (pfConversion)
			{
				return pfConversion(oValeur);
			}
		}
		return oValeur;
	};

	return __WDPopupSaisie;
})();

//////////////////////////////////////////////////////////////////////////
// WDStyleCache

// Feuille de style avec un cache (permet d'eviter de couteuse recherche
var WDStyleCache = (function ()
{
	"use strict";

	function __WDStyleCache(/*bConstructeur*/)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			this.m_oFeuilleStyle = null;
			this.m_tabFeuilleStyleRules = null;
			this.m_tabStyle = [];
			this.m_tabStyleNew = [];
		}
	};

	// Creation/Recreation de la feuille de style
	__WDStyleCache.prototype.Creation = function Creation()
	{
		// Si la feuille n'existe pas : creation
		if (!this.m_oFeuilleStyle)
		{
			var oFeuilleStyle = clWDUtil.oCreeFeuilleStyle();
			this.m_tabFeuilleStyleRules = clWDUtil.tabGetStyleRegles(oFeuilleStyle);
			this.m_oFeuilleStyle = oFeuilleStyle;
		}
		this.m_tabStyleNew = [];
	};

	// Creation/Recreation de la feuille de style
	__WDStyleCache.prototype.CreationAjout = function CreationAjout()
	{
		this.m_tabStyleNew = clWDUtil.tabDupliqueTableau(this.m_tabStyle);
	};

	// Applique les modifications (en creation et modification)
	__WDStyleCache.prototype.CreationFlush = function CreationFlush()
	{
		var tabStyleOld = this.m_tabStyle;
		var tabStyleNew = this.m_tabStyleNew;

		// Creation ou modification des nouveaux styles
		for (var sNomStyle in tabStyleNew)
		{
			if (tabStyleNew.hasOwnProperty(sNomStyle))
			{
				var sStyleNew = tabStyleNew[sNomStyle];
				var sStyleOld = tabStyleOld[sNomStyle];
				if (sStyleNew == sStyleOld)
				{
					// Non modifie ne fait rien
					continue;
				}
				else if (sStyleOld !== undefined)
				{
					// Mofifie : supprimer pour recreer
					this.__StyleSupprime(sNomStyle);
				}
				else
				{
					// Nouveau : creer
				}
				tabStyleOld[sNomStyle] = sStyleNew;
				clWDUtil.CreeStyle(this.m_oFeuilleStyle, sNomStyle, sStyleNew);
			}
		}
	};

	// Fin de la creation de la feuille de style (reporte les modifications)
	__WDStyleCache.prototype.CreationFin = function CreationFin()
	{
		var tabStyleOld = this.m_tabStyle;
		var tabStyleNew = this.m_tabStyleNew;
		(this.m_tabStyle = []);

		// Reporte les modifications
		var sNomStyle;
		var sStyleNew;
		for (sNomStyle in tabStyleOld)
		{
			if (tabStyleOld.hasOwnProperty(sNomStyle))
			{
				sStyleNew = tabStyleNew[sNomStyle];
				if (tabStyleOld[sNomStyle] == sStyleNew)
				{
					// Le style n'a pas change : on ne fait rien sans le feuille de style : supprime le style de tabStyleNew pour ne pas le cree
					this.m_tabStyle[sNomStyle] = sStyleNew;
					delete tabStyleNew[sNomStyle];
				}
				else
				{
					// Le style n'existe plus ou a ete modifie : le supprime
					this.__StyleSupprime(sNomStyle);
				}
			}
		}

		// Creation des nouveaux styles
		for (sNomStyle in tabStyleNew)
		{
			if (tabStyleNew.hasOwnProperty(sNomStyle))
			{
				sStyleNew = tabStyleNew[sNomStyle];
				this.m_tabStyle[sNomStyle] = sStyleNew;
				clWDUtil.CreeStyle(this.m_oFeuilleStyle, sNomStyle, sStyleNew);
			}
		}

		// Vide m_tabStyleNew pour les prochaines modifications
		this.m_tabStyleNew = [];
	};

	// Ajoute un style
	__WDStyleCache.prototype.Ajoute = function Ajoute(sNomStyle, tabStyle)
	{
		if (0 < tabStyle.length)
		{
			// On n'a this.m_tabStyleNew que en creation
			// L'ajoute dans tous les cas dans le nouveau cache
			this.m_tabStyleNew[sNomStyle] = tabStyle.join(';');
		}
	};

	// Complete un style
	__WDStyleCache.prototype.Complete = function Complete(sNomStyle, tabStyle)
	{
		if (sNomStyle.length && tabStyle.length)
		{
			// Recherche le style dans le cache
			if (this.m_tabStyleNew.hasOwnProperty(sNomStyle))
			{
				// GP 14/06/2016 : Et aussi en tracant TB98610
				// Vu en évaluant les problèmes de JVS : si tabStyle contient un style déjà présent dans le style existant ce code est faux
				var tabStyleNew = this.m_tabStyleNew[sNomStyle].split(";");
				clWDUtil.bForEach(tabStyle, function (sStyle)
				{
					var sComposante = sStyle.split(":")[0] + ":";
					// Il faut faire le parcours inverse car il y a des suppressions.
					clWDUtil.bForEachInverse(tabStyleNew, function (oStyleNewExistant, nIndice)
					{
						if (oStyleNewExistant.substr(0, sComposante.length) == sComposante)
						{
							tabStyleNew.splice(nIndice, 1);
						}
						return true;
					});
					return true;
				});
				this.m_tabStyleNew[sNomStyle] = tabStyleNew.concat(tabStyle).join(';');
			}
			else
			{
				// Non trouve : le cree
				this.Ajoute(sNomStyle, tabStyle);
			}
		}
	};

	// Supprime un style (de la déclaration)
	__WDStyleCache.prototype.Supprime = function Supprime(sNomStyle)
	{
		delete this.m_tabStyleNew[sNomStyle];
	};

	// Supprime un style
	__WDStyleCache.prototype.__StyleSupprime = function __StyleSupprime(sNomStyle)
	{
		var nStyle = this.__nStyleTrouve(sNomStyle);
		if (clWDUtil.nElementInconnu != nStyle)
		{
			clWDUtil.StyleSupprime(this.m_oFeuilleStyle, nStyle);
		}
	};

	// Trouve un style
	__WDStyleCache.prototype.__nStyleTrouve = function __nStyleTrouve(sNomStyle)
	{
		return clWDUtil.nStyleTrouveDansRules(this.m_tabFeuilleStyleRules, sNomStyle);
	};

	return __WDStyleCache;
})();

/**
* Defines a cubic-bezier curve given the middle two control points.
* NOTE: first and last control points are implicitly (0,0) and (1,1).
* @param p1x {number} X component of control point 1
* @param p1y {number} Y component of control point 1
* @param p2x {number} X component of control point 2
* @param p2y {number} Y component of control point 2
*/
clWDUtil.WDBezier = (function ()
{
	"use strict";

	function __WDBezier(p1x, p1y, p2x, p2y)
	{
		// Calcule les paramètres

		/**
		* X component of Bezier coefficient C
		* @const
		* @type {number}
		*/
		this.m_cx = 3.0 * p1x;

		/**
		* X component of Bezier coefficient B
		* @const
		* @type {number}
		*/
//		this.m_bx = 3.0 * (p2x - p1x) - this.m_cx;
//		this.m_bx = 3.0 * p2x - 3.0 * p1x - this.m_cx;
//		this.m_bx = 3.0 * p2x - 3.0 * p1x - 3.0 * p1x;
		this.m_bx = 3.0 * p2x - 6.0 * p1x;

		/**
		* X component of Bezier coefficient A
		* @const
		* @type {number}
		*/
//		this.m_ax = 1.0 - this.m_cx - this.m_bx;
//		this.m_ax = 1.0 - 3.0 * p1x - (3.0 * p2x - 6.0 * p1x);
//		this.m_ax = 1.0 - 3.0 * p1x - 3.0 * p2x + 6.0 * p1x;
		this.m_ax = 1.0 + 3.0 * p1x - 3.0 * p2x;

		/**
		* Y component of Bezier coefficient C
		* @const
		* @type {number}
		*/
		this.m_cy = 3.0 * p1y;

		/**
		* Y component of Bezier coefficient B
		* @const
		* @type {number}
		*/
//		this.m_by = 3.0 * (p2y - p1y) - this.m_cy;
//		this.m_by = 3.0 * p2y - 3.0 * p1y - this.m_cy;
//		this.m_by = 3.0 * p2y - 3.0 * p1y - 3.0 * p1y;
		this.m_by = 3.0 * p2y - 6.0 * p1y;

		/**
		* Y component of Bezier coefficient A
		* @const
		* @type {number}
		*/
//		this.m_ay = 1.0 - this.m_cy - this.m_by;
//		this.m_ay = 1.0 - 3.0 * p1y - (3.0 * p2y - 6.0 * p1y);
//		this.m_ay = 1.0 - 3.0 * p1y - 3.0 * p2y + 6.0 * p1y;
		this.m_ay = 1.0 + 3.0 * p1y - 3.0 * p2y;
	};

	/**
	* @param t {number} parametric timing value
	* @return {number}
	*/
	__WDBezier.prototype.nValeurX = function nValeurX(t)
	{
		// `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
		return ((this.m_ax * t + this.m_bx) * t + this.m_cx) * t;
	};

	/**
	* @param t {number} parametric timing value
	* @return {number}
	*/
	__WDBezier.prototype.nValeurY = function nValeurY(t)
	{
		return ((this.m_ay * t + this.m_by) * t + this.m_cy) * t;
	};

	/**
	* @param t {number} parametric timing value
	* @return {number}
	*/
	__WDBezier.prototype.nValeurDeriveX = function nValeurDeriveX(t)
	{
		return (3.0 * this.m_ax * t + 2.0 * this.m_bx) * t + this.m_cx;
	};

	/**
	* Given an x value, find a parametric value it came from.
	* @param x {number} value of x along the bezier curve, 0.0 <= x <= 1.0
	* @param dPrecision {number} accuracy limit of t for the given x
	* @return {number} the t value corresponding to x
	*/
	__WDBezier.prototype.dCalculeCurveX = function dCalculeCurveX(x, dPrecision)
	{
		var t2;
		var x2;
		var i;

		// First try a few iterations of Newton's method -- normally very fast.
		for (t2 = x, i = 0; i < 8; i++)
		{
			x2 = this.nValeurX(t2) - x;
			if (Math.abs(x2) < dPrecision)
			{
				return t2;
			}
			var d2 = this.nValeurDeriveX(t2);
			if (Math.abs(d2) < 1e-6)
			{
				break;
			}
			t2 = t2 - x2 / d2;
		}

		// Fall back to the bisection method for reliability.


		if (x < 0.0)
		{
			return 0.0;
		}
		if (1.0 < x)
		{
			return 1.0;
		}

		var t0 = 0.0;
		var t1 = 1.0;
//		for (t2 = x; t0 < t1; t2 = (t1 - t0) * 0.5 + t0)
		for (t2 = x; t0 < t1; t2 = (t1 + t0) / 2)
		{
//			x2 = this.nValeurX(t2);
			x2 = this.nValeurX(t2) - x;
//			if (Math.abs(x2 - x) < dPrecision)
			if (Math.abs(x2) < dPrecision)
			{
				return t2;
			}
//			if (x > x2)
			if (0 > x2)
			{
				t0 = t2;
			}
			else
			{
				t1 = t2;
			}
		}

		// Failure.
		return t2;
	};

	/**
	* The epsilon value we pass to UnitBezier::solve given that the animation is going to run over |dur| seconds.
	* The longer the animation, the more precision we need in the timing function result to avoid ugly discontinuities.
	* http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/page/animation/AnimationBase.cpp
	*/
	function __dPrecision(nDuree)
	{
		return 1.0 / (200.0 * nDuree);
	};

	/**
	* @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
	// Non on donne la durée maintenant
	//* @param epsilon {number} the accuracy of t for the given x
	* @return {number} the y value along the bezier curve
	*/
//	__WDBezier.prototype.dCalcule = function dCalcule(x, epsilon)
	__WDBezier.prototype.dCalcule = function dCalcule(x, nDuree)
	{
//		return this.nValeurY(this.dCalculeCurveX(x, epsilon));
		return this.nValeurY(this.dCalculeCurveX(x, __dPrecision(nDuree)));
	};

	return __WDBezier;
})();

//////////////////////////////////////////////////////////////////////////
// GP 12/11/2012 : AnimationJoueSurProprieteChamp
// Déplacé ici avec toutes les dépendances des Toasts car le .js est maintenant toujours inclus dans la page

var WDAnim = (function ()
{
	"use strict";

	function __WDAnim(pfSetProp, nValDebut, nValFin, nType, nCourbe, nDuree, sAliasChamp)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			// Notifie le champ du debut de l'animation
			if (sAliasChamp && window.WDChamp)
			{
				this.m_sAliasChamp = sAliasChamp;
				clWDUtil.oAppelFonctionChampPtr(this.m_sAliasChamp, WDChamp.prototype.AnimationDebut, [this]);
			}

			this.m_pfSetProp = pfSetProp;
			this.m_nValDebut = nValDebut;
			this.m_nValDelta = nValFin - nValDebut;
			this.m_nDebut = (new Date()).getTime();
			this.m_nTimeout = -1;
			// Centieme de secondes => millisecondes
			this.m_nType = nType;
			switch (nCourbe)
			{
			case this.ms_nCourbeLineaire:
				this.m_pfCourbe = __dCourbeLineaire;
				break;
			case this.ms_nCourbeAccelere:
				this.m_pfCourbe = __dCourbeAccelere;
				break;
			default:
			case this.ms_nCourbeDecelere:
				this.m_pfCourbe = __dCourbeDecelere;
				break;
			case this.ms_nCourbeEase:
				this.m_pfCourbe = __dCourbeEase;
				break;
			case this.ms_nCourbeEaseInOut:
				this.m_pfCourbe = __dCourbeEaseInOut;
				break;
			}
			this.m_nDuree = nDuree * 10;
			this.m_bFini = false;
			var oThis = this;
			this.m_pfCallBack = function () { oThis.vMaj(false, (new Date()).getTime(), false); };
			// Premiere animation
			// Note cette fonction est surchargable dans les classes derivees (!!!)
			// Donc il faut bien faire attention d'appeller le constructeur en dernier dans les constructeurs derives
			this.vMaj(true, this.m_nDebut, false);
		}
	};

	__WDAnim.prototype.ms_nCourbeLineaire = 0;
	__WDAnim.prototype.ms_nCourbeAccelere = 1;
	__WDAnim.prototype.ms_nCourbeDecelere = 2;
	__WDAnim.prototype.ms_nCourbeEase = 3;
	__WDAnim.prototype.ms_nCourbeEaseInOut = 4;
	__WDAnim.prototype.ms_nPeriodeMs = 25;

	// bForceNonFini : indique qu'il faut continuer l'animation (pour les animations avec des sous animations)
	__WDAnim.prototype.vMaj = function vMaj(bForceNonFini, nTime, bPause)
	{
		if (this.m_bFini)
		{
			return;
		}

		// Calcule l'avancement
		var nTemps = nTime - this.m_nDebut;
		var dAvancement = Math.min(1, nTemps / this.m_nDuree);
		if (!bPause)
		{
			this._Maj(dAvancement);
		}

		// Si on n'est pas arrive a la fin
		if ((nTemps < this.m_nDuree) || bForceNonFini || bPause)
		{
			// Toutes les 25ms ou le temps restant (si on n'est pas en pause)
			var nTimer = this.ms_nPeriodeMs;
			if (!bPause)
			{
				nTimer = Math.min(nTimer, this.m_nDuree - nTemps);
			}
//			var r = window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||false;
//			if (r)
//			{
//				r(this.m_pfCallBack);
//			}
//			else
//			{
			this.m_nTimeout = clWDUtil.nSetTimeout(this.m_pfCallBack, nTimer);
//			}
		}
		else
		{
			// Indique que l'animation est finie
			this.vFin();
		}
	};

	// Effectue le dessin
	__WDAnim.prototype._Maj = function _Maj(dAvancement)
	{
		// Calcule la valeur et l'affiche
		if (this.m_pfSetProp)
		{
			var nVal = this.m_nValDebut + this.m_pfCourbe(dAvancement) * this.m_nValDelta;
			this.m_pfSetProp(nVal);
		}
	};

	// Annule l'animation
	// Ne met PAS dans l'etat final
	__WDAnim.prototype.vAnnule = function vAnnule()
	{
		// Annule le timeout
		clWDUtil.ClearTimeout(this.m_nTimeout);
		this.m_nTimeout = -1;

		// Fin de l'animation
		this.vFin();
	};

	// Marque la fin de l'animation
	__WDAnim.prototype.vFin = function vFin()
	{
		// Memorise que l'animation est finie
		this.m_bFini = true;
		this.m_nTimeout = -1;

		// Notifie le champ de la fin de l'animation (si le champ existe)
		if (this.m_sAliasChamp)
		{
			clWDUtil.oAppelFonctionChampPtr(this.m_sAliasChamp, WDChamp.prototype.AnimationFin, [this]);
		}
	};

	__WDAnim.prototype.bFini = function bFini()
	{
		return this.m_bFini;
	};

	function __dCourbeLineaire(dAvancement)
	{
		return dAvancement;
	}
	function __dCourbeAccelere(dAvancement)
	{
		return Math.sin(Math.PI / 2 * dAvancement);
	}
	function __dCourbeDecelere(dAvancement)
	{
		return 1 - Math.cos(Math.PI / 2 * dAvancement);
	}
	function __dCourbeEase(dAvancement)
	{
		// GP 07/07/2014 : Ajout de this.m_nDuree pour augmenter la résolution en cas d'animations longues (pour ne plus utiliser DEFAULT_DURATION)
		return ms_oBezierEase.dCalcule(dAvancement, this.m_nDuree);
	}
	function __dCourbeEaseInOut(dAvancement)
	{
		// GP 07/07/2014 : Ajout de this.m_nDuree pour augmenter la résolution en cas d'animations longues (pour ne plus utiliser DEFAULT_DURATION)
		return ms_oBezierEaseInOut.dCalcule(dAvancement, this.m_nDuree);
	}

	// http://www.w3.org/TR/css3-transitions/#transition-timing-function
//	var ms_oBezierLinear = new clWDUtil.WDBezier(0.0, 0.0, 1.0, 1.0);
	var ms_oBezierEase = new clWDUtil.WDBezier(0.25, 0.1, 0.25, 1.0);
//	var ms_oBezierEaseIn = new clWDUtil.WDBezier(0.42, 0, 1.0, 1.0);
//	var ms_oBezierEaseOut = new clWDUtil.WDBezier(0, 0, 0.58, 1.0);
	var ms_oBezierEaseInOut = new clWDUtil.WDBezier(0.42, 0, 0.58, 1.0);

	return __WDAnim;
})();

function AnimationJoueSurProprieteChamp(nValDebut, nValFin, nDuree, nCourbe, pfSetProp, sAliasChamp)
{
	var nType = 0;
	return new WDAnim(pfSetProp, nValDebut, nValFin, nType, nCourbe, nDuree, sAliasChamp);
};

//////////////////////////////////////////////////////////////////////////
// Gestion des toast

// Classe de base des toats
var WDToastBase = (function ()
{
	"use strict";

	function __WDToastBase(nDuree, nCadrageVertical, nCadrageHorizontal, nEtapeFinale)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			// Copie les membres
			this.m_nDuree = __nCorrigeDuree(nDuree);
			this.m_nCadrageVertical = __nCorrigeCadrageVertical(nCadrageVertical);
			this.m_nCadrageHorizontal = __nCorrigeCadrageHorizontal(nCadrageHorizontal);
			this.m_nEtape = 0;
			this.m_nEtapeFinale = nEtapeFinale;

			// S'ajoute au tableau des éléments
			ms_tabToasts.push(this);
		}
	};

	// Tableau des toasts
	var ms_tabToasts = [];
	__WDToastBase.prototype.ms_tabPositionSelonCadrage = [
		//			Gauche							Centre							Droite
		/* Haut*/	clWDUtil.ms_ePlaceHautGauche,	clWDUtil.ms_ePlaceHautCentre,	clWDUtil.ms_ePlaceHautDroite,
		/* Centre*/	clWDUtil.ms_ePlaceCentreGauche, clWDUtil.ms_ePlaceCentre,		clWDUtil.ms_ePlaceCentreDroite,
		/* Bas */	clWDUtil.ms_ePlaceBasGauche,	clWDUtil.ms_ePlaceBasCentre,	clWDUtil.ms_ePlaceBasDroite
	];


	// Corrige les valeurs
	function __nCorrigeDuree(nDuree)
	{
		// nDuree :
		// 0 : Affichage court : 3s (3000ms) (valeur par défaut)
		// 1 : Affichage long : 5s (5000ms)
		// 100+ : Affichage libre x * 100 : 1s ou plus (1000ms ou plus)
		// Autres (< 0 ou 1 < < 100) : Invalide => coirt : 3s (3000ms)
		if (0 == nDuree)
		{
			return 300;
		}
		else if (1 == nDuree)
		{
			return 500;
		}
		else if (nDuree > 100)
		{
			return nDuree;
		}
		else
		{
			return 300;
		}
	};
	function __nCorrigeCadrageVertical(nCadrageVertical)
	{
		return Math.min(Math.max(nCadrageVertical, 0), 2);
	};
	function __nCorrigeCadrageHorizontal(nCadrageHorizontal)
	{
		return Math.min(Math.max(nCadrageHorizontal, 0), 2);
	};

	// Avancement de l'animation
//	__WDToastBase.prototype.vOnAnimationAvancement = function vOnAnimationAvancement(nAvancement)
	__WDToastBase.prototype.vOnAnimationAvancement = clWDUtil.m_pfVide;

	__WDToastBase.prototype.OnAnimationSuivante = function OnAnimationSuivante()
	{
		// On n'a plus d'animation
		this.m_oAnimationCourante = null;

		// Passe a l'étape suivante
		var nEtape = this.m_nEtape;
		this.m_nEtape++;
		this._vOnAnimationSuivante(nEtape);
	};
	// Lance l'animation suivante
	__WDToastBase.prototype._vOnAnimationSuivante = function _vOnAnimationSuivante(nEtape)
	{
		// Supprime le toast du tableau si on est sur l'étape finale
		if (nEtape === this.m_nEtapeFinale)
		{
			var nPositionToastsPosition = clWDUtil.nDansTableau(ms_tabToasts, this, true);
			ms_tabToasts.splice(nPositionToastsPosition, 1);
		}
	};

	// Annulation du toast
	__WDToastBase.prototype.__Annule = function __Annule()
	{
		// Pour ne pas lancer l'animation suivante : force l'étape
		this.m_nEtape = this.m_nEtapeFinale;

		// Annule l'animation (qui fait l'appel de vFin qui fait l'appel de OnAnimationSuivante qui supprime l'animation)
		this.m_oAnimationCourante.vAnnule();
	};

	// Creation d'un toast
	__WDToastBase.prototype.s_ToastAffiche = function s_ToastAffiche(sMessage, nDuree, nCadrageVertical, nCadrageHorizontal, sCouleurFond)
	{
		// Fixe les valeurs par défaut
		switch (arguments.length)
		{
		case 1:
			// 1 (seul) paramètre : sMessage (manque nDuree, nCadrageVertical, nCadrageHorizontal et sCouleurFond)
			nDuree = 0;
			// Pas de break;
		case 2:
			// 2 paramètres : sMessage et nDuree (manque nCadrageVertical, nCadrageHorizontal et sCouleurFond)
			// En bas
			nCadrageVertical = 2;
			// Pas de break;
		case 3:
			// 3 paramètres : sMessage, nDuree et nCadrageVertical (manque nCadrageHorizontal et sCouleurFond)
			// Au centre
			nCadrageHorizontal = 1;
			// Pas de break;
		case 4:
			// 4 paramètres : sMessage, nDuree, nCadrageVertical et nCadrageHorizontal (manque sCouleurFond)
			// La couleur de fond de la palette
//			sCouleurFond = "#C3C3C3";
			// Pas de break;
//		default:
//		case 5:
//			// Tous les paramètres : sMessage, nDuree, nCadrageVertical, nCadrageHorizontal et sCouleurFond
			break;
		}

		// Creation du toast (il s'enregistre lui même dans ms_tabToasts) et lance l'animation
		(new WDToast(sMessage, nDuree, nCadrageVertical, nCadrageHorizontal, sCouleurFond)).OnAnimationSuivante();
	};

	// Creation d'un toast popup
	__WDToastBase.prototype.s_ToastAffichePopup = function s_ToastAffichePopup(sPopup, nDuree, nCadrageVertical, nCadrageHorizontal)
	{
		// GP 27/11/2012 : QW225829 : Annule TOUT les toasts popup
		__ToastSupprimeTout(true);

		// Fixe les valeurs par défaut
		switch (arguments.length)
		{
		case 1:
			// 1 (seul) paramètre : sPopup (manque nDuree, nCadrageVertical et nCadrageHorizontal)
			nDuree = 0;
			// Pas de break;
		case 2:
			// 2 paramètres : sPopup et nDuree (manque nCadrageVertical et nCadrageHorizontal)
			// En bas
			nCadrageVertical = 2;
			// Pas de break;
		case 3:
			// 3 paramètres : sPopup, nDuree et nCadrageVertical (manque nCadrageHorizontal)
			// Au centre
			nCadrageHorizontal = 1;
			// Pas de break;
//		default:
//		case 4:
//			// Tous les paramètres : sPopup, nDuree, nCadrageVertical et nCadrageHorizontal
			break;
		}

		// Creation du toast (il s'enregistre lui même dans ms_tabToasts) et lance l'animation
		(new WDToastPopup(sPopup, nDuree, nCadrageVertical, nCadrageHorizontal)).OnAnimationSuivante();
	};

	// Supprime tout les toast
	function __ToastSupprimeTout(bUniquementPopup)
	{
		// Annule et supprime les toasts
		// Le dernier toast de chaque conteneur masque le conteneur
		var tabToasts = ms_tabToasts;
		var nIndice = 0;
		while (nIndice < tabToasts.length)
		{
			// Si c'est un toast non popup et que l'on ne veux que les toast popup : l'ignore
			if (bUniquementPopup && !(tabToasts[nIndice] instanceof WDToastPopup))
			{
				nIndice++
			}
			else
			{
				tabToasts[nIndice].__Annule();
			}
		}
	}
	__WDToastBase.prototype.s_ToastSupprimeTout = __ToastSupprimeTout;

	return __WDToastBase;
})();

// Un toast (+ gestion des toast en statique)
var WDToast = (function ()
{
	"use strict";

	function __WDToast(sMessage, nDuree, nCadrageVertical, nCadrageHorizontal, sCouleurFond)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			// Appel de la classe de base avec les bon parametres
			// 3 : nEtapeFinale
			WDToastBase.prototype.constructor.apply(this, [nDuree, nCadrageVertical, nCadrageHorizontal, 3]);

			// Si c'est le premier toast
			if (!ms_tabConteneurs)
			{
				// Création et positionnement des trois conteneurs (en haut, au milieu et en bas)
				var tabConteneurs = [];
				var i;
				var nLimiteI = 3;
				for (i = 0; i < nLimiteI; i++)
				{
					tabConteneurs.push(this.__oCreeConteneur(i));
				}
				ms_tabConteneurs = tabConteneurs;
			}

			// Mémorise le message
			sMessage = clWDUtil.sEncodeInnerHTML(sMessage, true, false);
			// GP 12/11/2012 : QW225688 : Ajoute du gras si on a plusieurs lignes
			var nPositionBR = sMessage.indexOf("<br");
			if (-1 != nPositionBR)
			{
				sMessage = "<strong>" + sMessage.substring(0, nPositionBR) + "</strong>" + sMessage.substring(nPositionBR);
			}
			this.m_sMessage = sMessage;
			// Et la couleur
			this.m_sCouleurFond = sCouleurFond;
		}
	};
	__WDToast.prototype = new WDToastBase();
	__WDToast.prototype.constructor = __WDToast;

	var ms_tabAlignementHorizontal = ["left", "center", "right"];
	var ms_tabConteneurs;

	// Création et positionnement d'un des conteneurs (en haut ou en bas)
	__WDToast.prototype.__oCreeConteneur = function __oCreeConteneur(nCadrageVertical)
	{
		// Creation
		var oConteneur = document.createElement("div");
		// GP 06/11/2012 : Ne fonctionne pas : on a la transparence vers le gris lors de la période avec opacité
//		// Donne une couleur de fond au conteneur (pour le cas ou la page n'a pas d'ambiance)
//		oConteneur.style.backgroundColor = "#C3C3C3";
		// GP 09/11/2012 : QW225690 : Place les toast au dessus des CelluleAfficheDialogue/PopupAffiche
		// Vu avec GF : altitude 991
		oConteneur.style.zIndex = 991;

		// Masque le conteneur
		clWDUtil.SetDisplay(oConteneur, false);

		oConteneur = document.body.appendChild(oConteneur);

		// Positionnement initial : déclare un élément fixed
		WDFixed.prototype.s_Declare("CT" + nCadrageVertical, oConteneur, this.ms_tabPositionSelonCadrage[1 + 3 * nCadrageVertical], undefined, undefined, true, false);

		return oConteneur;
	};
//	__WDToast.prototype.__s_PositionneConteneur = function __s_PositionneConteneur(nCadrageVertical, oConteneur, bInitial)
//	{
//		// On ne fait rien si on n'est pas en emulation de fixed
//		// => En mode quirks ou en cadrage vertical (on ne sait pas centrer exactement)
//		var bEmuleFixed = bIEQuirks || (1 == nCadrageVertical);
//
//		// Si on fait du vrai fixed : on a besoin de se placer uniquement sur l'affichage initial
//		if (!bEmuleFixed)
//		{
//			if (bInitial)
//			{
//				// Non IE ou mode standard : fixed
//				oConteneur.style.position = "fixed";
//				oConteneur.style.left = "0px";
//				oConteneur.style.right = "0px";
//				switch (nCadrageVertical)
//				{
//				case 0:
//					// Haut
//					oConteneur.style.top = "0px";
//					break;
//					// GP 12/11/2012 : Impossible : implique bEmuleFixed
////				case 1:
////					// Milieu
////					// Impossible de centrer exactemenr
////					oConteneur.style.top = "50%";
////					break;
//				case 2:
//					// Bas
//					oConteneur.style.bottom = "0px";
//					break;
//				}
//			}
//		}
//		else
//		{
//			// Mode quirks ou alignement centré : positionnement selon le défilement
//			if (bInitial)
//			{
//				oConteneur.style.position = "absolute";
//				oConteneur.style.width = "100%";
//			}
//			var nFacteur;
//			switch (nCadrageVertical)
//			{
//			case 0:
//				// Haut : conserve top
//				nFacteur = 0;
//				break;
//			case 1:
//				// Milieu
//				nFacteur = 0.5;
//				break;
//			case 2:
//				// Bas
//				nFacteur = 1;
//				break;
//			}
//			oConteneur.style.left = document.body.scrollLeft + "px";
//			oConteneur.style.top = (document.body.scrollTop + nFacteur * (clWDUtil.__nGetBodyPropriete(document, "clientHeight") - oConteneur.offsetHeight)) + "px";
//		}
//	};

	// Avancement de l'animation
	__WDToast.prototype.vOnAnimationAvancement = function vOnAnimationAvancement(nAvancement)
	{
		// Appel de la classe de base
		WDToastBase.prototype.vOnAnimationAvancement.apply(this, arguments);

		// Selon l'étape
		var nOpacite;
		switch (this.m_nEtape)
		{
		case 1:
			// Affichage : parfait l'avancement c'est l'opacité
			nOpacite = nAvancement;
			break;
		case 2:
			// Reste affichée : ne fait rien
			return;
		case 3:
			// Disparition : l'avancement c'est l'opacité inversé
			nOpacite = 100 - nAvancement;
		}
		// Change l'opacité du toast
		// GP 12/11/2012 : En fait il n'y a pas besoin d'affecter la valeur dans le style.opacity c'est fait par la fonction en interne
//		this.m_oDiv.style.opacity = clWDUtil.nSetOpacite(nOpacite, this.m_oDiv);
		clWDUtil.nSetOpacite(nOpacite, this.m_oDiv);
	};

	// Lance l'animation suivante
	__WDToast.prototype._vOnAnimationSuivante = function _vOnAnimationSuivante(nEtape)
	{
		var oConteneur = this.__oGetConteneur();
		switch (nEtape)
		{
		case 0:
			// Rien -> Affichage (sur une seconde)
			// Trouve la position : on ne gère que deux

			// Creation de l'élement
			var oDiv = document.createElement("div");
			if (bIEQuirks)
			{
				oDiv.style.width = "100%";
			}
			else
			{
				oDiv.style.left = "0px";
				oDiv.style.right = "0px";
			}
			if (undefined !== this.m_sCouleurFond)
			{
				oDiv.style.backgroundColor = String(this.m_sCouleurFond);
			}
			// GP 16/12/2013 : QW240566 : Le nom du style dans l'ambiance est maintenant traduit selon ce que demande le DEV.
			// En attendant de transmettre a valeur depuis l'éditeur, on place les deux valeurs (une seule existe dans la page)
			oDiv.className = "Warning-02 Attention-2";
			oDiv.style.padding = "10px 10px 10px 10px";
			oDiv.style.textAlign = ms_tabAlignementHorizontal[this.m_nCadrageHorizontal];
//			oDiv.style.fontFamily = "sans-serif";
			oDiv.innerHTML = this.m_sMessage;

			// Ajoute l'élément au conteneur et affiche le conteneur
			if (2 != this.m_nCadrageVertical)
			{
				this.m_oDiv = oConteneur.appendChild(oDiv);
			}
			else
			{
				// GP 23/11/2020 : QW332744 : A cause de la mise en forme du HTML, la première balise fille est parfoirs du texte (les tabulations)
				// => Il faut les ignorer et prend la "vraie" première balise : utilise firstElementChild et pas firstChild.
				// Sauf que firstElementChild n'est pas disponible, avec IE8- : utilise children[0].
				this.m_oDiv = oConteneur.insertBefore(oDiv, oConteneur.children[0]);
			}
			// Si le div n'a pas de couleur de fond la force
			if (undefined === this.m_sCouleurFond)
			{
				switch (clWDUtil.oGetCurrentStyle(this.m_oDiv).backgroundColor)
				{
				case "transparent":
				case "rgba(0, 0, 0, 0)":
					oDiv.style.backgroundColor = _COL[9];
					oDiv.style.color = _COL[66];
					break;
				}
			}
			else
			{
				// GP 12/11/2012 : QW225678 : Recalcule la couleur du texte si besoin pour augmenter le contraste
				this.m_oDiv.style.color = clWDUtil.sGetCouleurHTMLAssocie(this.m_sCouleurFond);
			}
			// GP 12/11/2012 : QW225680 : Force la transparence du toast au début (sinon on a un risque de clignotement)
			this.vOnAnimationAvancement(0);

			// Affiche le conteneur mais pas vraiment (pour avoir une taille correcte pour le positionnement
			oConteneur.style.visibility = "hidden";
			clWDUtil.SetDisplay(oConteneur, true);
			// Repositionne le conteneur (filtre le mode quirks en interne)
			WDFixed.prototype.s_bRepositionne("CT" + this.m_nCadrageVertical);
			// Et l'affiche
			oConteneur.style.visibility = "";
			this.m_oAnimationCourante = new WDAnimSurToast(this, 100);
			break;
		case 1:
			// Affichage -> Reste affichée (animation vide)
			this.m_oAnimationCourante = new WDAnimSurToast(this, this.m_nDuree);
			break;
		case 2:
			// Reste affichée -> Disparition (1s)
			this.m_oAnimationCourante = new WDAnimSurToast(this, 100);
			break;
		case 3:
			// Disparition -> Fin (ou annulation)
			// Supprime l'élement
			this.m_oDiv.parentNode.removeChild(this.m_oDiv);
			this.m_oDiv = null;
			// Masque le conteneur si besoin
			if (!oConteneur.firstElementChild)
			{
				clWDUtil.SetDisplay(oConteneur, false);
			}
			else
			{
				// Repositionne le conteneur (filtre le mode quirks en interne)
				WDFixed.prototype.s_bRepositionne("CT" + this.m_nCadrageVertical);
			}
			break;
		}

		// Appel de la classe de base
		WDToastBase.prototype._vOnAnimationSuivante.apply(this, arguments);
	};

	// Trouve le conteneur
	__WDToast.prototype.__oGetConteneur = function __oGetConteneur()
	{
		return ms_tabConteneurs[this.m_nCadrageVertical];
	};

	return __WDToast;
})();

// Un toast popup
var WDToastPopup = (function ()
{
	"use strict";

	function __WDToastPopup(sPopup, nDuree, nCadrageVertical, nCadrageHorizontal)
	{
		if (arguments.length)
		{
			// Appel de la classe de base avec les bon parametres
			// 1 : nEtapeFinale
			WDToastBase.prototype.constructor.apply(this, [nDuree, nCadrageVertical, nCadrageHorizontal, 1]);

			// Memorise la popup
			this.m_sPopup = sPopup;
		}
	};
	__WDToastPopup.prototype = new WDToastBase();
	__WDToastPopup.prototype.constructor = __WDToastPopup;

	// Avancement de l'animation
//	__WDToastPopup.prototype.vOnAnimationAvancement = function vOnAnimationAvancement(nAvancement)

	// Lance l'animation suivante
	__WDToastPopup.prototype._vOnAnimationSuivante = function _vOnAnimationSuivante(nEtape)
	{
		switch (nEtape)
		{
		case 0:
			// Rien -> Affichage
			// Affiche la popup
			// Trouve la popup
			clWDUtil.CelluleAfficheDialogue(this.m_sPopup, document, this.ms_tabPositionSelonCadrage[this.m_nCadrageVertical * 3 + this.m_nCadrageHorizontal], undefined, 0);
			// Affichage -> Reste affichée (animation vide)
			this.m_oAnimationCourante = new WDAnimSurToast(this, this.m_nDuree);
			break;
		case 1:
			// Reste affichée -> Disparition
			// Supprime la popup
			clWDUtil.CelluleFermeDialogue(this.m_sPopup);
			break;
		}

		// Appel de la classe de base
		WDToastBase.prototype._vOnAnimationSuivante.apply(this, arguments);
	};

	return __WDToastPopup;
})();

// Une animation sur un toast (affichage)
var WDAnimSurToast = (function ()
{
	"use strict";

	function __WDAnimSurToast(oToast, nDuree)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			// Memorise le toast
			this.m_oToast = oToast;

			// Appel de la classe de base avec les bon parametres pour déclencher l'animation
			WDAnim.prototype.constructor.apply(this, [this.__OnAvancement, 0, 100, 0, this.ms_nCourbeLineaire, nDuree, undefined]);
		}
	}
	__WDAnimSurToast.prototype = new WDAnim();
	__WDAnimSurToast.prototype.constructor = __WDAnimSurToast;

	// Avancement
	__WDAnimSurToast.prototype.__OnAvancement = function __OnAvancement(nAvancement)
	{
		// Appel du toast
		this.m_oToast.vOnAnimationAvancement(nAvancement);
	};

	// Marque la fin de l'animation
	__WDAnimSurToast.prototype.vFin = function vFin()
	{
		// Appel de la classe de base
		WDAnim.prototype.vFin.apply(this, arguments);

		// Appel du toast
		this.m_oToast.OnAnimationSuivante();

		this.m_oToast = null;
	};

	return __WDAnimSurToast;
})();

//////////////////////////////////////////////////////////////////////////
// Gestion des erreurs fatales

// Classe de base des erreur fatales : hérite du type natif Error
// (Utilisé directement pour les erreurs lancéées par ExceptionDéclenche)
var WDErreurBase = (function ()
{
	"use strict";

	function __WDErreurBase(nErreur, sMessage)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			// Appel le constructeur de la classe
			Error.constructor.apply(this, [0]);
			// Reforce tous les membres (disponible nativement ou pas selon les navigateurs)
			this.name = "WDError";
			this.message = (undefined !== sMessage) ? sMessage : "Unknown error/Erreur inconnue.";
			this.number = nErreur;
		}
	}

	// Declare l'heritage
	__WDErreurBase.prototype = new Error();
	__WDErreurBase.prototype.constructor = __WDErreurBase;

	__WDErreurBase.prototype.oGetInfo = function oGetInfo(nInformation)
	{
		switch (nInformation)
		{
		case 0:
			// errCode
			return this.number;
		case 1:
		default:
			// errMessage
			return this.message;
		case 19:
			// errComplet
			return this.number + "\n" + this.message;
		}
	};

	__WDErreurBase.prototype.xPropage = function xPropage(sMessage)
	{
		if (undefined !== sMessage)
		{
			this.message += "\n" + sMessage;
		}
		throw this;
	};

	return __WDErreurBase;
})();

var WDErreur = (function ()
{
	"use strict";

	// Classe pour les erreurs lancées par le framework JS du WL
	// Fonction en ellipse : les autres paramètres sont utilisé comme un ChaineConstruit
	function __WDErreur(nErreur)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			// Lit le tableau des erreurs
			var sMessage;
			if (window.tabWDErrors)
			{
				sMessage = tabWDErrors[nErreur] || tabWDErrors[0];
				// Construit le message si besoin
				if (1 < arguments.length)
				{
					// Il faut une variable locale pour les arguments car arguments référence les arguments de la fonction interne et pas nos arguments
					var oArguments = arguments;
					// Les arguments sont indicé à partir de zéro : il faut un "- 1"
					// Mais il y a nErreur en premier : il faut un "+ 1"
					// => On prend donc l'indice tel quel
					sMessage = sMessage.replace(/%(\d+)/g, function (sMatch, nIndice) { return ("undefined" != typeof oArguments[nIndice]) ? oArguments[nIndice] : sMatch; });
				}
			}
			// Gère le cas du message non défini dans WDErreurBase

			// Appel le constructeur de la classe de base
			WDErreurBase.prototype.constructor.apply(this, [nErreur, sMessage]);
		}
	}

	// Declare l'heritage
	__WDErreur.prototype = new WDErreurBase();
	__WDErreur.prototype.constructor = __WDErreur;

	return __WDErreur;
})();

// Une erreur fatale

// Ce que l'on génère dans une fonction :
//	try
//	{
//		// Entrée d'une fonction : se branche sur la gestion des erreurs fatales
//		clWDUtil.Try();
//		... code de la fonction ...
//	}
//	catch (_E)
//	{
//		// Dans le catch d'une fonction : affiche le message d'erreur si on est aux sommet de la pile et que c'est erreur du WL
//		return clWDUtil.xbCatchThrow(_E, oEvent);
//		(ou)
//		// Dans le catch d'une fonction : test si l'erreur est valide
//		if (clWDUtil.bCatch(_E))
//		{
//			try
//			{
//				... code du "CAS EXCEPTION:"
//			}
//			catch (_E)
//			{
//				// Dans le catch d'une fonction : affiche le message d'erreur si on est aux sommet de la pile et que c'est erreur du WL
//				return clWDUtil.xbCatchThrow(_E, oEvent);
//			}
//		}
//	}
//	finally
//	{
//		// Dans le finally d'une fonction : dépile la fonction
//		clWDUtil.Finally();
//		(ou)
//		try
//		{
//			... code du "FIN:"
//		}
//		catch (_E)
//		{
//			// Dans le catch d'une fonction : affiche le message d'erreur si on est aux sommet de la pile et que c'est erreur du WL
//			return clWDUtil.xbCatchThrow(_E, oEvent);
//		}
//		finally
//		{
//			// Dans le finally d'une fonction : dépile la fonction
//			clWDUtil.Finally();
//		}
//	}

(function ()
{
	"use strict";

	var tabAppels = [];
	var bDoitRecalculerChampsDispositions = false;

	var ms_tabSyntaxesObjets = [
		"affiche",						"display",
		"affichedialogue",				"displaydialog",
		"affichepopup",					"displaypopup",
		"afficheposition",				"displayposition",
		"ajoute",						"add",
		"ajouteitin\xE9raire",			"additinerary",
		"ajouteligne",					"addline",
		"ajoutemarqueur",				"addmarker",
		"ajoutetri\xE9",				"addsorted",
		"anime",						"animate",
		"arr\xEAt",						"stop",
		"arr\xEAted\xE9filement",		"stopscrolling",
		"changetaillewidget",			"resizewidget",
		"chargeconfiguration",			"loadconfiguration",
		"cherche",						"seek",
		"cherchepartout",				"seekanywhere",
		"configurationinitiale",		"initialconfiguration",
		"copie",						"copy",
		"d\xE9but",						"beginning",
		"d\xE9place",					"move",
		"d\xE9placecolonne",			"movecolumn",
		"d\xE9placeligne",				"moveline",
		"d\xE9placewidget",				"movewidget",
		"dernier",						"last",
		"d\xE9roule",					"expand",
		"d\xE9rouletout",				"expandall",
		"d\xE9sactivefiltre",			"disablefilter",
		"distanceitin\xE9raire",		"itinerarydistance",
		"dur\xE9e",						"duration",
		"echangeligne",					"swapline",
		"enroule",						"collapse",
		"enrouled\xE9roule",			"collapseexpand",
		"enrouletout",					"collapseall",
		"etat",							"status",
		"ferme",						"close",
		"fermedialogue",				"closedialog",
		"fichierencours",				"currentfile",
		"fin",							"end",
		"find\xE9placement",			"endofmove",
		"hauteur",						"height",
		"indicecolonne",				"columnsubscript",
		"indicerupture",				"breaksubscript",
		"info",							/*"info",*/
		"infopoint",					/*"infopoint",*/
		"infoposition",					/*"infoposition",*/
		"infoxy",						/*"infoxy",*/
		"ins\xE8re",					"insert",
		"ins\xE8religne",				"insertline",
		"inverse",						"reverse",
		"joue",							"play",
		"lance",						"start",
		"lanced\xE9filement",			"startscrolling",
		"largeur",						"width",
		"m\xE9lange",					"mix",
		"mode",							/*"mode",*/
		"modifie",						"modify",
		"modifieligne",					"modifyline",
		"modifiemarqueur",				"modifymarker",
		"occurrence",					"count",
		"pause",						/*"pause",*/
		"position",						/*"position",*/
		"positiond\xE9filement",		"scrollingposition",
		"pr\xE9c\xE9dent",				"previous",
		"premier",						"first",
		"r\xE9cup\xE8reobjetjs",		"getjsobject",
		"r\xE9cup\xE8reposition",		"getposition",
		"saisieencours",				"inputinprogress",
		"saisieloupe",					"inputsearch",
		"sauveconfiguration",			"saveconfiguration",
		"select",						/*"select",*/
		"selectmoins",					"selectminus",
		"selectoccurrence",				"selectcount",
		"selectplus",					/*"selectplus",*/
		"suitd\xE9placement",			"followmovement",
		"suivant",						"next",
		"supprime",						"delete",
		"supprimedoublon",				"deleteduplicate",
		"supprimeitin\xE9raire",		"deleteitinerary",
		"supprimeligne",				"deleteline",
		"supprimemarqueur",				"deletemarker",
		"supprimeselect",				"deleteselect",
		"supprimetout",					"deleteall",
		"taille",						"size",
		"tailleenvoy\xE9e",				"sizesent",
		"tailleenvoy\xE9efichierencours", "currentfilesizesent",
		"taillefichier",				"filesize",
		"taillefichierencours",			"currentfilesize",
		"trie",							"sort",
		"volume"/*,*/					/*"volume",*/
	];

	function __oCorrigeErreurPourSyntaxeObjet(oErreur)
	{
		// GP 12/02/2018 : QW295693 : Détecte les erreurs de syntaxe objet.
		if (window.TypeError && (oErreur instanceof TypeError))
		{
			var oResultat;
			// Détection selon le navigateur
			if (bIEAvec11 || bEdge)
			{
				// IE :
				//	number	-2146827850
				//	message	"L’objet ne gère pas la propriété ou la méthode « SupprimeTout »"
				// Edge :
				//	number	-2146827850
				//	message	"Object doesn't support property or method 'SupprimeTout'"
				if (-2146827850 === oErreur.number)
				{
					// IE utilise «». On doit les encoder (\xAB et \xBB) car le minifieur ne les comprend pas et écrit \ufffd (probablement une forme de caractère unicode invalide).
					oResultat = /(?:(?:\xAB|')\s*)(\S+)(?:\s*(?:\xBB|'))/.exec(oErreur.message);
				}
			}
			else
			{
				// Autres navigateurs
				// Chrome/Firefox/Safari/Safari mobile
				//	message	"VUnChamp.SupprimeTout is not a function"
				oResultat = /(?:[^\.]+\.)+(\S+)/.exec(oErreur.message);
			}

			// Si l'expression régulière est vérifiée, on a le résultat global dans l'indice 0 et l'expression extraite (= le nom de la fonction) dans l'indice 1
			if (oResultat)
			{
				var sNom = oResultat[1];
				// Fait une recherche sans casse : utilise le nom en minuscule (ms_tabSyntaxesObjets contient déjà des noms en minuscule).
				if (clWDUtil.bDansTableau(ms_tabSyntaxesObjets, sNom.toLowerCase(), true))
				{
					// Retourne l'erreur WL sépcifique
					// "L'élément '%1' n'existe pas."
					// "L'utilisation d'une syntaxe objet ("ChampListe.Ajoute" par exemple) n'est autorisée que sur un champ manipulé par son nom, sur un paramètre typé ou sur une variable."
					return new WDErreur(616, sNom);
				}
			}
		}

		// Autre cas : retourne l'erreur originale
		return oErreur;
	}

	// Entrée dans un traitement ou d'une fonction : se branche sur la gestion des erreurs fatales et prépare une possible valeur de retour (pour les fonctions)
	clWDUtil.Try = function Try()
	{
		// Si on est au premier niveau d'appel WL, la valeur de bDoitRecalculerChampsDispositions doit être false (puisque mise à false a l'init et à la sortie du dernier niveau)
		clWDUtil.WDDebug.assert((0 < tabAppels.length) || !bDoitRecalculerChampsDispositions, "bDoitRecalculerChampsDispositions n'est pas false au premier niveau de WL");
		tabAppels.push({});
	};

	// Fixe la valeur de retour d'une fonction
	clWDUtil.Renvoyer = function Renvoyer(oValeur)
	{
		tabAppels[tabAppels.length - 1].m_oValeur = oValeur;
	};
	clWDUtil.oGetRenvoyer = function oGetRenvoyer()
	{
		return tabAppels[tabAppels.length - 1].m_oValeur;
	};

	// Dans le catch d'une fonction : affiche le message d'erreur si on est aux sommet de la pile et que c'est erreur du WL
	clWDUtil.xbCatchThrow = function xbCatchThrow(oErreur, oEvent)
	{
		// Si on a déjà une erreur en attente : l'ingore (permet de gérer simplement le cas des CAS EXCEPTION: sans rethrow
		var oAppel = tabAppels[tabAppels.length - 1];
		delete oAppel.m_oErreur;

		oErreur = __oCorrigeErreurPourSyntaxeObjet(oErreur);
		if ((1 === tabAppels.length) && this.bCatch(oErreur))
		{
			var sDebutMessage = tabWDErrors ? tabWDErrors[1] : "";
			alert(sDebutMessage + oErreur.message);
			if (oEvent)
			{
				return this.bStopPropagation(oEvent);
			}
			else
			{
				return false;
			}
		}
		else
		{
			oAppel.m_oErreur = oErreur;
			throw oErreur;
		}
	};


	// Test si l'erreur est valide
	clWDUtil.bCatch = function bCatch(oErreur)
	{
		// GP 23/04/2013 : Vu avec SYC : on filtre et on n'affiche que nos erreurs
		// GP 27/10/2016 : On accepte aussi les erreurs du framework V2
		// GP 13/01/2016 : L'héritage de CErreurBase n'est pas détecté dans le framework V2. Utilise un marqueur
//		return oErreur && ((oErreur instanceof WDErreurBase) || (window.NSPCS && (oErreur instanceof NSPCS.CErreurBase)));
		return oErreur && ((oErreur instanceof WDErreurBase) || (window.NSPCS && ("WDError" === oErreur.name)));
	};

	// Dans le finally d'un traitement ou d'une fonction : dépile le traitement
	// Le résultat est ignoré pour les traitements
	// Fonction en ... : Si on est dans le framework V2 avec une valeur de retour déclarée (et si il faut faire une adaptation de type), on reçoit le type de retour.
	// En cas de type de retour multiple, on reçoit chaque type dans un paramètre
	clWDUtil.oFinally = function oFinally(tabTypes)
	{
		// Si on sort du premier niveau d'appel WL (= le bas de la pile), on lance l'éventuel appel de recalcul des champs disposition
		var bNiveauRacine = 1 === tabAppels.length;
		if (bNiveauRacine)
		{
			this.DispositionMAJ();
		}

		// Normalement tabAppels.length reste > 0
		var oAppel = tabAppels.pop();

		// Vu en tracant. Un return dans le block finally masque l'exception relancé par le bloc catch.
		// Confirmé par https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling :
		// "Overwriting of return values by the finally block also applies to exceptions thrown or re - thrown inside of the catch block:".
		// Donc on ne fait plus l'exécution du return dans le block finally si on a croisé une exception.
		if (oAppel.m_oErreur)
		{
			throw oAppel.m_oErreur;
		}

		var oValeurRetour = oAppel.m_oValeur;
		var iValeurRetourBase;
		if (tabTypes)
		{
			return NSPCS.NSValues.oGetValeurRetour(oValeurRetour, tabTypes);
		}
		else if (bNiveauRacine && window.NSPCS && (iValeurRetourBase = NSPCS.iGetAsBase(oValeurRetour)))
		{
			// Au est au niveau racine. Il n'y a pas d'appel WL à l'extérieur. Effectue la conversion vers une valeur native.
			// Permet de transmettre le résultat d'un PCode au framework JS.
			// Ce code n'est pas parfait (ne fonctionne pas en cas d'appel imbriqué : Traitement WL => Framework => Traitement WL
			return iValeurRetourBase.valueOf();
		}
		else
		{
			// GP 14/12/2017 : QW294587 : Manque le "return"
			return oValeurRetour;
		}
	};

	// Indique que l'on a une MAJ de la visibilité d'un champ disposition
	clWDUtil.PrepareDispositionMAJ = function PrepareDispositionMAJ()
	{
		// On doit être dans un appel WL
		clWDUtil.WDDebug.assert(0 < tabAppels.length, "Appel de clWDUtil.PrepareDispositionMAJ hors appel WL");
		bDoitRecalculerChampsDispositions = true;

		return arguments[0];
	};

	// Lance la MAJ des champs disposition si besoin.
	// Appelé :
	// - Lors de la sortie du premier niveau d'appel WL (= le bas de la pile)
	// - Si on consulte la visibilité sur un champ disposition
	clWDUtil.DispositionMAJ = function DispositionMAJ()
	{
		if (bDoitRecalculerChampsDispositions)
		{
			bDoitRecalculerChampsDispositions = false;
			if (window.$)
			{
				$(window).trigger("trigger.wb.disposition.visible.maj");
			}
		}
	};

})();

//////////////////////////////////////////////////////////////////////////
// Gestion d'un tableau de notification
// Instanciation par "new (clWDUtil.WDNotification)()";

clWDUtil.WDNotifications = (function ()
{
	"use strict";

	function __WDNotifications(/*pfNotificationInitiale1, pfNotificationInitiale2, ...*/)
	{
		this.m_tabNotifications = [];
		// Si on a des notifications initiales
		clWDUtil.bForEachThis(arguments, this, this.AddNotification);
	}
	// AddNotification et pas bAddNotification car la fonction est appelé depuis WDxxxHTML
	__WDNotifications.prototype.AddNotification = function AddNotification(pfNotification)
	{
		this.m_tabNotifications.push(pfNotification);

		return true;
	};
	__WDNotifications.prototype.LanceNotifications = function LanceNotifications()
	{
		var tabArguments = arguments;
		// Vue que les notifications sont des procédures "statique", et que l'on n'a pas de this, utilise le this pas défaut : window
		// Le this d'appel des notifications est faux mais c'est normalement des
		clWDUtil.bForEach(this.m_tabNotifications, function (pfNotification)
		{
			pfNotification.apply(window, tabArguments);
			return true;
		});
	};

	return __WDNotifications;
})();

// Notifications globales :
// - Redimensionnement d'éléments
clWDUtil.m_oNotificationsRedimensionnement = new (clWDUtil.WDNotifications)();
// - Ajout de HTML dans la page
clWDUtil.m_oNotificationsAjoutHTML = new (clWDUtil.WDNotifications)();
// - Fin de MAJ en AJAX
clWDUtil.m_oNotificationsFinAJAX = new (clWDUtil.WDNotifications)();
// - Modification qui peut rendre visible des images (si il n'y a pas d'autres notification en parallèle)
clWDUtil.m_oNotificationsImagesVisibles = new (clWDUtil.WDNotifications)();

// - Sous IE
// - En HTML5
// - Avec jQuery
// GP 20/11/2015 : TB94948 : C'est toutes les version de IE
// On ne peut pas tester jQuery ici car il n'est pas encore défini lors de l'exécution de ce code.
if ((bIEAvec11 || bEdge) && !bIEQuirks)
{
	clWDUtil.m_oNotificationsRedimensionnement.AddNotification((function ()
	{
		"use strict";

		var bAppelResizeExterne = false;

		// Factorisation du code qui gère les ancrages pour IE
		// Fonction anciennement nommée s_ForceRecalculAncrages
		return function(oThis, domParent)
		{
			// - Sous IE
			// - En HTML5
			// - Avec jQuery
			// GP 20/11/2015 : TB94948 : C'est toutes les version de IE
			if (window.$ && !bAppelResizeExterne)
			{
				try
				{
					bAppelResizeExterne = true;
					$(window).trigger("trigger.wb.ancrage.ie.declenche", domParent);
				}
				finally
				{
					bAppelResizeExterne = false;
				}
			}
		};
	})());
}

//////////////////////////////////////////////////////////////////////////
// Gestion des server sent events

// Création de l'objet global des parametres. Fonction en ... : Un seul appel avec tous les événements.
clWDUtil.AjouteServerSentEvents = window["EventSource"] ? (function ()
{
	"use strict";

	// GP 16/04/2019 : TB112856 : En présence de page interne, le code de MAJ déclenche plein d'appel équivalents au serveur, ce qui sature les connexions "par serveur" autorisés par Chrome.
	// => Maintient un cache des connexions déjà faite pour éviter les doublons.
	var ms_tabURLS = [];

	return function ()
	{
		// Calcule les paramètres
		var tabParametres = [];
		this.bForEach(arguments, function (tabUnEvenement)
		{
			var sParametre = tabUnEvenement[2];
			if (undefined !== sParametre)
			{
				tabParametres.push(tabUnEvenement[0] + "=" + sParametre);
			}
			return true;
		});

		var sURL = clWDUtil.sGetPageAction() + "/SSEPING/" + tabParametres.join("/");
		if (!clWDUtil.bDansTableau(ms_tabURLS, sURL, true))
		{
			ms_tabURLS.push(sURL);
			// Création de l'objet global si possible
			var oEventSource = new EventSource(sURL);
			if (oEventSource)
			{
				this.bForEach(arguments, function (tabUnEvenement)
				{
					// Ajoute le binding
					oEventSource.addEventListener(tabUnEvenement[0], tabUnEvenement[1], false);
					return true;
				});
			}
		}
	};
})() : clWDUtil.m_pfVide;

clWDUtil.__CallbackServerSentEventAJAX = function __CallbackServerSentEventAJAX (oEvent, fCodeApresAjax)
{
	// Si on a des donnees : appel le traitement en AJAX
	switch (clWDAJAXMain.eReponseGeneriqueDepuisTexte(oEvent.data, window._PAGE_, []))
	{
	case 0:	// 0 = Echec
	case 1:	// 1 = Réussite
		if (fCodeApresAjax)
		{
			fCodeApresAjax();
		}
		break;
	case 2:	// 2 = Annulation (pour redirection)
		// GP 16/07/2018 : QW300337 : Pas de traitement après AJAX.
		break;
	}
};

//////////////////////////////////////////////////////////////////////////
// Formatage des chaines

(function ()
{
	"use strict";

	// Format pour les dates
	var ms_tabDateVersChaineFormats = [
		[["AAAA", "YYYY"],		__sGetAnneeSur4,							__xsDeformateAnneeSur4],
		[["AA", "YY"],			__sGetAnneeSur2,							__xsDeformateAnneeSur2],
		[["MMMM"],				__sGetMoisLong,								__xsDeformateMoisLong],
		[["MMMm"],				__sGetMoisLongEnMajuscules,					__xsDeformateMoisLong],			// Déformatage non sensible à la casse
		[["Mmmm"],				__sGetMoisLongEnMajusculesPremier,			__xsDeformateMoisLong],			// Déformatage non sensible à la casse
		[["mmmm"],				__sGetMoisLongEnMinusculesPremier,			__xsDeformateMoisLong],			// Déformatage non sensible à la casse
		[["MMM"],				__sGetMoisCourt,							__xsDeformateMoisCourt],
		[["MMm"],				__sGetMoisCourtEnMajuscules,				__xsDeformateMoisCourt],		// Déformatage non sensible à la casse
		[["Mmm"],				__sGetMoisCourtEnMajusculesPremier,			__xsDeformateMoisCourt],		// Déformatage non sensible à la casse
		[["mmm"],				__sGetMoisCourtEnMinusculesPremier,			__xsDeformateMoisCourt],		// Déformatage non sensible à la casse
		[["MM"],				__sGetMoisSur2,								__xsDeformateMoisSur2],
		[["M"],					__sGetMoisSur1,								__xsDeformateMoisSur1],
		[["JJJJ", "DDDD"],		__sGetJourSemaineLong,						__xsDeformateJourSemaineLong],
		[["JJJj", "DDDd"],		__sGetJourSemaineLongEnMajuscules,			__xsDeformateJourSemaineLong],	// Déformatage non sensible à la casse
		[["Jjjj", "Dddd"],		__sGetJourSemaineLongEnMajusculesPremier,	__xsDeformateJourSemaineLong],	// Déformatage non sensible à la casse
		[["jjjj", "dddd"],		__sGetJourSemaineLongEnMinusculesPremier,	__xsDeformateJourSemaineLong],	// Déformatage non sensible à la casse
		[["JJJ", "DDD"],		__sGetJourSemaineCourt,						__xsDeformateJourSemaineCourt],
		[["JJj", "DDd"],		__sGetJourSemaineCourtEnMajuscules,			__xsDeformateJourSemaineCourt],	// Déformatage non sensible à la casse
		[["Jjj", "Ddd"],		__sGetJourSemaineCourtEnMajusculesPremier,	__xsDeformateJourSemaineCourt],	// Déformatage non sensible à la casse
		[["jjj", "ddd"],		__sGetJourSemaineCourtEnMinusculesPremier,	__xsDeformateJourSemaineCourt],	// Déformatage non sensible à la casse
		[["JJ", "DD"],			__sGetJourSur2,								__xsDeformateJourSur2],
		[["J", "D"],			__sGetJourSur1,								__xsDeformateJourSur1],
		[["L"],					__sGetJourSemaineSur1,						__xsDeformateJourSemaineSur1]
	];

	// Format pour les heures
	var ms_tabHeureVersChaineFormats = [
		[["HH"],				__sGetHeureSur2,							__xsDeformateHeureSur2],
		[["H"],					__sGetHeureSur1,							__xsDeformateHeureSur1],
		[["MM", "mm"],			__sGetMinuteSur2,							__xsDeformateMinuteSur2], // On accepte mm car dans Date+Heure on écrit les minutes comme mm et pas MM pour ne pas confondre avec mois sur 2
		[["SS"],				__sGetSecondesSur2,							__xsDeformateSecondesSur2],
		[["CCC"],				__sGetMilliSecondesSur3,					__xsDeformateMilliSecondesSur3],
		[["CC"],				__sGetCentiemesSecondesSur2,				__xsDeformateCentiemesSecondesSur2],
		[["AM", "PM", "AP"],	__sGetAM_PM,								__xsDeformateAM_PM]
	];

	// Format pour les dateheures
	var ms_tabDateHeureVersChaineFormats = ms_tabDateVersChaineFormats.concat(ms_tabHeureVersChaineFormats);

	// Date : DateVersChaine et ChaineVersDate : gestion de tous les formats
	clWDUtil.sDateVersChaine = function sDateVersChaine(sDateWL, sFormat, nOptionsUndefinedPossible)
	{
		// GP 28/08/2018 : Accepte aussi les DateHeure : Accepte : HHMM, HHMMSS, HHMMSSCC, HHMMSSLLL
		sDateWL = String(sDateWL);
		// GP 07/09/2018 : QW301987 : Normalement la génération a inclus WDLangage.js sur l'appel de la fonction WL "DateVersChaine".
		var bDateHeure = (8 < sDateWL.length) && window.clWLangage && clWLangage.bDateValide(sDateWL);
		return this.__sDateVersChaineWL(sDateWL, sFormat, nOptionsUndefinedPossible, bDateHeure);
	};
	clWDUtil.sDateHeureVersChaineWL = function sDateHeureVersChaineWL(sDateWL, sFormat, nOptionsUndefinedPossible)
	{
		return this.__sDateVersChaineWL(this.sCompleteChaine(String(sDateWL), 17, "0"), sFormat, nOptionsUndefinedPossible, true);
	};
	clWDUtil.__sDateVersChaineWL = function __sDateVersChaineWL(sDateWL, sFormat, nOptionsUndefinedPossible, bDateHeure)
	{
		var bDateRFC3339 = sFormat === "UseDateRFC3339";

		// GP 08/03/2019 : Gestion du masque RFC3339
		if (bDateRFC3339)
		{
			sFormat = bDateHeure ? "AAAA-MM-JJTHH:mm:SS.CCC" : "AAAA-MM-JJT00:00:00.000";
			// Ajoute la timezone au format.
			// Comme on utilise uniquement des caractères qui ne sont pas interprété, cela ne pose pas de problème.
			// GP 28/03/2019 : QW310998 : Il en faut pas utiliser le fuseau horaire de maintenant mais celui de la date.
			var oDate = new Date();
			// En cas d'échec, oDate n'est pas modifié donc on a l'offset du jour.
			this.bSetDateHeureFromWL(oDate, sDateWL, false, true, bDateHeure, 1);
			var nTimezoneOffset = oDate.getTimezoneOffset();
			if (0 === nTimezoneOffset)
			{
				sFormat += "Z";
			}
			else
			{
				// Un offset négatif donne une timezone positive.
				if (nTimezoneOffset < 0)
				{
					sFormat += "+";
					nTimezoneOffset = -nTimezoneOffset;
				}
				else
				{
					sFormat += "-";
				}
				sFormat += clWDUtil.sCompleteEntier(Math.floor(nTimezoneOffset / 60), 2) + ":" + clWDUtil.sCompleteEntier(nTimezoneOffset % 60, 2);
			}
		}

		if (bDateHeure)
		{
			// GP 15/11/2018 : QW306489 : Il ne faut pas ajouter le masque heure si le masque contient une partie heure :
			// - Découpe le format selon un date-heure.
			var tabFormats = __tabParseFormat(sFormat, ms_tabDateHeureVersChaineFormats, false);
			// - Si dans le format on trouve un élément de ms_tabHeureVersChaineFormats c'est que c'est un format date+heure
			if (clWDUtil.bForEach(tabFormats, function (oFormat)
			{
				return clWDUtil.bForEach(ms_tabHeureVersChaineFormats, function (tabFormatHeure)
				{
					return oFormat !== tabFormatHeure[1];
				});
			}))
			{
				sFormat += " HH:mm:SS:CC";
			}

			// GP 03/10/2018 : QW304020 : Il faut écrire les minutes comme mm dans le format sinon c'est analysé comme le mois.
			return this.sDateHeureVersChaine(sDateWL, sFormat, nOptionsUndefinedPossible);
		}
		else
		{
			return __sXxxVersChaine(sDateWL, sFormat, ms_tabDateVersChaineFormats, nOptionsUndefinedPossible, 0);
		}
	};
	clWDUtil.sChaineVersDate = function sChaineVersDate(sDate, sFormat, nOptionsUndefinedPossible)
	{
		// GP 08/03/2019 : Gestion du masque RFC3339
		if (sFormat === "UseDateRFC3339")
		{
			// GP 28/03/2019 : QW310999 : on détecte les format invalide. En présence d'un format invalide Date.parse retourne NaN, qui se propage ensuite.
			var nDate = Date.parse(sDate);
			if (isNaN(nDate))
			{
				throw new WDErreur(204);
			}
			return clWDUtil.sGetDateHeureWL(new Date(nDate), false, true, true);
		}
		{
			return __sChaineVersXxx(sDate, sFormat, ms_tabDateVersChaineFormats, 0, 3, nOptionsUndefinedPossible);
		}
	};

	// Heure : HeureVersChaine et ChaineVersHeure : gestion de tous les formats
	clWDUtil.sHeureVersChaine = function sHeureVersChaine(sHeureWL, sFormat, nOptionsUndefinedPossible)
	{
		// GP 28/08/2018 : Accepte aussi les DateHeure : Accepte : HHMM, HHMMSS, HHMMSSCC, HHMMSSLLL
		sHeureWL = String(sHeureWL);
		// GP 07/09/2018 : QW301987 : Normalement la génération a inclus WDLangage.js sur l'appel de la fonction WL "HeureVersChaine".
		if ((9 < sHeureWL.length) && window.clWLangage && clWLangage.bDateValide(sHeureWL))
		{
			sHeureWL = sHeureWL.substr(8, 9);
		}
		return __sXxxVersChaine(sHeureWL, sFormat, ms_tabHeureVersChaineFormats, nOptionsUndefinedPossible, 0);
	};
	clWDUtil.sChaineVersHeure = function sChaineVersHeure(sHeure, sFormat, nOptionsUndefinedPossible)
	{
		return __sChaineVersXxx(sHeure, sFormat, ms_tabHeureVersChaineFormats, 3, 4, nOptionsUndefinedPossible);
	};
	// GP 22/10/2014 : QW250327 : En WL le format de retour est sur 8...
	clWDUtil.sChaineVersHeureWL = function sChaineVersHeureWL(sHeure, sFormat)
	{
		return this.sChaineVersHeure(sHeure, sFormat).substr(0, 8);
	};

	// Date et heure : DateHeureVersChaine et ChaineVersDateHeure : gestion de tous les formats
	clWDUtil.sDateHeureVersChaine = function sDateHeureVersChaine(sDateHeureWL, sFormat, nOptionsUndefinedPossible)
	{
		return __sXxxVersChaine(sDateHeureWL, sFormat, ms_tabDateHeureVersChaineFormats, nOptionsUndefinedPossible, 8);
	};
	clWDUtil.sChaineVersDateHeure = function sChaineVersDateHeure(sDateHeure, sFormat, nOptionsUndefinedPossible)
	{
		return __sChaineVersXxx(sDateHeure, sFormat, ms_tabDateHeureVersChaineFormats, 0, 7, nOptionsUndefinedPossible);
	};

	// Construit une valeur formatée
	function __sXxxVersChaine(sValeurWL, sFormat, tabDescriptionFormats, nOptionsUndefinedPossible, nOffsetHeurePourDateHeure)
	{
		// On est sur d'avoir des chaines
		sValeurWL = String(sValeurWL);

		// GP 11/07/2014 : QW246307 : Il semble que avec une chaine vide on doit retourner un format vide
		if (0 == sValeurWL.length)
		{
			return "";
		}

		// Tableau : pointeur de fonction vers le format ou caractère de la chaine qui n'est pas un format
		var tabFormats = __tabParseFormat(sFormat, tabDescriptionFormats, false);

//		var nOptions = nOptionsUndefinedPossible || 0;

		var sResultat = "";
		clWDUtil.bForEach(tabFormats, function (oUnFormat)
		{
			switch (typeof oUnFormat)
			{
			case "string":
				sResultat += oUnFormat;
				break;
			case "function":
				// GP 27/06/2014 : QW245795 : Utilisation de clWDUtil au lieu de this (on est dans la callback le this n'est pas valide)
				sResultat += oUnFormat(sValeurWL, tabFormats, nOffsetHeurePourDateHeure);
				break;
			default:
				clWDUtil.WDDebug.assert(false, "Format invalide");
				break;
			}
			return true;
		});

		return sResultat;
	}

	// Déformate une valeur
	// Retourne la date + heure sous la forme d'un tableau : [ AAAA, MM, JJ, HH, MM, SS, CCC ]
	function __sChaineVersXxx(sValeur, sFormat, tabDescriptionFormats, nPremiereComposante, nNombreComposantes, nOptionsUndefinedPossible)
	{
		// On est sur d'avoir des chaines
		sValeur = String(sValeur);

		// Tableau : pointeur de fonction vers le format ou caractère de la chaine qui n'est pas un format
		var tabFormats = __tabParseFormat(sFormat, tabDescriptionFormats, true);

		// Valeurs résultat [ AAAA, MM, JJ, HH, MM, SS, CCC ]
		var tabComposantesDateHeure = [String((new Date()).getUTCFullYear()), "01", "01", "00", "00", "00", "000"];

		var nOptions = nOptionsUndefinedPossible || 0;

		if (clWDUtil.bForEach(tabFormats, function (oUnFormat)
		{
			switch (typeof oUnFormat)
			{
			case "string":
				// Ignore ces caractères de la sources.
				// En code serveur, ignore juste les caractères (les mêmes ou d'autres)
				if (oUnFormat.length <= sValeur.length)
				{
					sValeur = sValeur.substr(oUnFormat.length);
				}
				else
				{
					// Source invalide
					return false;
				}
				break;
			case "function":
				try
				{
					// GP 27/06/2014 : QW245795 : Utilisation de clWDUtil au lieu de this (on est dans la callback le this n'est pas valide)
					sValeur = oUnFormat(sValeur, tabFormats, tabComposantesDateHeure, nOptions);
				}
				catch (oErreur)
				{
					// GP 27/06/2014 : QW245795 : Utilisation de clWDUtil au lieu de this (on est dans la callback le this n'est pas valide)
					if (clWDUtil.bCatch(oErreur))
					{
						// On a une erreur : retourne la chaine vide
						return "";
					}
					else
					{
						// Erreur autre
						throw oErreur;
					}
				}
				break;
			default:
				// Format invalide
				clWDUtil.WDDebug.assert(false, "Format invalide");
				break;
			}
			return true;
		}))
		{
			return tabComposantesDateHeure.splice(nPremiereComposante, nNombreComposantes).join("");
		}
		else
		{
			// On a une erreur : retourne la chaine vide
			return "";
		}
	}

	// Découpe une chaine de format
	// Tableau : pointeur de fonction vers le format ou caractère de la chaine qui n'est pas un format
	function __tabParseFormat(sFormat, tabDescriptionFormats, bPourDeformatage, bIgnoreEspaces)
	{
		// On est sur d'avoir des chaines
		sFormat = String(sFormat);

		if (bIgnoreEspaces)
		{
			sFormat = clWDUtil.sSupprimeEspaces(sFormat);
		}

		var nIndiceFonction = bPourDeformatage ? 2 : 1;

		// Tableau : pointeur de fonction vers le format ou caractère de la chaine qui n'est pas un format
		var tabFormat = [];
		var nCaractere;
		var nLimiteCaractere = sFormat.length;
		// L'incrémentation est dans la boucle en fonction de ce que l'on trouve
		for (nCaractere = 0; nCaractere < nLimiteCaractere;)
		{
			if (clWDUtil.bForEach(tabDescriptionFormats, function (tabUneDescriptionFormat)
			{
				return clWDUtil.bForEach(tabUneDescriptionFormat[0], function (sUnFormatMasque)
				{
					if (sFormat.substr(nCaractere, sUnFormatMasque.length) == sUnFormatMasque)
					{
						tabFormat.push(tabUneDescriptionFormat[nIndiceFonction]);
						nCaractere += sUnFormatMasque.length;
						return false;
					}
					return true;
				});
			}))
			{
				// Si clWDUtil.bForEach retourne true c'est que l'on est arrivé à la fin de la boucle donc que l'on n'est pas dans un format
				tabFormat.push(sFormat.charAt(nCaractere));
				nCaractere++;
			}
		}

		return tabFormat;
	}
	clWDUtil.__tabParseFormat = __tabParseFormat;

	// Utilitaires
	// Lance une erreurs s'il ne reste pas assert de caractères
	function __xThrowErreurSurLongueur(sValeur, nLongueur)
	{
		if (sValeur.length < nLongueur)
		{
			throw new WDErreur(204);
		}
	}
	function __xsGetDeformateN(sValeur, tabFormats, tabComposantesDateHeure, nLongueur, nIndiceValeur)
	{
		__xThrowErreurSurLongueur(sValeur, nLongueur);
		var sUneValeur = sValeur.substr(0, nLongueur);
		// Uniquement si on a une valeur valide (sinon conserve la valeur actuelle (qui est normalement la valeur par défaut)
		if (0 < sUneValeur.length)
		{
			// Et complete pour avoir une valeur valide de programmation
			tabComposantesDateHeure[nIndiceValeur] = clWDUtil.sCompleteEntierChaine(sUneValeur, nLongueur);
		}
		return sValeur.substr(nLongueur);
	}
	function __xsGetDeformateNComplete(sValeur, tabFormats, tabComposantesDateHeure, nLongueur, nIndiceValeur)
	{
		__xThrowErreurSurLongueur(sValeur, nLongueur);
		var nPosition;
		var nResultat = 0;
		for (nPosition = 0; nPosition < nLongueur; nPosition++)
		{
			var nCaractere = parseInt(sValeur.charAt(nPosition), 10);
			if (isNaN(nCaractere))
			{
				break;
			}
			else
			{
				nResultat = nResultat * 10 + nCaractere;
			}
		}
		clWDUtil.WDDebug.assert(0 < nPosition, "Il doit y avoir au moins un caractère");
		// Uniquement si on a une valeur valide (sinon conserve la valeur actuelle (qui est normalement la valeur par défaut)
		if (0 < nPosition)
		{
			// Et complete pour avoir une valeur valide de programmation
			tabComposantesDateHeure[nIndiceValeur] = clWDUtil.sCompleteEntier(nResultat, nLongueur);
		}
		return sValeur.substr(nPosition);
	}

	// Utilitaires
	function __nGetMois(sDateWL)
	{
		return parseInt(sDateWL.substr(4, 2), 10);
	}
	function __nGetJour(sDateWL)
	{
		return parseInt(sDateWL.substr(6, 2), 10);
	}
	function __nGetJourSemaine06(sDateWL)
	{
		return (new Date(__sGetAnneeSur4(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/), __nGetMois(sDateWL) - 1, __nGetJour(sDateWL))).getDay();
	}
	function __sGetEnMajuscules(sValeur)
	{
		return sValeur.toUpperCase();
	}
	function __sGetEnMajusculesPremier(sValeur)
	{
		return sValeur.charAt(0).toUpperCase() + sValeur.substr(1);
	}
	function __sGetEnMinusculesPremier(sValeur)
	{
		return sValeur.charAt(0).toLowerCase() + sValeur.substr(1);
	}
	// Déformate un nom de mois long ou court
	function __xsDeformateMois(sValeur, tabFormats, tabComposantesDateHeure, nOptions, pfGetMois)
	{
		__xThrowErreurSurLongueur(sValeur, 0);

		// GP 21/10/2014 : QW250234 : Code la fonction
		for (var nMois = 0; nMois < 12; nMois++)
		{
			var sMois = pfGetMois.call(clWDUtil, nMois);
			// Attention : insensible à la casse
			if (clWDUtil.s_bCommencePar(sValeur, sMois, true))
			{
				tabComposantesDateHeure[1] = clWDUtil.sCompleteEntier(nMois + 1, 2);
				return sValeur.substr(sMois.length);
			}
		}
		throw new WDErreur(204);
	}
	// Déformate un nom de jour de la semaine long ou court
	function __xsDeformateJourSemaine(sValeur, tabFormats, tabComposantesDateHeure, nOptions, pfGetJourSemaine)
	{
		__xThrowErreurSurLongueur(sValeur, 0);

		// GP 21/10/2014 : QW250234 : Code la fonction
		for (var nJour = 0; nJour < 7; nJour++)
		{
			var sJour = pfGetJourSemaine.call(clWDUtil, nJour);
			// Attention : insensible à la casse
			if (clWDUtil.s_bCommencePar(sValeur, sJour, true))
			{
				// Pas dans la date finale
//				tabComposantesDateHeure[] = nJour;
				return sValeur.substr(sJour.length);
			}
		}
		throw new WDErreur(204);
	}

	// Formatage
	function __sGetAnneeSur4(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return sDateWL.substr(0, 4);
	}
	function __sGetAnneeSur2(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return sDateWL.substr(2, 2);
	}
	function __sGetMoisLong(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return clWDUtil.sGetMois(__nGetMois(sDateWL) - 1);
	}
	function __sGetMoisLongEnMajuscules(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMajuscules(__sGetMoisLong(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetMoisLongEnMajusculesPremier(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMajusculesPremier(__sGetMoisLong(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetMoisLongEnMinusculesPremier(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMinusculesPremier(__sGetMoisLong(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetMoisCourt(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return clWDUtil.sGetMoisCourt(__nGetMois(sDateWL) - 1);
	}
	function __sGetMoisCourtEnMajuscules(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMajuscules(__sGetMoisCourt(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetMoisCourtEnMajusculesPremier(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMajusculesPremier(__sGetMoisCourt(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetMoisCourtEnMinusculesPremier(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMinusculesPremier(__sGetMoisCourt(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetMoisSur2(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return clWDUtil.sCompleteEntier(__nGetMois(sDateWL), 2);
	}
	function __sGetMoisSur1(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return clWDUtil.sCompleteEntier(__nGetMois(sDateWL), 1);
	}
	function __sGetJourSemaineLong(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		switch (__nGetJourSemaine06(sDateWL))
		{
		case 0:
			return STD_DIMANCHE;
		case 1:
			return STD_LUNDI;
		case 2:
			return STD_MARDI;
		case 3:
			return STD_MERCREDI;
		case 4:
			return STD_JEUDI;
		case 5:
			return STD_VENDREDI;
		case 6:
			return STD_SAMEDI;
		}
	}
	function __sGetJourSemaineLongEnMajuscules(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMajuscules(__sGetJourSemaineLong(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetJourSemaineLongEnMajusculesPremier(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMajusculesPremier(__sGetJourSemaineLong(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetJourSemaineLongEnMinusculesPremier(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMinusculesPremier(__sGetJourSemaineLong(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetJourSemaineCourt(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetJourSemaineLong(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/).substr(0, 3);
	}
	function __sGetJourSemaineCourtEnMajuscules(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMajuscules(__sGetJourSemaineCourt(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetJourSemaineCourtEnMajusculesPremier(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMajusculesPremier(__sGetJourSemaineCourt(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetJourSemaineCourtEnMinusculesPremier(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetEnMinusculesPremier(__sGetJourSemaineCourt(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/));
	}
	function __sGetJourSur2(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return clWDUtil.sCompleteEntier(__nGetJour(sDateWL), 2);
	}
	function __sGetJourSur1(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return clWDUtil.sCompleteEntier(__nGetJour(sDateWL), 1);
	}
	function __sGetJourSemaineSur1(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/)
	{
		return __sGetJourSemaineLongEnMajusculesPremier(sDateWL/*, tabFormats, nOffsetHeurePourDateHeure*/).charAt(0);
	}

	// Déformatage
	function __xsDeformateAnneeSur4(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		return __xsGetDeformateN(sValeur, tabFormats, tabComposantesDateHeure, 4, 0);
	}
	function __xsDeformateAnneeSur2(sValeur, tabFormats, tabComposantesDateHeure, nOptions)
	{
		__xThrowErreurSurLongueur(sValeur, 2);
		var nAnnee = parseInt(sValeur.substr(0, 2), 10);
		if (!isNaN(nAnnee))
		{
			// GP 04/05/2016 : TB97573 : Le comportement de ChaineVersDate et des masque de saisie est différent :
			// - DateVersChaine : ajoute 19 ou 20
			// - Masque date : ajoute 20 systématiquement
			var sCentainesAnnees = "20";
			// nTDV_nPIVOT1950 : Même valeur que en code serveur : l'option est 0x4
			if ((50 < nAnnee) && (0x4 === (nOptions & 0x4)))
			{
				sCentainesAnnees = "19";
			}
			// GP 01/03/2018 : TB105397 : Il ne faut pas oublier le sCompleteEntier sinon pour les dates entre 2000 et 2009, ont obtient un résultat invalide.
			tabComposantesDateHeure[0] = sCentainesAnnees + clWDUtil.sCompleteEntier(nAnnee, 2);
		}
		return sValeur.substr(2);
	}
	function __xsDeformateMoisLong(sValeur, tabFormats, tabComposantesDateHeure, nOptions)
	{
		return __xsDeformateMois(sValeur, tabFormats, tabComposantesDateHeure, nOptions, clWDUtil.sGetMois);
	}
	function __xsDeformateMoisCourt(sValeur, tabFormats, tabComposantesDateHeure, nOptions)
	{
		return __xsDeformateMois(sValeur, tabFormats, tabComposantesDateHeure, nOptions, clWDUtil.sGetMoisCourt);
	}
	function __xsDeformateMoisSur2(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		return __xsGetDeformateN(sValeur, tabFormats, tabComposantesDateHeure, 2, 1);
	}
	function __xsDeformateMoisSur1(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		return __xsGetDeformateNComplete(sValeur, tabFormats, tabComposantesDateHeure, 2, 1);
	}
	function __xsDeformateJourSemaineLong(sValeur, tabFormats, tabComposantesDateHeure, nOptions)
	{
		return __xsDeformateJourSemaine(sValeur, tabFormats, tabComposantesDateHeure, nOptions, clWDUtil.sGetJourSemaine);
	}
	function __xsDeformateJourSemaineCourt(sValeur, tabFormats, tabComposantesDateHeure, nOptions)
	{
		return __xsDeformateJourSemaine(sValeur, tabFormats, tabComposantesDateHeure, nOptions, clWDUtil.sGetJourSemaineCourt);
	}
	function __xsDeformateJourSur2(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		return __xsGetDeformateN(sValeur, tabFormats, tabComposantesDateHeure, 2, 2);
	}
	function __xsDeformateJourSur1(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		return __xsGetDeformateNComplete(sValeur, tabFormats, tabComposantesDateHeure, 2, 2);
	}
	function __xsDeformateJourSemaineSur1(sValeur/*, tabFormats*//*, tabComposantesDateHeure*//*, nOptions*/)
	{
		// Ignore le caractère (juste de la présentation)
		__xThrowErreurSurLongueur(sValeur, 1);
		return sValeur.substr(1);
	}

	// Utilitaire
	function __nGetHeures(sHeureWL, nOffsetHeurePourDateHeure)
	{
		return parseInt(sHeureWL.substr(0 + nOffsetHeurePourDateHeure, 2), 10);
	}
	function __nGetHeuresAM_PM(sHeureWL, tabFormats, nOffsetHeurePourDateHeure)
	{
		var nHeures = __nGetHeures(sHeureWL, nOffsetHeurePourDateHeure);
		if (!clWDUtil.bForEach(tabFormats, function(oUnFormat)
		{
			return oUnFormat !== __sGetAM_PM;
		}))
		{
			if (0 === nHeures)
			{
				return 12;
			}
			else if (12 < nHeures)
			{
				return nHeures - 12;
			}
		}
		return nHeures;
	}
	function __sGetAM_PM(sHeureWL, tabFormats, nOffsetHeurePourDateHeure)
	{
		return (__nGetHeures(sHeureWL, nOffsetHeurePourDateHeure) < 12) ? "AM" : "PM";
	}

	// Formatage
	function __sGetHeureSur2(sHeureWL, tabFormats, nOffsetHeurePourDateHeure)
	{
		return clWDUtil.sCompleteEntier(__nGetHeuresAM_PM(sHeureWL, tabFormats, nOffsetHeurePourDateHeure), 2);
	}
	function __sGetHeureSur1(sHeureWL, tabFormats, nOffsetHeurePourDateHeure)
	{
		return clWDUtil.sCompleteEntier(__nGetHeuresAM_PM(sHeureWL, tabFormats, nOffsetHeurePourDateHeure), 1);
	}
	function __sGetMinuteSur2(sHeureWL, tabFormats, nOffsetHeurePourDateHeure)
	{
		return sHeureWL.substr(2 + nOffsetHeurePourDateHeure, 2);
	}
	function __sGetSecondesSur2(sHeureWL, tabFormats, nOffsetHeurePourDateHeure)
	{
		return sHeureWL.substr(4 + nOffsetHeurePourDateHeure, 2);
	}
	function __sGetMilliSecondesSur3(sHeureWL, tabFormats, nOffsetHeurePourDateHeure)
	{
		var sMilliSecondes = sHeureWL.substr(6 + nOffsetHeurePourDateHeure, 3);
		switch (sMilliSecondes.length)
		{
		case 0:
			return "000";
		case 1:
			return sMilliSecondes + "00";
		case 2:
			return sMilliSecondes + "0";
		default:
		case 3:
			return sMilliSecondes;
		}
	}
	function __sGetCentiemesSecondesSur2(sHeureWL, tabFormats, nOffsetHeurePourDateHeure)
	{
		var sCentiemesSecondes = sHeureWL.substr(6 + nOffsetHeurePourDateHeure, 2);
		switch (sCentiemesSecondes.length)
		{
		case 0:
			return "00";
		case 1:
			return sCentiemesSecondes + "0";
		default:
		case 2:
			return sCentiemesSecondes;
		}
	}

	// Déformatage
	function __xsDeformateHeureSur2(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		return __xsGetDeformateN(sValeur, tabFormats, tabComposantesDateHeure, 2, 3);
	}
	function __xsDeformateHeureSur1(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		return __xsGetDeformateNComplete(sValeur, tabFormats, tabComposantesDateHeure, 2, 3);
	}
	function __xsDeformateMinuteSur2(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		return __xsGetDeformateN(sValeur, tabFormats, tabComposantesDateHeure, 2, 4);
	}
	function __xsDeformateSecondesSur2(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		return __xsGetDeformateN(sValeur, tabFormats, tabComposantesDateHeure, 2, 5);
	}
	function __xsDeformateMilliSecondesSur3(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		return __xsGetDeformateN(sValeur, tabFormats, tabComposantesDateHeure, 3, 6);
	}
	function __xsDeformateCentiemesSecondesSur2(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		sValeur = __xsGetDeformateN(sValeur, tabFormats, tabComposantesDateHeure, 2, 6);
		tabComposantesDateHeure[6] += "0";
		return sValeur;
	}
	function __xsDeformateAM_PM(sValeur, tabFormats, tabComposantesDateHeure/*, nOptions*/)
	{
		__xThrowErreurSurLongueur(sValeur, 2);
		var sAM_PM = sValeur.substr(0, 2);
		var nHeure = parseInt(tabComposantesDateHeure[3], 10);
		clWDUtil.WDDebug.assert((1 <= nHeure) && (nHeure <= 12), "Heure invalide");
		switch (sAM_PM.toLowerCase())
		{
		case "am":
			// Seul 12 change
			if (12 === nHeure)
			{
				tabComposantesDateHeure[3] = "00";
			}
			break;
		case "pm":
			// Seul 12 reste en PM
			if ((1 <= nHeure) && (nHeure < 12))
			{
				// Pas besoin de completer sur deux chiffres, les heures sont < 12 donc toujours sur deux chiffres
				tabComposantesDateHeure[3] = String(nHeure + 12);
				nHeure += 0;
			}
			break;
		}
		return sValeur.substr(2);
	}
})();

// Tableau des mois : a définir directement sous forme de tableau constant un jour dans WWConstante.js
clWDUtil.sGetMois = function sGetMois(nMois)
{
	switch (nMois)
	{
	case 0:
		return STD_JANVIER;
	case 1:
		return STD_FEVRIER;
	case 2:
		return STD_MARS;
	case 3:
		return STD_AVRIL;
	case 4:
		return STD_MAI;
	case 5:
		return STD_JUIN;
	case 6:
		return STD_JUILLET;
	case 7:
		return STD_AOUT;
	case 8:
		return STD_SEPTEMBRE;
	case 9:
		return STD_OCTOBRE;
	case 10:
		return STD_NOVEMBRE;
	case 11:
		return STD_DECEMBRE;
	default:
		return "";
	}
};
clWDUtil.sGetMoisCourt = function sGetMoisCourt(nMois)
{
	var sMois = this.sGetMois(nMois);
	var sMoisCourt = sMois.substr(0, 3);
	// GP 22/10/2014 : QW250330 : nMois commence a zéro donc c'est 5 et 6 et pas 6 et 7
	switch (nMois)
	{
	case 5:
	case 6:
		if ("jui" == sMoisCourt.toLowerCase())
		{
			sMoisCourt = sMois.substr(0, 4);
		}
		break;
	}

	return sMoisCourt;
};

// Tableau des jours de la semaine : a définir directement sous forme de tableau constant un jour dans WWConstante.js
clWDUtil.sGetJourSemaine = function sGetJourSemaine(nJour)
{
	switch (nJour)
	{
	case 0:
		return STD_DIMANCHE;
	case 1:
		return STD_LUNDI;
	case 2:
		return STD_MARDI;
	case 3:
		return STD_MERCREDI;
	case 4:
		return STD_JEUDI;
	case 5:
		return STD_VENDREDI;
	case 6:
		return STD_SAMEDI;
	default:
		return "";
	}
};
clWDUtil.sGetJourSemaineCourt = function sGetJourSemaineCourt(nJour)
{
	return this.sGetJourSemaine(nJour).substr(0, 3);
};

//////////////////////////////////////////////////////////////////////////
// Gestion des champs et des traitements (rendu obligatoire par ChampClone)

// Contexte de recherche des champs
clWDUtil.__WDContexte = (function ()
{
	"use strict";

	function __WDContexte(oContextePrecedent, oCorrespondanceClone)
	{
		this.m_oContextePrecedent = oContextePrecedent;
		this.m_oCorrespondanceClone = oCorrespondanceClone;
	};
	__WDContexte.prototype.sGetAliasDeOriginal = function sGetAliasDeOriginal(sAlias)
	{
		// Recherche :
		// - Dans le contexte de clone (si on est dans un clone)
		// - Dans le contexte précédent (si on n'est pas dans le contexte racine)
		// Sinon retourne simplement l'alias (cas du contexte racine)
		return (this.m_oCorrespondanceClone && this.m_oCorrespondanceClone.sGetAliasDeOriginal(sAlias)) || (this.m_oContextePrecedent && this.m_oContextePrecedent.sGetAliasDeOriginal(sAlias)) || sAlias;
	};
	return __WDContexte;
})();

// Mémorisation des PCodes et de la déclaration des variables (n'existe que pour les champs présent en édition dans la page
// Note on a aussi un objet pour la page (et pour les champs pages internes)
clWDUtil.WDChampDeclare = (function ()
{
	"use strict";

	// tabTraitements : declarations automatiques à la construction
	function __WDChampDeclare(sAliasOriginal, bEstPage)
	{
		// On maintient deux objets utilisés comme tableau associatifs : un pour les PCodes (l'indice est un entier) et un pour les procédures (l'indice est une chaîne)
		this.m_oPCodes = {};
		this.m_oProcedures = {};
		this.m_tabClones = [];
		this.m_sAliasOriginal = sAliasOriginal;
		this.m_bEstPage = bEstPage;
	};

	// Trouve le bon objet selon l'indice
	__WDChampDeclare.prototype.__oGetSelonIndice = function __oGetSelonIndice(oIDPCodeOuProcedure)
	{
		switch (typeof oIDPCodeOuProcedure)
		{
		case "number":
			return this.m_oPCodes;
		case "string":
			return this.m_oProcedures;
		}
	};

	// Declare des traitement navigateur
	__WDChampDeclare.prototype.DeclareTraitement = function DeclareTraitement(oIDPCodeOuProcedure, pfTraitement, sSuffixeOuUndefined)
	{
		this.__oGetSelonIndice(oIDPCodeOuProcedure)[oIDPCodeOuProcedure + (sSuffixeOuUndefined || "")] = pfTraitement;
		// Si on est dans une page : exporte le traitement dans l'espace global si c'est une procédure racine
		// Les procédures ancetres ont un suffixe
		// GP 17/11/2020 : QW332472 : On n'exporte pas dans le cas des pages AWP sans UI.
		if (("string" === typeof oIDPCodeOuProcedure) && (undefined === sSuffixeOuUndefined) && ((undefined === window.NSPCS) || (false === NSPCS.NSUtil.ms_bPageAWPSansUI)))
		{
			// GP 08/04/2016 : TB97535 : Exporte aussi les procédures avec un nom : ce sont les procédures JS pur.
			if (this.m_bEstPage || (pfTraitement && pfTraitement.name))
			{
				window[oIDPCodeOuProcedure] = pfTraitement;
			}
			else
			{
				// GP 08/02/2016 : QW268032 : Exporte aussi les procédures des champs.
				window[this.m_sAliasOriginal + "_" + oIDPCodeOuProcedure.toUpperCase()] = pfTraitement;
			}
		}
	};

	// Déclare un clone du champ
	__WDChampDeclare.prototype.DeclareClone = function DeclareClone(sAliasClone)
	{
		this.m_tabClones.push(sAliasClone);
		// GP 08/02/2016 : QW268032 : Exporte aussi les procédures du clone des champs.
		// Notes :
		// - On est forcément dans un champ puisque seul les champ peuvent avoir un clone.
		// - Contrairement à DeclareTraitement : on exporte aussi les procédures racine car on est incapable de les filtrées.
		clWDUtil.bForEach(this.m_oProcedures, function (pfTraitement, sNom)
		{
			window[sAliasClone + "_" + sNom.toUpperCase()] = pfTraitement;
			return true;
		});
	};
	// Récupère le tableau du nom des clones du champ
	__WDChampDeclare.prototype.tabGetClones = function tabGetClones()
	{
		return this.m_tabClones;
	};

	// Recupere un PCode navigateur
	// Cette fonction n'appele pas le PCode : il n'est pas possible de transformer simplement les parametres variables et en supprimant un
	// Mais cette fonction retourne une fonction vide qui permet de ne rien faire planter
//	__WDChampDeclare.prototype.pfRecupereTraitement = function pfRecupereTraitement(oIDPcodeOuProcedure, sSuffixe)
//	{
//		return this.pfRecupereTraitementDirect(oIDPCodeOuProcedure, sSuffixe) || clWDUtil.m_pfVide;
//	};
	__WDChampDeclare.prototype.pfRecupereTraitementDirect = function pfRecupereTraitementDirect(oIDPCodeOuProcedure, sSuffixe)
	{
		return this.__oGetSelonIndice(oIDPCodeOuProcedure)[oIDPCodeOuProcedure + (sSuffixe || "")];
	};

	return __WDChampDeclare;
})();

//////////////////////////////////////////////////////////////////////////
// Classes de base des champs/objets (éléments d'un champ : colonne, rupture,...)
//	clWDUtil.WDTableauChamps
//		Classe utilitaire de gestion d'un tableau de champ indice par nom
clWDUtil.WDTableauChamps = (function ()
{
	"use strict";

	function __WDTableauChamps()
	{
		// La classe fonctionne directement comme un tableau associatif indicé sur l'alias des champs
		// => On n'a donc pas de membres.
	};

	// Declare un champ
	__WDTableauChamps.prototype.DeclareChamp = function DeclareChamp(oChamp)
	{
		this[oChamp.m_sAliasChamp] = oChamp;
	};

	// Recupere un champ
	__WDTableauChamps.prototype.oGetChamp = function oGetChamp(sChamp)
	{
		// Retourne le champ uniquement s'il est valide (= appel du .Init())
		var oChamp = this[sChamp];
		// GP 19/01/2016 : Si le champ n'est pas dans le HTML : on le marque comme initialisé sinon oGetObjetChamp/__WDTableauChamps.prototype.oGetChamp ne le retourne pas
		// Note c'est douteux comme solution mais c'est le plus simple. Ce qui est douteux à la base est que oGetObjetChamp peut retourner null et que plein d'appel ne gèrent pas le cas.
		if (oChamp)
		{
			switch (oChamp.m_eValide)
			{
			case 0:
				// Pas encore initialisé (appel trop tôt)
				return undefined;
			case 1:
				// Initialisé
				return oChamp;
			case 2:
				// Erreur fatale WL (Dans un plan avec chargement différée non présent)
				// "Le champ (alias : '%1') ne peut pas être manipulé car il n'est pas présent dans le HTML de la page."
				// "Ce champ est (directement ou indirectement) dans un plan avec chargement différé qui n'a pas encore été affiché (et donc chargé)."
				throw new WDErreur(610, oChamp.m_sAliasChamp);
			case 3:
				// Erreur fatale WL (Pas dans le HTML)
				// "Le champ (alias : '%1') ne peut pas être manipulé car il n'est pas présent dans le HTML de la page."
				// "Ce champ (ou un de ses parents) est invisible et l'option 'Générer le code HTML du champ, même s'il est invisible' n'est pas activée."
				throw new WDErreur(611, oChamp.m_sAliasChamp);

			}
		}
		else
		{
			return undefined;
		}
	};
	__WDTableauChamps.prototype.oGetChampDirect = function oGetChampDirect(sChamp)
	{
		return this[sChamp];
	};

	// Appel une callback sur tous les champs
	// pfForEach a pour prototype function (sChamp, oChamp) : boolean
	__WDTableauChamps.prototype.bPourTousChamps = function bPourTousChamps (pfForEach)
	{
		return clWDUtil.bForEachIn(this, pfForEach);
	};

	// Appele une methode sur tous les champs
	__WDTableauChamps.prototype._AppelMethode = function _AppelMethode(sFonction, tabParam, oExclus)
	{
		this.bPourTousChamps(function(sChamp, oChamp)
		{
			// Filtre les champs :
			// - Champs invalide
			// - Champ exclus
			// GP 03/09/2012 : - Champ sans la fonction
			if (oChamp && (oChamp != oExclus) && oChamp[sFonction])
			{
				// Applique alors la methode sur le champ
				oChamp[sFonction].apply(oChamp, tabParam);
			}
			return true;
		});
	};
	__WDTableauChamps.prototype._AppelMethodePtr = function _AppelMethodePtr(fFonction, tabParam, oExclus)
	{
		this.bPourTousChamps(function(sChamp, oChamp)
		{
			// Filtre les champs :
			// - Champs invalide
			// - Champ exclus
			// GP 08/02/2017 : QW283569 : Et aussi les champs non disponible
			if (oChamp && (oChamp != oExclus) && (1 == oChamp.m_eValide))
			{
				// Applique alors la methode sur le champ
				fFonction.apply(oChamp, tabParam);
			}
			return true;
		});
	};

	// Appele une methode sur un champ dont on connait le nom
	// tabParam : tableau des parametres
	__WDTableauChamps.prototype._oAppelFonctionChamp = function _oAppelFonctionChamp(sAlias, sFonction, tabParam)
	{
		var oChamp = this.oGetChamp(sAlias);
		if (oChamp)
		{
			return oChamp[sFonction].apply(oChamp, tabParam);
		}
		return undefined;
	};
	__WDTableauChamps.prototype._oAppelFonctionChampPtr = function _oAppelFonctionChampPtr(sAlias, fFonction, tabParam)
	{
		var oChamp = this.oGetChamp(sAlias);
		if (oChamp)
		{
			return fFonction.apply(oChamp, tabParam);
		}
		return undefined;
	};
	return __WDTableauChamps;
})();

//////////////////////////////////////////////////////////////////////////
// Classes de base des champs/objets (éléments d'un champ : colonne, rupture,...)
//	clWDUtil.WDObjet
//		Element d'un champ (colonne, rupture)
clWDUtil.WDObjet = (function ()
{
	"use strict";

	function __WDObjet(sAlias)
	{
		// Si on est pas dans l'init d'un protoype
		if (arguments.length)
		{
			this.m_sAlias = sAlias;
		}
	}

	// Recherche dans un tableau de sous champ par alias
	// Attention, pour des tableaux simple (indexé par indice) : non compatible avec clWDUtil.WDTableauChamps (qui est indexé par alias).
	__WDObjet.prototype.s_nChercheParAlias = function s_nChercheParAlias(tabTableau, sAlias)
	{
		var nIndice = clWDUtil.nDansTableauFct(tabTableau, function (oObjet, sAlias)
			{
				return oObjet.m_sAlias === sAlias;
			}
			, sAlias);
		return (clWDUtil.nElementInconnu !== nIndice) ? nIndice : undefined;
	};

	return __WDObjet;
})();

// Contexte courant (initialisé avec le contexte racine)
clWDUtil.m_oContexte = new clWDUtil.__WDContexte(null, null);
// Tableaux des correspondances de clones
clWDUtil.m_oCorrespondancesClones = {};
// Tableaux des traitements (indicé par alias (forcément original)) (les traitements de la page sont indicés par l'alias de la page)
clWDUtil.m_oChampsDeclare = {};
// Les variables de la page. Indicé par alias du champ/de la page.
clWDUtil.m_oVariables = {};
// Les champs de pages avec un code de gestion particulier. Indicé par alias du champ.
clWDUtil.m_oChamps = new clWDUtil.WDTableauChamps();
// Les traitements serveurs ajoutés par ..Traitement et qui sont d'un intéret pour le JS.
clWDUtil.m_oSurchargeTraitementServeur = {};

// Recherche le tableau de correspondance d'un clone
clWDUtil.__oGetCorrespondanceClone = function __oGetCorrespondanceClone(sAlias)
{
	return clWDUtil.m_oCorrespondancesClones[sAlias];
};

// Retourne la description d'un champ (ou d'une page/page interne)
clWDUtil.__oGetChampDeclare = function __oGetChampDeclare(sAlias)
{
	return clWDUtil.m_oChampsDeclare[sAlias];
};
// Déclare un champ (on peut avoir plusieurs appels : pour les traitements, les procédures et les variables)
clWDUtil.__oDeclareChampDeclare = function __oDeclareChampDeclare(sAliasOriginal, bEstPage)
{
	var oChampDeclare = this.m_oChampsDeclare[sAliasOriginal];
	if (oChampDeclare)
	{
		return oChampDeclare;
	}
	else
	{
		return (this.m_oChampsDeclare[sAliasOriginal] = new this.WDChampDeclare(sAliasOriginal, bEstPage));
	}
};

// Ajoute un objet avec des variables au champ
clWDUtil.__DeclareVariables = function __DeclareVariables(sAlias, oVariables)
{
	if (this.m_oVariables.hasOwnProperty(sAlias))
	{
		// Existe déjà : fusion
		var oVariablesExistantes = this.m_oVariables[sAlias];
		this.bForEachIn(oVariables, function (sNom, oValeur)
		{
			oVariablesExistantes[sNom] = oValeur;
			return true;
		});

	}
	else
	{
		// N'existe pas encore : création
		this.m_oVariables[sAlias] = oVariables;
	}
};

// Recupere le traitement d'un champ
// !!! Retourne undefined si le traitement n'existe pas !!!
clWDUtil.__pfGetTraitementDirect = function __pfGetTraitementDirect(sAliasOriginal, oIDPCodeOuProcedure, sSuffixe)
{
	var oChampDeclare = this.__oGetChampDeclare(sAliasOriginal);
	if (oChampDeclare)
	{
		return oChampDeclare.pfRecupereTraitementDirect(oIDPCodeOuProcedure, sSuffixe);
	}
	else
	{
		return undefined;
	}
};

// Declaration de tous les clones
// Version interne récursive qui retourne l'objet construit (pour pouvoir le fusionner dans l'objet parent)
// Format (récursif) :
//	<oClones> =
//	{
//		"Alias clone 1" : { m_sAliasOriginal : "Alias original", m_oFils : <oClones> }
//	, 	"Alias clone 2" : { m_sAliasOriginal : "Alias original", m_oFils : <oClones> }
//	,	...
//	, 	"Alias clone N" : { m_sAliasOriginal : "Alias original", m_oFils : <oClones> }
//	}
// oCorrespondanceParent : contenu de la fusion (parametre "OUT")
clWDUtil.__DeclareClones = (function ()
{
	"use strict";

	// Contexte de correspondance des alias dans un clone
	function __WDCorrespondanceClone(sAliasClone, oDescription, oCorrespondanceParent)
	{
		// oDescription = { m_sAliasOriginal : "Alias original"[, m_oFils : <oClones>] }
		var sAliasOriginal = oDescription.m_sAliasOriginal;

		// Se déclare soit même
		this[sAliasOriginal] = sAliasClone;
		// Et déclare les fils (chaque fils fait la fusion de sont contenu dans la correspondance parent
		clWDUtil.__DeclareClones(oDescription.m_oFils, this);

		// Fusionne notre correspondance dans la correspondance parent
		if (oCorrespondanceParent)
		{
			clWDUtil.bForEachIn(this, function(sAliasOriginal, sAliasClone)
			{
				if (!oCorrespondanceParent[sAliasOriginal])
				{
					oCorrespondanceParent[sAliasOriginal] = sAliasClone;
				}
				return true;
			});
		}

		// Déclare la correspondance inverse. Comme les alias sont en majuscule on est sur de ne pas avoir de colission entre "m_sAliasOriginal" et un alias.
		// Fait après la déclaration dans le parent pour ne pas placer ces valeurs dans le parent
		this.m_sAliasOriginal = sAliasOriginal;
		this.m_oCorrespondanceParent = oCorrespondanceParent;
		// Mémorise aussi les paramètres s'il existent
		this.m_tabParametres = oDescription.m_tabParametres;

		// Les variables du champ original ne sont pas encore déclarées
		// => On déclarera les variables du clone dans la déclaration des variables du champ original
		// false : l'élément a un clone cela ne peut donc pas être une page
		clWDUtil.__oDeclareChampDeclare(sAliasOriginal, false).DeclareClone(sAliasClone);
	}

	// Rechere un alias dans la correspondance
	__WDCorrespondanceClone.prototype.sGetAliasDeOriginal = function sGetAliasDeOriginal(sAlias)
	{
		return this[sAlias] || (this.m_oCorrespondanceParent && this.m_oCorrespondanceParent.sGetAliasDeOriginal(sAlias));
	};

	return function __DeclareClones(oClones, oCorrespondanceParent)
	{
		this.bForEachIn(oClones, function(sAliasClone, oDescription)
		{
			clWDUtil.m_oCorrespondancesClones[sAliasClone] = new __WDCorrespondanceClone(sAliasClone, oDescription, oCorrespondanceParent);
			return true;
		});
	};
})();

// Recherche un alias dans le contexte de champ courant : permet de retrouver un champ
clWDUtil.sGetAliasDeOriginal = function sGetAliasDeOriginal(sAlias)
{
	return this.m_oContexte.sGetAliasDeOriginal(sAlias);
};
// Recherche un alias dans le contexte de champ courant depuis l'alias effectif
clWDUtil.sGetAliasDeEffectif = function sGetAliasDeEffectif(sAlias)
{
	var oCorrespondanceClone = this.__oGetCorrespondanceClone(sAlias);
	return oCorrespondanceClone ? oCorrespondanceClone.m_sAliasOriginal : sAlias;
};

// Exécute les traitements de déclaration/terminaison des classes/collections.
// GP 10/10/2019 : QW317682 : Comme maintenant on génère systématiquement les appels que la méthode existe ou pas, on vérifie si chacune existe.
clWDUtil.ExecuteInitTerm = function ExecuteInitTerm(tabMethodes, oEvent)
{
	this.bForEach(tabMethodes, function (sMethode)
	{
		var pfMethode = window[sMethode];
		if ("function" === typeof pfMethode)
		{
			pfMethode(oEvent);
		}
		return true;
	});
};

// Recupere un pointeur sur une fonction bindé dans le contexte courant
// !!! Retourne undefined si le traitement n'existe pas !!!
// sAlias peut être un :
// - Un alias de champ original (appel depuis un traitement JS)
// - Un alias effectif (appel depuis une partie du framework)
// En fait cela n'a pas d'importance :
// - On a besoin de l'alias original pour avoir le traitement
// - On construit un contexte avec cet alias
//	- Si on a l'alias original, le contexte construit ne sert a rien (on est normalement déjà dans le bon contexte et donc le chainage fait le travail)
//	- Si on a l'alias effectif, on se place dans le bon contexte
clWDUtil.pfGetTraitementDirect = function pfGetTraitementDirect(sAlias, oIDPCodeOuProcedure, sSuffixe)
{
	// Trouve l'alias original (pour avoir le traitement)
	var sAliasOriginal;
	// Mémorise la procédure (pour la closure)
	var oContexteCourant;
	var oCorrespondanceClone = this.__oGetCorrespondanceClone(sAlias);
	if (oCorrespondanceClone)
	{
		// On a un clone n'est que c'est forcément un l'alias effectif, on se place dans le bon contexte
		sAliasOriginal = oCorrespondanceClone.m_sAliasOriginal;
		oContexteCourant = new clWDUtil.__WDContexte(this.m_oContexte, oCorrespondanceClone);
	}
	else
	{
		// On n'a pas de clone, on a donc forcement un alias original (et effectif) le contexte construit ne sert a rien (on est normalement déjà dans le bon contexte et donc le chainage fait le travail)
		sAliasOriginal = sAlias;
		oContexteCourant = this.m_oContexte;
	}

	// Trouve le traitement
	var pfTraitement = clWDUtil.__pfGetTraitementDirect(sAliasOriginal, oIDPCodeOuProcedure, sSuffixe);

	// Si le traitement est vide, inutile de faire la closure
	if (!pfTraitement)
	{
		return undefined;
	}

	// Lors de l'appel de la fonction retournée, le contexte n'est pas forcément le même que le contexte lors de l'appel de clWDUtil.pfGetTraitement :
	// - Sauve le contexte courant
	// - Restaure le contexte trouvé lors de l'appel de clWDUtil.pfGetTraitement (comme le contexte chaine les contextes précédent, on a automatiquement les contextes précédents)
	// - Effectue l'appel
	// - Restaure le contexte courant
	var pfTraitementWrapper = function()
	{
		// GP 02/12/2015 : QW266725 : Si la page est déchargé lors de l'exécution de pfTraitement, on n'a plus clWDUtil dans le finally
		// GP 27/08/2015 : QW260556 : Ici this n'a aucun sens (la fonction construite est appelé hors du contexte du this parent) => Il faut utiliser oWDUtilLocal
		var oWDUtilLocal = clWDUtil;
		try
		{
			var oContextePrecedent = oWDUtilLocal.m_oContexte;
			oWDUtilLocal.m_oContexte = oContexteCourant;

			// Effectue l'appel
			// GP 13/07/2015 : QW259688 : Ici il manquait un return
			return pfTraitement.apply(this, arguments);
		}
		finally
		{
			// GP 27/08/2015 : QW260556 : Ici this n'a aucun sens (la fonction construite est appelé hors du contexte du this parent) => Il faut utiliser oWDUtilLocal
			oWDUtilLocal.m_oContexte = oContextePrecedent;
		}
	};
	// GP 30/06/2017 : QW288704 : Mémorise le nombre de paramètre de la fonction
	pfTraitementWrapper.nNbParametres = pfTraitement.length;
	// Pour le += et -= du type procédure
	var sNomTraitement = pfTraitement.name;
	if ((undefined !== sNomTraitement) && ("" != sNomTraitement))
	{
		pfTraitementWrapper.sNom = sNomTraitement;
	}
	else
	{
		// Alias : on n'ajoute pas l'alias si on est sur la page (c'est surtout important dans les pages AWP sans UI puisque c'est ce que l'on utilise pour le nom de la procédure).
		// Suffixe : on test le undefined vide car on n'a pas forcément de suffixe (le paramètre est optionnel).
		pfTraitementWrapper.sNom = ((window.NSPCS && (sAlias === NSPCS.NSUtil.ms_sAliasPage)) ? "" : sAlias) + oIDPCodeOuProcedure + (sSuffixe || "");
	}
	// "SymbolDepuisWLEnV2" : indique si le traitement vient de la conversion depuis le WL avec le framework V2 (exploité uniquement par le framework V2 pour le passage des paramètres).
	if (window.NSPCS && pfTraitement[NSPCS.ms_oSymbolDepuisWLEnV2])
	{
		pfTraitementWrapper[NSPCS.ms_oSymbolDepuisWLEnV2] = true;
	}

	return pfTraitementWrapper;
};
// Recupere un pointeur sur une fonction bindé dans le contexte courant
// Version qui retourne toujours quelquechose
clWDUtil.pfGetTraitement = function pfGetTraitement(sAlias, oIDPCodeOuProcedure, sSuffixe)
{
	return this.pfGetTraitementDirect(sAlias, oIDPCodeOuProcedure, sSuffixe) || clWDUtil.m_pfVide;
};

// Execute un traitement sur un champ et sur tous ses clones (pour le code de onload/unload des superchamps)
clWDUtil.pfGetTraitementAvecAppelClones = function pfGetTraitementAvecAppelClones(sAliasOriginal, oIDPCodeOuProcedure, sSuffixe)
{
	var pfTraitement = this.pfGetTraitementDirect(sAliasOriginal, oIDPCodeOuProcedure, sSuffixe);
	// Si on n'a pas le traitement original, on n'en aura pas plus pour tout ces clones.
	if (!pfTraitement)
	{
		return clWDUtil.m_pfVide;
	}

	// Si on n'a pas de clones, on n'a pas besoin de faire plus
	var oChampDeclare = this.__oGetChampDeclare(sAliasOriginal);
	if (!oChampDeclare)
	{
		return pfTraitement;
	}


	// On garde la capture de la fonction pour le champ original
	var tabFonctionClones = [ ];
	// Et on doit faire la capture de la fonction pour tous ses clones maintenant (pour avoir le contexte courant)
	this.bForEach(oChampDeclare.tabGetClones(), function(sAliasClone)
	{
		tabFonctionClones.push(clWDUtil.pfGetTraitementDirect(sAliasClone, oIDPCodeOuProcedure, sSuffixe));
		return true;
	});

	// Et on retourne une fonction qui fait l'appel de toutes ces méthodes en série
	// => On ne fait pas de capture du contexte (= la fonction retournée sera appelé directement) et elle même n'est pas appelé dans un contetxe
	return function()
	{
		var oThis = this;
		var tabArguments = arguments;

		// Execute le code du champ
		var oResultat = pfTraitement.apply(oThis, tabArguments);
		// Execute le code des clones
		clWDUtil.bForEach(tabFonctionClones, function(pfFonctionClone)
		{
			pfFonctionClone.apply(oThis, tabArguments);
			return true;
		});

		return oResultat
	};
};

// Recupere les variables d'un champ
clWDUtil.oGetVariables = function oGetVariables(sAlias)
{
	return this.m_oVariables[sAlias];
};

// Indique si un traitement serveur particulier sur un champ particulier a été surchargé par ..Traitement
clWDUtil.bSurchargeTraitementServeur = function bSurchargeTraitementServeur(sAliasChamp, nTraitement)
{
	// sAliasChamp :
	// - Pages : impossible, aucun traitement de page surchargable par ..Traitement n'a d'intéret en JS.
	// - Champs normaux : alias du champ
	// - Champs clones : on peut avoir l'alias du clone (si l'action est inline dans le HTML) ou l'alias du champ parent (si l'action est en fin de code JS du champ)
	var tabTraitement = this.m_oSurchargeTraitementServeur[clWDUtil.sGetAliasDeOriginal(sAliasChamp)];
	// Si on trouve, il y a un arrêt de l'énumération donc bForEach retourne false : il faut donc inverser le résultat.
	return !this.bForEach(tabTraitement || [], function (nTraitementServeur)
	{
		// Continue tant que l'on ne trouve pas le traitement demandé.
		return nTraitement !== nTraitementServeur;
	});
};

// Methode STATIQUE : Recupere l'objet attache a un champ
function oGetObjetChamp(sAlias)
{
	return clWDUtil.m_oChamps.oGetChamp(sAlias);
};

// Methode STATIQUE : Appele une methode sur tout les champs sauf le champ passe en parametre
// Il est possible de ne pas passer le parametre
// tabParam : tableau des parametres
function AppelMethode(sFonction, tabParam, oExclus)
{
	clWDUtil.m_oChamps._AppelMethode(sFonction, tabParam, oExclus);
};
function AppelMethodePtr(fFonction, tabParam, oExclus)
{
	clWDUtil.m_oChamps._AppelMethodePtr(fFonction, tabParam, oExclus);
};

// Methode STATIQUE : Appele une methode sur un champ dont on connait le nom
// tabParam : tableau des parametres
clWDUtil.oAppelFonctionChamp = function oAppelFonctionChamp(sAlias, sFonction, tabParam)
{
	return this.m_oChamps._oAppelFonctionChamp(sAlias, sFonction, tabParam);
};
clWDUtil.oAppelFonctionChampPtr = function oAppelFonctionChampPtr(sAlias, fFonction, tabParam)
{
	return this.m_oChamps._oAppelFonctionChampPtr(sAlias, fFonction, tabParam);
};
// Utile car appel depuis le .swf du champ video et du champ upload
// GP 22/07/2015 : QW260185 : Sauf que le nom est AppelMethodeChamp
var AppelMethodeChamp = function() { return clWDUtil.oAppelFonctionChamp.apply(clWDUtil, arguments); };
// GP 03/12/2015 : Vu avec TB90136 : le nom est AppelFonctionChamp pour le champ video flash.
var AppelFonctionChamp = AppelMethodeChamp;

// Declaration de tous les clones
// Format (récursif) :
//	<oClones> =
//	{
//		"Alias clone 1" : { m_sAliasOriginal : "Alias original", m_oFils : <oClones> }
//	, 	"Alias clone 2" : { m_sAliasOriginal : "Alias original", m_oFils : <oClones> }
//	,	...
//	, 	"Alias clone N" : { m_sAliasOriginal : "Alias original", m_oFils : <oClones> }
//	}
// #IDEE : Pour le futur : ne pas déclarer tous les clones mais juste les clones qui peuvent être utilisés en JS.
clWDUtil.DeclareClones = function DeclareClones(oClones)
{
	// Le tableau des clones est mit a plat pour avoir des objets de correspondance "Alias original" => "Alias clone" :
	// - Un objet par champ cloné (et cloné indirectement)
	// - Dans un chaque objet il y a le champ et TOUS ces fils
	// => Un champ fils peut donc être dans plusieurs objets
	// => Il peut y avoir des colissions : Cellule + Bouton, la cellule est cloné et ensuite le clone du bouton est cloné
	// On passe donc de C+B, a C'+B'+B'', B' et B'' viennent de B mais dans le contexte de C, la manipulation de B doit correspondre a B'
	clWDUtil.__DeclareClones(oClones, null);
};

// Déclaration des traitements.
// sSuffixeOuUndefined1 : undefined, "", _x (x = nombre heritage), _COM

// - Version compatible (anciennes pages)
// tabTraitements est un tableau dont les valeurs sont groupés trois par trois :
//	[
//		oIDPCodeOuProcedure1, pfTraitement1, sSuffixeOuUndefined1,
//		oIDPCodeOuProcedure2, pfTraitement2, sSuffixeOuUndefined2,
//		...,
//		oIDPCodeOuProceduren, pfTraitementn, sSuffixeOuUndefinedn
//	]
clWDUtil.DeclareTraitement = function DeclareTraitement(sAliasOriginal, bEstPage, tabTraitements)
{
	var oChampDeclare = this.__oDeclareChampDeclare(sAliasOriginal, bEstPage);

	var nLimiteArgument = tabTraitements.length;
	for (var nArgument = 0; nArgument < nLimiteArgument; nArgument += 3)
	{
		var oIDPCodeOuProcedure = tabTraitements[nArgument];
		var pfTraitement = tabTraitements[nArgument + 1];
		var sSuffixeOuUndefined = tabTraitements[nArgument + 2];
		oChampDeclare.DeclareTraitement(oIDPCodeOuProcedure, pfTraitement, sSuffixeOuUndefined);
	}
};
// - Version avec bSymbolDepuisWLEnV2 (pour le framework V2).
// tabTraitements est un tableau dont les valeurs sont groupés quatre par quatre :
//	[
//		oIDPCodeOuProcedure1, pfTraitement1, sSuffixeOuUndefined1, bSymbolDepuisWLEnV21,
//		oIDPCodeOuProcedure2, pfTraitement2, sSuffixeOuUndefined2, bSymbolDepuisWLEnV22,
//		...,
//		oIDPCodeOuProceduren, pfTraitementn, sSuffixeOuUndefinedn, bSymbolDepuisWLEnV2n,
//	]
clWDUtil.DeclareTraitementEx = function DeclareTraitementEx(sAliasOriginal, bEstPage, tabTraitements)
{
	var oChampDeclare = this.__oDeclareChampDeclare(sAliasOriginal, bEstPage);

	var nLimiteArgument = tabTraitements.length;
	for (var nArgument = 0; nArgument < nLimiteArgument; nArgument += 4)
	{
		var oIDPCodeOuProcedure = tabTraitements[nArgument];
		var pfTraitement = tabTraitements[nArgument + 1];
		var sSuffixeOuUndefined = tabTraitements[nArgument + 2];
		var bSymbolDepuisWLEnV2 = tabTraitements[nArgument + 3];

		// "SymbolDepuisWLEnV2" : indique si le traitement vient de la conversion depuis le WL avec le framework V2 (exploité uniquement par le framework V2 pour le passage des paramètres).
		if (window.NSPCS && bSymbolDepuisWLEnV2)
		{
			pfTraitement[NSPCS.ms_oSymbolDepuisWLEnV2] = true;
		}

		oChampDeclare.DeclareTraitement(oIDPCodeOuProcedure, pfTraitement, sSuffixeOuUndefined);
	}
};

// GP 16/02/2016 : TB96597 : Déclaration des traitements ajouté dynamiquement en code serveur par ..Traitement.
// Format :
//	<oTraitements> =
//	{
//		"Alias champ 1" : [ <IDTraitement 1>, <IDTraitement 2>, ..., <IDTraitement m> ]
//	,	"Alias champ 2" : [ <IDTraitement 1>, <IDTraitement 2>, ..., <IDTraitement m> ]
//		...
//	,	"Alias champ n" : [ <IDTraitement 1>, <IDTraitement 2>, ..., <IDTraitement m> ]
//	}
// Notes :
// - Seuls les traitements ayant un intérêt pour le code navigateur son déclarés (= filtre sur le type du champ et sur le traitement)
// - Seul les champs avec un traitement ajouté dynamiquement et qui respecte le filtre sont ajoutés
// - La page déclare tous les champs y compris les champs des pages internes fusionnées
// - On ne déclare pas les traitements de la page (car le filtre n'en laisse passer aucun
clWDUtil.DeclareSurchargeTraitementServeur = function DeclareSurchargeTraitementServeur(oTraitements)
{
	(this.m_oSurchargeTraitementServeur = oTraitements);
};

// Déclaration des variables d'un champ
// En profite pour instancier les variables de champ
clWDUtil.DeclareVariable = function DeclareVariable(sAliasOriginal, pfCreationVariables)
{
	// Déclare les variables du champ
	this.__DeclareVariables(sAliasOriginal, new pfCreationVariables());

	// Déclare les variables des clones du champ
	var oChampDeclare = this.__oGetChampDeclare(sAliasOriginal);
	if (oChampDeclare)
	{
		this.bForEach(oChampDeclare.tabGetClones(), function(sAliasClone)
		{
			clWDUtil.__DeclareVariables(sAliasClone, new pfCreationVariables());
			return true;
		});
	}
};

// Déclare une variable serveur
// - pfConstructeur: pour les structures ou les date/heure/durée : c'est une fonction qui fait l'appel du constructeur pas simplement le constructeur (permet d'avoir des paramètres)
//	=> function (sValeur) { return xxx sValeur xxx; }
// - 38 = PARTIE_CODEHTML_UNEVARIABLE_V1
// - Le serveur remplace [%ALIASCHAMP..PROP_HTML_38_<Nom variable>%] par un tableau de la forme :
//	=> { "AliasOriginal" : { m_oValeur : <Valeur> }, "AliasClone1" : { m_oValeur : <Valeur clone 1> }, ..., "AliasCloneN" : { m_oValeur : <Valeur clone n> } }
//	(la valeur est optionnel pour les types qui n'en on pas besoin (et particulier les structures)
clWDUtil.DeclareUnVariableServeur = function DeclareUnVariableServeur(sNomVariable, pfConstruction, oValeurs)
{
	var tabNoms = sNomVariable.split(".");

	this.bForEachIn(oValeurs, function(sAlias, oDescription)
	{
		// Création si besoin de this.m_oVariables[sAlias];
		var oVariables = clWDUtil.oGetVariables(sAlias);
		if (undefined === oVariables)
		{
			oVariables = {};
			clWDUtil.m_oVariables[sAlias] = oVariables;
		}

		// Membre de structure : la structure doit déjà être déclarée
		// -1 car on traite différement le dernier nom
		var nLimiteNom = tabNoms.length - 1;
		for (var nNom = 0; nNom < nLimiteNom; nNom++)
		{
			oVariables = oVariables[tabNoms[nNom]];
		}
		oVariables[tabNoms[nNom]] = pfConstruction ? pfConstruction(oDescription.m_oValeur) : oDescription.m_oValeur;
		return true;
	});
};

// Declaration des champs.
clWDUtil.DeclareChamp = function DeclareChamp(sAliasOriginal, sAliasTableZRParentOriginal, sAliasAttributOriginal, pfConstructeursSupplementaires, pfConstructeur, tabParametresSupplementaires, bChampDansHTML, bDansPlanAffiche)
{
	if (pfConstructeur)
	{
		var oChamp = new pfConstructeur(sAliasOriginal, sAliasTableZRParentOriginal, sAliasAttributOriginal, pfConstructeursSupplementaires, tabParametresSupplementaires);

		// GP 19/01/2016 : Si le champ n'est pas dans le HTML : on déclare toujours le champ mais on ne fait pas son initialisation
		// GP 19/01/2016 : Il faudrait mettre ce paramètre dans les paramètres du constructeur => Faire le refactoring un jour
		oChamp.m_bChampDansHTML = bChampDansHTML;
		oChamp.m_bDansPlanAffiche = bDansPlanAffiche;

		// GP 30/10/2015 : QW264436 : Implémentation fausse : on perd nNbParametres pour les clones après le premier. On change le code pour indiquer les colonnes a patcher
		var tabParametresPatch = [];
		if (window["WDChampParametres"] && oChamp instanceof WDChampParametres)
		{
			// - Si le champ a des paramètres et des données, ils sont en position 0 et 1 de tabParametresSupplementaires
			// Modification directement de tabParametresSupplementaires (qui est un tableau déclaré inline dans l'appelant)
			tabParametresPatch = [0, 1];
		}
		else if (window["WDCalendrier"] && oChamp instanceof WDCalendrier)
		{
			// GP 03/11/2015 : QW263486 : Champ calendrier : L'alias du champ de saisie est dans le premier paramètre
			tabParametresPatch = [0];
		}
		else if (window["WDSaisie"] && oChamp instanceof WDSaisie)
		{
			// GP 03/11/2015 : QW263486 : Champ de saisie : l'indication et l'alias du champ calendrier sont dans les deux premiers paramètres
			tabParametresPatch = [0, 1];
		}
		else if (window["WDTable"] && oChamp instanceof WDTable)
		{
			// - Si le champ est une table ou une ZR AJAX, il faut patcher les premier paramètre : sXMLLignes
			tabParametresPatch = [0];
		}

		// GP 19/01/2016 : Si le champ n'est pas dans le HTML : on déclare toujours le champ mais on ne fait pas son initialisation
		// Note : pour les clones : ils ne sont pas déclarés s'ils ont ce flag (cas du champ) et s'il sont invisible donc on n'a pas besoin de gérer le cas
		// Déclare le champ
		this.m_oChamps.DeclareChamp(oChamp);

		// Déclare les clones du champ
		var oChampDeclare = this.__oGetChampDeclare(sAliasOriginal);
		if (oChampDeclare)
		{
			this.bForEach(oChampDeclare.tabGetClones(), function(sAliasClone)
			{
				var oCorrespondanceClone = clWDUtil.__oGetCorrespondanceClone(sAliasClone);

				// GP 30/10/2015 : QW264436 : Implémentation fausse : on perd nNbParametres pour les clones après le premier. On change le code pour indiquer les colonnes a patcher
				clWDUtil.bForEach(tabParametresPatch, function(nParametre)
				{
					tabParametresSupplementaires[nParametre] = oCorrespondanceClone.m_tabParametres[nParametre];
					return true;
				});

				// On est dans une déclaration, pas dans un contexte de champ. Récupère les alias des parent via le contexte du clone (ce qui remonte les parents)
				var sAliasTableZRParentClone;
				var sAliasAttributClone;
				if (sAliasTableZRParentOriginal)
				{
					sAliasTableZRParentClone = oCorrespondanceClone.sGetAliasDeOriginal(sAliasTableZRParentOriginal);
					sAliasAttributClone = oCorrespondanceClone.sGetAliasDeOriginal(sAliasAttributClone) || ("ATT_" + sAliasClone + "_1");
				}
				clWDUtil.m_oChamps.DeclareChamp(new pfConstructeur(sAliasClone, sAliasTableZRParentClone, sAliasAttributClone, pfConstructeursSupplementaires, tabParametresSupplementaires));
				return true;
			});
		}
	}
};

// Initialisation des champs.
clWDUtil.DeclareChampInit = function DeclareChampInit()
{
	// Pour tous les champs : appel de .Init()
	this.m_oChamps.bPourTousChamps(function(sAliasChamp, oObjetChamp)
	{
		// GP 19/01/2016 : Si le champ n'est pas dans le HTML : on déclare toujours le champ mais on ne fait pas son initialisation
		// Le test sur oObjetChamp.m_eValide permet d'autoriser plusieurs appels
		if (1 !== oObjetChamp.m_eValide)
		{
			if (oObjetChamp.m_bChampDansHTML)
			{
				if (oObjetChamp.m_bDansPlanAffiche)
				{
					// GP 25/01/2016 : TB99817/TB101678 ; Ajout d'un try catch pour que une erreur dans un champ ne se propage pas aux autres champs
					try
					{
						oObjetChamp.Init();
					}
					catch (oErreur)
					{
///#DEBUG
						// GP 21/11/2019 : QW320203 : La console n'est pas disponible dans IE en mode HTML 4 si le F12 n'est pas ouvert.
						if (window.console)
						{
							console.error(oErreur);
						}
///#ENDDEBUG
					}
				}
				else
				{
					// Marque le champ comme non présent dans le HTML à cause des plans différés
					oObjetChamp.m_eValide = 2;
				}
			}
			else
			{
				// Marque le champ comme non présent dans le HTML à cause de ..Visible
				oObjetChamp.m_eValide = 3;
			}
		}
		return true;
	});
};

// Initialisation des champs reçu dans un plan différé (des champs déjà présents peuvent être inclus)
clWDUtil.DeclareChampPlanDiffere = function DeclareChampPlanDiffere(tabAliasChamps)
{
	// Notifie les champs de la visibilité
	this.bForEach(tabAliasChamps, function(sAliasChamp)
	{
		var oChamp = clWDUtil.m_oChamps.oGetChampDirect(sAliasChamp);
		if (oChamp)
		{
			oChamp.m_bDansPlanAffiche = true;
		}
		return true;
	});
	// Et déclare les champs pas encore déclaré
	this.DeclareChampInit();
};

//////////////////////////////////////////////////////////////////////////
// Mutation

// Détecteur de mutation
clWDUtil.bDetecteMutation = function bDetecteMutation(oCible, pfCode, pfValideMutation, bActiveDetection, bResultatSiMutationsIndisponibles)
{
	if (bActiveDetection && window["MutationObserver"])
	{
		// Par défaut on ne détecte pas de mutations
		var bMutation = false;
		// La fonction qui sera utilisé pour traiter les mutations
		var CallbackMutations = function(tabMutations, oObserverLocal)
		{
			// Inutile de détecter les mutations une fois que l'on en a détecter une
			if (!bMutation)
			{
				if (!clWDUtil.bForEach(tabMutations, function (oMutation)
				{
					// Si on trouve une mutation valide, on arrete le parcours et donc bForEach retourne false
					return !pfValideMutation(oMutation);
				}))
				{
					// Si on trouve une mutation valide, on arrete le parcours et donc bForEach retourne false
					bMutation = true;
					oObserverLocal.disconnect();
				}
			}
		};

		var oObserver = new MutationObserver(CallbackMutations);
		// Lance l'observation
		oObserver.observe(oCible, { attributes: true, childList: true, characterData: true, subtree: true });

		// Appel du code utilisateur
		pfCode();

		// Fin de l'observation si on n'a pas encore détecter une mutation. Si on a détecter une mutation, l'observation est déjà stoppé
		if (!bMutation)
		{
			// GP 27/03/2017 : Si on ne reçoit aucune modification, on tombe ici ou il manque le dernier paramètre
			CallbackMutations(oObserver.takeRecords(), oObserver);
			if (!bMutation)
			{
				oObserver.disconnect();
			}
		}

		return bMutation;
	}
	else
	{
		// Appel du code utilisateur
		pfCode();

		// Si on ne sait pas détecter les mutations
		return bResultatSiMutationsIndisponibles;
	}
};

//////////////////////////////////////////////////////////////////////////
// Debug

///#DEBUG

// @license http://opensource.org/licenses/MIT
// copyright Paul Irish 2015

// Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
//   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values

// if you want values similar to what you'd get with real perf.now, place this towards the head of the page
// but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed

if (!("performance" in window))
{
	window.performance = {};
}

if (!Date.now)
{
	Date.now = function () // thanks IE8
	{
		return new Date().getTime();
	};
}

if (!("now" in window.performance))
{
	var nowOffset = Date.now();

	if (performance.timing && performance.timing.navigationStart)
	{
		nowOffset = performance.timing.navigationStart;
	}

	window.performance.now = function now()
	{
		return Date.now() - nowOffset;
	};
}


clWDUtil.WDDebug = (function ()
{
	"use strict";

	var __WDDebug =
	{
		// Debug : chronométrage
		m_tabChronoDebut: [],
		ChronoDebut: function ChronoDebut()
		{
			// Stocke le chrono de début
			this.m_tabChronoDebut.push(new Date());
		},
		ChronoFin: function ChronoFin()
		{
			// Retourne la différence de chrono et le supprime
			return (new Date()) - this.m_tabChronoDebut.pop();
		}
	};
	// Branche les fonctions de la console
	clWDUtil.bForEach(["log", "info", "assert"], function(sNomFonctionConsole)
	{
		// Cas pas de console ou pas de fonction
		var fFonctionConsoleWrapper = clWDUtil.m_pfVide;

		// Pas de mise en variable de :
		// - window["console"] : une fois testé on accède directement par console. Evite aussi de mettre une variable de plus dans la closure.
		// - console[sNomFonctionConsole] : Evite de mettre une variable de plus dans la closure. En revanche on a une évaluation à chaque appel de console[sNomFonctionConsole] mais
		// comme on est dans une fonction de débug, cela n'a aucune importance.
		if (window["console"])
		{
			// GP 22/10/2014 : La console ne fonctionne pas en bIEQuirks (le .apply de la méthode est non défini...)
			// GP 19/02/2015 : Il ne fonctionne pas nom plus en IE8- (même hors quirks) : teste instanceof Function à la place de !bIEQuirks
			var fFonctionConsole = console[sNomFonctionConsole];
			if (fFonctionConsole instanceof Function)
			{
				fFonctionConsoleWrapper = function()
				{
					return fFonctionConsole.apply(console, arguments);
				};
			}
		}

		__WDDebug[sNomFonctionConsole] = fFonctionConsoleWrapper;

		return true;
	});

	var tabPileTrace = [];
	__WDDebug.DebutFonction = function (sNomFonction)
	{
		tabPileTrace.push({
			m_sNomFonction: sNomFonction,
			m_nTraceSuivante: 1,
			m_nDebut: window.performance.now()
		});
		this.__TraceFonction(true, false);
	};
	__WDDebug.FinFonction = function ()
	{
		this.__TraceFonction(false, true);
		tabPileTrace.pop();
	};
	__WDDebug.TraceFonction = function (sBranche)
	{
		this.__TraceFonction(false, false, sBranche);
	};
	__WDDebug.__TraceFonction = function (bPourDebut, bPourFin, sBranche)
	{
		var oFonction = tabPileTrace[tabPileTrace.length - 1];

		var nNbEspaces = tabPileTrace.length;
		if (bPourDebut || bPourFin)
		{
			nNbEspaces--;
		}
		var sEspaces = clWDUtil.sCompleteChaine("", nNbEspaces, " ");

		var sSymbole;
		if (bPourDebut)
		{
			sSymbole = ">";
		}
		else if (bPourFin)
		{
			sSymbole = "<";
		}
		else
		{
			sSymbole = String(oFonction.m_nTraceSuivante++);
		}

		var sDuree = " " + String(window.performance.now() - oFonction.m_nDebut);
		if (bPourDebut)
		{
			sDuree = "";
		}

		// GP 21/11/2019 : QW320203 : La console n'est pas disponible dans IE en mode HTML 4 si le F12 n'est pas ouvert.
		if (window.console)
		{
			console.log(sEspaces + sSymbole + " " + oFonction.m_sNomFonction + sDuree + (sBranche ? " (" + sBranche + ")" : ""));
		}
	};

	return __WDDebug;
})();

///#ENDDEBUG
