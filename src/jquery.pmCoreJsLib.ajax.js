/**
 * pmCoreJsLib_Ajax
 * Version: 0.1.0
 * Description: Library for working with AJAX.
 */

var useAjax = (function() {
  var settings = {
    language: 'ru',
    windowClass: 'window',
    windowLoaderClass: 'window-div__loader',
    formBtnPrefix: '_submit',

    loaderClass: 'loader',
    urlAjax: '/ajax.php',
    btnLoaderText: pmCore_dictionary.text.wait[this.language],
    errorText: pmCore_dictionary.text.errorText[this.language]
  };

  var properties = {
    btnText: ''
  };

  var methods = {
    /**
     *
     * @param formId
     * @param action
     * @param dataSend
     * @param callbackFunction
     * @param closeForm
     * @returns {boolean}
     */
    ajaxSend: function(formId, action, dataSend, callbackFunction, closeForm) {
      if (!action) return false;
      var dataReturn = {
        status: false
      };

      dataSend.action = action;
      if (formId) {
        pmCore_commonScripts.formHideLog(formId);
        methods.__ajaxSend__showLoader(formId);
      }

      $('#' + formId + '_showAnswer').text('').addClass('hide');

      $.ajax({
        url: settings.urlAjax,
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: dataSend,
        //async: false,
        success: function(data) {
          if (formId) methods.__ajaxSend__hideLoader(formId);

          if (!data.status) {
            if (formId) pmCore_commonScripts.formShowLogError(formId, data.log);
          } else {
            if (closeForm === true) {
              $('#' + formId).hide('fade', '300', function() {
                if (data.log !== '') $('#' + formId + '_showAnswer').text(data.log).removeClass('hide');
              });
            } else {
              if (data.log !== '') $('#' + formId + '_showAnswer').text(data.log).removeClass('hide');
            }
          }

          dataReturn = data;
          callbackFunction(dataReturn);
        },
        error: function() {
          if (formId) {
            methods.__ajaxSend__hideLoader(formId);
            pmCore_commonScripts.formShowLogError(formId, settings.errorText);
          }
          dataReturn.status = false;
          callbackFunction(dataReturn);
        }
      });
    },

    /**
     *
     * @param formId
     * @param action
     * @param dataSend
     * @param callbackFunction
     * @returns {boolean}
     */
    ajaxReturnHtml: function(formId, action, dataSend, callbackFunction) {
      if (!action || !dataSend) return false;
      var dataReturn = '';

      dataSend.html = true;

      $.ajax({
        url: settings.urlAjax,
        type: 'POST',
        cache: false,
        dataType: 'html',
        data: dataSend,
        success: function(data) {
          callbackFunction(data);
        },
        error: function() {
          callbackFunction(dataReturn);
        }
      });
    },

    /**
     *
     * @param formId
     * @private
     */
    __ajaxSend__showLoader: function(formId) {
      var form = $('#' + formId),
        formBtn = form.find('#' + formId + settings.formBtnPrefix);

      form.parents('.' + settings.windowClass).find('.' + settings.windowLoaderClass).addClass('show');
      formBtn.attr('disabled', true);
      properties.btnText = formBtn.html();
      formBtn.text(settings.btnLoaderText);
    },

    /**
     *
     * @param formId
     * @private
     */
    __ajaxSend__hideLoader: function(formId) {
      var form = $('#' + formId),
        formBtn = form.find('#' + formId + settings.formBtnPrefix);

      form.parents('.' + settings.windowClass).find('.' + settings.windowLoaderClass).removeClass('show');
      formBtn.attr('disabled', false);
      formBtn.text(properties.btnText);
    },

    /**
     *
     * @param formId
     * @returns {{action: null}}
     */
    ajaxCreateData: function(formId) {
      var array = $('#' + formId).serializeArray(),
        data = {action: null};
      $.each(array, function(k, item) {
        data[item.name] = item.value;
      });
      return data;
    }
  };

  return {
    sendData: methods.ajaxSend,
    returnHtml: methods.ajaxReturnHtml,
    createData: methods.ajaxCreateData
  }
}());

window.useAjax = useAjax;
