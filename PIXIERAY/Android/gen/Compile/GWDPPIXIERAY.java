/**
 * Code généré par WINDEV Mobile - NE PAS MODIFIER !
 * Objet WINDEV Mobile : Projet
 * Classe Android : PIXIERAY
 * Version de wdjava64.dll  : 28.0.464.1
 */


package com.innovgeek.pixieray.wdgen;


import com.innovgeek.pixieray.*;
import fr.pcsoft.wdjava.core.types.*;
import fr.pcsoft.wdjava.core.*;
import fr.pcsoft.wdjava.core.application.*;
import fr.pcsoft.wdjava.database.hf.*;
import fr.pcsoft.wdjava.api.*;
import fr.pcsoft.wdjava.core.erreur.*;
/*Imports trouvés dans le code WL*/
/*Fin Imports trouvés dans le code WL*/





public class GWDPPIXIERAY extends WDProjet
{
private static GWDPPIXIERAY ms_instance = null;
/**
 * Accès au projet: PIXIERAY
 * Pour accéder au projet à partir de n'importe où: 
 * GWDPPIXIERAY.getInstance()
 */
public static GWDPPIXIERAY getInstance()
{
return (GWDPPIXIERAY) ms_instance;
}

 // FEN_dash
public GWDFFEN_dash mWD_FEN_dash = new GWDFFEN_dash();
 // accesseur de FEN_dash
public GWDFFEN_dash getFEN_dash()
{
mWD_FEN_dash.checkOuverture();
return mWD_FEN_dash;
}

 // FEN_setup
public GWDFFEN_setup mWD_FEN_setup = new GWDFFEN_setup();
 // accesseur de FEN_setup
public GWDFFEN_setup getFEN_setup()
{
mWD_FEN_setup.checkOuverture();
return mWD_FEN_setup;
}

 // FEN_pop_on
public GWDFFEN_pop_on mWD_FEN_pop_on = new GWDFFEN_pop_on();
 // accesseur de FEN_pop_on
public GWDFFEN_pop_on getFEN_pop_on()
{
mWD_FEN_pop_on.checkOuverture();
return mWD_FEN_pop_on;
}

 // FEN_home
public GWDFFEN_home mWD_FEN_home = new GWDFFEN_home();
 // accesseur de FEN_home
public GWDFFEN_home getFEN_home()
{
mWD_FEN_home.checkOuverture();
return mWD_FEN_home;
}

 // FEN_login
public GWDFFEN_login mWD_FEN_login = new GWDFFEN_login();
 // accesseur de FEN_login
public GWDFFEN_login getFEN_login()
{
mWD_FEN_login.checkOuverture();
return mWD_FEN_login;
}

 // FEN_signup
public GWDFFEN_signup mWD_FEN_signup = new GWDFFEN_signup();
 // accesseur de FEN_signup
public GWDFFEN_signup getFEN_signup()
{
mWD_FEN_signup.checkOuverture();
return mWD_FEN_signup;
}

 // FEN_splash1
public GWDFFEN_splash1 mWD_FEN_splash1 = new GWDFFEN_splash1();
 // accesseur de FEN_splash1
public GWDFFEN_splash1 getFEN_splash1()
{
mWD_FEN_splash1.checkOuverture();
return mWD_FEN_splash1;
}

 // FEN_splash
public GWDFFEN_splash mWD_FEN_splash = new GWDFFEN_splash();
 // accesseur de FEN_splash
public GWDFFEN_splash getFEN_splash()
{
mWD_FEN_splash.checkOuverture();
return mWD_FEN_splash;
}

 // FEN_progress
public GWDFFEN_progress mWD_FEN_progress = new GWDFFEN_progress();
 // accesseur de FEN_progress
public GWDFFEN_progress getFEN_progress()
{
mWD_FEN_progress.checkOuverture();
return mWD_FEN_progress;
}


 // Constructeur de la classe GWDPPIXIERAY
public GWDPPIXIERAY()
{
ms_instance = this;
// Définition des langues du projet
setLangueProjet(new int[] {2}, new int[] {0}, 2, false);

// Palette des couleurs
setPaletteCouleurGabarit(new int[] {0xF48542, 0x313FD2, 0xA6F2, 0x4F900D, 0xA95CF8, 0xB86592, 0xB74A5E, 0xA5A595, 0x654E44, 0x383838, 0x0});
ajouterFenetre("FEN_dash", mWD_FEN_dash);
ajouterFenetre("FEN_setup", mWD_FEN_setup);
ajouterFenetre("FEN_pop_on", mWD_FEN_pop_on);
ajouterFenetre("FEN_home", mWD_FEN_home);
ajouterFenetre("FEN_login", mWD_FEN_login);
ajouterFenetre("FEN_signup", mWD_FEN_signup);
ajouterFenetre("FEN_splash1", mWD_FEN_splash1);
ajouterFenetre("FEN_splash", mWD_FEN_splash);
ajouterFenetre("FEN_progress", mWD_FEN_progress);



}

// Code de déclaration de PIXIERAY
public void trtInitProjet()
{
// 

try
{
// gcnxConnexionGlobale est un Connexion
vWD_gcnxConnexionGlobale = new WDHF_Connexion("gcnxConnexionGlobale");

super.ajouterVariableGlobale("gcnxConnexionGlobale",vWD_gcnxConnexionGlobale);



// gcnxConnexionGlobale..Utilisateur		= "pixieray" 
vWD_gcnxConnexionGlobale.setProp(EWDPropriete.PROP_UTILISATEUR,"pixieray");

// gcnxConnexionGlobale..MotDePasse		= "pixieray" 
vWD_gcnxConnexionGlobale.setProp(EWDPropriete.PROP_MOTDEPASSE,"pixieray");

// gcnxConnexionGlobale..Serveur			= "173.212.249.74" 
vWD_gcnxConnexionGlobale.setProp(EWDPropriete.PROP_SERVEUR,"173.212.249.74");

// gcnxConnexionGlobale..BaseDeDonnées		= "pixieray"
vWD_gcnxConnexionGlobale.setProp(EWDPropriete.PROP_BASEDEDONNEES,"pixieray");

// gcnxConnexionGlobale..Provider			= hAccèsHFClientServeur 
vWD_gcnxConnexionGlobale.setProp(EWDPropriete.PROP_PROVIDER,"WinDevClientServeurHF");

// gcnxConnexionGlobale..Accès				= hOLectureEcriture 
vWD_gcnxConnexionGlobale.setProp(EWDPropriete.PROP_ACCES,3);

// HChangeConnexion("*",gcnxConnexionGlobale)
WDAPIHF.hChangeConnexion(new WDChaineU("*"),vWD_gcnxConnexionGlobale);

// HOuvreConnexion(gcnxConnexionGlobale)
WDAPIHF.hOuvreConnexion(vWD_gcnxConnexionGlobale);

}
catch(WDErreurNonFatale | WDException eCatch)
{
eCatch.catch_GEN();
return;
}
}





////////////////////////////////////////////////////////////////////////////
// Déclaration des variables globales
////////////////////////////////////////////////////////////////////////////
static public WDObjet vWD_gcnxConnexionGlobale = WDVarNonAllouee.ref;
public String getVersionApplication(){ return "0.0.43.0";}
public String getNomSociete(){ return "InnovGeek";}
public String getNomAPK(){ return "PIXIERAY";}
public int getIdNomApplication(){return com.innovgeek.pixieray.R.string.app_name;}
public boolean isModeAnsi(){ return false;}
public boolean isAssistanceAutoHFActive(){ return true;}
public String getNomFichierProperties(int nType)
{
switch (nType)
{
case 1 : return "options_compilation_4a7adc13f4164f83b2bcd6bb086496f8.properties";
default : return "";
}
}
public String getPackageRacine(){ return "com.innovgeek.pixieray";}
public int getIdIconeApplication(){ return com.innovgeek.pixieray.R.drawable.i_c_o_n_e________2;}
public int getInfoPlateforme(EWDInfoPlateforme info)
{
switch(info)
{
case DPI_ECRAN : return 160;
case HAUTEUR_BARRE_SYSTEME : return 25;
case HAUTEUR_BARRE_TITRE : return 25;
case HAUTEUR_ACTION_BAR : return 56;
case HAUTEUR_BARRE_BAS : return 0;
case HAUTEUR_ECRAN : return 650;
case LARGEUR_ECRAN : return 360;
default : return 0;
}
}
public boolean isActiveThemeMaterialDesign()
{
return true;
}
////////////////////////////////////////////////////////////////////////////
public String getAdresseEmail() 
{
return "";
}
public boolean isIgnoreErreurCertificatHTTPS()
{
return false;
}
////////////////////////////////////////////////////////////////////////////
public boolean isUniteAffichageLogique()
{
return false;
}
public String getNomProjet()
{
return "PIXIERAY";
}
public String getNomConfiguration()
{
return "Application Android";
}
public String getNomAnalyse()
{
return "pixieray";
}
public String getMotDePasseAnalyse()
{
return "";
}
public boolean isModeGestionFichierMultiUtilisateur()
{
return true;
}
public boolean isCreationAutoFichierDonnees()
{
return true;
}

////////////////////////////////////////////////////////////////////////////
// Formats des masques du projet
////////////////////////////////////////////////////////////////////////////
public String getFichierWDM()
{
return null;
}
protected void declarerRessources()
{
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\ICONS8_ARROW.SVG",com.innovgeek.pixieray.R.raw.icons8_arrow_27, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE 1.SVG",com.innovgeek.pixieray.R.raw.groupe_1_26, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\YUYUYUYU.MP4",com.innovgeek.pixieray.R.raw.yuyuyuyu_25, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE 16.SVG",com.innovgeek.pixieray.R.raw.groupe_16_24, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE 15.SVG",com.innovgeek.pixieray.R.raw.groupe_15_23, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\ICONS8_CHECKMARK_2.SVG",com.innovgeek.pixieray.R.raw.icons8_checkmark_2_22, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\ICONS-1.SVG",com.innovgeek.pixieray.R.raw.icons_1_21, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\ICONS8_BLUETOOTH.SVG",com.innovgeek.pixieray.R.raw.icons8_bluetooth_20, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE 11.SVG",com.innovgeek.pixieray.R.raw.groupe_11_19, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\ICONS8_CLOSE.SVG",com.innovgeek.pixieray.R.raw.icons8_close_18, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE 17.PNG",com.innovgeek.pixieray.R.drawable.groupe_17_17, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE 8.SVG",com.innovgeek.pixieray.R.raw.groupe_8_16, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE 7.SVG",com.innovgeek.pixieray.R.raw.groupe_7_15, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE 14.SVG",com.innovgeek.pixieray.R.raw.groupe_14_14, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GABARITS\\WM\\250 PHOENIX\\PHOENIX_EDT.PNG?E5_3NP_8_8_8_8",com.innovgeek.pixieray.R.drawable.phoenix_edt_13_np3_8_8_8_8_selector, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GABARITS\\WM\\250 PHOENIX\\PHOENIX_CBOX.PNG?E12_8O",com.innovgeek.pixieray.R.drawable.phoenix_cbox_12_selector, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\IXI_GLASSES_MIX-REMOVEBG.PNG",com.innovgeek.pixieray.R.drawable.ixi_glasses_mix_removebg_11, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE DE MASQUES 1.PNG",com.innovgeek.pixieray.R.drawable.groupe_de_masques_1_10, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE 10.SVG",com.innovgeek.pixieray.R.raw.groupe_10_9, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\DF.PNG",com.innovgeek.pixieray.R.drawable.df_8, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\LOGO_PIXIERAY_LIGHT@3X.PNG",com.innovgeek.pixieray.R.drawable.logo_pixieray_light_3x_7, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\IMG-CHARGEMENT-01.SVG",com.innovgeek.pixieray.R.raw.img_chargement_01_6, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GROUPE 18.SVG",com.innovgeek.pixieray.R.raw.groupe_18_5, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\GABARITS\\WM\\250 PHOENIX\\PHOENIX_BREAK_PICT.PNG?E2_4O",com.innovgeek.pixieray.R.drawable.phoenix_break_pict_4_selector, "");
super.ajouterFichierAssocie("D:\\PROJETS\\1 - PROJETS CLIENTS\\PIXIERRAY\\PIXIERAY\\1.PNG",com.innovgeek.pixieray.R.drawable.a_3, "");
}



/**
 * Lancer de l'application Android
 */
public static class WDLanceur extends WDAbstractLanceur
{
public Class<? extends WDProjet> getClasseProjet()
{
return GWDPPIXIERAY.class;
}
}
}
