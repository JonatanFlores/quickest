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
    this.url = this.getURL();
    this.path = this.getPath();
    this.method = this.getMethod();
    this.headers = this.getHeaders();
    this.payload = {};
  }

  /**
   * Get the URL and parse it.
   *
   * @return {Url}
   */
  getURL() {
    return url.parse(this.http.url, true);
  }

  /**
   * Get the path.
   *
   * @return {String}
   */
  getPath() {
    return this.url.pathname.replace(/^\/+|\/+$/g, "");
  }

  /**
   * Get the query string as an object.
   *
   * @return {Object}
   */
  getQueryString() {
    return this.url.query;
  }

  /**
   * Get the HTTP method.
   *
   * @return {String}
   */
  getMethod() {
    return this.http.method.toLowerCase();
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
   * Get the payload, if any.
   *
   * @param {callback} callback
   */
  getPayload(callback) {
    let decoder = new StringDecoder("utf-8");
    let buffer = "";

    this.http.on("data", data => {
      buffer += decoder.write(data);
    });

    this.http.on("end", () => {
      buffer += decoder.end();
      this.payload = buffer;
      callback(buffer);
    });
  }
}

module.exports = Request;
