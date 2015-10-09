(function() {
  "use strict";
  var Driver = {};

  /**
   * Create a mongodb connection
   *
   * @param facade
   * @param config
   * @param lib
   * @returns {Mongoose|Promise|*}
   */
  Driver.getAdapter = function(config, lib) {
    var signature,
      opts,
      connection;

    signature = "mongodb://" + config.host + ":" + config.port + "/" + config.database;
    opts = config.options || {};

    this.lib = lib;
    this.connector = this.lib.mongoose;

    this.lib.winston.debug("Connecting to %s", signature);

    connection = this.connector.connect(signature, opts, function(error) {
      if (error) {
        this.lib.winston.error("Cannot connect using the specified credentials. Please verify app.json config params");
        this.lib.winston.error(error.toString());
        this.lib.storage.canStore = false;
        return false;
      }

      this.lib.storage.canStore = true;

      this.lib.winston.debug("Connected to MongoDb/%s", config.database);
      this.lib.events.emit("mongodb.ready", {});

    }.bind(this));
    return connection;
  };

  /**
   * Public by facade
   * @type {{create: Function, update: Function, read: Function, remove: Function, search: Function}}
   */
  module.exports = {
    getAdapter: function(config, lib) {
      return Driver.getAdapter(config, lib);
    }
  };

}());