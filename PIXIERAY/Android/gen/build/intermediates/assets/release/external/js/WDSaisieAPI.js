// WDSaisieAPI.js
/*! 26.0.5.0 */
/*! VersionVI: yyyyyyyyyyyy */

// Attention a ne pas mettre d'accent dans le code, chaines incluses

///#DEBUG=clWDUtil.WDDebug
///#GLOBALS clWDUtil
// pour debug des callbacks WL

function WDSaisieAPI(bEnModeWeb,domIFrame,options)
{
    if (arguments.length)
    {
		//singleton pour WinDev
        WDSaisieAPI.gclSingleton = this;

        // mode web ou WINDEV
        this.m_bModeWeb = !!bEnModeWeb;
        // récuperation de l'iframe evnetuellement un div pour l'édition de la ZTR
        this.m_oIFrame = domIFrame;
        // determine la window a passer en design mode et son document
        this.m_oWindowPrincipale = window;
        this.m_oWindow = domIFrame.contentWindow || window;
        this.m_oDocument = this.m_oWindow.document;
        // mémorise les options
        this.m_oOptions = options || {};


        // element courant : tableau selectionnee
        this.m_oElementCourant = undefined;

        this.m_nNombreDesactivationsEcoute = 0;

        // exporte les méthodes d'instance en méthode de classe sur le singleton
        for (sMethode in WDSaisieAPI.prototype)
        {
            WDSaisieAPI[sMethode] = WDSaisieAPI.prototype[sMethode].bind(WDSaisieAPI.gclSingleton);
        }

        // init par défaut => commenté pour QW#332374
        // remis pour le cas WEBDEV ZTR
        if (!this.m_oIFrame.contentWindow) this.SetProp_Valeur(this.m_oIFrame.innerHTML);
    }
}

WDSaisieAPI.PLANCHE_NB_IMAGES = 52;//ici planche BarreSaisieRiche.svg
WDSaisieAPI.ms_sCodeInitial = "<!DOCTYPE html>\n<html>\n\t<head>\n\t</head>\n\t<body>\n\t\t<p></p>\n\t</body>\n</html>";

WDSaisieAPI.uuidv4 = function uuidv4()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
    {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// appelé en fin d'ini' pour check que tout est OK
WDSaisieAPI.prototype.TestOK = function TestOK() {
    return 1;
}

// passer en mode modificiation ou en sortir
WDSaisieAPI.prototype.Set_designMode = function Set_designMode(mode)
{
    var bDesign =(mode === "on" || mode === "ON" || mode === true);
    this.m_oDocument.designMode = bDesign ? "on" : "off";

    // force span style au lieu de font size
    if (bDesign)
        this.m_oDocument.execCommand("styleWithCSS", false, !this.m_oOptions.bEnModeMail);

};
// exécuter une commande générique (ex : 'copy')
WDSaisieAPI.prototype.execCommand = function execCommand(cmd) {
    this.m_oDocument.execCommand(cmd)
};

WDSaisieAPI.prototype._surInput = function _surInput(domEvent)
{
    var oSelection = this.__oGetSelection();

    if (!oSelection || !oSelection.focusNode || oSelection.focusNode.nodeType!==Node.TEXT_NODE) return;

    this.m_sDerniereValeurHtmlAffectee = undefined; // pour ne plus renvoyer la derniere valeur affectee    

    if (domEvent.inputType === "deleteContentBackward")
    {
        var jqParentFocus = $(oSelection.focusNode.parentElement);
        if (jqParentFocus.length && (jqParentFocus.attr('href')||"").length)
        {
            var oNouvelleRange = this.m_oDocument.createRange();
            oNouvelleRange.selectNode(jqParentFocus.get(0));
            oSelection.removeAllRanges();
            oSelection.addRange(oNouvelleRange);
            this.CMD_SupprimeLien();
            oSelection.collapse(oSelection.focusNode,oSelection.focusNode.textContent.length);
            return;
        }
    }

    if (! (domEvent.inputType === "insertParagraph" || domEvent.data === " ")) return;

    var domNoeudTexteCourant = oSelection.focusNode;
    var nOffset = oSelection.anchorOffset - 1;
    var nTailleSeparateur = 1;
    if (domEvent.inputType === "insertParagraph")
    {
        // il faut remonter au noeud frère précédent à cause du RC qui a créé un nouveau noeud
        domNoeudTexteCourant = oSelection.focusNode.parentElement.previousElementSibling.lastChild;
        nOffset = domNoeudTexteCourant.length;
        nTailleSeparateur = 0;
    }


    var sTexteAvantCurseur = domNoeudTexteCourant.textContent.substr(0,nOffset);
    if (!sTexteAvantCurseur) return;

    var tabMots = sTexteAvantCurseur.split(/(\s|\n)/g);
    if (!tabMots.length) return;

    var sDernierMot = tabMots[tabMots.length-1];
    if (!sDernierMot) return;

    var bCasWWW=false;
    if (sDernierMot.indexOf("://")!==-1 || (bCasWWW=(sDernierMot.indexOf('www.')===0)))
    {
        // cas d'une URL

        var oNouvelleRange = this.m_oDocument.createRange();
        oNouvelleRange.setStart(domNoeudTexteCourant,nOffset - sDernierMot.length);
        oNouvelleRange.setEnd(domNoeudTexteCourant, nOffset);
        oSelection.removeAllRanges();
        oSelection.addRange(oNouvelleRange);

        if (bCasWWW) sDernierMot = "//" + sDernierMot;
        this.CMD_ChangeLien(sDernierMot);

        oNouvelleRange = this.m_oDocument.createRange();
        oNouvelleRange.setStart(oSelection.focusNode.parentElement.nextSibling ||oSelection.focusNode.parentElement.parentElement.nextSibling,nTailleSeparateur);
        oNouvelleRange.setEnd(oSelection.focusNode.parentElement.nextSibling || oSelection.focusNode.parentElement.parentElement.nextSibling,nTailleSeparateur);
        oSelection.removeAllRanges();
        oSelection.addRange(oNouvelleRange);
    }
};

// Indique si on peut corriger la sélection en prise de focus
WDSaisieAPI.prototype.bSelectionACorriger = function bSelectionACorriger() {
    // si aucune selection
    var oSelection = this.__oGetSelection();
    if (!oSelection)
        return true;
    if (oSelection.type == "None")
        return true;
    if (oSelection.type == "Range")
        return false;
    var oRange = this.oGetRange();
    if (!oRange)
        return true;
    if (oRange.startOffset != 0)
        return false; // on est pas au début

    // passer par la sélection WL
    var oSelectionWL = this.GetProp_Selection();
    if (oSelectionWL.debut != 0)
        return false;

    //@Test
    return true;
}

WDSaisieAPI.prototype.CorrigeSelectionSurSetFocus = function CorrigeSelectionSurSetFocus() {
    // si aucune selection
    if (this.bSelectionACorriger()) {
        // on en force une
        this.CMD_Selectionne(0, 0);
    }
}

WDSaisieAPI.prototype.ForceSelectionDansDoc = function ForceSelectionDansDoc()
{
    if (!this.m_oIFrame.contentWindow) return; //seulement pour iframe

    // si on a tout sélectionné y compris la frame qui cotient le document en édition
    var oSelectionWindow = this.m_oWindowPrincipale.getSelection();
    if (oSelectionWindow.containsNode(this.m_oIFrame))
    {
        this._DesactiveEcoute_SelectionChanged();

        // on supprime cette sélection
        // effet de bord : perd le focus (la sélection deviens grise)
        oSelectionWindow.removeAllRanges();
        // on redonne le focus sinon les saisies ne font rien.
        this.m_oIFrame.focus();

        this._ActiveEcoute_SelectionChanged();
    }


};

//callback si modif de la selection
WDSaisieAPI.prototype._onSelectionChanged = function _onSelectionChanged() {
    // pour être notifie des changements de selection en WL
    if (!window.WL) return;

    // anti ré-entance
    if (this.m_bInSelectionChanged) return;
    this.m_bInSelectionChanged = true;

    var oSelection = this.__oGetSelection();

    var oCopieSelection = {};
    var sMembre;
    for (sMembre in oSelection)
    {
        // notifie si la sélection a réellement changé
        if (typeof oSelection[sMembre] === 'function') continue;
        oCopieSelection[sMembre] = oSelection[sMembre];
    }
    for (sMembre in oCopieSelection)    
    {
        if (!this.m_oSelectionPrecedente || this.m_oSelectionPrecedente[sMembre]===undefined || (oSelection[sMembre] != this.m_oSelectionPrecedente[sMembre]))
        {
            this.m_oSelectionPrecedente = $.extend({},oCopieSelection);
            if (this.m_nTimerSELECTIONCHANGE) clearTimeout(this.m_nTimerSELECTIONCHANGE);
            this.m_nTimerSELECTIONCHANGE = setTimeout( () => WL.Execute(this.sGetWLEXEC('WLEXEC_SELECTIONCHANGE'), '') , 300);
            break;
        }
    }
    this.m_oSelectionPrecedente = oCopieSelection;
    this.m_bInSelectionChanged = false;
}
// activer la notification des changements de selection
WDSaisieAPI.prototype._ActiveEcoute_SelectionChanged = function _ActiveEcoute_SelectionChanged() {
    --this.m_nNombreDesactivationsEcoute;
    if (!this._AutoriseEcoute_SelectionChanged()) return;

    // Lancer l'observation
    !this.m_oObserver || this.m_oObserver.observe(this.m_oDocument, {
        attributes: false, childList: true, subtree: true, characterData: true
    });
    // écoute la saisie pour faire de l'assistance à la frappe
    this.m_oDocument.body.addEventListener('input',this._surInput.bind(this));
    this.m_oDocument.addEventListener('selectionchange', this._onSelectionChanged.bind(this));
};
// désactiver la notification des changements de selection
WDSaisieAPI.prototype._DesactiveEcoute_SelectionChanged = function _DesactiveEcoute_SelectionChanged() {
    ++this.m_nNombreDesactivationsEcoute;

    // débranche
    !this.m_oObserver || this.m_oObserver.disconnect(); // undefiend en cas du 1er appel à SetValeur
    this.m_oDocument.body.removeEventListener('input',this._surInput.bind(this));
    this.m_oDocument.removeEventListener('selectionchange', this._onSelectionChanged.bind(this));
};
WDSaisieAPI.prototype._AutoriseEcoute_SelectionChanged = function _AutoriseEcoute_SelectionChanged() {
    return this.m_nNombreDesactivationsEcoute === 0;
};

// renvoyer le document édité pour ExecuteJS() / EditeurHtmlRecupereDocument()
WDSaisieAPI.prototype.GetDocument = function GetDocument() {
    return this.m_oDocument;
};
// Executer du JS dans le contexte du doc édition. pour EditeurHtmlExecuteJS()
WDSaisieAPI.prototype.ExecuteJSDansContexte = function ExecuteJSDansContexte(sCodeJS) {
    return this.m_oWindow.eval(sCodeJS);
};

// Affecter ..Valeur
WDSaisieAPI.prototype.SetProp_Valeur = function SetProp_Valeur(html_string, bIgnoreCss)
{
    this._DesactiveEcoute_SelectionChanged();

    if (this.m_oIFrame.contentWindow)
    {
        this.m_oDocument.open();
        this.m_oDocument.write(html_string||WDSaisieAPI.ms_sCodeInitial);
        this.m_oDocument.close();
        //  on garde la valeur pour la renvoyer tant qu'il n'y a pas de modif
        this.m_sDerniereValeurHtmlAffectee = html_string;
        // si l'affectaion a déduit le documennt, cas ou html_string=="\n" par ex.
        if (!this.m_oDocument) {
            this.m_oDocument.open();
            this.m_oDocument.write(WDSaisieAPI.ms_sCodeInitial);
            this.m_oDocument.close();
            this.m_sDerniereValeurHtmlAffectee = undefined;
        }
    }
    // cas édition ZTR
    else
    {
        this.m_oIFrame.innerHTML = html_string||WDSaisieAPI.ms_sCodeInitial;
    }

    // force le charset en utf-8
    Array.prototype.forEach.call(document.getElementsByTagName("meta"), function (meta)
    {
        //<meta charset="utf-8">
        if (meta.getAttribute("charset"))
        {
            meta.setAttribute("charset", "utf-8");
        }
        //<meta http-equiv="content-type" content="text/html; charset=iso-8859-1">
        if ((meta.getAttribute("http-equiv")||"").toLowerCase() == "content-type")
        {
           meta.setAttribute("content", meta.getAttribute("content").split(";").filter(part => part.toLowerCase().indexOf("charset") == -1).join(";"));
        }
    });

    // par défaut en mode modificiation
    if (this.m_bModeWeb) //QW#332381
    {
        this.Set_designMode(true);
    }

    // code css à importer
    this.m_tabBaliseCssAjoutee = undefined;
    if (!bIgnoreCss && this.m_oOptions && this.m_oOptions.domStyleCommun) {

        // style commun WB WD
        var tabBalisesStyle = clWDUtil.isArray(this.m_oOptions.domStyleCommun) ? this.m_oOptions.domStyleCommun : [this.m_oOptions.domStyleCommun];
        // style forcé
        var domStyle = this.m_oDocument.createElement("style");
        domStyle.innerHTML = "::selection { color:inherit; background:rgba(0,0,0,0.22); }";
        tabBalisesStyle.push(domStyle);

        //indique la couleur de fond pour les mini barres
        var oStylePalette = this.m_oWindow.getComputedStyle( this.m_oDocument.body );
        var tabRgbTexte = clWDUtil.tabHTML2RVBA(oStylePalette.color);
        var tabRgbFond = clWDUtil.tabHTML2RVBA(oStylePalette.backgroundColor);
        var sCouleurSurvol = "rgba("+tabRgbTexte[0]+", "+tabRgbTexte[1]+", "+tabRgbTexte[2]+", 0.15)";
        // var sCouleurActif = "rgba("+tabRgbTexte[0]+", "+tabRgbTexte[1]+", "+tabRgbTexte[2]+", 0.25)";
        var domStyleBarre = this.m_oDocument.createElement("style");
        domStyleBarre.innerHTML = ".wbSaisieRicheBarre{ "
        + "background-color:" + (tabRgbFond[3]===0 ? 'white' : oStylePalette.backgroundColor) +";"
        + "border-color:" + oStylePalette.borderColor +";"
        +"}"
        +".wbBarreOutilsMiniBarreLi:hover{background-color:" + sCouleurSurvol +";}"
        tabBalisesStyle.push(domStyleBarre);
        // ajout les balises de style
        this.m_tabBaliseCssAjoutee = tabBalisesStyle.concat(clWDUtil.isArray(this.m_oOptions.domStyleCommun) ? this.m_oOptions.domStyleCommun : [this.m_oOptions.domStyleCommun]);
        this._RemetStyleInterne(true);
    }

    // blindage anti selection de tout dans la page hote
    if (!this.m_bModeWeb)
    {
        window.document.onselectionchange = () => { this.ForceSelectionDansDoc(); };
    }

    // avec gestion des images, tables...
    this.__InitGestionJS();

    // pour avoir une sélectionn non vide -QW#331823
    this.CMD_Selectionne(0, 0);
    // pour être notifie de chaque modification du DOM
    if (window.WL) this.m_oObserver = new MutationObserver((mutationsList, observer) => {
        // jamais de réentrance
        // this._DesactiveEcoute_SelectionChanged();

        // Callback execute lorsque l'observateur voit des modifications
        var bIgnoreSizzle = false;
        for(iMutation in mutationsList)
        {
            if (!mutationsList[iMutation]) continue;
            if (mutationsList[iMutation].type !== 'childList') continue;

            // aide à l'indentation
            for(var iAjout=0; iAjout<(mutationsList[iMutation].addedNodes||[]).length; ++iAjout)
            {
                if (!mutationsList[iMutation].addedNodes[iAjout]) continue;
                if (mutationsList[iMutation].addedNodes[iAjout].nodeType!==Node.ELEMENT_NODE) continue;

                // considère seulement ces nouveaux noeuds ci
                var bIndente = false;
                var sNomBalise = mutationsList[iMutation].addedNodes[iAjout].tagName.toLowerCase();
                switch( sNomBalise )
                {
                    case 'table':
                    case 'td':
                    case 'tr':
                    case 'th':
                    case 'p':
                    case 'div':
                    case 'ul':
                    case 'ol':
                    case 'li':
                    case 'dl':
                    case 'dt':
                    case 'dd':
                        bIndente = true;
                        break;
                    default:
                            ;
                }
                if (bIndente)
                {
                    var domNouvelleBaliseQuiVaEtreIndentee = mutationsList[iMutation].addedNodes[iAjout];
                    // par défaut indente juste d'un RC
                    var sIndentation = "\n";
                    // remet la même indentation que le parent + 1 TAB
                    if (domNouvelleBaliseQuiVaEtreIndentee.parentElement && domNouvelleBaliseQuiVaEtreIndentee.parentElement.previousSibling && domNouvelleBaliseQuiVaEtreIndentee.parentElement.previousSibling.nodeType ==  Node.TEXT_NODE)
                    {
                        if (domNouvelleBaliseQuiVaEtreIndentee.parentElement.previousSibling.textContent.replace(/[\r\n\t\s]/g,'').length === 0)
                        {
                            sIndentation = domNouvelleBaliseQuiVaEtreIndentee.parentElement.previousSibling.textContent + "\t";
                        }
                    }
                    if (domNouvelleBaliseQuiVaEtreIndentee.parentElement && domNouvelleBaliseQuiVaEtreIndentee.parentElement.insertBefore)
                    {
                        this._DesactiveEcoute_SelectionChanged();
                        domNouvelleBaliseQuiVaEtreIndentee.parentElement.insertBefore(this.m_oDocument.createTextNode(sIndentation),  domNouvelleBaliseQuiVaEtreIndentee);
                        this._ActiveEcoute_SelectionChanged();
                    }
                }
            }

            var tabNodes =  mutationsList[iMutation].addedNodes || mutationsList[iMutation].removedNodes;
            if (!tabNodes) continue;
            for(iNode in tabNodes)

            if (tabNodes[iNode] && tabNodes[iNode].outerHTML)
            {
                if (!tabNodes[iNode].parentElement || tabNodes[iNode].outerHTML.indexOf("sizzle")>-1)
                {
                    // ignore les noeux créés de toute pièce pour que Sizzle gère les compat de navigateur poru jQuery
                    bIgnoreSizzle=true;
                    break;
                }
            }
        }
        if (bIgnoreSizzle) return;
        this.m_sDerniereValeurHtmlAffectee = undefined;
        WL.Execute("htmlchange", '');

        // pour être notifie des changements de selection
        // this._ActiveEcoute_SelectionChanged();
    });
    // pour être notifie des changements de selection
    this._ActiveEcoute_SelectionChanged();

    // pour être notitifie de la fin du chargement
    // a faire immédiatement pour QW#332585
    if (window.WL) WL.Execute(this.sGetWLEXEC('WLEXEC_ONLOAD'), '');
};

// init contenu HTML si vide
WDSaisieAPI.prototype.SetDocumentDefaut = function SetDocumentDefaut(color, background, scheme) {
    this.SetProp_Valeur("<html><body style='font-family: Arial,Helvetica,sans-serif;'>\n</body></html>");
    this.m_oDocument.documentElement.style.color = color
    this.m_oDocument.documentElement.style.backgroundColor = background
    if (scheme && !color && !background) {
        var style = this.m_oDocument.createElement("style");
        style.innerHTML = " @media(prefers-color-scheme: dark) { html  { background: black; color: white; } } @media(prefers-color-scheme: light) { html  { color: black; background: white; } }";
        this.m_oDocument.head.insertBefore(style,this.m_oDocument.head.firstElementChild);
    }
};

// init de la selection pour avoir le caret visible
WDSaisieAPI.prototype.InitSelection = function InitSelection() {

    // on le focus (nécessaire)
    this.m_oIFrame.focus();

    // rebond sur la sélection / ..curseur  - QW#331829
    this.CMD_Selectionne(0, 0);
};

WDSaisieAPI.prototype._RetireStyleInterne = function _RetireStyleInterne() {

    this._DesactiveEcoute_SelectionChanged();

    // enlever le style css mis pour l'édition ders images / de la sélection
    if (this.m_tabBaliseCssAjoutee) {
        clWDUtil.bForEach(this.m_tabBaliseCssAjoutee, function (domBalise) {
            domBalise.remove();
            return true;
        });
    }

    // retire les mini barres
    if (window.$)
    {
        var document = this.m_oDocument;
        var jqBody = $(document.body);
        jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
    }

    this._ActiveEcoute_SelectionChanged();
};


WDSaisieAPI.prototype._RemetStyleInterne = function _RemetStyleInterne(bForceSansCache) {
    if (!this.m_tabBaliseCssAjoutee || !this.m_tabBaliseCssAjoutee.length) return;
    this._DesactiveEcoute_SelectionChanged();
    for(var iStyle=this.m_tabBaliseCssAjoutee.length-1; iStyle>=0; --iStyle)
    {
        var domBalise = this.m_tabBaliseCssAjoutee[iStyle];
        if (bForceSansCache)
        {
            // force le contenu a etre unique sinon CEF n'interprete plus le styles apres un SetProp_Valeur
            if (domBalise.href) {
                domBalise.href += "?" + Math.random(1,999);
            }
            else {
                domBalise.innerHTML += ".truc" + (Math.random(1,999)+"").replace(/\./g,"") + "{ will-change:opacity; }";
            }
        }
        this.m_oDocument.head.insertBefore(domBalise,this.m_oDocument.head.firstElementChild);
    }
    this._ActiveEcoute_SelectionChanged();
};


WDSaisieAPI.prototype.GetProp_Valeur = function GetProp_Valeur() {
    // si pas de modif on renvoie la valeur afffectée
    if (this.m_sDerniereValeurHtmlAffectee)
        return this.m_sDerniereValeurHtmlAffectee;

    this._DesactiveEcoute_SelectionChanged();

    // enlever le style css mis pour l'édition ders images / de la sélection
    this._RetireStyleInterne();

    sSauveAttrClass = function (domBalise)
    {
        var jqBalise = $(domBalise);
        var sClass = jqBalise.attr("class") || "";
        if ( jqBalise.attr("class", sClass.split(" ").filter(function (s) { return s.indexOf("wbSaisieRiche") === -1; }).join(" ")).attr("class") == "" )
        {
            jqBalise.removeAttr("class");
        }
        return sClass;
    };

    var sClassBody = sSauveAttrClass(this.m_oDocument.body);
    var sClassHTML = sSauveAttrClass(this.m_oDocument.documentElement);

    $(this.m_oDocument.getElementsByTagName("span")).each(function()
    {
        if (this.innerHTML.charCodeAt(0) === 8203)
            this.innerHTML = this.innerHTML.substr(1);
        if (this.innerHTML.length === 0)
            this.remove();
    });

    // html sans les espaces sans largeur
    var sHtmlComplet = this.m_oDocument.documentElement.outerHTML.replace(/\u200b/g,'');//<=>&#8203

    // on remet les balises de style
    this._RemetStyleInterne();

    $(this.m_oDocument.documentElement).attr("class", sClassHTML);
    $(this.m_oDocument.body).attr("class", sClassBody);

    this._ActiveEcoute_SelectionChanged();
    
    return sHtmlComplet;
};
WDSaisieAPI.prototype.GetProp_ValeurBody = function GetProp_ValeurBody() {
    return this.m_oDocument.body.outerHTML;
};
WDSaisieAPI.prototype.GetProp_ValeurPlain = function GetProp_ValeurPlain() {
    /// utiliser textContent pour être en phase avec le toSting() ?
    return this.m_oDocument.body.innerText;
};

// Affecter ..Body
WDSaisieAPI.prototype.SetProp_ValeurBody = function SetProp_ValeurBody(html_string) {
    this.m_oDocument.body.outerHTML = html_string;
};

WDSaisieAPI.prototype.CMD_RemoveClass = function CMD_RemoveClass(sClass) {
    this.CMD_ChangeStyle((elem) => {
        $(elem).removeClass(sClass);
    });
};
WDSaisieAPI.prototype.CMD_RemoveClass_Filter_StartWith = function CMD_RemoveClass_Filter_StartWith(sClass) {
    this.CMD_ChangeStyle((elem) => {
        elem.classList.forEach(
            function (value, key, listObj) {
                if (value.toString().startsWith(sClass)) { listObj.remove(sClass); }
            }
        );
    });
};
WDSaisieAPI.prototype.CMD_AddAttribute= function CMD_AddAttribute(sAtt,sVal) {
    this.CMD_ChangeStyle((elem) => {
        $(elem).attr(sAdd,sVal);
    });
}

WDSaisieAPI.prototype.CMD_CaretMemoireOuCommandRange = function CMD_CaretMemoireOuCommandRange(sCommandeRange,fCaret,bPrefererFrere)
{
    var oSelection = this.__oGetSelection();
    if (oSelection.type === "Caret")
        this.CMD_ChangeStyle(fCaret,true,bPrefererFrere);
    else
        this.m_oDocument.execCommand(sCommandeRange);
};

// Fonctions
WDSaisieAPI.prototype.CMD_SetFocus = function CMD_SetFocus() { this.m_oDocument.documentElement.focus(); };
WDSaisieAPI.prototype.CMD_Imprimer = function CMD_Imprimer() { window.print(); };
// Commandes simple de la barre/du ruban
WDSaisieAPI.prototype.CMD_Gras = function CMD_Gras()
{
    var bActifAvant = this.GetProp_Selection(true);
    if (bActifAvant) bActifAvant = !!bActifAvant.style.police.gras;
    this.CMD_CaretMemoireOuCommandRange('bold',(elem) => {
        elem.style.fontWeight = bActifAvant ? 'normal' : 'bold';
    });
};
WDSaisieAPI.prototype.CMD_Italique = function CMD_Italique()
{
    var bActifAvant = this.GetProp_Selection(true);
    if (bActifAvant) bActifAvant = !!bActifAvant.style.police.italique;
    this.CMD_CaretMemoireOuCommandRange('italic',(elem) => {
        elem.style.fontStyle = bActifAvant ? 'normal' : 'italic';
    });
};
WDSaisieAPI.prototype.CMD_Souligne = function CMD_Souligne()
{
    var bActifAvant = this.GetProp_Selection(true);
    var sNormal = "none";
    if (bActifAvant)
    {
        sNormal = bActifAvant.style.police.barre ? "line-through " : "";
        bActifAvant = !!bActifAvant.style.police.souligne;
    }
    this.CMD_CaretMemoireOuCommandRange('underline',(elem) => {
        elem.style.textDecoration = bActifAvant ? (sNormal||"none") : sNormal+"underline";
    },true); //préfère créer un frère car sinon on ne peut pas retirer la décoration
};
WDSaisieAPI.prototype.CMD_Barre = function CMD_Barre()
{
    var bActifAvant = this.GetProp_Selection(true);
    var sNormal = "";
    if (bActifAvant)
    {
        sNormal = bActifAvant.style.police.souligne ? "underline " : "";
        bActifAvant = !!bActifAvant.style.police.barre;
    }
    this.CMD_CaretMemoireOuCommandRange('strikethrough',(elem) => {
        elem.style.textDecoration = bActifAvant ? (sNormal||"none")  : sNormal+"line-through";
    },true); //préfère créer un frère car sinon on ne peut pas retirer la décoration
};

WDSaisieAPI.prototype.CMD_Exposant = function CMD_Exposant() {

    // cas particulier ou la sélection est a la fin
    var oSelection = this.__oGetSelection();
    if (this.bSelectionEstALaFin(oSelection)) {
        // si la sélection est de style "expostant"
        var selWL = this.GetProp_Selection(true);
        if (selWL.style.police.exposant) {
            //@contournement
            // ajouter un élément invisible a la fin du duc
            var newSpan = this.m_oDocument.createElement("span");
            newSpan.innerHTML = "\u200B";
            //this.m_oDocument.body.innerHTML = this.m_oDocument.body.innerHTML + "<span>\u200B</span>";
            var dernierElement = this.m_oDocument.body.lastChild;
            if (dernierElement && dernierElement.tagName == "DIV") // pour eviter un RC abusif
                dernierElement.appendChild(newSpan);
            else
                this.m_oDocument.body.appendChild(newSpan);
            // aller a la fin
            oSelection.selectAllChildren(this.m_oDocument.body);
            oSelection.collapseToEnd();
            return;
        }
    }

    this.m_oDocument.execCommand('superscript');
 };
WDSaisieAPI.prototype.CMD_Indice = function CMD_Indice()                               { this.m_oDocument.execCommand('subscript') };
WDSaisieAPI.prototype.CMD_AligneGauche = function CMD_AligneGauche() {
    // contournement d'un pb de CEF si un div a un alignement de défini
    var oRange = this.oGetRange();
    if (oRange && oRange.commonAncestorContainer && oRange.commonAncestorContainer.querySelectorAll) {
        // recup des div dans la selectionn
        var tabDiv = oRange.commonAncestorContainer.querySelectorAll("div");
        tabDiv.forEach(function (elem) {
            if (elem.style && elem.style.textAlign)
                elem.style.textAlign = ''; // aucun = left
        });
    }
    // commande standard
    this.m_oDocument.execCommand('justifyLeft')
};
WDSaisieAPI.prototype.CMD_AligneCentre = function CMD_AligneCentre()                    { this.m_oDocument.execCommand('justifyCenter') };
WDSaisieAPI.prototype.CMD_AligneDroite = function CMD_AligneDroite()                    { this.m_oDocument.execCommand('justifyRight') };
WDSaisieAPI.prototype.CMD_AligneJustifie = function CMD_AligneJustifie()                { this.m_oDocument.execCommand('justifyFull') };
WDSaisieAPI.prototype.CMD_AugmenteRetrait = function CMD_AugmenteRetrait()              { this.m_oDocument.execCommand('indent') };
WDSaisieAPI.prototype.CMD_DiminueRetrait = function CMD_DiminueRetrait()                { this.m_oDocument.execCommand('outdent') };
WDSaisieAPI.prototype.CMD_ChangeCouleurTexte = function CMD_ChangeCouleurTexte(couleur) {
    this.m_oDocument.execCommand('foreColor', false, couleur);
};
WDSaisieAPI.prototype.CMD_ChangeCouleurFondTexte = function CMD_ChangeCouleurFondTexte(couleur)
{
    // this.CMD_ChangeStyle((elem) => {
    //     if (couleur == -1) {
    //         // si il y a une couleur de fond
    //          if (elem.style && elem.style.backgroundColor) {
    //             elem.style.backgroundColor = '';
    //         }
    //     }
    //     else {
    //         elem.style.backgroundColor = couleur;
    //     }
    // },true);
    // this.m_sDerniereValeurHtmlAffectee = undefined;
    //Note : pose des problèmes sur le fils direct de body
    // mais CMD_ChangeStyle a encore des problèmes

    var sCouleurTransparente = "transparent";
    var oSelection = this.__oGetSelection();
    if (couleur=="-1" && oSelection.type === "Caret")
    {
        // force à agir sur une balise car transparent continue dans la balise précédente au lieu d'en créer une nouvelle
        sCouleurTransparente = "rgba(0, 0, 0, 0.01)";
        // rectifiera la couleur à la première modification à l'intérieur de cette balise qui sera créée
        var oObserverTransparent = new MutationObserver((mutationsList, observer) => {
            for(var iMutation=0; iMutation<mutationsList.length; ++iMutation)
            {
                for(var iAjout=0; iAjout<(mutationsList[iMutation].addedNodes||[]).length; ++iAjout)
                {
                    if (!mutationsList[iMutation].addedNodes[iAjout]) continue;
                    if (!mutationsList[iMutation].addedNodes[iAjout].style) continue;
                    if (mutationsList[iMutation].addedNodes[iAjout].style.backgroundColor===sCouleurTransparente)
                    {
                        observer.disconnect();
                        var domBaliseFocus = mutationsList[iMutation].addedNodes[iAjout];
                        domBaliseFocus.style.backgroundColor = "transparent";
                        return;
                    }
                }
            }
        });
        oObserverTransparent.observe(this.m_oDocument, {
            attributes: false, childList: true, subtree: true, characterData: true
        });
        // le changement de sélection annule la création de la balise
        var fEcouteChangementSelectionPourCouleurTransparente = () => {
            oObserverTransparent.disconnect();
            this.m_oDocument.removeEventListener('selectionchange', fEcouteChangementSelectionPourCouleurTransparente);
        };
        this.m_oDocument.addEventListener('selectionchange', fEcouteChangementSelectionPourCouleurTransparente);
    }

    var sBg =  this.m_oDocument.body.style.backgroundColor;
    this.m_oDocument.execCommand('hiliteColor', false, couleur=="-1" ? sCouleurTransparente : couleur);
    if (sBg !== this.m_oDocument.body.style.backgroundColor)
    {
        this.m_oDocument.body.style.backgroundColor = sBg;
        this.m_oDocument.body.innerHTML = '<span style="background-color:' + couleur + '">' + this.m_oDocument.body.innerHTML + '</span>';
    }
};
WDSaisieAPI.prototype.CMD_ChangeCouleurFondDoc = function CMD_ChangeCouleurFondDoc(couleur) {
    if (couleur == -1)
        couleur = undefined;
    this.m_oDocument.body.style.backgroundColor = couleur
    // QW#331734
    this.m_sDerniereValeurHtmlAffectee = undefined;
};
// si on est dans un lien  on le sélectionne completement, pour QW#332407
WDSaisieAPI.prototype.SelectionneLienParent = function SelectionneLienParent() {
    // récup de la sélection
    var oSelection = this.__oGetSelection();
    var range_0;
    var selParent;
    if (oSelection.type != "None") {
        range_0 = oSelection.getRangeAt(0);
        selParent = range_0.commonAncestorContainer;
    }
    if (!range_0) return;

    elemParent = range_0.startContainer;
    while (elemParent) {
        if (elemParent.tagName == "A") {
            // on sélectionne le lien  
            oSelection.selectAllChildren(elemParent);
            return;
        }
        elemParent = elemParent.parentElement;
    }
}

WDSaisieAPI.prototype.CMD_ChangeLien = function CMD_ChangeLien(url)  {
    this.SelectionneLienParent(); 
    this.m_oDocument.execCommand('createLink', false, url);
    this.m_sDerniereValeurHtmlAffectee = undefined;
};
WDSaisieAPI.prototype.CMD_SupprimeLien = function CMD_SupprimeLien() {
    this.SelectionneLienParent();
    this.m_oDocument.execCommand('unlink');
    this.m_sDerniereValeurHtmlAffectee = undefined;
};

WDSaisieAPI.prototype.CMD_AugmenteTaillePolice = function CMD_AugmenteTaillePolice() {
    this.CMD_ChangeStyle((elem) => {
        oStyleEffectif = this.oGetCurrentStyle(elem);
        var nTaille = parseInt(oStyleEffectif.fontSize);
        if (nTaille < 14)
            nTaille += 1;
        else
            nTaille += 2;
        elem.style.fontSize = nTaille + "px"
    },true);

};
WDSaisieAPI.prototype.CMD_DiminueTaillePolice = function CMD_DiminueTaillePolice() {
    this.CMD_ChangeStyle((elem) => {
        oStyleEffectif = this.oGetCurrentStyle(elem);
        var nTaille = parseInt(oStyleEffectif.fontSize);
        if (nTaille <= 4) return;
        if (nTaille < 14)
            nTaille -= 1;
        else
            nTaille -= 2;
        elem.style.fontSize = nTaille + "px"
    },true);
};
WDSaisieAPI.prototype.CMD_ChangeNomPolice = function CMD_ChangeNomPolice(nom) { this.m_oDocument.execCommand('fontName', false, nom) };


WDSaisieAPI.prototype.CMD_CreePuceAvecNumero = function CMD_CreePuceAvecNumero() { this.m_oDocument.execCommand('insertOrderedList') };
WDSaisieAPI.prototype.CMD_CreePuceSansNumero = function CMD_CreePuceSansNumero() { this.m_oDocument.execCommand('insertUnorderedList') };

WDSaisieAPI.prototype.CMD_AddClass = function CMD_AddClass(sClass) {
    this.CMD_ChangeStyle((elem) => {
        $(elem).addClass(sClass);
    });
};


WDSaisieAPI.prototype.CMD_GetTexteSelection = function CMD_GetTexteSelection() {
    // récup de la sélection
    var oSelection = this.__oGetSelection();
    // récup du texte plain de la sélection
    var sTexte = oSelection.toString();
    return sTexte;
};

WDSaisieAPI.prototype.Set_VerifieOrthographe = function Set_VerifieOrthographe() {
    this.m_oDocument.documentElement.spellcheck = "false";
};


// FAA : Copier la sélection vers le presse-papier
WDSaisieAPI.prototype.CMD_Copier = function CMD_Copier() {
    this.m_oDocument.execCommand("copy")
}
// FAA : Couper la sélection vers le presse-papier
WDSaisieAPI.prototype.CMD_Couper = function CMD_Couper() {
    this.m_oDocument.execCommand("cut")
}
// FAA : Coller le contenu du texte plain dans la sélection
WDSaisieAPI.prototype.CMD_Coller = function CMD_Coller(texteAColler) {
        // récup de la sélection
    var oRange = this.oGetRange();

    oRange.deleteContents()
    newNode = document.createTextNode(texteAColler);
    oRange.insertNode(newNode)
    if (oRange.select) {
        oRange.select();
        oRange.collapse(false);
        oRange.scrollIntoView();
    }
};
// FAA : Coller un contenu html dans la sélection
WDSaisieAPI.prototype.CMD_CollerHtml = function CMD_CollerHtml(texteHtmlAColler) {

    // pour avoir le undo/redo + QW#329340
    this.CMD_InsereHtml(texteHtmlAColler);
};

// Récupère l'objet sélection
WDSaisieAPI.prototype.__oGetSelection = function __oGetSelection() {
    // Si le champ n'est pas visible (cellule masque qui sera affiche par CelluleAfficheDialogue) : defaultView est null
    var oDefaultView = this.m_oDocument.defaultView;
    // GP 07/11/2015 : TB94777 : Bizarrement document.defaultView.getSelection n'existe pas dans EDGE mais document.getSelection qui normalement juste un alias existe :
    // - Garde le même ordre (document.defaultView.getSelection en premier)
    // - Ajout d'une utilisation de document.getSelection
    if (oDefaultView && oDefaultView.getSelection) {
        return oDefaultView.getSelection();
    }
    else if (this.m_oDocument.getSelection) {
        return this.m_oDocument.getSelection();
    }
    else {
        return undefined;
    }
};
// Recupere la selection
WDSaisieAPI.prototype.oGetRange = function oGetRange() {
    // Si le champ n'est pas visible (cellule masque qui sera affiche par CelluleAfficheDialogue) : defaultView est null
    var oSelection = this.__oGetSelection();
    if (oSelection && oSelection.rangeCount) {
        return oSelection.getRangeAt(0);
    }
    return null;
};
// Trouve le current style d'un champ
WDSaisieAPI.prototype.oGetCurrentStyle = function oGetCurrentStyle(oElement, bFusionneStyleParent) {
    var foGetCurrentStyle = () => {
        // Recupere l'element en demandant l'element externe
        // Code pour IE en mode quirks
        if (oElement.currentStyle) {
            return oElement.currentStyle;
        }
        // FF/Opera/Safari/IE11
        // GP 10/12/2013 : Il faut tester d'abord oElement.defaultView car si oElement est un document, oElement.ownerDocument est NULL.
        // Et si en plus on est dans le cas de l'IFrame du champ de saisie riche, le window courant n'est pas celui de l'élément
        var oFenetre = oElement.defaultView || (oElement.ownerDocument || this.m_oDocument).defaultView;
        // Applique la methode depuis la fenetre du document
        // GP 10/12/2013 : Sauf qu'il faut la fenêtre de l'élément
        if (oFenetre.getComputedStyle) {
            // SI le noeud est un neoud texte
            if (oElement.nodeName == '#text') {
                oElement = oElement.parentNode;
            }
            try {
                var oStyleEffectif = oFenetre.getComputedStyle(oElement, null);
                return oStyleEffectif;
            }
            catch (e) {
                return {}; // blindags
            }
        }
        // Si on n'a pas de résultat on retourne un truc valide pour ne pas avoir d'erreur JS
        return {};
    };
    var oCurrentStyle = foGetCurrentStyle();
    // MAJ selon le style du parent si demandé
    if (bFusionneStyleParent) {
        // OPTIM QW#332461 : on fait au max 1 copie
        var oStyleCopie = $.extend({}, oCurrentStyle);
        this.MAJStyleSelonParentR(oStyleCopie, oCurrentStyle)
        return oStyleCopie;
    }
    return oCurrentStyle;
}

// Trouve le current style d'un champ, version interne récursive
WDSaisieAPI.prototype.MAJStyleSelonParentR = function MAJStyleSelonParentR(oElement, oCurrentStyle_INOUT ) {
    
    if (oElement.parentElement && Element.parentElement != this.m_oDocument.body)
    {
        // fond transparent ?
        var bFondTransparent = (this._nGetAlphaColor(oCurrentStyle_INOUT.backgroundColor) === 0); 
        //   souligné barré ?
        var bSouligneIndetermine = (oCurrentStyle_INOUT.textDecorationLine === "none");
        // si tout est déterminé, rien a faire
        if (!bFondTransparent && !bSouligneIndetermine)
            return;
        
        // récup style parent (non récursif)
        var oStyleParent = oGetCurrentStyle(oElement.parentElement, false);
        // Si fond transparent a mettre a jour et que le parent en a un
        if (bFondTransparent && this._nGetAlphaColor(oStyleParent.backgroundColor) !== 0) {
            oCurrentStyle_INOUT.backgroundColor = oStyleParent.backgroundColor;
            bFondTransparent = false;
        }
        // Si souligné barré  a mettre a jour et que le parent en a un
        if (bSouligneIndetermine && oStyleParent.textDecorationLine !== "none") {
            oCurrentStyle_INOUT.textDecorationLine = oStyleParent.textDecorationLine;
            bSouligneIndetermine = false;
        }
        // si tout est déterminé, rien a faire
        if (!bFondTransparent && !bSouligneIndetermine)
            return;
        
        // récursif avec le style du parent
        MAJStyleSelonParentR(oElement.parentElement, oCurrentStyle_INOUT);
    }

};

WDSaisieAPI.prototype.CMD_ChangeTaillePolice = function CMD_ChangeTaillePolice(taille) {
    this.CMD_ChangeStyle( (elem) => {
        elem.style.fontSize = taille;
    },true);
};

WDSaisieAPI.prototype.EmpileUndoRedo = function EmpileUndoRedo(jqBalise,fCallbackAction,fCallbackApresRedo)
{
    this.m_bUndoRedoEnCours=true; // évite la ré entrance dans la sélection d'élément lors du insertHTML

    var selPrecedente = this.saveSelection();
    var domBalise = jqBalise[0];
    domBalise.classList.add('wbEmpileUndoRedo');
    var precedentHTML = domBalise.outerHTML;
    

    var bResultat = fCallbackAction();

    if (bResultat && domBalise.parentElement) // blindage car outerHTML ne se modifie que si parentElement
    {
        var oSelection = this.__oGetSelection();
        var oNouvelleRange = this.m_oDocument.createRange();
        oSelection.removeAllRanges();

        domBalise.classList.remove('wbEmpileUndoRedo');
        var nouveauHTML = domBalise.outerHTML;
        domBalise.classList.add('wbEmpileUndoRedo');


        domBalise.outerHTML = precedentHTML;
        domBalise = this.m_oDocument.body.getElementsByClassName('wbEmpileUndoRedo')[0];
        domBalise.classList.remove('wbEmpileUndoRedo');

        oNouvelleRange.selectNode(domBalise);
        oSelection.addRange(oNouvelleRange);
        
        this.m_oDocument.execCommand("insertHTML", false, nouveauHTML);

        // se base sur le fait que insertHTML met le focus sur la fin du hml copié et qu'il n'y a qu'un parent avec cette balise
        jqBalise = $(oSelection.focusNode).closest(domBalise.tagName.toLowerCase());
    }

    this.restoreSelection(selPrecedente);

    if (fCallbackApresRedo) 
        bResultat = fCallbackApresRedo(bResultat,jqBalise)
    
    this.m_bUndoRedoEnCours=false;

    return bResultat;
};

WDSaisieAPI.prototype.CMD_ChangeStyle = function CMD_ChangeStyle(fAppliqueStyle,bCaretMetEnMemoireSinonAppliqueSurBalise,bPrefererFrere)
{
    var oSelection = this.__oGetSelection();

    // ne concerne que la sélection
    if (oSelection.type === "None") return;

    var oRangeInitiale = oSelection.getRangeAt(0);
    var oRange = oRangeInitiale.cloneRange();

    // TODO : ne faudrait il pas plutôt sauver la sélection avant de faire la commande ?
    var selPrecedente = this.saveSelection();

    var domAncetre = this.m_oDocument.body;
    var fGetAncetreDepuisRange = () => {
        var domParent;
        if (oRange.commonAncestorContainer.nodeType ==  Node.TEXT_NODE)
        {
            // commonAncestorContainer est le #text
            domParent= oRange.commonAncestorContainer.parentElement
        }
        else
        {
            // commonAncestorContainer est <element>
            domParent= oRange.commonAncestorContainer;
        }
        return domParent || domAncetre;
    };
    // est ce le cas où on traite le balise parent complète ?
    var bAppliqueSurBaliseParentExistante = false;
    // cas d'un curseur clignottant
    if (oSelection.type === "Caret")
    {
        if (bCaretMetEnMemoireSinonAppliqueSurBalise)
        {
            // met en mémoire en attendant la prochaine saisie

            // en rajoutant une balise span avec un zero width space sélectionné (filler)
            this._DesactiveEcoute_SelectionChanged();
            var newNode = this.m_oDocument.createElement("span");
            newNode.appendChild(this.m_oDocument.createTextNode( String.fromCharCode(8203) ));

            // est on à la fin de la balise ?
            var bCaretFinBalise = oRangeInitiale.startOffset === oRangeInitiale.endOffset && oRangeInitiale.endOffset === oRangeInitiale.commonAncestorContainer.length;
            if (bPrefererFrere && bCaretFinBalise && oRangeInitiale.commonAncestorContainer.nodeType== Node.TEXT_NODE && oRangeInitiale.commonAncestorContainer.parentElement && oRangeInitiale.commonAncestorContainer.parentElement.parentElement && this.m_oDocument.body !== oRangeInitiale.commonAncestorContainer.parentElement)
            {
                // préfère ajouter un frère qu'un fils pour éviter les héritages de style
                oRangeInitiale.commonAncestorContainer.parentElement.parentElement.insertBefore(newNode, oRangeInitiale.commonAncestorContainer.parentElement.nextSibling);
            }
            else
                oRangeInitiale.insertNode(newNode);

            // si cumul ?
            if (newNode.previousElementSibling && newNode.previousElementSibling.innerHTML === String.fromCharCode(8203))
            {
                // récupère le précédent
                newNode = newNode.previousElementSibling;
                newNode.nextElementSibling.remove();
            }

            fAppliqueStyle(newNode);

            oRangeInitiale.selectNode(newNode);
            oRangeInitiale.collapse();

            this._ActiveEcoute_SelectionChanged();
            return;
        }
        // TODO faut il réellement appliquer sur toute la balise en cas de simple curseur clignottant ???
        bAppliqueSurBaliseParentExistante=true;
        domAncetre = fGetAncetreDepuisRange();
    }
    // cas d'une sélection au sein d'un même élément
    else if (oRange.startContainer === oRange.endContainer && oRange.endContainer == oRange.commonAncestorContainer)
    {
       // cas d'une sélection de tout l'élément
       if (oRange.startOffset === 0 && oRange.endOffset === oRange.commonAncestorContainer.length)
       {
           bAppliqueSurBaliseParentExistante=true;
       }
       domAncetre = fGetAncetreDepuisRange();
    }
    else if (oRange.startOffset === 0 && oRange.commonAncestorContainer.firstChild === oRange.startContainer &&  oRange.commonAncestorContainer.lastChild === oRange.endContainer && oRange.endContainer.length === oRange.endOffset)
    {
       // cas d'une sélection de tout le contenu de l'élément
       bAppliqueSurBaliseParentExistante=true;
       domAncetre = fGetAncetreDepuisRange();
    }
    else
    {
        // commonAncestorContainer est un div p
        domAncetre = oRange.commonAncestorContainer || domAncetre;
    }

    // force la création d'une balie fille de body
    if (bAppliqueSurBaliseParentExistante && domAncetre === this.m_oDocument.body)
    {
        bAppliqueSurBaliseParentExistante = false;
    }

    this._DesactiveEcoute_SelectionChanged();

    // évite de changer d'ancêtre en changeant de sélection
    domAncetre = $(domAncetre)[0];

    // backup 
    var tabSpanFontFamily = [];
    domAncetre.querySelectorAll(this.m_oOptions.bEnModeMail ? "font[face]" : "[style*='font-family']").forEach((elem) => {
        elem.dataset["wdFontFamilyPrecedente"] = this.m_oOptions.bEnModeMail ? elem.face : elem.style.fontFamily;
        tabSpanFontFamily.push(elem);
    });

    // sauver le html via cloneContents
    var ancienHTMLouter = domAncetre.outerHTML;
    var ancienHTMLinner = domAncetre.innerHTML;
    var ancienHTML = bAppliqueSurBaliseParentExistante ? domAncetre.outerHTML : domAncetre.innerHTML;

    var anciennBodyinner = this.m_oDocument.body.innerHTML;

    var bUndoAFaire = false;
    // on crée des balises pour y mettre notre style, mais uniquement si on ne s'applique pas que sur la balise parent existante
    if (!bAppliqueSurBaliseParentExistante)
    {
        // force un xxx-large qui est l'élément remarquable pour faire les remplacements ensuite
        var sContenuAvant = this.m_oDocument.documentElement.outerHTML;
        this.m_oDocument.execCommand("fontName", false, "WINDEVFONTNAME");
        bUndoAFaire = sContenuAvant !== this.m_oDocument.documentElement.outerHTML;
    }

    // cas d'une sélection au sens d'un <span> qui en provoque 3 <span><span WINDEVFONTNAME><span>
    var bArborescenceCassee = false;
    this.m_oDocument.body.querySelectorAll("[style*=WINDEVFONTNAME]").forEach( (elem) => {
        if (!$.contains(domAncetre,elem) && domAncetre !== elem)
        {
            // la commande a cassé l'arborescence
            bArborescenceCassee=true;
        }
    });
    if (bArborescenceCassee)
    {
        domAncetre = this.m_oDocument.body;
        bAppliqueSurBaliseParentExistante=false;
        ancienHTML = anciennBodyinner;
    }

    // parcourt les span créés par la commande
    var tabSpan =
    bAppliqueSurBaliseParentExistante
        ? [ domAncetre ]
        : domAncetre.querySelectorAll(this.m_oOptions.bEnModeMail ? "[face*=WINDEVFONTNAME]" : "[style*=WINDEVFONTNAME]")
    ;

    // execCommand fotnName a changé la balise parente
    if (tabSpan.length===0 && (this.m_oOptions.bEnModeMail ? (domAncetre.face === 'WINDEVFONTNAME') : (domAncetre.style.fontFamily === 'WINDEVFONTNAME')))
    {
        tabSpan = [ domAncetre ]
        ancienHTML = ancienHTMLouter;
        bAppliqueSurBaliseParentExistante = true;
    }

    tabSpan.forEach( (elem) => {
        // cas d'une sélection au sens d'un <span> qui en provoque 3 <span serif><span WINDEVFONTNAME><span serif>
        if (!elem.dataset["wdFontFamilyPrecedente"] && bArborescenceCassee && elem.previousElementSibling && elem.previousElementSibling.style.fontFamily.length)
        {
            elem.dataset["wdFontFamilyPrecedente"] = elem.previousElementSibling.style.fontFamily;
        }
        // raz la font qui sert de marque à vide ou à la valeur précédente
        elem.style.fontfamily = (elem.dataset["wdFontFamilyPrecedente"]) ? elem.dataset["wdFontFamilyPrecedente"] : "";
        // applique le style souhaité
        fAppliqueStyle(elem);
        // raz        
        elem.dataset = undefined;
    });

    // rétablit la valeur initiale qui n'avait pas lieu d'être modifiée de toutes façons
    this.m_oDocument.querySelectorAll("[data-wd-font-family-precedente]").forEach( (elem) => {
        // raz
        if (this.m_oOptions.bEnModeMail)
            elem.face = elem.dataset["wdFontFamilyPrecedente"];
        else
            elem.style.fontFamily = elem.dataset["wdFontFamilyPrecedente"];
        elem.dataset = undefined;
    });
    this.m_oDocument.querySelectorAll(this.m_oOptions.bEnModeMail ? "[face*=WINDEVFONTNAME]" : "[style*=WINDEVFONTNAME]").forEach( (elem) => {
        // raz
        elem.style.fontFamily = "";
    });

    // sauver le html
    var nouveauHTML = bAppliqueSurBaliseParentExistante ? domAncetre.outerHTML : domAncetre.innerHTML;
    
    // faire undo
    if (bUndoAFaire)
    {
        this.m_oDocument.execCommand("undo", false);
        if (bAppliqueSurBaliseParentExistante) domAncetre = oRange.commonAncestorContainer;
    }
    else 
    {
        // remet l'ancien pour que le insertHTML qui suit passe bien de avant à après
        // car le html actuel est déjà dans l'état après
       if (bAppliqueSurBaliseParentExistante)
       {
        domAncetre.outerHTML = ancienHTML;
           (oRange.commonAncestorContainer.parentElement || oRange.commonAncestorContainer).querySelectorAll("*").forEach( (e) => //blindage pour le cas parent était <body> et devient <html>
           {
                if (e.outerHTML === ancienHTML)
                {
                    domAncetre = e;
                }
           });
       }
       else
       domAncetre.innerHTML = ancienHTML;
    }

    var oNouvelleRange = this.m_oDocument.createRange();
    if (bAppliqueSurBaliseParentExistante)
    {
        //oNouvelleRange.selectNode(domAncetre); // non car l'insertion se fait dedans du coup...
        oNouvelleRange.setStart(domAncetre,0)
        oNouvelleRange.setEnd(domAncetre,domAncetre.childNodes.length);
    }
    else
    {
        oNouvelleRange.selectNodeContents(domAncetre); //cf innerHTML
    }        
    oSelection.removeAllRanges();
    oSelection.addRange(oNouvelleRange);

    // inserthtml de cloneContents
    this.m_oDocument.execCommand("insertHTML", false, nouveauHTML);

    //TODO nouveauHTML===ancienHTML alors il faudrait avoir le comportement du contenteditable qui mémorise la demande 
    //et l'applique à la prochaine saisie mais l'nnaule en cas de déplacement ou autre

    this.restoreSelection(selPrecedente);

    this._ActiveEcoute_SelectionChanged();
};

WDSaisieAPI.prototype.nGetIndiceDocumentWLDepuisIndiceNoeud = function nGetIndiceDocumentWLDepuisIndiceNoeud(nooeudTexte,nIndice)
{
    var sTexteReconstruit = '';
    var iter = this.m_oDocument.createNodeIterator(this.m_oDocument.body, NodeFilter.SHOW_TEXT), textnode;
    var startOffset = 0;
    var nIndiceBody = 0;
    while (textnode = iter.nextNode())
    {
        if (textnode != nooeudTexte)
        {
            nIndiceBody += textnode.textContent.length;
            continue;
        }
        return nIndiceBody + nIndice;
    }
    return -1;
}

WDSaisieAPI.prototype.CreateRangeDepuisIndice = function CreateRangeDepuisIndice(nIndice,nLongueur,domBalise,bScrollIntoView)
{
    if (nIndice < 0)
        nIndice = 0; // defensif

    // recherche des noeuds de début et de fin pour cette recherche dans cette balise
    var sTexteReconstruit = '';
    var iter = this.m_oDocument.createNodeIterator(domBalise||this.m_oDocument.body, NodeFilter.SHOW_TEXT), textnode;
    var startNode, endNode;
    var startOffset = nIndice;
    var endOffset = startOffset + nLongueur;
    while (textnode = iter.nextNode())
    {
        sTexteReconstruit += textnode.textContent;
        if (!startNode && sTexteReconstruit.length > nIndice)
        {
            //la balise de début a été trouvée
            endNode = startNode = textnode;
        }
        if (startNode && sTexteReconstruit.length >= nIndice + nLongueur)
        {
            // la balise de fin a été trouvée
            endNode = textnode;
            break;
        }

        // applique le décalage dans les offset soit de début soit de fin
        if (!startNode)
        {
            startOffset -= textnode.textContent.length;
        }
        endOffset -= textnode.textContent.length;
    }

    try {
        // scroll dans la vue
        if (bScrollIntoView && startNode.parentElement) startNode.parentElement.scrollIntoView();

        var oNouvelleRange = this.m_oDocument.createRange();
        oNouvelleRange.setStart(startNode, startOffset);
        oNouvelleRange.setEnd(endNode, endOffset);
    }
    catch (e) {
        // évite de casser l'exécution JS pour une demande de sélection qui n'a aucun sens
        // QW#332545
    }
    return oNouvelleRange;
};

// sélectionne le texte recherché à l'indice nIndice dans la balise domBalise
// donc
// soit domBalise vaut le noeud le plus profond est nIndice y est relatif
// soit domBalise vaut undefine|document et le nIndice est global au document
WDSaisieAPI.prototype.CMD_SelectionneTexte = function CMD_SelectionneTexte(sRecherche,nIndice, domBalise, bAvecSurbrillance)
{
    // sélectionne désormais la partie trouvée
    var oSelection = this.__oGetSelection();
    var oNouvelleRange = this.CreateRangeDepuisIndice(nIndice,sRecherche.length,domBalise,true);
    oSelection.removeAllRanges();
    oSelection.addRange(oNouvelleRange);

    // style de sélection en orange
    if (bAvecSurbrillance)
    {        
        var style = this.m_oDocument.createElement('style');
        style.innerHTML = "::selection{ background:orange; }";
        var oSaisie = this;
        oSaisie._DesactiveEcoute_SelectionChanged();
        this.m_oDocument.body.appendChild(style);
        // astuce du settimeout pour éviter que le changement de sélection ci dessus ne provoque un appel non désiré à cet écouteur
        setTimeout(() => {
            // écoute la désélection pour retirer le style orange
            var f = function()
            {
                oSaisie._DesactiveEcoute_SelectionChanged();
                style.remove();
                oSaisie._ActiveEcoute_SelectionChanged();
                oSaisie.m_oDocument.removeEventListener('selectionchange',f);
            };
            this.m_oDocument.addEventListener('selectionchange',f);
        },1);
        oSaisie._ActiveEcoute_SelectionChanged();
    }
};

// conversion de la position du texte dans le noeud vers la position dans le document
WDSaisieAPI.prototype.__nGetIndiceDocumentWLDepuisIndiceBalise = function __nGetIndiceDocumentWLDepuisIndiceBalise(domBalise, nIndice)
{
    this._DesactiveEcoute_SelectionChanged();
    // sauve la sélection
    var selPrecedente = this.saveSelection();

    // astuce : sélectionne depuis le début du document afin d'en déduire le nombre de caractère dans le range extrait
    var oNouvelleRange = this.m_oDocument.createRange();
    var oSelection = this.__oGetSelection();
    oNouvelleRange.setStart(this.m_oDocument.body,0);
    oNouvelleRange.setEndBefore(domBalise);
    oSelection.removeAllRanges();
    oSelection.addRange(oNouvelleRange);
    var p = this.m_oDocument.createElement('p');
    // TODO optim via range.toString() ?
    p.insertBefore(oNouvelleRange.cloneContents(),undefined);

    // restaure la sélection
    oSelection.removeAllRanges();
    this.restoreSelection(selPrecedente);
    this._ActiveEcoute_SelectionChanged();

    // décale l'nIndice pour être dans le référentiel du document complet
    return nIndice + p.innerText.length;
};

WDSaisieAPI.prototype.__sGetInnerTextAvecRC = function __sGetInnerTextAvecRC(domBalise)
{
    var sTexteReconstruit = '';
    var iter = this.m_oDocument.createNodeIterator(domBalise||this.m_oDocument.body, NodeFilter.SHOW_TEXT), textnode;
    while (textnode = iter.nextNode()) 
    {
        sTexteReconstruit += textnode.textContent;
    }
    return sTexteReconstruit;
};

// Retourne le tableau des résultats [{ domBalise, nIndice, nIndiceDocument},...] ou tableau vide si rien de trouvé
// ou juste le résultat en cas de nRang fourni
// Pour sélectionner voir CMD_SelectionneTexte
WDSaisieAPI.prototype.CMD_RechercheTout = function CMD_RechercheTout(sRecherche, bSansCasse, bMotComplet, nRang)
{
    // formate la recherche pour traiter les espaces insécables (certes le WL ne le fait pas mais les navigateurs le font)
    sRecherche = sRecherche.replace(new RegExp(String.fromCharCode(160),"g")," ");
    var regRecherche = new RegExp(!bMotComplet ? sRecherche : ('(^|[^a-zA-Z0-9])'+sRecherche+'([^a-zA-Z0-9]|$)')  , 'g' + (bSansCasse ? 'i' : ''));
    // tableau des trouvailles { domBalise, nIndice, nIndiceDocument}
    var tabTrouvailles = {};
    // parcourt tous les noeuds texte dans l'ordre de lecture
    var iterNoeudTexte = this.m_oDocument.createNodeIterator(this.m_oDocument.body, NodeFilter.SHOW_TEXT);
    var nIndiceDocument = 0;
    var tabIndiceDocument = {};
    for (var domNoeudTexte = undefined; domNoeudTexte = iterNoeudTexte.nextNode(); nIndiceDocument += domNoeudTexte.textContent.length) 
    {            
       if (!domNoeudTexte.previousElementSibling)
       {
            tabIndiceDocument[
                domNoeudTexte.parentElement.uuidv4 || (domNoeudTexte.parentElement.uuidv4 = WDSaisieAPI.uuidv4())
            ] = nIndiceDocument;
       }

       // trouve dans le noeud texte
       var sContenu = domNoeudTexte.textContent;
       // ou 
       // trouve dans le parent complet (à ne faire qu'une fois par balise donc on le fait sur le dernier fils, afin de favoriser les recherches précédentes sur les balises profondes)       
       var nIndiceDocumentRecherche = nIndiceDocument;
       if (!domNoeudTexte.nextElementSibling && domNoeudTexte.parentElement.innerText && domNoeudTexte.parentElement.uuidv4)
       {
            nIndiceDocumentRecherche = tabIndiceDocument[domNoeudTexte.parentElement.uuidv4];
            sContenu = this.__sGetInnerTextAvecRC(domNoeudTexte.parentElement) ;
       }       

       // blindage et optim
       if (!sContenu)
        continue;

       // ignore les espaces insécables
       sContenu = sContenu.replace(new RegExp(String.fromCharCode(160),"g")," ");

       // trouve les occurrences dans le même noeud de texte 
       var matches = sContenu.matchAll(regRecherche);
       // parcourt les résultats du noeud
       for (var match of matches) 
       {           
           // retire le caractère de séparation de mots
           var nIndiceBalise = (bMotComplet && match[1]!='') ? (match.index+1) : match.index;
           // évite les doublons
           if (tabTrouvailles[ nIndiceBalise + nIndiceDocumentRecherche ])
             continue;
           // nouvelle recherche trouvée
           tabTrouvailles[ nIndiceBalise + nIndiceDocumentRecherche ] = { domBalise : domNoeudTexte.parentElement, nIndice :nIndiceBalise, nIndiceDocument : nIndiceBalise + nIndiceDocumentRecherche};
           // si on ne veut que le n ème résultat
           if (nRang && nRang === Object.values(tabTrouvailles).length)
           {
               return tabTrouvailles.pop();
           }           
       }
    }
    // résultat : tableau des résultats [{ domBalise, nIndice, nIndiceDocument},...] ou tableau vide si rien de trouvé
    return Object.values(tabTrouvailles);
};
// point d'entrée pour la fonction WL SaisieHtmlRecherche
// renvoie une chaine avec les indices trouvé + -1 terminal
WDSaisieAPI.prototype.CMD_Recherche = function CMD_Recherche(sRecherche, bSansCasse, bMotComplet, nbMax ) {
    var result = []
    // recherche tous les tuples
    var tabTrouvailles = this.CMD_RechercheTout(sRecherche, bSansCasse, bMotComplet);
    // convestion en un tableau d'entiers
    for (var i = 0; i < tabTrouvailles.length; i++) {
        var res = tabTrouvailles[i];
        // convertir la position en indice WL
        var nPosEnCaratere = this._nCalcTailleTexteAvantElem(res.domBalise,0) + res.nIndice;
        // +1 résultat
        result.push(nPosEnCaratere);
        // on limite le nombre max renvoyé
        if (nbMax && nbMax!=-1 && i >= (nbMax-1))
            break;
    }
    // marque de fin
    result.push(-1);
    // convertion en chaine séparées par des ','
    return result.toString();
};
// point d'entree pour la fonction WL SaisieHtmlRemplace
WDSaisieAPI.prototype.CMD_RemplaceTout = function CMD_RemplaceTout(sRecherche, sRemplace, bSansCasse, bMotComplet) {
    // recherche tous les tuples
    var tabTrouvailles = this.CMD_RechercheTout(sRecherche, bSansCasse, bMotComplet);
    // parcourt les en partant de la fin pour ne pas décaler les indices
    for (i = tabTrouvailles.length - 1; i >= 0;i--) {
        var trouveI = tabTrouvailles[i]
        // trouvé, on sélectionne
        this.CMD_SelectionneTexte(sRecherche, trouveI.nIndice, trouveI.domBalise, false);
        // on remplace
        this.CMD_InsereHtml( sRemplace );
    }
};



// Mette la sélection a fin du doc
WDSaisieAPI.prototype.CMD_SelectionFin = function CMD_SelectionFin() {
    // récup de la sélection
    var oSelection = this.__oGetSelection();

    // aller a la fin du body
    oSelection.selectAllChildren(this.m_oDocument.body);
    oSelection.collapseToEnd();
};
// Tout sélectionner dans le doc
WDSaisieAPI.prototype.CMD_SelectionTout = function CMD_SelectionTout() {
    // récup de la sélection
    var oSelection = this.__oGetSelection();
    // tout sélectionner
    oSelection.selectAllChildren(this.m_oDocument.body);
};

WDSaisieAPI.prototype.saveSelection = function saveSelection() {
    var containerEl = this.m_oDocument.body;
    var range = this.__oGetSelection().getRangeAt(0);
    var preSelectionRange = range.cloneRange();

    // preSelectionRange.selectNodeContents(containerEl);
    // preSelectionRange.setEnd(range.startContainer, range.startOffset);
    // var start = preSelectionRange.toString().length;

    return {
        range : preSelectionRange,
        nIndiceDocumentDebut : this.nGetIndiceDocumentWLDepuisIndiceNoeud(preSelectionRange.startContainer, preSelectionRange.startOffset),
        nIndiceDocumentFin : this.nGetIndiceDocumentWLDepuisIndiceNoeud(preSelectionRange.endContainer, preSelectionRange.endOffset),
        // start: start,
        // end: start + range.toString().length
    };
};

WDSaisieAPI.prototype.restoreSelection = function restoreSelection(savedSel) {

    var range = this.CreateRangeDepuisIndice(savedSel.nIndiceDocumentDebut,savedSel.nIndiceDocumentFin - savedSel.nIndiceDocumentDebut);

    // var containerEl = this.m_oDocument.body;
    // var charIndex = 0, range = this.m_oDocument.createRange();
    // range.setStart(containerEl, 0);
    // range.collapse(true);
    // var nodeStack = [containerEl], node, foundStart = false, stop = false;
    
    // while (!stop && (node = nodeStack.pop())) {
    //     if (node.nodeType == Node.TEXT_NODE) {
    //         var nextCharIndex = charIndex + node.length;
    //         if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
    //             range.setStart(node, savedSel.start - charIndex);
    //             foundStart = true;
    //         }
    //         if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
    //             range.setEnd(node, savedSel.end - charIndex);
    //             stop = true;
    //         }
    //         charIndex = nextCharIndex;
    //     } else {
    //         var i = node.childNodes.length;
    //         while (i--) {
    //             nodeStack.push(node.childNodes[i]);
    //         }
    //     }
    // }

    var sel = this.__oGetSelection();
    sel.removeAllRanges();
    sel.addRange(range);
};
 

// recupération de ..Sélection au format JSON
WDSaisieAPI.prototype.GetProp_Selection_JSON = function GetProp_Selection_JSON() {
    // récupéation de l'objet selection
    var res = this.GetProp_Selection();
    // conversion en chaine JSON
    let myJSON_str = JSON.stringify(res);
    return myJSON_str;
};
// recupération de ..Sélection en version simplifiée pour ..Curseur et ..FinCurseur
WDSaisieAPI.prototype.GetProp_SelectionSimplifiee = function GetProp_SelectionSimplifiee() {
    // récupéation de l'objet selection
    var res = this.GetProp_Selection();
    // conversion en chaine simple
    let myJSON_str = JSON.stringify(res);
    return String(res.debut) + ';' + String(res.fin);
};


WDSaisieAPI.prototype.bEstGras = function bEstGras(sValeurCalculee)
{
    //traite le cas normal vs bold bolder etc.
    // <= 400 ou lighter ... pas gras
    if (isNaN(sValeurCalculee))
    {
        // Note : sous Safari, le getComputedStyle donne Normal et Bold, alors que Chrome Windows donne 400 et 700
        switch(sValeurCalculee)
        {
        case "lighter":
            //Lighter than the inherited font weight.
        case "normal":
            //Standard weight. Equivalent of 400.
            return false;
        case "bold":
            //Bold weight. Equivalent of 700.
        case "bolder":
            //Bolder than the inherited font weight.
            return true;
        default :
            //ASSERT cette valeur predefinie n'est pas connue
            return false;
        }
    }
    // le gras commence à +400
    var nGraisse = parseInt(sValeurCalculee,10);
    return nGraisse > 400;
};


// a renvoyer par le visiteur
const EActionVisite = { stop:'1', frereSuivant:'2', premierFils:'3', frereParent:'4' };

// visite les éléments entre <elementDebut> et <elementFin>
// la suite parcourt est fixé par la valeur de retour de fVisiteur()
// <elementDebut> et <elementFin> sont visités.
WDSaisieAPI.prototype.visisteElementDOM = function visisteElementDOM(elementDebut, elementFin, fVisiteur) {
    // blindage
    if (!elementDebut)
        return;
    if (elementDebut == elementFin)
        return;
    // élément en cours de parcourt
    let elem = elementDebut;
    // élément suivant
    let elemSuivant = elem.nextSibling;
    while (elem) {

        // => visite
        var action = fVisiteur(elem);

        // selon ce que demande le visiteur pour la suite
        switch (action) {
            case EActionVisite.stop:
                return;
            case EActionVisite.frereSuivant:
                elemSuivant = elem.nextSibling;
                break;
            case EActionVisite.premierFils:
                elemSuivant = elem.firstChild;
                break;
            case EActionVisite.frereParent:
                if (!elem.parentNode)
                    return;
                elemSuivant = elem.parentNode.nextSibling;
                break;
        }

        // si on est arrivé a la fin
        if (elem == elementFin) {
            return;
        }
        // continuer si non null
        elem = elemSuivant
    }//while (elem)
};

// visiter les élément de plus haut niveau entre <elementDebut> ez <elementFin>
// remonte on redescend dans l'arbre si nécessaire
// <elementDebut> et <elementFin> ne sont pas pas visités
WDSaisieAPI.prototype.visisteElementPrincipauxEntre = function visisteElementPrincipauxEntre(elementDebut, elementFin, fVisiteur) {

    // parcourt paramété des éléments
    this.visisteElementDOM(elementDebut, elementFin, (elem) => {

        // si le noeud contient la fin
        if (elem.contains(elementFin)) {
            // redescendre récursivement vers le 1er fils
            return EActionVisite.premierFils;
        }

        // ne pas visiter le 1er ou le dernier
        if (elem != elementDebut && elem != elementFin)
            fVisiteur(elem);

        // si plus de freres
        if (!elem.nextSibling) {
            // remonter au frere du parent
            return EActionVisite.frereParent;
        }
        // frere suivant
        return EActionVisite.frereSuivant;
    })
};
// visiter les élément pour déterminer le style
// remonte on redescend dans l'arbre si nécessaire
// <elementDebut> et <elementFin> ne sont pas pas visités
WDSaisieAPI.prototype.visitePourStyle = function visitePourStyle(elementDebut, elementFin, fVisiteur) {

    fVisiteur(elementDebut)

    // parcourt paramété des éléments
    this.visisteElementDOM(elementDebut, elementFin, (elem) => {

        // si le noeud contient la fin
        if (elem.contains(elementFin)) {
            // redescendre récursivement vers le 1er fils
            return EActionVisite.premierFils;
        }

        // ne pas visiter le 1er
        if (elem != elementDebut )
            fVisiteur(elem);

        // si plus de freres
        if (!elem.nextSibling) {
            // remonter au frere du parent
            return EActionVisite.frereParent;
        }
        // frere suivant
        return EActionVisite.frereSuivant;
    })
};



//  calcul de la taille du texte avant un élement html
WDSaisieAPI.prototype._nCalcTailleTexteAvantElem = function _nCalcTailleTexteAvantElem( elementFin, _offsetFin, bDesactvieEcotuteTemp=true) {

    let debutDoc = this.m_oDocument.body;
    // commence au 1er noeaud de plus bas niveau
    while (debutDoc.firstChild)
        debutDoc = debutDoc.firstChild;

    var offsetFin = _offsetFin;
    var bEspaceACompter = false;
    var bRCACompter     = false;
    var bHackAjoute1    = false;
    // cas particulier on l'on a une balise "#text", dans ce cas si on se met à 0
    // le RC avant peut n'etre pas renvoyé parinnerText
    if (elementFin.nodeName === '#text' && offsetFin === 0 && elementFin.textContent !== ""
        && elementFin.parentElement
        && elementFin.parentElement.nodeName === 'DIV'
        && elementFin.parentElement.previousSibling
        && (elementFin.parentElement.previousSibling.nodeName == "#text" || elementFin.parentElement.previousSibling.nodeName == "DIV")
    ) {
        bRCACompter = true;
    }
    // cas QW#332569 ou la sélection a un espace en dernier
    // dans ce cas ".innerText" ne le renvoie pas
    else if (elementFin.nodeName === '#text' && offsetFin > 0 && offsetFin - 1 < elementFin.textContent.length - 1) {
        if (elementFin.textContent[offsetFin - 1] === " ")
            bEspaceACompter = true;
    }
    // si on commence au début d'un texte, les RC indute par un <P> par ex ne sont pas comptés.
    // on va sur le char suivant pour en tenir compte
    if (elementFin.nodeName === '#text' && offsetFin === 0 && elementFin.textContent.length > 0) {
        bHackAjoute1 = true;
        offsetFin++;
    }
    // idem si ca commence par un RC
    if (elementFin.nodeName === '#text' && offsetFin === 1 && elementFin.textContent.length > 1) {
        if (elementFin.textContent[0] === "\n") {
            bHackAjoute1 = true;
            offsetFin++;
        }
    }

    // On crée un range qui va du début du doc a l'élément
    let oRange = this.m_oDocument.createRange();
    oRange.setStart(debutDoc, 0);
    oRange.setEnd(elementFin, offsetFin);

    documentFragment = oRange.cloneContents();
    if (bDesactvieEcotuteTemp)  this._DesactiveEcoute_SelectionChanged();
    var parent = this.m_oDocument.body;
    var newDiv = this.m_oDocument.createElement("div");
    newDiv.appendChild(documentFragment);
    parent.appendChild(newDiv);
  
    // => tout ca pour avoir un innertext équivalent a ce qui est avant la sélection
    var txtRange    = newDiv.innerText;
    var lenTxtRange = txtRange.length;
    if (bEspaceACompter)  lenTxtRange++;
    if (bRCACompter)      lenTxtRange++;
    if (bHackAjoute1 && lenTxtRange>0)     lenTxtRange--;
    // restaure le document
    parent.removeChild(newDiv);
    if (bDesactvieEcotuteTemp) this._ActiveEcoute_SelectionChanged();

    return lenTxtRange - _offsetFin;

};

// trouver l'élément html a une position en caractères plain depuis le debut
// inverse de _nCalcTailleTexteAvantElem
// renvoiue { elem, offsetDansElem }
WDSaisieAPI.prototype._oCalcElemeFromPos = function _CalcElemeFromPos(pos) {
    var res = { elem: this.m_oDocument.body, offsetDansElem: 0, bTrouve : false };

    // commence au début du doc
    elementDebut = this.m_oDocument.body.firstChild;


    this._DesactiveEcoute_SelectionChanged();

    var nTailleTexteTotal = 0;
    // visite de toutes les balises
    this.visisteElementDOM(elementDebut, null, (elem) => {

        // compte sa taille : innerText = texte avec interprétation CSS
        var nTailleTexte           = 0;
        var nTailleBlancAvantTexte = 0;
        if (elem.innerText) {
            nTailleTexte = elem.innerText.length;
        }
        else if (elem.nodeName === "BR") {
            nTailleTexte++;
        }
        else if (elem.nodeName === "#text" && elem.parentElement && elem.parentElement.nodeName!="STYLE") {
            // pour les #texte innerText n'est pas défini, 

            var nTailleTexteMax = elem.textContent.length;
            // OPTIM
            if (nTailleTexteTotal + nTailleTexteMax + 2 < pos ) {
                // Approximation...
                nTailleTexte = nTailleTexteMax;
            }
            else {
                // on crée un div avec juste le texte - QW#332441
                var elemCopie = elem.cloneNode();
                var parent = elem.parentElement;
                var newDiv = this.m_oDocument.createElement("div");
                newDiv.appendChild(elemCopie);
                parent.appendChild(newDiv);
                // => calcul du innertext  
                var elem_innerTextCalcule = newDiv.innerText;
                parent.removeChild(newDiv);
                // calcul de la taille
                nTailleTexte = elem_innerTextCalcule.length;
                nTailleBlancAvantTexte = elem.textContent.indexOf(elem_innerTextCalcule);
                if (nTailleBlancAvantTexte < 0) nTailleBlancAvantTexte = 0; // défensif
            }
        }

        // OPTIM QW#332461
        //if (Math.abs(pos - nTailleTexteTotal) < nTailleTexte + 2) {
        if (nTailleTexteTotal + nTailleTexte + 2 >= pos - 2) {
            // version plus longue mais plus sure :
            var nTailleTexteTotalAvant = this._nCalcTailleTexteAvantElem(elem, 0, false);
            // que si ca avance !
            if (nTailleTexteTotalAvant > nTailleTexteTotal)
                nTailleTexteTotal = nTailleTexteTotalAvant;
        }

        // si  la posiution est dans la balise
        if (nTailleTexteTotal + nTailleTexte >= pos) {

            // on note  pour le cas ou sa dépasse
            res.elem           = elem;
            res.offsetDansElem = nTailleTexte;
            res.bTrouve        = true;

            // si c'est le debut exact
            if (nTailleTexteTotal === pos) {
                // trouvé
                res.elem           = elem;
                res.offsetDansElem = 0;
                res.bTrouve = true;
                return EActionVisite.stop;
            }
            // si c'est la fin exacte
            var bFin = nTailleTexteTotal + nTailleTexte == pos;
            if (elem.firstChild && this._nCalcTailleTexteAvantElem(elem.firstChild, 0) != nTailleTexteTotal)
                bFin = false;
            if (bFin) {
                // trouvé
                res.elem = elem;
                // l'offset de  fin a un sens différent selon le type d'élément
                if (elem.nodeName == '#text') 
                    res.offsetDansElem = nTailleTexte + nTailleBlancAvantTexte;
                else 
                    res.offsetDansElem = elem.childNodes.length;
                res.bTrouve = true;
                return EActionVisite.stop;
            }
            // si on a des fils non #test on descend dedans
            if (elem.firstChild) {
                return EActionVisite.premierFils;
            }
            // trouvé
            res.elem           = elem;
            res.offsetDansElem = pos - nTailleTexteTotal + nTailleBlancAvantTexte;
            // on force les bornes sinon exception dans <_nCalcTailleTexteAvantElem>
            if (res.offsetDansElem > nTailleTexte + nTailleBlancAvantTexte)
                res.offsetDansElem = nTailleTexte + nTailleBlancAvantTexte;
            if (res.offsetDansElem < 0)
                res.offsetDansElem = 0;
            res.bTrouve = true;
            // cas particulier ou il en manque 1 (expaces, ...)
            var nPosCalc = this._nCalcTailleTexteAvantElem(res.elem, res.offsetDansElem) + res.offsetDansElem;
            if (nPosCalc === pos - 1)
                res.offsetDansElem++;

            return EActionVisite.stop;
        }

        // ajout la taille de l'élément
        nTailleTexteTotal += nTailleTexte;

        // si plus de freres
        if (!elem.nextSibling) {
            // remonter au frere du parent
            return EActionVisite.frereParent;
        }

        // frere suivant
        return EActionVisite.frereSuivant;
    })

    this._ActiveEcoute_SelectionChanged();

    // terminé
    return res;

}


// changer la sélection
// pour EditeurHtmlSelection() 
// nIndiceDebut / nIndiceFin : commencent a 0.
WDSaisieAPI.prototype.CMD_Selectionne = function CMD_Selectionne(nIndiceDebut, nIndiceFin) {

    this._DesactiveEcoute_SelectionChanged();

    try
    {
        // récup de la sélection
        var oSelection = this.__oGetSelection();
        // on crée un range ente les 2
        var oNewRange = this.m_oDocument.createRange();

        // récup élement debut et fin correspondants
        var oDebut = this._oCalcElemeFromPos(nIndiceDebut);
        var oFin   = this._oCalcElemeFromPos(nIndiceFin);

        oNewRange.selectNodeContents(oDebut.elem);
        var nStartMax = oNewRange.endOffset;
        if (!oDebut.bTrouve) oDebut.offsetDansElem = nIndiceDebut<1 ? 0 : nStartMax;

        oNewRange.selectNodeContents(oFin.elem);
        var nEndMax = oNewRange.endOffset;
        if (!oFin.bTrouve) oFin.offsetDansElem = nIndiceFin<1 ? 0 : nEndMax;

        oNewRange.setStart(oDebut.elem, Math.min(nStartMax,oDebut.offsetDansElem));
        oNewRange.setEnd(  oFin.elem,   Math.min(nEndMax,oFin.offsetDansElem) );

        // on le met en tant que sélection en cours
        oSelection.removeAllRanges();
        oSelection.addRange(oNewRange);
    }
    catch(e)
    {
        // évite de casser l'exécution JS pour une demande de sélection qui n'a aucun sens
        // debugger;
    }

    // restauration
    this._ActiveEcoute_SelectionChanged();

};
// corrige un pb de  CEF :
// si double clic CEF peut sélectionner un espace en trop.
//on l'enleve si c'est le cas
WDSaisieAPI.prototype.CorrigeSelectionMot = function CorrigeSelectionMot() {
    // récup de la sélection
    var oSelection = this.__oGetSelection();
    var range_0;
    var selParent;
    if (oSelection.type != "None") {
        range_0 = oSelection.getRangeAt(0);
        selParent = range_0.commonAncestorContainer;
    }
    if (!range_0) return;

    // .texte sélectioinné
    var texteSel = oSelection.toString();
    // si ca fini par un espace ou l'enleve
    if (texteSel.slice(-1) == ' ' && range_0.endOffset > 0) {
        range_0.setEnd(range_0.endContainer, range_0.endOffset - 1);
    }

}

// recupération de ..Sélection 
WDSaisieAPI.prototype.GetProp_Selection = function GetProp_Selection(bOptimSansPosition) {
    // var revoyée
    var res = {};
    this._DesactiveEcoute_SelectionChanged();

    // récup de la sélection
    var oSelection = this.__oGetSelection();

    var range_0;
    var selParent;
    if (oSelection.type != "None") {
        range_0 = oSelection.getRangeAt(0);
        selParent = range_0.commonAncestorContainer;

    }
    // si c'est le cas simple ou la fin et le début son sur le meme element html
    let bCasSimple = true;
    if (range_0)
        bCasSimple = (range_0.startContainer == range_0.endContainer);

    // récup style CSS effectif
    var oStyleEffectif;
    if (selParent) {
        oStyleEffectif = this.oGetCurrentStyle(selParent,true);
    }

    //.type
    res.type = 0;
    if (oSelection.type == "None")  res.type = -1;
    if (oSelection.type == "Caret") res.type = 0; // htmlSelVide
    if (oSelection.type == "Range") {
        if (oSelection.rangeCount > 1)
            res.type = 2; // htmlSelMultiple
        else
            res.type = 1; // htmlSelSimple
    }

    // .texte
    res.texte = oSelection.toString();
    // .html
    res.html = '';
    if (selParent) {
            if (selParent.outerHTML && !bToutEstSelectionne)
            res.html = selParent.outerHTML;
        else if (selParent.innerHTML)
            res.html = selParent.innerHTML;
        else if (selParent.nodeName == '#text') 
            res.html = selParent.parentNode.innerHTML;
            
        // cas particulier ou tout est sélectionne, on ne veut pas renvoyer les style ajoutes pour les tables/images
        var bToutEstSelectionne = oSelection.containsNode(this.m_oDocument.body) ;
        if (bToutEstSelectionne)
            res.html = this.m_oDocument.body.outerHTML;

    }
    //.début.fin
    if (range_0 && !bOptimSansPosition) {
        // calcul de l'offst par rapport au début du doc
        let nOffset = this._nCalcTailleTexteAvantElem( range_0.startContainer, range_0.startOffset );
        res.debut = nOffset + range_0.startOffset;
        res.fin   = res.debut + res.texte.length; //nOffset + range_0.endOffset;
    } else {
        res.debut = 0;
        res.fin   = 0;
    } 

    // .style
    res.style = {nom:''};
    res.style.police = { gras: false, italique: false, souligne: false, barre: false, indice: false, exposant: false, alignement: 0, couleur: -1, couleurFond: -1, opaciteCouleurFond: 0, nom:'', taille:''  };
    if (oStyleEffectif && oStyleEffectif.textDecorationLine) {
        // construit la partie style
        res.style.police.gras          =  this.bEstGras(oStyleEffectif.fontWeight);
        res.style.police.italique      = (oStyleEffectif.fontStyle == "italic") || (oStyleEffectif.fontStyle == "oblique");
        res.style.police.souligne      = oStyleEffectif.textDecorationLine.includes("underline");
        res.style.police.barre = oStyleEffectif.textDecorationLine.includes("line-through");
        if (res.style.police.barre) // contourne QW#332377
            res.style.police.souligne = this.m_oDocument.queryCommandState("underline");

        res.style.police.indice        = oStyleEffectif.verticalAlign.includes("sub");
        res.style.police.exposant      = oStyleEffectif.verticalAlign.includes("super");
        res.style.police.alignement    = 0;
        if (oStyleEffectif.textAlign == "center")
            res.style.police.alignement= 1;
        if (oStyleEffectif.textAlign == "right")
            res.style.police.alignement= 2;
        res.style.police.couleur       = this._nCouleurJSversWin32(oStyleEffectif.color);
        res.style.police.couleurFond   = this._nCouleurJSversWin32(oStyleEffectif.backgroundColor);
        res.style.police.opaciteCouleurFond = this._nGetAlphaColor(oStyleEffectif.backgroundColor);
        res.style.police.nom           = oStyleEffectif.fontFamily; // ex : "Times New Roman"
        res.style.police.taille = oStyleEffectif.fontSize;   // ex : "32px"
        // on visite les element pour mettre à vide les style différents dans la selection.
        // par  exemple 2 polices differentes
        this.visitePourStyle(range_0.startContainer, range_0.endContainer, (elem) => {
            var oStyleEffectifElem = this.oGetCurrentStyle(elem); // OPTIM : non récursif
            if (oStyleEffectifElem.textAlign != oStyleEffectif.textAlign) {
                res.style.police.alignement = -1;
            }
            if (oStyleEffectifElem.color != oStyleEffectif.color) {
                res.style.police.couleur = -1;
            }
            if (oStyleEffectifElem.backgroundColor != oStyleEffectif.backgroundColor) {
                res.style.police.couleurFond = -1;
                res.style.police.opaciteCouleurFond = 0;
            }
            if (oStyleEffectifElem.fontFamily != oStyleEffectif.fontFamily) {
                res.style.police.nom     = "";
            }
            if (oStyleEffectifElem.fontSize != oStyleEffectif.fontSize) {
                res.style.police.taille  = "";
            }
        });

        res.style.nom = ""; 
        // recherche si on est dans un tag <H1> ... <H7>, ou <P> ou <SPAN>
        var elemParent;
        if (range_0)
            elemParent = range_0.startContainer;
        while (elemParent) {

            // si c'est un des tagname connu
            if (  elemParent.tagName == "H1"
               || elemParent.tagName == "H2"
               || elemParent.tagName == "H3"
               || elemParent.tagName == "H4"
               || elemParent.tagName == "H5"
               || elemParent.tagName == "H6"
            ) {
                res.style.nom = elemParent.tagName;
                break;
            }
            // si c'est un span ou un P ou un DIV
            if (   elemParent.tagName == "SPAN"
                || elemParent.tagName == "P"
                || elemParent.tagName == "DIV") {
                // et qu'il a un style de défini
                if (elemParent.className && elemParent.className!="undefined") {
                    res.style.nom = elemParent.className;
                    break;
                }
            }

            // parent supérieur
            elemParent = elemParent.parentElement;
        }
        //@pour debug
        //res.style.rawCss = oStyleEffectif;
    }
    // .URL, si on a sélectionné un lien 
    res.URL = "";
    if (range_0) {
        elemParent = range_0.startContainer;
        while (elemParent) {
            if (elemParent.tagName == "A") {
                res.URL = elemParent.href;
            }
            elemParent = elemParent.parentElement;
        }
    }

    //.Fragment
    res.fragment = [];
    // liste tous les fils

    var elem0 = range_0 ? range_0.startContainer : undefined;

    // ajoute d'un element html <elem>
    function _addFragment( elem, debut=0, fin=-1 ) {
        // construit 1 fragment
        let fragmentI = { html: '' };
        //.texte
        fragmentI.texte = elem.textContent;
        //.html
        if (elem.outerHTML)
            fragmentI.html = elem.outerHTML;
        else if (elem.innerHTML)
            fragmentI.html = elem.innerHTML;
        //.debut
        fragmentI.debut = debut;
        //.fin
        if (fin == -1)
            fragmentI.fin  = fragmentI.texte.length; // on prend tout
        else
            fragmentI.fin  = fin;
        // ajout au résultat
        res.fragment.push(fragmentI);
    }

    // calcul fin du fragment
    let nFin = -1;
    if (bCasSimple && range_0)
        nFin = range_0.endOffset;
    if (range_0) {
        // ajout du 1er fragment
        _addFragment(range_0.startContainer, range_0.startOffset, nFin);

        // si sélection complexe
        if (!bCasSimple) {
            // ajouter les noeuds pricicpaux entre le début et la fin
            this.visisteElementPrincipauxEntre(range_0.startContainer, range_0.endContainer, (elem) => {
                _addFragment(elem);
            });
            // ajout du dernier fragment
            _addFragment(range_0.endContainer, 0, range_0.endOffset);
        }
    }

    this._ActiveEcoute_SelectionChanged();
    return res;
};

WDSaisieAPI.prototype.CMD_InsereHtml = function CMD_InsereHtml(sHtml) {
    this.m_sDerniereValeurHtmlAffectee = undefined; // pour ne plus renvoyer la derniere valeur affectee    
    this.m_oDocument.execCommand('insertHTML', false, sHtml);
};

// applique un style H1 a H7 en supprimant toute autre mise en forme
// <sBaliseH> : "H1" par ex.
WDSaisieAPI.prototype.CMD_ForceStyleH = function CMD_ForceStyleH( sBaliseH ) {

    // récup de la sélection
    var oSelection = this.__oGetSelection();
    var sTextePlain = oSelection.toString();
    // QW#329005
    if (    sTextePlain == ""
        && oSelection.type != "None"
        && !this.bSelectionEstALaFin(oSelection)) {
        // on étends la sélection
        var   range_0 = oSelection.getRangeAt(0);
        var selParent = range_0.commonAncestorContainer;
        if (selParent.nodeName == "#text") {
            // on sélectionne tout le noeud texte
            var oNouvelleRange = this.m_oDocument.createRange();
            oNouvelleRange.selectNode(selParent);
            oSelection.removeAllRanges();
            oSelection.addRange(oNouvelleRange);
        }
        sTextePlain = oSelection.toString();
    }
    // si toujours pas de texte (ex, on est a la  fin)
    if (sTextePlain=="")
        sTextePlain = "\u200B"; // élément invisible
    var sHtml = "<"+sBaliseH+">" + sTextePlain + "</"+sBaliseH+">";

    this.CMD_InsereHtml(sHtml);
};
WDSaisieAPI.prototype.CMD_ChangeNomStyleCss = function CMD_ChangeNomStyleCss(nom) {
    var sHtml = '';
    this.CMD_ChangeStyle((elem) => {
        elem.className = nom;
    });
};

// envoie la balise H1 a H6 parent d'un élément ou null
WDSaisieAPI.prototype.oGetHxParent = function oGetHxParent( element ) {
    // SI le noeud est un neoud texte
    if (element.nodeName == '#text') {
        element = element.parentNode;
    }
    // remonte les parent
    while (element) {

        // si c'est un des tagname connu
        if (   element.tagName == "H1"
            || element.tagName == "H2"
            || element.tagName == "H3"
            || element.tagName == "H4"
            || element.tagName == "H5"
            || element.tagName == "H6"
        ) {
            // Trouve
            return element;
        }
        // parent supérieur
        element = element.parentElement;
    }
    // pas trouve
    return null;
};

WDSaisieAPI.prototype.CMD_SupprimeStyleCss = function CMD_SupprimeStyleCss(nom) {
    // récup sélection
    var oSelection = this.__oGetSelection();
    var selParent;
    if (oSelection.type != "None") {
        range_0 = oSelection.getRangeAt(0);
        selParent = range_0.commonAncestorContainer;
    }

    var oSelection = this.__oGetSelection();


    // récup balise H parent si elle existe
    var h1a6;
    if (selParent ) {
        h1a6 = this.oGetHxParent(selParent);
    }
    if (h1a6) {
        // on supprime la balise H1, .. H6
        // code fait avec undo : h1a6.outerHTML = h1a6.innerHTML
        var oNouvelleRange = this.m_oDocument.createRange();
        //oNouvelleRange.selectNode( h1a6 );
        //oSelection.removeAllRanges();
        //oSelection.addRange(oNouvelleRange);
        var sCodeSansH = h1a6.innerHTML;
        ///this.CMD_InsereHtml(sCodeSansH);
        // code revu pour QW#329106
        h1a6.outerHTML = sCodeSansH;
         return;
    }

    // autres style que H...

    // code rebue pour QW#329106
    // remplacer le "html" par le texte simple
    var sCodeSansStyle = oSelection.toString();
    this.CMD_InsereHtml(sCodeSansStyle);


    // plus de style
//    this.CMD_ChangeStyle((elem) => {
//        elem.className = undefined;
//    });


};


// récupération de ..Document au format JSON
WDSaisieAPI.prototype.GetProp_Document_JSON = function GetProp_Document_JSON() {

    var htmlDoc = {};
    htmlDoc.texte = this.m_oDocument.documentElement.innerText;
    htmlDoc.html = this.m_oDocument.documentElement.outerHTML;

    // conversion en chaine JSON
    let myJSON_str = JSON.stringify(htmlDoc);
    return myJSON_str;
};

// conversion d'une couleur JS vers un entier WIN32
WDSaisieAPI.prototype._nCouleurJSversWin32 = function _nCouleurJSversWin32(color) {
    if (!color)
        return -1; // blindage
    // convertion en tableau a,r,g,b
    var argb = color.replace(/[^\d,]/g, '').split(',');
    // Couleur sans couche alpha : rgb(128,128,128)
    if(argb.length = 3)
    {
    	// convesion en valeur win32
        return parseInt(argb[0]) + parseInt(argb[1]) * 0x100 + parseInt(argb[2]) * 0x10000;
    }
    // Couleur avec couche alpha : argb(255,128,128,128)
    else if(argb.length = 4)
    {
    	// convesion en valeur win32
        return parseInt(argb[1]) + parseInt(argb[2]) * 0x100 + parseInt(argb[3]) * 0x10000;
    }
	return -1;
};
// Retourne la valeur de la couche d'une couleur JS
WDSaisieAPI.prototype._nGetAlphaColor = function _nGetAlphaColor(color) {
    // convertion en tableau a,r,g,b
    var argb = color.replace(/[^\d,]/g, '').split(',');
    if(argb.length < 4)
    {
        return 255;
    }
    else
    {
        return parseInt(argb[0]);
    }
};
// récupération de tous les style de la page
WDSaisieAPI.prototype.GetListeTousLesStyles = function GetListeTousLesStyles()
{
    // format de retour
    var jsonStyles = {
        tabNomClass : []
    ,   class : {
            // format : "nomClasseCss" : { style : { color : "red" , etc... } }
        }
    };

    // Récupère toutes les classes présentes dans les styles perso
    for(var iFeuille = 0; iFeuille < this.m_oDocument.styleSheets.length; ++iFeuille)
    {
        // ignore les balises internes
        var cssFeuille = this.m_oDocument.styleSheets[iFeuille];
        if (this.m_tabBaliseCssAjoutee.filter( (element) => {
           return (element===cssFeuille.ownerNode);
        }).length) continue;

        try
        {
            for(var iRule=0;iRule<cssFeuille.cssRules.length; ++iRule)
            {
                if (!cssFeuille.cssRules[iRule] instanceof CSSStyleRule) continue; //ignore les @media
                if (!cssFeuille.cssRules[iRule].selectorText) continue; //blindage
                var sListeSelector = cssFeuille.cssRules[iRule].selectorText.trim();
                var tabListeSelector = sListeSelector.split(',');
                for(var iSelector=0; iSelector < tabListeSelector.length; ++iSelector)
                {
                    var sSelector = tabListeSelector[iSelector].trim();
                    if (sSelector.indexOf(".")!==0) continue; // que les classes
                    var tabSelector = sSelector.substr(1).split(/[^A-Za-z0-9\-\_]+/g);
                    var sNomClass = tabSelector[0];
                    if (!jsonStyles.class[sNomClass] || tabSelector.length===1) // pas d'autre subtilités de sélection comme :hover
                    {
                        if (!jsonStyles.class[sNomClass]) jsonStyles.tabNomClass.push(sNomClass);
                        jsonStyles.class[sNomClass] = cssFeuille.cssRules[iRule]; // suffisant ? non car n'a pas le cascading
                    }
                }
            }
        }
        catch (e)
        {
            // 	ErreurInfo()	"Erreur d'exécution du code Javascript.<RC>Uncaught SecurityError: Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules<RC>line 32636"
            continue;
        }

    }

    // conversion dash- vers camelCase
    function toCamelCase(str) {
        return str.replace(/(\-[a-z])/g, function(match){
            return match.toUpperCase().replace('-','');
        });
    }

    // utilise le style réel au lieu du style déclaré (pratique en cas de cascading)
    var jqTestClass = $("<p style='visibility:hidden;position:fixed;top:-999999px;left:-999999px;'/>");
    $(this.m_oDocument.body).append(jqTestClass);
    var oStyleBase =  $.extend({}, this.m_oWindow.getComputedStyle(jqTestClass[0]) );
    for(sClass in jsonStyles.class)
    {
        jqTestClass.attr("class",sClass);
        var oStyle =  this.m_oWindow.getComputedStyle(jqTestClass[0]);
        // simplification des informations css
        jsonStyles.class[sClass] = { style : {} };
        for (var iProp=0; iProp < oStyle.length; ++iProp)
        {
            //  SUGG filtrer pour ne remonter que ce qui est exploitable
            var sPropCamel = toCamelCase(oStyle[iProp]);
            if (oStyleBase[sPropCamel] === oStyle[ sPropCamel ]) continue; //ignore les styles de bases par défaut du navigateur et hérités du body
            jsonStyles.class[sClass].style[ oStyle[iProp] ] = oStyle[ sPropCamel ];
        }
    }
    jqTestClass.remove();

    return JSON.stringify(jsonStyles);
};

// indique si undo/redo sont possibles
WDSaisieAPI.prototype.Get_UndoRedoStatus = function Get_UndoRedoStatus() {
    var resultat = {};
    resultat.undoOk = this.m_oDocument.queryCommandEnabled("undo");
    resultat.redoOk = this.m_oDocument.queryCommandEnabled("redo");
    // conversion en chaine JSON
    let myJSON_str = JSON.stringify(resultat);
    return myJSON_str;
};
 
// indique si la sélection est tout a la fin du doc
WDSaisieAPI.prototype.bSelectionEstALaFin = function bSelectionEstALaFin(oSelection) {
    // que si rien n'est sélectionné
    if (!oSelection.isCollapsed)
        return false;
    if (oSelection.type == "None")
        return false;
    // la sélection doit contenir le dernier élément du document
    if (oSelection.containsNode(this.m_oDocument.body.lastChild))
        return false;
    // récup range (il n(y en a que 1 car isCollapsed est a vrai)
    range_0 = oSelection.getRangeAt(0);
    selParent = range_0.commonAncestorContainer;
    // on teste si on est bien sur le dernier caractère
    var oElement = range_0.endContainer;
    if (oElement.nodeName == '#text') {
        oElement = oElement.parentNode;
    }
    nLen = oElement.innerText.length;
    if (range_0.endOffset < nLen)
        return false;


    //OK
    return true;
};

WDSaisieAPI.prototype.sGetWLEXEC = function sGetWLEXEC(sNom)
{
    var s = sNom;
    try
    {
        // try pour le cas web où WDSaisieAPI_wlexecute n'est pas chargé
        s = eval(sNom);
    }
    catch (e) {
        return sNom;
    }
    return s;
};

WDSaisieAPI.prototype.sGetTraduction = function sGetTraduction(id,indice,eLangue)
{
    // TODO traduction des chaines
    if (!window.HTML_TOOLBAR) return id;
    var s;
    try
    {
        s = eval(id);
    }
    catch (e) {
        return id;
    }
    if (indice !== undefined)
        return s[indice];
    return s;
};


WDSaisieAPI.prototype.CreerRangeSelectionTexteSurBaliseCible = function CreerRangeSelectionTexteSurBaliseCible(domCible,bTransparent)
{
    //sélectionne l'image ou le lien
    //permet au Suppr de marcher et au Ctrl+Z de rétablir
    var range = this.m_oDocument.createRange();
    var sel = this.__oGetSelection();

    /*
    range.setStart(domCible,0);
    range.collapse(true);
    */
    if (domCible.tagName.toLowerCase() === "img")
    {
        range.selectNode(domCible);
    }
    else range.selectNodeContents(domCible);

    sel.removeAllRanges();

    if (bTransparent)
    {
        var style = this.m_oDocument.createElement('style');
        style.innerHTML = "::selection{ background:transparent; }";
        var oSaisie = this;
        oSaisie._DesactiveEcoute_SelectionChanged();
        this.m_oDocument.body.appendChild(style);
        // astuce du settimeout pour éviter que le changement de sélection ci dessus ne provoque un appel non désiré à cet écouteur
        setTimeout(() => {
            // écoute la désélection pour retirer le style orange
            var f = function()
            {
                oSaisie._DesactiveEcoute_SelectionChanged();
                style.remove();
                oSaisie._ActiveEcoute_SelectionChanged();
                oSaisie.m_oDocument.removeEventListener('selectionchange',f);
            };
            this.m_oDocument.addEventListener('selectionchange',f);
        },1);
        oSaisie._ActiveEcoute_SelectionChanged();
    }

    sel.addRange(range);

    return    range;
};

// Applique des operations sur l'element courant
WDSaisieAPI.prototype.JSEXEC_ElementCourant = function JSEXEC_ElementCourant(sAction,oValeurAvecID) //,... et ellipse
{
    if (!this.m_oElementCourant) return;
    if (!this.m_oElementCourant[sAction]) return;
	var target = [];
  	for (var i = 1; i< arguments.length; ++i)
  	{
  		target.push(arguments[i]);
    }

    // blindage d'édition d'un autre champ que le champ sélectionné
    if (oValeurAvecID && oValeurAvecID.id && this.m_oElementCourant.id)
    {
        if (this.m_oElementCourant.id !== oValeurAvecID.id)
            return;
    }
  	return this.m_oElementCourant[sAction].apply(this,target);
};

//gestion des images
//
//écouter le clic dans le document
//si le target est un IMG
//alors flagger l'IMG en sélectionner + générer des trackers en fin de body, en absolute au dessus de l'img
//chaque tracker doit écouter le mousedown stopPropagation et preventDefault pour jouer sur la taille de l'IMG sélectionnée
//
WDSaisieAPI.prototype.__InitGestionJS = function __InitGestionJS()
{
    if (!this.m_oOptions) return;

    if (!this.m_oOptions.bGestionImages && !this.m_oOptions.bGestionTables && !this.m_oOptions.bGestionLiens) return;

    this.m_oDocument.documentElement.setAttribute("class", (this.m_oDocument.documentElement.getAttribute("class")||'') + " wbSaisieRicheIframeHtml");

    // classes sur le body pour appliquer les styles de gestion des elements
    var sCalssesBody = (this.m_oDocument.body.getAttribute("class")||'');
    if (sCalssesBody) sCalssesBody+= " ";
    sCalssesBody += "wbSaisieRicheIframeBody";
    if (this.m_oOptions.bGestionImages) sCalssesBody+=" wbSaisieRicheIframeBodyGestionImage";
    if (this.m_oOptions.bGestionTables) sCalssesBody+=" wbSaisieRicheIframeBodyGestionTable";
    if (this.m_oOptions.bGestionLiens) sCalssesBody+=" wbSaisieRicheIframeBodyGestionLien";
    this.m_oDocument.body.setAttribute("class", sCalssesBody);

    if (this.m_oOptions.bGestionImages) 
        this.__AjouteJCrop();

    // relocalise le document pour l'iframe
    var document = this.m_oDocument;
    var windowPrincipale = this.m_oWindowPrincipale;
    var jqBody = $(document.body);
    var oSaisie = this;

    var ROTATION_AU_DEGRE_SUR_SHIFT_ACTIVE = false;//(window["clWDUtil"] && clWDUtil.WDDebug);

    var jqTrackers = $();


    var jqTrackerNW = $('<div contenteditable="false" id="wbSaisieRicheTrackerCoinNW"  class="wbSaisieRicheTrackerCoin" unselectable="true"></div>'); jqTrackers = jqTrackers.add(jqTrackerNW);
    var jqTrackerSW = $('<div contenteditable="false" id="wbSaisieRicheTrackerCoinSW"  class="wbSaisieRicheTrackerCoin" unselectable="true"></div>'); jqTrackers = jqTrackers.add(jqTrackerSW);
    var jqTrackerNE = $('<div contenteditable="false" id="wbSaisieRicheTrackerCoinNE"  class="wbSaisieRicheTrackerCoin" unselectable="true"></div>'); jqTrackers = jqTrackers.add(jqTrackerNE);
    var jqTrackerSE = $('<div contenteditable="false" id="wbSaisieRicheTrackerCoinSE"  class="wbSaisieRicheTrackerCoin" unselectable="true"></div>'); jqTrackers = jqTrackers.add(jqTrackerSE);

    var jqWrapperSelection = $('<div contenteditable="false" id="wbSaisieRicheWrapperSelection" class="wbSaisieRicheWrapperSelection" unselectable="true"></div>');

    var oEchelleParTracker = {
        wbSaisieRicheTrackerCoinNW: [0, 0, -1, -1],
        wbSaisieRicheTrackerCoinNE: [1, 0, 1, -1],
        wbSaisieRicheTrackerCoinSE: [1, 1, 1, 1],
        wbSaisieRicheTrackerCoinSW: [0, 1, -1, 1]
    };


    var oRotationParTracker = {
        wbSaisieRicheTrackerCoinNW:  [-1, 1],
        wbSaisieRicheTrackerCoinNE: [1, 1],
        wbSaisieRicheTrackerCoinSE: [1, -1],
        wbSaisieRicheTrackerCoinSW: [-1, -1]
    };    

    jqTrackers.each(function(){ oEchelleParTracker[this.id].elem = $(this); });

    var jqWrapperMargin = $('<div contenteditable="false" id="wbSaisieRicheTrackerMargeWrap" class="wbSaisieRicheTrackerMargeWrap" unselectable="true"></div>');

    var jqTrackerMarginT = $('<div contenteditable="false" title="'+oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.DBL')+'" id="wbSaisieRicheTrackerMargeT"  class="wbSaisieRicheTrackerMarge" unselectable="true"></div>'); jqWrapperMargin.append(jqTrackerMarginT);
    var jqTrackerMarginR = $('<div contenteditable="false" title="'+oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.DBL')+'" id="wbSaisieRicheTrackerMargeR"  class="wbSaisieRicheTrackerMarge" unselectable="true"></div>'); jqWrapperMargin.append(jqTrackerMarginR);
    var jqTrackerMarginB = $('<div contenteditable="false" title="'+oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.DBL')+'" id="wbSaisieRicheTrackerMargeB"  class="wbSaisieRicheTrackerMarge" unselectable="true"></div>'); jqWrapperMargin.append(jqTrackerMarginB);
    var jqTrackerMarginL = $('<div contenteditable="false" title="'+oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.DBL')+'" id="wbSaisieRicheTrackerMargeL"  class="wbSaisieRicheTrackerMarge" unselectable="true"></div>'); jqWrapperMargin.append(jqTrackerMarginL);

    jqTrackers = jqTrackers.add(jqWrapperMargin);

    //barre de modif de l'image
    var jqUlBarreFaaImg  = $('<ul id="wbSaisieRicheBarreImg" class="wbSaisieRicheBarreImg wbBarreOutilsMiniBarreUl wbSaisieRicheBarre" unselectable="true" contenteditable="false"></ul>');
    var jqUlBarreFaaLien = $('<ul id="wbSaisieRicheBarreLien" class="wbSaisieRicheBarreLien wbBarreOutilsMiniBarreUl wbSaisieRicheBarre" unselectable="true" contenteditable="false"></ul>');

    var tabOptionImg = [
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.HAB',0),    nIndiceYDansPlanche : 28,    style : {maxWidth:'100%',width:'',float:'none',display:'inline',margin:'0'}},
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.HAB',1),    nIndiceYDansPlanche : 30,    style : {maxWidth:'100%',width:'',float:'left',display:'inline',margin:'0'}},
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.HAB',2),    nIndiceYDansPlanche : 29,    style : {maxWidth:'100%',width:'',float:'right',display:'inline',margin:'0'}},
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.HAB',3),    nIndiceYDansPlanche : 31,    style : {maxWidth:'100%',width:'',float:'none',display:'block',margin:'0 auto'}},
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.HAB',4),    nIndiceYDansPlanche : 32,    style : {maxWidth:'100%',width:'100%',float:'none',display:'block',margin:'0'}}
    ];

    // le crop a besoin d'une extension, absente en WD
    if ($.Jcrop)
    {
        tabOptionImg.push({sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.HAB',6),    nIndiceYDansPlanche : 40,    action : 'CROP_SRC'});
    }
    //TODO 26 rotation sans copie
    //avec debug de
    // - position mini barre à mettre toujours au dessus quelque soit la rotation en cours
    // (actuellement elle suit le bord haut et se met à l'horizontal)
    //
    // - rogner après rotation
    //
    // - redimensionner après rotation => les trackers 
    //
    tabOptionImg.push({sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.HAB',7),    nIndiceYDansPlanche : 41,    action : 'ROTATE_CLOCKWISE_COPY' }); //ROTATE_CLOCKWISE' },
    tabOptionImg.push({sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.HAB',8),    nIndiceYDansPlanche : 35,    action : 'MODIFIER_ALT' });
    tabOptionImg.push({sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.HAB',5),    nIndiceYDansPlanche : 25,    action : 'MODIFIER_SRC' });


    var sClassePlanche = "wbBarreOutilsImgPlanche" + ((bIEAvec11 || bEdge) ? '' : ' wbBarreOutilsImgPlancheSVG');
    if ( !this.m_bModeWeb ) // cas image dans les ressources de la OBJ
        sClassePlanche = "wbBarreOutilsImgPlanche wbBarreOutilsImgPlancheSVGWDL"

    for(var iOptionImg=0; iOptionImg<tabOptionImg.length; ++iOptionImg)
    {
        var jqLiFaaImg = $('<li class="wbSaisieRicheBarreImgLi wbBarreOutilsMiniBarreLi" id="wbSaisieRicheBarreImgLi' + iOptionImg +'"><i class="wbBarreOutilsImgPlancheWrap"><i title="'+ tabOptionImg[iOptionImg].sLibelle +'" style="cursor:pointer;transform:translateY(calc(-100% * '+ tabOptionImg[iOptionImg].nIndiceYDansPlanche +' / '+WDSaisieAPI.PLANCHE_NB_IMAGES+'));" class="'+sClassePlanche+' wbplanche wbPlanche5Etat1Anim"></i></li>');
        jqUlBarreFaaImg.append(jqLiFaaImg);
    }

    //barre de modif des liens
    var tabOptionLien = [
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.LNK',0),    nIndiceYDansPlanche : 37,    fAction : function(jqThis) {windowPrincipale.open(jqThis.attr("href"),"_blank"); } },
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.LNK',1),    nIndiceYDansPlanche : 24,    fAction : function(jqThis) {var sUrl = prompt(oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.LNK') || "URL ?",jqThis.attr("href")); if(!sUrl) return; jqThis.attr("href", sUrl); return true; } },
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.LNK',2),    nIndiceYDansPlanche : 38,    fAction : function(jqThis)
        {
            //ceci n'est pas annulable...tant pis
            jqThis.replaceWith('<span>' + jqThis.html() + '</span>'); return false; 
            //ceci est annulable ?
            //CreerRangeSelectionTexteSurBaliseCible(jqThis[0]).deleteContents();
        } },
    ];    

    for(var iOptionLien=0; iOptionLien<tabOptionLien.length; ++iOptionLien)
    {
        var jqLiFaaLien = $('<li class="wbSaisieRicheBarreLienLi wbBarreOutilsMiniBarreLi" id="wbSaisieRicheBarreLienLi' + iOptionLien +'"><i class="wbBarreOutilsImgPlancheWrap"><i title="'+ tabOptionLien[iOptionLien].sLibelle +'" style="cursor:pointer;transform:translateY(calc(-100% * '+ tabOptionLien[iOptionLien].nIndiceYDansPlanche +' / '+WDSaisieAPI.PLANCHE_NB_IMAGES+'));" class="'+sClassePlanche+' wbplanche wbPlanche5Etat1Anim"></i></li>');
        jqUlBarreFaaLien.append(jqLiFaaLien);
    }


    // Gestion des tables

    //barre de modif de table
    var jqUlBarreFaaTable  = $('<ul id="wbSaisieRicheBarreTable" class="wbSaisieRicheBarreTable wbBarreOutilsMiniBarreUl wbSaisieRicheBarre" unselectable="true" contenteditable="false"></ul>');

    var tabOptionTable = [
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.TABLE.ROW.BEFORE'),        nIndiceYDansPlanche : 42,   action : "ROW.BEFORE"},
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.TABLE.ROW.AFTER'),         nIndiceYDansPlanche : 43,   action : "ROW.AFTER"},
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.TABLE.ROW.DELETE'),        nIndiceYDansPlanche : 44,   action : "ROW.DELETE"},
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.TABLE.COLUMN.BEFORE'),     nIndiceYDansPlanche : 45,   action : "COLUMN.BEFORE"},
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.TABLE.COLUMN.AFTER'),      nIndiceYDansPlanche : 46,   action : "COLUMN.AFTER"},
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.TABLE.COLUMN.DELETE'),     nIndiceYDansPlanche : 47,   action : "COLUMN.DELETE"},

        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.TABLE.CELL.PROP'),         nIndiceYDansPlanche : 51,   action : "WLEXEC", param : oSaisie.sGetWLEXEC('WLEXEC_EDITTABLECEL')},
        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.TABLE.PROP'),              nIndiceYDansPlanche : 48,   action : "WLEXEC", param : oSaisie.sGetWLEXEC('WLEXEC_EDITTABLE')}
//        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.TABLE.ROW.PROP'),          nIndiceYDansPlanche : 49,   action : "WLEXEC", param : WLEXEC_EDITTABLEROW},
//        {sLibelle : oSaisie.sGetTraduction('HTML_TOOLBAR.TABLE.COL.PROP'),          nIndiceYDansPlanche : 50,   action : "WLEXEC", param : WLEXEC_EDITTABLECOL},

    ];


    for(var iOptionTable=0; iOptionTable<tabOptionTable.length; ++iOptionTable)
    {
        var jqLiFaaTable = $('<li class="wbSaisieRicheBarreTableLi wbBarreOutilsMiniBarreLi" id="wbSaisieRicheBarreTableLi' + iOptionTable +'"><i class="wbBarreOutilsImgPlancheWrap"><i title="'+ tabOptionTable[iOptionTable].sLibelle +'" style="cursor:pointer;transform:translateY(calc(-100% * '+ tabOptionTable[iOptionTable].nIndiceYDansPlanche +' / '+WDSaisieAPI.PLANCHE_NB_IMAGES+'));" class="'+sClassePlanche+' wbplanche wbPlanche5Etat1Anim"></i></li>');
        jqUlBarreFaaTable.append(jqLiFaaTable);
    }


    //NON car le clic sur l'option fait un blur du body de la saisie riche et donc désélectionne l'image et ses trackers
    //et donc il n'y a plus d'image sur laquelle appliquée un style
    /*    jqBody[0].wbSaisieRicheSetStyle = function(wdPopupSaisieCouleur)
    {
        //clic sur une couleur ?
    if (wdPopupSaisieCouleur && wdPopupSaisieCouleur.m_sStyle && wdPopupSaisieCouleur.m_oParamCommande && wdPopupSaisieCouleur.m_oParamCommande[2])
    {
            jqBody.find(".wbSaisieRicheImgSelectionne").each(function(){
                this.style[wdPopupSaisieCouleur.m_sStyle] = wdPopupSaisieCouleur.m_oParamCommande[2]
            });
    }
    };
    */
    function rectGetPositionTaille(jqTarget)
    {
        return $.extend({},jqTarget[0].getBoundingClientRect(),{//attention getBoundingClientRect fait un carré externe après une rotation
            //relatif au document
            left : jqTarget.offset().left + parseInt(getComputedStyle(jqTarget[0]).borderLeftWidth) ,// + jqBody[0].scrollLeft,
            top : jqTarget.offset().top + parseInt(getComputedStyle(jqTarget[0]).borderTopWidth) ,//+ jqBody[0].scrollTop,
            width :  jqTarget[0].clientWidth||jqTarget[0].offsetWidth,
            height :  jqTarget[0].clientHeight||jqTarget[0].offsetHeight,
            transform :  jqTarget[0].style.transform,
            marginTop : parseFloat(jqTarget[0].style.marginTop||0),
            marginRight : jqTarget[0].style.marginRight=="auto" ? 0 : parseFloat( jqTarget[0].style.marginRight||0),
            marginBottom : parseFloat(jqTarget[0].style.marginBottom||0),
            marginLeft : jqTarget[0].style.marginLeft=="auto" ? 0 : parseFloat(jqTarget[0].style.marginLeft||0)
        })
        ;
    }

    // si au moins une colonne ancrée (table ancrée)
    //   width 100%
    //   table layout fixed
    //   td width selon réglages

    // si aucune colonne ancrée
    //   width somme px
    //   table layout auto
    //   td width px


    // écoute le changement de selection pour que si on est dans un sous sous... element de de table la table soit selectionnee 
    //wbSaisieRicheTableSelectionne => c'est comme le lien non??

    //TODO revoir la multi sélection 
    //il faut écouter onselectionchange pour que quand 2 td sont sélectionnes (souris ou clavier) on passe dans un mode de selection de td uniquement
//     document.addEventListener('selectionchange',function()
//     { 
//         //DEBUG le problème est que cela vire la selection en cliquant sur la mini barre 
//         //jqBody.trigger("trigger.wb.saisieriche.selectionne"); 
//     });


    var tabAttributs = [
        "width","height", //"style", CSS à part
        "align","bgcolor","border",
        "colspan","rowspan",
        "valign",
        "cellpadding","cellspacing",
        // "frame","rules","summary","abbr","axis","char","charoff"

        // pour img
        "alt","hspace","vspace","crossorigin","decoding","ismap","loading","sizes","src","srcset","usemap"

    ];

    function TraiteAttributs(oBalise,jqBalise,bLecture)
    {
        if (!bLecture && !oBalise.attr) return;
        tabAttributs.forEach(function(element, index/*, array*/){
            if (!bLecture || jqBalise[0].hasAttribute(element))
            {                        
                if (bLecture)
                {
                    if (!oBalise) oBalise = {};
                    if (!oBalise.attr) oBalise.attr = {};    
                    oBalise.attr[element] = jqBalise.attr(element);    
                }
                else
                {
                    jqBalise.attr(element,oBalise.attr[element]);    
                }                        
            }
        });                
    }      

    function TraiteStyle(oBalise,jqBalise,bLecture)
    {
        if (bLecture)
        {
            for (var iSurchargeStyle=0; iSurchargeStyle<jqBalise[0].style.length; ++iSurchargeStyle)
            {
                if (!oBalise.style) oBalise.style = {};
                var sNomPropCSS = jqBalise[0].style[iSurchargeStyle];
                oBalise.style[sNomPropCSS] = jqBalise[0].style[jQuery.camelCase(sNomPropCSS)]; // alternative : .css(sNomPropCSS)
            }
        }
        else 
        {
            if (!oBalise.style) return;
            for(sNomPropCSS in oBalise.style)
            {
                jqBalise.css(sNomPropCSS, oBalise.style[sNomPropCSS]);
            }
        }
    }

    function TraiteAttributsEtStyle(oBalise,jqBalise,bLecture)
    {
        TraiteAttributs(oBalise,jqBalise,bLecture);
        TraiteStyle(oBalise,jqBalise,bLecture);
    }

    function PopupAfficheProp(fCallbackOK,jqBaliseSelectionne,oValeur)
    {
        var jqBaliseModalGFI = $('<div class="wbSaisieRicheModalGFI" contenteditable="false"></div>');
        var jqBaliseModal = $('<div class="wbSaisieRicheModal"></div>');
        jqBaliseModalGFI.append(jqBaliseModal);

        var jqBaliseModalContenu = $('<div class="wbSaisieRicheModalContenu"></div>');
        jqBaliseModal.append(jqBaliseModalContenu);

        var jqBaliseModalContenuEntete = $('<div class="wbSaisieRicheModalContenuEntete"></div>');
        jqBaliseModalContenu.append(jqBaliseModalContenuEntete);

        var jqBaliseModalContenuTitre = $('<h5 class="wbSaisieRicheModalContenuTitre">' + jqBaliseSelectionne[0].tagName  + '</h5>');
        jqBaliseModalContenuEntete.append(jqBaliseModalContenuTitre);

        var jqBaliseButtonClose = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>');
        jqBaliseButtonClose.click(function(){
            jqBaliseModalGFI.remove();
        });
        jqBaliseModalContenuEntete.append(jqBaliseButtonClose);

        var jqBaliseModalContenuCorps = $('<div class="wbSaisieRicheModalContenuCorps"></div>');
        jqBaliseModalContenu.append(jqBaliseModalContenuCorps);

        var jqBaliseModalContenuCorpsListe = $('<dl></dl>');
        jqBaliseModalContenuCorps.append(jqBaliseModalContenuCorpsListe);

        var jqBaliseModalContenuPied = $('<div class="wbSaisieRicheModalContenuPied"></div>');
        jqBaliseModalContenu.append(jqBaliseModalContenuPied);
        var jqBaliseModalBoutonAnnuler = $('<button type="button" class="wbSaisieRicheModalBoutonAnnuler" data-dismiss="modal">Annuler</button></div>');
        jqBaliseModalBoutonAnnuler.click(function(){
            jqBaliseModalGFI.remove();
        });            
        jqBaliseModalContenuPied.append(jqBaliseModalBoutonAnnuler);
        var jqBaliseModalBoutonOK = $('<button type="button" class="wbSaisieRicheModalBoutonOK">OK</button>          </div>');
        jqBaliseModalBoutonOK.click(function(){
            // Appliquer les modification
            fCallbackOK(oValeur);
            // Fermer
            jqBaliseModalGFI.remove();
        });
        jqBaliseModalContenuPied.append(jqBaliseModalBoutonOK);

        jqBody.append(jqBaliseModalGFI);

        return {
            ajouteChampFormulaire : function(sLibelle,oValeur,sNom, bAttr, sType)
            {
                var sMembre = !bAttr ? 'style' : 'attr';
                var sValeurInitiale = oValeur[sMembre][sNom]||"";
                if (!sType)
                {
                  if (typeof sValeurInitiale === "number")
                    sType = "range"
                  else
                    sType="text";  
                } 
                if (sType === "range" || sType === "number")
                {
                    sValeurInitiale = !sValeurInitiale ? 0 : parseFloat(sValeurInitiale);
                }
                else if (sType === "color")
                {
                    var tabRgbCouleur = clWDUtil.tabHTML2RVBA(sValeurInitiale);
                    sValeurInitiale = "#" + tabRgbCouleur[0].toString(16) + tabRgbCouleur[1].toString(16) + tabRgbCouleur[2].toString(16);
                }
                var jqBaliseDT = $('<dt>' + sLibelle + '</dt>');
                jqBaliseModalContenuCorpsListe.append(jqBaliseDT);
                var jqBaliseDD = $('<dd></dd>');
                jqBaliseModalContenuCorpsListe.append(jqBaliseDD);
                var jqBaliseSaisie = $('<input type="'+sType+'" value="' + sValeurInitiale + '" title="' + sValeurInitiale + '"/>');
                jqBaliseSaisie.on('change',function(){
                    // binding
                    oValeur[sMembre][sNom] = this.value;
                    if (sType === "range" || sType === "number") oValeur[sMembre][sNom] += "px";
                    this.title = oValeur[sMembre][sNom];
                });
                jqBaliseDD.append(jqBaliseSaisie);
            },
            ajouteAttrStyle : function(oBalise)
            {
                this.ajouteAttr(oBalise);
                this.ajouteStyle(oBalise);
            },
            ajouteAttr : function(oBalise)
            {
                if (!oBalise.attr) return;
                tabAttributs.forEach((element, index/*, array*/) => {
                    // TODO Trad
                    this.ajouteChampFormulaire(tabAttributs[index],oBalise, tabAttributs[index], true);
                });
            },
            ajouteStyle : function(oBalise)
            {
                if (!oBalise.style) return;

                // spécifique
                this.ajouteChampFormulaire('Couleur de fond',oBalise,'background-color',false,'color');
                this.ajouteChampFormulaireBordures(oBalise);
                // TODO toutes les regles css a gerer comme le table-collapse etc
            },   
            ajouteChampFormulaireBorduresCote : function(oBalise,sCote)
            {
                this.ajouteChampFormulaire('Epaisseur de bordure ' + sCote,oBalise, 'border-' + sCote + '-width',false,'range');
                this.ajouteChampFormulaire('Style de bordure ' + sCote,oBalise, 'border-' + sCote + '-style',false,'text');
                this.ajouteChampFormulaire('Couleur de bordure ' + sCote,oBalise, 'border-' + sCote + '-color',false,'color');
            },
            ajouteChampFormulaireBordures : function(oBalise)
            {
                this.ajouteChampFormulaireBorduresCote(oBalise,'top');
                this.ajouteChampFormulaireBorduresCote(oBalise,'right');
                this.ajouteChampFormulaireBorduresCote(oBalise,'bottom');
                this.ajouteChampFormulaireBorduresCote(oBalise,'left');
            }
        };
    }


    function SurClickTable(jqTarget,jqEvent)
    {

        if (jqBody[0].parentElement.wdSaisieRiche)
        {
            return;
            // //vérifie que l'édition de lien est dispo dans la barre de FAA principale
            // var oElementBarre = jqBody[0].parentElement.wdSaisieRiche.oGetElementByIdBarre(parent.document,"LNK");
            // if (oElementBarre && !clWDUtil.bEstDisplay(oElementBarre, parent.document))
            // {
            //     //ignore
            //     return;
            // }
        }
        else 
        {
            if (!oSaisie.m_oOptions.bGestionTables) return;
        }


        //affiche mini barre de table

        var jqTableSelectionne = jqTarget.closest("table");

        //limitation : pas de gestion de fusion de ligne ou colonne
        if (jqTableSelectionne.find("[rowspan]").length) return;

        var jqTdSelectionne = jqTarget;

        jqTableSelectionne.addClass("wbSaisieRicheTableSelectionne");
        jqTableSelectionne.find("td").removeClass("wbSaisieRicheTdSelectionne");
        jqTdSelectionne.addClass("wbSaisieRicheTdSelectionne");

        var oRectTable = rectGetPositionTaille(jqTdSelectionne);

        jqBody.on("keydown.wb.saisieriche.barretable", function(jqEvent)
        {
            if (!jqTdSelectionne || !jqTdSelectionne.length) return;
            var bEventTraite = false;
            var sel = oSaisie.__oGetSelection();
            // Ctrl + A sélectionne que la cellule
            if (bEventTraite=(jqEvent.ctrlKey && jqEvent.key === 'a'))
            {
                oSaisie.CreerRangeSelectionTexteSurBaliseCible(jqTdSelectionne[0]);
            }
            else if (sel.rangeCount>0)
            {
                // cas d'un deplacement au clavier au sein de la table
                var range = sel.getRangeAt(0);
                if ($.contains(jqTableSelectionne[0], range.commonAncestorContainer))
                {
                    function changeFocusTd(domTd)
                    {
                        if (sel.type === "Caret")
                        {
//                             if (jqEvent.shiftKey)
//                             {
//                                 range.setEndAfter(domTd);
//                             }
//                             else
                            {
                                range.selectNodeContents(domTd);
                                range.collapse(true);
                            }
                        }
                        else
                        {
                            range.setEndAfter(domTd);
                        }
                    }

                    // Cas du TAB
                    if (bEventTraite=(jqEvent.key === 'Tab' && !jqEvent.ctrlKey))
                    {
                        // passe a droite
                        var bTdFocusTrouve = false;
                        var domTdPrecedent = undefined;
                        if (jqTdSelectionne[0] == jqTableSelectionne.add(jqTableSelectionne.children("tbody")).children("tr").children("td").each(function(){
                            if (bTdFocusTrouve)
                            {
                                // sélectionne this
                                changeFocusTd(this);
                                return false;
                            }
                            if (this === jqTdSelectionne[0])
                            {
                                if (jqEvent.shiftKey)
                                {
                                    // sélectionne domTdPrecedent
                                    changeFocusTd(domTdPrecedent);
                                    return false;
                                }
                                bTdFocusTrouve = true;
                            }
                            domTdPrecedent = this;
                        }).last().get(0) && !jqEvent.shiftKey)
                        {
                            // si dernière cellule créer une nouvelle ligne
                            var domTr = ajouteLigne(false);
                            changeFocusTd(domTr.firstElementChild);
                        }
                    }
                    else if (bEventTraite=(jqEvent.key === 'ArrowDown' && sel.focusNode && sel.focusNode.parentElement && sel.focusNode.parentElement.nextElementSibling))
                    {
                        // passe en bas
                        var nIndiceTd = jqTdSelectionne.index();
                        changeFocusTd(jqTdSelectionne[0].parentElement.nextElementSibling.children[nIndiceTd]);

                    }
                    else if (bEventTraite=(jqEvent.key === 'ArrowUp' && sel.focusNode && sel.focusNode.parentElement && sel.focusNode.parentElement.previousElementSibling))
                    {
                        // passe en haut
                        var nIndiceTd =jqTdSelectionne.index();
                        changeFocusTd(jqTdSelectionne[0].parentElement.previousElementSibling.children[nIndiceTd]);

                    }
                }
            }

            // stop la propagation si l'event a ete traite
            if (bEventTraite)
            {
                jqEvent.stopPropagation();
                jqEvent.preventDefault();                      
            }
        });

        function TraiteTable(jqTable,oFormat)
        {
            var bLecture = oFormat===undefined;
            if (!oFormat) oFormat = { id : WDSaisieAPI.uuidv4(), table : { tr : [] } };

            TraiteAttributsEtStyle(oFormat.table,jqTable,bLecture);

            jqTable.add(jqTable.children("tbody,thead,tfoot")).children("tr").each(function(iLigne){
                var jqLigne = $(this);
                var oLigne = iLigne<oFormat.table.tr.length ? oFormat.table.tr[iLigne] : oFormat.table.tr[oFormat.table.tr.push({td : []})-1];
                TraiteAttributsEtStyle(oLigne,jqLigne,bLecture);
                jqLigne.children("td,th").each(function(iCell){
                    var oCellule = iCell<oLigne.td.length ? oLigne.td[iCell] : oLigne.td[oLigne.td.push({})-1];
                    // indique la cellule qui a la selection courante
                    if (bLecture && this === jqTdSelectionne[0])
                        oCellule.focus = true;
                    TraiteAttributsEtStyle(oCellule,$(this),bLecture);
                });                    
            });
            return bLecture ? JSON.stringify(oFormat) : true;
        }

        // fixe l element courant pour les rappels de la OBJ
        oSaisie.m_oElementCourant = {};
        oSaisie.m_oElementCourant[oSaisie.sGetWLEXEC('JSEXEC_ELEMENTCOURANT_READTABLE')] = function()
        {
            return TraiteTable(jqTableSelectionne); 
        };
        oSaisie.m_oElementCourant[oSaisie.sGetWLEXEC('JSEXEC_ELEMENTCOURANT_WRITETABLE')] = function(sFormatJSON)
        { 
            try {
                var oValeur = (typeof sFormatJSON === "object") ? sFormatJSON : JSON.parse(sFormatJSON);
            }
            catch(e)
            {
                return false;
            }                 
            return oSaisie.EmpileUndoRedo(jqTableSelectionne, () => TraiteTable(jqTableSelectionne,oValeur) );
        };

        function PopupAffichePropTable(sEdition,jsonValeur)
        {
            // Conversion du JSON vers le formulaire
            try {
                var oValeur = JSON.parse(jsonValeur);
            }
            catch(e)
            {
                return;
            }
            if(!oValeur.table) return;
    
            // affiche la popup d'edition de proprietes
            var oPopup = PopupAfficheProp(oSaisie.m_oElementCourant[oSaisie.sGetWLEXEC('JSEXEC_ELEMENTCOURANT_WRITETABLE')],jqTableSelectionne,oValeur);
            oPopup.ajouteAttrStyle(oValeur.table);
    
            // TODO ajouter les infos des lignes colonnes et cellules
    
            // Selon sEdition, bascule sur un volet ou un autre
            //             WLEXEC_EDITTABLE},
            //             WLEXEC_EDITTABLEROW}
            //             WLEXEC_EDITTABLECOL}
            //             WLEXEC_EDITTABLECEL}
        }

        function copyAttributes(domCellSrc,domCellDst) {    
            if (!domCellSrc.hasAttributes()) return;
            for(var i = domCellSrc.attributes.length - 1; i >= 0; i--) 
            {
                domCellDst.setAttribute(domCellSrc.attributes[i].name, domCellSrc.attributes[i].value);
            }
        }

        function ajouteLigne(bBefore)
        {
            var nNbCols = 0;
            jqTableSelectionne.find("tr").first().children("td").each(function(){
                nNbCols += parseInt( this.getAttribute( 'colspan' ) || 1 )
            });
            var domTr =jqTableSelectionne[0].insertRow(jqTdSelectionne.parent().index() + (bBefore ? 0 : 1) );
            for(var iCell=0; iCell<nNbCols; ++iCell)
            {                
                copyAttributes(jqTdSelectionne.get(0),domTr.insertCell(iCell));
            }
            return domTr;
        }

        //ré écoute
        jqUlBarreFaaTable.children().each(function()
        {
            $(this).on("click.wb.saisieriche.barretable",function(jqEvent)
            {
                //clic sur un niveau de table
                if (!jqTdSelectionne || !jqTdSelectionne.length) return;

                    jqEvent.stopPropagation();
                    jqEvent.preventDefault();

                jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");

                var oOptions = tabOptionTable[ $(this).index() ];
                oSaisie.EmpileUndoRedo(jqTableSelectionne, () =>
                {
                    var bBefore= false;
                    switch (oOptions.action)
                    {
                    case "ROW.BEFORE":
                        bBefore=true;
                        /*break absent*/
                    case "ROW.AFTER":
                        ajouteLigne(bBefore);
                        break;
                    case "ROW.DELETE":
                        var nIndice = jqTdSelectionne.parent().index();
                        jqTdSelectionne = jqTdSelectionne.parent().siblings().first().children().eq(jqTdSelectionne.index());
                        jqTableSelectionne[0].deleteRow(nIndice);
                        break;
                    case "COLUMN.BEFORE":
                        bBefore=true;
                        /*break absent*/
                    case "COLUMN.AFTER":
                        var nIndiceCol = jqTdSelectionne.index() + (bBefore ? 0 : 1);
                        jqTableSelectionne.find("tr").each(function(){
                           copyAttributes(jqTdSelectionne.get(0),this.insertCell(nIndiceCol));
                        });
                        break;
                    case "COLUMN.DELETE":
                        var nIndice = jqTdSelectionne.index();
                        jqTdSelectionne = jqTdSelectionne.next().add(jqTdSelectionne.siblings().first()).last();
                        jqTableSelectionne.find("tr").each(function(){
                           this.deleteCell(nIndice);
                        });
                        break;
                    case "WLEXEC":
                        ((!windowPrincipale.WL || oSaisie.m_bModeWeb) ? PopupAffichePropTable : windowPrincipale.WL.Execute)(oOptions.param,TraiteTable(jqTableSelectionne));
                        // et arrete pour ne pas reselectionner le tableau
                        jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
                        return false;
                    default:
                        return false;//blindage
                    }

                    //met à jour la barre
                    jqTdSelectionne.addClass('wbSaisieRicheTdSelectionne');
                    //pas possible à cause du undo redo car jqTdSelectionne n'est plus le même setTimeout(function(){jqBody.trigger("trigger.wb.saisieriche.selectionne",jqTdSelectionne);},100);
                    jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
                    return true;
                },
                (bSucces,jqBaliseApresRedo) => {
                    jqTdSelectionne = jqBaliseApresRedo.find(".wbSaisieRicheTdSelectionne");
                    jqTdSelectionne.removeClass('wbSaisieRicheTdSelectionne');
                    if (!bSucces)
                    {
                        jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
                        return false;
                    }
                    SurClickTable(jqTdSelectionne);
                    //pas possible à cause du undo redo car jqTdSelectionne n'est plus le même setTimeout(function(){jqBody.trigger("trigger.wb.saisieriche.selectionne",jqTdSelectionne);},100);
                    return true;
                });
            });
        });

        PositionMiniBarre(oRectTable, jqUlBarreFaaTable, undefined, true);
    }
    function SurClickLien(jqTarget,jqEvent)
    {

        if (jqBody[0].parentElement.wdSaisieRiche)
        {
            //vérifie que l'édition de lien est dispo dans la barre de FAA principale
            var oElementBarre = jqBody[0].parentElement.wdSaisieRiche.oGetElementByIdBarre(parent.document,"LNK");
            if (oElementBarre && !clWDUtil.bEstDisplay(oElementBarre, parent.document))
            {
                //ignore
                return;
            }
        }
        else
        {
            if (!oSaisie.m_oOptions.bGestionLiens)
            {

                // en l'absence de gestion des liens le clic envoie une notif au WL
                if (jqEvent.ctrlKey && window.WL) WL.Execute(oSaisie.sGetWLEXEC('WLEXEC_CLICLIEN'), jqTarget[0].href);

                return;
            }
        }


        jqTarget.addClass("wbSaisieRicheLienSelectionne");

        //change la sélection? bof car on ne pourrait plus modifier le texte du lien
        //CreerRangeSelectionTexteSurBaliseCible(jqTarget[0]);
        
        //affiche mini barre de lien

        var jqLienSelectionne = jqTarget;
        var oRectLien = rectGetPositionTaille(jqTarget);

        //ré écoute
        jqUlBarreFaaLien.children().each(function()
        {
            $(this).on("click.wb.saisieriche.barrelien",function(jqEvent)
            {

                //clic sur option de lien
                if (!jqLienSelectionne || !jqLienSelectionne.length) return;

                    jqEvent.stopPropagation();
                    jqEvent.preventDefault();

                jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");

                var oOptions = tabOptionLien[ $(this).index() ];
                if (!oOptions.fAction)
                    return;//blindage
                                    
                                   
                oSaisie.EmpileUndoRedo(jqLienSelectionne, () => oOptions.fAction(jqLienSelectionne) ,(bSucces,jqBaliseApresRedo) => {
                    jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
                    //met à jour la barre
                    if (bSucces) setTimeout(function(){jqBody.trigger("trigger.wb.saisieriche.selectionne",jqBaliseApresRedo);},100);                    
                });                 
            
            });
        });

        PositionMiniBarre(oRectLien, jqUlBarreFaaLien);
    }

    function PositionTrackersMarge(oRectImg,imgSelectionee)
    {
        //que sur les images
        if (!imgSelectionee || !imgSelectionee[0]) return;

            //trackers de marge

                // div#wbSaisieRicheTrackerMargeWrap {
                //     border-top-width: 20px;
                //     border-right-width: 20px;
                //     border-bottom-width: 20px;
                //     border-left-width: 30px;
                //     margin-top:-20px;
                //     margin-right: -20px;
                //     margin-bottom:-20px;
                //     margin-left:-30px;
                // }

                // div#wbSaisieRicheTrackerMargeT {
                //     margin-top: -20px;
                // }

                // div#wbSaisieRicheTrackerMargeR {
                //     margin-left: 20px;
                // }
                // div#wbSaisieRicheTrackerMargeL {
                //     margin-left: -30px;
                // }

                // div#wbSaisieRicheTrackerMargeB {
                //     margin-top: 20px;
                // }
        
        ['top','right','bottom','left'].forEach(function(element, index/*, array*/)
        {                           
            var sCss = "margin" + element[0].toUpperCase() + element.substr(1);
            var nVal = oRectImg[sCss  ];
                jqWrapperMargin.css("border-" + element + '-width', nVal).css(sCss, -nVal);               
        });
        jqTrackerMarginT.css("marginTop",-oRectImg.marginTop).finish().fadeIn();
        jqTrackerMarginR.css("marginLeft",oRectImg.marginRight).finish().fadeIn();
        jqTrackerMarginL.css("marginLeft",-oRectImg.marginLeft).finish().fadeIn();
        jqTrackerMarginB.css("marginTop",oRectImg.marginBottom).finish().fadeIn();

        //TODO 26 marge pour l'habillage centré et étiré 
        if (imgSelectionee[0].style.width == "100%" || imgSelectionee[0].style.margin.indexOf("auto")>-1)
        {
            jqTrackerMarginR.finish().fadeOut();
            jqTrackerMarginL.finish().fadeOut();
        }

    }

    function PositionWrapperSelection(oRectImg,imgSelectionee,bLaissePasserLEditionDuContenu)
    {
        if (!jqBody.find(".wbSaisieRicheWrapperSelection").length)
        {
            jqBody.append(jqWrapperSelection);
            jqWrapperSelection.css({
                width: oRectImg.width,
                height: oRectImg.height,
                top: oRectImg.top,
                left : oRectImg.left,
                transform : oRectImg.transform ,
                transformOrigin: oRectImg.transformOrigin
            });
            if (bLaissePasserLEditionDuContenu)
            {
                // TODO trouver mieux pour que le TD de tableau soit editable
                jqWrapperSelection.css({height:0});
            }

                PositionTrackersMarge(oRectImg,imgSelectionee);
        }
    }
    function PositionTrackers(oRectImg,jqTrackers,imgSelectionee,bLaissePasserLEditionDuContenu)
    {
    PositionWrapperSelection(oRectImg,imgSelectionee,bLaissePasserLEditionDuContenu);
    jqWrapperSelection.append(jqTrackers);


    }      

    function SurErreurLoadImg(e,jqImage)
    {
        //prévenir ? toast ?
        //e => erreur pouvant être de CORS, mais impossible de trouver le texte dans l'event
    // Mon_Projet49:1 Access to image at 'https://i.stack.imgur.com/WSmLn.png?s=32&g=1' from origin 'http://localhost' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    // 16:35:03.305 i.stack.imgur.com/WSmLn.png?s=32&g=1:1 Failed to load resource: net::ERR_FAILED
        if (jqImage && jqImage.effect) jqImage.effect("shake",{distance:5},250);
        if (oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.ERR')) alert(oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.ERR'));
    }    

    function PositionMiniBarre(oRectChamp, jqMiniBarre, imgSelectionee, bLaissePasserLEditionDuContenu)
    {
        // TODO tenir compte du scroll 
        PositionWrapperSelection(oRectChamp,imgSelectionee,bLaissePasserLEditionDuContenu);
        jqWrapperSelection.append(jqMiniBarre);

        //positionne le barre aux limites
        var oPositionBarreImg = {
            //raz //décalé de la marge de l'image
            top:-oRectChamp.marginTop,left: 0,//non, juste décalage en hauteur car reste toujours centré sur l'image et pas centré sur le rect avec marges (imgSelectionee[0].style.float == "right" ? -oRectChamp.marginRight : oRectChamp.marginLeft),
            marginTop: "",
            //set
            marginLeft: (oRectChamp.width/2 - jqMiniBarre.width()/2),
            transform: oRectChamp.transform.split("rad").map(function(a){ return a.split("rotateZ(")[1];}).map(function(a){ return !a ? "" : "rotateZ(" + (-1*parseFloat(a)) + "rad)";}).join(" ")
        };
        if (oRectChamp.top-oRectChamp.marginTop < jqMiniBarre.height()+5/*blanc arbitraire*/)
        {
            //cale en bas de l'image
            oPositionBarreImg.top = oRectChamp.height + jqMiniBarre.height();
            oPositionBarreImg.marginTop = "calc(-1.5rem + 3px)";
        }
        if (oRectChamp.left + oPositionBarreImg.marginLeft < 0)
        {
            //cale sur le bord gauche
            oPositionBarreImg.marginLeft = 0;
        }
        else if ( (oRectChamp.left + oPositionBarreImg.marginLeft + jqMiniBarre.width()) > jqBody.width())
        {
            //cale à droite
            oPositionBarreImg.left =  - jqMiniBarre.width() + oRectChamp.width;
            oPositionBarreImg.marginLeft = 0;
        }

        jqMiniBarre.css(oPositionBarreImg);                  
    }

    function SurClickImg(jqTarget,jqEvent)
    {
        if (jqBody[0].parentElement.wdSaisieRiche)
        {
            //vérifie que l'édition de lien est dispo dans la barre de FAA principale
            var oElementBarre = jqBody[0].parentElement.wdSaisieRiche.oGetElementByIdBarre(parent.document,"IMG");
            if (oElementBarre && !clWDUtil.bEstDisplay(oElementBarre, parent.document))
            {
                //ignore
                return;
            }
        }

        jqTarget.addClass("wbSaisieRicheImgSelectionne");

        oSaisie.CreerRangeSelectionTexteSurBaliseCible(jqTarget[0],true);

        //création des coins de trackers 

        //position des trackers 
        var oRectImg = rectGetPositionTaille(jqTarget);
        //pour le transmettre au wrapper
        oRectImg.transform = jqTarget[0].style.transform;
        oRectImg.transformOrigin = jqTarget[0].style.transformOrigin;

        var imgSelectioneeX = oRectImg.left;
        var imgSelectioneeY = oRectImg.top;
        
        var imgSelectionee = jqTarget;
        var imgSelectioneeGhost ;
        var bulleResize ;
        var tabInfoPoigneeSelectionee;
        var nPosXDebutResize;
        var nPosYDebutResize;
        var nLargeurDebutResize;
        var nHauteurDebutResize;
        var ratio ;
        var width;
        var height;

    var startScrollWidth ;
    var startScrollHeight;       

        var onRedimensionneGhost = function (jqEvent) {
            var deltaX, deltaY, bConserveProportion;
            var bulleResizeX, bulleResizeY;

        //maj la différence de taille
            deltaX = jqEvent.screenX - nPosXDebutResize;
            deltaY = jqEvent.screenY - nPosYDebutResize;

            //maj la nouvelle taille
            width = deltaX * tabInfoPoigneeSelectionee[2] + nLargeurDebutResize;
            height = deltaY * tabInfoPoigneeSelectionee[3] + nHauteurDebutResize;

            //borne de resize ? 
            //width = width < 5 ? 5 : width;
            //height = height < 5 ? 5 : height;

            bConserveProportion = imgSelectionee.is("img") && !jqEvent.shiftKey;

            // respect des proportions
            if (bConserveProportion) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                height = Math.round(width * ratio);
                width = Math.round(height / ratio);
            } else {
                width = Math.round(height / ratio);
                height = Math.round(width * ratio);
            }
            }

            // applique la taille dans le dom
            imgSelectioneeGhost.css({
            width:width,
            height:height
            });

            // maj la bulle
            bulleResizeX = tabInfoPoigneeSelectionee.startPos.x + deltaX;
            bulleResizeY = tabInfoPoigneeSelectionee.startPos.y + deltaY;
            bulleResizeX = bulleResizeX > 0 ? bulleResizeX : 0;
            bulleResizeY = bulleResizeY > 0 ? bulleResizeY : 0;

            bulleResize.css({
            left: bulleResizeX,
            top: bulleResizeY,
            display: 'block'
            });

            bulleResize[0].innerHTML = Math.round(width) + ' &times; ' + Math.round(height);

            // maj le ghost
            if (tabInfoPoigneeSelectionee[2] < 0 && imgSelectioneeGhost[0].clientWidth <= width) {
            imgSelectioneeGhost.css('left', imgSelectioneeX + (nLargeurDebutResize - width));
            }
            if (tabInfoPoigneeSelectionee[3] < 0 && imgSelectioneeGhost[0].clientHeight <= height) {
            imgSelectioneeGhost.css('top', imgSelectioneeY + (nHauteurDebutResize - height));
            }

            // positionne la bulle
            deltaX = jqBody[0].scrollWidth - startScrollWidth;
            deltaY = jqBody[0].scrollHeight - startScrollHeight;
            if (deltaX + deltaY !== 0) {
            bulleResize.css({
                left: bulleResizeX - deltaX,
                top: bulleResizeY - deltaY
            });
            }
        };        

        var onFinRedimensionneGhost = function () {

            // applique la taille sur l'image réelle
            imgSelectionee.removeAttr("width").css("width", width);
            imgSelectionee.removeAttr("height").css("height", height);

            jqBody.removeClass("wbSaisieRicheIframeBodyDragEnCours").css("cursor","");

            jqBody.off('mousemove.wb.saisieriche.redimensionne', onRedimensionneGhost);
            jqBody.off('mouseup.wb.saisieriche.redimensionne', onFinRedimensionneGhost);            

            // retire le ghost et la bulle
            imgSelectioneeGhost.remove();
            bulleResize.remove();

            //actualise la position des trackers
            setTimeout(function(){
                jqBody.trigger("trigger.wb.saisieriche.selectionne", imgSelectionee);
            },1);
        };        

        var onDebutDragTracker = function (handle,jqEvent)
        {
        tabInfoPoigneeSelectionee = handle;
        nPosXDebutResize = jqEvent.screenX;
        nPosYDebutResize = jqEvent.screenY;
        nLargeurDebutResize = imgSelectionee.width();
        nHauteurDebutResize = imgSelectionee.height();
        ratio = nHauteurDebutResize / nLargeurDebutResize;
        
        tabInfoPoigneeSelectionee.startPos = {
            x: oRectImg.width * tabInfoPoigneeSelectionee[0] + imgSelectioneeX,
            y: oRectImg.height * tabInfoPoigneeSelectionee[1] + imgSelectioneeY
        };

        startScrollWidth = jqBody[0].scrollWidth;
        startScrollHeight = jqBody[0].scrollHeight;

        imgSelectioneeGhost = imgSelectionee.clone(true);
        imgSelectioneeGhost.addClass('wbSaisieRicheImgGhost');
        imgSelectioneeGhost[0].contentEditable = false; // masque le curseur sous IE
        imgSelectioneeGhost[0].unSelectabe = true;
        imgSelectioneeGhost.css({
            left: imgSelectioneeX,
            top: imgSelectioneeY,
            marginRight: 0,marginBottom: 0,
            marginTop : - parseInt(getComputedStyle(imgSelectionee[0]).borderTopWidth) ,
            marginLeft : - parseInt(getComputedStyle(imgSelectionee[0]).borderLeftWidth) ,
        });

        imgSelectioneeGhost.removeClass('wbSaisieRicheImgSelectionne');
        jqBody.append(imgSelectioneeGhost);

        jqBody.css("cursor",$(jqEvent.target).css("cursor")).addClass("wbSaisieRicheIframeBodyDragEnCours");

        jqBody.on('mousemove.wb.saisieriche.redimensionne', onRedimensionneGhost);
        jqBody.on('mouseup.wb.saisieriche.redimensionne', onFinRedimensionneGhost);

        jqBody.append(bulleResize=$('<div class="wbSaisieRicheImgBulle">' + Math.round(nLargeurDebutResize) + ' &times; ' + Math.round(nHauteurDebutResize) + '</div>'));

        bulleResize.css({
            left: imgSelectioneeX + nLargeurDebutResize,
            top: imgSelectioneeY + nHauteurDebutResize
        });          

        };
        //sur les trackers de redimensionnement
        jqTrackers.not(".wbSaisieRicheTrackerMargeWrap").each(function(){
            $(this).one('mousedown.wb.saisieriche.redimensionne',function (jqEvent) {
            jqEvent.stopPropagation();
            jqEvent.preventDefault();

            if ($(this).hasClass("wbSaisieRicheTrackerCoinShift"))
            {

                var nPosXInitRotation = imgSelectionee.offset().left + oRectImg.width/2;
                var nPosYInitRotation = imgSelectionee.offset().top + oRectImg.height/2; 

                var oSensRotation = oRotationParTracker[jqEvent.target.id];
                
                var dAngleDecalage = Math.atan( (oRectImg.height*oSensRotation[1])/(oRectImg.width*oSensRotation[0]));

                var sAngleDepart = imgSelectionee[0].style.transform;

                var onFinRotation = function () 
                {
                    jqBody.off('mousemove.wb.saisieriche.rotation', onRotation);
                    jqBody.off('mouseup.wb.saisieriche.rotation', onFinRotation);            

                    //actualise la position des trackers
                    setTimeout(function(){
                        jqBody.trigger("trigger.wb.saisieriche.selectionne", imgSelectionee);
                    },1);


                };        
                var onRotation = function (jqEvent) 
                {                   
                    var nLargeurAdj = jqEvent.pageX - nPosXInitRotation;
                    var nHauteurOpp = jqEvent.pageY - nPosYInitRotation;

                    var dAngle = Math.atan(nHauteurOpp / nLargeurAdj);

                    imgSelectionee[0].style.transform = sAngleDepart + " rotateZ(" + (dAngleDecalage+dAngle) + "rad)";
                };

                jqBody.on('mousemove.wb.saisieriche.rotation', onRotation);
                jqBody.on('mouseup.wb.saisieriche.rotation', onFinRotation);



                return;
            }


            onDebutDragTracker(oEchelleParTracker[jqEvent.target.id],jqEvent);
            });
        });

        //trackers de marge
        jqWrapperMargin.children().each(function(){

            var sMarge = "margin";
            var sCoordSouris = "page";
            var bSensInverse = false;
            switch(this.id)
            {
                case 'wbSaisieRicheTrackerMargeT':
                    sMarge+="Top";
                    sCoordSouris+="Y";
                    bSensInverse = true;
                    break;
                case 'wbSaisieRicheTrackerMargeR':
                    sMarge+="Right";
                    sCoordSouris+="X";
                    bSensInverse = false;
                    break;
                case 'wbSaisieRicheTrackerMargeB':
                    sMarge+="Bottom";
                    sCoordSouris+="Y";
                    bSensInverse = false;
                    break;
                case 'wbSaisieRicheTrackerMargeL':
                    sMarge+="Left";
                    sCoordSouris+="X";
                    bSensInverse = true;
                    break;
                default:
            }
            var onMargin = undefined;
            var jqBulleMarge = $();
            var onFinMargin = function () 
            {
                jqBody.off('mousemove.wb.saisieriche.margin', onMargin);
                jqBody.off('mouseup.wb.saisieriche.margin', onFinMargin);     

                //applique les marges
                imgSelectionee.css(//sMarge,oRectImg[sMarge]);     
                {
                    'marginTop':oRectImg.marginTop,
                    'marginRight':oRectImg.marginRight,
                    'marginBottom':oRectImg.marginBottom,
                    'marginLeft':oRectImg.marginLeft
                });

                jqBulleMarge.remove();

                //actualise la position des trackers
                //oRectImg = rectGetPositionTaille(imgSelectionee);
                jqWrapperSelection.css("margin","");
                jqBody.removeClass("wbSaisieRicheIframeBodyDragEnCours").css("cursor","");

                jqWrapperMargin
                .removeClass("wbSaisieRicheTrackerMargeMagnetismeT")
                .removeClass("wbSaisieRicheTrackerMargeMagnetismeR")
                .removeClass("wbSaisieRicheTrackerMargeMagnetismeB")
                .removeClass("wbSaisieRicheTrackerMargeMagnetismeL")
                ;

                setTimeout(function(){
                    jqBody.trigger("trigger.wb.saisieriche.selectionne", imgSelectionee);
                },1);
            };        

            var jqTrackerMarginCourant = $(this);
            jqTrackerMarginCourant
            .one('click.wb.saisieriche.margin',function (jqEvent) 
                {
                jqEvent.stopPropagation();
                jqEvent.preventDefault();                     
                //ne laisse pas remonter                  
            })
            .one('dblclick.wb.saisieriche.margin',function (jqEvent) 
                {
                jqEvent.stopPropagation();
                jqEvent.preventDefault();       
                var bAvecCtrl = (jqEvent && (jqEvent.ctrlKey || jqEvent.which == 17));
                var nVal = prompt(oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.MRG') || "Margin ?",oRectImg[sMarge]);
                if( nVal!==undefined)
                {
                    oRectImg[sMarge] = parseFloat(nVal);
                    if (bAvecCtrl)
                    {
                        oRectImg.marginTop = oRectImg.marginRight = oRectImg.marginBottom = oRectImg.marginLeft = oRectImg[sMarge];
                    }
                    onFinMargin();
                }
            })
            .one('mousedown.wb.saisieriche.margin',function (jqEvent) 
            {
                jqEvent.stopPropagation();
                jqEvent.preventDefault();

                var nPosXYInitTrackerMarge = jqEvent[sCoordSouris];               
                
                var bBloqueInversion = false;
                var nSensDefaut = 1;

                var oRectMargeInit = {
                    'marginTop':oRectImg.marginTop,
                    'marginRight':oRectImg.marginRight,
                    'marginBottom':oRectImg.marginBottom,
                    'marginLeft':oRectImg.marginLeft
                };

                var oRectImgInit = {
                    'width' : oRectImg.width
                };

                jqBody.append(jqBulleMarge=$('<div class="wbSaisieRicheImgBulle"></div>'));

                //mon curseur pendant le drag
                jqBody.css("cursor",jqTrackerMarginCourant.css("cursor")).addClass("wbSaisieRicheIframeBodyDragEnCours");

                
                majBulle = function(){

                    var oPositionTracker = jqTrackerMarginCourant.offset();
                    jqBulleMarge[0].innerHTML = Math.round(oRectImg[sMarge]) + '&nbsp;px';
                    // maj la bulle
                    var bulleMarginX = oPositionTracker.left;
                    var bulleMarginY = oPositionTracker.top + jqBulleMarge.height();
                    bulleMarginX = bulleMarginX > 0 ? bulleMarginX : 0;
                    bulleMarginY = bulleMarginY > 0 ? bulleMarginY : 0;

                    jqBulleMarge.css({
                        left: bulleMarginX,
                        top: bulleMarginY,
                        //display: 'block'
                    });

                };
                majBulle();
                jqBulleMarge.hide().delay(150).fadeIn(150);//pour ne pa s'afficher en cas de double clic

                onMargin = function (jqEvent) 
                {                   
                    if (!bBloqueInversion && oRectMargeInit[sMarge]==0)
                    {
                        nSensDefaut=1;
                        if (bSensInverse)
                        {
                            if (jqEvent[sCoordSouris] > nPosXYInitTrackerMarge) 
                            {
                                nSensDefaut=-1;
                            }
                        }
                        else 
                        {
                            if (jqEvent[sCoordSouris] < nPosXYInitTrackerMarge)
                            {
                                nSensDefaut=-1;
                            }
                        }
                    }
                    var nSens=nSensDefaut * (bSensInverse ? -1 : 1);

                    var nIncrementMarge = (jqEvent[sCoordSouris] - nPosXYInitTrackerMarge) * nSens;

                    var INVERSION_THRESHOLD = 5;
                    var MAGNETISME_THRESHOLD = 10;

                    //pas d'augmentation de marge par drag vers l'intérieur passé un certain point
                    if (Math.abs(nIncrementMarge)>INVERSION_THRESHOLD) bBloqueInversion=true;

                    oRectImg[sMarge] = Math.max(0,oRectMargeInit[sMarge] + nIncrementMarge);

                    var bAvecShift = (jqEvent && (jqEvent.shiftKey || jqEvent.which == 16));
                    var bAvecCtrl = (jqEvent && (jqEvent.ctrlKey || jqEvent.which == 17));

                    //magnétisme à 0                    
                    if (!bAvecShift && Math.abs(oRectImg[sMarge]-oRectMargeInit[sMarge])>MAGNETISME_THRESHOLD && Math.abs(oRectImg[sMarge])<MAGNETISME_THRESHOLD && oRectMargeInit[sMarge]>MAGNETISME_THRESHOLD) oRectImg[sMarge] = 0;
                        //magnéstime aux autres
                    ['Top','Right','Bottom','Left'].forEach(function(element, index/*, array*/)
                {

                    //loin du début de son propre drag et près d'un autre
                        if (!bAvecCtrl && !bAvecShift && sMarge.substr("margin".length)!=element && Math.abs(oRectImg[sMarge]-oRectMargeInit[sMarge])>MAGNETISME_THRESHOLD && Math.abs(oRectImg[sMarge]-oRectImg["margin"+element])<MAGNETISME_THRESHOLD)
                        {
                            oRectImg[sMarge] = oRectImg["margin"+element];
                            jqWrapperMargin.addClass("wbSaisieRicheTrackerMargeMagnetisme" + element[0]);
                        }
                        else jqWrapperMargin.removeClass("wbSaisieRicheTrackerMargeMagnetisme" + element[0]);
                });

                    if (bAvecCtrl)
                    {
                    oRectImg.marginTop = oRectImg.marginBottom = oRectImg[sMarge];
                    //TODO 26 marge en étiré ou centré
                    if (imgSelectionee[0].style.width == "100%" || imgSelectionee[0].style.margin.indexOf("auto")>-1)
                    {
                        //à autoriser 
                    }
                    else oRectImg.marginRight = oRectImg.marginLeft = oRectImg[sMarge];
                    }

                    majBulle();

                    //actualise uniquement la marge pendant le drag
                    PositionTrackersMarge(oRectImg, imgSelectionee);

                    //applique les marges
                    imgSelectionee.css(//sMarge,oRectImg[sMarge]);     
                    {
                        'marginTop':oRectImg.marginTop,
                        'marginRight':oRectImg.marginRight,
                        'marginBottom':oRectImg.marginBottom,
                        'marginLeft':oRectImg.marginLeft
                    });
                    PositionTrackers(oRectImg,jqTrackers,imgSelectionee);  
                    var oNouvelleMargePos = {
                        'marginTop':oRectImg.marginTop-oRectMargeInit.marginTop,                        
                        'marginLeft':oRectImg.marginLeft-oRectMargeInit.marginLeft,
                    };
                    if (imgSelectionee[0].style.float == "right")
                        oNouvelleMargePos.marginLeft = oRectMargeInit.marginRight - oRectImg.marginRight;

                    jqWrapperSelection  .css(//sMarge,oRectImg[sMarge]);     
                    oNouvelleMargePos);
                };

                jqBody.on('mousemove.wb.saisieriche.margin', onMargin);
                jqBody.on('mouseup.wb.saisieriche.margin', onFinMargin);

            });
        });

        
        PositionTrackers(oRectImg,jqTrackers,imgSelectionee);

        //ré écoute
        jqUlBarreFaaImg.children().each(function()
        {
            var onClickMiniBarraFaaUl = function(jqEvent)
            {
                //clic sur option d'habillage
                if (!imgSelectionee || !imgSelectionee.length) return;

                    !jqEvent||jqEvent.stopPropagation();//évite de remonter à la sélection d'une image
                    !jqEvent||jqEvent.preventDefault();

                var oOptions = tabOptionImg[ $(this).index() ];

                if (oOptions.action && oOptions.action=='MODIFIER_SRC')
                {
                    if (windowPrincipale.wbEditeurImageFactory)
                    {
                        // lance l'éditeur d'image
                        var domRoot = windowPrincipale.wbEditeurImageFactory(function(dataURI)
                        {
                                // appelé en validation de l'éditeur d'image
                                // dataURI est undefined en cas d'annulation
                                if (dataURI)
                                {
                                        $(imgSelectionee).one("load.wb.saisieriche.chargementApresEditeurImage",function(){
                                        //reset le ratio après changement d'image
                                        oOptions.height = "auto";
                                        //actualise la position des trackers
                                        jqBody.trigger("trigger.wb.saisieriche.selectionne", imgSelectionee);
                                        });
                                        imgSelectionee[0].src = dataURI;
                                }
                        }
                        ,
                        imgSelectionee[0].src
                        );
                        //donne le focus
                        $(domRoot).hide().fadeIn().focus();//sugg en slide up ? transform: translate3d(0px, 38px, 0px); opacity: 0; transition: all 0.2s cubic-bezier(0.4, 0, 1, 1) 0s;
                        //ferme la barre
                        if (document.body.parentElement.wdSaisieRiche) document.body.parentElement.wdSaisieRiche.RafBarre(undefined,false);
                    }
                    // rappelle le champ editeur html en wlangage
                    else if (windowPrincipale.WL)
                    {
                        ((!windowPrincipale.WL || oSaisie.m_bModeWeb) ? PopupAffichePropImg : windowPrincipale.WL.Execute)(oSaisie.sGetWLEXEC('WLEXEC_EDITIMAGE'),TraiteImg(imgSelectionee));
                        // et arrete pour ne pas reselectionner l'image
                        jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
                        return;
                    }
                    else
                    {
                        var sVal = prompt(oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.IMG') || "Image ?", imgSelectionee[0].src.indexOf("data")==0 ? "http://" : imgSelectionee[0].src);
                        if (!sVal)
                            return;
                        imgSelectionee[0].src = sVal;
                        //reset le ratio après changement d'image
                        oOptions.height = "auto";

                    }
                } 
                else if (oOptions.action && oOptions.action=='MODIFIER_ALT')
                {
                    var sVal = prompt(oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.ALT') || "Alt ?", imgSelectionee[0].alt||imgSelectionee[0].title);
                        if (!sVal)
                            return;

                        imgSelectionee[0].alt = sVal;
                        imgSelectionee[0].title = sVal;
                }                   
                else if (oOptions.action && oOptions.action=='ROTATE_CLOCKWISE_COPY')
                {
                    if (imgSelectionee[0].src.indexOf("data")!=0)
                    {
                        if (!confirm(oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.CPY') || "Continue ?"))
                            return;
                    }
                        try
                        {
                            var nAngle = -Math.PI/2;
                            imgSelectionee[0].style.width =imgSelectionee.width();
                            imgSelectionee[0].style.height =imgSelectionee.height();
                        var oCrop = {
                                w : imgSelectionee.height()
                            ,    h : imgSelectionee.width()
                            };
                            var image = new Image();
                            var canvas = $("<canvas>");
                            canvas.attr({
                                width : oCrop.w
                            ,    height :oCrop.h
                            });
                            var ctx = canvas[0].getContext('2d');
                            image.setAttribute('crossOrigin', 'anonymous');
                            image.onload = function()
                            {   
                                var x = canvas[0].width / 2;
                                var y = canvas[0].height / 2;
                                var width = image.width;
                                var height = image.height;
                                ctx.translate(x, y);
                                ctx.rotate(-nAngle);
                                ctx.scale(imgSelectionee.width() / width, imgSelectionee.height() / height);
                                ctx.drawImage(image, -width / 2, -height / 2, width, height);                                
                                ctx.rotate(nAngle);
                                ctx.translate(-x, -y);

                                imgSelectionee[0].src = canvas[0].toDataURL();

                                //imgSelectionee[0].style.width =oCrop.w+"px";
                                //imgSelectionee[0].style.height =oCrop.h+"px";   
                                jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
                                imgSelectionee.css("opacity",0).animate({width : oCrop.w,height : oCrop.h, opacity : 1},{easing: $.ui ? 'easeOutExpo' : 'swing',duration:250,done:function(){
                                    jqBody.trigger("trigger.wb.saisieriche.selectionne", imgSelectionee);
                                    imgSelectionee.css("opacity","");
                                }}) ;

                                //raz de la rotation 
                                imgSelectionee[0].style.transform = "";  
                                //maj le rect 
                                //oRectImg = rectGetPositionTaille(imgSelectionee);                      
                                oRectImg.width = oCrop.w;
                                oRectImg.height = oCrop.h;
                        };
                        image.onerror = function(e) { return SurErreurLoadImg(e,imgSelectionee); };


                            image.src = imgSelectionee[0].src;
                        }
                        catch(e)
                        {
                            SurErreurLoadImg(e,imgSelectionee);
                            imgSelectionee[0].style.transform = ""; 
                        }  
                        return;//pas de sélection tout de suite                              
                }
                else if (oOptions.action && oOptions.action=='ROTATE_CLOCKWISE')
                {
                    var nRotationEnCours = imgSelectionee.attr("data-wbSaisieRicheImgRotate") || 0;

                    var nRotation = (parseInt(nRotationEnCours) + 1) % 4;

                    imgSelectionee.attr("data-wbSaisieRicheImgRotate",nRotation);

                    var nLargeur = parseFloat(imgSelectionee[0].style.width) || imgSelectionee.width();
                    var nHauteur = parseFloat(imgSelectionee[0].style.height) ||imgSelectionee.height();

                    //90 270
                    if (nRotation == 1 || nRotation == 3)
                    {
                        //inverse les dimensions d'occupation d'espace
                        var nMargeRight =  nHauteur - nLargeur;
                        var nMargeBottom = - nMargeRight;
                        imgSelectionee
                            .css("transition","150ms transform ease-out,150ms margin ease-out")
                            .css("width",nLargeur)
                            .css("height",nHauteur)
                            .css("transformOrigin","center center")
                            .css("margin","0 " + nMargeRight + "px " + nMargeBottom + "px 0")
                            .css("transform","translateX(" + (-nLargeur/2 + nHauteur/2) + "px) translateY(" + (nLargeur/2 - nHauteur/2) + "px) rotateZ(" + -(nRotation*Math.PI/2) + "rad)")
                            ;
                    }                      
                    //180 360
                    else if (nRotation == 2 || nRotation == 0)
                    {
                        imgSelectionee
                            .css("transition","150ms transform ease-out,150ms margin ease-out")
                            .css("width",nLargeur)
                            .css("height",nHauteur)
                            .css("transformOrigin","center center")
                            .css("margin","")
                            .css("transform","translateX(0px) translateY(0px) " + (nRotation==0 ? ("rotateZ(" + (-2*Math.PI) + "rad)") : ("rotateZ(" + -Math.PI + "rad)")))
                            ;
                    }

                    if (nRotation == 0) setTimeout(function(){imgSelectionee.css("transition","").css("transform","");},200);
                    else setTimeout(function(){imgSelectionee.css("transition","");},200);

                        //TODO 26 rotation au degré
                        // /* et le shape outside à faire avec un data uri de canvas créé de totue pièce contenant la rotation au pixels près */

                }
                else if (oOptions.action && oOptions.action=='CROP_SRC')
                {       

                    if (imgSelectionee[0].src.indexOf("data")!=0)
                    {
                        if (!confirm(oSaisie.sGetTraduction('HTML_TOOLBAR.DLG.CPY') || "Continue ?"))
                            return;
                    }


    //TODO 26 à debugger pour la rotation sans destruction
                    if (imgSelectionee[0].style.transform != "")
                    {    
                        try
                        {

                        var bRotationAvecHabillageInverse = (parseInt(imgSelectionee.attr("data-wbSaisieRicheImgRotate") || 0) % 2) == 1;

                        var nAngle = imgSelectionee[0].style.transform.split("rad").map(function(a){ return a.split("rotateZ(")[1];}).reduce(function(a){ return !a ? 0 : (-1*parseFloat(a));});

                        //imgSelectionee.css("transition","").css("transform","");//pour width() et height() correct

                        var oCrop = {
                                w : imgSelectionee.width()
                            ,    h : imgSelectionee.height()
                            };
                            var image = new Image();
                            var canvas = $("<canvas>");
                            canvas.attr({
                                width : oCrop.w
                            ,    height :oCrop.h
                            });
                            var ctx = canvas[0].getContext('2d');
                            image.setAttribute('crossOrigin', 'anonymous');
                            image.onload = function()
                            {   
                                var x = canvas[0].width / 2;
                                var y = canvas[0].height / 2;
                                var width = image.width;
                                var height = image.height;
                                ctx.translate(x, y);
                                ctx.rotate(-nAngle);
                                ctx.drawImage(image, -width / 2, -height / 2, width, height);//ok mais ignore le scale => rajouter un ctx.scale avant?
                                // var sx = 0;
                                // var sy = 0;                                
                                //  var sLargeur = this.width * oCrop.w / oRectImg.width;
                                //  var sHauteur = this.height * oCrop.h / oRectImg.height;
                                // ctx.drawImage(image,sx, sy, sLargeur, sHauteur, -width / 2, -height / 2, width, height);
                                ctx.rotate(nAngle);
                                ctx.translate(-x, -y);


    //TODO 26 à debugger pour la rotation au degré
                                // ctx.save(); 

                                // //ctx.translate(oCrop.w/2, oCrop.h/2);
                                // ctx.setTransform(1, 0, 0, 1, oCrop.w/2, oCrop.h/2); // sets scale and origin
                                // ctx.rotate(-nAngle);

                                // //drawimage utilise les coordonnées de la source réelle
                                // ctx.drawImage(image,
                                // 0,0,   // Start at 70/20 pixels from the left and the top of the image (crop),
                                // this.width * oCrop.w / oRectImg.width, this.height * oCrop.h / oRectImg.height,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
                                //  - Math.max(imgSelectionee.width(),imgSelectionee.height())/2 ,  - Math.max(imgSelectionee.width(),imgSelectionee.height())/2,     // Place the result at 0, 0 in the canvas,
                                // //- oRectImg.width/2 ,  - oRectImg.height/2,     // Place the result at 0, 0 in the canvas,
                                // oCrop.w, oCrop.h // With as width / height: 100 * 100 (scale)
                                // ); 


                                // ctx.restore();

                                imgSelectionee[0].src = canvas[0].toDataURL();

                                imgSelectionee[0].style.width =oCrop.w+"px";
                                imgSelectionee[0].style.height =oCrop.h+"px";    
                                //raz de la rotation 
                                imgSelectionee[0].style.transform = "";  
                                onClickMiniBarraFaaUl(); 
                                //maj le rect 
                                oRectImg = rectGetPositionTaille(imgSelectionee);
                            }

                            image.src = imgSelectionee[0].src;
                            return;
                        }
                        catch(e)
                        {
                            imgSelectionee[0].style.transform = ""; 
                            onClickMiniBarraFaaUl();
                        }
                    }



                    var options = $.extend({
                        bgColor: 'transparent'
                       ,document : oSaisie.m_oDocument
                    },getComputedStyle(imgSelectionee[0]));

                    imgSelectionee.Jcrop(options,function(){
                        var jCropApi = this;
                        jCropApi.setSelect([
                            0,0,
                            oRectImg.width,oRectImg.height
                            ]);

                        jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
                        jqBody.on("keyup.wb.saisieriche.crop click.wb.saisieriche.crop",function(jqEvent)
                        {
                            var bOkOuAnnuler;
                            if (jqEvent.type=="keyup")
                            {
                                if (jqEvent.which == 13)// ENTER
                                {
                                        bOkOuAnnuler=true;
                                } 
                                else if (jqEvent.which == 27)// ESC
                                {
                                        bOkOuAnnuler=false;
                                }
                            }
                            else //if (jqEvent.type=="click")
                            {
                                    //clic en dehors
                                    if (!clWDUtil.bEstFils(jqEvent.target, jqBody.find(".jcrop-holder").get(0)))
                                    {
                                        bOkOuAnnuler=true;
                                    }
                            }
                            if (bOkOuAnnuler===undefined)
                            {
                                //ignore l'event
                                return;
                            }      

                                //fin de l'écoute du crop
                                jqBody.off("keyup.wb.saisieriche.crop click.wb.saisieriche.crop");

                            //annule
                            if (!bOkOuAnnuler)
                            {
                                jCropApi.destroy();
                                return;
                            }

                                function fFinally()
                                {
                                    jCropApi.destroy();
                                    imgSelectionee[0].style.display = options.display;   


                                    //actualise la position des trackers
                                    setTimeout(function(){jqBody.trigger("trigger.wb.saisieriche.selectionne", imgSelectionee);},100);
                                }

                                try
                                {
                                var oCrop = jCropApi.tellSelect();
                                    var image = new Image();
                                    var canvas = $("<canvas>");
                                    canvas.attr({
                                        width : oCrop.w
                                    ,    height : oCrop.h
                                    });
                                    var ctx = canvas[0].getContext('2d');
                                    image.setAttribute('crossOrigin', 'anonymous');
                                    image.onload = function()
                                    {
                                        //drawimage utilise les coordonnées de la source réelle
                                        ctx.drawImage(image,
                                        this.width * oCrop.x / oRectImg.width, this.height * oCrop.y / oRectImg.height,   // Start at 70/20 pixels from the left and the top of the image (crop),
                                        this.width * oCrop.w / oRectImg.width, this.height * oCrop.h / oRectImg.height,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
                                        0, 0,     // Place the result at 0, 0 in the canvas,
                                        oCrop.w, oCrop.h // With as width / height: 100 * 100 (scale)
                                        ); 

                                        imgSelectionee[0].src = canvas[0].toDataURL();

                                        imgSelectionee[0].style.width =oCrop.w+"px";
                                        imgSelectionee[0].style.height =oCrop.h+"px";                                        
                                    }
                                    image.onerror = function(e) { return SurErreurLoadImg(e,imgSelectionee); };

                                    image.src = imgSelectionee[0].src;
                                    fFinally();

                                }
                                catch(e)
                                {
                                    SurErreurLoadImg(e,imgSelectionee);
                                    fFinally();
                                }
    
                        });

                        });
                        jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
                    return;//ne repositionne pas la mini barre 
                }
                else if (oOptions.style)
                {
                        var oStyle = $.extend({},oOptions.style);//copie
                        var oAncienneMarge = {
                            marginLeft : imgSelectionee[0].style.marginLeft,
                            marginTop : imgSelectionee[0].style.marginTop,
                            marginRight : imgSelectionee[0].style.marginRight,
                            marginBottom : imgSelectionee[0].style.marginBottom,                            
                        };
                        if (oAncienneMarge.marginLeft == "auto") oAncienneMarge.marginLeft= 0;
                        if (oAncienneMarge.marginRight == "auto") oAncienneMarge.marginRight= 0;

                    if (!oStyle.width)
                    {                   
                            //en cas de passage de paragraphe étiré à un autre habillage on prendla moitié de la largeur arbitrairement
                            oStyle.width  = (imgSelectionee[0].style.width == "100%")  ? (oRectImg.width/2) : oRectImg.width;
                            oStyle.height  = (imgSelectionee[0].style.width == "100%")  ? "auto" : oRectImg.height;
                    }
                    else 
                    {
                        oStyle.height  = 'auto';
                    }

                        imgSelectionee.css(oStyle);

                    imgSelectionee[0].style.marginTop = oAncienneMarge.marginTop;
                    imgSelectionee[0].style.marginBottom = oAncienneMarge.marginBottom;
                    //TODO 26 marge même en étiré centré
                    if (imgSelectionee[0].style.width == "100%" || imgSelectionee[0].style.margin.indexOf("auto")>-1)
                    {
                        //
                    }
                    else 
                    {
                            imgSelectionee[0].style.marginLeft = oAncienneMarge.marginLeft;
                            imgSelectionee[0].style.marginRight = oAncienneMarge.marginRight;
                    }

                }

                    //actualise la position des trackers
                    jqBody.trigger("trigger.wb.saisieriche.selectionne", imgSelectionee);                    
                    //jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
                    // setTimeout(function(){                             
                    //     jqBody.trigger("trigger.wb.saisieriche.selectionne", imgSelectionee);                    
                        //setTimeout(function(){     
                            // jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
                            // jqBody.trigger("trigger.wb.saisieriche.selectionne", imgSelectionee);
                        //},1);//après anim
                    // },150);//après anim

                    //SUGG : mettre le picto en état actif pour indiquer l'habillage courant

            }.bind(this);

            //TODO gestion du undo redo sur les images voir oSaisie.EmpileUndoRedo
            $(this).on("click.wb.saisieriche.barreimg",onClickMiniBarraFaaUl);
        });
        
        PositionMiniBarre(oRectImg,jqUlBarreFaaImg, imgSelectionee);


        function PopupAffichePropImg(sEdition,jsonValeur)
        {
            //sEdition === WLEXEC_EDITIMAGE

            // Conversion du JSON vers le formulaire
            try {
                var oValeur = JSON.parse(jsonValeur);
            }
            catch(e)
            {
                return;
            }
            if(!oValeur.img) return;
    
            // affiche la popup d'edition de proprietes
            var oPopup = PopupAfficheProp(oSaisie.m_oElementCourant[oSaisie.sGetWLEXEC('JSEXEC_ELEMENTCOURANT_WRITEIMG')],imgSelectionee,oValeur);
            oPopup.ajouteAttrStyle(oValeur.img);
        }
        function TraiteImg(jqImg,oFormat)
        {
            var bLecture = oFormat===undefined;
            if (!oFormat) oFormat = { id : WDSaisieAPI.uuidv4(), img : { } };
            TraiteAttributsEtStyle(oFormat.img,jqImg,bLecture);
            return bLecture ? JSON.stringify(oFormat) : true;
        }
        // fixe l element courant pour les rappels de la OBJ
        oSaisie.m_oElementCourant = {};
        oSaisie.m_oElementCourant[oSaisie.sGetWLEXEC('JSEXEC_ELEMENTCOURANT_READIMG')] = function()
        {
            return TraiteImg(imgSelectionee);
        };
        oSaisie.m_oElementCourant[oSaisie.sGetWLEXEC('JSEXEC_ELEMENTCOURANT_WRITEIMG')] = function(sFormatJSON)
        { 
            try {
                var oValeur = (typeof sFormatJSON === "object") ? sFormatJSON : JSON.parse(sFormatJSON);
            }
            catch(e)
            {
                return false;
            }                 
            return oSaisie.EmpileUndoRedo(imgSelectionee, () => TraiteImg(imgSelectionee,oValeur));
        };        
    }//SurClickImg
    /**
     * This handler retrieves the images from the clipboard as a blob and returns it in a callback.
     * 
     * @see http://ourcodeworld.com/articles/read/491/how-to-retrieve-images-from-the-clipboard-with-javascript-in-the-browser
     * @param pasteEvent 
     * @param callback 
     */
    function retrieveImageFromClipboardAsBlob(pasteEvent, callback)
    {

        //drops are treated as multiple files. Only dealing with single files right now, so assume its the first object you're interested in
        if (pasteEvent.dataTransfer)
        {
            //plusieurs fichiers
            for(var iFile=0; pasteEvent.dataTransfer.files && iFile<pasteEvent.dataTransfer.files.length; ++iFile)
            {
                callback(pasteEvent.dataTransfer.files[iFile],pasteEvent.dataTransfer.files.length);
            }
            return;
        }


        if(pasteEvent.clipboardData == false){
            if(typeof(callback) == "function"){
                callback(undefined);
            }
        };

        var items = pasteEvent.clipboardData.items;

        if(items == undefined){
            if(typeof(callback) == "function"){
                callback(undefined);
            }
        };

        for (var i = 0; i < items.length; i++) {
            // Skip content if not image
            if (items[i].type.indexOf("image") == -1) continue;
            // Retrieve image on clipboard as blob
            var blob = items[i].getAsFile();

            if(typeof(callback) == "function"){
                callback(blob,items.length);
            }
        }
    }    

    // ecoute aussi le changement de sélection par d'autres biais
//     var nTimerSelectionChange = -1;
//     document.addEventListener('selectionchange',function()
//     {
//         if (nTimerSelectionChange>-1) clearTimeout(nTimerSelectionChange);
//         nTimerSelectionChange = setTimeout(function(){
//             jqBody.trigger("trigger.wb.saisieriche.selectionne");     
//         },150)        
//     });

    // vire le tracker au resize car on risque de ne plus être en phase
    $(window).on("resize.wb.saisieriche", function(jqEvent){
        jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
    });

    jqBody
    .on("trigger.wb.saisieriche.deselectionneTout",function(jqEvent)
    {
        //désélectionne
        jqBody.find(".wbSaisieRicheImgSelectionne").each(function(){
            $(this).removeClass("wbSaisieRicheImgSelectionne");
            jqTrackers.removeClass("wbSaisieRicheTrackerCoinShift");    
            jqWrapperMargin.children().off();
            jqTrackers = jqTrackers.off().detach();
            jqUlBarreFaaImg.children().off();
            jqUlBarreFaaImg = jqUlBarreFaaImg.detach();
            return false;
        });
        jqBody.find(".wbSaisieRicheLienSelectionne").each(function(){
            $(this).removeClass("wbSaisieRicheLienSelectionne");
            jqUlBarreFaaLien.children().off();
            jqUlBarreFaaLien = jqUlBarreFaaLien.detach();
            return false;
        });
        jqBody.find(".wbSaisieRicheTableSelectionne").each(function(){
            $(this).removeClass("wbSaisieRicheTableSelectionne").find("td").removeClass("wbSaisieRicheTdSelectionne");
            jqUlBarreFaaTable.children().off();
            jqUlBarreFaaTable = jqUlBarreFaaTable.detach();
            jqBody.off("keydown.wb.saisieriche.barretable");
            return false;
        });
        //retire le wrapper en dernier
        jqBody.find(".wbSaisieRicheWrapperSelection").each(function(){ 
            jqWrapperSelection = jqWrapperSelection.off().detach();
            return false;
        });
        // retire l'export vers la OBJ de l'element courant
        // non car le clic sur la mini barre désélectionne et donc on perd le lien oSaisie.m_oElementCourant = undefined;
    })
    .on("blur.wb.saisieriche.quitte",function(jqEvent)
    {
    //désélectionne
        jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");
    })
    //click dans le document sur une image
    //DOMCharacterDataModified car input est deprecié https://stackoverflow.com/questions/5608758/get-delete-event-of-edited-element
    .on("keydown.wb.saisieriche.selectionne",function(jqEvent)
    {
        //ignore si aucune image sélectionnée ou pendant le resize
        if (!jqBody.find(".wbSaisieRicheImgSelectionne").length || jqBody.find(".wbSaisieRicheImgGhost").length)
    {
        return;
    }

        var bAvecShift = (jqEvent && (jqEvent.shiftKey || jqEvent.which == 16));
        var bAvecCtrl = (jqEvent && (jqEvent.ctrlKey || jqEvent.which == 17));
        var bToucheSansAction= false;
        if (bAvecShift)
        {
            bToucheSansAction=true;
            //tracker de rotation
            if (ROTATION_AU_DEGRE_SUR_SHIFT_ACTIVE)
                jqTrackers.addClass("wbSaisieRicheTrackerCoinShift");            
        }
        if (bAvecCtrl)
    {
            bToucheSansAction=true;
    }

        if (!bToucheSansAction)
        {
            jqTrackers.removeClass("wbSaisieRicheTrackerCoinShift");   
            jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");//cas du suppr         
        }
    })
    .on("click.wb.saisieriche.selectionne keyup.wb.saisieriche.selectionne trigger.wb.saisieriche.selectionne input.wb.saisieriche.selectionne DOMCharacterDataModified.wb.saisieriche.selectionne",function(jqEvent,jqReSelection)
    {     
        if (jqEvent && jqEvent.type === "input" && oSaisie.m_bUndoRedoEnCours) return;
        var jqTarget = $(jqReSelection||jqEvent.target);
        var jqFocusElement = jqTarget;   
        var sel = oSaisie.__oGetSelection();
        if (sel && sel.focusNode)
        {
            if (sel.rangeCount===0)
            {
                jqFocusElement = sel.focusNode.nodeType===Node.ELEMENT_NODE ? $(sel.focusNode) : $(sel.focusNode).parent();
            }
            else 
            {
                var range = sel.getRangeAt(0);
                var tab = [];
                var domStart = range.startContainer.nodeType===Node.ELEMENT_NODE ? range.startContainer : range.startContainer.parentElement;
                var domEnd = range.endContainer.nodeType===Node.ELEMENT_NODE ? range.endContainer : range.endContainer.parentElement;
                var jqTdBornes = $(domStart).add(domEnd);
                $(range.commonAncestorContainer).find("td").add(range.commonAncestorContainer).filter("td").each(function(){
                    if (this === jqTdBornes[0]) tab.push(this);
                    else if (this === jqTdBornes[1]) { tab.push(this); return false; }
                    else if (tab.length) tab.push(this);                
                });
                jqFocusElement = jqTdBornes.add($(tab));
            }            
        }
        var jqTableTrTdParent = jqFocusElement.parents().add(jqFocusElement).add(jqTarget).closest("td,th");
        var bAvecShift = (jqEvent && (jqEvent.shiftKey || jqEvent.which == 16));
        var bAvecCtrl = (jqEvent && (jqEvent.ctrlKey || jqEvent.which == 17));

        //désélectionne
        if (jqEvent.type!="keyup" || (!bAvecShift && !bAvecCtrl))//sauf si on a juste lâché le shift/ctrl
            jqBody.trigger("trigger.wb.saisieriche.deselectionneTout");

        if (!jqTarget || !jqTarget.length)
        {
            return;
        }
        if (!jqTarget[0].parentElement)
        {
            // refuse les éléments hors DOM
            return;
        }

        if (jqTarget.is("img"))
        {
            SurClickImg(jqTarget,jqEvent);
        }
        else  if (jqTarget.is("a[href]"))
        {
            SurClickLien(jqTarget,jqEvent);
        }
        else
        {
            // reprend a partir de la selection      
            // a voir si on est dans l'arborescence d'un element a traiter             
            if (jqFocusElement.length === 1 && jqTableTrTdParent.length) //pas de multi selection
            {
                SurClickTable(jqTableTrTdParent.last(),jqEvent);
            }
            else 
            {
                return;
            }
               
        }
    })
    .on("dragover.wb.saisieriche.image",function(jqEvent) 
    {
        var e = jqEvent.originalEvent  ? jqEvent.originalEvent : jqEvent;
        //drops are treated as multiple files. Only dealing with single files right now, so assume its the first object you're interested in
        var item = (e.dataTransfer && e.dataTransfer.items) ? e.dataTransfer.items[0] : undefined;
        //don't try to mess with non-image items
        if (item && item.type && item.type.match('image.*')) 
        {
            //drag d'une image 
            jqBody.addClass("wbSaisieRicheIframeBodyDragImg");
            //kill any default behavior
            jqEvent.stopPropagation();
            jqEvent.preventDefault();
        }
        //laisse passer le drag natif d'une image déjà dans l'édtion riche

    })
    .on("dragend.wb.saisieriche.image mouseup.wb.saisieriche.image mouseleave.wb.saisieriche.image",function(jqEvent) 
    {
        jqBody.removeClass("wbSaisieRicheIframeBodyDragImg");
    })    
    .on("drop.wb.saisieriche.image paste.wb.saisieriche.image",function(jqEvent) 
    {
        jqBody.removeClass("wbSaisieRicheIframeBodyDragImg");

        var e = jqEvent.originalEvent  ? jqEvent.originalEvent : jqEvent;
        //get x and y coordinates of the dropped item
        var x = e.clientX;
        var y = e.clientY;

        retrieveImageFromClipboardAsBlob(e,function(file,nNbFiles)
        {
            //don't try to mess with non-image files
            if (file && file.type && file.type.match('image.*')) 
            {
                //then we have an image,
                //kill any default behavior
                e.stopPropagation();
                e.preventDefault();
                //we have a file handle, need to read it with file reader!
                var reader = new FileReader();
                var range;
                // Closure to capture the file information.
                reader.onload = (function(theFile) {
                    //get the data uri
                    var dataURI = theFile.target.result;
                    //make a new image element with the dataURI as the source
                    var img = document.createElement("img");
                    img.setAttribute('crossOrigin', 'anonymous');
                    img.src = dataURI;
                    //largeur max d'une image droppée
                    img.style.width = Math.min(((jqBody.width() * 0.8) / nNbFiles),200) + "px";
                    // blanc tournant par défaut
                    img.style.margin = "24px";

                    //Insert the image at the carat
                    if (x===undefined || y===undefined)
                    {
                        var sel = oSaisie.__oGetSelection();
                        range = sel.getRangeAt(0);
                        if (range)
                        {
                            range.insertNode(img);
                        }
                        //else erreur on n'arrive pas à insérer l'image on la met à la fin
                        else document.body.appendChild(img);
                    }
                    // Try the standards-based way first. This works in FF
                    else if (document.caretPositionFromPoint) {
                        var pos = document.caretPositionFromPoint(x, y);
                        range = document.createRange();
                        range.setStart(pos.offsetNode, pos.offset);
                        range.collapse();
                        range.insertNode(img);
                    }
                    // Next, the WebKit way. This works in Chrome.
                    else if (document.caretRangeFromPoint) {
                        range = document.caretRangeFromPoint(x, y);
                        range.insertNode(img);                    
                    }
                    else
                    {
                        //not supporting IE right now.
                    }

                    //actualise la position des trackers sur cette img
                    setTimeout(function(){jqBody.trigger("trigger.wb.saisieriche.selectionne", $(img));},100);
                });
                //this reads in the file, and the onload event triggers, which adds the image to the div at the carat
                reader.readAsDataURL(file);
            }
        });
    });

};

WDSaisieAPI.prototype.__AjouteJCrop = function __AjouteJCrop()
{

    /**
     * jquery.Jcrop.js v0.9.12
     * jQuery Image Cropping Plugin - released under MIT License
     * Author: Kelly Hallman <khallman@gmail.com>
     * http://github.com/tapmodo/Jcrop
     * Copyright (c) 2008-2013 Tapmodo Interactive LLC {{{
     *
     * Permission is hereby granted, free of charge, to any person
     * obtaining a copy of this software and associated documentation
     * files (the "Software"), to deal in the Software without
     * restriction, including without limitation the rights to use,
     * copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the
     * Software is furnished to do so, subject to the following
     * conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
     * OTHER DEALINGS IN THE SOFTWARE.
     *
     * }}}
     */

    (function ($) {
        var document = window.document;
        $.Jcrop = function (obj, opt) {
        var options = $.extend({}, $.Jcrop.defaults),
            docOffset,
            _ua = navigator.userAgent.toLowerCase(),
            is_msie = /msie/.test(_ua),
            ie6mode = /msie [1-6]\./.test(_ua);
    
        if (options.document)  document = options.document;
    
        // Internal Methods {{{
        function px(n) {
            return Math.round(n) + 'px';
        }
        function cssClass(cl) {
            return options.baseClass + '-' + cl;
        }
        function supportsColorFade() {
            return $.fx.step.hasOwnProperty('backgroundColor');
        }
        function getPos(obj) //{{{
        {
            var pos = $(obj).offset();
            return [pos.left, pos.top];
        }
        //}}}
        function mouseAbs(e) //{{{
        {
            return [(e.pageX - docOffset[0]), (e.pageY - docOffset[1])];
        }
        //}}}
        function setOptions(opt) //{{{
        {
            if (typeof(opt) !== 'object') opt = {};
            options = $.extend(options, opt);

            $.each(['onChange','onSelect','onRelease','onDblClick'],function(i,e) {
            if (typeof(options[e]) !== 'function') options[e] = function () {};
            });
        }
        //}}}
        function startDragMode(mode, pos, touch) //{{{
        {
            docOffset = getPos($img);
            Tracker.setCursor(mode === 'move' ? mode : mode + '-resize');
    
            if (mode === 'move') {
            return Tracker.activateHandlers(createMover(pos), doneSelect, touch);
            }
    
            var fc = Coords.getFixed();
            var opp = oppLockCorner(mode);
            var opc = Coords.getCorner(oppLockCorner(opp));
    
            Coords.setPressed(Coords.getCorner(opp));
            Coords.setCurrent(opc);
    
            Tracker.activateHandlers(dragmodeHandler(mode, fc), doneSelect, touch);
        }
        //}}}
        function dragmodeHandler(mode, f) //{{{
        {
            return function (pos) {
            if (!options.aspectRatio) {
                switch (mode) {
                case 'e':
                pos[1] = f.y2;
                break;
                case 'w':
                pos[1] = f.y2;
                break;
                case 'n':
                pos[0] = f.x2;
                break;
                case 's':
                pos[0] = f.x2;
                break;
                }
            } else {
                switch (mode) {
                case 'e':
                pos[1] = f.y + 1;
                break;
                case 'w':
                pos[1] = f.y + 1;
                break;
                case 'n':
                pos[0] = f.x + 1;
                break;
                case 's':
                pos[0] = f.x + 1;
                break;
                }
            }
            Coords.setCurrent(pos);
            Selection.update();
            };
        }
        //}}}
        function createMover(pos) //{{{
        {
            var lloc = pos;
            KeyManager.watchKeys();
    
            return function (pos) {
            Coords.moveOffset([pos[0] - lloc[0], pos[1] - lloc[1]]);
            lloc = pos;
    
            Selection.update();
            };
        }
        //}}}
        function oppLockCorner(ord) //{{{
        {
            switch (ord) {
            case 'n':
            return 'sw';
            case 's':
            return 'nw';
            case 'e':
            return 'nw';
            case 'w':
            return 'ne';
            case 'ne':
            return 'sw';
            case 'nw':
            return 'se';
            case 'se':
            return 'nw';
            case 'sw':
            return 'ne';
            }
        }
        //}}}
        function createDragger(ord) //{{{
        {
            return function (e) {
            if (options.disabled) {
                return false;
            }
            if ((ord === 'move') && !options.allowMove) {
                return false;
            }
            
            // Fix position of crop area when dragged the very first time.
            // Necessary when crop image is in a hidden element when page is loaded.
            docOffset = getPos($img);
    
            btndown = true;
            startDragMode(ord, mouseAbs(e));
            e.stopPropagation();
            e.preventDefault();
            return false;
            };
        }
        //}}}
        function presize($obj, w, h) //{{{
        {
            var nw = $obj.width(),
                nh = $obj.height();
            if ((nw > w) && w > 0) {
            nw = w;
            nh = (w / $obj.width()) * $obj.height();
            }
            if ((nh > h) && h > 0) {
            nh = h;
            nw = (h / $obj.height()) * $obj.width();
            }
            xscale = $obj.width() / nw;
            yscale = $obj.height() / nh;
            $obj.width(nw).height(nh);
        }
        //}}}
        function unscale(c) //{{{
        {
            return {
            x: c.x * xscale,
            y: c.y * yscale,
            x2: c.x2 * xscale,
            y2: c.y2 * yscale,
            w: c.w * xscale,
            h: c.h * yscale
            };
        }
        //}}}
        function doneSelect(pos) //{{{
        {
            var c = Coords.getFixed();
            if ((c.w > options.minSelect[0]) && (c.h > options.minSelect[1])) {
            Selection.enableHandles();
            Selection.done();
            } else {
            Selection.release();
            }
            Tracker.setCursor(options.allowSelect ? 'crosshair' : 'default');
        }
        //}}}
        function newSelection(e) //{{{
        {
            if (options.disabled) {
            return false;
            }
            if (!options.allowSelect) {
            return false;
            }
            btndown = true;
            docOffset = getPos($img);
            Selection.disableHandles();
            Tracker.setCursor('crosshair');
            var pos = mouseAbs(e);
            Coords.setPressed(pos);
            Selection.update();
            Tracker.activateHandlers(selectDrag, doneSelect, e.type.substring(0,5)==='touch');
            KeyManager.watchKeys();
    
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        //}}}
        function selectDrag(pos) //{{{
        {
            Coords.setCurrent(pos);
            Selection.update();
        }
        //}}}
        function newTracker() //{{{
        {
            var trk = $('<div></div>').addClass(cssClass('tracker'));
            if (is_msie) {
            trk.css({
                opacity: 0,
                backgroundColor: 'white'
            });
            }
            return trk;
        }
        //}}}
    
        // }}}
        // Initialization {{{
        // Sanitize some options {{{
        if (typeof(obj) !== 'object') {
            obj = $(obj)[0];
        }
        if (typeof(opt) !== 'object') {
            opt = {};
        }
        // }}}
        setOptions(opt);
        // Initialize some jQuery objects {{{
        // The values are SET on the image(s) for the interface
        // If the original image has any of these set, they will be reset
        // However, if you destroy() the Jcrop instance the original image's
        // character in the DOM will be as you left it.
        var img_css = {
            border: 'none',
            visibility: 'visible',
            margin: 0,
            padding: 0,
            position: 'absolute',
            top: 0,
            left: 0
        };
    
        var $origimg = $(obj),
            img_mode = true;
    
        if (obj.tagName == 'IMG') {
            // Fix size of crop image.
            // Necessary when crop image is within a hidden element when page is loaded.
            if ($origimg[0].width != 0 && $origimg[0].height != 0) {
            // Obtain dimensions from contained img element.
            $origimg.width($origimg[0].width);
            $origimg.height($origimg[0].height);
            } else {
            // Obtain dimensions from temporary image in case the original is not loaded yet (e.g. IE 7.0). 
            var tempImage = new Image();
            tempImage.src = $origimg[0].src;
            $origimg.width(tempImage.width);
            $origimg.height(tempImage.height);
            } 
    
            var $img = $origimg.clone().removeAttr('id').css(img_css).show();
    
            $img.width($origimg.width());
            $img.height($origimg.height());
            $origimg.after($img).hide();
    
        } else {
            $img = $origimg.css(img_css).show();
            img_mode = false;
            if (options.shade === null) { options.shade = true; }
        }
    
        presize($img, options.boxWidth, options.boxHeight);
    
        var boundx = $img.width(),
            boundy = $img.height(),        
            $div = $('<div />').width(boundx).height(boundy).addClass(cssClass('holder')).css({
            position: 'relative',
            backgroundColor: options.backgroundColor||options.bgColor,verticalAlign: options.verticalAlign, float : options.float, margin : options.margin, display : (options.display && options.display=='inline' ? 'inline-block' : options.display)
            }).insertAfter($origimg).append($img);
    
        if (options.addClass) {
            $div.addClass(options.addClass);
        }
    
        var $img2 = $('<div />'),
    
            $img_holder = $('<div />') 
            .width('100%').height('100%').css({
                zIndex: 310,
                position: 'absolute',
                overflow: 'hidden'
            }),
    
            $hdl_holder = $('<div />') 
            .width('100%').height('100%').css('zIndex', 320), 
    
            $sel = $('<div />') 
            .css({
                position: 'absolute',
                zIndex: 600
            }).dblclick(function(){
                var c = Coords.getFixed();
                options.onDblClick.call(api,c);
            }).insertBefore($img).append($img_holder, $hdl_holder); 
    
        if (img_mode) {
    
            $img2 = $('<img />')
                .attr('src', $img.attr('src')).css(img_css).width(boundx).height(boundy),
    
            $img_holder.append($img2);
    
        }
    
        if (ie6mode) {
            $sel.css({
            overflowY: 'hidden'
            });
        }
    
        var bound = options.boundary;
        var $trk = newTracker().width(boundx + (bound * 2)).height(boundy + (bound * 2)).css({
            position: 'absolute',
            top: px(-bound),
            left: px(-bound),
            zIndex: 290
        }).mousedown(newSelection);
    
        /* }}} */
        // Set more variables {{{
        var bgcolor = options.bgColor,
            bgopacity = options.bgOpacity,
            xlimit, ylimit, xmin, ymin, xscale, yscale, enabled = true,
            btndown, animating, shift_down;
    
        docOffset = getPos($img);
        // }}}
        // }}}
        // Internal Modules {{{
        // Touch Module {{{ 
        var Touch = (function () {
            // Touch support detection function adapted (under MIT License)
            // from code by Jeffrey Sambells - http://github.com/iamamused/
            function hasTouchSupport() {
            var support = {}, events = ['touchstart', 'touchmove', 'touchend'],
                el = document.createElement('div'), i;
    
            try {
                for(i=0; i<events.length; i++) {
                var eventName = events[i];
                eventName = 'on' + eventName;
                var isSupported = (eventName in el);
                if (!isSupported) {
                    el.setAttribute(eventName, 'return;');
                    isSupported = typeof el[eventName] == 'function';
                }
                support[events[i]] = isSupported;
                }
                return support.touchstart && support.touchend && support.touchmove;
            }
            catch(err) {
                return false;
            }
            }
    
            function detectSupport() {
            if ((options.touchSupport === true) || (options.touchSupport === false)) return options.touchSupport;
                else return hasTouchSupport();
            }
            return {
            createDragger: function (ord) {
                return function (e) {
                if (options.disabled) {
                    return false;
                }
                if ((ord === 'move') && !options.allowMove) {
                    return false;
                }
                docOffset = getPos($img);
                btndown = true;
                startDragMode(ord, mouseAbs(Touch.cfilter(e)), true);
                e.stopPropagation();
                e.preventDefault();
                return false;
                };
            },
            newSelection: function (e) {
                return newSelection(Touch.cfilter(e));
            },
            cfilter: function (e){
                e.pageX = e.originalEvent.changedTouches[0].pageX;
                e.pageY = e.originalEvent.changedTouches[0].pageY;
                return e;
            },
            isSupported: hasTouchSupport,
            support: detectSupport()
            };
        }());
        // }}}
        // Coords Module {{{
        var Coords = (function () {
            var x1 = 0,
                y1 = 0,
                x2 = 0,
                y2 = 0,
                ox, oy;
    
            function setPressed(pos) //{{{
            {
            pos = rebound(pos);
            x2 = x1 = pos[0];
            y2 = y1 = pos[1];
            }
            //}}}
            function setCurrent(pos) //{{{
            {
            pos = rebound(pos);
            ox = pos[0] - x2;
            oy = pos[1] - y2;
            x2 = pos[0];
            y2 = pos[1];
            }
            //}}}
            function getOffset() //{{{
            {
            return [ox, oy];
            }
            //}}}
            function moveOffset(offset) //{{{
            {
            var ox = offset[0],
                oy = offset[1];
    
            if (0 > x1 + ox) {
                ox -= ox + x1;
            }
            if (0 > y1 + oy) {
                oy -= oy + y1;
            }
    
            if (boundy < y2 + oy) {
                oy += boundy - (y2 + oy);
            }
            if (boundx < x2 + ox) {
                ox += boundx - (x2 + ox);
            }
    
            x1 += ox;
            x2 += ox;
            y1 += oy;
            y2 += oy;
            }
            //}}}
            function getCorner(ord) //{{{
            {
            var c = getFixed();
            switch (ord) {
            case 'ne':
                return [c.x2, c.y];
            case 'nw':
                return [c.x, c.y];
            case 'se':
                return [c.x2, c.y2];
            case 'sw':
                return [c.x, c.y2];
            }
            }
            //}}}
            function getFixed() //{{{
            {
            if (!options.aspectRatio) {
                return getRect();
            }
            // This function could use some optimization I think...
            var aspect = options.aspectRatio,
                min_x = options.minSize[0] / xscale,
                
                
                //min_y = options.minSize[1]/yscale,
                max_x = options.maxSize[0] / xscale,
                max_y = options.maxSize[1] / yscale,
                rw = x2 - x1,
                rh = y2 - y1,
                rwa = Math.abs(rw),
                rha = Math.abs(rh),
                real_ratio = rwa / rha,
                xx, yy, w, h;
    
            if (max_x === 0) {
                max_x = boundx * 10;
            }
            if (max_y === 0) {
                max_y = boundy * 10;
            }
            if (real_ratio < aspect) {
                yy = y2;
                w = rha * aspect;
                xx = rw < 0 ? x1 - w : w + x1;
    
                if (xx < 0) {
                xx = 0;
                h = Math.abs((xx - x1) / aspect);
                yy = rh < 0 ? y1 - h : h + y1;
                } else if (xx > boundx) {
                xx = boundx;
                h = Math.abs((xx - x1) / aspect);
                yy = rh < 0 ? y1 - h : h + y1;
                }
            } else {
                xx = x2;
                h = rwa / aspect;
                yy = rh < 0 ? y1 - h : y1 + h;
                if (yy < 0) {
                yy = 0;
                w = Math.abs((yy - y1) * aspect);
                xx = rw < 0 ? x1 - w : w + x1;
                } else if (yy > boundy) {
                yy = boundy;
                w = Math.abs(yy - y1) * aspect;
                xx = rw < 0 ? x1 - w : w + x1;
                }
            }
    
            // Magic %-)
            if (xx > x1) { // right side
                if (xx - x1 < min_x) {
                xx = x1 + min_x;
                } else if (xx - x1 > max_x) {
                xx = x1 + max_x;
                }
                if (yy > y1) {
                yy = y1 + (xx - x1) / aspect;
                } else {
                yy = y1 - (xx - x1) / aspect;
                }
            } else if (xx < x1) { // left side
                if (x1 - xx < min_x) {
                xx = x1 - min_x;
                } else if (x1 - xx > max_x) {
                xx = x1 - max_x;
                }
                if (yy > y1) {
                yy = y1 + (x1 - xx) / aspect;
                } else {
                yy = y1 - (x1 - xx) / aspect;
                }
            }
    
            if (xx < 0) {
                x1 -= xx;
                xx = 0;
            } else if (xx > boundx) {
                x1 -= xx - boundx;
                xx = boundx;
            }
    
            if (yy < 0) {
                y1 -= yy;
                yy = 0;
            } else if (yy > boundy) {
                y1 -= yy - boundy;
                yy = boundy;
            }
    
            return makeObj(flipCoords(x1, y1, xx, yy));
            }
            //}}}
            function rebound(p) //{{{
            {
            if (p[0] < 0) p[0] = 0;
            if (p[1] < 0) p[1] = 0;
    
            if (p[0] > boundx) p[0] = boundx;
            if (p[1] > boundy) p[1] = boundy;
    
            return [Math.round(p[0]), Math.round(p[1])];
            }
            //}}}
            function flipCoords(x1, y1, x2, y2) //{{{
            {
            var xa = x1,
                xb = x2,
                ya = y1,
                yb = y2;
            if (x2 < x1) {
                xa = x2;
                xb = x1;
            }
            if (y2 < y1) {
                ya = y2;
                yb = y1;
            }
            return [xa, ya, xb, yb];
            }
            //}}}
            function getRect() //{{{
            {
            var xsize = x2 - x1,
                ysize = y2 - y1,
                delta;
    
            if (xlimit && (Math.abs(xsize) > xlimit)) {
                x2 = (xsize > 0) ? (x1 + xlimit) : (x1 - xlimit);
            }
            if (ylimit && (Math.abs(ysize) > ylimit)) {
                y2 = (ysize > 0) ? (y1 + ylimit) : (y1 - ylimit);
            }
    
            if (ymin / yscale && (Math.abs(ysize) < ymin / yscale)) {
                y2 = (ysize > 0) ? (y1 + ymin / yscale) : (y1 - ymin / yscale);
            }
            if (xmin / xscale && (Math.abs(xsize) < xmin / xscale)) {
                x2 = (xsize > 0) ? (x1 + xmin / xscale) : (x1 - xmin / xscale);
            }
    
            if (x1 < 0) {
                x2 -= x1;
                x1 -= x1;
            }
            if (y1 < 0) {
                y2 -= y1;
                y1 -= y1;
            }
            if (x2 < 0) {
                x1 -= x2;
                x2 -= x2;
            }
            if (y2 < 0) {
                y1 -= y2;
                y2 -= y2;
            }
            if (x2 > boundx) {
                delta = x2 - boundx;
                x1 -= delta;
                x2 -= delta;
            }
            if (y2 > boundy) {
                delta = y2 - boundy;
                y1 -= delta;
                y2 -= delta;
            }
            if (x1 > boundx) {
                delta = x1 - boundy;
                y2 -= delta;
                y1 -= delta;
            }
            if (y1 > boundy) {
                delta = y1 - boundy;
                y2 -= delta;
                y1 -= delta;
            }
    
            return makeObj(flipCoords(x1, y1, x2, y2));
            }
            //}}}
            function makeObj(a) //{{{
            {
            return {
                x: a[0],
                y: a[1],
                x2: a[2],
                y2: a[3],
                w: a[2] - a[0],
                h: a[3] - a[1]
            };
            }
            //}}}
    
            return {
            flipCoords: flipCoords,
            setPressed: setPressed,
            setCurrent: setCurrent,
            getOffset: getOffset,
            moveOffset: moveOffset,
            getCorner: getCorner,
            getFixed: getFixed
            };
        }());
    
        //}}}
        // Shade Module {{{
        var Shade = (function() {
            var enabled = false,
                holder = $('<div />').css({
                position: 'absolute',
                zIndex: 240,
                opacity: 0
                }),
                shades = {
                top: createShade(),
                left: createShade().height(boundy),
                right: createShade().height(boundy),
                bottom: createShade()
                };
    
            function resizeShades(w,h) {
            shades.left.css({ height: px(h) });
            shades.right.css({ height: px(h) });
            }
            function updateAuto()
            {
            return updateShade(Coords.getFixed());
            }
            function updateShade(c)
            {
            shades.top.css({
                left: px(c.x),
                width: px(c.w),
                height: px(c.y)
            });
            shades.bottom.css({
                top: px(c.y2),
                left: px(c.x),
                width: px(c.w),
                height: px(boundy-c.y2)
            });
            shades.right.css({
                left: px(c.x2),
                width: px(boundx-c.x2)
            });
            shades.left.css({
                width: px(c.x)
            });
            }
            function createShade() {
            return $('<div />').css({
                position: 'absolute',
                backgroundColor: options.shadeColor||options.bgColor
            }).appendTo(holder);
            }
            function enableShade() {
            if (!enabled) {
                enabled = true;
                holder.insertBefore($img);
                updateAuto();
                Selection.setBgOpacity(1,0,1);
                $img2.hide();
    
                setBgColor(options.shadeColor||options.bgColor,1);
                if (Selection.isAwake())
                {
                setOpacity(options.bgOpacity,1);
                }
                else setOpacity(1,1);
            }
            }
            function setBgColor(color,now) {
            colorChangeMacro(getShades(),color,now);
            }
            function disableShade() {
            if (enabled) {
                holder.remove();
                $img2.show();
                enabled = false;
                if (Selection.isAwake()) {
                Selection.setBgOpacity(options.bgOpacity,1,1);
                } else {
                Selection.setBgOpacity(1,1,1);
                Selection.disableHandles();
                }
                colorChangeMacro($div,0,1);
            }
            }
            function setOpacity(opacity,now) {
            if (enabled) {
                if (options.bgFade && !now) {
                holder.animate({
                    opacity: 1-opacity
                },{
                    queue: false,
                    duration: options.fadeTime
                });
                }
                else holder.css({opacity:1-opacity});
            }
            }
            function refreshAll() {
            options.shade ? enableShade() : disableShade();
            if (Selection.isAwake()) setOpacity(options.bgOpacity);
            }
            function getShades() {
            return holder.children();
            }
    
            return {
            update: updateAuto,
            updateRaw: updateShade,
            getShades: getShades,
            setBgColor: setBgColor,
            enable: enableShade,
            disable: disableShade,
            resize: resizeShades,
            refresh: refreshAll,
            opacity: setOpacity
            };
        }());
        // }}}
        // Selection Module {{{
        var Selection = (function () {
            var awake,
                hdep = 370,
                borders = {},
                handle = {},
                dragbar = {},
                seehandles = false;
    
            // Private Methods
            function insertBorder(type) //{{{
            {
            var jq = $('<div />').css({
                position: 'absolute',
                opacity: options.borderOpacity
            }).addClass(cssClass(type));
            $img_holder.append(jq);
            return jq;
            }
            //}}}
            function dragDiv(ord, zi) //{{{
            {
            var jq = $('<div />').mousedown(createDragger(ord)).css({
                cursor: ord + '-resize',
                position: 'absolute',
                zIndex: zi
            }).addClass('ord-'+ord);
    
            if (Touch.support) {
                jq.bind('touchstart.jcrop', Touch.createDragger(ord));
            }
    
            $hdl_holder.append(jq);
            return jq;
            }
            //}}}
            function insertHandle(ord) //{{{
            {
            var hs = options.handleSize,
    
                div = dragDiv(ord, hdep++).css({
                opacity: options.handleOpacity
                }).addClass(cssClass('handle'));
    
            if (hs) { div.width(hs).height(hs); }
    
            return div;
            }
            //}}}
            function insertDragbar(ord) //{{{
            {
            return dragDiv(ord, hdep++).addClass('jcrop-dragbar');
            }
            //}}}
            function createDragbars(li) //{{{
            {
            var i;
            for (i = 0; i < li.length; i++) {
                dragbar[li[i]] = insertDragbar(li[i]);
            }
            }
            //}}}
            function createBorders(li) //{{{
            {
            var cl,i;
            for (i = 0; i < li.length; i++) {
                switch(li[i]){
                case'n': cl='hline'; break;
                case's': cl='hline bottom'; break;
                case'e': cl='vline right'; break;
                case'w': cl='vline'; break;
                }
                borders[li[i]] = insertBorder(cl);
            }
            }
            //}}}
            function createHandles(li) //{{{
            {
            var i;
            for (i = 0; i < li.length; i++) {
                handle[li[i]] = insertHandle(li[i]);
            }
            }
            //}}}
            function moveto(x, y) //{{{
            {
            if (!options.shade) {
                $img2.css({
                top: px(-y),
                left: px(-x)
                });
            }
            $sel.css({
                top: px(y),
                left: px(x)
            });
            }
            //}}}
            function resize(w, h) //{{{
            {
            $sel.width(Math.round(w)).height(Math.round(h));
            }
            //}}}
            function refresh() //{{{
            {
            var c = Coords.getFixed();
    
            Coords.setPressed([c.x, c.y]);
            Coords.setCurrent([c.x2, c.y2]);
    
            updateVisible();
            }
            //}}}
    
            // Internal Methods
            function updateVisible(select) //{{{
            {
            if (awake) {
                return update(select);
            }
            }
            //}}}
            function update(select) //{{{
            {
            var c = Coords.getFixed();
    
            resize(c.w, c.h);
            moveto(c.x, c.y);
            if (options.shade) Shade.updateRaw(c);
    
            awake || show();
    
            if (select) {
                options.onSelect.call(api, unscale(c));
            } else {
                options.onChange.call(api, unscale(c));
            }
            }
            //}}}
            function setBgOpacity(opacity,force,now) //{{{
            {
            if (!awake && !force) return;
            if (options.bgFade && !now) {
                $img.animate({
                opacity: opacity
                },{
                queue: false,
                duration: options.fadeTime
                });
            } else {
                $img.css('opacity', opacity);
            }
            }
            //}}}
            function show() //{{{
            {
            $sel.show();
    
            if (options.shade) Shade.opacity(bgopacity);
                else setBgOpacity(bgopacity,true);
    
            awake = true;
            }
            //}}}
            function release() //{{{
            {
            disableHandles();
            $sel.hide();
    
            if (options.shade) Shade.opacity(1);
                else setBgOpacity(1);
    
            awake = false;
            options.onRelease.call(api);
            }
            //}}}
            function showHandles() //{{{
            {
            if (seehandles) {
                $hdl_holder.show();
            }
            }
            //}}}
            function enableHandles() //{{{
            {
            seehandles = true;
            if (options.allowResize) {
                $hdl_holder.show();
                return true;
            }
            }
            //}}}
            function disableHandles() //{{{
            {
            seehandles = false;
            $hdl_holder.hide();
            } 
            //}}}
            function animMode(v) //{{{
            {
            if (v) {
                animating = true;
                disableHandles();
            } else {
                animating = false;
                enableHandles();
            }
            } 
            //}}}
            function done() //{{{
            {
            animMode(false);
            refresh();
            } 
            //}}}
            // Insert draggable elements {{{
            // Insert border divs for outline
    
            if (options.dragEdges && $.isArray(options.createDragbars))
            createDragbars(options.createDragbars);
    
            if ($.isArray(options.createHandles))
            createHandles(options.createHandles);
    
            if (options.drawBorders && $.isArray(options.createBorders))
            createBorders(options.createBorders);
    
            //}}}
    
            // This is a hack for iOS5 to support drag/move touch functionality
            $(document).bind('touchstart.jcrop-ios',function(e) {
            if ($(e.currentTarget).hasClass('jcrop-tracker')) e.stopPropagation();
            });
    
            var $track = newTracker().mousedown(createDragger('move')).css({
            cursor: 'move',
            position: 'absolute',
            zIndex: 360
            });
    
            if (Touch.support) {
            $track.bind('touchstart.jcrop', Touch.createDragger('move'));
            }
    
            $img_holder.append($track);
            disableHandles();
    
            return {
            updateVisible: updateVisible,
            update: update,
            release: release,
            refresh: refresh,
            isAwake: function () {
                return awake;
            },
            setCursor: function (cursor) {
                $track.css('cursor', cursor);
            },
            enableHandles: enableHandles,
            enableOnly: function () {
                seehandles = true;
            },
            showHandles: showHandles,
            disableHandles: disableHandles,
            animMode: animMode,
            setBgOpacity: setBgOpacity,
            done: done
            };
        }());
        
        //}}}
        // Tracker Module {{{
        var Tracker = (function () {
            var onMove = function () {},
                onDone = function () {},
                trackDoc = options.trackDocument;
    
            function toFront(touch) //{{{
            {
            $trk.css({
                zIndex: 450
            });
    
            if (touch)
                $(document)
                .bind('touchmove.jcrop', trackTouchMove)
                .bind('touchend.jcrop', trackTouchEnd);
    
            else if (trackDoc)
                $(document)
                .bind('mousemove.jcrop',trackMove)
                .bind('mouseup.jcrop',trackUp);
            } 
            //}}}
            function toBack() //{{{
            {
            $trk.css({
                zIndex: 290
            });
            $(document).unbind('.jcrop');
            } 
            //}}}
            function trackMove(e) //{{{
            {
            onMove(mouseAbs(e));
            return false;
            } 
            //}}}
            function trackUp(e) //{{{
            {
            e.preventDefault();
            e.stopPropagation();
    
            if (btndown) {
                btndown = false;
    
                onDone(mouseAbs(e));
    
                if (Selection.isAwake()) {
                options.onSelect.call(api, unscale(Coords.getFixed()));
                }
    
                toBack();
                onMove = function () {};
                onDone = function () {};
            }
    
            return false;
            }
            //}}}
            function activateHandlers(move, done, touch) //{{{
            {
            btndown = true;
            onMove = move;
            onDone = done;
            toFront(touch);
            return false;
            }
            //}}}
            function trackTouchMove(e) //{{{
            {
            onMove(mouseAbs(Touch.cfilter(e)));
            return false;
            }
            //}}}
            function trackTouchEnd(e) //{{{
            {
            return trackUp(Touch.cfilter(e));
            }
            //}}}
            function setCursor(t) //{{{
            {
            $trk.css('cursor', t);
            }
            //}}}
    
            if (!trackDoc) {
            $trk.mousemove(trackMove).mouseup(trackUp).mouseout(trackUp);
            }
    
            $img.before($trk);
            return {
            activateHandlers: activateHandlers,
            setCursor: setCursor
            };
        }());
        //}}}
        // KeyManager Module {{{
        var KeyManager = (function () {
            var $keymgr = $('<input type="radio" />').css({
            position: 'fixed',
            left: '-120px',
            width: '12px'
            }).addClass('jcrop-keymgr'),
    
            $keywrap = $('<div />').css({
                position: 'absolute',
                overflow: 'hidden'
            }).append($keymgr);
    
            function watchKeys() //{{{
            {
            if (options.keySupport) {
                $keymgr.show();
                $keymgr.focus();
            }
            }
            //}}}
            function onBlur(e) //{{{
            {
            $keymgr.hide();
            }
            //}}}
            function doNudge(e, x, y) //{{{
            {
            if (options.allowMove) {
                Coords.moveOffset([x, y]);
                Selection.updateVisible(true);
            }
            e.preventDefault();
            e.stopPropagation();
            }
            //}}}
            function parseKey(e) //{{{
            {
            if (e.ctrlKey || e.metaKey) {
                return true;
            }
            shift_down = e.shiftKey ? true : false;
            var nudge = shift_down ? 10 : 1;
    
            switch (e.keyCode) {
            case 37:
                doNudge(e, -nudge, 0);
                break;
            case 39:
                doNudge(e, nudge, 0);
                break;
            case 38:
                doNudge(e, 0, -nudge);
                break;
            case 40:
                doNudge(e, 0, nudge);
                break;
            case 27:
                if (options.allowSelect) Selection.release();
                break;
            case 9:
                return true;
            }
    
            return false;
            }
            //}}}
    
            if (options.keySupport) {
            $keymgr.keydown(parseKey).blur(onBlur);
            if (ie6mode || !options.fixedSupport) {
                $keymgr.css({
                position: 'absolute',
                left: '-20px'
                });
                $keywrap.append($keymgr).insertBefore($img);
            } else {
                $keymgr.insertBefore($img);
            }
            }
    
    
            return {
            watchKeys: watchKeys
            };
        }());
        //}}}
        // }}}
        // API methods {{{
        function setClass(cname) //{{{
        {
            $div.removeClass().addClass(cssClass('holder')).addClass(cname);
        }
        //}}}
        function animateTo(a, callback) //{{{
        {
            var x1 = a[0] / xscale,
                y1 = a[1] / yscale,
                x2 = a[2] / xscale,
                y2 = a[3] / yscale;
    
            if (animating) {
            return;
            }
    
            var animto = Coords.flipCoords(x1, y1, x2, y2),
                c = Coords.getFixed(),
                initcr = [c.x, c.y, c.x2, c.y2],
                animat = initcr,
                interv = options.animationDelay,
                ix1 = animto[0] - initcr[0],
                iy1 = animto[1] - initcr[1],
                ix2 = animto[2] - initcr[2],
                iy2 = animto[3] - initcr[3],
                pcent = 0,
                velocity = options.swingSpeed;
    
            x1 = animat[0];
            y1 = animat[1];
            x2 = animat[2];
            y2 = animat[3];
    
            Selection.animMode(true);
            var anim_timer;
    
            function queueAnimator() {
            window.setTimeout(animator, interv);
            }
            var animator = (function () {
            return function () {
                pcent += (100 - pcent) / velocity;
    
                animat[0] = Math.round(x1 + ((pcent / 100) * ix1));
                animat[1] = Math.round(y1 + ((pcent / 100) * iy1));
                animat[2] = Math.round(x2 + ((pcent / 100) * ix2));
                animat[3] = Math.round(y2 + ((pcent / 100) * iy2));
    
                if (pcent >= 99.8) {
                pcent = 100;
                }
                if (pcent < 100) {
                setSelectRaw(animat);
                queueAnimator();
                } else {
                Selection.done();
                Selection.animMode(false);
                if (typeof(callback) === 'function') {
                    callback.call(api);
                }
                }
            };
            }());
            queueAnimator();
        }
        //}}}
        function setSelect(rect) //{{{
        {
            setSelectRaw([rect[0] / xscale, rect[1] / yscale, rect[2] / xscale, rect[3] / yscale]);
            options.onSelect.call(api, unscale(Coords.getFixed()));
            Selection.enableHandles();
        }
        //}}}
        function setSelectRaw(l) //{{{
        {
            Coords.setPressed([l[0], l[1]]);
            Coords.setCurrent([l[2], l[3]]);
            Selection.update();
        }
        //}}}
        function tellSelect() //{{{
        {
            return unscale(Coords.getFixed());
        }
        //}}}
        function tellScaled() //{{{
        {
            return Coords.getFixed();
        }
        //}}}
        function setOptionsNew(opt) //{{{
        {
            setOptions(opt);
            interfaceUpdate();
        }
        //}}}
        function disableCrop() //{{{
        {
            options.disabled = true;
            Selection.disableHandles();
            Selection.setCursor('default');
            Tracker.setCursor('default');
        }
        //}}}
        function enableCrop() //{{{
        {
            options.disabled = false;
            interfaceUpdate();
        }
        //}}}
        function cancelCrop() //{{{
        {
            Selection.done();
            Tracker.activateHandlers(null, null);
        }
        //}}}
        function destroy() //{{{
        {
            $div.remove();
            $origimg.show();
            $origimg.css('visibility','visible');
            $(obj).removeData('Jcrop');
        }
        //}}}
        function setImage(src, callback) //{{{
        {
            Selection.release();
            disableCrop();
            var img = new Image();
            img.onload = function () {
            var iw = img.width;
            var ih = img.height;
            var bw = options.boxWidth;
            var bh = options.boxHeight;
            $img.width(iw).height(ih);
            $img.attr('src', src);
            $img2.attr('src', src);
            presize($img, bw, bh);
            boundx = $img.width();
            boundy = $img.height();
            $img2.width(boundx).height(boundy);
            $trk.width(boundx + (bound * 2)).height(boundy + (bound * 2));
            $div.width(boundx).height(boundy);
            Shade.resize(boundx,boundy);
            enableCrop();
    
            if (typeof(callback) === 'function') {
                callback.call(api);
            }
            };
            img.src = src;
        }
        //}}}
        function colorChangeMacro($obj,color,now) {
            var mycolor = color || options.bgColor;
            if (options.bgFade && supportsColorFade() && options.fadeTime && !now) {
            $obj.animate({
                backgroundColor: mycolor
            }, {
                queue: false,
                duration: options.fadeTime
            });
            } else {
            $obj.css('backgroundColor', mycolor);
            }
        }
        function interfaceUpdate(alt) //{{{
        // This method tweaks the interface based on options object.
        // Called when options are changed and at end of initialization.
        {
            if (options.allowResize) {
            if (alt) {
                Selection.enableOnly();
            } else {
                Selection.enableHandles();
            }
            } else {
            Selection.disableHandles();
            }
    
            Tracker.setCursor(options.allowSelect ? 'crosshair' : 'default');
            Selection.setCursor(options.allowMove ? 'move' : 'default');
    
            if (options.hasOwnProperty('trueSize')) {
            xscale = options.trueSize[0] / boundx;
            yscale = options.trueSize[1] / boundy;
            }
    
            if (options.hasOwnProperty('setSelect')) {
            setSelect(options.setSelect);
            Selection.done();
            delete(options.setSelect);
            }
    
            Shade.refresh();
    
            if (options.bgColor != bgcolor) {
            colorChangeMacro(
                options.shade? Shade.getShades(): $div,
                options.shade?
                (options.shadeColor || options.bgColor):
                options.bgColor
            );
            bgcolor = options.bgColor;
            }
    
            if (bgopacity != options.bgOpacity) {
            bgopacity = options.bgOpacity;
            if (options.shade) Shade.refresh();
                else Selection.setBgOpacity(bgopacity);
            }
    
            xlimit = options.maxSize[0] || 0;
            ylimit = options.maxSize[1] || 0;
            xmin = options.minSize[0] || 0;
            ymin = options.minSize[1] || 0;
    
            if (options.hasOwnProperty('outerImage')) {
            $img.attr('src', options.outerImage);
            delete(options.outerImage);
            }
    
            Selection.refresh();
        }
        //}}}
        //}}}
    
        if (Touch.support) $trk.bind('touchstart.jcrop', Touch.newSelection);
    
        $hdl_holder.hide();
        interfaceUpdate(true);
    
        var api = {
            setImage: setImage,
            animateTo: animateTo,
            setSelect: setSelect,
            setOptions: setOptionsNew,
            tellSelect: tellSelect,
            tellScaled: tellScaled,
            setClass: setClass,
    
            disable: disableCrop,
            enable: enableCrop,
            cancel: cancelCrop,
            release: Selection.release,
            destroy: destroy,
    
            focus: KeyManager.watchKeys,
    
            getBounds: function () {
            return [boundx * xscale, boundy * yscale];
            },
            getWidgetSize: function () {
            return [boundx, boundy];
            },
            getScaleFactor: function () {
            return [xscale, yscale];
            },
            getOptions: function() {
            // careful: internal values are returned
            return options;
            },
    
            ui: {
            holder: $div,
            selection: $sel
            }
        };

        if (is_msie) $div.bind('selectstart', function () { return false; });
    
        $origimg.data('Jcrop', api);
        return api;
        };
        $.fn.Jcrop = function (options, callback) //{{{
        {
        var api;
    
        if (options.document)  document = options.document;    
        // Iterate over each object, attach Jcrop
        this.each(function () {
            // If we've already attached to this object
            if ($(this).data('Jcrop')) {
            // The API can be requested this way (undocumented)
            if (options === 'api') return $(this).data('Jcrop');
            // Otherwise, we just reset the options...
            else $(this).data('Jcrop').setOptions(options);
            }
            // If we haven't been attached, preload and attach
            else {
            if (this.tagName == 'IMG')
                $.Jcrop.Loader(this,function(){
                $(this).css({display:'block',visibility:'hidden'});
                api = $.Jcrop(this, options);
                if ($.isFunction(callback)) callback.call(api);
                });
            else {
                $(this).css({display:'block',visibility:'hidden'});
                api = $.Jcrop(this, options);
                if ($.isFunction(callback)) callback.call(api);
            }
            }
        });
    
        // Return "this" so the object is chainable (jQuery-style)
        return this;
        };
        //}}}
        // $.Jcrop.Loader - basic image loader {{{
    
        $.Jcrop.Loader = function(imgobj,success,error){
        var $img = $(imgobj), img = $img[0];
    
        function completeCheck(){
            if (img.complete) {
            $img.unbind('.jcloader');
            if ($.isFunction(success)) success.call(img);
            }
            else window.setTimeout(completeCheck,50);
        }
    
        $img
            .bind('load.jcloader',completeCheck)
            .bind('error.jcloader',function(e){
            $img.unbind('.jcloader');
            if ($.isFunction(error)) error.call(img);
            });
    
        if (img.complete && $.isFunction(success)){
            $img.unbind('.jcloader');
            success.call(img);
        }
        };
    
        //}}}
        // Global Defaults {{{
        $.Jcrop.defaults = {
    
        // Basic Settings
        allowSelect: true,
        allowMove: true,
        allowResize: true,
    
        trackDocument: true,
    
        // Styling Options
        baseClass: 'jcrop',
        addClass: null,
        bgColor: 'black',
        bgOpacity: 0.6,
        bgFade: false,
        borderOpacity: 0.4,
        handleOpacity: 0.5,
        handleSize: null,
    
        aspectRatio: 0,
        keySupport: true,
        createHandles: ['n','s','e','w','nw','ne','se','sw'],
        createDragbars: ['n','s','e','w'],
        createBorders: ['n','s','e','w'],
        drawBorders: true,
        dragEdges: true,
        fixedSupport: true,
        touchSupport: null,
    
        shade: null,
    
        boxWidth: 0,
        boxHeight: 0,
        boundary: 2,
        fadeTime: 400,
        animationDelay: 20,
        swingSpeed: 3,
    
        minSelect: [0, 0],
        maxSize: [0, 0],
        minSize: [0, 0],
    
        // Callbacks / Event Handlers
        onChange: function () {},
        onSelect: function () {},
        onDblClick: function () {},
        onRelease: function () {}
        };
    
        // }}}
    }(jQuery));
};

WDSaisieAPI.prototype.GetListeFeuillesCSS = function GetListeFeuillesCSS() {
    var resultat = [];

    // recup des balises <style> dans le <head> du document avev data-windev defini
    var TabStyle = this.m_oDocument.head.querySelectorAll("style[data-windev]");
    TabStyle.forEach(function (elem) {   
        // ajoute une ingo
        var stInfo = { origine: elem.getAttribute('data-windev'), integre:true };
        resultat.push(stInfo);
    });
    // recup des balise <link> dans le <head> du document avec un href defini
    var TabStyle = this.m_oDocument.head.querySelectorAll("link[href]");
    TabStyle.forEach(function (elem) {
        // ajoute une ingo
        var stInfo = { origine: elem.getAttribute('href'), integre:false };
        resultat.push(stInfo);
    });

    // conversion en chaine JSON pour le WL
    var json_resultat = JSON.stringify(resultat);
    return json_resultat;
};
WDSaisieAPI.prototype.SupprimeFeuillesCSS = function SupprimeFeuillesCSS(origine, integre ) {
    var style;
    // recherche du style a supprimer
    var oRecherche = {
        balise : integre ? 'style' : 'link'
    ,   attr   : integre ? 'data-windev' : 'href'
    };
    var bSuppressionFaite = false;
    this.m_oDocument.head.querySelectorAll(oRecherche.balise+'['+oRecherche.attr+']').forEach((domBalise) => {
        if (domBalise.getAttribute(oRecherche.attr) === origine)
        {
            domBalise.remove();
            bSuppressionFaite=true;
        }
    });
    if (!bSuppressionFaite) {
        alert('CSS not found : \n<' + sSelector + '>')
        return;
    }
    this.m_sDerniereValeurHtmlAffectee = undefined;
};
WDSaisieAPI.prototype.AjouteFeuillesCSS = function SupprimeFeuillesCSS(origine, integre, sCodeCss) {
   //  on cree une balise <style> ou <link>
    var style;
    if (integre) {
        style = this.m_oDocument.createElement("style")
        style.setAttribute("data-windev", origine)
        style.innerHTML = "\n" + sCodeCss + "\n"
    }
    else {
        style = this.m_oDocument.createElement("link")
        style.setAttribute("href", origine)
        style.setAttribute("rel",  "stylesheet")
    }

    // ajouter le style dans le <head>
    this.m_oDocument.head.append(style);
    this.m_sDerniereValeurHtmlAffectee = undefined;
};
// renvoie AscenceurPosition( Champ, ascVert )
WDSaisieAPI.prototype.GetScrollPosY = function GetScrollPosY() {
    return Math.floor( this.m_oWindow.scrollY );
};
//  AscenceurPosition( Champ, ascVert, pos )
WDSaisieAPI.prototype.SetScrollPosY = function SetScrollPosY(pos) {
    this.m_oWindow.scroll(0, pos );
};
// renvoie AscenceurPositionMax( Champ, ascVert )
WDSaisieAPI.prototype.GetMaxScrollPosY = function GetMaxScrollPosY() {
    var nMaxPos = Math.max(this.m_oDocument.body.scrollHeight - this.m_oDocument.body.clientHeight,
                           this.m_oDocument.body.scrollHeight - document.documentElement.clientHeight,
                           this.m_oWindow.scrollY );
    return Math.floor(nMaxPos);
};
// renvoie la largeur necessaire au dessin du docuement pour export PODF
WDSaisieAPI.prototype.GetLargeurNecessaire = function GetLargeurNecessaire() {
    return Math.floor(this.m_oDocument.body.scrollWidth);
};


