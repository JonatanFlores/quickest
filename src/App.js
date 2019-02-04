// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

/**
 * App
 *
 * @author     Jonatan Flores <jonatafloress@gmail.com>
 * @copyright  2019 Jonatan Flores
 * @version    1.0.0
 *
 * MIT LICENSE
 */
class App {
  /**
   * Constructor
   */
  constructor() {
    // The server should respond to all requests with a string
    this.server = http.createServer((request, response) => {
      this.request = request;
      this.response = response;
      this.url = this.getURL();
      this.path = this.getPath();
      this.queryString = this.getQueryString();
      this.method = this.getMethod();
      this.headers = this.getHeaders();
      this.payload = this.getPayload(payload => {
        // Send a response
        this.response.end("Hello World\n");

        // Log the request path
        console.log("Request received with this payload ", payload);
      });
    });
  }

  /**
   * Get the URL and parse it
   *
   * @return {Url}
   */
  getURL() {
    return url.parse(this.request.url, true);
  }

  /**
   * Get the path
   *
   * @return {String}
   */
  getPath() {
    return this.url.pathname.replace(/^\/+|\/+$/g, "");
  }

  /**
   * Get the query string as an object
   *
   * @return {Object}
   */
  getQueryString() {
    return this.url.query;
  }

  /**
   * Get the HTTP method
   *
   * @return {String}
   */
  getMethod() {
    return this.request.method.toLowerCase();
  }

  /**
   * Get the headers as an object
   *
   * @return {Object}
   */
  getHeaders() {
    return this.request.headers;
  }

  /**
   * Get the payload, if any
   *
   */
  getPayload(callback) {
    let decoder = new StringDecoder("utf-8");
    let buffer = "";

    this.request.on("data", data => {
      buffer += decoder.write(data);
    });

    this.request.on("end", () => {
      buffer += decoder.end();
      callback(buffer);
    });
  }

  /**
   * Start the server
   *
   * @param {Number} port
   * @param {Function} callback
   */
  listen(port, callback) {
    this.server.listen(port, callback);
  }
}

module.exports = App;
