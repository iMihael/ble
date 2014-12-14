define([
    'jquery',
    'underscore',
    'backbone',
    'text!html/index/index.html',
    'text!html/index/no-devices.html',
    'text!html/index/item.html',
    'text!html/error.html'
], function($, _, Backbone, _index, _no_devices, _item, _error){
    var IndexView = Backbone.View.extend({
        initialize: function(params){
            this.devices = params.devices;
        },
        events: {

        },
        renderError: function(){
            var error = _.template(_error);
            this.$el.html(error({error: "Bluetooth initialize error. Please enable bluetooth and restart the app."}))
        },
        setOffline: function(_address){
            $.each(this.$el.find(".item"), function(i, o){
                if($(o).data("address") == _address) {
                    $(o).find(".status").removeClass("online").addClass("offline");
                }
            });
        },
        setOnline: function(_address){
            $.each(this.$el.find(".item"), function(i, o){
                if($(o).data("address") == _address) {
                    $(o).find(".status").removeClass("offline").addClass("online");
                }
            });
        },
        render: function(){
            if(this.devices.length == 0){
                this.$el.html(_no_devices);
            } else {
                this.$el.html(_index);
                var item = _.template(_item);
                for(var i=0;i<this.devices.length;i++) {
                    this.$el.find("#devices").append(item({
                        name: this.devices[i].name,
                        address: this.devices[i].address
                    }));
                }
            }
        }
    });

    return IndexView;
});