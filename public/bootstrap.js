/**
 * window.system
 * @type {{}}
 */
window.system = {};

/**
 * Bootstrap stuff
 */
(function (facade) {
    "use strict";

    //Init socket connection
    facade.socket = io.connect(host);
}(system));