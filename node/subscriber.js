var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.8.108')
client.on('connect', function () {
    client.subscribe('nbPortions')
})
client.on('message', function (topic, message) {
context = message.toString();
console.log(context+ ' portions asked')
})

