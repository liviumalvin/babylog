
var Connection,
  Dashboard = {},
  RunItems = [];

/**
 * Dashboard.runs
 * @type {{render: Function}}
 */
Dashboard.render = {
  runs: function() {
    React.render(
      <Runs.Items data={RunItems}/>,
      document.getElementById("dashboard.runs")
    );
  }
};

//Init socket connection
Connection = io.connect("http://localhost:25601"); //@todo please take this out to env vars

/**
 * @event connect
 * Triggered whenever the socket connects
 */
Connection.on("connect", function() {});

/**
 * @event run.created
 * Triggers when a new log will be created
 */
Connection.on("run.created", function(run) {
  RunItems.unshift(run);
  Dashboard.render.runs();
});

/**
 * @event run.update
 * Triggers when a new log will be created
 */
Connection.on("run.updated", function(runs) {
  var UpdatedRuns = [];

  RunItems.map(function(item, key) {
    var found = false;
    runs.map(function(run) {
      if (run._id === item._id) {
        found = true;
        UpdatedRuns.push(run);
      }
    });

    if (false === found) {
      UpdatedRuns.push(item);
    }
  });

  RunItems = UpdatedRuns;
  Dashboard.render.runs();
});


