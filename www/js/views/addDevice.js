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
    'text!html/info.html',
    'text!html/addDevice/connecting.html',
], function($, _, Backbone, Router, Device, _index, _item, _error, Database, _error, _info, _connecting){

    var devices;

    var AddDeviceView = Backbone.View.extend({
        initialize: function(){
            devices = [];
        },
        events: {
            "click #do-scan": "startScan",
            "click #stop-scan": "stopScan",
            "click .item": "selectDevice",
            "click .cancel": "cancelConnection"
        },

        cancelConnection: function(e){
            var address = $(e.target).data("address");
            $(e.target).parent().hide();
            bluetoothle.disconnect(function(result){
                bluetoothle.close(null, null, {address: result.address});
            }, null, {address: address});
        },

        setConnected: function(_address, name) {
            $.each($("#errors").find("button"), function(i, o) {
                if($(o).data("address") == _address) {
                    $(o).parent().removeClass("btn-info").addClass("btn-success");
                    $(o).parent().html("Successfully connected to &laquo;" + name + "&raquo;");
                }
            });
        },

        selectDevice: function(e){
            this.stopScan();
            $(e.target).hide();

            var address = $(e.target).data("address");
            var name = $(e.target).html();
            var error = _.template(_error);
            var info = _.template(_info);
            var connecting = _.template(_connecting);
            var thisView = this;

            $("#errors").append(info({info: connecting({name: name, address: address})}));

            bluetoothle.connect(function(result){
                if(result.status == "connected") {
                    bluetoothle.discover(function(result){
                        if(result.status == "discovered") {
                            bluetoothle.subscribe(function(result){
                                if(result.status == "subscribedResult") {
                                    //console.log(JSON.stringify(result));
                                    var value = atob(result.value);
                                    //console.log(value);
                                    //if(value.indexOf(name) != -1) {
                                    //    Database.addDevice(name, address);
                                    //    Router.navigate("index", {trigger: true});
                                    //}
                                    if(value.indexOf("+NAME") != -1) {
                                        var name = value.substr(value.indexOf(":") + 1);
                                        //console.log(name.trim());
                                        Database.addDevice(name, address);
                                        thisView.setConnected(address, name);
                                        //Router.navigate("index", {trigger: true});
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
            devices = [];
            bluetoothle.stopScan();
            $("#do-scan").hide();
            $("#stop-scan").show();
            var $el = this.$el;

            var item = _.template(_item);
            $("#devices").empty();

            bluetoothle.startScan(function(result){
                if(result.status == "scanResult") {

                    var toAdd = true;

                    for(var i=0;i<devices.length;i++) {
                        if(devices[i].address == result.address) {
                            toAdd = false;
                            break;
                        }
                    }

                    if(toAdd) {
                        $("#devices").append(item({name: result.name, address: result.address}));
                        devices.push({
                            address: result.address,
                            name: result.name
                        });
                    }

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