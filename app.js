(function () {
    var App,
        Events,
        Winston,
        Config,
        Storage,
        Mongoose;

    //Tasker
    App = require("./tasker.js");

    //Events
    Events = require("events");

    Events = new Events.EventEmitter();
    Events.setMaxListeners(1000);

    //Config
    if ("docker" === process.env.NODE_ENV) {
        Config = require("./config/docker.json");
    } else {
        Config = require("./config/app.json");
    }

    //Winston
    Winston = require("winston");
    Winston.level = Config.log_level;

    //Storage
    Storage = {};

    //Mongoose
    Mongoose = require("mongoose");

    //Share-able resources
    App.shareResource('app', App);
    App.shareResource('mongoose', Mongoose);
    App.shareResource('config', Config);
    App.shareResource("events", Events);
    App.shareResource("winston", Winston);
    App.shareResource("storage", Storage);
    App.shareResource("socket", App.tasks.add("socket.create"));
    App.shareResource("http", App.tasks.add("http.create"));

    App.tasks.add("logger.capture");
    App.tasks.add("runs.capture");

    App.tasks.run("http.routes");
    App.tasks.run("http.create");


}());