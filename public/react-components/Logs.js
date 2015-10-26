window.Logs = {};

(function(Logs) {
    "use strict";

    /**
     * Logs.Items
     * Creates the react component for log items container
     */
    Logs.Items = React.createClass({
        render: function() {
            var items;

            items = this.props.data
                .map(function(item) {
                    return (
                        <Logs.Item data={item} />
                    );
                });

            return (
                <table className="table table-hover">
                    <tbody>
                        {items}
                    </tbody>
                </table>
            );
        }
    });

    /**
     * Logs.Item
     * Creates the react component for a log item.
     */
    Logs.Item = React.createClass({

        /**
         * Returns the date and time
         * @returns {string}
         */
        getClock: function() {
            var time;

            time = new Date(this.props.data.date);

            return [
                time.getHours(),
                time.getMinutes(),
                time.getSeconds(),
                time.getMilliseconds()
            ].join(":");
        },

        /**
         * Renders the component
         * @returns {XML}
         */
        render: function() {

            return (
                <tr>
                    <td className="lettercard" width="40">
                        <div data-letter-card={this.props.data.type}>
                            {this.props.data.type.substr(0, 1)}
                        </div>
                    </td>
                    <td >{this.props.data.title}</td>
                    <td>{this.getClock()}</td>
                </tr>

            );
        }
    });

    /**
     * Logs.Tasks
     * React component for tasks container
     */
    Logs.Tasks = React.createClass({
        render: function() {
            var items;

            items = this.props.data
                .map(function(item) {
                    return (
                        <Logs.Task data={item} />
                    );
                });

            return (
                <table className="table table-hover">
                    <tbody>
                        {items}
                    </tbody>
                </table>

            );
        }
    });

    /**
     * Logs.Task
     * Create the react task component
     */
    Logs.Task = React.createClass({
        getTaskLogsHref: function() {
            return "/dashboard/tasks/log/" + this.props.data._id;
        },
        getTaskAsyncStatus: function() {
            var asyncStatus = {
                "running": <div className="three-quarters-loader">
                                Loading…
                            </div>,
                "finished": <span className="glyphicon glyphicon-ok-circle"></span>
            };

            return asyncStatus[this.props.data.status.toString()];
        },
        getTaskStatusText: function() {
            var asyncStatus = {
                "running": "Running",
                "finished": "Finished"
            };

            return asyncStatus[this.props.data.status.toString()];
        },
        getClock: function() {
            var time;

            time = new Date(this.props.data.date);
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
        render: function() {

            return (
                <tr>
                    <td>{this.getTaskAsyncStatus()}</td>
                    <td>{this.props.data.title}</td>
                    <td>{this.getTaskStatusText()}</td>
                    <td>{this.getClock()}</td>
                    <td>
                        <a href={this.getTaskLogsHref()} className="btn btn-default btn-sm">View log</a>
                    </td>
                </tr>
            );
        }
    });

    /**
     * TaskLog
     * Renders on the task log page
     */
    Logs.TaskLog = React.createClass({
        getHtml: function() {
            return {
                "__html": this.props.data.data.replace(/\\r\\n/g, "<br />")
            };
        },
        render: function() {
            return (
                <div dangerouslySetInnerHTML={this.getHtml()}></div>
            );
        }
    });

}(Logs));
