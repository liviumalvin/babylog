(function () {
    "use strict";

    var Router = [],
        duckTypeHttpRequest;


    //=========== ROUTES==============


    /**
     * @route /log
     */
    Router.push({
        route: "/log",
        type: "get",
        handler: function (lib, request, response) {


            try {
                request.query.token.should.equal(lib.config.token);
                response.write("Authenticated");
            } catch (e) {
                response.write("Authentication failed.");
            }

            try {
                request.query.should.have.property("token");
                request.query.should.have.property("app");
                request.query.should.have.property("type");
                request.query.should.have.property("title");
                request.query.should.have.property("async");
                request.query.should.have.property("data");
            } catch (e) {
                response.write("Invalid request params [token,app,type,title,async,data]");
            }

            lib.events.emit('log', request.query);

            response.end();
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