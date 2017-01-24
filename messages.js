const express = require('express');
const bodyParser = require('body-parser');

// // promises, promises
const { t, q } = require('./utils.js');

// redis
const redis = require("redis");

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redisClient = redis.createClient({ url: REDIS_URL });

function keyToId(key) {
	return parseInt(key.split(':')[1]);
}

function idToKey(id) {
	return `msg:${id}`;
}

function inputToString(username, message, date) {
	const data = `${username}:${message}:${date}`;
}

function stringToInput(value) {
	const matches = /^([^:]+):(.+?):([^:]+)$/.exec(value);
	const [_, username, message, date] = matches;
	return { username, message, date };
}


function getDate() {
	let d = new Date();
	return d.getDate() +'/'+ (parseInt(d.getMonth()) + 1) +'/'+ d.getFullYear();
}

function get_messages() {
	let keys;

	return q(redisClient, 'keys', 'msg:*')
		.then(function(unsortedKeys) {
			keys = unsortedKeys.sort(function(a, b) {
				return keyToId(a) - keyToId(b);
			})
			return Promise.all(keys.map(function (key) {
				return q(redisClient, 'get', key);
			}))
		})
		.then(function(values) {
			return values.map(function (value, idx) {
				const id = keyToId(keys[idx]);
				const { username, message, date } = stringToInput(value);
				return { id, username, message, date };
			})
		});
}

// function del_message(id) {
// 	return q(redisClient, 'del', `msg:${id}`)
// 		.then(function(key) {
// 			let d = new Date();
// 			let date = d.getDate()+'/'+ (parseInt(d.getMonth()) + 1) +'/'+d.getFullYear();
// 			return q(redisClient, 'set', 'msg:'+key, username+':'+message+':'+date);
// 		});
// }

function add_message(username, message) {
	return q(redisClient, 'incr', 'key:msg')
		.then(function(key) {
			const data = inputToString(username, message, getDate());
			return q(redisClient, 'set', `msg:${key}`, data);
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
