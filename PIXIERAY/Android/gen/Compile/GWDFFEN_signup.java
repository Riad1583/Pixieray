/**
 * Code généré par WINDEV Mobile - NE PAS MODIFIER !
 * Objet WINDEV Mobile : Fenêtre
 * Classe Android : FEN_signup
 * Version de wdjava64.dll  : 28.0.464.1
 */


package com.innovgeek.pixieray.wdgen;


import com.innovgeek.pixieray.*;
import fr.pcsoft.wdjava.core.types.*;
import fr.pcsoft.wdjava.core.*;
import fr.pcsoft.wdjava.ui.champs.fenetre.*;
import fr.pcsoft.wdjava.ui.champs.image.*;
import fr.pcsoft.wdjava.ui.cadre.*;
import fr.pcsoft.wdjava.ui.champs.saisie.*;
import fr.pcsoft.wdjava.ui.champs.bouton.*;
import fr.pcsoft.wdjava.ui.champs.libelle.*;
import fr.pcsoft.wdjava.core.erreur.*;
import fr.pcsoft.wdjava.core.application.*;
import fr.pcsoft.wdjava.ui.activite.*;
/*Imports trouvés dans le code WL*/
/*Fin Imports trouvés dans le code WL*/



public class GWDFFEN_signup extends WDFenetre
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs de FEN_signup
////////////////////////////////////////////////////////////////////////////

/**
 * IMG_SansNom1
 */
class GWDIMG_SansNom1 extends WDChampImage
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°1 de FEN_signup.IMG_SansNom1
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );

super.setQuid(2688596922740405491l);

super.setChecksum("829838299");

super.setNom("IMG_SansNom1");

super.setType(30001);

super.setBulle("");

super.setLibelle("");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(false);

super.setEtatInitial(0);

super.setPositionInitiale(58, 18);

super.setTailleInitiale(245, 14);

super.setValeurInitiale("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\logo_pixieray_light@3x.png");

super.setPlan(0);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(1);

super.setAncrageInitial(4, 1000, 1000, 500, 1000, 0, false);

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
public GWDIMG_SansNom1 mWD_IMG_SansNom1;

/**
 * SAI_SansNom1
 */
class GWDSAI_SansNom1 extends WDChampSaisieSimple
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°2 de FEN_signup.SAI_SansNom1
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setRectLibelle(0,0,303,17);
super.setRectCompPrincipal(0,17,303,45);

super.setQuid(2688596922740471027l);

super.setChecksum("829901099");

super.setNom("SAI_SansNom1");

super.setType(20001);

super.setBulle("");

super.setLibelle("Last name");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setTaille(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 174);

super.setTailleInitiale(303, 64);

super.setValeurInitiale("");

super.setPlan(0);

super.setCadrageHorizontal(0);

super.setMotDePasse(false);

super.setTypeSaisie(0);

super.setMasqueSaisie(new WDChaineU("0"));

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(2);

super.setAncrageInitial(8, 1000, 1000, 1000, 1000, 0, false);

super.setEllipse(0);

super.setIndication("");

super.setNumTab(2);

super.setModeAscenseur(2, 2);

super.setEffacementAutomatique(true);

super.setFinSaisieAutomatique(false);

super.setLettreAppel(65535);

super.setSelectionEnAffichage(true);

super.setPersistant(false);

super.setClavierEnSaisie(true);

super.setMasqueAffichage(new WDChaineU(""));

super.setParamBtnActionClavier(0, "");

super.setMiseABlancSiZero(true);

super.setVerifieOrthographe(true);

super.setTauxParallaxe(0, 0, false);

super.setBoutonSuppression(0);

super.setPresenceLibelle(true);

super.setOpacite(100);

super.setStyleLibelle(0x303030, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 2, 0, 0x0);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(1, 0xC0C0C0, 0x404040, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null), 0, 0, 0, 0);

super.setCadreInterne(WDCadreFactory.creerCadre_GEN("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Gabarits\\WM\\250 Phoenix\\Phoenix_Edt@dpi1x.png?E5_3NP_8_8_8_8", new int[] {1,4,1,2,2,2,1,4,1}, new int[] {8, 8, 8, 8}, 0xFFFFFF, 5, 1, null), 2, 0, 0, 0);

super.setStyleSaisie(0x0, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStyleTexteIndication(0x8B8680, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f), 0);

super.setStyleJeton(WDCadreFactory.creerCadre_GEN(27, 0xF48542, 0x740500, 0xFFFFFF, 16.000000, 16.000000, 1, 1, 0, null), 0xF48542, 0xFF000001, "", 1);

super.setParamSaisieObligatoire(false, true);

super.setParamErreurSaisieInvalide("", true, false, false);

super.setParamErreurSaisieObligatoire("", true, false, false);

super.setParamIndicationSaisieObligatoire(true, false, false);

super.setVisualisationMarkdown(false);

super.setStyleChampErreurSaisieInvalide(null, null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieInvalide(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieInvalide(21, 141);

super.setStyleChampErreurSaisieObligatoire(null, null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieObligatoire(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieObligatoire(21, 141);

super.setStyleChampIndicationSaisieObligatoire(null, null, 0xFF, 0xFF);

super.setStyleLibelleIndicationSaisieObligatoire(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoIndicationSaisieObligatoire(21, 141);

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
public GWDSAI_SansNom1 mWD_SAI_SansNom1;

/**
 * SAI_SansNom2
 */
class GWDSAI_SansNom2 extends WDChampSaisieSimple
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°3 de FEN_signup.SAI_SansNom2
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setRectLibelle(0,0,303,17);
super.setRectCompPrincipal(0,17,303,45);

super.setQuid(2688596922740536563l);

super.setChecksum("830059557");

super.setNom("SAI_SansNom2");

super.setType(20002);

super.setBulle("");

super.setLibelle("Date of birth");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setTaille(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 247);

super.setTailleInitiale(303, 64);

super.setValeurInitiale("");

super.setPlan(0);

super.setCadrageHorizontal(0);

super.setMotDePasse(false);

super.setTypeSaisie(2);

super.setFormatMemorise("AAAAMMJJ");

super.setMasqueSaisie(new WDChaineU("UseDatePickerDateMask"));

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(3);

super.setAncrageInitial(8, 1000, 1000, 1000, 1000, 0, false);

super.setEllipse(0);

super.setIndication("");

super.setNumTab(3);

super.setModeAscenseur(2, 2);

super.setEffacementAutomatique(true);

super.setFinSaisieAutomatique(false);

super.setLettreAppel(65535);

super.setSelectionEnAffichage(true);

super.setPersistant(false);

super.setClavierEnSaisie(true);

super.setMasqueAffichage(new WDChaineU(""));

super.setParamBtnActionClavier(0, "");

super.setMiseABlancSiZero(true);

super.setVerifieOrthographe(true);

super.setTauxParallaxe(0, 0, false);

super.setBoutonSuppression(0);

super.setPresenceLibelle(true);

super.setOpacite(100);

super.setStyleLibelle(0x303030, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 2, 0, 0x0);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(1, 0xC0C0C0, 0x404040, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null), 0, 0, 0, 0);

super.setCadreInterne(WDCadreFactory.creerCadre_GEN("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Gabarits\\WM\\250 Phoenix\\Phoenix_Edt@dpi1x.png?E5_3NP_8_8_8_8", new int[] {1,4,1,2,2,2,1,4,1}, new int[] {8, 8, 8, 8}, 0xFFFFFF, 5, 1, null), 2, 0, 0, 0);

super.setStyleSaisie(0x0, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStyleTexteIndication(0x8B8680, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f), 0);

super.setStyleJeton(WDCadreFactory.creerCadre_GEN(27, 0xF48542, 0x740500, 0xFFFFFF, 16.000000, 16.000000, 1, 1, 0, null), 0xF48542, 0xFF000001, "", 1);

super.setParamSaisieObligatoire(false, true);

super.setParamErreurSaisieInvalide("", true, false, false);

super.setParamErreurSaisieObligatoire("", true, false, false);

super.setParamIndicationSaisieObligatoire(true, false, false);

super.setVisualisationMarkdown(false);

super.setStyleChampErreurSaisieInvalide(null, null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieInvalide(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieInvalide(21, 141);

super.setStyleChampErreurSaisieObligatoire(null, null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieObligatoire(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieObligatoire(21, 141);

super.setStyleChampIndicationSaisieObligatoire(null, null, 0xFF, 0xFF);

super.setStyleLibelleIndicationSaisieObligatoire(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoIndicationSaisieObligatoire(21, 141);

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
public GWDSAI_SansNom2 mWD_SAI_SansNom2;

/**
 * BTN_SansNom1
 */
class GWDBTN_SansNom1 extends WDBouton
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°4 de FEN_signup.BTN_SansNom1
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setQuid(2688596922740733171l);

super.setChecksum("830164155");

super.setNom("BTN_SansNom1");

super.setType(4);

super.setBulle("");

super.setLibelle("CREATE ACCOUNT");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 491);

super.setTailleInitiale(303, 48);

super.setPlan(0);

super.setImageEtat(1);

super.setImageFondEtat(5);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(4);

super.setAncrageInitial(8, 1000, 1000, 1000, 1000, 0, false);

super.setNumTab(6);

super.setLettreAppel(65535);

super.setTypeBouton(0);

super.setTypeActionPredefinie(0);

super.setBoutonOnOff(false);

super.setTauxParallaxe(0, 0, false);

super.setLibelleVAlign(1);

super.setLibelleHAlign(5);

super.setPresenceLibelle(true);

super.setImage("", 0, 2, 1, null, null, null);

super.setOpacite(100);

super.setStyleLibelleRepos(0xFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setStyleLibelleSurvol(0xFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setStyleLibelleEnfonce(0xFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setCadreRepos(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreSurvol(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreEnfonce(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreGrise(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setImageFond9Images(new int[] {1,2,1,2,2,2,1,2,1}, 10, 10, 10, 10);

super.setImageFond("", 1, 0, 1, 1);

super.setParamAnimationChamp(41, 32, 300);
super.setParamAnimationChamp(42, 1, 200);

super.setMarges(3, 3, 2);

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
public GWDBTN_SansNom1 mWD_BTN_SansNom1;

/**
 * IMG_SansNom2
 */
class GWDIMG_SansNom2 extends WDChampImage
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°5 de FEN_signup.IMG_SansNom2
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );

super.setQuid(2688596922740864243l);

super.setChecksum("830297051");

super.setNom("IMG_SansNom2");

super.setType(30001);

super.setBulle("");

super.setLibelle("");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(false);

super.setEtatInitial(0);

super.setPositionInitiale(64, 557);

super.setTailleInitiale(233, 30);

super.setValeurInitiale("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Groupe 14.svg");

super.setPlan(0);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(5);

super.setAncrageInitial(4, 1000, 1000, 500, 1000, 0, false);

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
public GWDIMG_SansNom2 mWD_IMG_SansNom2;

/**
 * LIB_SansNom2
 */
class GWDLIB_SansNom2 extends WDLibelle
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°6 de FEN_signup.LIB_SansNom2
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setQuid(2688597017243601620l);

super.setChecksum("843751658");

super.setNom("LIB_SansNom2");

super.setType(3);

super.setBulle("");

super.setTypeSaisie(0);

super.setMasqueSaisie(new WDChaineU("0"));

super.setLibelle("Create account");

super.setNote("", "");

super.setCurseurSouris(0);

super.setEtatInitial(0);

super.setPositionInitiale(29, 58);

super.setTailleInitiale(178, 27);

super.setPlan(0);

super.setCadrageHorizontal(0);

super.setCadrageVertical(1);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(6);

super.setAncrageInitial(0, 1000, 1000, 1000, 1000, 0, false);

super.setEllipse(0);

super.setTauxParallaxe(0, 0, false);

super.setPresenceLibelle(true);

super.setStyleLibelle(0x0, 0xFFFFFFFF, creerPolice_GEN("Roboto", -9.000000f, 2, 1, 1.000000f, 0.000000f), 3, 0, 0x303030, 0);

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
public GWDLIB_SansNom2 mWD_LIB_SansNom2;

/**
 * SAI_SansNom3
 */
class GWDSAI_SansNom3 extends WDChampSaisieSimple
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°7 de FEN_signup.SAI_SansNom3
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setRectLibelle(0,0,303,17);
super.setRectCompPrincipal(0,17,303,45);

super.setQuid(2688597249175166591l);

super.setChecksum("847082243");

super.setNom("SAI_SansNom3");

super.setType(20001);

super.setBulle("");

super.setLibelle("First name");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setTaille(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 101);

super.setTailleInitiale(303, 64);

super.setValeurInitiale("");

super.setPlan(0);

super.setCadrageHorizontal(0);

super.setMotDePasse(false);

super.setTypeSaisie(0);

super.setMasqueSaisie(new WDChaineU("0"));

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(7);

super.setAncrageInitial(8, 1000, 1000, 1000, 1000, 0, false);

super.setEllipse(0);

super.setIndication("");

super.setNumTab(1);

super.setModeAscenseur(2, 2);

super.setEffacementAutomatique(true);

super.setFinSaisieAutomatique(false);

super.setLettreAppel(65535);

super.setSelectionEnAffichage(true);

super.setPersistant(false);

super.setClavierEnSaisie(true);

super.setMasqueAffichage(new WDChaineU(""));

super.setParamBtnActionClavier(0, "");

super.setMiseABlancSiZero(true);

super.setVerifieOrthographe(true);

super.setTauxParallaxe(0, 0, false);

super.setBoutonSuppression(0);

super.setPresenceLibelle(true);

super.setOpacite(100);

super.setStyleLibelle(0x303030, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 2, 0, 0x0);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(1, 0xC0C0C0, 0x404040, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null), 0, 0, 0, 0);

super.setCadreInterne(WDCadreFactory.creerCadre_GEN("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Gabarits\\WM\\250 Phoenix\\Phoenix_Edt@dpi1x.png?E5_3NP_8_8_8_8", new int[] {1,4,1,2,2,2,1,4,1}, new int[] {8, 8, 8, 8}, 0xFFFFFF, 5, 1, null), 2, 0, 0, 0);

super.setStyleSaisie(0x0, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStyleTexteIndication(0x8B8680, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f), 0);

super.setStyleJeton(WDCadreFactory.creerCadre_GEN(27, 0xF48542, 0x740500, 0xFFFFFF, 16.000000, 16.000000, 1, 1, 0, null), 0xF48542, 0xFF000001, "", 1);

super.setParamSaisieObligatoire(false, true);

super.setParamErreurSaisieInvalide("", true, false, false);

super.setParamErreurSaisieObligatoire("", true, false, false);

super.setParamIndicationSaisieObligatoire(true, false, false);

super.setVisualisationMarkdown(false);

super.setStyleChampErreurSaisieInvalide(null, null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieInvalide(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieInvalide(21, 141);

super.setStyleChampErreurSaisieObligatoire(null, null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieObligatoire(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieObligatoire(21, 141);

super.setStyleChampIndicationSaisieObligatoire(null, null, 0xFF, 0xFF);

super.setStyleLibelleIndicationSaisieObligatoire(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoIndicationSaisieObligatoire(21, 141);

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
public GWDSAI_SansNom3 mWD_SAI_SansNom3;

/**
 * SAI_SansNom4
 */
class GWDSAI_SansNom4 extends WDChampSaisieSimple
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°8 de FEN_signup.SAI_SansNom4
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setRectLibelle(0,0,303,17);
super.setRectCompPrincipal(0,17,303,45);

super.setQuid(2688597541237204242l);

super.setChecksum("851343834");

super.setNom("SAI_SansNom4");

super.setType(20001);

super.setBulle("");

super.setLibelle("Email");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setTaille(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 320);

super.setTailleInitiale(303, 64);

super.setValeurInitiale("");

super.setPlan(0);

super.setCadrageHorizontal(0);

super.setMotDePasse(false);

super.setTypeSaisie(0);

super.setMasqueSaisie(new WDChaineU("0"));

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(8);

super.setAncrageInitial(8, 1000, 1000, 1000, 1000, 0, false);

super.setEllipse(0);

super.setIndication("");

super.setNumTab(4);

super.setModeAscenseur(2, 2);

super.setEffacementAutomatique(true);

super.setFinSaisieAutomatique(false);

super.setLettreAppel(65535);

super.setSelectionEnAffichage(true);

super.setPersistant(false);

super.setClavierEnSaisie(true);

super.setMasqueAffichage(new WDChaineU(""));

super.setParamBtnActionClavier(0, "");

super.setMiseABlancSiZero(true);

super.setVerifieOrthographe(true);

super.setTauxParallaxe(0, 0, false);

super.setBoutonSuppression(0);

super.setPresenceLibelle(true);

super.setOpacite(100);

super.setStyleLibelle(0x303030, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 2, 0, 0x0);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(1, 0xC0C0C0, 0x404040, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null), 0, 0, 0, 0);

super.setCadreInterne(WDCadreFactory.creerCadre_GEN("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Gabarits\\WM\\250 Phoenix\\Phoenix_Edt@dpi1x.png?E5_3NP_8_8_8_8", new int[] {1,4,1,2,2,2,1,4,1}, new int[] {8, 8, 8, 8}, 0xFFFFFF, 5, 1, null), 2, 0, 0, 0);

super.setStyleSaisie(0x0, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStyleTexteIndication(0x8B8680, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f), 0);

super.setStyleJeton(WDCadreFactory.creerCadre_GEN(27, 0xF48542, 0x740500, 0xFFFFFF, 16.000000, 16.000000, 1, 1, 0, null), 0xF48542, 0xFF000001, "", 1);

super.setParamSaisieObligatoire(false, true);

super.setParamErreurSaisieInvalide("", true, false, false);

super.setParamErreurSaisieObligatoire("", true, false, false);

super.setParamIndicationSaisieObligatoire(true, false, false);

super.setVisualisationMarkdown(false);

super.setStyleChampErreurSaisieInvalide(null, null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieInvalide(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieInvalide(21, 141);

super.setStyleChampErreurSaisieObligatoire(null, null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieObligatoire(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieObligatoire(21, 141);

super.setStyleChampIndicationSaisieObligatoire(null, null, 0xFF, 0xFF);

super.setStyleLibelleIndicationSaisieObligatoire(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoIndicationSaisieObligatoire(21, 141);

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
public GWDSAI_SansNom4 mWD_SAI_SansNom4;

/**
 * SAI_SansNom5
 */
class GWDSAI_SansNom5 extends WDChampSaisieSimple
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°9 de FEN_signup.SAI_SansNom5
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setRectLibelle(0,0,303,17);
super.setRectCompPrincipal(0,17,303,45);

super.setQuid(2688597549827403009l);

super.setChecksum("851608098");

super.setNom("SAI_SansNom5");

super.setType(20001);

super.setBulle("");

super.setLibelle("Password");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setTaille(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 393);

super.setTailleInitiale(303, 64);

super.setValeurInitiale("");

super.setPlan(0);

super.setCadrageHorizontal(0);

super.setMotDePasse(true);

super.setTypeSaisie(0);

super.setMasqueSaisie(new WDChaineU("0"));

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(9);

super.setAncrageInitial(8, 1000, 1000, 1000, 1000, 0, false);

super.setEllipse(0);

super.setIndication("");

super.setNumTab(5);

super.setModeAscenseur(2, 2);

super.setEffacementAutomatique(true);

super.setFinSaisieAutomatique(false);

super.setLettreAppel(65535);

super.setSelectionEnAffichage(true);

super.setPersistant(false);

super.setClavierEnSaisie(true);

super.setMasqueAffichage(new WDChaineU(""));

super.setParamBtnActionClavier(0, "");

super.setMiseABlancSiZero(true);

super.setVerifieOrthographe(true);

super.setTauxParallaxe(0, 0, false);

super.setBoutonSuppression(0);

super.setPresenceLibelle(true);

super.setOpacite(100);

super.setStyleLibelle(0x303030, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 2, 0, 0x0);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(1, 0xC0C0C0, 0x404040, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null), 0, 0, 0, 0);

super.setCadreInterne(WDCadreFactory.creerCadre_GEN("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Gabarits\\WM\\250 Phoenix\\Phoenix_Edt@dpi1x.png?E5_3NP_8_8_8_8", new int[] {1,4,1,2,2,2,1,4,1}, new int[] {8, 8, 8, 8}, 0xFFFFFF, 5, 1, null), 2, 0, 0, 0);

super.setStyleSaisie(0x0, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStyleTexteIndication(0x8B8680, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f), 0);

super.setStyleJeton(WDCadreFactory.creerCadre_GEN(27, 0xF48542, 0x740500, 0xFFFFFF, 16.000000, 16.000000, 1, 1, 0, null), 0xF48542, 0xFF000001, "", 1);

super.setParamSaisieObligatoire(false, true);

super.setParamErreurSaisieInvalide("", true, false, false);

super.setParamErreurSaisieObligatoire("", true, false, false);

super.setParamIndicationSaisieObligatoire(true, false, false);

super.setVisualisationMarkdown(false);

super.setStyleChampErreurSaisieInvalide(null, null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieInvalide(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieInvalide(21, 141);

super.setStyleChampErreurSaisieObligatoire(null, null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieObligatoire(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieObligatoire(21, 141);

super.setStyleChampIndicationSaisieObligatoire(null, null, 0xFF, 0xFF);

super.setStyleLibelleIndicationSaisieObligatoire(0x68635F, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoIndicationSaisieObligatoire(21, 141);

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
public GWDSAI_SansNom5 mWD_SAI_SansNom5;

/**
 * BTN_SansNom2
 */
class GWDBTN_SansNom2 extends WDBouton
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°10 de FEN_signup.BTN_SansNom2
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setQuid(2688598219859431009l);

super.setChecksum("868738903");

super.setNom("BTN_SansNom2");

super.setType(4);

super.setBulle("");

super.setLibelle("Continue with Google");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 605);

super.setTailleInitiale(303, 48);

super.setPlan(0);

super.setImageEtat(1);

super.setImageFondEtat(5);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(10);

super.setAncrageInitial(8, 1000, 1000, 1000, 1000, 0, false);

super.setNumTab(7);

super.setLettreAppel(65535);

super.setTypeBouton(0);

super.setTypeActionPredefinie(0);

super.setBoutonOnOff(false);

super.setTauxParallaxe(0, 0, false);

super.setLibelleVAlign(1);

super.setLibelleHAlign(6);

super.setPresenceLibelle(true);

super.setImage("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Groupe 16.svg", 0, 2, 1, null, null, null);

super.setOpacite(100);

super.setStyleLibelleRepos(0xFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setStyleLibelleSurvol(0xFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setStyleLibelleEnfonce(0xFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setCadreRepos(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreSurvol(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreEnfonce(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreGrise(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setImageFond9Images(new int[] {1,2,1,2,2,2,1,2,1}, 10, 10, 10, 10);

super.setImageFond("", 1, 0, 1, 1);

super.setParamAnimationChamp(41, 32, 300);
super.setParamAnimationChamp(42, 1, 200);

super.setMarges(3, 3, 2);

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
public GWDBTN_SansNom2 mWD_BTN_SansNom2;

/**
 * BTN_SansNom4
 */
class GWDBTN_SansNom4 extends WDBouton
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°11 de FEN_signup.BTN_SansNom4
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setQuid(2688598297169319495l);

super.setChecksum("869216079");

super.setNom("BTN_SansNom4");

super.setType(4);

super.setBulle("");

super.setLibelle("Continue with Facebook");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 669);

super.setTailleInitiale(303, 48);

super.setPlan(0);

super.setImageEtat(1);

super.setImageFondEtat(5);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(11);

super.setAncrageInitial(8, 1000, 1000, 500, 1000, 0, false);

super.setNumTab(8);

super.setLettreAppel(65535);

super.setTypeBouton(0);

super.setTypeActionPredefinie(0);

super.setBoutonOnOff(false);

super.setTauxParallaxe(0, 0, false);

super.setLibelleVAlign(1);

super.setLibelleHAlign(6);

super.setPresenceLibelle(true);

super.setImage("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Groupe 15.svg", 0, 2, 1, null, null, null);

super.setOpacite(100);

super.setStyleLibelleRepos(0xFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setStyleLibelleSurvol(0xFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setStyleLibelleEnfonce(0xFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setCadreRepos(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreSurvol(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreEnfonce(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreGrise(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0x0, 2.000000, 2.000000, 0, 1, 0, null));

super.setImageFond9Images(new int[] {1,2,1,2,2,2,1,2,1}, 10, 10, 10, 10);

super.setImageFond("", 1, 0, 1, 1);

super.setParamAnimationChamp(41, 32, 300);
super.setParamAnimationChamp(42, 1, 200);

super.setMarges(3, 3, 2);

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
public GWDBTN_SansNom4 mWD_BTN_SansNom4;

/**
 * Traitement: Déclarations globales de FEN_signup
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
// Création des champs de la fenêtre FEN_signup
////////////////////////////////////////////////////////////////////////////
protected void creerChamps()
{
mWD_IMG_SansNom1 = new GWDIMG_SansNom1();
mWD_SAI_SansNom1 = new GWDSAI_SansNom1();
mWD_SAI_SansNom2 = new GWDSAI_SansNom2();
mWD_BTN_SansNom1 = new GWDBTN_SansNom1();
mWD_IMG_SansNom2 = new GWDIMG_SansNom2();
mWD_LIB_SansNom2 = new GWDLIB_SansNom2();
mWD_SAI_SansNom3 = new GWDSAI_SansNom3();
mWD_SAI_SansNom4 = new GWDSAI_SansNom4();
mWD_SAI_SansNom5 = new GWDSAI_SansNom5();
mWD_BTN_SansNom2 = new GWDBTN_SansNom2();
mWD_BTN_SansNom4 = new GWDBTN_SansNom4();

}
////////////////////////////////////////////////////////////////////////////
// Initialisation de la fenêtre FEN_signup
////////////////////////////////////////////////////////////////////////////
public  void initialiserObjet()
{
super.setQuid(2688596922740339955l);

super.setChecksum("837699124");

super.setNom("FEN_signup");

super.setType(1);

super.setBulle("");

super.setMenuContextuelSysteme();

super.setCurseurSouris(0);

super.setNote("", "");

super.setCouleur(0x0);

super.setCouleurFond(0xFFFFFF);

super.setPositionInitiale(0, 0);

super.setTailleInitiale(360, 757);

super.setTitre("signup");

super.setTailleMin(-1, -1);

super.setTailleMax(20000, 20000);

super.setVisibleInitial(true);

super.setPositionFenetre(2);

super.setPersistant(true);

super.setGFI(true);

super.setAnimationFenetre(0);

super.setImageFond("", 1, 0, 1);

super.setCouleurTexteAutomatique(0x0);

super.setCouleurBarreSysteme(0xFFFFFF);

super.setCopieEcranAutorisee(true);


activerEcoute();

////////////////////////////////////////////////////////////////////////////
// Initialisation des champs de FEN_signup
////////////////////////////////////////////////////////////////////////////
mWD_IMG_SansNom1.initialiserObjet();
super.ajouter("IMG_SansNom1", mWD_IMG_SansNom1);
mWD_SAI_SansNom1.initialiserObjet();
super.ajouter("SAI_SansNom1", mWD_SAI_SansNom1);
mWD_SAI_SansNom2.initialiserObjet();
super.ajouter("SAI_SansNom2", mWD_SAI_SansNom2);
mWD_BTN_SansNom1.initialiserObjet();
super.ajouter("BTN_SansNom1", mWD_BTN_SansNom1);
mWD_IMG_SansNom2.initialiserObjet();
super.ajouter("IMG_SansNom2", mWD_IMG_SansNom2);
mWD_LIB_SansNom2.initialiserObjet();
super.ajouter("LIB_SansNom2", mWD_LIB_SansNom2);
mWD_SAI_SansNom3.initialiserObjet();
super.ajouter("SAI_SansNom3", mWD_SAI_SansNom3);
mWD_SAI_SansNom4.initialiserObjet();
super.ajouter("SAI_SansNom4", mWD_SAI_SansNom4);
mWD_SAI_SansNom5.initialiserObjet();
super.ajouter("SAI_SansNom5", mWD_SAI_SansNom5);
mWD_BTN_SansNom2.initialiserObjet();
super.ajouter("BTN_SansNom2", mWD_BTN_SansNom2);
mWD_BTN_SansNom4.initialiserObjet();
super.ajouter("BTN_SansNom4", mWD_BTN_SansNom4);

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
return GWDPPIXIERAY.getInstance().mWD_FEN_signup;
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
