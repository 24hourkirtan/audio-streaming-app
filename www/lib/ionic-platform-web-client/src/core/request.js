import { Promise } from "./promise";

var request = require("browser-request");

export class Request {
  constructor() {

  }
}

export class Response {
  constructor() {

  }
}

export class APIResponse extends Response {
  constructor() {
    super();
  }
}

export class APIRequest extends Request {
  constructor(options) {
    super();
    var requestInfo = {};
    var p = new Promise(function(resolve, reject) {
      request(options, function(err, response, result) {
        requestInfo._lastError = err;
        requestInfo._lastResponse = response;
        requestInfo._lastResult = result;
        if (err) {
          reject(err);
        } else {
          if (response.statusCode < 200 || response.statusCode >= 400) {
            var _err = new Error("Request Failed with status code of " + response.statusCode);
            reject(_err);
          } else {
            resolve({ 'response': response, 'payload': result });
          }
        }
      });
    });
    p.requestInfo = requestInfo;
    return p;
  }
}
