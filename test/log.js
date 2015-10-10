var assert = require("assert");
var config = require("../config/app.json");

describe("A simple", function () {
  var bby
      , app;

  before(function () {
    bby = require("../node_modules/node-babylog/index.js").getNewInstance({
      token: config.token,
      app: "mochatest",
      host: config.host,
      port: config.port
    });
  });

  it("info test", function () {
    bby.info("info-test-log");
    app.echo();
  });
});
