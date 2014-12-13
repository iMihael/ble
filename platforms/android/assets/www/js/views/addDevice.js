define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'controllers/device',
    'text!html/addDevice/index.html',
    'text!html/addDevice/item.html',
    'text!html/error.html',
    'models/database',
    'text!html/error.html',
    'text!html/info.html'
], function($, _, Backbone, Router, Device, _index, _item, _error, Database, _error, _info){

    var AddDeviceView = Backbone.View.extend({
        initialize: function(){

        },
        events: {
            "click #do-scan": "startScan",
            "click #stop-scan": "stopScan",
            "click .item": "selectDevice"
        },

        selectDevice: function(e){
            this.stopScan();
            $(e.target).hide();

            var address = $(e.target).data("address");
            var name = $(e.target).html();
            var error = _.template(_error);
            var info = _.template(_info);
            $("#errors").html(info({info: "Connecting to " + name + "..."}));

            bluetoothle.connect(function(result){
                if(result.status == "connected") {
                    bluetoothle.discover(function(result){
                        if(result.status == "discovered") {
                            bluetoothle.subscribe(function(result){
                                if(result.status == "subscribedResult") {
                                    var value = atob(result.value);
                                    if(value.indexOf(name) != -1) {
                                        Database.addDevice(name, address);
                                        console.log("added!");
                                        Router.navigate("index", {trigger: true});
                                        //redirect
                                    }
                                } else if(result.status == "subscribed") {

                                    bluetoothle.write(function(result){
                                        console.log(JSON.stringify(result));
                                    }, function(error){
                                        console.log(JSON.stringify(error));
                                    }, {
                                        "value": btoa("AT+NAME?"),
                                        "serviceUuid": "ffe0",
                                        "characteristicUuid": "ffe1",
                                        "type":"noResponse",
                                        "address": address
                                    });

                                }
                            }, null, {
                                address: address,
                                "serviceUuid": "ffe0",
                                "characteristicUuid": "ffe1",
                                "isNotification" : true
                            });
                        }
                    }, function(error){
                        $("#errors").html(error({error:"Service discovery error. " + JSON.stringify(error)}));
                    }, {address: address});
                }
            },function(error){
                $("#errors").html(error({error:"Connect error. " + JSON.stringify(error)}));
            }, {address: address});

        },

        stopScan: function(){
            $("#stop-scan").hide();
            $("#do-scan").show();

            bluetoothle.stopScan();
        },

        startScan: function(){
            bluetoothle.stopScan();
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
            bluetoothle.stopScan();
            this.$el.html( _index );
        }

    });

    return AddDeviceView;
});