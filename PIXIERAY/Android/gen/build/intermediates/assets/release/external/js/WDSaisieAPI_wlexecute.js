// WDSaisieAPI_wlexecute.js
/*! 24.0.1.0 */
/*! VersionVI: yyyyyyyyyyyy */
// Le seul support technique disponible pour cette librairie est accessible a travers le service "Assistance Directe".

// Ne rien mettre d'autre dans ce fichier, il est aussi inclu en C++ via des #define

// commande dans WL.Execute() supportées par l'éditeur html:
var WLEXEC_ONLOAD	       ="onload";           // le doc a fini de se charger
var WLEXEC_SELECTIONCHANGE ="selectionchange";  // la sélection a changé
var WLEXEC_HTMLCHANGE      ="htmlchange";       // le contenu édité a changé
var WLEXEC_EDITIMAGE       ="editimage";        // l'utilisateur demande a éditer les propriétés de l'image sélectionnée depuis la mini barre
var WLEXEC_EDITTABLE       ="edittable";        // l'utilisateur demande a éditer les propriétés de la table depuis la mini barre
// var WLEXEC_EDITTABLEROW    ="edittablerow";  // l'utilisateur demande a éditer les propriétés de la ligne de table depuis la mini barre
// var WLEXEC_EDITTABLECOL    ="edittablecol";  // l'utilisateur demande a éditer les propriétés de la colonne de table depuis la mini barre
var WLEXEC_EDITTABLECEL    ="edittablecell";    // l'utilisateur demande a éditer les propriétés de la cellule de table depuis la mini barre
var WLEXEC_CLICLIEN        ="cliclien";         // l'utilisateur a cliqué sur un lien

// Commande que la OBJ envoie à la JS via WDSaisieAPI.JSEXEC_ElementCourant
var JSEXEC_ELEMENTCOURANT_READTABLE     ="jsreadtable";     // l'utilisateur demande a éditer les propriétés de la table, ligne, colonne ou cellule depuis le ruban
var JSEXEC_ELEMENTCOURANT_WRITETABLE    ="jswritetable";    // l'utilisateur demande a appliquer les modifications de la table

var JSEXEC_ELEMENTCOURANT_READIMG       ="jsreadimg";     // l'utilisateur demande a éditer les propriétés de l'image'
var JSEXEC_ELEMENTCOURANT_WRITEIMG      ="jswriteimg";    // l'utilisateur demande a appliquer les modifications de l'image

 
