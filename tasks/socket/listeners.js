(function () {
    "use strict";

    var Socket = {},
        Router = [];

    /**
     * basic socket routes
     */
    Router.push(function (lib, server) {

        server.on("connection", function (client) {

            //Logs
            Socket.lib.events.on("logs.store.finish", function (log) {
                client.emit('log.created', log);
            });

            Socket.lib.events.on("logs.update.finish", function (runs) {
                client.emit('log.updated', runs);
            });

            client.on("logs.get", function (query) {
                Socket.lib.events.once("logs.search", function (logs) {
                    client.emit("logs.search", logs);
                });
                Socket.lib.events.emit("logs.get", query);
            });

            //Runs
            Socket.lib.events.on("runs.store.finish", function (run) {
                client.emit('run.created', run);
            });

            Socket.lib.events.on("runs.update.finish", function (runs) {
                client.emit('run.updated', runs);
            });

            client.on("runs.get", function (query) {
                Socket.lib.events.once("runs.search", function (logs) {
                    client.emit("runs.search", logs);
                });
                Socket.lib.events.emit("runs.get", query);
            });

        });
    });

    /**
     * Initializes the socket agent
     * @param lib
     * @returns {*}
     */
    Socket.initialize = function (lib) {
        this.lib = lib;

        Router.forEach(function (handler) {
            handler(lib, lib.socketServer);
        });
    };

    /**
     * Export the module
     * @type {{init: Function, run: Function}}
     */
    module.exports = {
        run: function (lib) {
            return Socket.initialize(lib);
        }
    };
}());