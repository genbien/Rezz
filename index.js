// express and handlebars template
const express = require('express')
const exphbs = require('express-handlebars')

// promises, promises
const { t, q } = require('./utils.js');

// redis
const redis  = require("redis");
const client = redis.createClient();

// requests
var request = require('request');


client.on('error', function (err) {
	console.log('Error ' + err)
})

const app = express()

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// app.set('view engine', 'pug')

app.get('/', function (req, res) {
	Promise.all([
		q(client, 'get', 'usrmessage'),
		q(client, 'get', 'usrname'),
	])
	.then(function (values) {
		const [usrmessage, usrname] = values;
		res.render('index', { usrmessage, usrname });
	})
	.catch(function (err) {
		res.render('error');
	});
})



app.get('/message', function (req, res) {
	const { usrmessage, usrname } = req.query;

	Promise.all([
		q(client, 'set', 'usrmessage', usrmessage),
		q(client, 'set', 'usrname', usrname),
	])
	.then(function (reply) {
		console.log('redis replied', reply);
		res.render('index', { usrmessage, usrname });
	})
	.catch(function (err) {
		res.render('error');
	});
	// q(client, 'keys', '*')
	// 	.then(function(replies) {
	// 		// so something with replies
	// 	})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
	console.log('Example app listening on port 3000!')
})

// app.get('/secret-patch', function (req, res) {

// 	client.set("Genevieve", "I'm having a party tonight, if you think there's too much noise, well too bad :P", redis.print);
// 	client.get('Genevieve', function(err, reply) {
// 		res.json(reply);
// 	});
// });

client.keys('*', function (err, keys) {
	if (err) return console.log(err);

	for(var i = 0, len = keys.length; i < len; i++) {
		console.log(keys[i]);
	}
});

// GET QOTD INFOS --------------------------------------------------------------

// who knows if this works because the api call rate is SO LOW
// request('http://api.theysaidso.com/qod.json', function (error, response, body) {
// 	if (!error && response.statusCode == 200) {
// 		var quote = body.contents.quotes[0]['quote'];
// 		var author = body.contents.quotes[0]['author'];

// 		console.log('"' + quote + '" -- ' + author);

// 		// var info = JSON.parse(body);
// 		// console.log(body);
// 		// console.log([info['contents']['quotes'][0]['quote'], info['contents']['quotes'][0]['author']]);
// 	}
// 	else {
// 		console.log(error);
// 	}
// })

// END QOTD INFOS --------------------------------------------------------------


// GET RER INFOS ---------------------------------------------------------------

// get hours for metro line 13, station Montparnasse Bienvenue, direction Châtillon-Montrouge
request('https://api-ratp.pierre-grimaud.fr/v2/metros/13/stations/152?destination=33', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		console.log(body);
	}
	else {
		console.log(error);
	}
})

// get hours for metro line 13, station Montparnasse Bienvenue, direction Asnières-Gennevilliers Les Courtilles - Saint-Denis-Université
request('https://api-ratp.pierre-grimaud.fr/v2/metros/13/stations/152?destination=32', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		console.log(body);
	}
	else {
		console.log(error);
	}
})

// get hours for rer line B, station Port Royal, direction Robinson Saint-Rémy-lès-Chevreuse
request('https://api-ratp.pierre-grimaud.fr/v2/rers/B/stations/62?destination=3', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		console.log(body);
	}
	else {
		console.log(error);
	}
})

// get hours for rer line B, station Port Royal, direction Charles-de-Gaulle Mitry-Claye
request('https://api-ratp.pierre-grimaud.fr/v2/rers/B/stations/62?destination=4', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		console.log(body);
	}
	else {
		console.log(error);
	}
})

// END RER INFOS ---------------------------------------------------------------

// app.get('/metro.png', function (req, res) {
// 	res.sendFile('/Users/Genevieve/Desktop/node_experiment/metro.png')
// });

app.use(express.static('public'));