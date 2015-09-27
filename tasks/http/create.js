(function () {
    "use strict";

    var Http = {
        instance : require("express")()
    };

    /**
     * Check needed dependencies
     */
    Http.checkDependencies = function () {
        this.lib.should.have.property("config");
        this.lib.config.should.have.property("http");
        this.lib.config.http.should.have.property("port");
    };

    /**
     * Initializes the http agent
     * @param lib
     * @returns {*}
     */
    Http.initialize = function (lib) {
        var parser;

        parser          = require("body-parser");

        this.lib        = lib;
        this.checkDependencies();

        this.instance.use(parser.json());
        this.instance.use(parser.urlencoded({ extended: true }));

        return this.instance;
    };

    Http.run = function (lib) {

        this.checkDependencies();
        this.lib.winston.info("Starting http server on port " + this.lib.config.http.port);
        this.instance.listen(this.lib.config.http.port);

    };

    /**
     * Export the module
     * @type {{init: Function, run: Function}}
     */
    module.exports = {
        init: function (lib) {
            return Http.initialize(lib);
        },
        run: function (lib) {
            return Http.run();
        }
    };
}());