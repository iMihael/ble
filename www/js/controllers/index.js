define([
    'jquery',
    'underscore',
    'backbone',
    'views/index'
], function($, _, Backbone, IndexView){

    var init = function(){

        //var tplError = _.template(errorHtml);
        //
        //bluetoothle.initialize(function(){
        //
        //    $("#container").html(indexHtml);
        //
        //    $("#do-scan").click(function(){
        //        $("#do-scan").hide();
        //        $("#stop-scan").show();
        //
        //
        //        var tpl = _.template(itemHtml);
        //        $("#devices").empty();
        //
        //        bluetoothle.startScan(function(result){
        //            if(result.status == "scanResult") {
        //                $("#devices").append(tpl({name : result.name}));
        //            }
        //        }, function() {
        //            $("#container").html(tplError({error: "Bluetooth initialize error. Please enable bluetooth and restart the app."}))
        //        }, {});
        //    });
        //
        //}, function(){
        //
        //
        //    $("#container").html(tplError({error: "Bluetooth initialize error. Please enable bluetooth and restart the app."}))
        //
        //}, {request: true});

        var view = new IndexView({
            el: $("#container")
        });
        view.render();

    };

    return {
        init: init
    };
});