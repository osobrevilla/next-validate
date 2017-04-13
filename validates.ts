/** Validate.js for NextValidate.js
 * Developers: Oscar Sobrevilla with colaboration of Waldo Saccaco and Luis Moreno
 */

const RULES = {};
const GLOBAL_DEFAULT_RULE_OPTIONS = {
  message: 'Valor no valido'
};


export interface ValidatesArgs {
  value: string | number;
}

export interface ValidateRuleOptions {
  test: Function;
  pattern?: RegExp,
  message: string;
}

export interface TestObject {
  test: Function;
  name: string,
  args: any,
  localOptions: ValidateRuleOptions
  runtimeOptions: ValidateRuleOptions
}

export interface ValidateRuleOptionsDefault {
  message: string
}


/** Class representing a Validates. */

export class Validates {
  /**
   * Add new validation rule
   */
  static addRule(name: string, options: ValidateRuleOptions) {
    if (options && typeof name === 'string') {

      const localOptions: ValidateRuleOptions = Object.assign({}, GLOBAL_DEFAULT_RULE_OPTIONS, options);
      RULES[name] = localOptions;
      Validates[name] = (param: any) => {
        let args: any = {};
        let type = typeof param;

        if (type === 'string' || type === 'number' || type === 'boolean') {
          args.value = isNaN(param) ? param : Number(param);
        } else if (type === 'object' && !Array.isArray(param) && param) {
          args = param;
        }

        const testObject: TestObject = {
          test: function (value: string | number, el: HTMLFormElement) {
            return this.runtimeOptions.test(value, el, args);
          },
          runtimeOptions: Object.assign({}, options, localOptions, args),
          localOptions: localOptions,
          args: args,
          name: name
        }

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
  static setRuleMessage(name: string, message: string) {
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

/**
 * @type {Object}
 */
const REQUIRED_RULE = {
  test: function (value) {
    return value !== '' && value !== undefined;
  },
  message: 'El campo es requerido'
};

Validates.addRule('email', {
  pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  test: function (value, el) {
    value = value.trim();
    if (value)
      return this.pattern.test(value);
  },
  message: 'El email no es válido'
}).addRule('require', REQUIRED_RULE).addRule('required', REQUIRED_RULE).addRule('alpha', {
  pattern: /^[a-zA-Z\s\']+$/,
  test: function (value, el) {
    return this.pattern.test(value);
  },
  message: 'Solo letras'
}).addRule('integer', {
  pattern: /^-?\d+$/,
  test: function (value, el) {
    value = String(value).trim();
    if (value)
      return this.pattern.test(value);
  },
  message: 'Solo números enteros'
}).addRule('decimal', {
  pattern: /^-?\d*(\.\d+)?$/,
  test: function (value, el) {
    value = value.trim();
    if (value)
      return this.pattern.test(value);
  },
  message: 'Solo números'
}).addRule('date', {
  pattern: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
  test: function (value, el) {
    value = value.trim();
    if (value)
      return this.pattern.test(value);
  },
  message: 'Fecha mal formada, por favor usar día/mes/año'
}).addRule('compare', {
  test: function (value, el, args) {
    var el = typeof args.value === 'object' ? args.value : document.querySelector(args.value);
    return el.value == value;
  },
  message: 'No coinciden los datos'
}).addRule('maxlength', {
  test: function (value, el, args) {
    let max = args.value;
    el.maxLength = max;
    return value.length <= max;
  },
  message: 'Máximo {{0}} caracteres'
}).addRule('size', {
  test: function (value, el, args) {
    let size = args.value;
    if (value) {
      el.maxLength = size;
      return value.length == size;
    }
  },
  message: 'Deben ser {{0}} caracteres'
}).addRule('minlength', {
  test: function (value, el, args) {
    value = value.trim();
    if (value)
      return value.length >= args.minlength
    return true
  },
  message: 'mínimo {{0}} caracteres'
}).addRule('alphanumeric', {
  pattern: /^\w+$/,
  test: function (value, el) {
    value = value.trim();
    if (value)
      return this.pattern.test(value);
  },
  message: 'Solo números y letras'
}).addRule('range', {
  pattern: /^-?\d+$/,
  test: function (value, el, args) {
    value = Number(String(value).trim());
    if (value)
      return value >= args.min && value <= args.max;
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
