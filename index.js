// express and handlebars template
const express = require('express')
const exphbs = require('express-handlebars')

// promises, promises
const { t, q } = require('./utils.js');

// redis
const redis  = require("redis");
const client = redis.createClient();


client.on('error', function (err) {
	console.log('Error ' + err)
})

const app = express()

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// app.set('view engine', 'pug')

app.get('/', function (req, res) {
	Promise.all([
		q(client, 'get', 'name:first'),
		q(client, 'get', 'name:last'),
	])
	.then(function (values) {
		const [firstname, lastname] = values;
		res.render('index', { firstname, lastname });
	})
	.catch(function (err) {
		res.render('error');
	});
})



app.get('/form.js', function (req, res) {
	const { firstname, lastname } = req.query;

	Promise.all([
		q(client, 'set', 'name:first', firstname),
		q(client, 'set', 'name:last', lastname),
	])
	.then(function (reply) {
		console.log('redis replied', reply);
		res.render('index', { firstname, lastname });
	})
	.catch(function (err) {
		res.render('error');
	});
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
	console.log('Example app listening on port 3000!')
})

app.get('/secret-patch', function (req, res) {

	client.set("Genevieve", "I'm having a party tonight, if you think there's too much noise, well too bad :P", redis.print);
	client.get('Genevieve', function(err, reply) {
		res.json(reply);
	});
});


app.get('metro.png', function (req, res) {
	res.sendFile('metro.png')
});