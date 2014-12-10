/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event

    doLog: function(message) {
        $("#list").append("<li>"+message+"</li>");
    },

    receivedEvent: function(id) {

        app.doLog(typeof(bluetoothle));
        bluetoothle.initialize(function(){
            app.doLog("init success");

            bluetoothle.startScan(function(result){
                app.doLog("scan success");

                app.doLog("status: " + result.status);
                if(result.status == "scanResult") {
                    app.doLog("find device: " + result.name);
                    if(result.name == "VeraOne") {
                        bluetoothle.stopScan();

                        bluetoothle.connect(function(connectResult){
                            app.doLog("connect success");
                            app.doLog("status: " + connectResult.status);

                            if(connectResult.status == "connected") {
                                bluetoothle.discover(function(discoverResult){
                                    app.doLog("discover success");
                                    app.doLog("status: " + discoverResult.status);

                                    if(discoverResult.status == "discovered") {
                                        //app.doLog( discoverResult.services.toSource() );
                                        app.doLog( JSON.stringify(discoverResult.services, null, 4) )
                                    }

                                }, function(){
                                    app.doLog("discover error");
                                }, {
                                    address: result.address
                                });
                            }
                        }, function(){
                            app.doLog("connect error");
                        }, {
                            "address": result.address
                        });
                    }
                }

            }, function(){
                app.doLog("scan error");
            }, {});

        }, function(){
            app.doLog("init error");
        }, {request: true});
    }
};
