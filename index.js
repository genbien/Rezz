// express and handlebars template
const express = require('express')
const exphbs = require('express-handlebars')

// promises, promises
const { t, q } = require('./utils.js');

// token
const parisToken = require('./token.js');

// redis
const redis  = require("redis");
const client = redis.createClient();

// requests
var request = require('request');

// END INCLUDES ----------------------------------------------------------------


client.on('error', function (err) {
	console.log('Error ' + err)
})

const app = express()

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
	 res.sendFile(path.join(__dirname+'/login .html'));
})

app.get('/login', function (req, res) {
	Promise.all([
		q(client, 'get', 'usrmessage'),
		q(client, 'get', 'usrname'),
	])
	.then(function (values) {
		const [usrmessage, usrname] = values;
		res.render('index', { usrmessage, usrname });
		get13_1();
		// get_qotd(); // commented for call rate lowness
	})
	.catch(function (err) {
		res.render('error');
	});
})

// app.get('/', function (req, res) {
// 	Promise.all([
// 		q(client, 'get', 'usrmessage'),
// 		q(client, 'get', 'usrname'),
// 	])
// 	.then(function (values) {
// 		const [usrmessage, usrname] = values;
// 		res.render('index', { usrmessage, usrname });
// 		get13_1();
// 		// get_qotd(); // commented for call rate lowness
// 	})
// 	.catch(function (err) {
// 		res.render('error');
// 	});
// })


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

client.keys('*', function (err, keys) {
	if (err) return console.log(err);

	for(var i = 0, len = keys.length; i < len; i++) {
		console.log(keys[i]);
	}
});

// GET QOTD INFOS --------------------------------------------------------------

// Commented bacause call rate is 10 calls per day :/

// function get_qotd() {
// 	request('http://api.theysaidso.com/qod.json', function (error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			var info = JSON.parse(body);
// 			// console.log(body);
// 			console.log(info.contents.quotes[0].quote);
// 			console.log(info.contents.quotes[0].author);
// 			const quote = info.contents.quotes[0].quote;
// 			const author = info.contents.quotes[0].author;
// 		}
// 		else {
// 			console.log(error);
// 		}
// 	});
// }

// END QOTD INFOS --------------------------------------------------------------

// GET RER INFOS ---------------------------------------------------------------

// get hours for metro line 13, station Montparnasse Bienvenue, direction Châtillon-Montrouge
function get13_1() {
	request('https://api-ratp.pierre-grimaud.fr/v2/metros/13/stations/152?destination=33', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			// console.log(body);
			console.log('Line:', info.response.informations.type, info.response.informations.line + '. Direction:', info.response.schedules[0].destination + '. Next in:', info.response.schedules[0].message + ',', info.response.schedules[1].message +'.');
			const type13_1 = info.response.informations.type;
			const line13_1 = info.response.informations.line;
			const dest13_1 = info.response.schedules[0].destination;
			const time13_1 = info.response.schedules[0].message;
			const timebis13_1 = info.response.schedules[1].message;
			res.render('index', { type13_1, line13_1, dest13_1, time13_1, timebis13_1 });
		}
		else {
			console.log(error);
		}
	});
}

// get hours for metro line 13, station Montparnasse Bienvenue, direction Asnières-Gennevilliers Les Courtilles - Saint-Denis-Université
request('https://api-ratp.pierre-grimaud.fr/v2/metros/13/stations/152?destination=32', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		// console.log(body);
		console.log('Line:', info.response.informations.type, info.response.informations.line + '. Direction:', info.response.schedules[0].destination + '. Next in:', info.response.schedules[0].message + ',', info.response.schedules[1].message +'.');
	}
	else {
		console.log(error);
	}
})

// get hours for rer line B, station Port Royal, direction Robinson Saint-Rémy-lès-Chevreuse
request('https://api-ratp.pierre-grimaud.fr/v2/rers/B/stations/62?destination=3', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		// console.log(body);
		console.log('Line:', info.response.informations.type, info.response.informations.line + '. Direction:', info.response.informations.destination.name + '. Next at:', info.response.schedules[0].message + ',', info.response.schedules[1].message + '.');
	}
	else {
		console.log(error);
	}
})

// get hours for rer line B, station Port Royal, direction Charles-de-Gaulle Mitry-Claye
request('https://api-ratp.pierre-grimaud.fr/v2/rers/B/stations/62?destination=4', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		// console.log(body);
		console.log('Line:', info.response.informations.type, info.response.informations.line + '. Direction:', info.response.informations.destination.name + '. Next at:', info.response.schedules[0].message + ',', info.response.schedules[1].message + '.');
	}
	else {
		console.log(error);
	}
})

// get hours for bus line 38, station Val de Grace, direction Porte D Orleans
request('https://api-ratp.pierre-grimaud.fr/v2/bus/38/stations/2766?destination=70', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		// console.log(body);
		console.log('Line:', info.response.informations.type, info.response.informations.line + '. Direction:', info.response.schedules[0].destination + '. Next in:', info.response.schedules[0].message + ',', info.response.schedules[1].message + '.');
	}
	else {
		console.log(error);
	}
})

// get hours for bus line 38, station Val de Grace, direction Gare du Nord
request('https://api-ratp.pierre-grimaud.fr/v2/bus/38/stations/2766?destination=183', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		console.log('Line:', info.response.informations.type, info.response.informations.line + '. Direction:', info.response.schedules[0].destination + '. Next in:', info.response.schedules[0].message + ',', info.response.schedules[1].message +'.');
	}
	else {
		console.log(error);
	}
})


// END RER INFOS ---------------------------------------------------------------

// GET EVENTS ------------------------------------------------------------------

request('https://api.paris.fr/api/data/1.0/Equipements/get_categories/?token=' + parisToken, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var info = JSON.parse(body);
		console.log(body);
	}
	else {
		console.log(error);
	}
})

// END EVENTS ------------------------------------------------------------------

// FIND OTHER FILES ------------------------------------------------------------

app.use(express.static('public'));

// END -------------------------------------------------------------------------