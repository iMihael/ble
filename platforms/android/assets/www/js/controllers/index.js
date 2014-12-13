define([
    'jquery',
    'underscore',
    'backbone',
    'views/index'
], function($, _, Backbone, IndexView){

    var init = function(){

        var view = new IndexView({
            el: $("#container")
        });
        view.render();

    };

    return {
        init: init
    };
});