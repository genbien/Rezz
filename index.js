// // express and handlebars template
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

// // promises, promises
const { t, q } = require('./utils.js');

// // token
// // const parisToken = require('./token.js');


// // requests
// var request = require('request');

// // END INCLUDES ----------------------------------------------------------------


// // client.on('error', function (err) {
// // 	console.log('Error ' + err)
// // })

const app = express()
const messagesApp = require('./messages.js');
const ratpApp = require('./ratp.js');


app.engine('handlebars', exphbs({
	defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
	res.render('login');
});

app.get('/app', function (req, res) {
	res.render('index');
});

app.get('/app2', function (req, res) {

  Promise.all([
    messagesApp.get_messages(),
    ratpApp.get_my_ratp_infos()
  ])
    .then(function (values) {
      const [messages, schedules] = values;
      res.render('sammy', { layout: null, messages, schedules });
    })
    .catch(function (err) {
      console.log('Oh noes ! <3', err)
    });
});


app.use('/', messagesApp.app);
app.use('/', ratpApp.app);

// // GET QOTD INFOS --------------------------------------------------------------

// // Commented bacause call rate is 10 calls per day :/

// // function get_qotd() {
// // 	request('http://api.theysaidso.com/qod.json', function (error, response, body) {
// // 		if (!error && response.statusCode == 200) {
// // 			var info = JSON.parse(body);
// // 			// console.log(body);
// // 			console.log(info.contents.quotes[0].quote);
// // 			console.log(info.contents.quotes[0].author);
// // 			const quote = info.contents.quotes[0].quote;
// // 			const author = info.contents.quotes[0].author;
// // 		}
// // 		else {
// // 			console.log(error);
// // 		}
// // 	});
// // }

// // END QOTD INFOS --------------------------------------------------------------

// // GET EVENTS ------------------------------------------------------------------

// request('https://api.paris.fr/api/data/1.0/Equipements/get_categories/?token=' + parisToken, function (error, response, body) {
// 	if (!error && response.statusCode == 200) {
// 		var info = JSON.parse(body);
// 		console.log(body);
// 	}
// 	else {
// 		console.log(error);
// 	}
// })

// // END EVENTS ------------------------------------------------------------------

// FIND OTHER FILES ------------------------------------------------------------

app.use(express.static('public'));

// var favicon = require('serve-favicon');
// app.use(favicon('/favicon.ico'));
// app.use(express.favicon(path.join(__dirname, 'public','favicon.ico')));

// // END -------------------------------------------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
	console.log(`Example app listening on port ${PORT}!`);
});
