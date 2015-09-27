(function () {
    var App,
        Events;

    //Tasker
    App = require("./tasker.js");

    //Events
    Events = require("events");


    //Share-able resources
    App.shareResource('winston', require("winston"));
    App.shareResource('config', require("./config/app.json"));

    App.shareResource("events", Events);
    App.shareResource("http", App.tasks.add("http.create"));


    //Tasks
    App.tasks.add("logger.capture");

    App.tasks.run("http.routes");
    App.tasks.run("http.create");


}());