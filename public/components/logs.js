(function () {
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
            <Logs.Items data={Storage}/>,
            document.getElementById('dashboard.logs')
        );
    }

    /**
     * @event runs.search
     * triggered whenever the runs.get is emitted.
     */
    system.socket.on("logs.search", function (items) {
        Storage = [];

        //Logs
        items
            .filter(function (item) {
                return -1 === ['task', 'deploy'].indexOf(item.type);
            })
            .map(function (item) {
                Storage.unshift(item);
            });
       render();
    });


    /**
     * @event log.created
     * Triggers when a new log will be created
     */
    system.socket.on("log.created", function (log) {
        var item;

        item = JSON.parse(JSON.stringify(log));
        CreateQueue.proxy(function (item) {
            if (item.run === run) {
                if (-1 === ['task', 'deploy'].indexOf(item.type)) {
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
    system.socket.on("log.updated", function (logs) {
        var items;

        items = JSON.parse(JSON.stringify(logs));
        UpdateQueue.proxy(function (logs) {
            var UpdatedLogs = [];
            logs.map(function (log) {
                UpdatedLogs = [];

                if (log.run === run) {
                    if (-1 === ['task', 'deploy'].indexOf(log.type)) {
                        Storage.map(function (item) {

                            if (log._id === item._id) {
                                UpdatedLogs.push(log);
                            } else {
                                UpdatedLogs.push(item);
                            }

                        });
                        Storage = UpdatedLogs;
                    }
                }
            });
            render();
        }, [items]);
    });

    console.log("Fetching logs");
    /**
     * emit and fetch the logs
     */
    system.socket.emit("logs.get", {
        run: run
    });
}());