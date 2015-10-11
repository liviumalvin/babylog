window.Logs = {};

(function(Logs) {
  "use strict";

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
        <div className="mdl-cell mdl-cell--12-col">
                    {items}
                </div>

        );
    }
  });


  Logs.Item = React.createClass({

    getClock: function() {
      var time;

      time = new Date(this.props.data.date);

      return [
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        "(" + time.getMilliseconds() + "ms)"
      ].join(":");
    },

    render: function() {

      return (
        <div className='mdl-color--white
                                mdl-log-cell
                                mdl-cell
                                mdl-cell--12-col
                                mdl-grid
                                mdl-shadow--2dp
                                '>
                    <div className="mdl-cell--2-col
                                    mdl-cell--2-col-tablet
                                    mdl-cell--2-col-phone
                                    mdl-typography--text-uppercase
                                    mdl-typography--text-center
                                    mdl-typography--headline-color-contrast
                                    mdl-letter-card
                                    mdl-square-card
                                    "
        data-letter-card={this.props.data.type}
        >

                        {this.props.data.type.substr(0, 1)}

                    </div>
                    <div className="mdl-typography--body-2
                                    mdl-cell--8-col
                                    mdl-cell--6-col-tablet
                                    mdl-cell--6-col-phone
                                    mdl-letter-card
                                    ">
                        {this.props.data.title}
                    </div>
                    <div className="mdl-typography--caption
                                    mdl-cell--2-col
                                    mdl-cell--2-col-tablet
                                    mdl-cell--2-col-phone
                                    mdl-letter-card
                                    flag-greyed
                                    ">
                        {this.getClock()}
                    </div>
                </div>

        );
    }
  });


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
        <div className="mdl-cell mdl-cell--12-col task-container">
                    {items}
                </div>

        );
    }
  });

  Logs.Task = React.createClass({

    getTaskLogsHref: function() {
      return "/dashboard/tasks/log/" + this.props.data._id;
    },

    getTaskAsyncStatus: function() {
      var asyncStatus = {
        "running": <div className="mdl-card__actions">
                            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
                        </div>,
        "finished": <div className="mdl-card__actions mdl-card--border">
                            <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href={this.getTaskLogsHref()}>
                                SEE LOGS
                            </button>
                            <div className="mdl-layout-spacer"></div>
                            <i className="material-icons">done_all</i>

                        </div>
      };
      return asyncStatus[this.props.data.status.toString()];
    },

    getTaskStatusText: function() {
      var asyncStatus = {
        "running": <div className="mdl-cell--12-col
                                        mdl-typography--text-uppercase
                                        mdl-typography--text-center
                                        mdl-typography--body-color-contrast
                                        ">

                                Running

                            </div>,
        "finished": <div className="mdl-cell--12-col
                                        mdl-typography--text-uppercase
                                        mdl-typography--text-center
                                        mdl-typography--body-color-contrast
                                        ">

                                Finished

                            </div>
      };

      return asyncStatus[this.props.data.status.toString()];
    },

    getClock: function() {
      var time;

      time = new Date(this.props.data.date);
      return [
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      ].join(":");
    },
    updateProgressBar: function() {
      var element,
        progressBar;
      element = React.findDOMNode(this);

      //Init material progress bar
      progressBar = element.querySelector(".mdl-progress");
      if (null !== progressBar && null === progressBar.querySelector(".progressbar")) {
        new MaterialProgress(progressBar);
      }
    },
    componentDidMount: function() {
      this.updateProgressBar();
    },
    componentDidUpdate: function() {
      this.updateProgressBar();
    },
    render: function() {

      return (
        <a className="task-card mdl-card mdl-color--contrast mdl-shadow--2dp" href={this.getTaskLogsHref()}>
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

                        <div className="mdl-cell--1-col
                                    mdl-typography--text-uppercase
                                    mdl-typography--text-center
                                    mdl-typography--headline-color-contrast
                                    mdl-letter-card-small
                                    mdl-square-card
                                    "
        data-letter-card={this.props.data.type}
        >

                            {this.props.data.type.substr(0, 1)}

                        </div>

                        {this.getTaskStatusText()}

                    </div>

                    {this.getTaskAsyncStatus()}


                </a>
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
