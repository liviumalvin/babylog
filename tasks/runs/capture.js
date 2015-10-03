(function () {
    "use strict";

    var Task = {};


    Task.setListeners = function () {
        this.lib.events.on("runs", function (request) {
            this.lib.app.tasks.run("storage.runs." + this.lib.config.storage.driver, {
                request: request
            });
        }.bind(this));
    };

    /**
     * Initialize the capture task
     * @param lib
     * @returns {boolean}
     */
    Task.init = function (lib) {
        this.lib = lib;
        this.lib.should.have.property("events");
        this.lib.should.have.property("config");
        this.lib.config.should.have.property("storage");
        this.lib.config.storage.should.have.property("driver");

        this.lib.winston.debug("Asking for %s driver", this.lib.config.storage.driver);

        try {

            this.adapter = require(
                require('path').dirname(process.argv[1]) +
                '/adaptors/' +
                this.lib.config.storage.driver +
                '.js'
            );

            this.lib.winston.debug("Driver found. Creating a new adapter");
        } catch (e) {
            this.lib.winston.error("Cannot find storage driver : %s", this.lib.config.storage.driver);
            return false;
        }

        this.setListeners();

        //when ready
        this.lib.events.on(this.lib.config.storage.driver + ".ready", function () {
            Task.lib.app.tasks.add("storage.runs." + Task.lib.config.storage.driver);
        });

        //Get adapter
        this.adapter = this.adapter.getAdapter(this.lib.config.storage[this.lib.config.storage.driver], lib);
        this.lib.storage.adapter = this.adapter;

    };

    /**
     * Public by facade
     * @type {{init: Function, run: Function}}
     */
    module.exports = {
        init: function (lib) {
            return Task.init(lib);
        },
        run: function () {}
    }
}());