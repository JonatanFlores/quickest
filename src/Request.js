"use strict";

const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

/**
 * Request
 *
 * @author     Jonatan Flores <jonatafloress@gmail.com>
 * @copyright  2019 Jonatan Flores
 * @version    1.0.0
 *
 * MIT LICENSE
 */
class Request {
  /**
   * Set the server request.
   *
   * @param {http.IncomingMessage} request
   */
  setRequest(request) {
    this.http = request;
    this.method = this.getMethod();
    this.headers = this.getHeaders();
    this.url = this.getRequestUri();
    this.query = this.getQueryString();
    this.params = {};
    this.body = "";
  }

  /**
   * Parameters on the request uri matched by the route
   *
   * @param {Object} params
   */
  setParams(params) {
    this.params = params;
  }

  /**
   * Return the current method or default to GET
   */
  getMethod() {
    const method = this.http.method || "GET";
    return method.toUpperCase();
  }

  /**
   * Get the headers as an object.
   *
   * @return {Object}
   */
  getHeaders() {
    return this.http.headers;
  }

  /**
   * Return the current request uri
   *
   * @return {string}
   */
  getRequestUri() {
    return this.http.url;
  }

  /**
   * Return the query string part of the requested uri as an object.
   *
   * @return {Object}
   */
  getQueryString() {
    return url.parse(this.http.url, true).query;
  }

  /**
   * Executes the request
   *
   * @param {callback} callback
   */
  execute(callback) {
    // Object for decoding the data stream
    const decoder = new StringDecoder("utf-8");

    // Listen for data sent by the client
    this.http.on("data", data => {
      this.body += decoder.write(data);
    });

    // Check the completiong of the request
    this.http.on("end", () => {
      this.body += decoder.end();

      if (typeof callback === "function") {
        callback();
      }
    });
  }
}

module.exports = Request;
