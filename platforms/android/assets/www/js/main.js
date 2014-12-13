require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        jquery: 'libs/jquery',
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min'
    }
});

require([
    'jquery',
    'router'
], function($, router){
    router.on("route", function(route, params) {
        $("#nav-container-collapse").removeClass("in");
    });
});