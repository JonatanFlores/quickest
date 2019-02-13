"use strict";

/**
 * Route
 *
 * @author     Jonatan Flores <jonatafloress@gmail.com>
 * @copyright  2019 Jonatan Flores
 * @version    1.0.0
 *
 * MIT LICENSE
 */
class Route {
  /**
   * Constructor.
   *
   * @param {string} pattern
   * @param {Function} callable
   * @param {Object} conditions
   */
  constructor(pattern, callable, conditions) {
    this.pattern = pattern;
    this.callable = callable;
    this.conditions = conditions;

    // Initialize properties
    this.name = null;
    this.params = {};
    this.middlewares = [];
    this.groupPrefix = null;
    this.options = [];
  }

  /**
   * Set the group prefix of a routes collection
   *
   * @param {string} prefix
   */
  setGroupPrefix(prefix) {
    this.groupPrefix = prefix;
  }

  /**
   * Geth the group prefix of a routes collection
   *
   * @return {string}
   */
  getGroupPrefix() {
    return this.groupPrefix;
  }

  /**
   * Return the patterns of this route
   *
   * @return {string}
   */
  getPattern() {
    return this.pattern;
  }

  /**
   * Return the callable of the current route
   *
   * @return {Function}
   */
  getCallable() {
    return this.callable;
  }

  /**
   * Return the parameters found on this route
   *
   * @return {Object}
   */
  getParams() {
    return this.params;
  }

  getParamNames() {
    return this.pattern.match(/:([\w]+)/g);
  }

  /**
   * Check if the route pattern matches with the described
   * pattern in the application url, and keep the matched
   * parameters under its repectives
   * - case it exists
   * - regarding restrictions
   *
   * @param {string} resourceUri
   * @return {boolean}
   */
  match(resourceUri) {
    const paramNames = this.getParamNames();
    const pattern = this.getPattern();

    if (pattern.match(/\[:options\]/)) {
      // TODO: implement how to deal with the :options pattern
    } else {
      let converter = this._convertToRegex.bind(this);
      let patternAsRegex = this.pattern.replace(/:[\w]+/g, converter);

      if (this.pattern.substr(-1) === "/") {
        patternAsRegex = patternAsRegex + "?";
      }

      patternAsRegex = new RegExp("^" + patternAsRegex + "$");
      const paramValues = resourceUri.match(patternAsRegex);

      if (paramValues) {
        paramValues.shift();
        delete paramValues.index;
        delete paramValues.input;

        if (paramValues.length > 0) {
          for (let index = 0; index < paramValues.length; index++) {
            let value = paramNames[index];
            this.params[value.substr(1)] = paramValues[index];
          }
        }

        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Convert a variable regex. Example :id could become
   * ([a-zA-Z0-9_\-\.]+) or could become ([\d]{1,8})
   * case it's found such restriction
   * in this.conditions
   *
   * @param {string} matches
   */
  _convertToRegex(matches) {
    const key = matches.replace(":", "");
    if (typeof this.conditions[key] !== "undefined") {
      return new RegExp(`(${this.conditions[key]})`);
    } else {
      // prettier-ignore
      return "([a-zA-Z0-9_\\-\\.]+)";
    }
  }
}

module.exports = Route;
