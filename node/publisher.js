var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.8.108');



	client.on('connect', function () {
	setInterval(function() {
		client.publish('nbPortions',"5");
		console.log('Message Sent');
	}, 1000);

	});
