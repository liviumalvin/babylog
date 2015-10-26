(function() {
  "use strict";

  var Http = {
    express: require("express"),
    instance: null,
    http: require("http")
  };

  /**
   * Check needed dependencies
   */
  Http.checkDependencies = function() {
    this.lib.should.have.property("config");
    this.lib.config.should.have.property("http");
    this.lib.config.http.should.have.property("port");
  };

  /**
   * Initializes the http agent
   * @param lib
   * @returns {*}
   */
  Http.initialize = function(lib) {
    var parser,
      handlebars;

    parser = require("body-parser");
    handlebars = require("express-handlebars");

    this.lib = lib;
    this.instance = this.express();

    this.checkDependencies();

    this.instance.use(parser.json({
      limit: "50mb"
    }));
    this.instance.use(parser.urlencoded({
      limit: "50mb",
      extended: true
    }));

    this.instance.locals = {
      host: this.lib.config.http.wsocket_host
    };

    this.instance.engine("handlebars", handlebars({
      defaultLayout: "base"
    }));
    this.instance.set("view engine", "handlebars");
    this.instance.disable("etag");

    this.lib.winston.debug("Setting static to " + __dirname + "/../../public/");
    this.instance.use("/", this.express.static(__dirname + "/../../public/"));

    return this.instance;
  };

  /**
   * Run task.
   * Create the http server
   * @param lib
   */
  Http.run = function(lib) {
    var server;

    this.checkDependencies();
    this.lib.winston.info("Starting http server on port " + this.lib.config.http.port);

    server = this.http.createServer(this.instance);

    lib.socket = lib.socket(server);
    lib.app.tasks.run("socket.listeners", {
      socketServer: lib.socket
    });
    server.listen(this.lib.config.http.port, function() {
      this.lib.winston.info("Express HTTP server started on : " + this.lib.config.http.port);
    }.bind(this));

  };

  /**
   * Export the module
   * @type {{init: Function, run: Function}}
   */
  module.exports = {
    init: function(lib) {
      return Http.initialize(lib);
    },
    run: function(lib) {
      return Http.run(lib);
    }
  };
}());