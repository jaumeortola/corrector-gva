tinyMCE.init({
     mode : "textareas",
     plugins : "AtD,paste",
     paste_text_sticky : true,
     setup : function(ed) {
         ed.onInit.add(function(ed) {
             ed.pasteAsPlainText = true;
         });
     },  
     /* translations: */
     languagetool_i18n_no_errors : {
         // "No errors were found.":
         "de-DE": "Keine Fehler gefunden.",
         "ca": "No s\'ha trobat cap error",
         'ca-ES-valencia': 'No s\'ha trobat cap error'
     },
     languagetool_i18n_explain : {
         // "Explain..." - shown if there is an URL with a detailed description:
         "de-DE": "Mehr Informationen...",
         'ca': 'Més informació…',
         'ca-ES-valencia': 'Més informació…'
     },
     languagetool_i18n_ignore_once : {
         // "Ignore this error":
         "de-DE": "Hier ignorieren",
         'ca': 'Crec que no és un error',
         'ca-ES-valencia': 'Crec que no és un error'
     },
     languagetool_i18n_ignore_all : {
         // "Ignore this kind of error":
         "de-DE": "Fehler dieses Typs ignorieren",
         'ca': 'Ignora aquesta classe d\'errors',
         'ca-ES-valencia': 'Ignora aquesta classe d\'errors'
     },
     languagetool_i18n_rule_implementation : {
         // "Rule implementation":
         "de-DE": "Implementierung der Regel",
         'ca': 'Informació sobre la regla...',
         'ca-ES-valencia': 'Informació sobre la regla...',
     },
     languagetool_i18n_edit_manually: {
      'ca': 'Edita manualment',
      'ca-ES-valencia': 'Edita manualment'
     },
     languagetool_i18n_suggest_word :
     {
     // "Suggest word for dictionary...": 
     // *** Also set languagetool_i18n_suggest_word_url below if you set this ***
       'ca': 'Suggereix una paraula per al diccionari...',
       'ca-ES-valencia': 'Suggereix una paraula per al diccionari...'
     },
     languagetool_i18n_suggest_word_url :
     {
     // "Suggest word for dictionary...":
       'ca': 'http://community.languagetool.org/suggestion?word={word}&lang=ca',
       'ca-ES-valencia': 'http://community.languagetool.org/suggestion?word={word}&lang=ca'
      },
 
     languagetool_i18n_current_lang :
         function() { return document.checkform.lang.value; },
     /* The URL of your LanguageTool server.
        If you use your own server here and it's not running on the same domain 
        as the text form, make sure the server gets started with '--allow-origin ...' 
        and use 'https://your-server/v2/check' as URL: */
     languagetool_rpc_url               : "http://riuraueditors.cat/lt-api/v2/check",
     /* edit this file to customize how LanguageTool shows errors: */
     languagetool_css_url: "online-check/tiny_mce/plugins/atd-tinymce/css/content.css",
     /* this stuff is a matter of preference: */
     theme                              : "advanced",
     theme_advanced_buttons1            : "",
     theme_advanced_buttons2            : "",
     theme_advanced_buttons3            : "",
     theme_advanced_toolbar_location    : "none",
     theme_advanced_toolbar_align       : "left",
     theme_advanced_statusbar_location  : "none", //"bottom",
     theme_advanced_path                : false,
     theme_advanced_resizing            : true,
     theme_advanced_resizing_use_cookie : false,
     gecko_spellcheck                   : false
  });
 
  function doit() {
    var langCode = "ca-ES-valencia"; //document.checkform.lang.value;
    var userText = tinyMCE.activeEditor.getContent();
    var maxTextLength = 30000;
    if (userText.length > maxTextLength) {
      var errorText = "Error: el text és massa llarg (" + userText.length + " caràcters). Màxim: " + maxTextLength + " caràcters.";
      $('#feedbackErrorMessage').html("<div id='severeError'>" + errorText + "</div>");
    }
    else {
      //normalize text
      if (String.prototype.hasOwnProperty('normalize')) {
        var normalizedText = userText.normalize("NFC");
        tinyMCE.activeEditor.setContent(normalizedText);
      }

      var disabledRules="";
      var enabledRules="";

      tinyMCE.activeEditor.execCommand("mceWritingImprovementTool", langCode,  enabledRules, disabledRules);
      }
  }


function insertDemoText()
{
   var myDemoText="Aqueixa és la questió avui. Vuitanta-vuit, cinquanta-vuité. Oriola. Énguera. Orihuela, Enguera. Castelló de la Ribera, Vilanova de Castelló, Villanueva de Castellón. Veent lo que havia passat, llençaren un atac, i el cargol arrencà a córrer. Uns bons nedadors. Treure, abstraent, retrec, m'ajec. Mare de Déu dels Dolors i Ajuntament de Dolors. Els desigs, els tests, anàssem. Mantenir o mantindre. Segons allò indicat en el Dcret llei, hi han bastantes qüestions pendent. Vint-i-tresè, quuan ho sapigueu. Dos amic i dos amigues. Dona'm el llapis. Es el millor. Infligiren la llei. Creem que si creem una solució. Servix per tal de guisar. Que servesquen per guisar. Cal erradicar-lo i eradicar-la, com a coresponsable i corresponsable. Cal vetllar pel futur, però no desvetlar els plans.";
   tinyMCE.activeEditor.setContent(myDemoText);   
}

