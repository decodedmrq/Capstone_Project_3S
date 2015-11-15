




var gmapUtil = require('./googlemapUtil');
var config   = require('../config/config');

module.exports = function(socket, io) {
	io.addToRoom(socket, 'store');

    socket.on('disconnect', function() {
        console.log('Store', socket.id, 'disconnect');        
    });

    socket.on('store:find:shipper', function(data) {

        var numShippers = io.getAllShippers();
        //numShippers.push({
        //    'shipperID': 'SPSP11',
        //    'latitude': '21212',
        //    'longitude': '1230',
        //    'isConnected': true,
        //    'numTasks': '0'
        //});
        //console.log("TEST", numShippers);
        console.log('store:find:shipper', numShippers, data.msg.store);
        if(numShippers.length != 0){
            gmapUtil.getClosestShippers(data.msg.store, numShippers, config.filter)
                .then(function(results) {
                    console.log('closest shippers', results);
                    if(results.length == 0){
                        console.log("--CASE: NO SHIPPER IN FILTER--");
                        io.reply(
                            data.sender,
                            {
                                shipper: false
                            },
                            'store:find:shipper');
                    }else{
                        results.forEach(function(e) {
                            io.forward(
                                data.sender,
                                {
                                    type: 'shipper',
                                    clientID: e.shipperID
                                },
                                {
                                    distanceText: e.distanceText,
                                    durationText: e.durationText
                                },
                                'shipper:choose:express');
                        });
                    }
                }).catch(function(error){
                    console.log("--CASE: FILTER ERROR. NO SHIPPER IN FILTER--");
                    io.reply(
                        data.sender,
                        {
                            shipper: false
                        },
                        'store:find:shipper'
                    );
                })
        }else{
            console.log("--CASE: NO SHIPPER IN IO LIST--");
            io.reply(
                data.sender,
                {
                    shipper: false
                },
                'store:find:shipper');
        }
    });

    socket.on('store:choose:shipper', function(data) {
        console.log('choose shipper', data);
        var sender = data.sender;
        var receiver = data.receiver;
        var msg = data.msg;

        io.addOrder(msg.orderID, msg.store.storeID, msg.shipper.shipperID);
        io.updateOrderOfShipper(msg.shipper.shipperID, msg.orderID);
        io.updateOrderOfStore(msg.store.storeID, msg.orderID);
        io.addCustomer(msg.customer);

        io.forward(data.sender, data.receiver, data.msg, 'shipper:add:order');
        io.forward(data.sender, 'admin', data.msg, 'admin:add:order');

        io.addToRoom(socket, msg.shipper.shipperID);    

        console.log('total data:shippers', io.shippers);    
        console.log('total data:stores', io.stores);    
        console.log('total data:customers', io.customers);    
        console.log('total data:orders', io.orders);            
    });
}