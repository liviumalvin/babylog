window.Runs = {};

(function (Runs) {
    "use strict";




    Runs.Items = React.createClass({
        render: function() {
            var items;

            items = this.props.data
                .map(function (item) {
                    return (
                        <Runs.Item data={item} />
                    );
                });

            return (
                <div className="mdl-cell mdl-cell--12-col task-container">
                    {items}
                </div>

            );
        }
    });

    Runs.Item = React.createClass({

        getRunningStatus: function () {
            var asyncStatus = {
                "true" : <div className="mdl-card__actions">
                            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
                        </div>,
                "false": <div className="mdl-card__actions mdl-card--border">
                            <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                View
                            </button>
                            <div className="mdl-layout-spacer"></div>
                            <i className="material-icons">done_all</i>
                        </div>,
            };

            return asyncStatus[this.props.data.running.toString()];
        },
        getStatusText: function () {
            var texts = {
                    "started" : "Started",
                    "with_errors": "With errors",
                    "finished": "OK"
                };

            return texts[this.props.data.status];
        },
        getRunStatus: function () {
            var asyncStatus = {
                "true": <div className="mdl-cell--12-col
                                        mdl-typography--text-uppercase
                                        mdl-typography--text-center
                                        mdl-typography--body-color-contrast
                                        ">

                            {this.getStatusText()}
                        </div>,
                "false": <div className="mdl-cell--12-col
                                        mdl-typography--text-uppercase
                                        mdl-typography--text-center
                                        mdl-typography--body-color-contrast
                                        ">

                            {this.getStatusText()}
                        </div>
            };
            return asyncStatus[this.props.data.running.toString()];
        },
        updateProgressBar: function (element) {
            var progressBar;

            progressBar = element.querySelector(".mdl-progress");
            if (null !== progressBar && null === progressBar.querySelector(".progressbar")) {
                new MaterialProgress(progressBar);
            }
        },
        componentDidMount: function () {
            var element = React.findDOMNode(this);
            this.updateProgressBar(element);
        },
        componentDidUpdate: function () {
            var element = React.findDOMNode(this);
            this.updateProgressBar(element);
        },
        getClock: function () {
            var time;

            time = new Date(this.props.data.date);

            return [
                time.getHours(),
                time.getMinutes(),
                time.getSeconds()
            ].join(":")
        },



        getLogHref: function () {
            return "/dashboard/logs/" + this.props.data._id;
        },

        render: function() {

            return (
                <a className="task-card mdl-card mdl-color--contrast mdl-shadow--2dp" href={this.getLogHref()}>

                    <div className="mdl-card__title
                                    mdl-card--expand
                                    mdl-grid">

                        <div className="mdl-cell--10-col">
                            <span className="mdl-typography--menu-color-contrast mdl-typography--text-uppercase ">
                                {this.props.data.title}
                            </span>
                            <br />
                            <span className="mdl-typography--caption mdl-typography--text-uppercase ">{this.getClock()}</span>

                        </div>
                        {this.getRunStatus()}
                    </div>
                    {this.getRunningStatus()}
                </a>
            );
        }
    });

}(Runs));
