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
   * Creates a new RunItem and stores it
   * @param lib
   */
  Task.store = function(lib) {
    var RunItem,
      run;

    //Detach to requested action
    try {
      lib.request.should.have.property("app");
      lib.request.should.have.property("title");
      lib.request.should.have.property("running");
      lib.request.should.have.property("status");
    } catch (e) {
      lib.winston.error("Could not save log: " + e.toString());
      lib.events.emit("runs.store.error", "Invalid request params [app, type, title, async, data]");
      return false;
    }

    RunItem = this.lib.storage.adapter.model("RunItems");

    //Create and save the log item
    run = new RunItem();
    run.app = lib.request.app;
    run.title = lib.request.title;
    run.running = lib.request.running || true;
    run.status = lib.request.status || "ok";
    run.runId = lib.request.runId || "";
    run.date = new Date();

    run.save(function(error) {
      if (null !== error) {
        lib.winston.error("Could not save log: " + error.toString());
        lib.events.emit("runs.store.error", "An error occurred when trying to save the log item");
        return false;
      }

      //Finish
      lib.events.emit("runs.store.finish", run);
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
    var RunItem,
      RunItemQuery = {};

    //Model
    RunItem = this.lib.storage.adapter.model("RunItems");

    try {
      lib.request.should.have.property("runId");
    } catch (e) {
      lib.events.emit("runs.update.error", "Invalid update request structure. Needing the run ObjectId or a temp ID");
      return false;
    }
    RunItemQuery.runId = lib.request.runId;

    //Model update
    RunItem.update(RunItemQuery, lib.request, function(error) {

      if (error) {
        lib.winston.error("Could not save log: " + error.toString());
        lib.events.emit("runs.update.error", "An error occurred when trying to save the log item");
        return false;
      }

      RunItem.find(RunItemQuery, function(error, items) {

        if (error) {
          lib.events.emit("logs.update.error", "An error occurred when trying to save the run item");
          return false;
        }

        //Finish
        lib.events.emit("runs.update.finish", items);
      });


    });
  };

  /**
   * Creates the log model for mongo
   * @returns {boolean}
   */
  Task.createModel = function() {
    this.lib.winston.debug("Initializing RunsItem storage model");
    try {
      this.lib.storage.adapter.model("RunItems", new this.lib.mongoose.Schema({
        app: String,
        title: String,
        running: Boolean,
        date: Date,
        status: String,
        runId: String
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
    var RunItem;

    //Model
    RunItem = this.lib.storage.adapter.model("RunItems");
    RunItem.find(query, function(error, items) {

      if (error) {
        //@todo please do something with the errors for client socket
        return false;
      }

      this.lib.events.emit("runs.search", items);
    }.bind(this));
  };

  /**
   *
   * @param lib
   */
  Task.init = function(lib) {
    this.lib = lib;
    this.createModel();
    this.lib.events.on("runs.get", function(query) {
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