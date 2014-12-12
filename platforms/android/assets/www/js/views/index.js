define([
    'jquery',
    'underscore',
    'backbone',
    'text!html/index.html',
    'text!html/item.html',
    'text!html/error.html'
], function($, _, Backbone, _index, _item, _error){

    var IndexView = Backbone.View.extend({
        initialize: function(){

        },
        events: {
            "click #do-scan": "startScan",
            "click #stop-scan": "stopScan",
            "click .item": "selectDevice"
        },

        selectDevice: function(e){
            bluetoothle.stopScan();

            var address = $(e.target).data("address");
            console.log("connecting: " + address);

            var el = this.$el;
            /*
            bluetoothle.discover(function(result){
                if(result.status == "discovered") {
                    result = JSON.stringify(result);
                    el.html( result );
                    console.log( result );
                }

            }, function(){}, {address: address});
            */
            bluetoothle.connect(function(result){
                console.log(JSON.stringify(result));
            },function(){}, {address: address});
        },

        stopScan: function(){
            $("#stop-scan").hide();
            $("#do-scan").show();

            bluetoothle.stopScan();
        },

        startScan: function(){
            $("#do-scan").hide();
            $("#stop-scan").show();
            var $el = this.$el;

            var item = _.template(_item);
            $("#devices").empty();

            bluetoothle.startScan(function(result){
                if(result.status == "scanResult") {
                    $("#devices").append(item({name : result.name, address: result.address}));
                }
            }, function() {
                $el.html(tplError({error: "Bluetooth initialize error. Please enable bluetooth and restart the app."}))
            }, {});

    },

        render: function(){
            var error = _.template(_error);
            var $el = this.$el;

            bluetoothle.initialize(function(){
                $el.html( _index );
            }, function(){
                $el.html(error({error: "Bluetooth initialize error. Please enable bluetooth and restart the app."}))
            }, {request: true});
        }

    });

    return IndexView;
});