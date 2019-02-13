"use strict";

const Route = require("./Route");

/**
 * Router
 *
 * @author     Jonatan Flores <jonatafloress@gmail.com>
 * @copyright  2019 Jonatan Flores
 * @version    1.0.0
 *
 * MIT LICENSE
 */
class Router {
  /**
   * Constructor.
   */
  constructor() {
    this.routes = {
      GET: [],
      POST: [],
      PUT: [],
      DELETE: []
    };

    // Initialize properties
    this.routePrefix = null;
    this.routeNames = [];
    this.lastRouteMethod = null;
    this.canditateRoutes = [];
    this.matchedRoute = {};
    this.middlewares = [];
    this.groupMiddlewares = [];
    this.currentGroup = null;
  }

  /**
   * Set the server request.
   *
   * @param {http.IncomingMessage} request
   */
  setRequest(request) {
    this.request = request;
  }

  /**
   * Set the server response.
   *
   * @param {http.ServerResponse} response
   */
  setResponse(response) {
    this.response = response;
  }

  /**
   * Defines a route under a method creating its representation on Route object
   *
   * @param {string} method
   * @param {string} pattern
   * @param {Function} callable
   * @param {null|Array} conditions
   * @param {mixed} middlewares
   */
  route(method, pattern, callable, conditions, middlewares) {
    // reset currentGroups so future routes won't inherit middlewares from them
    this.currentGroup = null;

    let methodUpper = method.toUpperCase();
    let validPattern = this._validatePath(pattern);

    // Check if the route has a prefix
    if (typeof this.routePrefix === "string" && this.routePrefix.length > 0) {
      validPattern = this.routePrefix + pattern;
    }

    // Generate a route taking in consideration the prefix
    let routeObject = new Route(
      validPattern,
      callable,
      conditions,
      middlewares
    );

    // Set the group prefix to the `Route` object
    if (typeof this.routePrefix === "string" && this.routePrefix.length > 0) {
      routeObject.setGroupPrefix(this.routePrefix);
    }

    // Attach the route object to routes array
    this.routes[method].push(routeObject);
    this.lastRouteMethod = methodUpper;
    return this;
  }

  /**
   * Return a collection of Route objects
   *
   * @return {Array}
   */
  getRoutes() {
    return this.routes;
  }

  /**
   * Defines the prefix in which the routes will be grouped by
   *
   * @param {string} prefix
   * @param {Function} callback
   */
  group(prefix, callback) {
    this.routePrefix = prefix;

    if (typeof callback === "function") {
      callback();
    } else {
      throw new Error("group MUST have a function callback");
    }

    this.routePrefix = null;
    this.groupMiddlewares[prefix] = [];
    this.currentGroup = prefix;

    return this;
  }

  /**
   * Return an array with the request types accepted by the routing system
   *
   * @return {Array}
   */
  getRequestAccepted() {
    return Object.keys(this.routes);
  }

  /**
   * Using the current request method, navigate through given routes.
   * And finds the route which matches with the current RequestUri
   * pattern. Store it into an array of candidates routes.
   *
   * @return {boolean}
   */
  dispatch() {
    // Get the current requested uri
    const requestUri = this._validatePath(this.request.getRequestUri());

    // Loop through all the routes defined
    for (const route of this.routes[this.request.getMethod()]) {
      // Check if the given request maches with the some route
      if (route.match(requestUri)) {
        this.canditateRoutes.push(route);
      }
    }

    if (this.canditateRoutes.length > 0) {
      this.dispatchCanditateRoutes(requestUri);
      return true;
    }

    return false;
  }

  /**
   * Return what isn't variable from a given pattern, e.g.: /post/:slug
   * On this case :slug is a variable, so it will return "post"
   *
   * @param {string} $pattern
   */
  getNonVariables(pattern) {
    const parts = pattern.split("/").filter(item => item.length > 0);
    const noneVars = [];

    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].match(/^[\:]/i)) {
        noneVars[i] = parts[i];
      }
    }

    return noneVars;
  }

  dispatchCanditateRoutes(requestUri) {
    const splitUri = requestUri.split("/").filter(item => item.length > 0);
    const similar = [];

    if (this.canditateRoutes.length > 1) {
      // TODO: deal with :OPTIONS pattern
    }

    for (let n = 0; n < this.canditateRoutes.length; n++) {
      const route = this.canditateRoutes[n];
      const pattern = route.getPattern();
      // TODO: deal with :OPTIONS pattern

      const noneVars = this.getNonVariables(pattern);

      for (let i = 0; i < noneVars.length; i++) {
        const uriPart = noneVars[i];

        if (typeof similar[n] === "undefined") {
          similar[n] = 0;
        }

        if (typeof splitUri[i] !== "undefined" && splitUri[i] === uriPart) {
          similar[n] += 1;
        }
      }
    }

    // Calculate the probable route
    const bigger = Math.max.apply(null, this._arrayValues(similar));
    const mostSimilar = similar.indexOf(bigger);
    this.matchedRoute = this.canditateRoutes[mostSimilar];
    this.canditateRoutes = [];
  }

  /**
   * Return the route that coincided with the current RequestUri
   *
   * @return {Route}
   */
  getMatchedRoute() {
    return this.matchedRoute;
  }

  /**
   * Execute the callable of the route that coincided with the
   * current request passing as last parameter a container
   * object, just in case it's necessary.
   *
   * @param {callback} callback
   */
  execute(callback) {
    const route = this.getMatchedRoute();
    const callable = route.getCallable();
    const params = route.getParams();
    const stack = [];

    // Route Middlewares
    if (typeof route.middlewares !== "undefined") {
      for (let middleware of route.middlewares) {
        stack.push(middleware);
      }
    }

    // Push the actual request to
    // and of the stack
    stack.push(callable);

    this.request.execute(() => {
      // Set the parameters sent on the request
      this.request.setParams(params);

      for (let fn of stack) {
        if (typeof fn === "function") {
          // Call function defined on one of the handler
          // (get,post,put,delete...) or a middleware
          fn(this.request, this.response);
        }
      }
    });
  }

  /**
   * Validates the route paths, taking out the last slash in case
   * it exists to avoid conflict on the dispatch
   *
   * @param {string} path
   */
  _validatePath(path) {
    return path.replace(/\/+$/g, "");
  }

  /**
   * Get the values of an array, similar to PHP function array_values
   *
   * @param {Array} input
   */
  _arrayValues(input) {
    var tmpArr = [];
    var key = "";

    for (key in input) {
      tmpArr[tmpArr.length] = input[key];
    }

    return tmpArr;
  }
}

module.exports = Router;
