/**
 * Code généré par WINDEV Mobile - NE PAS MODIFIER !
 * Objet WINDEV Mobile : Fenêtre
 * Classe Android : FEN_login
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
import fr.pcsoft.wdjava.ui.champs.groupeoptions.*;
import fr.pcsoft.wdjava.ui.champs.bouton.*;
import fr.pcsoft.wdjava.api.*;
import fr.pcsoft.wdjava.core.erreur.*;
import fr.pcsoft.wdjava.ui.champs.libelle.*;
import fr.pcsoft.wdjava.core.application.*;
import fr.pcsoft.wdjava.ui.activite.*;
/*Imports trouvés dans le code WL*/
/*Fin Imports trouvés dans le code WL*/



public class GWDFFEN_login extends WDFenetre
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs de FEN_login
////////////////////////////////////////////////////////////////////////////

/**
 * IMG_SansNom1
 */
class GWDIMG_SansNom1 extends WDChampImage
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°1 de FEN_login.IMG_SansNom1
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );

super.setQuid(2688591803000701897l);

super.setChecksum("691150345");

super.setNom("IMG_SansNom1");

super.setType(30001);

super.setBulle("");

super.setLibelle("");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(false);

super.setEtatInitial(0);

super.setPositionInitiale(58, 85);

super.setTailleInitiale(245, 32);

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
 * SAI_email
 */
class GWDSAI_email extends WDChampSaisieSimple
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°2 de FEN_login.SAI_email
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setRectLibelle(0,0,303,17);
super.setRectCompPrincipal(0,17,303,45);

super.setQuid(2688592601875618408l);

super.setChecksum("702147250");

super.setNom("SAI_email");

super.setType(20001);

super.setBulle("");

super.setLibelle("User / Email");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setTaille(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 190);

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

super.setCadreInterne(WDCadreFactory.creerCadre_GEN("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Gabarits\\WM\\250 Phoenix\\Phoenix_Edt@dpi1x.png?E5_3NP_8_8_8_8", new int[] {1,4,1,2,2,2,1,4,1}, new int[] {8, 8, 8, 8}, 0xFFFFFF, 5, 1, null), 17, 0, 0, 0);

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
public GWDSAI_email mWD_SAI_email;

/**
 * SAI_MotPasse
 */
class GWDSAI_MotPasse extends WDChampSaisieSimple
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°3 de FEN_login.SAI_MotPasse
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setRectLibelle(0,0,303,17);
super.setRectCompPrincipal(0,17,303,45);

super.setQuid(2688593611228425930l);

super.setChecksum("737640534");

super.setNom("SAI_MotPasse");

super.setType(20001);

super.setBulle("");

super.setLibelle("Password");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setTaille(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 268);

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

super.setAltitude(3);

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

super.setCadreInterne(WDCadreFactory.creerCadre_GEN("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Gabarits\\WM\\250 Phoenix\\Phoenix_Edt@dpi1x.png?E5_3NP_8_8_8_8", new int[] {1,4,1,2,2,2,1,4,1}, new int[] {8, 8, 8, 8}, 0xFFFFFF, 5, 1, null), 17, 0, 0, 0);

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
public GWDSAI_MotPasse mWD_SAI_MotPasse;

/**
 * INT_Interrupteur
 */
class GWDINT_Interrupteur extends WDInterrupteur
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°4 de FEN_login.INT_Interrupteur
////////////////////////////////////////////////////////////////////////////

/**
 * INT_Interrupteur_Option_0
 */
class GWDINT_Interrupteur_Option_0 extends WDCaseACocher
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°1 de FEN_login.INT_Interrupteur.INT_Interrupteur_Option_0
////////////////////////////////////////////////////////////////////////////
public  void initialiserObjet()
{
super.initialiserObjet();
super.setLibelle("Remember me");

super.setHauteurOption(0);

super.setNom("");

super.setStyleLibelleOption(0x0, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f));

super.terminerInitialisation();
}

////////////////////////////////////////////////////////////////////////////
// Déclaration des variables globales
////////////////////////////////////////////////////////////////////////////
}
public GWDINT_Interrupteur_Option_0 mWD_INT_Interrupteur_Option_0 = new GWDINT_Interrupteur_Option_0();

/**
 * Initialise tous les champs de FEN_login.INT_Interrupteur
 */
public void initialiserSousObjets()
{
////////////////////////////////////////////////////////////////////////////
// Initialisation des champs de FEN_login.INT_Interrupteur
////////////////////////////////////////////////////////////////////////////
super.initialiserSousObjets();
super.ajouterOption(mWD_INT_Interrupteur_Option_0);
positionnerOptions();
}
public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setRectCompPrincipal(0,0,131,42);

super.setQuid(2688593765885033697l);

super.setChecksum("775426962");

super.setNom("INT_Interrupteur");

super.setType(5);

super.setBulle("");

super.setLibelle("Remeber me");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 342);

super.setTailleInitiale(131, 42);

super.setValeurInitiale("0");

super.setPlan(0);

super.setTailleMin(0, 0);

super.setTailleMax(134217727, 134217727);

super.setVisibleInitial(true);

super.setAltitude(4);

super.setAncrageInitial(0, 1000, 1000, 1000, 1000, 0, false);

super.setNumTab(3);

super.setLettreAppel(65535);

super.setPersistant(false);

super.setParamOptions(false, 1, true, true, 0);

super.setTauxParallaxe(0, 0, false);

super.setPresenceLibelle(false);

super.setStyleLibelle(0x68635F, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), -1, 0, 0x808080);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(1, 0xF1000000, 0xF3000000, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null), 0, 0, 0, 0);

super.setCadreInterne(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null));

super.setParamAnimationChamp(42, 1, 200);

super.setImageCoche("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Gabarits\\WM\\250 Phoenix\\Phoenix_CBox@dpi1x.png?E12_8O", 1);

super.setOpacite(100);

super.setParamSaisieObligatoire(false);

super.setParamErreurSaisieObligatoire("", true, false, false);

super.setStyleChampErreurSaisieObligatoire(null, 0xFF, 0xFF);

super.setStyleLibelleErreurSaisieObligatoire(0x262626, creerPolice_GEN("Roboto", -8.000000f, 2, 0, 1.000000f, 0.000000f));

super.setStylePictoErreurSaisieObligatoire(8, 141);

activerEcoute();
initialiserSousObjets();
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
public GWDINT_Interrupteur mWD_INT_Interrupteur;

/**
 * BTN_SansNom1
 */
class GWDBTN_SansNom1 extends WDBouton
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°5 de FEN_login.BTN_SansNom1
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setQuid(2688594457384956267l);

super.setChecksum("785614581");

super.setNom("BTN_SansNom1");

super.setType(4);

super.setBulle("");

super.setLibelle("LOGIN");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(29, 403);

super.setTailleInitiale(303, 48);

super.setPlan(0);

super.setImageEtat(1);

super.setImageFondEtat(5);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(5);

super.setAncrageInitial(8, 1000, 1000, 1000, 1000, 0, false);

super.setNumTab(5);

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

/**
 * Traitement: Clic sur BTN_SansNom1
 */
public void clicSurBoutonGauche()
{
super.clicSurBoutonGauche();

// if SAI_email="" THEN

try
{
// if SAI_email="" THEN
if(mWD_SAI_email.opEgal("", 0))
{
// 	ToastAffiche("Please enter your email",toastCourt,cvMilieu,chCentre)
WDAPIToast.toastAffiche("Please enter your email",0,1,1);

}

// if SAI_MotPasse="" THEN
if(mWD_SAI_MotPasse.opEgal("", 0))
{
// 	ToastAffiche("Please enter your password",toastCourt,cvMilieu,chCentre)
WDAPIToast.toastAffiche("Please enter your password",0,1,1);

}

// HLitRecherchePremier(Employee,Email,SAI_email)
WDAPIHF.hLitRecherchePremier(WDAPIHF.getFichierSansCasseNiAccent("employee"),WDAPIHF.getRubriqueSansCasseNiAccent("email"),mWD_SAI_email);

// if HTrouve(Employee) THEN
if(WDAPIHF.hTrouve(WDAPIHF.getFichierSansCasseNiAccent("employee")).getBoolean())
{
// 	if Employee.PasseWord=SAI_MotPasse THEN
if(WDAPIHF.getFichierSansCasseNiAccent("employee").getRubriqueSansCasseNiAccent("passeword").opEgal(mWD_SAI_MotPasse, 0))
{
// 		OuvreFenêtreMobile(FEN_home)	
WDAPIFenetre.ouvreFille(GWDPPIXIERAY.getInstance().mWD_FEN_home);

}
else
{
// 		ToastAffiche("Wrong password",toastCourt,cvMilieu,chCentre)
WDAPIToast.toastAffiche("Wrong password",0,1,1);

}

}
else
{
// 	ToastAffiche("Wrong e-mail",cvMilieu,chCentre)
WDAPIToast.toastAffiche("Wrong e-mail",1,1);

}

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
public GWDBTN_SansNom1 mWD_BTN_SansNom1;

/**
 * BTN_SansNom2
 */
class GWDBTN_SansNom2 extends WDBouton
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°6 de FEN_login.BTN_SansNom2
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setQuid(2688594659253250307l);

super.setChecksum("790445756");

super.setNom("BTN_SansNom2");

super.setType(4);

super.setBulle("");

super.setLibelle("Forget password");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(224, 342);

super.setTailleInitiale(108, 42);

super.setPlan(0);

super.setImageEtat(1);

super.setImageFondEtat(5);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(6);

super.setAncrageInitial(4, 1000, 1000, 1000, 1000, 0, false);

super.setNumTab(4);

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

super.setStyleLibelleRepos(0x0, creerPolice_GEN("Roboto", -7.000000f, 2, 4, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setStyleLibelleSurvol(0x0, creerPolice_GEN("Roboto", -7.000000f, 2, 4, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setStyleLibelleEnfonce(0x0, creerPolice_GEN("Roboto", -7.000000f, 2, 4, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setCadreRepos(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreSurvol(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreEnfonce(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreGrise(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null));

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
 * IMG_SansNom2
 */
class GWDIMG_SansNom2 extends WDChampImage
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°7 de FEN_login.IMG_SansNom2
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );

super.setQuid(2688595337868661768l);

super.setChecksum("801026431");

super.setNom("IMG_SansNom2");

super.setType(30001);

super.setBulle("");

super.setLibelle("");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(false);

super.setEtatInitial(0);

super.setPositionInitiale(64, 475);

super.setTailleInitiale(233, 30);

super.setValeurInitiale("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Groupe 14.svg");

super.setPlan(0);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(7);

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
 * IMG_SansNom3
 */
class GWDIMG_SansNom3 extends WDChampImage
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°8 de FEN_login.IMG_SansNom3
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );

super.setQuid(2688595458129805563l);

super.setChecksum("803085966");

super.setNom("IMG_SansNom3");

super.setType(30001);

super.setBulle("");

super.setLibelle("");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(false);

super.setEtatInitial(0);

super.setPositionInitiale(103, 524);

super.setTailleInitiale(54, 54);

super.setValeurInitiale("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Groupe 7.svg");

super.setPlan(0);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(8);

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
public GWDIMG_SansNom3 mWD_IMG_SansNom3;

/**
 * IMG_SansNom4
 */
class GWDIMG_SansNom4 extends WDChampImage
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°9 de FEN_login.IMG_SansNom4
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );

super.setQuid(2688595599865790353l);

super.setChecksum("805150021");

super.setNom("IMG_SansNom4");

super.setType(30001);

super.setBulle("");

super.setLibelle("");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(false);

super.setEtatInitial(0);

super.setPositionInitiale(203, 524);

super.setTailleInitiale(54, 54);

super.setValeurInitiale("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\Groupe 8.svg");

super.setPlan(0);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(9);

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
public GWDIMG_SansNom4 mWD_IMG_SansNom4;

/**
 * BTN_SansNom3
 */
class GWDBTN_SansNom3 extends WDBouton
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°10 de FEN_login.BTN_SansNom3
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setQuid(2688595767371716913l);

super.setChecksum("807350252");

super.setNom("BTN_SansNom3");

super.setType(4);

super.setBulle("");

super.setLibelle("Create account");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setCurseurSouris(0);

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(176, 593);

super.setTailleInitiale(108, 27);

super.setPlan(0);

super.setImageEtat(1);

super.setImageFondEtat(5);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(10);

super.setAncrageInitial(5, 1000, 1000, 500, 1000, 0, false);

super.setNumTab(6);

super.setLettreAppel(65535);

super.setTypeBouton(0);

super.setTypeActionPredefinie(0);

super.setBoutonOnOff(false);

super.setTauxParallaxe(0, 0, false);

super.setLibelleVAlign(1);

super.setLibelleHAlign(0);

super.setPresenceLibelle(true);

super.setImage("", 0, 2, 1, null, null, null);

super.setOpacite(100);

super.setStyleLibelleRepos(0x0, creerPolice_GEN("Roboto", -7.000000f, 2, 4, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setStyleLibelleSurvol(0x0, creerPolice_GEN("Roboto", -7.000000f, 2, 4, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setStyleLibelleEnfonce(0x0, creerPolice_GEN("Roboto", -7.000000f, 2, 4, 1.000000f, 0.000000f), 0, 0xFFFFFF);

super.setCadreRepos(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreSurvol(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreEnfonce(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null));

super.setCadreGrise(WDCadreFactory.creerCadre_GEN(1, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 2.000000, 2.000000, 0, 1, 0, null));

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
public GWDBTN_SansNom3 mWD_BTN_SansNom3;

/**
 * LIB_SansNom1
 */
class GWDLIB_SansNom1 extends WDLibelle
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°11 de FEN_login.LIB_SansNom1
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );
super.setQuid(2688595784551983454l);

super.setChecksum("807747157");

super.setNom("LIB_SansNom1");

super.setType(3);

super.setBulle("");

super.setTypeSaisie(0);

super.setMasqueSaisie(new WDChaineU("0"));

super.setLibelle("New here ?");

super.setNote("", "");

super.setCurseurSouris(0);

super.setEtatInitial(0);

super.setPositionInitiale(54, 593);

super.setTailleInitiale(120, 27);

super.setPlan(0);

super.setCadrageHorizontal(2);

super.setCadrageVertical(1);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(11);

super.setAncrageInitial(5, 1000, 1000, 500, 1000, 0, false);

super.setEllipse(0);

super.setTauxParallaxe(0, 0, false);

super.setPresenceLibelle(true);

super.setStyleLibelle(0x808080, 0xFFFFFFFF, creerPolice_GEN("Roboto", -7.000000f, 2, 0, 1.000000f, 0.000000f), 3, 0, 0x303030, 0);

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
public GWDLIB_SansNom1 mWD_LIB_SansNom1;

/**
 * Traitement: Déclarations globales de FEN_login
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
// Création des champs de la fenêtre FEN_login
////////////////////////////////////////////////////////////////////////////
protected void creerChamps()
{
mWD_IMG_SansNom1 = new GWDIMG_SansNom1();
mWD_SAI_email = new GWDSAI_email();
mWD_SAI_MotPasse = new GWDSAI_MotPasse();
mWD_INT_Interrupteur = new GWDINT_Interrupteur();
mWD_BTN_SansNom1 = new GWDBTN_SansNom1();
mWD_BTN_SansNom2 = new GWDBTN_SansNom2();
mWD_IMG_SansNom2 = new GWDIMG_SansNom2();
mWD_IMG_SansNom3 = new GWDIMG_SansNom3();
mWD_IMG_SansNom4 = new GWDIMG_SansNom4();
mWD_BTN_SansNom3 = new GWDBTN_SansNom3();
mWD_LIB_SansNom1 = new GWDLIB_SansNom1();

}
////////////////////////////////////////////////////////////////////////////
// Initialisation de la fenêtre FEN_login
////////////////////////////////////////////////////////////////////////////
public  void initialiserObjet()
{
super.setQuid(2688591669848820791l);

super.setChecksum("690111745");

super.setNom("FEN_login");

super.setType(1);

super.setBulle("");

super.setMenuContextuelSysteme();

super.setCurseurSouris(0);

super.setNote("", "");

super.setCouleur(0x0);

super.setCouleurFond(0xFFFFFF);

super.setPositionInitiale(0, 0);

super.setTailleInitiale(360, 650);

super.setTitre("");

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
// Initialisation des champs de FEN_login
////////////////////////////////////////////////////////////////////////////
mWD_IMG_SansNom1.initialiserObjet();
super.ajouter("IMG_SansNom1", mWD_IMG_SansNom1);
mWD_SAI_email.initialiserObjet();
super.ajouter("SAI_email", mWD_SAI_email);
mWD_SAI_MotPasse.initialiserObjet();
super.ajouter("SAI_MotPasse", mWD_SAI_MotPasse);
mWD_INT_Interrupteur.initialiserObjet();
super.ajouter("INT_Interrupteur", mWD_INT_Interrupteur);
mWD_BTN_SansNom1.initialiserObjet();
super.ajouter("BTN_SansNom1", mWD_BTN_SansNom1);
mWD_BTN_SansNom2.initialiserObjet();
super.ajouter("BTN_SansNom2", mWD_BTN_SansNom2);
mWD_IMG_SansNom2.initialiserObjet();
super.ajouter("IMG_SansNom2", mWD_IMG_SansNom2);
mWD_IMG_SansNom3.initialiserObjet();
super.ajouter("IMG_SansNom3", mWD_IMG_SansNom3);
mWD_IMG_SansNom4.initialiserObjet();
super.ajouter("IMG_SansNom4", mWD_IMG_SansNom4);
mWD_BTN_SansNom3.initialiserObjet();
super.ajouter("BTN_SansNom3", mWD_BTN_SansNom3);
mWD_LIB_SansNom1.initialiserObjet();
super.ajouter("LIB_SansNom1", mWD_LIB_SansNom1);

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
return GWDPPIXIERAY.getInstance().mWD_FEN_login;
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
