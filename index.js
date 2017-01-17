const express = require('express')
var redis  = require("redis"),
    client = redis.createClient();

client.on('error', function (err) {
  console.log('Error ' + err)
})


// const app = express()

// app.get('/', function (req, res) {
// 	res.sendFile('index.html', {root: __dirname })
// })

// app.get('/secret.jpg', function (req, res) {
// 	res.send('hello');
// })

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, function () {
// 	console.log('Example app listening on port 3000!')
// })

client.set("Genevieve", "I'm having a party tonight, if you think there's too much noise, well too bad :P", redis.print);

client.get('Genevieve', function(err, reply) {
    console.log(reply);
});