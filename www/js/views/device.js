define([
    'jquery',
    'underscore',
    'backbone',
    'text!html/device/index.html'
], function($, _, Backbone, _index){

    var DeviceView = Backbone.View.extend({
        initialize: function(params){
            console.log("device view init");

            this.address = params.address;
            this.name = params.name;
        },
        events: {
            "click #send": "send"
        },

        send: function() {
            var text = btoa( $("#text").val() );
            $("#text").val("");
            $("#send").blur();

            bluetoothle.write(function(result){
                console.log(JSON.stringify(result));
            }, function(error){
                console.log(JSON.stringify(error));
            }, {
                "value": text,
                "serviceUuid": "ffe0",
                "characteristicUuid": "ffe1",
                "type":"noResponse",
                "address": this.address
            });
        },
        render: function(){
            var tpl = _.template(_index);
            this.$el.html(tpl({name: this.name}));
        }

    });

    return DeviceView;
});