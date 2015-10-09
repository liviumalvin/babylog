(function() {
  "use strict";

  var Storage = [],
    UpdateQueue = new Queue({
      buffer: 150
    }),
    CreateQueue = new Queue({
      buffer: 5
    });

  /**
   * Render
   * renders the logs
   */
  function render() {
    React.render(
      <Logs.Tasks data={Storage}/>,
      document.getElementById("dashboard.tasks")
    );
  }

  /**
   * @event runs.search
   * triggered whenever the runs.get is emitted.
   */
  system.socket.on("logs.search", function(items) {
    Storage = [];

    //Logs
    items
      .filter(function(item) {
        return -1 !== ["task"].indexOf(item.type);
      })
      .map(function(item) {
        Storage.unshift(item);
      });
    render();
  });


  /**
   * @event log.created
   * Triggers when a new log will be created
   */
  system.socket.on("log.created", function(log) {
    var item;

    item = JSON.parse(JSON.stringify(log));
    CreateQueue.proxy(function(item) {
      if (item.run === run) {
        if ("task" === item.type) {
          Storage.unshift(item);
          render();
        }
      }
    }, [item]);
  });

  /**
   * @event log.update
   * Triggers when a new log will be created
   */
  system.socket.on("log.updated", function(logs) {
    var items;

    items = JSON.parse(JSON.stringify(logs));
    UpdateQueue.proxy(function(logs) {
      var UpdatedTasks = [];
      logs.map(function(log) {
        UpdatedTasks = [];

        if (log.run === run) {
          if ("task" === log.type) {
            Storage.map(function(item) {
              if (log._id === item._id) {
                UpdatedTasks.push(log);
              } else {
                UpdatedTasks.push(item);
              }
            });
            Storage = UpdatedTasks;
          }
        }
      });
      render();
    }, [items]);
  });


}());