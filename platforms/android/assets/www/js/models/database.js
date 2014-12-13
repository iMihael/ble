define([], function(){
    var ls = window.localStorage;
    var devices = [];

    if(ls.getItem('devices')) {
        devices = JSON.parse(ls.getItem('devices'));
    }

    var flush = function(){
        ls.setItem('devices', JSON.stringify(devices));
    };

    var deleteDevice = function(address) {
        if(devices.length > 0) {
            for (var i = 0; i < devices.length; i++) {
                if (devices[i].address == address) {
                    devices.splice(i, 1);
                    flush();
                    break;
                }
            }
        }
    };

    var addDevice = function(name, address){
        var push = true;

        if(devices.length > 0) {
            for(var i=0;i<devices.length;i++){
                if(devices[i].address == address) {
                    devices[i].name = name;
                    push = false;
                    break;
                }
            }
        }

        if(push) {
            devices.push({
                name: name,
                address: address
            });
        }

        flush();
    };

    var deleteAllDevices = function(){
        devices = [];
        flush();
    };

    return {
        devices: devices,
        addDevice: addDevice,
        deleteDevice: deleteDevice,
        deleteAllDevices: deleteAllDevices
    };

});