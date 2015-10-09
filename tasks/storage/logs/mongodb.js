(function() {
  "use strict";

  var Task = {};

  /**
   * Run the storage
   * @param lib
   */
  Task.run = function(lib) {

    Task.lib = lib;

    lib.request.should.have.property("action");
    Task.should.have.property(lib.request.action);
    Task[lib.request.action](lib);
  };

  /**
   * Creates a new LogItem and stores it
   * @param lib
   */
  Task.store = function(lib) {
    var LogItem,
      log;

    //Detach to requested action
    try {
      lib.request.should.have.property("type");
      lib.request.should.have.property("title");
      lib.request.should.have.property("status");
      lib.request.should.have.property("data");
    } catch (error) {
      lib.winston.error("Could not save log: " + error.toString());
      lib.events.emit("logs.store.error", "Invalid request params [app, type, title, status, data]");
      return false;
    }

    LogItem = this.lib.storage.adapter.model("LogItems");

    //Create and save the log item
    log = new LogItem();
    log.status = lib.request.status || false;
    log.title = lib.request.title;
    log.type = lib.request.type || "info";
    log.data = new Buffer(lib.request.data);
    log.date = new Date();
    log.unique = lib.request.unique || Math.random().toString(10);

    if (undefined !== lib.request.run) {
      log.run = lib.request.run;
    }

    log.save(function(error) {
      if (null !== error) {
        lib.winston.error("Could not save log: " + error.toString());
        lib.events.emit("logs.store.error", "An error occured when trying to save the log item");
        return false;
      }
      //Finish
      lib.events.emit("logs.store.finish", log);
    });
  };

  /**
   * Task.update
   * Updates a log item
   *
   * @param lib
   * @returns {boolean}
   */
  Task.update = function(lib) {
    var LogItem,
      LogItemQuery = {};

    //Model
    LogItem = this.lib.storage.adapter.model("LogItems");

    if (undefined !== lib.request.id) {
      LogItemQuery._id = lib.request.id;
    }

    if (undefined !== lib.request.run) {
      LogItemQuery.run = lib.request.run;
    }

    if (undefined !== lib.request.unique) {
      LogItemQuery.unique = lib.request.unique;
    } else {
      try {
        lib.request.should.have.property("title");
        lib.request.should.have.property("app");
      } catch (e) {
        lib.events.emit("logs.update.error", "Invalid update request structure. Needing the unique identifier or [app,title]");
        return false;
      }
      LogItemQuery.title = lib.request.title;
      LogItemQuery.app = lib.request.app;
    }

    //Model update
    LogItem.update(LogItemQuery, lib.request, function(error) {

      if (error) {
        lib.winston.error("Could not save log: " + error.toString());
        lib.events.emit("logs.update.error", "An error occurred when trying to save the log item: " + error.toString());
        return false;
      }

      LogItem.find(LogItemQuery, function(error, items) {

        if (error) {
          lib.events.emit("logs.update.error", "An error occurred when trying to save the log item");
          return false;
        }

        //Finish
        lib.events.emit("logs.update.finish", items);
      });
    });
  };

  /**
   * Creates the log model for mongo
   * @returns {boolean}
   */
  Task.createModel = function() {
    this.lib.winston.debug("Initializing LogItem storage model");

    try {
      this.lib.storage.adapter.model("LogItems", new this.lib.mongoose.Schema({
        title: String,
        status: String,
        date: Date,
        type: String,
        data: String,
        unique: String,
        run: String
      }));
    } catch (e) {
      this.lib.winston.error("Model failed to initialize");
      this.lib.winston.verbose(e.toString());
      return false;
    }

    this.lib.winston.debug("Model initialized.");
    return false;
  };


  Task.find = function(query) {
    var LogItem;

    //Model
    LogItem = this.lib.storage.adapter.model("LogItems");
    LogItem.find(query, function(error, items) {

      if (error) {
        //@todo please do something with the errors for client socket
        return false;
      }

      this.lib.events.emit("logs.search", items);
    }.bind(this));
  };

  /**
   *
   * @param lib
   */
  Task.init = function(lib) {
    this.lib = lib;
    this.createModel();
    this.lib.events.on("logs.get", function(query) {
      Task.find(query);
    });
  };

  /**
   * Public by facade
   * @type {{run: Function, init: Function}}
   */
  module.exports = {
    run: function(lib) {
      Task.run(lib);
    },
    init: function(lib) {
      Task.init(lib);
    }
  };
}());