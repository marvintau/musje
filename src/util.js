'use strict';

var defineProperty = Object.defineProperty;
var util = {};

function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

/**
 * Utility method, for each object key.
 * @function util.objEach
 * @param {Object} obj - The object to be iterated.
 * @param {musje~objEachCallback} callback - The callback for each iteration.
 */
var objEach =
util.objEach = function (obj, callback) {
  if (isObject(obj)) {
    Object.keys(obj).forEach(function (key) {
      callback(obj[key], key);
    });
  }
};

/**
 * A callback that will be called for each iteration in {@link musje.objEach}.
 * @callback musje~objEachCallback
 * @param {*} value - Value of the current property.
 * @param {string} key - Key of the current property.
 */

/**
 * Utility method, extend `obj` with `ext`.
 * @function
 * @param {Object} obj - target object to be extended.
 * @param {Object} ext - the extension object.
 * @return {Object} The target object.
 */
util.extend = function(obj, ext) {
  objEach(ext, function (val, key) { obj[key] = val; });
  return obj;
};

/**
 * Utility method, checking if `a` and `b` is close *enongh*.
 * Useful to simulate the floating number equality check.
 * @function
 * @param {number} a - a number.
 * @param {number} b - another number.
 * @return {boolean} Wether `a` and `b` is close.
 */
util.near = function (a, b) {
  return Math.abs(a - b) < 0.00001;
};


/**
 * Define ES5 getter/setter properties
 * @param {Object} obj - The object to be defined.
 * @param {Object} props - ES5 getter/setter properties.
 * For example:
 * ```
 * {
 *   name: {
 *     get: function () {...},
 *     set: function () {...}
 *   },
 *   age: {
 *      get:...
 *   }
 * }
 * ```
 */
util.defineProperties = function (obj, props) {
  objEach(props, function (value, prop) {
    var
      type = typeof value,
      descriptor;

    // Accessor property.
    if (type === 'object' && (typeof value.get === 'function' ||
                              typeof value.set === 'function')) {
      descriptor = value;

    // Function
    } else if (type === 'function' || prop === '$type') {
      descriptor = { value: value };

    } else {
      descriptor = {
        value: value,
        writable: true,
        enumerable: true
      };
    }

    defineProperty(obj, prop, descriptor);
  });
};

util.toJSONWithDefault = true;

util.makeToJSON = function (values, elName) {
  return function () {
    if (this.isEmpty) { return; }

    var
      that = this,
      result = {};

    objEach(values, function (defaultValue, prop) {
      if (util.toJSONWithDefault || that[prop] !== defaultValue) {
        result[prop] = that[prop];
      }
    });
    if (!elName) { return result; }

    var res = {};
    res[elName] = result;
    return res;
  };
};

module.exports = util;
