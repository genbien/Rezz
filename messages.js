const express = require('express');
const bodyParser = require('body-parser');

// // promises, promises
const { t, q } = require('./utils.js');

// redis
const redis = require("redis");

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redisClient = redis.createClient({ url: REDIS_URL });

function get_messages() {
	return q(redisClient, 'keys', 'msg:*')
		.then(function(keys) {
			const ids = keys.map(function(key) {
				return parseInt(key.split(':')[1]);
			}).sort();
			return Promise.all(ids.map(function (id) {
				return q(redisClient, 'get', 'msg:'+id);
			}))
		})
		.then(function(values) {
			return values.map(function (value) {
				const matches = /^([^:]*):(.*)$/.exec(value);
				const [_, username, message] = matches;
				return { username, message };
			})
		});
}

function add_message(username, message) {
	return q(redisClient, 'incr', 'key:msg')
		.then(function(key) {
			let d = new Date();
			let date = d.getDate()+'/'+ (parseInt(d.getMonth()) + 1) +'/'+d.getFullYear();
			return q(redisClient, 'set', 'msg:'+key, username+':'+message+':'+date);
		});
}


app = express();

app.post('/', bodyParser.urlencoded(), function (req, res) {
	if (!req.body.username || !req.body.message)
		return res.redirect('/app/messages');

	add_message(req.body.username, req.body.message) //!!
		.then(function(messages) {
			res.redirect('/app/messages');
		})
		.catch(function() {
			res.render('error');
		})
});

app.get('/', function (req, res) {
	get_messages()
		.then(function(messages) {
			res.render('app/messages', { messages });
		})
		.catch(function() {
			res.render('error');
		})
});

module.exports = app;
