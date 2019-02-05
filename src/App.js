const http = require("http");
const Request = require("./Request");
const Response = require("./Response");
const Router = require("./Router");

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
   * Constructor.
   */
  constructor() {
    this.request = new Request();
    this.response = new Response();
    this.router = new Router();
    this.routes = {
      get: {},
      post: {},
      put: {},
      delete: {}
    };
  }

  /**
   * Store get routes.
   *
   * @param {string} path
   * @param {callback} callback
   */
  get(path, callback) {
    this.routes.get[path.toString()] = { path, callback };
  }

  /**
   * Store post routes.
   *
   * @param {string} path
   * @param {callback} callback
   */
  post(path, callback) {
    this.routes.post[path.toString()] = { path, callback };
  }

  /**
   * Route executed if no other route is found.
   *
   * @param {string} data
   * @param {callback} callback
   */
  notFound(callback) {
    this.routes.notFound = callback;
  }

  /**
   * The server should respond to all requests with a string.
   *
   * @param {http.IncomingMessage} request
   * @param {http.ServerResponse} response
   */
  handle(request, response) {
    this.request.setRequest(request);
    this.response.setResponse(response);

    this.router.setRequest(this.request);
    this.router.setResponse(this.response);
    this.router.setRoutes(this.routes);

    this.request.getPayload(payload => {
      this.router.dispatch();
    });
  }

  /**
   * Start the server
   */
  listen() {
    const server = http.createServer(this.handle.bind(this));
    server.listen.apply(server, arguments);
  }
}

module.exports = App;
