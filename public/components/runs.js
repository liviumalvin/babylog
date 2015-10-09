(function () {
    "use strict";
    var Storage = [];

    /**
     * Render
     * renders the runs
     */
    function render() {
        React.render(
            <Runs.Items data={Storage}/>,
            document.getElementById('dashboard.runs')
        );
    }

    /**
     * @event runs.search
     * triggered whenever the runs.get is emitted.
     */
    system.socket.on("runs.search", function (items) {
        Storage = [];

        //Runs
        items
            .map(function (item) {
                Storage.unshift(item);
            });

        render();
    });

    /**
     * @event run.created
     * Triggers when a new log will be created
     */
    system.socket.on("run.created", function (run) {
        Storage.unshift(run);
        render();
    });

    /**
     * @event run.update
     * Triggers when a new log will be created
     */
    system.socket.on("run.updated", function (runs) {
        var UpdatedRuns = [];

        Storage.map(function (item, key) {
            var found = false;

            runs.map(function (run) {
                if (run._id === item._id) {
                    found = true;
                    UpdatedRuns.push(run);
                }
            });

            if (false === found) {
                UpdatedRuns.push(item);
            }
        });

        Storage = UpdatedRuns;
        render();
    });

    console.log("Fetching runs");
    /**
     * emit and fetch the runs
     */
    system.socket.emit("runs.get", {
        //some future query data?
    });
}());