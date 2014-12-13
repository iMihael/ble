define([
    'jquery',
    'backbone'
], function($, Backbone){
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "index",
            "index": "index",
            "device/:address/:name": "device"
        },
        device: function(address, name){
            require(['controllers/device'], function(m){
                m.init(address, name);
            });
        },
        index: function(){
            require(['controllers/index'], function(m){
                m.init();
            });
        },
        _default: function(route){
            //console.log(route);
            //document.write(route);
        }
    });

    var router = new AppRouter;
    Backbone.history.start({pushState: false, hashChange: true});
    return router;
});