/**
 * Code généré par WINDEV Mobile - NE PAS MODIFIER !
 * Objet WINDEV Mobile : Fenêtre
 * Classe Android : FEN_splash
 * Version de wdjava64.dll  : 28.0.464.1
 */


package com.innovgeek.pixieray.wdgen;


import com.innovgeek.pixieray.*;
import fr.pcsoft.wdjava.core.types.*;
import fr.pcsoft.wdjava.core.*;
import fr.pcsoft.wdjava.ui.champs.fenetre.*;
import fr.pcsoft.wdjava.ui.champs.multimedia.*;
import fr.pcsoft.wdjava.ui.cadre.*;
import fr.pcsoft.wdjava.core.erreur.*;
import fr.pcsoft.wdjava.api.*;
import fr.pcsoft.wdjava.core.application.*;
import fr.pcsoft.wdjava.ui.activite.*;
/*Imports trouvés dans le code WL*/
/*Fin Imports trouvés dans le code WL*/



public class GWDFFEN_splash extends WDFenetre
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs de FEN_splash
////////////////////////////////////////////////////////////////////////////

/**
 * MM_SansNom1
 */
class GWDMM_SansNom1 extends WDChampMultimedia
{

////////////////////////////////////////////////////////////////////////////
// Déclaration des champs du fils n°1 de FEN_splash.MM_SansNom1
////////////////////////////////////////////////////////////////////////////

public  void initialiserObjet()
{
super.initialiserObjet();
super.setFenetre( getWDFenetreThis() );

super.setQuid(2688608038250345028l);

super.setChecksum("964432512");

super.setNom("MM_SansNom1");

super.setType(39);

super.setBulle("");

super.setLibelle("Multimedia");

super.setMenuContextuelSysteme();

super.setNote("", "");

super.setValeurInitiale("D:\\projets\\1 - Projets Clients\\PIXIERRAY\\PIXIERAY\\yuyuyuyu.mp4");

super.setNavigable(true);

super.setEtatInitial(0);

super.setPositionInitiale(-260, 1);

super.setTailleInitiale(881, 623);

super.setPlan(0);

super.setTailleMin(0, 0);

super.setTailleMax(2147483647, 2147483647);

super.setVisibleInitial(true);

super.setAltitude(1);

super.setAncrageInitial(10, 1000, 1000, 1000, 1000, 0, false);

super.setNumTab(1);

super.setModeAffichage(6);

super.setParamControles(1);

super.setTauxParallaxe(0, 0, false);

super.setPresenceLibelle(false);

super.setStyleLibelle(0x68635F, creerPolice_GEN("Roboto", -11.000000f, 2, 0, 1.000000f, 0.000000f), -1, 0, 0x0);

super.setCadreExterieur(WDCadreFactory.creerCadre_GEN(1, 0xE0DCDA, 0x605C5A, 0x0, 2.000000, 2.000000, 0, 1, 0, null), 0, 0, 0, 0);


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
public GWDMM_SansNom1 mWD_MM_SansNom1;

/**
 * Traitement: Déclarations globales de FEN_splash
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




/**
 * Traitement: Fin d'initialisation de FEN_splash
 */
public void init()
{
super.init();

// Multitâche(700)

try
{
// Multitâche(700)
WDAPIVM.multitache(new WDEntier4(700));

// OuvreFenêtreMobile(FEN_login)
WDAPIFenetre.ouvreFille(GWDPPIXIERAY.getInstance().mWD_FEN_login);

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
// Création des champs de la fenêtre FEN_splash
////////////////////////////////////////////////////////////////////////////
protected void creerChamps()
{
mWD_MM_SansNom1 = new GWDMM_SansNom1();

}
////////////////////////////////////////////////////////////////////////////
// Initialisation de la fenêtre FEN_splash
////////////////////////////////////////////////////////////////////////////
public  void initialiserObjet()
{
super.setQuid(2688554458202085402l);

super.setChecksum("639770236");

super.setNom("FEN_splash");

super.setType(1);

super.setBulle("");

super.setMenuContextuelSysteme();

super.setCurseurSouris(0);

super.setNote("", "");

super.setCouleur(0x0);

super.setCouleurFond(0x0);

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

super.setCouleurBarreSysteme(0x0);

super.setCopieEcranAutorisee(true);


activerEcoute();

////////////////////////////////////////////////////////////////////////////
// Initialisation des champs de FEN_splash
////////////////////////////////////////////////////////////////////////////
mWD_MM_SansNom1.initialiserObjet();
super.ajouter("MM_SansNom1", mWD_MM_SansNom1);

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
return GWDPPIXIERAY.getInstance().mWD_FEN_splash;
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
