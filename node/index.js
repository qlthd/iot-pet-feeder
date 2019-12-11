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
});

app.get('/portions', function (req, res) {
  res.render('portionselector.ejs');
});

app.get('/feedscheduler', function (req, res) {
	const schedules = [ {id : 1, day : "15/01/2019", hour : "09:34", portions : "7"} ,
		{ id : 2, day : "15/10/2019", hour : "12:31", portions : "2"}]

	var mqtt = require('mqtt');
	var client  = mqtt.connect('mqtt://192.168.8.108')
	client.on('connect', function () {
		client.subscribe('nbPortions')
	})
	client.on('message', function (topic, message) {
		if(topic == 'schedules/get'){
			context = message.toString();
			console.log(context)
		}
	})



	res.render('feedscheduler.ejs',{schedules : schedules});
});

app.get('/movesensorslog', function (req, res) {
	const movements = [ {day : "15/01/2019", hour : "09:34"} ,
		{day : "15/10/2019", hour : "12:31"}]
	res.render('movesensorslog.ejs',{ movements : movements});
});


app.post('/nbPortions', function(req, res) {
	var nbPortions = req.body.ps
	var mqtt = require('mqtt');
	var client  = mqtt.connect('mqtt://192.168.8.108');



	client.on('connect', function () {
		client.publish('nbPortions',nbPortions);
		console.log('Message Sent');
	

	});

})


app.post('/delete_schedule', function(req, res) {
	var id= req.body.id;
	var mqtt = require('mqtt');
	var client  = mqtt.connect('mqtt://192.168.8.108');

	client.on('connect', function () {
		client.publish('schedules/delete',id);
		console.log('schedules/delete Sent');


	});

})


 let port = 4000
app.listen(port, function () {
  console.log("Petfeeder is accessible at http://localhost:"+port+" !");
});