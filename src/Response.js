"use strict";

/**
 * Response
 *
 * @author     Jonatan Flores <jonatafloress@gmail.com>
 * @copyright  2019 Jonatan Flores
 * @version    1.0.0
 *
 * MIT LICENSE
 */
class Response {
  /**
   * Set the server response.
   *
   * @param {http.ServerResponse} response
   */
  setResponse(response) {
    this.http = response;
  }

  /**
   * Set custom header to send back.
   *
   * @param {string} type
   * @param {mixed} value
   */
  setHeader(type, value) {
    this.http.setHeader(type, value);
    return this;
  }

  /**
   * Set the http response code of the request.
   *
   * @param {Number} httpCode
   * @return {Response}
   */
  status(httpCode) {
    this.http.writeHead(httpCode);
    return this;
  }

  /**
   * Send back the body of the request.
   *
   * @param {string} body
   * @return {Response}
   */
  send(body) {
    this.http.end(body);
    return this;
  }
}

module.exports = Response;
