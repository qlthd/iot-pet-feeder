var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/views'));
const utils = require('./utils');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
utils.initServer()

app.get('/', function (req, res) {
  res.render('home.ejs');
  console.log('Accueil demandé')
})

app.get('/portions', function (req, res) {
  res.render('portionselector.ejs');
})

app.get('/feedscheduler',function (req, res, next) {
	utils.getSchedules().then(((data) => {
		res.render('feedscheduler.ejs',{schedules : data})
	}))

})


app.get('/movesensorslog', function (req, res) {
	utils.getSensors().then(((data) => {
		res.render('movesensorslog.ejs',{ movements : data});
	}))
})


app.post('/feed', function(req, res) {
	utils.sendPortions(req,res).then(
		res.render('home.ejs')
	)

})


app.post('/delete_schedule', function(req, res) {
	utils.removeSchedule(req,res).then(
		res.redirect('/feedscheduler')
	)

})

app.post('/add_schedule', function(req, res) {
	utils.addSchedule(req,res).then(
		res.redirect('/feedscheduler')
	)

})

let port = 4000
app.listen(port, function () {
  console.log("Petfeeder is accessible at http://localhost:"+port+" !");
});

