
var Connection,
    Dashboard = {},
    LogItems = [],
    LogTasks = [],
    LogDeploys = [];

/**
 * Dashboard.logs
 * @type {{render: Function}}
 */
Dashboard.render = {
    logs: function () {
        React.render(
            <Logs.Items data={LogItems}/>,
            document.getElementById('dashboard.logs')
        );
    },
    tasks: function () {
        React.render(
            <Logs.Tasks data={LogTasks}/>,
            document.getElementById('dashboard.tasks')
        );
    },
    deploys: function() {
        /*React.render(
            <Logs.Items data={LogDeploys}/>,
            document.getElementById('dashboard')
        );*/
    }
};



/**
 * @event connect
 * Triggered whenever the socket connects
 */
Connection.on("connect", function () {

    Connection.on("logs.search", function (items) {
        LogItems = [];
        LogTasks = [];
        LogDeploys = [];


        if ("undefined" !== typeof taskId) {
            items.map(function (item) {

                React.render(
                    <Logs.TaskLog data={item}/>,
                    document.getElementById('dashboard')
                );

            });
            return false;
        }

        //Logs
        items
            .filter(function (item) {
                return -1 === ['task', 'deploy'].indexOf(item.type);
            })
            .map(function (item) {
                LogItems.unshift(item);
            });
        Dashboard.render.logs();

        //Tasks
        items
            .filter(function (item) {
                return -1 !== ['task'].indexOf(item.type);
            })
            .map(function (item) {
                LogTasks.unshift(item);
            });
        Dashboard.render.tasks();

        //Deploys
        items
            .filter(function (item) {
                return -1 !== ['deploy'].indexOf(item.type);
            })
            .map(function (item) {
                LogDeploys.unshift(item);
            });
        Dashboard.render.deploys();



    });
    var criteria = {};

    if ("undefined" !== typeof taskId) {
        criteria["_id"] = taskId;
    } else {
        criteria["run"] = run;
    }

    Connection.emit("logs.get", criteria);
});

/**
 * @event log.created
 * Triggers when a new log will be created
 */
Connection.on("log.created", function (log) {

    if (log.run === run) {

        if (-1 === ['task', 'deploy'].indexOf(log.type)) {
            LogItems.unshift(log);
            Dashboard.render.logs();
        }

        if ("task" === log.type) {
            LogTasks.unshift(log);
            Dashboard.render.tasks();
        }

        if ("deploy" === log.type) {
            LogDeploys.unshift(log);
            Dashboard.render.deploys();
        }
    }
});

/**
 * @event run.update
 * Triggers when a new log will be created
 */
Connection.on("log.updated", function (logs) {

    var UpdatedLogs = [],
        UpdatedTasks = [],
        UpdatedDeploys = [];

    logs.map(function (log) {

        UpdatedLogs = [];
        UpdatedTasks = [];
        UpdatedDeploys = [];

        if ("undefined" !== typeof taskId) {
            if (log._id === taskId) {
                React.render(
                    <Logs.TaskLog data={log}/>,
                    document.getElementById('dashboard')
                );
            }
            return false;
        }

        if (log.run === run) {

            if (-1 === ['task', 'deploy'].indexOf(log.type)) {

                LogItems.map(function (item) {
                    if (log._id === item._id) {
                        UpdatedLogs.push(log);
                    } else {
                        UpdatedLogs.push(item);
                    }
                });

                LogItems = UpdatedLogs;

            }

            if ("task" === log.type) {
                LogTasks.map(function (item) {
                    if (log._id === item._id) {
                        UpdatedTasks.push(log);
                    } else {
                        UpdatedTasks.push(item);
                    }
                });

                LogTasks = UpdatedTasks;

            }

            if ("deploy" === log.type) {
                LogDeploys.map(function (item) {
                    if (log._id === item._id) {
                        UpdatedDeploys.push(log);
                    } else {
                        UpdatedDeploys.push(item);
                    }
                });

                LogDeploys = UpdatedDeploys;
            }
        }
    });

    Dashboard.render.logs();
    Dashboard.render.tasks();
    Dashboard.render.deploys();

});


