(function () {
    "use strict";

    var Task = {};


    Task.run = function () {

    };

    Task.init = function (lib) {
        this.lib = lib;
        this.lib.should.have.property("events");
        this.lib.events.on("log", function (request) {
            Task.run(request);
        });
    };

    module.exports = {
        init: function () {},
        run: function () {}
    }
}());