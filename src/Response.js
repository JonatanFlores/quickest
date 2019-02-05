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
}

module.exports = Response;
