/**
 * window.system
 * @type {{}}
 */
window.system = {};

/**
 * Bootstrap stuff
 */
(function(facade) {
  "use strict";

  //Init socket connection
  //host is being set in the html template with credentials coming from the backend config file.
  facade.socket = io.connect(host);
}(system));