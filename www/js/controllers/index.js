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
    var loopCounter = 0;

    var loop = function(){


        for(var i=0;i<devices.length;i++) {
            if(typeof(devices[i].connected) != 'undefined' && devices[i].connected == true) {

                var value = "AT";
                if(loopCounter % 5 == 0)
                    value = "AT+BATT?";

                bluetoothle.write(function (result) {
                    console.log(JSON.stringify(result));
                    console.log(loopCounter);
                }, function (error) {
                    console.log(JSON.stringify(error));

                    setConnected(error.address, false);

                    bluetoothle.disconnect(function(result){
                        console.log(JSON.stringify(result));
                        if(result.status == "disconnected") {
                            bluetoothle.close(function(result){
                                console.log(JSON.stringify(result));
                                //connect(result.address);
                            }, function(result){
                                console.log(JSON.stringify(result));
                            }, {address: error.address});
                        }
                    }, function(result){
                        console.log(JSON.stringify(result));
                    }, {address: error.address});

                }, {
                    "value": btoa("AT"),
                    "serviceUuid": "ffe0",
                    "characteristicUuid": "ffe1",
                    "type": "noResponse",
                    "address": devices[i].address
                });
            }
        }

        loopCounter++;



        setTimeout(loop, 5000);
    };

    var setConnected = function(_address, value){
        for(var j=0;j<devices.length;j++) {
            if(devices[j].address == _address) {
                devices[j].connected = value;
                break;
            }
        }
    };

    var disconnect = function(_address, callback){
        bluetoothle.disconnect(function(result){
            console.log(JSON.stringify(result));
            if(result.status == "disconnected") {
                bluetoothle.close(function(result){
                    console.log(JSON.stringify(result));
                    callback(result.address);
                }, function(result){
                    console.log(JSON.stringify(result));
                }, {address: result.address});
            }
        }, function(result){
            console.log(JSON.stringify(result));
        }, {address: _address});
    };

    var reconnect = function(_address){
        view.setOffline(_address);
        setConnected(_address, false);

        bluetoothle.isConnected(function (result) {
            console.log(JSON.stringify(result));

            if (result.error == "neverConnected" ) {
                console.log("neverConnected");
                connect(result.address);
            } else if(result.isConnected == true) {
                console.log("isConnected == true!");

                setConnected(result.address, true);
                view.setOnline(result.address);
            }
            else if(result.isConnected == false) {
                console.log("isConnected == false!");

                /*bluetoothle.close(function(result){
                    JSON.stringify(result);
                    connect(result.address);
                }, function(result){
                    JSON.stringify(result);
                }, {address: result.address});*/

                bluetoothle.disconnect(function(result) {
                    bluetoothle.reconnect(function (result) {
                        console.log(JSON.stringify(result));
                        setConnected(result.address, true);
                        view.setOnline(result.address);
                    }, function (result) {
                        console.log(JSON.stringify(result));
                    }, {
                        address: result.address
                    });
                }, function(result){
                    console.log("DISCONNECT ERROR!");
                    console.log(JSON.stringify(result));
                }, {
                    address: result.address
                });

            }
        }, {address:_address});

    };

    var connect = function(_address) {
        bluetoothle.connect(function (result) {
            if (result.status == "connected") {
                bluetoothle.discover(function (result) {
                    if (result.status == "discovered") {
                        bluetoothle.subscribe(function (result) {

                            if (result.status == "subscribed") {

                                setConnected(result.address, true);
                                view.setOnline(result.address);
                            }

                            //TODO: Place logic here



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
            setConnected(error.address, false);
            view.setOffline(error.address);
            //TODO: fix reconnect on connection error!!!

            disconnect(error.address, function(_address){
                connect(_address);
            });
        }, {address: _address});
    };

    var init = function () {

        devices = Database.devices;
        view = new IndexView({
            devices: devices
        });



        bluetoothle.initialize(function () {

            for (var i = 0; i < devices.length; i++) {
                reconnect(devices[i].address);
            }

            view.render();
            $("#container").html(view.$el);
        }, function () {
            view.renderError();
            $("#container").html(view.$el);
        }, {request: true});



    };

    //loop();

    return {
        init: init
    };
});