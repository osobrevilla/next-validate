/** NextValidate.js
 * Developers: Oscar Sobrevilla with colaboration of Waldo Saccaco and Luis Moreno
 */

 import '../styles/_next-validate.css'

/**
 * @type {string}
 */
var GLOBAL_MESSAGE_ERROR_TEMPLATE = '{{MESSAGE}}';



/**
 * @type {string}
 */
const VALIDATA_DATA_KEY = 'form-validates';



/**
 * @type {RegExp}
 */
const VALIDATE_ATTRIBUTE_REGEXP = /^data-validate-(.+)/;


/**
 * @type {Object}
 */
const VALIDATE_EVENT_MAP = {
  'select': ['blur', 'change'],
  'input textarea': ['blur', 'input'] //keyup
};

const events = {
  stores: {},
  on(el, event, fn, capture = false) {
    let key = el.dataset.fvevt || "fv" + Date.now(),
      store;
    store = this.stores[key];
    if (!store)
      store = this.stores[key] = {};

    if (store[event])
      store[event].push(fn);
    else
      store[event] = [fn];

    el.addEventListener(event, fn, capture);
    el.dataset.fvevt = key;
  },

  off(el, event, fn, capture = false) {
    el.removeEventListener(event, fn, capture);
  },

  offAll: function (el, event = null, capture = false) {
    let key = el.dataset.fvevt,
      store = this.stores[key];
    //console.log(store);
    if (!store)
      return;
    if (event) {
      if (store[event])
        store[event].forEach((fn) => this.off(el, event, fn, capture))
    } else {
      for (let i in store)
        store[i].forEach((fn) => this.off(el, i, fn, capture))
    }
  }
};

const utils = {
  closest(el, selector) {
    var matches = (el.document || el.ownerDocument).querySelectorAll(selector),
      i;
    do {
      i = matches.length;
      while (--i >= 0 && matches.item(i) !== el) {};
    } while ((i < 0) && (el = el.parentElement));
    return el;
  },
  elementFromString(html) {
    let element, div = document.createElement('div');
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

const RULES = {};

const GLOBAL_DEFAULT_RULE_OPTIONS = {
  message: 'Valor no valido'
};

const _parseValidationAttributes = (field) => {
  var validates = {},
    hasAttr = false;
  for (let attr of field.attributes) {
    if (VALIDATE_ATTRIBUTE_REGEXP.test(attr.name)) {
      hasAttr = true;
      validates[attr.name.substr(14)] = attr.value;
    }
  };
  if (hasAttr)
    return validates;
  return null;
  //field.dataset[VALIDATA_DATA_KEY] = JSON.stringify(validates);
};

const _onKey = (e, fieldObject, instance) => {

  var field = e.target,
    code = e.which || e.keyCode || e.charCode,
    canContinue = true,
    keyChar = String.fromCharCode(code),
    failedTestObj = null;

  canContinue = fieldObject.testObjects
    .filter(testObj => testObj.localOptions.hasOwnProperty('whiteList'))
    .reduce((prevValue, testObj) => {
      let regExp = new RegExp(`[^${testObj.localOptions.whiteList}]`, 'g');
      let position = field.selectionStart;
      field.value = field.value.replace(regExp, '');
      field.selectionEnd = position;
      return !regExp.test(keyChar) * prevValue
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

const _getArgsFromDirective = (param) => {
  let args = {};
  const type = typeof param;
  const isBoolean = /^(true|false)$/;
  if (type === 'string') {
    if (isNaN(param)) {
      param.split(',')
        .map(keyValue => keyValue.trim().split(':'))
        .forEach(row => {
          let value = row[1];
          args[row[0].trim()] = isNaN(value) ? isBoolean.test(value = value.trim().toLowerCase()) ? value == 'true' : value : Number(value)
        });
    } else {
      args.value = Number(param);
    }
  }
  return args;
};

const _createTestObject = (validationFunctions) => {
  const testObjects = [];
  for (let obj of validationFunctions) {
    if (typeof obj === 'function')
      obj = obj();
    if (name === 'required' || name === 'require') {
      testObjects.splice(0, 0, obj);
    } else {
      testObjects.push(obj);
    }
  }
  return testObjects;
};

const _getFormFields = (form) => [].slice.call(form.querySelectorAll(_getDataSelectors().join(', ')));

const _getDataSelectors = () => Object.keys(Validators.getRules()).map(frag => `[data-validate-${frag}]`);

const _getFieldValue = (el) => ['checkbox', 'radio'].includes(el.type) ? el.checked ? el.value : '' : el.value;

const _getMessage = (fieldObject, field) => {
  let _message = Object.assign({}, fieldObject.runtimeOptions, fieldObject.args).message;
  // console.log("row", fieldObject.runtimeOptions, fieldObject.args);
  return typeof _message === 'function' ? _message.call(fieldObject.runtimeOptions, fieldObject.args, field) : _message;
};


/** Class representing a Form Validate. */

class NextValidate {

  /**
   * Create a NextValidate instance
   * @param {HTMLFormElement} form - The form element to validate
   * @param {NextValidateOptions} [options]
   */

  constructor(form, options = {}) {
    this.options = Object.assign({
      errorMessageTemplate: '',
    }, options);

    this.form = form;
    this.form.classList.add('next-validate');
    this._validators_ = [];

    if (options.validates) {
      this.compileFunctions(options.validates);
    } else {
      this._parse();
    }

    events.on(this.form, 'submit', (e) => {
      if (!this.isValid()) {
        e.preventDefault();
        this.form.classList.remove('form-valid');
        return false;
      } else {
        this.form.classList.add('form-valid');
      }
    });

  }
  _parse() {
    _getFormFields(this.form)
      .map(field => ({
        field: field,
        attrs: _parseValidationAttributes(field)
      }))
      .forEach(directives => {
        let validatesFns = [];
        for (let name in directives.attrs) {
          if (Validators[name]) {
            if (directives.attrs[name]) {
              validatesFns.push(Validators[name.toLowerCase()](_getArgsFromDirective(directives.attrs[name])));
            } else {
              validatesFns.push(Validators[name.toLowerCase()]);
            }
          }
        }
        this.compileFunction(directives.field, validatesFns);
      });
  }

  compileFunctions(settings) {
    for (let i in settings) {
      let field = this.form[i];
      if (field) {
        let validatesFns = settings[i];
        this.compileFunction(field, validatesFns);
      }
    }
  }

  compileFunction(field, ruleFunctions) {
    const validator = {
      field: field,
      testObjects: _createTestObject(ruleFunctions)
    };
    this._validators_.push(validator);
    this._bindEvents(validator);
  }

  getFormGroup(field) {
    var formGroup = utils.closest(field, '.form-group, .nextvalidate-form-group');
    return formGroup ? formGroup : field.parentElement;
  }


  _bindEvent(fieldObject, type) {
    const field = fieldObject.field;
    const eventName = type; //+ '.validate';
    const that = this;
    let result = true;
    switch (type) {
      case 'input':
        events.on(field, eventName, event => {
          _onKey(event, fieldObject, that)
        }, false);
        break;
      case 'blur':
      case 'keyup':
      case 'change':
        events.on(field, eventName, event => {
          this.validateControl(fieldObject)
        }, false);
        break;
      case 'click':
        events.on(field, eventName, event => {
          this.validateControl(fieldObject)
        }, false);
        break;
      default:
    }
  }

  _unbindEvents() {
    this._validators_.forEach(validate => events.offAll(validate.field));
  }

  _bindEvents(validate) {
    let field = validate.field,
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

  _buildMessageBlock(message) {
    message = message || 'Este valor es incorrecto';
    return (`<div class="form-control-feedback">${this.options.errorMessageTemplate || GLOBAL_MESSAGE_ERROR_TEMPLATE}</div>`).replace('{{MESSAGE}}', message);
  }

  _putMessage(formGroup, message) {
    this.removeMessage(formGroup);
    if (message) {
      formGroup.classList.add('has-error');
      formGroup.appendChild(utils.elementFromString(this._buildMessageBlock(message)));
    }
  }

  _buildMessage(template = '', args) {
    // console.log(template, values);
    for (let key in args) {
      template = template.replace(
        new RegExp('\\{\\{' + key + '\\}\\}', 'g'), args[key]
      );
    }
    return template;
  }

  /**
   * Remove message below form control
   * @param {HTMLFormElement} field - Node element contain a single input/select/textarea element
   * @description Remove the message element inserted after validation
   */
  removeMessage(field) {
    let formGroup = this.getFormGroup(field),
      feedbacks = formGroup.querySelectorAll('.form-control-feedback')
    formGroup.classList.remove('has-error', 'has-success');
    for (let element of feedbacks)
      element.parentNode.removeChild(element);
  }



  /**
   * Display message below form control
   * @param {HTMLFormElement} field - HTMLFormElement contain a single input/select/textarea element
   * @param {Object} data
   * @property {string} data.value - The value of [data-validate-key="value"]
   * @property {string} data.key - The name of rule (key) [data-validate-[key]]
   */
  displayMessage(field, message, args, fadeOutTime) {
    this._putMessage(this.getFormGroup(field), this._buildMessage(message, args));
    if (fadeOutTime)
      setTimeout(() => this.removeMessage(field), fadeOutTime);
  }

  validateControl(fieldObject) {
    let isValid = true,
      field = fieldObject.field;

    if (field.offsetParent === null) // if input is invisible, skip and return true.
      return isValid;

    if (field.hasAttribute('disabled'))
      return isValid;

    for (let testObject of fieldObject.testObjects) {

      let result = testObject.test(_getFieldValue(field), field);

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

    return isValid;
  }

  /**
   * fire the validate of all form inputs an return if the form is valid.
   * @returns {boolean}
   */
  isValid() {
    //console.log(this._validators_);
    let isValid = true;

    [].forEach.call(this._validators_, validate => (isValid = isValid * this.validateControl(validate)))
    return isValid;
  }

  /**
   * Unbind, clear, find and re-bind validate events to the form
   */
  refresh() {
    events.offAll(this.form);
    // _getFormFields().forEach(field => {
    //   delete field.dataset[VALIDATA_DATA_KEY]
    // });
    this._unbindEvents();
  }

  /**
   * setMessageErrorTemplate
   * @param {string} template - set the own template of instance
   * @description Set the global message error template to use for all instances
   */
  static setMessageErrorTemplate(template) {
    GLOBAL_MESSAGE_ERROR_TEMPLATE = template;
  }

}


class Validators {
  /**
   * Add new validation rule
   * @param {string} name  - rule name
   * @param {ValidateRuleOptions} options - rule options
   */
  static add(name, options) {
    if (typeof name === 'string' || Array.isArray(name) && options) {

      const localOptions = Object.assign({}, GLOBAL_DEFAULT_RULE_OPTIONS, options);

      [].concat(name).forEach((name) => {

        RULES[name] = localOptions;

        Validators[name] = (param) => {
          let args = {},
            type = typeof param;

          if (type === 'string' || type === 'number' || type === 'boolean') {
            args.value = isNaN(param) ? param : Number(param);
          } else if (type === 'object' && !Array.isArray(param) && param) {
            args = param;
          }

          const testObject = {
            test: function (value, el) {
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
  static setRuleMessage(name, message) {
    if (typeof name === 'string' && typeof message === 'string') {
      if (RULES[name])
        RULES[name].message = message;
    }
  }

  static getValidateRule(name) {
    return RULES[name];
  }

  static getRules() {
    return RULES;
  }
}

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
const REQUIRED_RULE = {
  test: function (value, el) {
    return String(value).trim() != ''
  },
  message: 'El campo es requerido'
};


Validators.add('email', {
    pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    test(value, el) {
      value = value.trim();
      if (value)
        return this.pattern.test(value);
    },
    message: 'El email no es válido'
  }).add('require', REQUIRED_RULE).add('required', REQUIRED_RULE).add('alpha', {
    pattern: /^[a-zA-Z\s\']+$/,
    test(value, el) {
      return this.pattern.test(value);
    },
    message: 'Solo letras'
  }).add('integer', {
    whiteList: '\\d-',
    pattern: /^\-?\d+$/,
    test(value, el) {
      value = String(value).trim();
      if (value.length)
        return this.pattern.test(value);
    },
    message: 'Solo números enteros'
  })
  .add('dni', {
    whiteList: '\\d',
    pattern: /^\d+$/,
    test(value, el) {
      value = String(value).trim();
      if (value)
        return this.pattern.test(value) && value.length === 8;
    },
    message: 'DNI no válido'
  })
  .add(['float', 'decimal'], {
    whiteList: '\\d|.|-',
    test(value, el, args) {
      value = value.trim();
      if (value)
        return args.strict ? /^-{0,1}?\d*\.{0,1}\d+$/.test(value) : /^-{0,1}?\d*\.{0,1}?\d+?$/.test(value);
    },
    message(args) {
      return 'Solo números' + (args.strict ? ' con punto decimal' : '');
    }
  }).add('date', {
    pattern: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
    test(value, el) {
      value = value.trim();
      if (value)
        return this.pattern.test(value);
    },
    message: 'Fecha mal formada, por favor usar día/mes/año'
  }).add('compare', {
    test(value, el, args) {
      var el = typeof args.value === 'object' ? args.value : document.querySelector(args.value);
      return el.value == value;
    },
    message: 'No coinciden los datos'
  }).add('maxlength', {
    test(value, el, args) {
      let max = args.value;
      el.maxLength = max;
      return value.length <= max;
    },
    message: 'Máximo {{value}} caracteres'
  }).add('size', {
    test(value, el, args) {
      let size = args.value;
      if (value) {
        el.maxLength = size;
        return value.length == size;
      }
    },
    message: 'Deben ser {{value}} caracteres'
  }).add('minlength', {
    test(value, el, args) {
      value = value.trim();
      if (value)
        return value.length >= args.value
    },
    message: function (args, field) {
      return `mínimo ${args.value} caracteres <span style="float:right">${field.value.trim().length} de ${args.value}</span>`;

    }
  }).add('alphanumeric', {
    pattern: /^\w+$/,
    test(value, el) {
      value = value.trim();
      if (value)
        return this.pattern.test(value);
    },
    message: 'Solo números y letras'
  }).add('range', {
    pattern: /^-?\d+$/,
    test(value, el, args) {
      value = Number(String(value).trim());
      if (value)
        return value >= args.min && value <= args.max;
    },
    message: 'Solo números entre {{min}} y {{max}}'
  }).add('visa', {
    whiteList: /[\d]/,
    total: 16,
    test(value, el, args) {
      value = String(value).trim();
      if (value) {
        return value.replace(/\D/g, '').length === this.total;
      }
    },
    message(args, field) {
      let value = String(field.value).trim();
      value = value.replace(/\D/g, '');
      return `se requieren ${this.total - value.length} dígitos`
    }
  }).add('remote', {
    async: true,
    test(value, el, args, next) {

      var myRequest = new Request(args.url, {
        method: args.method || 'GET',
        body: JSON.stringify(Object.assign({}, {
          value: value
        }, args.body, {}))
      });

      fetch(myRequest)
        .then(function (response) {
          if (response.status == 200) return response.json();
          else throw new Error('Something went wrong on api server!');
        })
        .then(function (response) {
          console.debug(response);
          // ...
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  });


global.Validators = Validators;
global.NextValidate = NextValidate;
NextValidate.Validators = NextValidate;

export default NextValidate




//replace(/äëïöü|ÄËÏÖÜ|áéíóú|ÁÉÍÓÚ|ÂÊÎÔÛ|âêîôû|àèìòù|ÀÈÌÒÙ|ãẽĩõũỹ|ÃẼĨÕŨỸ/g, '').split('').join(' ') : '';