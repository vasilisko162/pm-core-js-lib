/**
 * pmCoreJsLib_Check
 * Version: 0.0.1
 * Description: Replacement library for input fields.
 */

var check = (function() {
  var methods = {
    checkTitleInput: function(event) {
      var elem = $(event.target);
      var newValue = (elem.val().replace(/[^а-яА-Яa-zA-Z0-9\:\!\(\)\ \-]/g, "")).replace(/\ {2,}/g, " ");
      elem.val(newValue);
    },

    checkUrlInput: function(event) {
      var elem = $(event.target);
      elem.val(elem.val().replace(/[^a-zA-Z\-]/g, "").toLowerCase());
    },

    checkUrlSiteInput: function(event) {
      var elem = $(event.target);
      elem.val(elem.val().replace(/[ ,;`\'\"\<\>]/g, "").toLowerCase());
    },

    checkNameInput: function(event) {
      var elem = $(event.target);
      elem.val(elem.val().replace(/[^а-яА-Яa-zA-Z\ \-]/g, ""));
    },

    checkEmailInput: function(event) {
      setTimeout(function() {
        var elem = $(event.target);
        elem.val(elem.val().replace(/[ ,:;`\'\"\<\>]/g, ""));
      }, 0);
    },

    checkNumberInput: function(event) {
      var elem = $(event.target);
      elem.val(elem.val().replace(/\D/g, ""));
    }
  };

  return {
    titleInput: methods.checkTitleInput,
    urlInput: methods.checkUrlInput,
    urlSiteInput: methods.checkUrlSiteInput,
    nameInput: methods.checkNameInput,
    emailInput: methods.checkEmailInput,
    numberInput: methods.checkNumberInput
  }
}());

window.check = check;
