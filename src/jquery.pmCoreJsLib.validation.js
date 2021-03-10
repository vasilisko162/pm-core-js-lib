/**
 * pmCoreJsLib_Validation
 * Version: 0.1.0
 * Description: Input validation library.
 */

var validation = (function() {
  var methods = {

    /**
     * String validation
     */
    validateStringInput: function(element, regex, minWidth) {
      var elementValue = methods._getElementValue(element);
      if (regex === '' || regex === undefined || regex === null) regex = /.*/;
      if (minWidth === '' || minWidth === undefined || minWidth === null) minWidth = 1;
      return (regex.test(elementValue) && elementValue.length >= minWidth);
    },

    /**
     * Email validation
     * @param element
     * @param required
     * @returns {boolean}
     */
    validateEmail: function(element, required) {
      var emailValue = methods._getElementValue(element);
      return (!required && (emailValue === '' || emailValue === undefined || emailValue === null)) ||
             /^[a-zA-Z0-9._-]{1,64}@([a-zA-Z0-9.-]{2,255})\.[a-zA-Z]{2,255}$/.test(emailValue);
    },

    /**
     * Phone validation
     * @param element
     * @param required
     * @param simple
     * @returns {boolean}
     */
    validatePhone: function(element, required, simple) {
      var phoneValue = methods._getElementValue(element),
        regTemplate = simple ? /\d{10}/i : /\+7\s\(\d{3}\)\s\d{3}\-\d{4}/i; // 1234567890 / +7 (999) 333-4444
      return (phoneValue === '' && !required) || regTemplate.test(phoneValue);
    },

    /**
     * Validation of value
     * @param amount
     * @returns {boolean}
     */
    validateAmount: function(amount) {
      return /^\d+(\,\d{1,2})?(\.\d{1,2})?$/.test(amount);
    },

    /**
     * Password validation
     * @param element
     * @returns {boolean}
     */
    validatePassword: function(element) {
      var elementValue = methods._getElementValue(element);
      return (elementValue !== '' && elementValue.length > 5);
    },

    /**
     * Password natching validation
     * @param passwordOne
     * @param passwordTwo
     * @returns {boolean|*}
     */
    validateBothPassword: function(passwordOne, passwordTwo) {
      var passwordOneValue = methods._getElementValue(passwordOne),
        passwordTwoValue = methods._getElementValue(passwordTwo);
      return (passwordOneValue === passwordTwoValue && methods.validatePassword(passwordOne));
    },

    /**
     * Checkbox validation
     * @param element
     * @returns {*|jQuery|boolean|never}
     */
    validateCheckbox: function(element) {
      return element.is(':checked');
    },

    /**
     * Radiobutton  validation
     * @param element
     * @returns {*|jQuery|boolean|never}
     */
    validateRadio: function(element) {
      return element.is(':checked');
    },

    /**
     * Number  validation
     * @param element
     * @param required
     * @returns {boolean}
     */
    validateNumber: function(element, required) {
      var elementValue = methods._getElementValue(element);
      return (!required && (elementValue === '' || elementValue === undefined || elementValue === null)) ||
             /^[0-9]*$/.test(elementValue);
    },

    /**
     * Validating a non-empty value
     * @param element
     * @returns {boolean}
     */
    validateNotEmpty: function(element) {
      var selectValue = methods._getElementValue(element);
      return (selectValue !== '' && selectValue !== 0 && selectValue !== '0');
    },

    /**
     *
     * @param obj
     * @returns {boolean}
     */
    validateAll: function(obj) {
      var validateAllStatus = true;
      for (var key in obj) {
        if (!obj[key]) validateAllStatus = false;
      }
      return validateAllStatus;
    },

    /**
     * Get value from field
     * @param element
     * @returns {*|jQuery|*}
     * @private
     */
    _getElementValue: function(element) {
      return (typeof $ === "function" && typeof jQuery === "function") ? element.val() : document.getElementById(
        element).value;
    }
  };

  return {
    number: methods.validateNumber,
    stringInput: methods.validateStringInput,
    email: methods.validateEmail,
    phone: methods.validatePhone,
    amount: methods.validateAmount,
    checkbox: methods.validateCheckbox,
    radio: methods.validateRadio,
    notEmpty: methods.validateNotEmpty,
    password: methods.validatePassword,
    bothPassword: methods.validateBothPassword,
    validateAll: methods.validateAll
  }
}());
window.validation = validation;
