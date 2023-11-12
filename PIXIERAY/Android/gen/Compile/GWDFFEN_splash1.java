/**
 * Code généré par WINDEV Mobile - NE PAS MODIFIER !
 * Objet WINDEV Mobile : Fenêtre
 * Classe Android : FEN_splash1
 * Version de wdjava64.dll  : 28.0.464.1
 */


package com.innovgeek.pixieray.wdgen;


import com.innovgeek.pixieray.*;
import fr.pcsoft.wdjava.core.types.*;
import fr.pcsoft.wdjava.core.*;
import fr.pcsoft.wdjava.ui.champs.fenetre.*;
import fr.pcsoft.wdjava.ui.champs.superchamp.*;
import fr.pcsoft.wdjava.ui.champs.libelle.*;
import fr.pcsoft.wdjava.ui.cadre.*;
import fr.pcsoft.wdjava.ui.champs.image.*;
import fr.pcsoft.wdjava.api.*;
import fr.pcsoft.wdjava.core.erreur.*;
import fr.pcsoft.wdjava.core.application.*;
import fr.pcsoft.wdjava.ui.activite.*;
/*Imports trouvés dans le code WL*/
/*Fin Imports trouvés dans le code WL*/



public class GWDFFEN_splash1 extends WDFenetre
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs de FEN_splash1
////////////////////////////////////////////////////////////////////////////

/**
 * SC_SansNom1
 */
class GWDSC_SansNom1 extends WDSuperChamp
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°1 de FEN_splash1.SC_SansNom1
////////////////////////////////////////////////////////////////////////////

/**
 * LIB_SansNom1
 */
class GWDLIB_SansNom1 extends WDLibelle
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°1 de FEN_splash1.SC_SansNom1.LIB_SansNom1
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setQuid(2688603537109479798l);

super.setChecksum("949276026");

super.setNom("LIB_SansNom1");

super.setType(3);

super.setBulle("");

super.setTypeSaisie(0);

super.setMasqueSaisie(new WDChaineU("0"));

super.setLibelle("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ");

super.setNote("", "");

super.setCurseurSouris(0);

super.setEtatInitial(0);

super.setPositionInitiale(26, 17);

super.setTailleInitiale(281, 70);

super.setPlan(0);

super.setCadrageHorizontal(1);

super.setCadrageVertical(1);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(1);

super.setAncrageInitial(9, 1000, 1000, 500, 1000, 0, false);

super.setEllipse(0);

super.setTauxParallaxe(0, 0, false);

super.setPresenceLibelle(true);

super.setStyleLibelle(0xFFFFFF, 0xFFFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 3, 0, 0x303030, 0);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(1, 0xE0DCDA, 0x605C5A, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null), 0, 0, 0, 0);

super.setParamAnimationChamp(42, 1, 200);

super.setMiseABlancSiZero(true);

super.setOpacite(100);

activerEcoute();
super.terminerInitialisation();
}

// Activation des écouteurs: 
public void activerEcoute()
{
}

////////////////////////////////////////////////////////////////////////////
// Déclaration des variables globales
////////////////////////////////////////////////////////////////////////////
}
public GWDLIB_SansNom1 mWD_LIB_SansNom1 = new GWDLIB_SansNom1();

/**
 * IMG_SansNom1
 */
class GWDIMG_SansNom1 extends WDChampImage
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°2 de FEN_splash1.SC_SansNom1.IMG_SansNom1
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );

super.setQuid(2688603738975415402l);

super.setChecksum("951751045");

super.setNom("IMG_SansNom1");

super.setType(30001);

super.setBulle("");

super.setLibelle("");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(false);

super.setEtatInitial(0);

super.setPositionInitiale(142, 103);

super.setTailleInitiale(48, 19);

super.setValeurInitiale("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Groupe 1.svg");

super.setPlan(0);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(2);

super.setAncrageInitial(5, 1000, 1000, 500, 1000, 0, false);

super.setTransparence(1);

super.setParamImage(2097158, 0, true, 100);

super.setSymetrie(0);

super.setZoneClicage(true);

super.setPCodeMultitouch(false);

super.setChargementEnTacheDeFond(false);

super.setOrientationExif(true);

super.setParamAnimation(1, 1, false, 300, true, false);

super.setAnimationInitiale(false);

super.setTauxParallaxe(0, 0, false);

super.setPresenceLibelle(false);

super.setOpacite(100);

super.setStyleLibelle(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f), -1, 0, 0x0);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null), 0, 0, 0, 0);

super.setParamAnimationChamp(42, 1, 200);

activerEcoute();
super.terminerInitialisation();
}

// Activation des écouteurs: 
public void activerEcoute()
{
}

////////////////////////////////////////////////////////////////////////////
// Déclaration des variables globales
////////////////////////////////////////////////////////////////////////////
}
public GWDIMG_SansNom1 mWD_IMG_SansNom1 = new GWDIMG_SansNom1();

/**
 * IMG_nest
 */
class GWDIMG_nest extends WDChampImage
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°3 de FEN_splash1.SC_SansNom1.IMG_nest
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );

super.setQuid(2688603953727303516l);

super.setChecksum("955274409");

super.setNom("IMG_nest");

super.setType(30001);

super.setBulle("");

super.setLibelle("");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(false);

super.setEtatInitial(0);

super.setPositionInitiale(285, 97);

super.setTailleInitiale(29, 23);

super.setValeurInitiale("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\icons8_Arrow.svg");

super.setPlan(0);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(3);

super.setAncrageInitial(5, 1000, 1000, 1000, 1000, 0, false);

super.setTransparence(1);

super.setParamImage(2097158, 0, true, 100);

super.setSymetrie(0);

super.setZoneClicage(true);

super.setPCodeMultitouch(false);

super.setChargementEnTacheDeFond(false);

super.setOrientationExif(true);

super.setParamAnimation(1, 1, false, 300, true, false);

super.setAnimationInitiale(false);

super.setTauxParallaxe(0, 0, false);

super.setPresenceLibelle(false);

super.setOpacite(100);

super.setStyleLibelle(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f), -1, 0, 0x0);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null), 0, 0, 0, 0);

super.setParamAnimationChamp(42, 1, 200);

activerEcoute();
super.terminerInitialisation();
}

/**
 * Traitement: Clic sur IMG_nest ( SC_SansNom1 )
 */
public void clicSurBoutonGauche()
{
super.clicSurBoutonGauche();

// OuvreFenêtreMobile(FEN_home)

try
{
// OuvreFenêtreMobile(FEN_home)
WDAPIFenetre.ouvreFille(GWDPPIXIERAY.getInstance().mWD_FEN_home);

}
catch(WDErreurNonFatale | WDException eCatch)
{
eCatch.catch_GEN();
return;
}
}




// Activation des écouteurs: 
public void activerEcoute()
{
super.activerEcouteurClic();
}

////////////////////////////////////////////////////////////////////////////
// Déclaration des variables globales
////////////////////////////////////////////////////////////////////////////
}
public GWDIMG_nest mWD_IMG_nest = new GWDIMG_nest();

/**
 * Initialise tous les champs de FEN_splash1.SC_SansNom1
 */
public void initialiserSousObjets()
{
////////////////////////////////////////////////////////////////////////////
// Initialisation des champs de FEN_splash1.SC_SansNom1
////////////////////////////////////////////////////////////////////////////
super.initialiserSousObjets();
mWD_LIB_SansNom1.initialiserObjet();
super.ajouter("LIB_SansNom1", mWD_LIB_SansNom1);
mWD_IMG_SansNom1.initialiserObjet();
super.ajouter("IMG_SansNom1", mWD_IMG_SansNom1);
mWD_IMG_nest.initialiserObjet();
super.ajouter("IMG_nest", mWD_IMG_nest);
}
public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setQuid(2688603361014010706l);

super.setChecksum("947482901");

super.setNom("SC_SansNom1");

super.setType(40);

super.setBulle("");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setNumTab(1);

super.setEtatInitial(0);

super.setPositionInitiale(14, 469);

super.setTailleInitiale(333, 132);

super.setValeurInitiale("");

super.setPlan(0);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(1);

super.setAncrageInitial(9, 1000, 1000, 1000, 1000, 0, false);

super.setPersistant(false);

super.setTailleUtile(331, 130);

super.setTauxParallaxe(0, 0, false);

super.setCouleurTexteAutomatique(0xFF000001);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(27, 0x0, 0x0, 0x0, 12.000000, 12.000000, 1, 1, 0, null), 0, 0, 0, 0);


activerEcoute();
initialiserSousObjets();
super.terminerInitialisation();
}

/**
 * Traitement: Déclarations globales de SC_SansNom1
 */
public void declarerGlobale()
{
// 

try
{
}
catch(WDErreurNonFatale | WDException eCatch)
{
eCatch.catch_GEN();
return;
}
}




// Activation des écouteurs: 
public void activerEcoute()
{
}

////////////////////////////////////////////////////////////////////////////
// Déclaration des variables globales
////////////////////////////////////////////////////////////////////////////
}
public GWDSC_SansNom1 mWD_SC_SansNom1;

/**
 * Traitement: Déclarations globales de FEN_splash1
 */
public void declarerGlobale(WDObjet[] WD_tabParam)
{
// PROCEDURE MaFenêtre()
super.declarerGlobale(WD_tabParam, 0, 0);
int WD_ntabParamLen = 0;
if(WD_tabParam!=null) WD_ntabParamLen = WD_tabParam.length;





try
{
}
catch(WDErreurNonFatale | WDException eCatch)
{
eCatch.catch_GEN();
return;
}
}




// Activation des écouteurs: 
public void activerEcoute()
{
}

////////////////////////////////////////////////////////////////////////////
// Déclaration des variables globales
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Création des champs de la fenêtre FEN_splash1
////////////////////////////////////////////////////////////////////////////
protected void creerChamps()
{
mWD_SC_SansNom1 = new GWDSC_SansNom1();

}
////////////////////////////////////////////////////////////////////////////
// Initialisation de la fenêtre FEN_splash1
////////////////////////////////////////////////////////////////////////////
public  void initialiserObjet()
{
super.setQuid(2688591270386950102l);

super.setChecksum("659949491");

super.setNom("FEN_splash1");

super.setType(1);

super.setBulle("");

super.setMenuContextuelSysteme();

super.setCurseurSouris(0);

super.setNote("", "");

super.setCouleur(0x0);

super.setCouleurFond(0xFFFFFF);

super.setPositionInitiale(0, 0);

super.setTailleInitiale(360, 625);

super.setTitre("");

super.setTailleMin(-1, -1);

super.setTailleMax(20000, 20000);

super.setVisibleInitial(true);

super.setPositionFenetre(1);

super.setPersistant(true);

super.setGFI(true);

super.setAnimationFenetre(0);

super.setImageFond("", 1, 0, 1);

super.setCouleurTexteAutomatique(0x68635F);

super.setCouleurBarreSysteme(0xFF000001);

super.setCopieEcranAutorisee(true);


activerEcoute();

////////////////////////////////////////////////////////////////////////////
// Initialisation des champs de FEN_splash1
////////////////////////////////////////////////////////////////////////////
mWD_SC_SansNom1.initialiserObjet();
super.ajouter("SC_SansNom1", mWD_SC_SansNom1);

super.terminerInitialisation();
}

////////////////////////////////////////////////////////////////////////////
public boolean isUniteAffichageLogique()
{
return false;
}

public WDProjet getProjet()
{
return GWDPPIXIERAY.getInstance();
}

public IWDEnsembleElement getEnsemble()
{
return GWDPPIXIERAY.getInstance();
}
public int getModeContexteHF()
{
return 1;
}
/**
* Retourne le mode d'affichage de l'ActionBar de la fenêtre.
*/
public int getModeActionBar()
{
return 0;
}
/**
* Retourne vrai si la fenêtre est maximisée, faux sinon.
*/
public boolean isMaximisee()
{
return true;
}
/**
* Retourne vrai si la fenêtre a une barre de titre, faux sinon.
*/
public boolean isAvecBarreDeTitre()
{
return false;
}
/**
* Retourne le mode d'affichage de la barre système de la fenêtre.
*/
public int getModeBarreSysteme()
{
return 1;
}
/**
* Retourne vrai si la fenêtre est munie d'ascenseurs automatique, faux sinon.
*/
public boolean isAvecAscenseurAuto()
{
return true;
}
/**
* Retourne Vrai si on doit appliquer un theme "dark" (sombre) ou Faux si on doit appliquer "light" (clair) à la fenêtre.
* Ce choix se base sur la couleur du libellé par défaut dans le gabarit de la fenêtre.
*/
public boolean isGabaritSombre()
{
return false;
}
public boolean isIgnoreModeNuit()
{
return false;
}
/**
* Retourne vrai si l'option de masquage automatique de l'ActionBar lorsqu'on scrolle dans un champ de la fenêtre a été activée.
*/
public boolean isMasquageAutomatiqueActionBar()
{
return false;
}
public static class WDActiviteFenetre extends WDActivite
{
protected WDFenetre getFenetre()
{
return GWDPPIXIERAY.getInstance().mWD_FEN_splash1;
}
}
/**
* Retourne le nom du gabarit associée à la fenêtre.
*/
public String getNomGabarit()
{
return "250 PHOENIX#WM";
}
}
