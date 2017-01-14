const express = require('express')

const app = express()

app.get('/', function (req, res) {
  res.send('<html><body><img src="https://shechive.files.wordpress.com/2012/02/a-kitty-cat-7.jpg"/></body></html>')
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
})
