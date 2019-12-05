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


app.post('/nbPortions', function(req, res) {
	var nbPortions = req.body.ps
	var mqtt = require('mqtt');
	var client  = mqtt.connect('mqtt://192.168.8.108');



	client.on('connect', function () {
		client.publish('nbPortions',nbPortions);
		console.log('Message Sent');
	

	});

})


 let port = 4000
app.listen(port, function () {
  console.log("Petfeeder is accessible at http://localhost:"+port+" !");
});