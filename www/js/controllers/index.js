define([
    'jquery',
    'underscore',
    'backbone',
    'models/database',
    'views/index'
], function ($, _, Backbone, Database, IndexView) {

    //var connectedDevices = [];
    var devices = [];
    var view;

    var loop = function(){

        //for(var i=0;i<connectedDevices.length;i++){
        //    bluetoothle.write(function (result) {
        //        console.log(JSON.stringify(result));
        //    }, function (error) {
        //        console.log(JSON.stringify(error));
        //        for(var j=0;j<connectedDevices.length;j++) {
        //            if(connectedDevices[j].address == error.address) {
        //                connectedDevices.splice(j, 1);
        //                break;
        //            }
        //        }
        //
        //        for(var j=0;j<devices.length;j++) {
        //            if(devices[j].address == error.address) {
        //                devices[j].connected = false;
        //                break;
        //            }
        //        }
        //
        //        reconnect(error.address);
        //
        //    }, {
        //        "value": btoa("AT"),
        //        "serviceUuid": "ffe0",
        //        "characteristicUuid": "ffe1",
        //        "type": "noResponse",
        //        "address": connectedDevices[i].address
        //    });
        //}

        //try to connect for not connected devices
        //for(var j=0;j<devices.length;j++){
        //    if(typeof(devices[j].connected) == 'undefined' /*|| devices[j].connected == false*/) {
        //        //connect(devices[j].address);
        //        reconnect(devices[j].address);
        //    }
        //}


        //console.log(JSON.stringify(devices));
        //console.log(JSON.stringify(connectedDevices));

        setTimeout(loop, 5000);
    };

    var reconnect = function(_address){
        console.log("reconnecting...");
        view.setOffline(_address);
        bluetoothle.disconnect(function(result){
            JSON.stringify(result);
            bluetoothle.close(function(result){
                JSON.stringify(result);
                connect(result.address);
            }, function(result){
                JSON.stringify(result);
            }, {address: result.address});
        }, function(result){
            JSON.stringify(result);
        }, {
            address: _address
        });
    };

    var connect = function(_address) {
        bluetoothle.connect(function (result) {
            if (result.status == "connected") {
                bluetoothle.discover(function (result) {
                    if (result.status == "discovered") {
                        bluetoothle.subscribe(function (result) {

                            if (result.status == "subscribed") {
                                for (var j = 0; j < devices.length; j++) {
                                    if (devices[j].address == result.address) {
                                        devices[j].connected = true;
                                    }
                                }

                                view.setOnline(result.address);
                            }

                            /*if (result.status == "subscribedResult") {
                                var value = atob(result.value);
                                var device = Database.getByAddress(result.address);
                                if (device != false) {
                                    if (value.indexOf(device.name) != -1) {
                                        connectedDevices.push(device);
                                        view.setOnline(device.address);
                                        for (var j = 0; j < devices.length; j++) {
                                            if (devices[j].address == result.address) {
                                                devices[j].connected = true;
                                            }
                                        }
                                    }
                                }
                            } else if (result.status == "subscribed") {

                                bluetoothle.write(function (result) {
                                    console.log(JSON.stringify(result));
                                }, function (error) {
                                    console.log(JSON.stringify(error));
                                }, {
                                    "value": btoa("AT+NAME?"),
                                    "serviceUuid": "ffe0",
                                    "characteristicUuid": "ffe1",
                                    "type": "noResponse",
                                    "address": result.address
                                });
                            }*/
                        }, function (error) {
                            console.log(JSON.stringify(error));
                        }, {
                            address: result.address,
                            "serviceUuid": "ffe0",
                            "characteristicUuid": "ffe1",
                            "isNotification": true
                        });
                    }
                }, function(error){
                    console.log(JSON.stringify(error));
                }, {address: result.address});

            }
        }, function (error) {
            console.log(JSON.stringify(error));
            //TODO: fix reconnect on connection error!!!
            reconnect(error.address);
            //connect(error.address);
            //connect(error.address);
        }, {address: _address});
    };

    var init = function () {

        devices = Database.devices;
        view = new IndexView({
            devices: devices
        });

        //connectedDevices = [];


        bluetoothle.initialize(function () {

            for (var i = 0; i < devices.length; i++) {
                bluetoothle.isConnected(function (result) {
                    //console.log(JSON.stringify(result));
                    if (result.error == "neverConnected") {
                        connect(result.address);
                        /*bluetoothle.connect(function (result) {
                            if (result.status == "connected") {
                                bluetoothle.discover(function (result) {
                                    if (result.status == "discovered") {
                                        bluetoothle.subscribe(function (result) {
                                            if (result.status == "subscribedResult") {
                                                var value = atob(result.value);
                                                var device = Database.getByAddress(result.address);
                                                if(device != false) {
                                                    if (value.indexOf(device.name) != -1) {
                                                        connectedDevices.push(device);
                                                        view.setOnline(device);
                                                        for(var j=0;j<devices.length;j++) {
                                                            if(devices[j].address == result.address) {
                                                                devices[j].connected = true;
                                                            }
                                                        }
                                                    }
                                                }
                                            } else if (result.status == "subscribed") {

                                                bluetoothle.write(function (result) {
                                                    console.log(JSON.stringify(result));
                                                }, function (error) {
                                                    console.log(JSON.stringify(error));
                                                }, {
                                                    "value": btoa("AT+NAME?"),
                                                    "serviceUuid": "ffe0",
                                                    "characteristicUuid": "ffe1",
                                                    "type": "noResponse",
                                                    "address": result.address
                                                });
                                            }
                                        }, null, {
                                            address: result.address,
                                            "serviceUuid": "ffe0",
                                            "characteristicUuid": "ffe1",
                                            "isNotification": true
                                        });
                                    }
                                }, function () {
                                }, {address: result.address});
                            }
                        }, function () {
                        }, {address: result.address});*/
                    } else if(result.isConnected) {
                        var device = Database.getByAddress(result.address);
                        //connectedDevices.push(device);
                        view.setOnline(device.address);
                        for(var j=0;j<devices.length;j++) {
                            if(devices[j].address == result.address) {
                                devices[j].connected = true;
                            }
                        }
                    }
                }, {address: devices[i].address});
            }

            view.render();
            $("#container").html(view.$el);
        }, function () {
            view.renderError();
            $("#container").html(view.$el);
        }, {request: true});



    };

    loop();

    return {
        init: init
    };
});