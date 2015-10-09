var Queue;

(function() {

  Queue = function(config) {

    this.storage = [];
    this.buffer = 0; //ms to buffer the execution
    this.isBuffering = false;

    if ("undefined" !== typeof config && "object" === typeof config) {
      for (i_config in config) {
        this[i_config] = config[i_config];
      }
    }
  };

  /**
   * Drains the current queue items
   * @returns {boolean}
   */
  Queue.prototype.drain = function(passthrough) {

    if (true === this.isBuffering && true !== passthrough) {
      return false;
    }

    this.isBuffering = true;
    setTimeout(function() {
      var item;
      if (0 === this.storage.length) {
        this.isBuffering = false;
        return false;
      }
      item = this.storage.shift();

      this.proxy(item.method, item.args, item.buffered);
      this.drain(true);

    }.bind(this), this.buffer);
  };

  /**
   * Pushes an item to the queue
   * @param item
   */
  Queue.prototype.push = function(item) {
    this.storage.push(item);
  };

  /**
   * Proxies a queued item
   * @param method
   * @param args
   * @param buffer
   */
  Queue.prototype.proxy = function(method, args, buffer) {
    if (undefined === buffer) {

      this.push({
        method: method,
        args: args,
        buffered: true
      });

      this.drain();
    } else {
      method.apply(method, args);
    }
  };
}());