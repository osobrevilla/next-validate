(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Validates"] = factory();
	else
		root["Validates"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Validate.js for NextValidate.js
 * Developers: Oscar Sobrevilla with colaboration of Waldo Saccaco and Luis Moreno
 */

var RULES = {};
var GLOBAL_DEFAULT_RULE_OPTIONS = {
  message: 'Valor no valido'
};

// export interface ValidatesArgs {
//   value: string | number;
// }

// export interface ValidateRuleOptions {
//   test: Function;
//   pattern?: RegExp,
//   message: string;
// }

// export interface TestObject {
//   test: Function;
//   name: string,
//   args: any,
//   localOptions: ValidateRuleOptions
//   runtimeOptions: ValidateRuleOptions
// }

// export interface ValidateRuleOptionsDefault {
//   message: string
// }


/** Class representing a Validates. */

var Validates = function () {
  function Validates() {
    _classCallCheck(this, Validates);
  }

  _createClass(Validates, null, [{
    key: 'addRule',

    /**
     * Add new validation rule
     */
    value: function addRule(name, options) {
      if (options && typeof name === 'string') {

        var localOptions = Object.assign({}, GLOBAL_DEFAULT_RULE_OPTIONS, options);
        RULES[name] = localOptions;
        Validates[name] = function (param) {
          var args = {};
          var type = typeof param === 'undefined' ? 'undefined' : _typeof(param);

          if (type === 'string' || type === 'number' || type === 'boolean') {
            args.value = isNaN(param) ? param : Number(param);
          } else if (type === 'object' && !Array.isArray(param) && param) {
            args = param;
          }

          var testObject = {
            test: function test(value, el) {
              return this.runtimeOptions.test(value, el, args);
            },
            runtimeOptions: Object.assign({}, options, localOptions, args),
            localOptions: localOptions,
            args: args,
            name: name
          };

          return testObject;
        };

        return Validates;
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

  return Validates;
}();

/**
 * @type {Object}
 */


exports.default = Validates;
var REQUIRED_RULE = {
  test: function test(value) {
    return value !== '' && value !== undefined;
  },
  message: 'El campo es requerido'
};

Validates.addRule('email', {
  pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  test: function test(value, el) {
    value = value.trim();
    if (value) return this.pattern.test(value);
  },
  message: 'El email no es válido'
}).addRule('require', REQUIRED_RULE).addRule('required', REQUIRED_RULE).addRule('alpha', {
  pattern: /^[a-zA-Z\s\']+$/,
  test: function test(value, el) {
    return this.pattern.test(value);
  },
  message: 'Solo letras'
}).addRule('integer', {
  pattern: /^-?\d+$/,
  test: function test(value, el) {
    value = String(value).trim();
    if (value) return this.pattern.test(value);
  },
  message: 'Solo números enteros'
}).addRule('decimal', {
  pattern: /^-?\d*(\.\d+)?$/,
  test: function test(value, el) {
    value = value.trim();
    if (value) return this.pattern.test(value);
  },
  message: 'Solo números'
}).addRule('date', {
  pattern: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
  test: function test(value, el) {
    value = value.trim();
    if (value) return this.pattern.test(value);
  },
  message: 'Fecha mal formada, por favor usar día/mes/año'
}).addRule('compare', {
  test: function test(value, el, args) {
    var el = _typeof(args.value) === 'object' ? args.value : document.querySelector(args.value);
    return el.value == value;
  },
  message: 'No coinciden los datos'
}).addRule('maxlength', {
  test: function test(value, el, args) {
    var max = args.value;
    el.maxLength = max;
    return value.length <= max;
  },
  message: 'Máximo {{0}} caracteres'
}).addRule('size', {
  test: function test(value, el, args) {
    var size = args.value;
    if (value) {
      el.maxLength = size;
      return value.length == size;
    }
  },
  message: 'Deben ser {{0}} caracteres'
}).addRule('minlength', {
  test: function test(value, el, args) {
    value = value.trim();
    if (value) return value.length >= args.minlength;
    return true;
  },
  message: 'mínimo {{0}} caracteres'
}).addRule('alphanumeric', {
  pattern: /^\w+$/,
  test: function test(value, el) {
    value = value.trim();
    if (value) return this.pattern.test(value);
  },
  message: 'Solo números y letras'
}).addRule('range', {
  pattern: /^-?\d+$/,
  test: function test(value, el, args) {
    value = Number(String(value).trim());
    if (value) return value >= args.min && value <= args.max;
  },
  message: 'Solo números entre {{min}} y {{max}}'
});

// Validates.addRule('dni', {
//   pattern: /\d+/,
//   test(value, el, args) {
//     return this.pattern.test(value);
//   },
//   message: ""
// });

/***/ })
/******/ ]);
});