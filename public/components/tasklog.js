(function() {
  "use strict";

  var TaskItem = {},
    Task = taskId,
    UpdateQueue = new Queue({
      buffer: 150
    });

  /**
   * Render
   * renders the logs
   */
  function render() {
    React.render(
      <Logs.TaskLog data={TaskItem}/>,
      document.getElementById("dashboard")
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
      .map(function(item) {
        TaskItem = item;
      });
    render();
  });

  /**
   * @event log.update
   * Triggers when a new log will be created
   */
  system.socket.on("log.updated", function(logs) {
    var items;

    items = JSON.parse(JSON.stringify(logs));
    UpdateQueue.proxy(function(logs) {
      logs.map(function(log) {
        if (log._id === Task) {
          TaskItem = log;
          render();
        }
      });
    }, [items]);
  });

  /**
   * emit and fetch the logs
   */
  system.socket.emit("logs.get", {
    "_id": Task
  });
}());