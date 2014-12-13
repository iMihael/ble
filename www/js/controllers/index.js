define([
    'jquery',
    'underscore',
    'backbone',
    'models/database',
    'views/index'
], function ($, _, Backbone, Database, IndexView) {

    var init = function () {

        var devices = Database.devices;
        var view = new IndexView({
            el: $("#container"),
            devices: devices
        });

        var connectedDevices = [];


        bluetoothle.initialize(function () {

            for (var i = 0; i < devices.length; i++) {
                bluetoothle.isConnected(function (result) {
                    console.log(JSON.stringify(result));
                    if (result.error == "neverConnected") {
                        bluetoothle.connect(function (result) {
                            if (result.status == "connected") {
                                bluetoothle.discover(function (result) {
                                    if (result.status == "discovered") {
                                        bluetoothle.subscribe(function (result) {
                                            if (result.status == "subscribedResult") {
                                                var value = atob(result.value);
                                                if (value.indexOf(name) != -1) {
                                                    //Database.addDevice(name, address);
                                                    //Router.navigate("index", {trigger: true});
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
                                        })
                                    }
                                }, function () {
                                }, {address: result.address});
                            }
                        }, function () {
                        }, {address: result.address})
                    }
                }, {address: devices[i].address});
            }

            view.render();
        }, function () {
            view.renderError();
        }, {request: true});
    };

    return {
        init: init
    };
});