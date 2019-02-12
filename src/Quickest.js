"use strict";

const http = require("http");
const Router = require("./Router");
const Request = require("./Request");
const Response = require("./Response");

/**
 * Quickest
 *
 * @author     Jonatan Flores <jonatafloress@gmail.com>
 * @copyright  2019 Jonatan Flores
 * @version    1.0.0
 *
 * MIT LICENSE
 */
class Quickest {
  /**
   * Constructor.
   */
  constructor() {
    this.request = new Request();
    this.response = new Response();
    this.router = new Router();
    this.addedExceptions = [];
    this.notFoundModified = false;

    return this.__call();
  }

  /**
   * Start the server
   */
  listen() {
    const server = http.createServer(this.run.bind(this));
    server.listen.apply(server, arguments);
  }

  /**
   * The server should respond to all requests with a string.
   *
   * @param {http.IncomingMessage} request
   * @param {http.ServerResponse} response
   */
  run(request, response) {
    this.request.setRequest(request);
    this.response.setResponse(response);

    this.router.setRequest(this.request);
    this.router.setResponse(this.response);

    if (this.router.dispatch()) {
      this.router.execute();
    } else {
      if (typeof this.notFoundModified === "function") {
        this.notFoundModified(this.request, this.response);
      } else {
        this.notFoundDefault(this.request, this.response);
      }
    }
  }

  /**
   * Default not found page
   */
  notFound(callback) {
    if (typeof callback === "function") {
      this.notFoundModified = callback;
    }
  }

  /**
   * Default not found page
   */
  notFoundDefault(req, res) {
    const page = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Page Not Found</title>
      </head>
      <body>
          <h1>Page Not Found</h1>
      </body>
      </html>
    `;
    return res.status(404).send(page.replace(/^\s+|\s+$/gm, ""));
  }

  /**
   * This function is called whenever any property on the Proxy
   * is called.
   *
   * @param target the "parent" object; the object the proxy virtualizes
   * @param method the property called on the Proxy
   */
  _factoryMethods(target, method) {
    // This will return the property on the "parent" object
    if (typeof target[method] !== "undefined") return target[method];

    // Custom logic for generating methods for requests
    const methodUpper = method.toUpperCase();
    const accepted = this.router.getRequestAccepted();

    if (accepted.indexOf(methodUpper) > -1) {
      return function() {
        let path = arguments[0] || undefined;
        let callable = arguments[1] || undefined;
        let conditions = [];

        if (arguments.length === 3) {
          conditions = arguments[2];
        } else if (arguments.length === 2) {
          conditions = [];
        }

        if (arguments[0] === "/[:options]") {
          this.addedExceptions["Exception"] = "Invalid /[:options] pattern";
        } else {
          // TODO: validate the callable
          return this.router.route(methodUpper, path, callable, conditions);
        }
      };
    } else if ($method === "group" && arguments.length === 2) {
      return function() {
        let path = arguments[0] || undefined;
        let callable = arguments[1] || undefined;

        // TODO: validate the callable
        return this.router.group(path, callable);
      };
    } else {
      this.addedExceptions["Exception"] = `${method} was not implemented`;
    }
  }

  /**
   * Return as a proxy with this object as its target.
   */
  __call() {
    let handler = {
      get: this._factoryMethods.bind(this)
    };

    return new Proxy(this, handler);
  }
}

module.exports = Quickest;
