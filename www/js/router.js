define([
    'jquery',
    'backbone'
], function($, Backbone){
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "index",
            "index": "index",
            "device/:address/:name": "device",
            "addDevice": "addDevice",
            "exit": "exit"
        },
        exit: function(){
            navigator.app.exitApp();
            navigator.device.exitApp();
        },
        addDevice: function(){
            require(['controllers/addDevice'], function(m){
                m.init();
            });
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
        }
    });

    var router = new AppRouter;
    Backbone.history.start({pushState: false, hashChange: true});
    return router;
});