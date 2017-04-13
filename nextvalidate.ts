/** NextValidate.js
 * Developers: Oscar Sobrevilla with colaboration of Waldo Saccaco and Luis Moreno
 */

import { Validates, ValidateRuleOptions, TestObject, ValidatesArgs } from './validates';


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
  'input textarea': ['blur', 'keyup', 'keypress']
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
    console.log(store);
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
      while (--i >= 0 && matches.item(i) !== el) { };
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


const _parseValidatesAttributes = (field) => {
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

const _onKeyPress = (e, fieldObject, instance) => {

  var field = e.target,
    code = e.which || e.keyCode || e.charCode,
    canContinue = true,
    keyExceptions = [8, 9],
    keyChar = String.fromCharCode(code),
    failedTestObj = null;

  if (keyExceptions.indexOf(code) >= 0)
    return;

  canContinue = fieldObject.testObjects
    .filter(testObj => !!testObj.localOptions.pattern)
    .reduce((prevValue, testObj) => {
      let result = testObj.localOptions.pattern.test(keyChar) * prevValue;
      if (!result && failedTestObj === null) {
        failedTestObj = testObj;
      }
      return result;
    }, true)

  if (!canContinue) {
    e.preventDefault();
    if (e.target.value)
      instance.displayMessage(field, failedTestObj.runtimeOptions.message, fieldObject.args);
    else
      instance.removeMessage(field);
    return false;
  }
};

const _getArgsFromDirective = (param: any) => {
  let args: any = {};
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
  const testObjects: Array<TestObject> = [];
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

const _getDataSelectors = () => Object.keys(Validates.getRules()).map(frag => `[data-validate-${frag}]`);

const _getFieldValue = (el) => ['checkbox', 'radio'].indexOf(el.type) >= 0 ? (el.checked ? el.value : '') : el.value;


interface NextValidateOptions {
  validates: Array<any>;
  errorMessageTemplate: string;
}


interface FieldObject {
  field: HTMLFormElement;
  testObjects: Array<TestObject>;
}



/** Class representing a Form Validate. */

export class NextValidate {

  options: NextValidateOptions
  form: HTMLFormElement
  validates: Array<any>

  /**
   * Create a NextValidate instance
   * @param {HTMLFormElement} form - The form element to validate
   * @param {NextValidateOptions} [options]
   */

  constructor(form: HTMLFormElement, options: NextValidateOptions) {
    this.options = Object.assign({
      errorMessageTemplate: '',
    }, options);

    this.form = form;
    this.form.classList.add('next-validate');
    this.validates = [];

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
        attrs: _parseValidatesAttributes(field)
      }))
      .forEach(directives => {
        let validatesFns = [];
        for (let name in directives.attrs) {
          if (Validates[name]) {
            if (directives.attrs[name]) {
              validatesFns.push(Validates[name.toLowerCase()](_getArgsFromDirective(directives.attrs[name])));
            } else {
              validatesFns.push(Validates[name.toLowerCase()]);
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
    const validate:FieldObject = {
      field: field,
      testObjects: _createTestObject(ruleFunctions)
    };
    this.validates.push(validate);
    this._bindEvents(validate);
  }

  getFormGroup(field) {
    var formGroup = utils.closest(field, '.form-group');
    return formGroup ? formGroup : field.parentElement;
  }


  _bindEvent(fieldObject, type) {
    const field = fieldObject.field;
    const eventName = type; //+ '.validate';
    const that = this;
    let result: boolean = true;
    switch (type) {
      case 'keypress':
        events.on(field, eventName, event => {
          let _result = _onKeyPress(event, fieldObject, that);
          if (typeof _result === 'boolean')
            result = result && _result;
        }, false);
        break;
      case 'blur':
      case 'change':
      case 'keyup':
        events.on(field, eventName, event => {
          if (result)
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
    this.validates.forEach(validate => events.offAll(validate.field));
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
  removeMessage(field:HTMLFormElement) {
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
  displayMessage(field:HTMLFormElement, message:string, args:ValidatesArgs, fadeOutTime?:number) {
    this._putMessage(this.getFormGroup(field), this._buildMessage(message, args));
    if (fadeOutTime)
      setTimeout(() => this.removeMessage(field), fadeOutTime);
  }

  validateControl(fieldObject:FieldObject) {
    let isValid = true,
      field = fieldObject.field;

    if (field.offsetParent === null) // if input is invisible, skip and return true.
      return true;

    if (field.hasAttribute('disabled'))
      return true;


    for (let testObject of fieldObject.testObjects) {

      isValid = !!testObject.test(_getFieldValue(field), field);

      if (typeof isValid === 'undefined') {
        this.removeMessage(field);
        continue;
      }

      if (isValid) {
        this.removeMessage(field);
      } else {
        this.displayMessage(field, testObject.runtimeOptions.message, testObject.args);
        break;
      }
    }

    return isValid;
  }

  /**
   * fire the validate of all form inputs an return if the form is valid.
   * @returns {boolean}
   */
  isValid() {
    let isValid = true;
    [].forEach.call(this.validates, validate => (isValid = isValid && this.validateControl(validate)))
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

//replace(/äëïöü|ÄËÏÖÜ|áéíóú|ÁÉÍÓÚ|ÂÊÎÔÛ|âêîôû|àèìòù|ÀÈÌÒÙ|ãẽĩõũỹ|ÃẼĨÕŨỸ/g, '').split('').join(' ') : '';
