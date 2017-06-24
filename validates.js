/** Validate.js for NextValidate.js
 * Developers: Oscar Sobrevilla with colaboration of Waldo Saccaco and Luis Moreno
 */

const RULES = {};
const GLOBAL_DEFAULT_RULE_OPTIONS = {
  message: 'Valor no valido'
};

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


export default class Validates {
  /**
   * Add new validation rule
   * @param {string} name  - rule name
   * @param {ValidateRuleOptions} options - rule options
   */
  static addRule(name, options) {
    if (typeof name === 'string' || Array.isArray(name) && options) {

      const localOptions = Object.assign({}, GLOBAL_DEFAULT_RULE_OPTIONS, options);

      [].concat(name).forEach((name) => {
        
        RULES[name] = localOptions;

        Validates[name] = (param) => {
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

      return Validates;
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
 *  @memberof Validates
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


Validates.addRule('email', {
    _pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    test (value, el) {
      value = value.trim();
      if (value)
        return this._pattern.test(value);
    },
    message: 'El email no es válido'
  }).addRule('require', REQUIRED_RULE).addRule('required', REQUIRED_RULE).addRule('alpha', {
    pattern: /^[a-zA-Z\s\']+$/,
    test (value, el) {
      return this.pattern.test(value);
    },
    message: 'Solo letras'
  }).addRule('integer', {
    blackList: '\d',
    pattern: /^-?\d+$/,
    test (value, el) {
      value = String(value).trim();
      if (value)
        return this.pattern.test(value);
    },
    message: 'Solo números enteros'
  })
  .addRule(['float', 'decimal'], {
    whiteList: /[\d|.|-]/,
    test (value, el, args) {
      value = value.trim();
      if (value)
        return args.strict ? /^-{0,1}?\d*\.{0,1}\d+$/.test(value) : /^-{0,1}?\d*\.{0,1}?\d+?$/.test(value);
    },
    message (args) {
      return 'Solo números' + (args.strict ? ' con punto decimal' : '');
    }
  }).addRule('date', {
    _pattern: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
    test (value, el) {
      value = value.trim();
      if (value)
        return this._pattern.test(value);
    },
    message: 'Fecha mal formada, por favor usar día/mes/año'
  }).addRule('compare', {
    test (value, el, args) {
      var el = typeof args.value === 'object' ? args.value : document.querySelector(args.value);
      return el.value == value;
    },
    message: 'No coinciden los datos'
  }).addRule('maxlength', {
    test (value, el, args) {
      let max = args.value;
      el.maxLength = max;
      return value.length <= max;
    },
    message: 'Máximo {{value}} caracteres'
  }).addRule('size', {
    test (value, el, args) {
      let size = args.value;
      if (value) {
        el.maxLength = size;
        return value.length == size;
      }
    },
    message: 'Deben ser {{value}} caracteres'
  }).addRule('minlength', {
    test  (value, el, args) {
      value = value.trim();
      if (value)
        return value.length >= args.minlength
      return true
    },
    message: 'mínimo {{value}} caracteres'
  }).addRule('alphanumeric', {
    pattern: /^\w+$/,
    test (value, el) {
      value = value.trim();
      if (value)
        return this.pattern.test(value);
    },
    message: 'Solo números y letras'
  }).addRule('range', {
    pattern: /^-?\d+$/,
    test (value, el, args) {
      value = Number(String(value).trim());
      if (value)
        return value >= args.min && value <= args.max;
    },
    message: 'Solo números entre {{min}} y {{max}}'
  }).addRule('visa', {
    whiteList: /[\d]/,
    total: 16,
    test (value, el, args){
      value = String(value).trim();
      if (value){
        return value.replace(/\D/g, '').length === this.total;
      }
    },
    message (args, field){
      let value = String(field.value).trim();
      value = value.replace(/\D/g, '');
      return `se requieren ${this.total - value.length} dígitos`
    }
  });

global.Validates = Validates;

