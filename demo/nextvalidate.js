(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["NextValidate"] = factory();
	else
		root["NextValidate"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.nextvalidate = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /** NextValidate.js
   * Developers: Oscar Sobrevilla with colaboration of Waldo Saccaco and Luis Moreno
   */

  /**
   * @type {string}
   */
  var GLOBAL_MESSAGE_ERROR_TEMPLATE = '{{MESSAGE}}';

  /**
   * @type {string}
   */
  var VALIDATA_DATA_KEY = 'form-validates';

  /**
   * @type {RegExp}
   */
  var VALIDATE_ATTRIBUTE_REGEXP = /^data-validate-(.+)/;

  /**
   * @type {Object}
   */
  var VALIDATE_EVENT_MAP = {
    'select': ['blur', 'change'],
    'input textarea': ['blur', 'input'] //keyup
  };

  var events = {
    stores: {},
    on: function on(el, event, fn) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var key = el.dataset.fvevt || "fv" + Date.now(),
          store = void 0;
      store = this.stores[key];
      if (!store) store = this.stores[key] = {};

      if (store[event]) store[event].push(fn);else store[event] = [fn];

      el.addEventListener(event, fn, capture);
      el.dataset.fvevt = key;
    },
    off: function off(el, event, fn) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      el.removeEventListener(event, fn, capture);
    },


    offAll: function offAll(el) {
      var _this = this;

      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var key = el.dataset.fvevt,
          store = this.stores[key];
      //console.log(store);
      if (!store) return;
      if (event) {
        if (store[event]) store[event].forEach(function (fn) {
          return _this.off(el, event, fn, capture);
        });
      } else {
        var _loop = function _loop(i) {
          store[i].forEach(function (fn) {
            return _this.off(el, i, fn, capture);
          });
        };

        for (var i in store) {
          _loop(i);
        }
      }
    }
  };

  var utils = {
    closest: function closest(el, selector) {
      var matches = (el.document || el.ownerDocument).querySelectorAll(selector),
          i;
      do {
        i = matches.length;
        while (--i >= 0 && matches.item(i) !== el) {};
      } while (i < 0 && (el = el.parentElement));
      return el;
    },
    elementFromString: function elementFromString(html) {
      var element = void 0,
          div = document.createElement('div');
      div.innerHTML = html;
      element = div.firstElementChild;
      div.removeChild(element);
      return element;
    }
  };

  /**
   * A test function used during runtime validation
   * @callback NextValidateTest
   * @param {(number|string.)} value - the current value of input/select/textarea.
   * @param {HTMLFormElement} el - The input element.
   * @param {Array} params - The data validate value transformed to array.
   * @returns {boolean}
   */

  /**
   * Form validate contructor options
   * @typedef {Object} NextValidateOptions
   * @property {boolean} holdKeys=true - Block input using rule pattern or not
   * @property {string} errorMessageTemplate - templ
   */

  /**
   * Rule options.
   * @typedef {Object} ValidateRuleOptions
   * @property {Function} test - Validate function return true or false
   * @property {RegExp} pattern - Test regexp (optional)
   * @property {string} message - The message displayed when validation fails
   */

  /**
   * TestObject
   * @typedef TestObject 
   * @property {Function} test
   * @property {string } name
   * @property {Object|Array} args
   * @property {ValidateRuleOptions} localOptions
   * @property {ValidateRuleOptions} runtimeOptions
   *
   */

  var RULES = {};

  var GLOBAL_DEFAULT_RULE_OPTIONS = {
    message: 'Valor no valido'
  };

  var _parseValidationAttributes = function _parseValidationAttributes(field) {
    var validates = {},
        hasAttr = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = field.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var attr = _step.value;

        if (VALIDATE_ATTRIBUTE_REGEXP.test(attr.name)) {
          hasAttr = true;
          validates[attr.name.substr(14)] = attr.value;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    ;
    if (hasAttr) return validates;
    return null;
    //field.dataset[VALIDATA_DATA_KEY] = JSON.stringify(validates);
  };

  var _onKey = function _onKey(e, fieldObject, instance) {

    var field = e.target,
        code = e.which || e.keyCode || e.charCode,
        canContinue = true,
        keyChar = String.fromCharCode(code),
        failedTestObj = null;

    canContinue = fieldObject.testObjects.filter(function (testObj) {
      return testObj.localOptions.hasOwnProperty('whiteList');
    }).reduce(function (prevValue, testObj) {
      var regExp = new RegExp('[^' + testObj.localOptions.whiteList + ']', 'g');
      var position = field.selectionStart;
      field.value = field.value.replace(regExp, '');
      field.selectionEnd = position;
      return !regExp.test(keyChar) * prevValue;
    }, true);

    if (canContinue == false) {
      e.preventDefault();
      // return false;
    }

    instance.validateControl(fieldObject);

    // if (!canContinue) {
    //   e.preventDefault();
    //   if (e.target.value) {
    //     console.log('error');
    //     instance.displayMessage(field, _getMessage(failedTestObj, field), failedTestObj.args);
    //   } else
    //     instance.removeMessage(field);
    //   return false;
    // }
  };

  var _getArgsFromDirective = function _getArgsFromDirective(param) {
    var args = {};
    var type = typeof param === 'undefined' ? 'undefined' : _typeof(param);
    var isBoolean = /^(true|false)$/;
    if (type === 'string') {
      if (isNaN(param)) {
        param.split(',').map(function (keyValue) {
          return keyValue.trim().split(':');
        }).forEach(function (row) {
          var value = row[1];
          args[row[0].trim()] = isNaN(value) ? isBoolean.test(value = value.trim().toLowerCase()) ? value == 'true' : value : Number(value);
        });
      } else {
        args.value = Number(param);
      }
    }
    return args;
  };

  var _createTestObject = function _createTestObject(validationFunctions) {
    var testObjects = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = validationFunctions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var obj = _step2.value;

        if (typeof obj === 'function') obj = obj();
        if (name === 'required' || name === 'require') {
          testObjects.splice(0, 0, obj);
        } else {
          testObjects.push(obj);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return testObjects;
  };

  var _getFormFields = function _getFormFields(form) {
    return [].slice.call(form.querySelectorAll(_getDataSelectors().join(', ')));
  };

  var _getDataSelectors = function _getDataSelectors() {
    return Object.keys(Validators.getRules()).map(function (frag) {
      return '[data-validate-' + frag + ']';
    });
  };

  var _getFieldValue = function _getFieldValue(el) {
    return ['checkbox', 'radio'].includes(el.type) ? el.checked ? el.value : '' : el.value;
  };

  var _getMessage = function _getMessage(fieldObject, field) {
    var _message = Object.assign({}, fieldObject.runtimeOptions, fieldObject.args).message;
    // console.log("row", fieldObject.runtimeOptions, fieldObject.args);
    return typeof _message === 'function' ? _message.call(fieldObject.runtimeOptions, fieldObject.args, field) : _message;
  };

  /** Class representing a Form Validate. */

  var NextValidate = function () {

    /**
     * Create a NextValidate instance
     * @param {HTMLFormElement} form - The form element to validate
     * @param {NextValidateOptions} [options]
     */

    function NextValidate(form) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, NextValidate);

      this.options = Object.assign({
        errorMessageTemplate: ''
      }, options);

      this.form = form;
      this.form.classList.add('next-validate');
      this._validators_ = [];

      if (options.validates) {
        this.compileFunctions(options.validates);
      } else {
        this._parse();
      }

      events.on(this.form, 'submit', function (e) {
        if (!_this2.isValid()) {
          e.preventDefault();
          _this2.form.classList.remove('form-valid');
          return false;
        } else {
          _this2.form.classList.add('form-valid');
        }
      });
    }

    _createClass(NextValidate, [{
      key: '_parse',
      value: function _parse() {
        var _this3 = this;

        _getFormFields(this.form).map(function (field) {
          return {
            field: field,
            attrs: _parseValidationAttributes(field)
          };
        }).forEach(function (directives) {
          var validatesFns = [];
          for (var _name in directives.attrs) {
            if (Validators[_name]) {
              if (directives.attrs[_name]) {
                validatesFns.push(Validators[_name.toLowerCase()](_getArgsFromDirective(directives.attrs[_name])));
              } else {
                validatesFns.push(Validators[_name.toLowerCase()]);
              }
            }
          }
          _this3.compileFunction(directives.field, validatesFns);
        });
      }
    }, {
      key: 'compileFunctions',
      value: function compileFunctions(settings) {
        for (var i in settings) {
          var field = this.form[i];
          if (field) {
            var validatesFns = settings[i];
            this.compileFunction(field, validatesFns);
          }
        }
      }
    }, {
      key: 'compileFunction',
      value: function compileFunction(field, ruleFunctions) {
        var validator = {
          field: field,
          testObjects: _createTestObject(ruleFunctions)
        };
        this._validators_.push(validator);
        this._bindEvents(validator);
      }
    }, {
      key: 'getFormGroup',
      value: function getFormGroup(field) {
        var formGroup = utils.closest(field, '.form-group, .nextvalidate-form-group');
        return formGroup ? formGroup : field.parentElement;
      }
    }, {
      key: '_bindEvent',
      value: function _bindEvent(fieldObject, type) {
        var _this4 = this;

        var field = fieldObject.field;
        var eventName = type; //+ '.validate';
        var that = this;
        var result = true;
        switch (type) {
          case 'input':
            events.on(field, eventName, function (event) {
              _onKey(event, fieldObject, that);
            }, false);
            break;
          case 'blur':
          case 'keyup':
          case 'change':
            events.on(field, eventName, function (event) {
              _this4.validateControl(fieldObject);
            }, false);
            break;
          case 'click':
            events.on(field, eventName, function (event) {
              _this4.validateControl(fieldObject);
            }, false);
            break;
          default:
        }
      }
    }, {
      key: '_unbindEvents',
      value: function _unbindEvents() {
        this._validators_.forEach(function (validate) {
          return events.offAll(validate.field);
        });
      }
    }, {
      key: '_bindEvents',
      value: function _bindEvents(validate) {
        var field = validate.field,
            tagName = field.tagName.toLowerCase();
        for (var i in VALIDATE_EVENT_MAP) {
          if (i.indexOf(tagName) >= 0) {
            for (var j in VALIDATE_EVENT_MAP[i]) {
              this._bindEvent(validate, VALIDATE_EVENT_MAP[i][j]);
            }
          }
        }
        if (tagName === 'input' && ['checkbox', 'radio'].indexOf(field.type) >= 0) {
          this._bindEvent(validate, 'click');
        }
      }
    }, {
      key: '_buildMessageBlock',
      value: function _buildMessageBlock(message) {
        message = message || 'Este valor es incorrecto';
        return ('<div class="form-control-feedback">' + (this.options.errorMessageTemplate || GLOBAL_MESSAGE_ERROR_TEMPLATE) + '</div>').replace('{{MESSAGE}}', message);
      }
    }, {
      key: '_putMessage',
      value: function _putMessage(formGroup, message) {
        this.removeMessage(formGroup);
        if (message) {
          formGroup.classList.add('has-error');
          formGroup.appendChild(utils.elementFromString(this._buildMessageBlock(message)));
        }
      }
    }, {
      key: '_buildMessage',
      value: function _buildMessage() {
        var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var args = arguments[1];

        // console.log(template, values);
        for (var key in args) {
          template = template.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), args[key]);
        }
        return template;
      }
    }, {
      key: 'removeMessage',
      value: function removeMessage(field) {
        var formGroup = this.getFormGroup(field),
            feedbacks = formGroup.querySelectorAll('.form-control-feedback');
        formGroup.classList.remove('has-error', 'has-success');
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = feedbacks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var element = _step3.value;

            element.parentNode.removeChild(element);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }, {
      key: 'displayMessage',
      value: function displayMessage(field, message, args, fadeOutTime) {
        var _this5 = this;

        this._putMessage(this.getFormGroup(field), this._buildMessage(message, args));
        if (fadeOutTime) setTimeout(function () {
          return _this5.removeMessage(field);
        }, fadeOutTime);
      }
    }, {
      key: 'validateControl',
      value: function validateControl(fieldObject) {
        var isValid = true,
            field = fieldObject.field;

        if (field.offsetParent === null) // if input is invisible, skip and return true.
          return isValid;

        if (field.hasAttribute('disabled')) return isValid;

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = fieldObject.testObjects[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var testObject = _step4.value;


            var result = testObject.test(_getFieldValue(field), field);

            if (typeof result === 'undefined') {
              this.removeMessage(field);
              continue;
            } else {
              isValid *= !!result;
              if (isValid) {
                this.removeMessage(field);
              } else {
                this.displayMessage(field, _getMessage(testObject, field), testObject.args);
                break;
              }
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        return isValid;
      }
    }, {
      key: 'isValid',
      value: function isValid() {
        var _this6 = this;

        //console.log(this._validators_);
        var isValid = true;

        [].forEach.call(this._validators_, function (validate) {
          return isValid = isValid * _this6.validateControl(validate);
        });
        return isValid;
      }
    }, {
      key: 'refresh',
      value: function refresh() {
        events.offAll(this.form);
        // _getFormFields().forEach(field => {
        //   delete field.dataset[VALIDATA_DATA_KEY]
        // });
        this._unbindEvents();
      }
    }], [{
      key: 'setMessageErrorTemplate',
      value: function setMessageErrorTemplate(template) {
        GLOBAL_MESSAGE_ERROR_TEMPLATE = template;
      }
    }]);

    return NextValidate;
  }();

  exports.default = NextValidate;

  var Validators = exports.Validators = function () {
    function Validators() {
      _classCallCheck(this, Validators);
    }

    _createClass(Validators, null, [{
      key: 'add',

      /**
       * Add new validation rule
       * @param {string} name  - rule name
       * @param {ValidateRuleOptions} options - rule options
       */
      value: function add(name, options) {
        if (typeof name === 'string' || Array.isArray(name) && options) {

          var localOptions = Object.assign({}, GLOBAL_DEFAULT_RULE_OPTIONS, options);

          [].concat(name).forEach(function (name) {

            RULES[name] = localOptions;

            Validators[name] = function (param) {
              var args = {},
                  type = typeof param === 'undefined' ? 'undefined' : _typeof(param);

              if (type === 'string' || type === 'number' || type === 'boolean') {
                args.value = isNaN(param) ? param : Number(param);
              } else if (type === 'object' && !Array.isArray(param) && param) {
                args = param;
              }

              var testObject = {
                test: function test(value, el) {
                  return this.runtimeOptions.test(value, el, args);
                },
                runtimeOptions: Object.assign({}, options, localOptions),
                localOptions: localOptions,
                args: args,
                name: name
              };

              return testObject;
            };
          });

          return Validators;
        }
      }

      /**
       * Set the message property to specific rule.
       * @param {string} name - the name of rule
       * @param {string} message - the message template of the rule
       */

    }, {
      key: 'setRuleMessage',
      value: function setRuleMessage(name, message) {
        if (typeof name === 'string' && typeof message === 'string') {
          if (RULES[name]) RULES[name].message = message;
        }
      }
    }, {
      key: 'getValidateRule',
      value: function getValidateRule(name) {
        return RULES[name];
      }
    }, {
      key: 'getRules',
      value: function getRules() {
        return RULES;
      }
    }]);

    return Validators;
  }();

  /** Email Rule
   *  @name email
   *  @memberof Validators
   *  @static 
   *  @function email
   *  @param {object} someParameter Description
   */

  /**
   * @type {Object}
   */
  var REQUIRED_RULE = {
    test: function test(value, el) {
      return String(value).trim() != '';
    },
    message: 'El campo es requerido'
  };

  Validators.add('email', {
    pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    test: function test(value, el) {
      value = value.trim();
      if (value) return this.pattern.test(value);
    },

    message: 'El email no es válido'
  }).add('require', REQUIRED_RULE).add('required', REQUIRED_RULE).add('alpha', {
    pattern: /^[a-zA-Z\s\']+$/,
    test: function test(value, el) {
      return this.pattern.test(value);
    },

    message: 'Solo letras'
  }).add('integer', {
    whiteList: '\\d-',
    pattern: /^\-?\d+$/,
    test: function test(value, el) {
      value = String(value).trim();
      if (value.length) return this.pattern.test(value);
    },

    message: 'Solo números enteros'
  }).add('dni', {
    whiteList: '\\d',
    pattern: /^\d+$/,
    test: function test(value, el) {
      value = String(value).trim();
      if (value) return this.pattern.test(value) && value.length === 8;
    },

    message: 'DNI no válido'
  }).add(['float', 'decimal'], {
    whiteList: '\\d|.|-',
    test: function test(value, el, args) {
      value = value.trim();
      if (value) return args.strict ? /^-{0,1}?\d*\.{0,1}\d+$/.test(value) : /^-{0,1}?\d*\.{0,1}?\d+?$/.test(value);
    },
    message: function message(args) {
      return 'Solo números' + (args.strict ? ' con punto decimal' : '');
    }
  }).add('date', {
    pattern: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
    test: function test(value, el) {
      value = value.trim();
      if (value) return this.pattern.test(value);
    },

    message: 'Fecha mal formada, por favor usar día/mes/año'
  }).add('compare', {
    test: function test(value, el, args) {
      var el = _typeof(args.value) === 'object' ? args.value : document.querySelector(args.value);
      return el.value == value;
    },

    message: 'No coinciden los datos'
  }).add('maxlength', {
    test: function test(value, el, args) {
      var max = args.value;
      el.maxLength = max;
      return value.length <= max;
    },

    message: 'Máximo {{value}} caracteres'
  }).add('size', {
    test: function test(value, el, args) {
      var size = args.value;
      if (value) {
        el.maxLength = size;
        return value.length == size;
      }
    },

    message: 'Deben ser {{value}} caracteres'
  }).add('minlength', {
    test: function test(value, el, args) {
      value = value.trim();
      if (value) return value.length >= args.value;
    },

    message: function message(args, field) {
      return 'm\xEDnimo ' + args.value + ' caracteres <span style="float:right">' + field.value.trim().length + ' de ' + args.value + '</span>';
    }
  }).add('alphanumeric', {
    pattern: /^\w+$/,
    test: function test(value, el) {
      value = value.trim();
      if (value) return this.pattern.test(value);
    },

    message: 'Solo números y letras'
  }).add('range', {
    pattern: /^-?\d+$/,
    test: function test(value, el, args) {
      value = Number(String(value).trim());
      if (value) return value >= args.min && value <= args.max;
    },

    message: 'Solo números entre {{min}} y {{max}}'
  }).add('visa', {
    whiteList: /[\d]/,
    total: 16,
    test: function test(value, el, args) {
      value = String(value).trim();
      if (value) {
        return value.replace(/\D/g, '').length === this.total;
      }
    },
    message: function message(args, field) {
      var value = String(field.value).trim();
      value = value.replace(/\D/g, '');
      return 'se requieren ' + (this.total - value.length) + ' d\xEDgitos';
    }
  }).add('remote', {
    async: true,
    test: function test(value, el, args, next) {

      var myRequest = new Request(args.url, {
        method: args.method || 'GET',
        body: JSON.stringify(Object.assign({}, {
          value: value
        }, args.body, {}))
      });

      fetch(myRequest).then(function (response) {
        if (response.status == 200) return response.json();else throw new Error('Something went wrong on api server!');
      }).then(function (response) {
        console.debug(response);
        // ...
      }).catch(function (error) {
        console.error(error);
      });
    }
  });

  global.Validators = Validators;
  global.NextValidate = NextValidate;
  NextValidate.Validators = NextValidate;

  //replace(/äëïöü|ÄËÏÖÜ|áéíóú|ÁÉÍÓÚ|ÂÊÎÔÛ|âêîôû|àèìòù|ÀÈÌÒÙ|ãẽĩõũỹ|ÃẼĨÕŨỸ/g, '').split('').join(' ') : '';
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })
/******/ ]);
});