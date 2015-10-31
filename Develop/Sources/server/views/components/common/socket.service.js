/**
 * Created by hoanglvq on 10/25/15.
 */
angular.module('app')
    .factory('socketService',function($rootScope){
        var socket = io();
        return {
            on: function (eventName, callback){
                socket.on(eventName,function(){
                    var args = arguments;
                    $rootScope.$apply(function(){
                        callback.apply(socket,args);
                    })
                })
            },
            emit: function (eventName,data,callback){
                socket.emit(eventName,data,function(){
                    var args = arguments;
                    $rootScope.$apply(function(){
                        if(callback){
                            callback.apply(socket,args);
                        }
                    })
                })
            },
            /*
                sender: { clientID: ... }
                receiver = 'admin' || 'shipper' || 'store' || {room: ...} || {clientID: ...} || Arrays of these types
                
            */
            sendPacket: function(sender, receiver, msg, eventName, callback) {
                var data = {
                    sender: sender,
                    receiver: receiver,
                    msg: msg
                };
                this.emit(eventName, data, callback);
            }
        }
    })