define([
    'jquery',
    'backbone'
], function($, Backbone){
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "index",
            "index": "index",
            "start": "start",
            "*_default": "_default"
        },
        start: function(){

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