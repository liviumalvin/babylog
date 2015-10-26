window.Runs = {};

(function(Runs) {
    "use strict";

    /**
     * Runs.Items
     * Creates the runs items react component
     */
    Runs.Items = React.createClass({
        render: function() {
            var items;

            items = this.props.data
                .map(function (item) {
                    item.date = new Date(item.date);
                    return item;
                })
                .sort(function (left, right) {
                    return right.date - left.date;
                })
                .map(function(item) {
                    return (
                        <Runs.Item data={item} />
                    );
                });

            return (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>STATUS</th>
                            <th>DATE</th>
                            <th>NAME</th>
                            <th>REPORT</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </table>
            );
        }
    });

    /**
     * Runs.Item
     * Creates the component for one run item
     */
    Runs.Item = React.createClass({
        /**
         * Returns the activity status
         * @returns {*}
         */
        getRunningStatus: function() {

            var asyncStatus = {
                "true": <div className="three-quarters-loader">
                            Loading…
                        </div>,
                "false": <span className="glyphicon glyphicon-ok-circle"></span>
            };

            return asyncStatus[this.props.data.running.toString()];
        },
        /**
         * Run result status
         * @returns {*}
         */
        getStatusText: function() {
            var texts = {
                "started": "Started",
                "with_errors": "With errors",
                "finished": "OK"
            };

            return texts[this.props.data.status];
        },
        /**
         * Returns the clock time.
         * @returns {string}
         */
        getClock: function() {
            var time;

            time = this.props.data.date;

            return [
                [
                    time.getFullYear(),
                    time.getMonth(),
                    time.getDate()
                ].join("-"),
                [
                    time.getHours(),
                    time.getMinutes(),
                    time.getSeconds()
                ].join(":")
            ].join(" ");
        },
        /**
         * Log url
         * @returns {string}
         */
        getLogHref: function() {
            return "/dashboard/logs/" + this.props.data.runId;
        },
        /**
         * Render
         * @returns {XML}
         */
        render: function() {

            return (
                <tr>
                    <td>{this.getRunningStatus()}</td>
                    <td>{this.getClock()}</td>
                    <td>{this.props.data.title}</td>
                    <td>{this.getStatusText()}</td>
                    <td>
                        <a className="btn btn-primary btn-sm" href={this.getLogHref()}>View</a>
                    </td>
                </tr>
            );
        }
    });

}(Runs));
