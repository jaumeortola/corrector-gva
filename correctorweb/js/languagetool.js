(function($) {
  $(document).ready(function() {
    readCookieStatus();
  });
}(jQuery));

tinyMCE.init({
  mode: "textareas",
  plugins: "AtD,paste",
  paste_text_sticky: true,
  setup: function(ed) {
    ed.onInit.add(function(ed) {
      ed.pasteAsPlainText = true;
    });
  },
  /* translations: */
  languagetool_i18n_no_errors: {
    // "No errors were found.":
    "ca": "No s\'ha trobat cap error",
    'ca-ES-valencia': 'No s\'ha trobat cap error'
  },
  languagetool_i18n_explain: {
    // "Explain..." - shown if there is an URL with a detailed description:
    'ca': 'Més informació…',
    'ca-ES-valencia': 'Més informació…'
  },
  languagetool_i18n_ignore_once: {
    // "Ignore this error":
    'ca': 'Ignora aquest error',
    'ca-ES-valencia': 'Ignora aquest error'
  },
  languagetool_i18n_ignore_all: {
    // "Ignore this kind of error":
    'ca': 'Ignora aquesta classe d\'errors',
    'ca-ES-valencia': 'Ignora aquesta classe d\'errors'
  },
  languagetool_i18n_rule_implementation: {
    // "Rule implementation":
    'ca': 'Informació sobre la regla...',
    'ca-ES-valencia': 'Informació sobre la regla...',
  },
  languagetool_i18n_edit_manually: {
    'ca': 'Edita manualment',
    'ca-ES-valencia': 'Edita manualment'
  },
  languagetool_i18n_suggest_word: {
    // "Suggest word for dictionary...": 
    // *** Also set languagetool_i18n_suggest_word_url below if you set this ***
    'ca': 'Suggereix una paraula per al diccionari...',
    'ca-ES-valencia': 'Suggereix una paraula per al diccionari...'
  },
  languagetool_i18n_suggest_word_url: {
    // "Suggest word for dictionary...":
    'ca': 'http://community.languagetool.org/suggestion?word={word}&lang=ca',
    'ca-ES-valencia': 'http://community.languagetool.org/suggestion?word={word}&lang=ca'
  },

  languagetool_i18n_current_lang: function() {
    return document.checkform.lang.value;
  },
  /* The URL of your LanguageTool server.
     If you use your own server here and it's not running on the same domain 
     as the text form, make sure the server gets started with '--allow-origin ...' 
     and use 'https://your-server/v2/check' as URL: */
  languagetool_rpc_url: "http://riuraueditors.cat/lt-api/v2/check",
  /* edit this file to customize how LanguageTool shows errors: */
  languagetool_css_url: "online-check/tiny_mce/plugins/atd-tinymce/css/content.css",
  /* this stuff is a matter of preference: */
  theme: "advanced",
  theme_advanced_buttons1: "",
  theme_advanced_buttons2: "",
  theme_advanced_buttons3: "",
  theme_advanced_toolbar_location: "none",
  theme_advanced_toolbar_align: "left",
  theme_advanced_statusbar_location: "none", //"bottom",
  theme_advanced_path: false,
  theme_advanced_resizing: true,
  theme_advanced_resizing_use_cookie: false,
  gecko_spellcheck: false
});

function doit() {
  saveCookieStatus();
  var langCode = "ca-ES-valencia"; //document.checkform.lang.value;
  var userText = tinyMCE.activeEditor.getContent();
  var maxTextLength = 30000;
  if (userText.length > maxTextLength) {
    var errorText = "Error: el text és massa llarg (" + userText.length + " caràcters). Màxim: " + maxTextLength + " caràcters.";
    $('#feedbackErrorMessage').html("<div id='severeError'>" + errorText + "</div>");
  } else {
    //normalize text
    if (String.prototype.hasOwnProperty('normalize')) {
      var normalizedText = userText.normalize("NFC");
      tinyMCE.activeEditor.setContent(normalizedText);
    }
    //select rules 
    //common rules
    var disabledRules = "WHITESPACE_RULE,PERCENT_SENSE_ESPAI,AL_INFINITIU,EVITA_INFINITIUS_INDRE,ORTO_IEC2017,CA_SIMPLE_REPLACE_DNV";
    var enabledRules = "PRE_IEC2017";
    var disabledCategories = "DNV_PRIMARY_FORM";

    if ($('input[name=criteris_gva]:checked').val()) {
      enabledRules = enabledRules + ",LEXIC_VAL,VERBS_I_ANTIHIATICA,EVITA_AQUEIX_EIXE,PREFERENCIES_VERBS_VALENCIANS,NUMERALS_VALENCIANS,PARTICIPIS_IT,ORDINALS_E,EXIGEIX_PLURALS_SCOS,EXIGEIX_PLURALS_JOS,EXIGEIX_PLURALS_S,EXIGEIX_INFINITIUS_INDRE,EXIGEIX_INFINITIUS_ALDRE,EXIGEIX_US";
      //disabledRules = disabledRules + "";
    } else {
      disabledRules = disabledRules + ",VULLGA,AHI"; //acceptat per AVL no Generalitat

      /* incoatius -eix/-ix */
      if ($("input[name=incoatius]:checked").val() == "incoatius_eix") {

      } else {
        enabledRules = enabledRules + ",EXIGEIX_VERBS_IX";
        disabledRules = disabledRules + ",EXIGEIX_VERBS_EIX";
      };
      /* demostratius aquest/este */
      if ($("input[name=demostratius]:checked").val() == "demostratius_aquest") {
   
      } else {
        enabledRules = enabledRules + ",EVITA_DEMOSTRATIUS_AQUEST";
        disabledRules = disabledRules + ",EVITA_DEMOSTRATIUS_ESTE";
      };
      /* accentuació café /cafè */
      if ($("input[name=accentuacio]:checked").val() == "accentuacio_valenciana") {
 
      } else {
        enabledRules = enabledRules + ",EXIGEIX_ACCENTUACIO_GENERAL";
        disabledRules = disabledRules + ",EXIGEIX_ACCENTUACIO_VALENCIANA";
      };
      /* concordança dos/dues */
      if ($("input[name=concorda_dues]:checked").val() == "dos_dues") {
 
      } else {
        enabledRules = enabledRules + ",CONCORDANCES_NUMERALS_DOS";
        disabledRules = disabledRules + ",CONCORDANCES_NUMERALS_DUES";
      };
    }

    /* municipis nom valencià/oficial */
    if ($("input[name=municipis]:checked").val() == "municipi_nom_valencia") {

    } else {
      enabledRules = enabledRules + ",MUNICIPIS_OFICIAL";
      disabledRules = disabledRules + ",MUNICIPIS_VALENCIA";
    };

    // paraules preferents
    if ($("input[name=recomana_preferents]:checked").val() === false) {
      var disabledCategories = disabledCategories + ",DNV_SECONDARY_FORM";
    };

    var userOptions = "disabledRules=" + disabledRules + "&enabledRules=" + enabledRules + "&disabledCategories=" + disabledCategories;
    tinyMCE.activeEditor.execCommand("mceWritingImprovementTool", langCode, userOptions);
  }
}


function insertDemoText() {
  var myDemoText = "Exigeix, exigix, exigesc, exigisc, aquest, este, café, cafè. Aqueixa és la questió avui. Vuitanta-vuit, cinquanta-vuité. Oriola. Énguera. Orihuela, Enguera. Castelló de la Ribera, Vilanova de Castelló, Villanueva de Castellón. Veent lo que havia passat, llençaren un atac, i el cargol arrencà a córrer. Uns bons nedadors. Treure, abstraent, retrec, m'ajec. Mare de Déu dels Dolors i Ajuntament de Dolors. Els desigs, els tests, anàssem. Mantenir o mantindre. Segons allò indicat en el Dcret llei, hi han bastantes qüestions pendent. Vint-i-tresè, quuan ho sapigueu. Dos amic i dos amigues. Dona'm el llapis. Es el millor. Infligiren la llei. Creem que si creem una solució. Servix per tal de guisar. Que servesquen per guisar. Cal erradicar-lo i eradicar-la, com a coresponsable i corresponsable. Cal vetllar pel futur, però no desvetlar els plans. Dues xiquetes, vint-i-dues xiquets, trenta-dos xiquetes, dos xiquets. Dos-centes xiquetes, dues-centes xiquets. Aqueixa qüestió o eixa qüestió.";
  tinyMCE.activeEditor.setContent(myDemoText);
}

// COOKIE

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function saveCookieStatus() {
  var regles_amb_radio = Array('incoatius', 'incoatius2', 'demostratius',
    'accentuacio', 'concorda_dues', 'municipis');
  $.each(regles_amb_radio, function(index, nom) {
    var valor = $('[type="radio"][name="' + nom + '"]:checked').val();
    setCookie(nom, valor, 365);
  });

  var regles_amb_checkbox = Array('criteris_gva','recomana_preferents');
  $.each(regles_amb_checkbox, function(index, nom) {
    var valor = $('input[name=' + nom + ']:checked').val();
    if (valor) {
      setCookie(nom, 1, 365);
    } else {
      setCookie(nom, -1, 365);
    }
  });

}

function readCookieStatus() {
  var regles_amb_radio = Array('incoatius', 'incoatius2', 'demostratius',
    'accentuacio', 'concorda_dues', 'municipis');
  $.each(regles_amb_radio, function(index, nom) {
    var valor = getCookie(nom);
    if (valor !== undefined) {
      $('[type="radio"][name="' + nom + '"][value="' + valor + '"]')
        .attr('checked', 'checked');
    }
  });

  var regles_amb_checkbox = Array('criteris_gva','recomana_preferents');
  $.each(regles_amb_checkbox, function(index, nom) {
    var valor = getCookie(nom);
    if (valor !== undefined) {
      if (valor > 0) {
        $('input[name=' + nom + ']').attr('checked', 'checked');
        } else {
          $('input[name=' + nom + ']').removeAttr('checked');
        }
    }
  });

  update_enabled_rules();
}

function update_enabled_rules() {
    if ($('input[name=criteris_gva]:checked').val()) {
	document.getElementById("incoatius_eix").disabled = true;
	document.getElementById("incoatius_ix").disabled = true;
	document.getElementById("demostratius_aquest").disabled = true;
	document.getElementById("demostratius_este").disabled = true;
	document.getElementById("accentuacio_valenciana").disabled = true;
	document.getElementById("accentuacio_general").disabled = true;
	document.getElementById("concorda_dos_dues").disabled = true;
	document.getElementById("concorda_dos").disabled = true;
    } else {
	document.getElementById("incoatius_eix").disabled = false;
	document.getElementById("incoatius_ix").disabled = false;
	document.getElementById("demostratius_aquest").disabled = false;
	document.getElementById("demostratius_este").disabled = false;
	document.getElementById("accentuacio_valenciana").disabled = false;
	document.getElementById("accentuacio_general").disabled = false;
	document.getElementById("concorda_dos_dues").disabled = false;
	document.getElementById("concorda_dos").disabled = false;
    }
}
