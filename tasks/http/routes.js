(function () {
    "use strict";

    var Router = [],
        duckTypeHttpRequest;


    //=========== ROUTES==============

    Router.push({
        route: "/dashboard",
        type: "get",
        handler: function (lib, request, response) {
            response.render('dashboard/runs', {});
        }
    });

    Router.push({
        route: "/dashboard/logs/:run",
        type: "get",
        handler: function (lib, request, response) {
            response.render('dashboard/logs', {
                run: request.params.run
            });
        }
    });

    Router.push({
        route: "/dashboard/tasks/log/:taskid",
        type: "get",
        handler: function (lib, request, response) {
            response.render('dashboard/tasks/log', {
                taskId: request.params.taskid
            });
        }
    });

    /**
     * @route /log
     */
    Router.push({
        route: "/api/:item/:action",
        type: "post",
        handler: function (lib, request, response) {

            request.query = request.body;
            response.setHeader("Content-type", "application/json");
            request.query.action = request.params.action;

            try {
                request.query.should.have.property("token");
            } catch (e) {
                response.write(JSON.stringify({
                    error: 1,
                    message: "Invalid request params [token]"
                }));
                response.end();
                return false;
            }

            try {
                request.query.token.should.equal(lib.config.token);
            } catch (e) {
                response.write(JSON.stringify({
                    error: 1,
                    message: "Authentication failed."
                }));
                response.end();
                return false;
            }

            /**
             * @event action.finish
             */
            lib.events.once([request.params.item,request.params.action].join('.') + ".finish", function (data) {
                response.write(JSON.stringify({
                    error: 0,
                    data: data
                }));
                response.end();
            });

            /**
             * @event action.error
             */
            lib.events.once([request.params.item,request.params.action].join('.') + ".error", function (message) {
                response.write(JSON.stringify({
                    error: 1,
                    message: message
                }));
                response.end();
            });

            //Start log
            lib.events.emit(request.params.item, request.query);
        }
    });

    //Inject lib into private context by duck typing
    duckTypeHttpRequest  = function (lib, handler) {
        return function (request, response) {
            handler(lib,request, response);
        }
    };

    /**
     * Public by facade
     * @param lib
     */
    module.exports.run = function (lib) {

        lib.should.have.property('http');
        lib.should.have.property('events');

        Router.forEach(function (routeObject) {
            lib.http.should.have.property(routeObject.type);
            lib.http[routeObject.type](routeObject.route, duckTypeHttpRequest(lib, routeObject.handler));
        });
    }

}());