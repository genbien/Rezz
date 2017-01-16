const express = require('express')

const app = express()

app.get('/', function (req, res) {
	res.sendFile('index.html', {root: __dirname })
})

app.get('/secret.jpg', function (req, res) {
  res.send('hello');
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
})
