var express = require('express');
var app = express();
var engine = require('consolidate');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/views'));


var mosca = require('mosca');
	var settings = {
			port:1883
			}

	var server = new mosca.Server(settings);

	server.on('ready', function(){
	console.log("ready");
	});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  res.render('home.ejs');
  console.log('Accueil demandé')
})

app.get('/portions', function (req, res) {
  res.render('portionselector.ejs');
})

app.get('/feedscheduler', function (req, res) {
	var mqtt = require('mqtt');
	var client  = mqtt.connect('mqtt://192.168.8.107')
	client.on('connect', function () {
		client.publish('schedules/get','');
	})

	client.subscribe('schedules/send')

	client.on('message', function (topic, message) {
		if(topic == "schedules/send"){
			const schedules = JSON.parse(message.toString())
			res.render('feedscheduler.ejs',{schedules : schedules});

		}
	})
})

app.get('/movesensorslog', function (req, res) {
	var mqtt = require('mqtt');
	var client  = mqtt.connect('mqtt://192.168.8.107')
	client.on('connect', function () {
		client.publish('sensor/get','');
	})

	client.subscribe('sensor/send')

	client.on('message', function (topic, message) {
		if(topic == "sensor/send"){
			const movements = JSON.parse(message.toString())
			res.render('movesensorslog.ejs',{ movements : movements});
		}
	})

})


app.post('/feed', function(req, res) {
	var nbPortions = req.body.ps
	var mqtt = require('mqtt')
	var client  = mqtt.connect('mqtt://192.168.8.107')
	client.on('connect', function () {
		client.publish('feed',nbPortions)
		console.log(nbPortions + ' portions sent !')
	});
	res.end();
})


app.post('/delete_schedule', function(req, res) {
	var id= req.body.button;
	console.log("id :"+id)
	var mqtt = require('mqtt');
	var client  = mqtt.connect('mqtt://192.168.8.107');

	client.on('connect', function () {
		client.publish('schedules/delete',id.toString());
		console.log('schedules/delete Sent');
	});
	res.redirect('/feedscheduler')


})

app.post('/add_schedule', function(req, res) {
	var date= new Date(req.body.date);
	var day = date.getDate().toString().length > 1 ? date.getDate() : "0"+date.getDate().toString()
	var month = (date.getMonth()+1).toString().length > 1 ? (date.getMonth()+1) : "0"+(date.getMonth()+1)
	var hours = date.getHours().toString().length > 1 ? date.getHours() : "0"+date.getHours().toString()

	var minutes = date.getMinutes().toString().length > 1 ? date.getMinutes() : "0"+date.getMinutes().toString()

	var date2 = day+"/"+month+"/"+date.getFullYear()+" "+hours+":"+minutes

	console.log(date2)
	var portions = req.body.ps;

	var mqtt = require('mqtt');
	var client  = mqtt.connect('mqtt://192.168.8.107');
	var message = date2 + " "+ portions
	client.on('connect', function () {
		client.publish('schedules/add',message);
	});
	res.redirect('/feedscheduler')
})


 let port = 4000
app.listen(port, function () {
  console.log("Petfeeder is accessible at http://localhost:"+port+" !");
});