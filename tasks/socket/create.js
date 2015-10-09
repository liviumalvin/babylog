(function() {
  "use strict";

  var Socket = {
    io: require("socket.io")
  };



  /**
   * Initializes the socket agent
   * @param lib
   * @returns {*}
   */
  Socket.initialize = function(lib) {
    return this.io;
  };

  /**
   * Export the module
   * @type {{init: Function, run: Function}}
   */
  module.exports = {
    init: function(lib) {
      return Socket.initialize(lib);
    },
    run: function(lib) {}
  };
}());