var ip = require('ip')

function initServer() {
    var mosca = require('mosca');
    var settings = {
        port: 1883
    }

    var server = new mosca.Server(settings);

    server.on('ready', function () {
        console.log("ready");
    });
}

function getSchedules (resolve, reject) {
    return new Promise((resolve,reject) =>{
        const mqtt = require('mqtt');
        const client  = mqtt.connect('mqtt://'+ip.address())
        client.on('connect', function () {
            client.publish('schedules/get','');
        })

        client.subscribe('schedules/send')
        client.on('message', function (topic, message) {
            if(topic === "schedules/send") {
                const schedules = JSON.parse(message.toString())
                resolve(schedules);
            }

        })})
}

function getSensors (resolve, reject) {
    return new Promise((resolve,reject) => {
        var mqtt = require('mqtt');
        //var client  = mqtt.connect('mqtt://192.168.8.107')
        var client  = mqtt.connect('mqtt://'+ip.address())
        client.on('connect', function () {
            client.publish('sensor/get','');
        })

        client.subscribe('sensor/send')


        client.on('message', function (topic, message) {
            if(topic == "sensor/send"){
                const movements = JSON.parse(message.toString())
                resolve(movements)
            }
        })
    })
}


function sendPortions(req,res){
    return new Promise((resolve,reject) => {
    var nbPortions = req.body.ps
    var mqtt = require('mqtt')
    //var client  = mqtt.connect('mqtt://192.168.8.107')
    var client  = mqtt.connect('mqtt://'+ip.address())
    client.on('connect', function () {
        client.publish('feed',nbPortions)
        console.log(nbPortions + ' portions sent !')
    });

})}

function addSchedule(req,res){
    return new Promise((resolve,reject) => {
        var date= new Date(req.body.date);
        var day = date.getDate().toString().length > 1 ? date.getDate() : "0"+date.getDate().toString()
        var month = (date.getMonth()+1).toString().length > 1 ? (date.getMonth()+1) : "0"+(date.getMonth()+1)
        var hours = date.getHours().toString().length > 1 ? date.getHours() : "0"+date.getHours().toString()
        var minutes = date.getMinutes().toString().length > 1 ? date.getMinutes() : "0"+date.getMinutes().toString()
        var date2 = day+"/"+month+"/"+date.getFullYear()+" "+hours+":"+minutes
        var portions = req.body.ps;
        var mqtt = require('mqtt');
        var client  = mqtt.connect('mqtt://'+ip.address())
        var message = date2 + " "+ portions
        client.on('connect', function () {
            client.publish('schedules/add',message);
        });

    })}

function removeSchedule(req,res){
    return new Promise((resolve,reject) => {
        var id= req.body.button;
        console.log("id :"+id)
        var mqtt = require('mqtt');
        //var client  = mqtt.connect('mqtt://192.168.8.107');
        var client  = mqtt.connect('mqtt://'+ip.address())
        client.on('connect', function () {
            client.publish('schedules/delete',id.toString());
        });

    })}

module.exports = {
    initServer,
    sendPortions,
    getSensors,
    getSchedules,
    addSchedule,
    removeSchedule
}