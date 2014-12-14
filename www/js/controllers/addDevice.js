define([
    'jquery',
    'underscore',
    'backbone',
    'views/addDevice'
], function($, _, Backbone, AddDeviceView){

    var init = function(){

        var view = new AddDeviceView({
            //el: $("#container")
        });
        view.render();
        $("#container").html(view.$el);

    };

    return {
        init: init
    };
});