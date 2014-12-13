define([
    'jquery',
    'underscore',
    'backbone',
    'models/database',
    'views/index'
], function($, _, Backbone,  Database, IndexView){

    var init = function(){

        var devices = Database.devices;
        var view = new IndexView({
            el: $("#container"),
            devices: devices
        });


        bluetoothle.initialize(function() {

            for (var i = 0; i < devices.length; i++) {
                bluetoothle.isConnected(function (result) {
                    console.log(JSON.stringify(result));
                }, {address: devices[i].address});
            }

            view.render();
        }, function(){
            view.renderError();
        }, {request: true});
    };

    return {
        init: init
    };
});