define([
    'jquery',
    'underscore',
    'backbone',
    'views/device',
    'text!html/error.html'
], function($, _, Backbone, DeviceView, _error){

    var _address = false;
    var _name = false;

    var init = function(address, name){
        _address = address;
        _name = name;
        bluetoothle.currentAddress = address;

        var view = new DeviceView({
            el: $("#container"),
            address: address,
            name: name
        });
        view.render();

        var error = _.template(_error);

        bluetoothle.connect(function(result){
            if(result.status == "connected") {


                bluetoothle.discover(function(result){
                    //$("#device-content").html(error({error:"Service discovery error."}));
                    if(result.status == "discovered") {
                        //$("#device-content").html(JSON.stringify(result));
                        //var $list = $("<ul id=\"device-list\"></ul>");
                        //$("#device-content").append($list);
                        $("#device-list").append("<li>Connected!</li>");
                        /*for(var service in result.services) {
                            $list.append("<li>"+JSON.stringify(result.services[service])+"</li>");
                        }*/


                        bluetoothle.subscribe(function(result){
                            if(result.status == "subscribedResult") {
                                $("#device-list").append("<li>" + atob(result.value) + "</li>");
                            }
                        }, null, {
                            address: _address,
                            "serviceUuid": "ffe0",
                            "characteristicUuid": "ffe1",
                            "isNotification" : true
                        });


                        $("#send").prop("disabled", false);
                        $("#text").prop("disabled", false);


                    }
                }, function(error){
                    $("#device-content").html(error({error:"Service discovery error. " + JSON.stringify(error)}));
                }, {address: address});
            }
        },function(error){
            $("#device-content").html(error({error:"Connect error. " + JSON.stringify(error)}));
        }, {address: address});
    };

    return {
        init: init,
        address: _address,
        name: _name
    }
});