const express = require('express')

const app = express()

app.get('/', function (req, res) {
  res.send('<html><body><img src="https://shechive.files.wordpress.com/2012/02/a-kitty-cat-7.jpg"/></body></html>')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

console.log()