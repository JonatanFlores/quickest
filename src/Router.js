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
   * Set routes responsable for handling requests & responses.
   *
   * @param {Object} routes
   */
  setRoutes(routes) {
    this.routes = routes;
  }

  /**
   * Dispatch the router.
   */
  dispatch() {
    // Check if there is a request method and the
    // request method is implemented
    if (typeof this.request.method !== "undefined") {
      const method = this.request.method;
      const path = this.request.path;
      let route = this.routes.notFound;

      // Construct the data object to send to the route
      const data = {
        path: this.request.path,
        query: this.request.query,
        method: this.request.method,
        headers: this.request.headers,
        payload: this.request.payload
      };

      // Choose the route this request should respond.
      // If one is not found, use the notFound route
      if (
        typeof this.routes[method] !== "undefined" &&
        typeof this.routes[method][path] !== "undefined"
      ) {
        route = this.routes[method][path]["callback"];
      }

      // Route the request to route specified in the router
      route(data, (statusCode, payload) => {
        // Use the status code called back by the route, or default to 200
        statusCode = typeof statusCode === "number" ? statusCode : 200;

        // Use the payload called back by the route, or default to an empty object
        payload = typeof payload === "object" ? payload : {};

        // Convert the payload to a string
        const payloadStr = JSON.stringify(payload);

        // Return the response
        this.response.http.setHeader("Content-Type", "application/json");
        this.response.http.writeHead(statusCode);
        this.response.http.end(payloadStr);

        // Log the request path
        console.log("Returning this response: ", statusCode, payloadStr);
      });
    }
  }
}

module.exports = Router;
