/**
 * pmCoreJsLib_Common
 * Version: 0.2.0
 * Description: Common scripts.
 */

var pmCore_commonScripts = (function() {
  var settings = {
    showLog: true, // true / false,
    language: 'ru',

    mainPageDiv: 'main-page',
    contentDiv: 'main-page__content',
    pageLoaderDiv: 'page-loader',

    valid: 'valid',
    invalid: 'invalid',
    logClass: 'log',
    formBtnPrefix: '_submit'
  };

  var properties = {};

  var methods = {
    /**
     *
     * @param id
     * @param params
     * @param showLoader
     * @returns {boolean}
     */
    loadPage: function(id, params, showLoader) {
      if (!id) return false;
      if (!params) params = {};
      if (!showLoader) showLoader = false;

      if (showLoader) methods.pageLoader_show();
      $('.' + settings.mainPageDiv).find('.' + settings.pageLoaderDiv).addClass('show');
      $('.' + settings.contentDiv).hide().html('');

      var dataSend = {
        action: 'page',
        html: true,
        id: id,
        jsonParams: JSON.stringify(params)
      };

      useAjax.returnHtml('', dataSend.action, dataSend, function(result) {
        $('.' + settings.contentDiv).html(result).show();
        if (showLoader) methods.pageLoader_hide();
        $('.' + settings.mainPageDiv).find('.' + settings.pageLoaderDiv).removeClass('show');
      });

      return true;
    },

    pageLoader_show: function() {
      $('.' + settings.pageLoaderDiv).addClass('show');
    },

    pageLoader_hide: function() {
      $('.' + settings.pageLoaderDiv).removeClass('show');
    },

    /**
     *
     * @param element
     * @param status
     * @param showIcon
     * @returns {*}
     */
    inputChangeValidStatus: function(element, status, showIcon) {
      if (!showIcon) showIcon = false;
      if (status) {
        element
          .addClass(settings.valid)
          .removeClass(settings.invalid);
        if (showIcon) element.parent().find('.error-icon').remove();

      } else {
        element
          .addClass(settings.invalid)
          .removeClass(settings.valid);
        if (showIcon) element.parent().append('<span class="error-icon"></span>');
      }
      return status;
    },

    /**
     * Returns an array of values from GET
     * @param str
     * @returns {Array}
     */
    explodeGetFromLink: function(str) {
      var regex = /([^?&=]+)?\=([^?&=]+)?/gm,
        tempArr = str.match(regex),
        result = [];

      $.each(tempArr, function(k, v) {
        var temp = v.split('=');
        result[temp[0]] = temp[1];
      });
      return result;
    },

    /**
     *
     * @param formId
     * @param str
     * @returns {boolean}
     */
    form__showLog: function(formId, str) {
      if (!formId) return false;
      if (!str) {
        methods.showLog(pmCore_dictionary.text.noStrValuePassed[settings.language]);
        return false
      }
      methods.form__clearLog(formId);
      if (!formId) return false;
      $('#' + formId).find('.' + settings.logClass).show().html(methods.__clearLogText(str));
      return true;
    },

    /**
     *
     * @param formId
     * @param str
     * @returns {boolean}
     */
    form__showLogSuccess: function(formId, str) {
      if (!formId) return false;
      if (!str) str = pmCore_dictionary.text.Error[settings.language];
      methods.form__clearLog(formId);
      $('#' + formId).find('.' + settings.logClass).show().addClass('success').html(methods.__clearLogText(str));
      return true;
    },

    /**
     *
     * @param formId
     * @param str
     * @returns {boolean}
     */
    form__showLogError: function(formId, str) {
      if (!formId) return false;
      if (!str) str = pmCore_dictionary.text.Error[settings.language];
      methods.form__clearLog(formId);
      $('#' + formId).find('.' + settings.logClass).show().addClass('error').html(methods.__clearLogText(str));
      return true;
    },

    /**
     *
     * @param formId
     * @param str
     * @param dataValidate
     * @param data
     * @returns {boolean}
     */
    form__showLogErrorWithRowNames: function(formId, str, dataValidate, data) {
      if (!formId) return false;
      if (!str) str = pmCore_dictionary.text.Error[settings.language];

      var strTitles = [];

      $.each(dataValidate, function(rowName, result) {
        if (!result && rowName in data) {
          var title = methods.__returnRowTitle(data[rowName]);
          strTitles.push(title);
        }
      });

      if (strTitles.length) str += ' <br/>' + pmCore_dictionary.formErrorAnother.rows + ': ' + strTitles.join(', ') + '.';
      methods.form__clearLog(formId);
      $('#' + formId).find('.' + settings.logClass).show().addClass('error').html(methods.__clearLogText(str));

      return true;
    },

    form__clearLog: function(formId) {
      $('#' + formId).find('.' + settings.logClass).show().removeClass('success error').text('');
      return true;
    },

    form__hideLog: function(formId) {
      methods.form__clearLog(formId);
      $('#' + formId).find('.' + settings.logClass).hide();
    },

    /**
     *
     * @param formId
     * @returns {boolean}
     */
    form__disabledForm: function(formId) {
      if (!formId) return false;
      var $form = $('#' + formId),
        $formBtn = $form.find('#' + formId + settings.formBtnPrefix);

      $form.find('input, textarea, select').attr('readonly', true);
      $formBtn.attr('disabled', true);
    },

    /**
     *
     * @param btnId
     * @param status
     * @returns {boolean}
     */
    form__btnSwitch: function(btnId, status) {
      if (!btnId) return false;
      $('#' + btnId).attr('disabled', !status);
      return true;
    },

    form__copyFormTitle: function() {
      var value = $(this).parents('form').find('input[name="title"]').val(),
        input = $(this).parents('li').find('input'),
        inputName = input.attr('name');
      if (!value) return false;
      if (inputName === 'name') input.val(value);
      if (inputName === 'url') input.val(methods.convertToLink(value));
    },

    /**
     * Set value to localStorage
     * @param paramName
     * @param data
     * @returns {boolean}
     */
    localStorage_setItem: function(paramName, data) {
      if (!paramName || data) return false;
      pmCore_commonScripts.showLog('localStorage_setItem', paramName + ': ' + data);
      localStorage.setItem(paramName, data);
      return true;
    },

    /**
     *
     * @param paramName
     * @returns {*}
     */
    localStorage_getItem: function(paramName) {
      if (!paramName) return false;
      pmCore_commonScripts.showLog('localStorage_getItem', paramName);
      return localStorage.getItem(paramName);
    },

    /**
     * Reload page
     * @param time
     * @returns {boolean}
     */
    reloadPage: function(time) {
      if (time) {
        time = time * 1000;
        setTimeout(function() {
          window.location.reload();
        }, time);
      } else {
        window.location.reload();
      }
      return true;
    },

    /**
     * Транслитерация кириллицы в URL
     * @param str
     * @returns {String}
     */
    convertToLink: function(str) {
      if (!str) str = '';
      var cyr2latChars = [
        ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'],
        ['д', 'd'], ['е', 'e'], ['ё', 'yo'], ['ж', 'zh'], ['з', 'z'],
        ['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'],
        ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'],
        ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'],
        ['х', 'h'], ['ц', 'c'], ['ч', 'ch'], ['ш', 'sh'], ['щ', 'shch'],
        ['ъ', ''], ['ы', 'y'], ['ь', ''], ['э', 'e'], ['ю', 'yu'], ['я', 'ya'],

        ['А', 'A'], ['Б', 'B'], ['В', 'V'], ['Г', 'G'],
        ['Д', 'D'], ['Е', 'E'], ['Ё', 'YO'], ['Ж', 'ZH'], ['З', 'Z'],
        ['И', 'I'], ['Й', 'Y'], ['К', 'K'], ['Л', 'L'],
        ['М', 'M'], ['Н', 'N'], ['О', 'O'], ['П', 'P'], ['Р', 'R'],
        ['С', 'S'], ['Т', 'T'], ['У', 'U'], ['Ф', 'F'],
        ['Х', 'H'], ['Ц', 'C'], ['Ч', 'CH'], ['Ш', 'SH'], ['Щ', 'SHCH'],
        ['Ъ', ''], ['Ы', 'Y'],
        ['Ь', ''],
        ['Э', 'E'],
        ['Ю', 'YU'],
        ['Я', 'YA'],

        ['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'], ['e', 'e'],
        ['f', 'f'], ['g', 'g'], ['h', 'h'], ['i', 'i'], ['j', 'j'],
        ['k', 'k'], ['l', 'l'], ['m', 'm'], ['n', 'n'], ['o', 'o'],
        ['p', 'p'], ['q', 'q'], ['r', 'r'], ['s', 's'], ['t', 't'],
        ['u', 'u'], ['v', 'v'], ['w', 'w'], ['x', 'x'], ['y', 'y'],
        ['z', 'z'],

        ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'], ['E', 'E'],
        ['F', 'F'], ['G', 'G'], ['H', 'H'], ['I', 'I'], ['J', 'J'], ['K', 'K'],
        ['L', 'L'], ['M', 'M'], ['N', 'N'], ['O', 'O'], ['P', 'P'],
        ['Q', 'Q'], ['R', 'R'], ['S', 'S'], ['T', 'T'], ['U', 'U'], ['V', 'V'],
        ['W', 'W'], ['X', 'X'], ['Y', 'Y'], ['Z', 'Z'],

        [' ', '-'], ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'],
        ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
        ['-', '-']];

      str = str.toLowerCase().trim(); // все в нижний регистр
      var newStr = new String();

      for (var i = 0; i < str.length; i++) {
        ch = str.charAt(i);
        var newCh = '';
        for (var j = 0; j < cyr2latChars.length; j++) {
          if (ch == cyr2latChars[j][0]) newCh = cyr2latChars[j][1];
        }
        // Если найдено совпадение, то добавляется соответствие, если нет - пустая строка
        newStr += newCh;
      }
      // Удаляем повторяющие знаки - Именно на них заменяются пробелы.
      // Так же удаляем символы перевода строки, но это наверное уже лишнее
      newStr = newStr.replace(/[-]{2,}/gim, '-');
      return newStr;
    },

    /**
     * Display value in console
     * @param str
     * @param strSecond
     * @returns {boolean}
     */
    showLog: function(str, strSecond) {
      if (!settings.showLog || !str) return false;
      var returnStr = 'Site: ' + str;
      if ((typeof strSecond) === 'object') {
        console.log(returnStr, strSecond);
      } else if ((typeof strSecond) === 'string') {
        console.log(returnStr, '|', strSecond);
      } else {
        console.log(returnStr);
      }
    },

    /**
     *
     * @param str
     * @returns {*}
     * @private
     */
    __clearLogText: function(str) {
      return str;
    },

    /**
     *
     * @param target
     * @returns {*}
     * @private
     */
    __returnRowTitle: function(target) {
      if (!target) return false;
      var title = target.parents('li').find('.title').attr('title') || target.parents('li').find('.title').html();
      title = title.replace(/<?[a-zA-Z\"\=\ ]+>.*<\/?[a-zA-Z\"\=\ ]+>/gi, '');
      title = title.replace(/[:]/i, '');
      return title;
    }
  };

  return {
    loadPage: methods.loadPage,
    pageLoaderShow: methods.pageLoader_show,
    pageLoaderHide: methods.pageLoader_hide,
    changeValidStatus: methods.inputChangeValidStatus,
    formShowLog: methods.form__showLog,
    formShowLogError: methods.form__showLogError,
    formShowLogErrorWithRowNames: methods.form__showLogErrorWithRowNames,
    formShowLogSuccess: methods.form__showLogSuccess,
    formHideLog: methods.form__hideLog,
    formDisabled: methods.form__disabledForm,
    btnSwitch: methods.form__btnSwitch,
    copyFormTitle: methods.form__copyFormTitle,
    showLog: methods.showLog,
    localStorageSetItem: methods.localStorage_setItem,
    localStorageGetItem: methods.localStorage_getItem,
    convertToLink: methods.convertToLink,
    explodeGetFromLink: methods.explodeGetFromLink,
    reloadPage: methods.reloadPage
  }
}());

window.pmCore_commonScripts = pmCore_commonScripts;
